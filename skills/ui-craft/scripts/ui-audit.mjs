// ui-craft audit: measure and score a screen the way a reviewer would.
// Usage: node ui-audit.mjs <page.html | https://your-site.com/page | http://localhost:3000> [more pages]
//        [--out <folder>]   where screenshots go (default: a temp folder)
//        [--json <file>]    also save scores, issues and fixes as JSON
//        [--dark]           check the dark theme (default: light; run both if the product has dark mode)
// Needs Node 22+ and Google Chrome (or Chromium / Edge). No npm packages.
// Checks desktop (1440px) and phone (390px), gives a 0-100 score per page, lists fixes ranked by points,
// adds unscored craft notes (radii, shadows, tracking, hues...), and saves screenshots. The score covers MEASURABLE things only; see references/review-mode.md for the full review.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync, mkdtempSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? resolve(args.splice(i, 2)[1]) : null; };
const jsonPath = opt("--json");
const dark = args.includes("--dark"); if (dark) args.splice(args.indexOf("--dark"), 1);
const outDir = opt("--out") || mkdtempSync(join(tmpdir(), "ui-audit-"));
if (!args.length) { console.log("Usage: node ui-audit.mjs <page.html|url> [...] [--out folder] [--json file]"); process.exit(1); }
mkdirSync(outDir, { recursive: true });

const CHROME = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
].filter(Boolean).find(existsSync);
if (!CHROME) { console.log("No Chrome/Chromium/Edge found. Set CHROME_PATH, or review the page by eye with the checklist."); process.exit(2); }
const PORT = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, "--headless=new", `--user-data-dir=${mkdtempSync(join(tmpdir(), "ui-audit-profile-"))}`, "--no-first-run", "--hide-scrollbars", "--allow-file-access-from-files", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pending = new Map(); const listeners = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } else listeners.forEach((f) => f(d)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  return { send, on: (f) => listeners.push(f), close: () => ws.close() };
}

