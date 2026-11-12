// ui-craft audit: measure a finished screen the way a reviewer would.
// Usage: node ui-audit.mjs <page.html | http://localhost:3000/page> [more pages] [--out <folder>]
// Needs Node 22+ and Google Chrome (or Chromium / Edge). No npm packages.
// Prints problems for desktop (1440px) and phone (390px) and saves screenshots you can open and look at.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync, mkdtempSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const outDir = outIdx >= 0 ? resolve(args.splice(outIdx, 2)[1]) : mkdtempSync(join(tmpdir(), "ui-audit-"));
if (!args.length) { console.log("Usage: node ui-audit.mjs <page.html|url> [...] [--out folder]"); process.exit(1); }
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
const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, "--headless=new", `--user-data-dir=${mkdtempSync(join(tmpdir(), "ui-audit-profile-"))}`, "--no-first-run", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
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
  };
})()`;


async function run(target) {
  const url = /^https?:|^file:/.test(target) ? target : pathToFileURL(resolve(target)).href;
  const name = target.split(/[\/]/).pop().replace(/\.html?$/, "").replace(/[^\w-]/g, "_") || "page";
  const res = {};
  for (const [label, w, h, mobile] of [["desktop", 1440, 900, false], ["phone", 390, 844, true]]) {
    const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
    const c = await cdp(t.webSocketDebuggerUrl);
    await c.send("Page.enable"); await c.send("Runtime.enable");
    await c.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile });
    if (mobile) await c.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    const loaded = new Promise((r) => c.on((d) => d.method === "Page.loadEventFired" && r()));
    await c.send("Page.navigate", { url });
    await Promise.race([loaded, sleep(10000)]); await sleep(1200);
    const m = await c.send("Runtime.evaluate", { expression: METRICS.replaceAll("innerWidth", String(w)), returnByValue: true });
    res[label] = m.result?.result?.value ?? { error: m.result?.exceptionDetails?.exception?.description };
    const sh = (await c.send("Runtime.evaluate", { expression: "document.documentElement.scrollHeight", returnByValue: true })).result.result.value;
    await c.send("Emulation.setDeviceMetricsOverride", { width: w, height: Math.min(Math.max(sh, h), mobile ? 2600 : 2000), deviceScaleFactor: 1, mobile }); await sleep(400);
    const shot = await c.send("Page.captureScreenshot", { format: "png" });
    const file = join(outDir, `${name}-${label}.png`);
    writeFileSync(file, Buffer.from(shot.result.data, "base64")); res[label].screenshot = file;
    c.close(); await fetch(`http://127.0.0.1:${PORT}/json/close/${t.id}`);
  }
  return res;
}

function report(target, r) {
  const d = r.desktop, p = r.phone, issues = [];
  if (d.error) { console.log(`\n${target}\n  Could not measure: ${d.error}`); return; }
  for (const [w, v] of [["desktop", d], ["phone", p]]) if (v.contrastFails) issues.push(`[${w}] ${v.contrastFails} text element(s) below WCAG AA contrast, e.g. ${v.contrastFailSamples.slice(0, 3).map((s) => `"${s.text}" ${s.ratio}:1`).join(", ")}`);
  if (Math.min(d.minFontSize, p.minFontSize) < 12) issues.push(`Text smaller than 12px (smallest ${Math.min(d.minFontSize, p.minFontSize)}px)`);
  if (d.fontSizes.length > 7) issues.push(`${d.fontSizes.length} different font sizes on desktop (${d.fontSizes.join(", ")}); aim for 4–7 from the scale`);
  if (!d.hasFocusStyle) issues.push("No :focus-visible / :focus styles found; keyboard users cannot see where they are");
  if (d.hasTransitionOrAnimation && !d.hasReducedMotion) issues.push("Has motion but no prefers-reduced-motion rule");
  if (d.transitionAll) issues.push("Uses `transition: all`; list the properties instead");
  if (p.horizontalOverflow) issues.push("[phone] Page scrolls sideways at 390px");
  if (d.horizontalOverflow) issues.push("[desktop] Page scrolls sideways at 1440px");
  if (d.targetsUnder24.length) issues.push(`[desktop] ${d.targetsUnder24.length} click target(s) under 24px: ${d.targetsUnder24.slice(0, 5).join(", ")}`);
  if (p.targetsUnder44.length) issues.push(`[phone] ${p.targetsUnder44.length} tap target(s) under 44px: ${p.targetsUnder44.slice(0, 6).join(", ")}`);
  if (d.unlabelledControls.length) issues.push(`Form controls without a label: ${d.unlabelledControls.join(", ")}`);
  if (d.spacingOn4pxGrid < 0.8) issues.push(`Only ${Math.round(d.spacingOn4pxGrid * 100)}% of spacing values are on the 4px grid`);
  if (d.h1Count !== 1) issues.push(`${d.h1Count} <h1> elements (expected 1)`);
  if (d.skippedHeadingLevels) issues.push(`Heading levels skipped ${d.skippedHeadingLevels} time(s)`);
  if (d.emojiCount) issues.push(`${d.emojiCount} emoji in the UI text; use SVG icons`);
  if (d.lorem || d.placeholderImages) issues.push("Lorem ipsum or placeholder-image services found; use realistic content");
  if (d.gradientText) issues.push("Gradient text found (a common generic-AI look)");
  console.log(`\n${target}`);
  console.log(issues.length ? issues.map((i) => "  - " + i).join("\n") : "  No measurable problems found. Still look at the screenshots.");
  console.log(`  Font sizes: ${d.fontSizes.join(", ")}px   Screenshots: ${d.screenshot} , ${p.screenshot}`);
}

try {
  for (let i = 0; i < 40; i++) { try { await fetch(`http://127.0.0.1:${PORT}/json/version`); break; } catch { await sleep(250); } }
  for (const t of args) report(t, await run(t));
  console.log("\nMeasured automatically. It cannot judge taste: open the screenshots and check hierarchy, spacing and the AI-look list too.");
} finally { chrome.kill(); }
