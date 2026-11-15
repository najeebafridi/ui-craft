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

// ---------- colour maths (sRGB <-> OKLab/OKLCH, Björn Ottosson's matrices) ----------
const toLin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGam = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

export function hexToRgb(hex) {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Not a hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}
export const rgbToHex = (rgb) => "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();

function oklchToLinear(L, C, H) {
  const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
const inGamut = (rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);

/** OKLCH -> sRGB hex. If the colour is outside sRGB, chroma is reduced until it fits (hue and lightness kept). */
export function oklch(L, C, H) {
  L = Math.min(1, Math.max(0, L));
  let lin = oklchToLinear(L, C, H);
  if (!inGamut(lin)) {
    let lo = 0, hi = C;
    for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (inGamut(oklchToLinear(L, mid, H))) lo = mid; else hi = mid; }
    lin = oklchToLinear(L, lo, H);
  }
  return rgbToHex(lin.map((v) => toGam(Math.min(1, Math.max(0, v)))));
}

export function hexToOklch(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(a, bb), H: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 };
}

const lum = (hex) => { const [r, g, b] = hexToRgb(hex).map(toLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
/** WCAG 2.x contrast ratio between two hex colours. */
export const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

/** Walk lightness from `from` in direction `dir` (-1 darker, +1 lighter) until the colour reaches `target` contrast on every surface in `on`. */
function solve(C, H, from, dir, target, on) {
  let hex = oklch(from, C, H), L = from;
  for (; L >= 0.03 && L <= 0.99; L += dir * 0.004) {
    hex = oklch(L, C, H);
    if (Math.min(...on.map((s) => contrast(hex, s))) >= target) break;
  }
  return hex;
}
const hueDist = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

// ---------- the generator ----------
const TINT = [0, 0.006, 0.012, 0.02];
const NEUTRAL_HUE = { cool: 255, warm: 75 };

export function generate({ accent, neutral = "brand", tint = 2, secondary = null, name = "Custom" } = {}) {
  if (!accent) throw new Error("accent colour is required");
  const A = hexToOklch(accent);
  const notes = [];
  let cn = TINT[Math.min(3, Math.max(0, +tint))];
  let Hn = A.H;
  if (neutral === "pure") cn = 0;
  else if (neutral in NEUTRAL_HUE) Hn = NEUTRAL_HUE[neutral];
  else if (neutral !== "brand" && !Number.isNaN(+neutral)) Hn = +neutral;
  if (A.C < 0.03 && neutral === "brand") { Hn = 255; notes.push("Accent is almost grey, so the neutrals use a cool tint. Pick --neutral warm or pure if you prefer."); }

  const ink = (L, k = 1) => oklch(L, Math.min(cn * k, 0.04), Hn);

  // Solid accent + text on it. Keep the brand colour when white text passes; darken a little if that is enough; else use dark text.
  function solid(base, surfaces, needVisible) {
    let L = base.L;
    if (needVisible) { // dark theme: a very dark brand colour would vanish on a dark surface
      while (L < 0.9 && Math.min(...surfaces.map((s) => contrast(oklch(L, base.C, base.H), s))) < 3) L += 0.01;
      if (L !== base.L) notes.push(`${needVisible}: accent lightened so buttons stay visible on dark surfaces.`);
    }
    let hex = oklch(L, base.C, base.H), fg = "#FFFFFF";
    if (contrast(hex, fg) < 4.5) {
      let L2 = L, hex2 = hex;
      while (L2 > L - 0.14 && contrast(hex2, "#FFFFFF") < 4.5) { L2 -= 0.005; hex2 = oklch(L2, base.C, base.H); }
      const stillVisible = !needVisible || Math.min(...surfaces.map((s) => contrast(hex2, s))) >= 3;
      if (contrast(hex2, "#FFFFFF") >= 4.5 && stillVisible) { hex = hex2; L = L2; notes.push(`Accent darkened slightly (${rgbToHex(hexToRgb(oklch(base.L, base.C, base.H)))} -> ${hex}) so white button text passes 4.5:1.`); }
      else { fg = oklch(0.2, 0.03, base.H); while (contrast(hex, fg) < 4.5 && L < 0.95) { L += 0.01; hex = oklch(L, base.C, base.H); } notes.push("Accent is light, so text on accent buttons is dark, not white."); }
    }
    let hover = oklch(L - 0.045, base.C, base.H);
    if (contrast(hover, fg) < 4.5) hover = oklch(L + 0.04, base.C, base.H);
    return { hex, fg, hover, L };
  }

  const STATUS = { success: [152, 0.14], warning: [65, 0.13], danger: [27, 0.19], info: [250, 0.16] };
  if (hueDist(A.H, 27) < 20 && A.C > 0.08) {
    STATUS.danger[0] = (A.H - 20 + 360) % 360; // move errors toward crimson, away from the brand hue
    notes.push("Brand colour is close to error red. Error colour was shifted toward crimson; also never use the solid brand colour for error states, and always pair errors with an icon and text.");
  }
  const CHART_OFFSETS = [0, 137.5, 275, 52.5, 190, 327.5];

  function theme(dark) {
    const t = {};
    if (!dark) {
      t.bg = ink(0.982, 0.7); t.surface = ink(0.998, 0.25); t["surface-2"] = ink(0.965, 1); t["surface-3"] = ink(0.93, 1.15);
      t.border = ink(0.915, 1.2);
      t["border-strong"] = solve(Math.min(cn * 2, 0.04), Hn, 0.7, -1, 3.05, [t.surface, t["surface-2"], t.bg]);
      t.text = ink(0.22, 2.2);
      t["text-muted"] = solve(Math.min(cn * 2, 0.04), Hn, 0.52, -1, 6.3, [t["surface-2"]]);
      t["text-subtle"] = solve(Math.min(cn * 2, 0.04), Hn, 0.6, -1, 4.6, [t["surface-2"], t.bg]);
    } else {
      t.bg = ink(0.155, 1.4); t.surface = ink(0.195, 1.4); t["surface-2"] = ink(0.235, 1.4); t["surface-3"] = ink(0.275, 1.4);
      t.border = ink(0.285, 1.5);
      t["border-strong"] = solve(Math.min(cn * 1.5, 0.03), Hn, 0.45, 1, 3.05, [t.surface, t["surface-2"], t["surface-3"]]);
      t.text = ink(0.93, 0.8);
      t["text-muted"] = solve(Math.min(cn, 0.02), Hn, 0.7, 1, 6.3, [t["surface-2"]]);
      t["text-subtle"] = solve(Math.min(cn, 0.02), Hn, 0.6, 1, 4.6, [t["surface-2"], t["surface-3"]]);
    }
    const tintOn = [t.surface, t["surface-2"]];
    const brand = (prefix, base) => {
      const s = solid(base, [t.surface], dark ? `Dark theme (${prefix})` : null);
      t[prefix] = s.hex; t[`${prefix}-hover`] = s.hover; t[`${prefix}-fg`] = s.fg;
      t[`${prefix}-soft`] = dark ? oklch(0.26, Math.min(base.C * 0.35, 0.07), base.H) : oklch(0.955, Math.min(base.C * 0.22, 0.035), base.H);
      t[`${prefix}-text`] = dark
        ? solve(Math.min(base.C * 0.75, 0.16), base.H, 0.72, 1, 4.6, [...tintOn, t[`${prefix}-soft`]])
        : solve(Math.min(base.C, 0.2), base.H, Math.min(base.L, 0.55), -1, 4.6, [...tintOn, t[`${prefix}-soft`]]);
    };
    brand("accent", A);
    if (secondary) brand("secondary", hexToOklch(secondary));
    t.focus = contrast(t.accent, t.surface) >= 3 && contrast(t.accent, t.bg) >= 3 ? t.accent : t["accent-text"];
    for (const [k, [H, C]] of Object.entries(STATUS)) {
      t[k] = dark ? solve(C * 0.9, H, 0.6, 1, 3.2, [t["surface-2"]]) : solve(C, H, 0.62, -1, 4.5, ["#FFFFFF", t.surface]);
      t[`${k}-soft`] = dark ? oklch(0.25, 0.045, H) : oklch(0.965, 0.025, H);
      t[`${k}-text`] = dark ? solve(C * 0.7, H, 0.75, 1, 4.6, [t[`${k}-soft`], t["surface-2"]]) : solve(C, H, 0.5, -1, 4.6, [t[`${k}-soft`], t.surface]);
    }
    // Chart colours: spread hues by the golden angle, alternate lightness so they also differ for colour-blind viewers.
    const chartL = dark ? [0.72, 0.8, 0.64, 0.84, 0.76, 0.68] : [0.55, 0.62, 0.47, 0.6, 0.52, 0.42];
    CHART_OFFSETS.forEach((off, i) => { t[`chart-${i + 1}`] = solve(Math.max(0.11, Math.min(A.C, 0.16)), (A.H + off) % 360, chartL[i], dark ? 1 : -1, 3.05, [t.surface]); });
    const sh = hexToRgb(oklch(dark ? 0.02 : 0.25, Math.min(cn * 3, 0.05), Hn)).map((v) => Math.round(v * 255));
    t["shadow-color"] = sh.join(" ");
    t["shadow-strength"] = dark ? "3" : "1";   // shadows need more weight to show on dark surfaces
    t.ring = dark ? "rgb(255 255 255 / 0.09)" : `rgb(${sh.join(" ")} / 0.08)`;          // 1px edge for cards and menus (decorative)
    t.highlight = dark ? "rgb(255 255 255 / 0.07)" : "rgb(255 255 255 / 0.18)";           // inner top edge on raised/solid controls
    return t;
  }

  const light = theme(false), dark = theme(true);

  // Verify every pair the tokens are meant for. Anything below target is reported loudly.
  const report = [];
  const check = (th, label, fg, bg, min) => { const r = contrast(th[fg] ?? fg, th[bg] ?? bg); report.push({ theme: label, pair: `${fg} on ${bg}`, ratio: +r.toFixed(2), min, ok: r >= min - 0.005 }); };
  for (const [label, th] of [["light", light], ["dark", dark]]) {
    for (const bg of ["bg", "surface", "surface-2"]) { check(th, label, "text", bg, 4.5); check(th, label, "text-muted", bg, 4.5); check(th, label, "text-subtle", bg, 4.5); check(th, label, "border-strong", bg, 3); }
    check(th, label, "accent-fg", "accent", 4.5); check(th, label, "accent-fg", "accent-hover", 4.5);
    check(th, label, "accent-text", "surface", 4.5); check(th, label, "accent-text", "accent-soft", 4.5); check(th, label, "focus", "surface", 3);
    if (secondary) { check(th, label, "secondary-fg", "secondary", 4.5); check(th, label, "secondary-text", "surface", 4.5); }
    for (const k of Object.keys(STATUS)) check(th, label, `${k}-text`, `${k}-soft`, 4.5);
    for (let i = 1; i <= 6; i++) check(th, label, `chart-${i}`, "surface", 3);
  }
  return { name, accent, light, dark, notes: [...new Set(notes)], report, neutral: { hue: Math.round(Hn), chroma: cn } };
}

export function toCss(result, extra = "") {
  const block = (t, indent) => Object.entries(t).map(([k, v]) => `${indent}--${k}: ${v};`).join("\n");
  const head = `/* ${result.name}: generated by ui-craft palette.mjs from accent ${result.accent} (neutral hue ${result.neutral.hue}, chroma ${result.neutral.chroma}).\n   All text pairs pass WCAG 2.2 AA (4.5:1) on --bg, --surface and --surface-2; --border-strong, --focus and chart colours pass 3:1.\n   Load after tokens.css. Force a theme with <html data-theme="light|dark">. */`;
  return `${head}\n:root {\n  color-scheme: light;\n${block(result.light, "  ")}\n${extra}}\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n    color-scheme: dark;\n${block(result.dark, "    ")}\n  }\n}\n:root[data-theme="dark"] {\n  color-scheme: dark;\n${block(result.dark, "  ")}\n}\n`;
}

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