const METRICS = String.raw`(() => {
  const cv = document.createElement("canvas"); cv.width = cv.height = 1; const cx = cv.getContext("2d", { willReadFrequently: true });
  const rgba = (c) => { cx.clearRect(0,0,1,1); cx.fillStyle = "#000"; cx.fillStyle = c; cx.fillRect(0,0,1,1); const d = cx.getImageData(0,0,1,1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const alphaOf = (c) => { const m = c.match(/\/\s*([\d.]+%?)\s*\)|rgba\([^)]*,\s*([\d.]+)\s*\)/); if (!m) return c === "transparent" ? 0 : 1; const v = m[1] || m[2]; return v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v); };
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const ratio = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && parseFloat(cs.opacity) > 0.05; };
  const bgOf = (el) => { const layers = []; for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage && cs.backgroundImage !== "none") return null; const a = alphaOf(cs.backgroundColor); if (a > 0) { const c = rgba(cs.backgroundColor); c[3] = a; layers.push(c); if (a >= 0.99) break; } } let out = [255, 255, 255]; for (const c of layers.reverse()) out = out.map((v, i) => v * (1 - c[3]) + c[i] * c[3]); return out; };
  const all = [...document.body.querySelectorAll("*")].filter(visible);
  const textEls = all.filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && !e.closest("svg,script,style"));
  const fails = []; let checked = 0; const sizes = new Set(); let minSize = 99;
  for (const e of textEls) {
    const cs = getComputedStyle(e); const fs = parseFloat(cs.fontSize); sizes.add(Math.round(fs)); minSize = Math.min(minSize, fs);
    if (e.closest("[disabled],[aria-disabled=true]")) continue;
    const bg = bgOf(e); if (!bg) continue;
    const fgA = alphaOf(cs.color) * parseFloat(cs.opacity); const fg0 = rgba(cs.color); const fg = fg0.slice(0, 3).map((v, i) => v * fgA + bg[i] * (1 - fgA));
    const r = ratio(fg, bg); const large = fs >= 24 || (fs >= 18.66 && parseInt(cs.fontWeight) >= 700); checked++;
    if (r < (large ? 3 : 4.5) - 0.005) fails.push({ text: e.textContent.trim().slice(0, 40), ratio: +r.toFixed(2), size: fs });
  }
  let rules = ""; for (const s of document.styleSheets) { try { for (const r of s.cssRules) rules += r.cssText + "\n"; } catch {} }
  document.querySelectorAll("[style]").forEach((e) => rules += e.getAttribute("style") + "\n");
  const interactive = all.filter((e) => e.matches("a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=tab],[role=radio],[role=checkbox],[role=switch],label:has(input)") && !(e.matches("a") && e.closest("p")));
  const small = (min) => interactive.filter((e) => { if (e.matches("input[type=radio],input[type=checkbox]") && (e.labels?.length || e.closest("label"))) return false; const r = e.getBoundingClientRect(); if (r.right <= 0 || r.bottom <= 0 || r.left >= innerWidth || r.width <= 2 || r.height <= 2) return false; /* off-screen, e.g. skip link */ return r.height < min - 0.5 || r.width < min - 0.5; }).map((e) => (e.textContent.trim() || e.getAttribute("aria-label") || e.tagName).slice(0, 30));
  const controls = [...document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea")];
  const unlabelled = controls.filter((e) => e.getAttribute("aria-hidden") !== "true" && !(e.getBoundingClientRect().width <= 2 && e.getBoundingClientRect().height <= 2) && !(e.labels?.length || e.getAttribute("aria-label") || e.getAttribute("aria-labelledby") || e.title)).map((e) => e.name || e.id || e.type);
  const spacing = []; for (const e of all) { const cs = getComputedStyle(e); for (const p of ["paddingTop","paddingRight","paddingBottom","paddingLeft","marginTop","marginBottom","rowGap","columnGap"]) { const v = parseFloat(cs[p]); if (v > 0) spacing.push(v); } }
  const on4 = spacing.filter((v) => Math.abs(v / 4 - Math.round(v / 4)) < 0.01).length;
  // ---- craft signals (advisory, not scored) ----
  const craft = [];
  const px = (v) => parseFloat(v) || 0;
  const radii = new Set(), shadows = new Set(), families = new Set(), hues = new Set();
  let heavyShadow = 0, pureBlack = 0, looseBig = 0, longLines = 0, defaultLink = 0;
  const hueOf = (c) => { const [r, g, b] = rgba(c); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); if (mx - mn < 40) return null; let h = mx === r ? ((g - b) / (mx - mn)) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4; return Math.round(((h * 60 + 360) % 360) / 30) % 12; };
  for (const e of all) {
    const cs = getComputedStyle(e), r = e.getBoundingClientRect();
    const rad = px(cs.borderTopLeftRadius);
    if (rad > 0 && rad < Math.min(r.width, r.height) / 2 - 1 && rad < 100) radii.add(Math.round(rad));
    if (cs.boxShadow && cs.boxShadow !== "none") {
      shadows.add(cs.boxShadow);
      const layers = cs.boxShadow.split(/,(?![^(]*\))/).filter((l) => !/inset/.test(l));
      const nums = (layers[0] || "").replace(/rgba?\([^)]*\)|oklch\([^)]*\)|color\([^)]*\)/g, "").match(/-?[\d.]+px/g) || [];
      if (layers.length === 1 && px(nums[2]) >= 10 && alphaOf(cs.boxShadow) >= 0.15) heavyShadow++;
    }
    if (alphaOf(cs.backgroundColor) > 0.5 && r.width > 40 && r.height > 20) { const h = hueOf(cs.backgroundColor); if (h !== null) hues.add(h); }
  }
  for (const e of textEls) {
    const cs = getComputedStyle(e), fs = px(cs.fontSize);
    const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
    if (!/mono|consol|menlo|courier/i.test(fam)) families.add(fam);
    const c = rgba(cs.color); if (c[0] === 0 && c[1] === 0 && c[2] === 0 && alphaOf(cs.color) === 1) pureBlack++;
    if (fs >= 32 && !(px(cs.letterSpacing) < 0) && cs.textTransform !== "uppercase" && e.textContent.trim().length > 8) looseBig++;
    if (e.tagName === "P" && e.textContent.trim().length > 200 && e.getBoundingClientRect().width / (fs * 0.5) > 92) longLines++;
    if (e.tagName === "A" && /^rgb\(0, 0, 238\)$/.test(cs.color)) defaultLink++;
    const h = hueOf(cs.color); if (h !== null && fs >= 14) hues.add(h);
  }
  const bodyFam = getComputedStyle(document.body).fontFamily.split(",")[0].replace(/["']/g, "").trim();
  if (radii.size > 4) craft.push((radii.size) + " different corner radii (" + ([...radii].sort((a, b) => a - b).join(", ")) + "px): use one family of 3");
  if (shadows.size > 5) craft.push((shadows.size) + " different shadows: use three levels (flat, raised, overlay)");
  if (heavyShadow) craft.push((heavyShadow) + " element(s) with one heavy single-layer shadow: layer 2-4 thin, tinted shadows instead");
  if (pureBlack > 3) craft.push((pureBlack) + " text elements in pure #000: use a near-black tinted toward the neutral hue");
  if (looseBig) craft.push((looseBig) + " large heading(s) (32px+) with default letter-spacing: tighten to about -0.02 to -0.04em");
  if (longLines) craft.push((longLines) + " paragraph(s) wider than ~90 characters: cap reading width at 65-75 characters");
  if (families.size > 2) craft.push((families.size) + " font families (" + ([...families].slice(0, 4).join(", ")) + "): keep to one, or a display + text pair");
  if (/^(Times|Times New Roman|serif)$/i.test(bodyFam)) craft.push("Body text uses the browser default serif: choose a font on purpose");
  if (defaultLink) craft.push((defaultLink) + " link(s) in the browser's default blue: style links with the accent");
  if (hues.size > 6) craft.push((hues.size) + " different hue families on screen: most of a UI is neutral plus one accent and status colours");
  if (!/font-variant-numeric:\s*tabular-nums|tnum/.test(rules) && /\d{2,}[.,]\d/.test(document.body.innerText)) craft.push("Numbers are not tabular: add font-variant-numeric: tabular-nums to tables, prices and stats");
  if (!/text-wrap:\s*(balance|pretty)/.test(rules)) craft.push("No text-wrap: balance on headings (avoids orphaned words)");
  if (!/:active/.test(rules) && interactive.length > 3) craft.push("No :active (pressed) styles: add press feedback, e.g. transform: scale(0.97)");
  const text = document.body.innerText;
  const heads = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
  let skipped = 0; heads.forEach((h, i) => { if (i && h > heads[i - 1] + 1) skipped++; });
  return {
    width: innerWidth, horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    textChecked: checked, contrastFails: fails.length, contrastFailSamples: fails.slice(0, 6),
    fontSizes: [...sizes].sort((a, b) => a - b), minFontSize: minSize,
    hasFocusStyle: /:focus(-visible|-within)?\b/.test(rules), hasReducedMotion: /prefers-reduced-motion/.test(rules),
    hasTransitionOrAnimation: /transition|animation/.test(rules), transitionAll: /transition(-property)?:\s*all\b/.test(rules),
    targetsUnder24: small(24), targetsUnder44: small(44), interactiveCount: interactive.length,
    unlabelledControls: unlabelled, spacingOn4pxGrid: spacing.length ? +(on4 / spacing.length).toFixed(3) : 1,
    gradientElements: all.filter((e) => /gradient/.test(getComputedStyle(e).backgroundImage)).length,
    gradientText: /background-clip:\s*text/.test(rules),
    emojiCount: (text.match(/\p{Extended_Pictographic}/gu) || []).filter((c) => !"©®™↑↓←→↗↘▲▼★☆✓✔✕✖×".includes(c)).length,
    lorem: /lorem ipsum/i.test(text), placeholderImages: [...document.images].filter((i) => /placehold|picsum|placeholder\.com|dummyimage|source\.unsplash/.test(i.src)).length,
    h1Count: heads.filter((h) => h === 1).length, skippedHeadingLevels: skipped,
    cssCustomProperties: (rules.match(/--[\w-]+\s*:/g) || []).length,
    craft,
  };
})()`;


