// Prepare a blind comparison for immersive evals.
// Usage: node evals/tools/immersive-blind.mjs evals/iteration-N [--judges a,b] [--configs with_skill,without_skill] [--skip-check]
//   1. runs skills/immersive-web/scripts/immersive-check.mjs on every <case>/<config>/outputs/index.html
//      -> <run>/immersive.json and <run>/screens/*.png
//   2. for each judge makes <iteration>/blind-<judge>/<case>/{X,Y}/ with the same screenshots and a facts.txt,
//      X and Y assigned at random per judge, and writes the answer key to <iteration>/blind-<judge>_key.json
import { execFileSync } from "node:child_process";
import { readdirSync, existsSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, 2)[1] : d; };
const judges = opt("--judges", "a,b").split(","), configs = opt("--configs", "with_skill,without_skill").split(",");
const skip = args.includes("--skip-check"); if (skip) args.splice(args.indexOf("--skip-check"), 1);
const root = resolve(args[0]);
const CHECK = resolve("skills/immersive-web/scripts/immersive-check.mjs");
const SHOTS = ["desktop-0-top", "desktop-2-scroll-50", "desktop-4-scroll-100", "phone-0-top", "phone-1-middle", "phone-2-end", "reduced-0-top", "nowebgl-0-top", "nojs-0-top"];
const cases = readdirSync(root).filter((d) => existsSync(join(root, d, "eval_metadata.json")));

for (const c of cases) for (const cfg of configs) {
  const run = join(root, c, cfg), page = join(run, "outputs", "index.html");
  if (!existsSync(page)) { console.log("missing", page); continue; }
  if (skip && existsSync(join(run, "immersive.json"))) continue;
  console.log("checking", c, cfg);
  const extra = JSON.parse(readFileSync(join(root, c, "eval_metadata.json"), "utf8")).check_args || [];   // e.g. ["--app"] for an app window
  try { execFileSync("node", [CHECK, page, "--out", join(run, "screens"), "--json", join(run, "immersive.json"), ...extra], { stdio: "pipe", timeout: 260000 }); }
  catch (e) { console.log("  check failed:", String(e.stdout || e.message).slice(-300)); }
}

const facts = (run) => {
  const p = join(run, "immersive.json"); if (!existsSync(p)) return "The measuring script could not complete on this page.\n";
  const r = JSON.parse(readFileSync(p, "utf8")), w = r.passes.desktop.weight;
  return [`Measured by a script (the same for both pages). Frame rate was not measured.`, ``, `Measured score: ${r.score}/100`,
    ...r.checks.map((k) => `${k.ok === null ? "n/a " : k.ok ? "PASS" : "FAIL"}  ${k.name}: ${k.detail}`), ``,
    `Page weight: ${w.totalKB} KB (script ${w.scriptKB} KB, images ${w.imageKB} KB). Page length: ${r.passes.desktop.facts.pageScreens} screens.`, ``, `Notes:`, ...r.notes.map((n) => "- " + n), ``].join("\n");
};

for (const j of judges) {
  const dir = join(root, "blind-" + j), key = {};
  rmSync(dir, { recursive: true, force: true });
  for (const c of cases) {
    const flip = Math.random() < 0.5, map = { X: configs[flip ? 1 : 0], Y: configs[flip ? 0 : 1] }; key[c] = map;
    for (const [label, cfg] of Object.entries(map)) {
      const out = join(dir, c, label), run = join(root, c, cfg); mkdirSync(out, { recursive: true });
      for (const s of SHOTS) { const src = join(run, "screens", s + ".png"); if (existsSync(src)) copyFileSync(src, join(out, s + ".png")); }
      writeFileSync(join(out, "facts.txt"), facts(run));
    }
    writeFileSync(join(dir, c, "request.txt"), JSON.parse(readFileSync(join(root, c, "eval_metadata.json"), "utf8")).prompt + "\n");
  }
  writeFileSync(join(root, `blind-${j}_key.json`), JSON.stringify(key, null, 1) + "\n");
  console.log("blind set for judge", j, "->", dir);
}
