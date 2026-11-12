// ui-craft eval checker. No npm packages: drives headless Chrome over the DevTools protocol.
// Usage: node evals/tools/check.mjs <run-dir> [<run-dir> ...]
//   For every .html in <run-dir>/outputs it saves screenshots (desktop 1440, phone 390)
//   into <run-dir>/screens/ and writes <run-dir>/metrics.json.
import { spawn } from "node:child_process";
import { readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find(existsSync);
const PORT = 9333;
const profile = resolve("evals/.chrome-profile");
const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, "--headless=new", `--user-data-dir=${profile}`, "--no-first-run", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
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

async function measure(file, outDir) {
  const res = {};
  for (const [label, w, h, mobile] of [["desktop", 1440, 900, false], ["phone", 390, 844, true]]) {
    const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
    const c = await cdp(t.webSocketDebuggerUrl);
    await c.send("Page.enable"); await c.send("Runtime.enable");
    await c.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile });
    if (mobile) await c.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    const loaded = new Promise((r) => c.on((d) => d.method === "Page.loadEventFired" && r()));
    await c.send("Page.navigate", { url: pathToFileURL(file).href });
    await Promise.race([loaded, sleep(8000)]); await sleep(1200);
    const m = await c.send("Runtime.evaluate", { expression: METRICS.replaceAll("innerWidth", String(w)), returnByValue: true });
    res[label] = m.result?.result?.value ?? { error: m.result?.exceptionDetails?.exception?.description };
    const sh = (await c.send("Runtime.evaluate", { expression: "document.documentElement.scrollHeight", returnByValue: true })).result.result.value;
    await c.send("Emulation.setDeviceMetricsOverride", { width: w, height: Math.min(Math.max(sh, h), mobile ? 2600 : 2000), deviceScaleFactor: 1, mobile }); await sleep(400);
    const shot = await c.send("Page.captureScreenshot", { format: "png" });
    const name = file.split(/[\\/]/).pop().replace(/\.html?$/, "");
    writeFileSync(join(outDir, `${name}-${label}.png`), Buffer.from(shot.result.data, "base64"));
    c.close(); await fetch(`http://127.0.0.1:${PORT}/json/close/${t.id}`);
  }
  return res;
}

try {
  for (let i = 0; i < 40; i++) { try { await fetch(`http://127.0.0.1:${PORT}/json/version`); break; } catch { await sleep(250); } }
  for (const run of process.argv.slice(2)) {
    const outputs = join(run, "outputs"); const screens = join(run, "screens"); mkdirSync(screens, { recursive: true });
    const files = readdirSync(outputs, { recursive: true }).filter((f) => /\.html?$/.test(f)).map((f) => resolve(outputs, f));
    const all = {};
    for (const f of files) { all[f.slice(resolve(outputs).length + 1)] = await measure(f, screens); }
    writeFileSync(join(run, "metrics.json"), JSON.stringify(all, null, 2));
    console.log("ok", run, files.length, "file(s)");
  }
} finally { chrome.kill(); }