const usedNames = new Set();
async function run(target) {
  const url = /^https?:|^file:/.test(target) ? target : pathToFileURL(resolve(target)).href;
  let name = target.split(/[\/]/).pop().replace(/\.html?$/, "").replace(/[^\w-]/g, "_") || "page";
  while (usedNames.has(name)) name += "-2"; usedNames.add(name);
  const res = {};
  for (const [label, w, h, mobile] of [["desktop", 1440, 900, false], ["phone", 390, 844, true]]) {
    const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
    const c = await cdp(t.webSocketDebuggerUrl);
    await c.send("Page.enable"); await c.send("Runtime.enable");
    await c.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile });
    await c.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: dark ? "dark" : "light" }] });
    if (mobile) await c.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    const loaded = new Promise((r) => c.on((d) => d.method === "Page.loadEventFired" && r()));
    await c.send("Page.navigate", { url });
    await Promise.race([loaded, sleep(10000)]); await sleep(1200);
    const m = await c.send("Runtime.evaluate", { expression: METRICS.replaceAll("innerWidth", String(w)), returnByValue: true });
    res[label] = m.result?.result?.value ?? { error: m.result?.exceptionDetails?.exception?.description };
    const sh = (await c.send("Runtime.evaluate", { expression: "document.documentElement.scrollHeight", returnByValue: true })).result.result.value;
    await c.send("Emulation.setDeviceMetricsOverride", { width: w, height: Math.min(Math.max(sh, h), mobile ? 2600 : 2000), deviceScaleFactor: 1, mobile }); await sleep(400);
    const shot = await c.send("Page.captureScreenshot", { format: "png" });
    const file = join(outDir, `${name}-${label}${dark ? "-dark" : ""}.png`);
    writeFileSync(file, Buffer.from(shot.result.data, "base64")); res[label].screenshot = file;
    c.close(); await fetch(`http://127.0.0.1:${PORT}/json/close/${t.id}`);
  }
  return res;
}

