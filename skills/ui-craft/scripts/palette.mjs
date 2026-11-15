#!/usr/bin/env node
// ui-craft palette: turn one brand colour into a complete, accessible light + dark colour system.
//
// Usage:
//   node palette.mjs --accent "#0F766E"                      print CSS tokens for a theme built on this colour
//        [--neutral brand|cool|warm|pure|<hue 0-360>]        temperature of the greys (default: brand = tinted toward the accent)
//        [--tint 0|1|2|3]                                    how much colour the greys carry (default 2; 0 = pure grey)
//        [--secondary "#hex"]                                optional second brand colour
//        [--name "Clinic"]  [--out theme.css]  [--json]
//
// Why: colours are built in OKLCH (perceptually even), and every text, border and status colour is
// SOLVED to pass WCAG 2.2 contrast (4.5:1 text, 3:1 UI parts) on the surfaces it sits on, in both themes.
// Token names match assets/tokens.css, so the output is a drop-in theme: load it after tokens.css.
// No npm packages.
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { generate, toCss } from "./palette-core.mjs";
export * from "./palette-core.mjs";

// ---------- CLI ----------
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const argv = process.argv.slice(2);
  const opt = (n, d = null) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  if (!opt("--accent")) { console.log('Usage: node palette.mjs --accent "#0F766E" [--neutral brand|cool|warm|pure|<hue>] [--tint 0-3] [--secondary "#hex"] [--name "Name"] [--out theme.css] [--json]'); process.exit(1); }
  const res = generate({ accent: opt("--accent"), neutral: opt("--neutral", "brand"), tint: opt("--tint", 2), secondary: opt("--secondary"), name: opt("--name", "Custom") });
  const out = argv.includes("--json") ? JSON.stringify(res, null, 2) : toCss(res);
  if (opt("--out")) { writeFileSync(opt("--out"), out); console.error(`Wrote ${opt("--out")}`); } else console.log(out);
  const bad = res.report.filter((r) => !r.ok);
  res.notes.forEach((n) => console.error("Note: " + n));
  console.error(bad.length ? "CONTRAST PROBLEMS:\n" + bad.map((b) => `  ${b.theme}: ${b.pair} = ${b.ratio} (needs ${b.min})`).join("\n") : `All ${res.report.length} contrast pairs pass (light and dark).`);
}
