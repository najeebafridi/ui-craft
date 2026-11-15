// Build the ui-craft direction library and the default tokens.css.
// Each direction = colours from scripts/palette.mjs (contrast-solved) + type, shape, depth, density and motion tokens.
// Run after changing a direction:   node tools/build-directions.mjs
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generate, toCss, oklch } from "../skills/ui-craft/scripts/palette-core.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "skills/ui-craft/assets");
mkdirSync(join(OUT, "directions"), { recursive: true });

import { SYS, MONO, DEPTH, DIRECTIONS, fontsUrl, nonColour } from "./directions-data.mjs";

const index = [];
for (const d of DIRECTIONS) {
  const accentHex = oklch(...d.accent);
  const res = generate({ accent: accentHex, neutral: String(d.neutral), tint: d.tint, secondary: d.secondary ? oklch(...d.secondary) : null, name: d.name });
  const bad = res.report.filter((r) => !r.ok);
  if (bad.length) { console.error(`CONTRAST FAIL in ${d.slug}:`, bad); process.exitCode = 1; }
  const neutralFlag = d.neutral === "brand" ? "brand" : d.neutral;
  const header = `/* ui-craft direction: ${d.name}
   For:        ${d.for}
   Feeling:    ${d.feeling}
   Signature:  ${d.signature}
   Type:       ${d.type}
   Shape:      ${d.shape}
   Imagery:    ${d.imagery}
   Voice:      ${d.voice}
   Watch out:  ${d.watch}
   Default:    ${d.theme} theme${d.theme === "dark" ? ' (set <html data-theme="dark">; the light theme below also works)' : " (a dark theme is included)"}
   Fonts:      <link rel="stylesheet" href="${fontsUrl(d.gf)}">   (all SIL Open Font License)
   Own brand colour? Keep this direction and swap the colour:
               node scripts/palette.mjs --accent "#YOURHEX" --neutral ${neutralFlag} --tint ${d.tint}${d.altAccents ? `\n   Other accents that suit it: ${d.altAccents}` : ""}
   Load after tokens.css. */\n`;
  const css = toCss(res, nonColour(d)).replace(/^\/\*[\s\S]*?\*\/\n/, header);
  writeFileSync(join(OUT, "directions", `${d.slug}.css`), css);
  index.push({ slug: d.slug, name: d.name, theme: d.theme, for: d.for, feeling: d.feeling, signature: d.signature, accent: res.light.accent, bg: d.theme === "dark" ? res.dark.bg : res.light.bg, fonts: d.fonts, radius: d.radius, depth: d.depth, motion: d.motion, notes: res.notes });
}
writeFileSync(join(OUT, "directions", "index.json"), JSON.stringify(index, null, 2) + "\n");