// ---- Scoring: 100 points over 11 measurable areas. Each check records points lost and a fix. ----
const REF = "references/";
function score(r) {
  const d = r.desktop, p = r.phone, out = [];
  const add = (area, max, lost, problem, fix, ref) => out.push({ area, max, got: Math.max(0, +(max - Math.min(max, lost)).toFixed(1)), problem, fix, ref });
  const cf = Math.max(d.contrastFails, p.contrastFails), cs = (d.contrastFails >= p.contrastFails ? d : p).contrastFailSamples;
  add("Text contrast", 20, cf * 2, cf ? `${cf} text element(s) below WCAG AA, e.g. ${cs.slice(0, 3).map((x) => `"${x.text}" ${x.ratio}:1`).join(", ")}` : "",
    "Darken text to reach 4.5:1 (3:1 for 24px+ text). Muted grey on white: ~#5B6B82 or darker. Check text on tinted backgrounds too.", REF + "color-dark-mode.md");
  const tc = d.targetsUnder24.length * 2 + p.targetsUnder44.length * 1.5;
  add("Tap & click targets", 15, tc, tc ? `${p.targetsUnder44.length} tap target(s) under 44px on phone${d.targetsUnder24.length ? `, ${d.targetsUnder24.length} under 24px on desktop` : ""}: ${[...new Set([...d.targetsUnder24, ...p.targetsUnder44])].slice(0, 5).join(", ")}` : "",
    "Add `@media (max-width:640px),(pointer:coarse){button,.btn,input,select,[role=tab],nav a{min-height:44px}}`; give icon buttons and small links 44x44 padding.", REF + "mobile-touch.md");
  const ov = (p.horizontalOverflow ? 15 : 0) + (d.horizontalOverflow ? 5 : 0);
  add("Responsive layout", 15, ov, ov ? `Page scrolls sideways${p.horizontalOverflow ? " at 390px (phone)" : ""}${d.horizontalOverflow ? " at 1440px (desktop)" : ""}` : "",
    "Find the wide element: add `min-width:0` to flex/grid children, `overflow-x:auto` to chip/date rows, turn wide tables into cards on phones.", REF + "layout-spacing.md");
  add("Keyboard focus", 10, d.hasFocusStyle ? 0 : 10, d.hasFocusStyle ? "" : "No visible focus style; keyboard users cannot see where they are",
    "Add `:focus-visible{outline:2px solid var(--accent);outline-offset:2px}`; never remove outlines without a replacement.", REF + "accessibility.md");
  const minF = Math.min(d.minFontSize, p.minFontSize);
  add("Text size", 10, minF >= 12 ? 0 : minF >= 11 ? 5 : 10, minF >= 12 ? "" : `Smallest text is ${minF}px`,
    "Nothing below 12px. Body 16px (14px only in dense desktop tools); phone inputs 16px.", REF + "typography.md");
  const SCALE = [12, 14, 16, 18, 20, 24, 30, 36, 48, 60], off = d.fontSizes.filter((x) => !SCALE.includes(x) && x < 72);
  const extra = Math.max(0, d.fontSizes.length - 7);
  add("Type consistency", 5, extra + off.length * 0.5, extra || off.length ? `${d.fontSizes.length} font sizes (${d.fontSizes.join(", ")}px)${off.length ? `; off the scale: ${off.join(", ")}px` : ""}` : "",
    "Use the scale 12/14/16/18/20/24/30/36/48/60 and only 4-6 sizes per screen (7 on marketing pages).", REF + "typography.md");
  const ul = d.unlabelledControls.length;
  add("Form labels", 5, ul * 2.5, ul ? `${ul} form control(s) without a label: ${d.unlabelledControls.slice(0, 4).join(", ")}` : "",
    "Give every input a visible <label for> above it (a placeholder is not a label); icon-only controls get aria-label.", REF + "forms.md");
  const g = d.spacingOn4pxGrid;
  add("Spacing system", 5, g >= 0.9 ? 0 : g >= 0.5 ? (0.9 - g) / 0.4 * 5 : 5, g >= 0.9 ? "" : `Only ${Math.round(g * 100)}% of spacing values are on the 4px grid`,
    "Use only 4, 8, 12, 16, 24, 32, 48, 64, 96 for padding, margin and gap (best as CSS variables).", REF + "layout-spacing.md");
  const st = (d.h1Count === 1 ? 0 : 2.5) + Math.min(2.5, d.skippedHeadingLevels * 1.5);
  add("Page structure", 5, st, st ? `${d.h1Count} <h1> element(s)${d.skippedHeadingLevels ? `, heading levels skipped ${d.skippedHeadingLevels} time(s)` : ""}` : "",
    "One <h1> per page, then h2, h3 in order; use header/nav/main landmarks.", REF + "accessibility.md");
  const noRM = d.hasTransitionOrAnimation && !d.hasReducedMotion;
  const mo = (noRM ? 3 : 0) + (d.transitionAll ? 2 : 0);
  add("Motion", 5, mo, mo ? [noRM ? "motion with no prefers-reduced-motion rule" : "", d.transitionAll ? "uses `transition: all`" : ""].filter(Boolean).join("; ") : "",
    "Add a `@media (prefers-reduced-motion: reduce)` block; list transition properties instead of `all`.", REF + "motion.md");
  const hy = Math.min(5, (d.emojiCount ? 2 : 0) + (d.lorem || d.placeholderImages ? 3 : 0) + (d.gradientText ? 2 : 0));
  add("Content & polish", 5, hy, hy ? [d.emojiCount ? `${d.emojiCount} emoji used as icons` : "", d.lorem ? "lorem ipsum" : "", d.placeholderImages ? "placeholder images" : "", d.gradientText ? "gradient text" : ""].filter(Boolean).join(", ") : "",
    "Use SVG icons from one set, realistic content and real images; drop gradient text.", REF + "review-checklist.md");
  const total = Math.round(out.reduce((a, x) => a + x.got, 0));
  const grade = total >= 90 ? "A" : total >= 80 ? "B" : total >= 65 ? "C" : total >= 50 ? "D" : "F";
  const fixes = out.filter((x) => x.problem).sort((a, b) => (b.max - b.got) - (a.max - a.got));
  return { total, grade, areas: out, fixes };
}

