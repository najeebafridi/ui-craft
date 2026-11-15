// theme-bridge.js (ui-craft, immersive-web skill). MIT licence. No dependencies.
// Reads the ui-craft theme tokens from CSS, so a 3D scene, a shader or a canvas uses the same colours,
// motion and shape as the rest of the page. One theme drives every layer.
//
//   import { readTheme, watchTheme, bezier } from "./theme-bridge.js";
//   let theme = readTheme();                       // colours as linear RGB (for lighting maths) and sRGB
//   material.color.setRGB(...theme.color.accent.linear);          // three.js (working space is linear sRGB)
//   gl.uniform3fv(uAccent, theme.color.accent.linear);            // raw WebGL: light in linear, encode to sRGB at the end
//   const ease = bezier(...theme.motion.ease);                    // the theme's own easing curve, for camera and scroll moves
//   watchTheme((t) => { theme = t; redraw(); });                  // light/dark switch, new direction, reduced motion
//
// Works with tokens.css, any direction file, a Studio theme.css, or a project's own variables: pass a name map,
// for example readTheme(document.documentElement, { accent: "--brand-500", bg: "--background" }).

export const TOKEN_NAMES = {
  bg: "--bg", surface: "--surface", surface2: "--surface-2", surface3: "--surface-3",
  border: "--border", borderStrong: "--border-strong",
  text: "--text", textMuted: "--text-muted", textSubtle: "--text-subtle",
  accent: "--accent", accentHover: "--accent-hover", accentFg: "--accent-fg", accentSoft: "--accent-soft", accentText: "--accent-text",
  secondary: "--secondary", success: "--success", warning: "--warning", danger: "--danger", info: "--info",
  chart1: "--chart-1", chart2: "--chart-2", chart3: "--chart-3",
};

export const srgbToLinear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
export const linearToSrgb = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, "0")).join("");

let ctx2d;
// Any CSS colour (hex, rgb, hsl, oklch, color-mix, a name) -> [r, g, b, a] in sRGB, 0..1.
export function parseColor(css) {
  const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(css.trim());
  if (m) return [m[1] / 255, m[2] / 255, m[3] / 255, m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : +m[4]];
  if (!ctx2d) { const c = document.createElement("canvas"); c.width = c.height = 1; ctx2d = c.getContext("2d", { willReadFrequently: true }); }
  ctx2d.clearRect(0, 0, 1, 1); ctx2d.fillStyle = "#000"; ctx2d.fillStyle = css; ctx2d.fillRect(0, 0, 1, 1);
  const d = ctx2d.getImageData(0, 0, 1, 1).data;
  return [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255];
}