// ---- tokens.css: the base every direction builds on (default colours = Calm productivity) ----
const base = DIRECTIONS[0];
const baseRes = generate({ accent: oklch(...base.accent), neutral: String(base.neutral), tint: base.tint, name: "ui-craft base" });
const baseExtra = `
  /* ---- Type ---- */
  --font-sans: "Inter", ${SYS};
  --font-display: var(--font-sans);
  --font-mono: ${MONO};
  --text-xs: 12px;  --text-sm: 14px;  --text-md: 16px;  --text-lg: 18px;  --text-xl: 20px;
  --text-2xl: 24px; --text-3xl: 30px; --text-4xl: 36px; --text-5xl: 48px; --text-6xl: 60px;
  --text-body: 16px;                    /* 14px in dense desktop tools */
  --leading-tight: 1.15;  --leading-snug: 1.3;  --leading-normal: 1.5;
  --tracking-display: -0.025em;         /* 36px and up */
  --tracking-heading: -0.015em;         /* 20-30px */
  --tracking-caps: 0.06em;              /* small all-caps labels */
  --weight-regular: 400;  --weight-medium: 500;  --weight-semibold: 600;  --weight-display: 600;

  /* ---- Spacing (4px base) ---- */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-5: 24px;  --space-6: 32px;  --space-7: 48px;  --space-8: 64px;  --space-9: 96px;
  --space-section: 48px;

  /* ---- Shape: one family. Nested radius = outer radius minus the padding between. ---- */
  --radius-sm: 6px;  --radius: 8px;  --radius-lg: 12px;  --radius-full: 9999px;  --border-w: 1px;

  /* ---- Depth: one light source from above; shadows are layered and tinted, never one grey blur. ---- */
  --shadow-raised: ${DEPTH.soft.raised};
  --shadow-overlay: ${DEPTH.soft.overlay};
  --shadow-button: ${DEPTH.soft.button};

  /* ---- Motion ---- */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);      /* entering, and most UI */
  --ease-in: cubic-bezier(0.64, 0, 0.78, 0);       /* leaving */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* moving on screen */
  --ease-spring: linear(0, 0.074, 0.234, 0.415, 0.584, 0.723, 0.83, 0.906, 0.956, 0.988, 1.005, 1.013, 1.015, 1.014, 1.012, 1.009, 1.007, 1.004, 1); /* slight overshoot; use with 550ms on transform only */
  --dur-fast: 120ms;  --dur-base: 200ms;  --dur-slow: 300ms;  --press-scale: 0.97;

  /* ---- Sizes ---- */
  --control-h: 40px;       /* buttons, inputs (32-36 compact, 44+ touch) */
  --row-h: 40px;           /* table rows (36 compact, 44+ touch) */
  --sidebar-w: 248px;  --content-max: 1280px;  --reading-max: 68ch;
`;
const baseCss = toCss(baseRes, baseExtra).replace(/^\/\*[\s\S]*?\*\/\n/, `/* ui-craft tokens v2: the base every screen starts from. Generated by tools/build-directions.mjs.
   Colours here are the "Calm productivity" direction. To change the look, load one file from assets/directions/ after this one,
   or build a theme from a brand colour:  node scripts/palette.mjs --accent "#HEX"
   Text passes WCAG 2.2 AA (4.5:1) on --bg, --surface and --surface-2; --border-strong, --focus and chart colours pass 3:1.
   Theme follows the OS; force it with <html data-theme="light|dark">. */\n`) + `
/* ---- Base: small details that make everything feel finished ---- */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font: var(--weight-regular) var(--text-body)/var(--leading-normal) var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-optical-sizing: auto;
}
h1, h2, h3, h4 { margin: 0; font-family: var(--font-display); font-weight: var(--weight-display); line-height: var(--leading-tight); letter-spacing: var(--tracking-heading); text-wrap: balance; }
h1 { letter-spacing: var(--tracking-display); }
p { margin: 0; text-wrap: pretty; }
img, video { max-width: 100%; height: auto; }
::selection { background: color-mix(in oklab, var(--accent) 24%, transparent); }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }   /* outline survives Windows high-contrast mode */
input, textarea, select { caret-color: var(--accent); font: inherit; }
button { font: inherit; }
.num { font-variant-numeric: tabular-nums; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
writeFileSync(join(OUT, "tokens.css"), baseCss);
console.log(`Built tokens.css and ${DIRECTIONS.length} directions:`);
for (const i of index) console.log(`  ${i.slug.padEnd(18)} accent ${i.accent}  ${i.theme.padEnd(5)}  ${i.notes.length ? "notes: " + i.notes.length : ""}`);

// ---- gallery.html: every direction on one page, for choosing with a client and for visual QA ----
const allFonts = [...new Map(DIRECTIONS.flatMap((d) => d.gf).map((f) => [f[0], f])).values()];
const block = (t) => Object.entries(t).map(([k, v]) => `--${k}:${v}`).join(";");
const scoped = DIRECTIONS.map((d, i) => {
  const res = generate({ accent: oklch(...d.accent), neutral: String(d.neutral), tint: d.tint, secondary: d.secondary ? oklch(...d.secondary) : null });
  const extra = nonColour(d).split("\n").filter((l) => l.trim().startsWith("--")).join("");
  return `.d-${d.slug}{${block(res.light)};${extra}}\n.d-${d.slug}.dark{${block(res.dark)}}`;
}).join("\n");
const cards = DIRECTIONS.map((d) => `
  <article class="dir d-${d.slug}${d.theme === "dark" ? " dark" : ""}" data-default="${d.theme}">
    <header><p class="eyebrow">${d.slug}.css</p><h2>${d.name}</h2><p class="for">${d.for}</p></header>
    <div class="demo">
      <h3>${d.feeling}</h3>
      <p class="body">${d.signature}</p>
      <div class="row"><button class="btn primary">Continue</button><button class="btn">Not now</button><span class="badge ok">Paid</span><span class="badge bad">Overdue</span></div>
      <label class="field"><span>Email</span><input value="amara@northwind.studio" aria-label="Email"></label>
      <div class="tile"><div><p class="k">Revenue this month</p><p class="v num">$48,210.50</p><p class="d">▲ 8.2% vs October</p></div>
        <div class="sw">${[1, 2, 3, 4, 5, 6].map((n) => `<i style="background:var(--chart-${n})"></i>`).join("")}</div></div>
    </div>
    <footer>${d.fonts.display}${d.fonts.sans !== d.fonts.display ? " + " + d.fonts.sans : ""} · radius ${d.radius[1]}px · ${d.depth} depth · ${d.motion} motion</footer>
  </article>`).join("\n");
writeFileSync(join(OUT, "directions", "gallery.html"), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>ui-craft directions</title>
<!-- Generated by tools/build-directions.mjs. Open in a browser to compare the visual directions. -->
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fontsUrl(allFonts)}">
<style>
/* base tokens (same as ../tokens.css), inlined so this file works on its own */
${baseCss.slice(baseCss.indexOf(":root {"))}
body{background:#F3F4F6;color:#111827;font:14px/1.5 ui-sans-serif,system-ui,sans-serif}
.top{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center;padding:24px 32px 8px}
.top h1{font:600 24px/1.2 ui-sans-serif,system-ui,sans-serif;letter-spacing:-0.02em}
.top p{color:#4B5563;max-width:70ch}
.top button{height:40px;padding:0 16px;border-radius:8px;border:1px solid #6B7280;background:#fff;color:#111827;font:500 14px ui-sans-serif,system-ui,sans-serif;cursor:pointer}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,400px),1fr));gap:24px;padding:24px 32px 64px}
.dir{background:var(--bg);color:var(--text);border-radius:16px;overflow:hidden;box-shadow:0 0 0 1px rgb(0 0 0/.08),0 8px 24px rgb(0 0 0/.06);display:flex;flex-direction:column;font:var(--weight-regular) var(--text-body)/1.5 var(--font-sans)}
.dir header{padding:24px 24px 0}
.dir .eyebrow{font:500 12px var(--font-mono);color:var(--text-subtle)}
.dir h2{font-family:var(--font-display);font-weight:var(--weight-display);font-size:30px;letter-spacing:var(--tracking-display);line-height:1.15;margin-top:4px}
.dir .for{color:var(--text-muted);font-size:14px;margin-top:8px}
.demo{margin:24px;padding:24px;background:var(--surface);border-radius:var(--radius-lg);box-shadow:var(--shadow-raised);border:var(--border-w) solid var(--border);display:flex;flex-direction:column;gap:16px}
.demo h3{font-family:var(--font-display);font-weight:var(--weight-display);font-size:20px;letter-spacing:var(--tracking-heading);line-height:1.25}
.demo .body{color:var(--text-muted);font-size:14px}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.btn{height:var(--control-h);padding:0 16px;border-radius:var(--radius);border:var(--border-w) solid var(--border-strong);background:var(--surface);color:var(--text);font:500 14px var(--font-sans);cursor:pointer;transition:transform var(--dur-fast) var(--ease-out),background-color var(--dur-fast)}
.btn.primary{background:var(--accent);color:var(--accent-fg);border-color:transparent;box-shadow:var(--shadow-button)}
.btn.primary:hover{background:var(--accent-hover)}
.btn:active{transform:scale(var(--press-scale))}
.badge{font-size:12px;font-weight:500;padding:4px 8px;border-radius:var(--radius-sm)}
.badge.ok{background:var(--success-soft);color:var(--success-text)} .badge.bad{background:var(--danger-soft);color:var(--danger-text)}
.field{display:flex;flex-direction:column;gap:4px;font-size:14px;font-weight:500}
.field input{height:var(--control-h);padding:0 12px;border-radius:var(--radius);border:var(--border-w) solid var(--border-strong);background:var(--surface);color:var(--text);font:400 16px var(--font-sans)}
.tile{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;padding:16px;background:var(--surface-2);border-radius:var(--radius)}
.tile .k{font-size:12px;color:var(--text-muted)} .tile .v{font-family:var(--font-display);font-weight:var(--weight-display);font-size:24px;letter-spacing:var(--tracking-heading)} .tile .d{font-size:12px;color:var(--success-text)}
.sw{display:flex;gap:4px} .sw i{width:12px;height:32px;border-radius:2px;display:block}
.dir footer{margin-top:auto;padding:0 24px 24px;font-size:12px;color:var(--text-subtle)}
@media (max-width:640px),(pointer:coarse){.btn,.field input,.top button{min-height:44px}.top,.grid{padding-left:16px;padding-right:16px}}
${scoped}
</style></head>
<body>
<div class="top"><div><h1>ui-craft directions</h1><p>Sixteen visual directions. Each is a small theme file in this folder: colours (contrast-checked, light and dark), fonts, shape, depth and motion. Pick the one that fits the audience, then swap in the brand colour.</p></div>
<button type="button" id="flip">Show the other theme</button></div>
<main class="grid">${cards}
</main>
<script>document.getElementById("flip").onclick=()=>document.querySelectorAll(".dir").forEach(d=>d.classList.toggle("dark"));</script>
</body></html>
`);
console.log("Built directions/gallery.html");

// ---- keep the mockup template's inline tokens identical to tokens.css ----
const tplPath = join(OUT, "mockup-template.html");
const tpl = readFileSync(tplPath, "utf8");
const startMark = tpl.indexOf("/* tokens:start"), endMark = tpl.indexOf("/* tokens:end */");
if (startMark < 0 || endMark < 0) throw new Error("token markers missing in mockup-template.html");
const afterStart = tpl.indexOf("\n", startMark) + 1;
const tokensOnly = baseCss.slice(baseCss.indexOf("*/\n") + 3);
writeFileSync(tplPath, tpl.slice(0, afterStart) + tokensOnly + tpl.slice(endMark));
console.log("Synced tokens into mockup-template.html");