function report(target, r) {
  if (r.desktop.error) { console.log(`\n${target}\n  Could not measure: ${r.desktop.error}`); return { target, error: r.desktop.error }; }
  const s = score(r);
  console.log(`\n${target}\n  Measured score: ${s.total}/100 (${s.grade})`);
  console.log("  " + s.areas.map((a) => `${a.area} ${a.got}/${a.max}`).join(" | "));
  if (s.fixes.length) {
    console.log("  Fixes, biggest gain first:");
    s.fixes.forEach((f, i) => console.log(`   ${i + 1}. [+${+(f.max - f.got).toFixed(1)} pts] ${f.area}: ${f.problem}\n      Fix: ${f.fix}  (see ${f.ref})`));
  } else console.log("  No measurable problems found.");
  const craft = r.desktop.craft || [];
  if (craft.length) { console.log("  Craft notes (not scored; these make a screen look less finished):"); craft.forEach((c) => console.log("   - " + c)); }
  console.log(`  Font sizes: ${r.desktop.fontSizes.join(", ")}px\n  Screenshots: ${r.desktop.screenshot} , ${r.phone.screenshot}`);
  return { target, ...s, craft, fontSizes: r.desktop.fontSizes, screenshots: [r.desktop.screenshot, r.phone.screenshot] };
}