// One token -> { css, srgb, linear, hex, alpha }, or null when the token is not defined in this scope.
export function readColor(name, scope = document.documentElement) {
  if (!getComputedStyle(scope).getPropertyValue(name).trim()) return null;
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;color:var(${name})`;
  scope.append(probe);
  const css = getComputedStyle(probe).color;
  probe.remove();
  const [r, g, b, a] = parseColor(css);
  return { css, srgb: [r, g, b], linear: [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)], hex: toHex([r, g, b]), alpha: a };
}

const ms = (v, fallback) => { const n = parseFloat(v); return Number.isFinite(n) ? (/\ds\s*$/.test(v) && !/ms\s*$/.test(v) ? n * 1000 : n) : fallback; };
const px = (v, fallback) => { const n = parseFloat(v); return Number.isFinite(n) ? n : fallback; };

// The whole theme in one object. Missing tokens fall back to quiet defaults, so a page without ui-craft tokens still works.
export function readTheme(scope = document.documentElement, names = {}) {
  const map = { ...TOKEN_NAMES, ...names }, cs = getComputedStyle(scope), get = (n) => cs.getPropertyValue(n).trim();
  const color = {};
  for (const [key, name] of Object.entries(map)) { const c = readColor(name, scope); if (c) color[key] = c; }
  const fallback = (key, css) => { if (!color[key]) { const [r, g, b] = parseColor(css); color[key] = { css, srgb: [r, g, b], linear: [r, g, b].map(srgbToLinear), hex: toHex([r, g, b]), alpha: 1 }; } };
  fallback("bg", cs.backgroundColor && !/rgba?\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) ? cs.backgroundColor : "#ffffff");
  fallback("text", cs.color || "#1a1a1a"); fallback("surface", color.bg.css); fallback("accent", color.text.css); fallback("border", color.text.css);
  const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const easeNums = (get("--ease-out").match(/cubic-bezier\(([^)]+)\)/) || [, "0.22, 1, 0.36, 1"])[1].split(",").map(Number);
  const shadowRgb = (get("--shadow-color").match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map((v) => srgbToLinear(v / 255));
  const base = ms(get("--dur-base"), 200);
  return {
    dark: lum(color.bg.linear) < 0.18,
    color,
    motion: {
      fast: ms(get("--dur-fast"), 120), base, slow: ms(get("--dur-slow"), 300),
      ease: easeNums.length === 4 && easeNums.every(Number.isFinite) ? easeNums : [0.22, 1, 0.36, 1],
      press: px(get("--press-scale"), 0.97),
      bouncy: easeNums[1] > 1 || easeNums[3] > 1,   // the curve overshoots: playful directions
      tempo: base / 200,                            // 1 = crisp; under 1 = faster (tools); over 1 = slower (care, luxury)
    },
    shape: { radiusSm: px(get("--radius-sm"), 6), radius: px(get("--radius"), 8), radiusLg: px(get("--radius-lg"), 12), borderW: px(get("--border-w"), 1) },
    shadow: { color: shadowRgb, strength: px(get("--shadow-strength"), 1) },
    font: { display: get("--font-display") || cs.fontFamily, sans: get("--font-sans") || cs.fontFamily, mono: get("--font-mono") || "monospace" },
    // --immersive: the most 3D and scroll effect this theme should carry. 0 still, 1 accent, 2 signature, 3 story. Unset = 1.
    immersive: Number.isFinite(parseInt(get("--immersive"))) ? Math.min(3, Math.max(0, parseInt(get("--immersive")))) : 1,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
}

// Call back with a fresh theme when it can have changed: data-theme / class / style on the scope, OS light-dark, reduced motion.
export function watchTheme(callback, scope = document.documentElement, names = {}) {
  let queued = false;
  const fire = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; callback(readTheme(scope, names)); }); };
  const mo = new MutationObserver(fire); mo.observe(scope, { attributes: true, attributeFilter: ["data-theme", "class", "style"] });
  const queries = ["(prefers-color-scheme: dark)", "(prefers-reduced-motion: reduce)", "(prefers-contrast: more)"].map((q) => matchMedia(q));
  queries.forEach((q) => q.addEventListener("change", fire));
  return () => { mo.disconnect(); queries.forEach((q) => q.removeEventListener("change", fire)); };
}

// CSS cubic-bezier(x1, y1, x2, y2) as a function of t in 0..1. Use it to move a camera or a scroll scene with the theme's own curve.
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t, dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) { const d = dX(t); if (Math.abs(d) < 1e-6) break; t -= (X(t) - x) / d; }
    return Y(Math.min(1, Math.max(0, t)));
  };
}

// Mix two linear-RGB colours in OKLab. Gradients and shader ramps stay clean in the middle instead of going grey or muddy.
export function mixOklab(a, b, t) {
  const toLab = ([r, g, bl]) => { const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * bl), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * bl), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * bl); return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]; };
  const A = toLab(a), B = toLab(b), [L, p, q] = A.map((v, i) => v + (B[i] - v) * t);
  const l = (L + 0.3963377774 * p + 0.2158037573 * q) ** 3, m = (L - 0.1055613458 * p - 0.0638541728 * q) ** 3, s = (L - 0.0894841775 * p - 1.291485548 * q) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