try {
  for (let i = 0; i < 40; i++) { try { await fetch(`http://127.0.0.1:${PORT}/json/version`); break; } catch { await sleep(250); } }
  const results = [];
  for (const t of args) results.push(report(t, await run(t)));
  const ok = results.filter((x) => x.total != null);
  if (ok.length > 1) {
    console.log(`\nSummary, worst first (${ok.length} pages):`);
    [...ok].sort((x, y) => x.total - y.total).forEach((x) =>
      console.log(`  ${String(x.total).padStart(3)} ${x.grade}  ${x.target}${x.fixes[0] ? `  - top issue: ${x.fixes[0].area}` : ""}`));
    console.log(`Average measured score: ${Math.round(ok.reduce((a, x) => a + x.total, 0) / ok.length)}/100 over ${ok.length} pages`);
    const common = {};
    ok.forEach((x) => x.fixes.forEach((f) => { common[f.area] = (common[f.area] || 0) + 1; }));
    const shared = Object.entries(common).filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);
    if (shared.length) console.log("Problems on several pages (fix once in shared code): " + shared.map(([k, n]) => `${k} (${n} pages)`).join(", "));
  }
  if (jsonPath) { writeFileSync(jsonPath, JSON.stringify({ measuredAt: new Date().toISOString(), pages: results }, null, 2)); console.log(`\nJSON saved: ${jsonPath}`); }
  console.log("\nThis score covers measurable checks only (contrast, sizes, layout, labels...). It cannot judge taste:\nopen the screenshots and score design quality with references/review-mode.md.");
} finally { chrome.kill(); }
