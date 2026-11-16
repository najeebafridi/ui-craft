// immersive-check: test a 3D, shader or scroll-driven page the way its hard rules demand.
// Usage: node immersive-check.mjs <page.html | http://localhost:3000 | https://site> [--out <folder>] [--json <file>] [--wait <ms>] [--app]
//        --app   the page is an app window (Electron, Tauri, a signed-in web app): skip the no-JavaScript test, which only public pages must pass
//        --poster <file.png>   save the scene's box, as drawn at the top of the desktop pass: a ready-made fallback image
//        --scheme light|dark   which colour scheme to test and to use for the poster (default: the system's)
// Needs Node 22+ and Google Chrome (or Chromium / Edge). No npm packages.
//
// It loads the page five times and looks at what a visitor would get each time:
//   1. desktop, everything on      weight, what loads before first paint, draw calls, native scrolling, pause off screen, lost context
//   2. phone (390px, 3x screen)    pixel ratio cap, sideways scroll, draw calls and triangles
//   3. prefers-reduced-motion      nothing keeps moving, no smooth-scroll, still frames only
//   4. no WebGL / WebGPU           the fallback shows, nothing throws, the text is all there
//   5. no JavaScript               the real content is in the HTML
// It saves screenshots of every pass. Open them: the script cannot judge beauty, and frame rate is not measured
// (headless Chrome draws 3D in software, so speed here says nothing about a real phone).
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync, mkdtempSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : null; };
const jsonPath = opt("--json"), outArg = opt("--out"), settle = +(opt("--wait") || 3000);
const posterPath = opt("--poster"), scheme = opt("--scheme");
const appMode = args.includes("--app"); if (appMode) args.splice(args.indexOf("--app"), 1);
const outDir = outArg ? resolve(outArg) : mkdtempSync(join(tmpdir(), "immersive-check-"));
if (!args.length) { console.log("Usage: node immersive-check.mjs <page.html|url> [--out folder] [--json file] [--wait ms] [--app] [--poster file.png] [--scheme light|dark]"); process.exit(1); }
mkdirSync(outDir, { recursive: true });
const target = /^https?:/.test(args[0]) ? args[0] : pathToFileURL(resolve(args[0])).href;

const CHROME = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
].filter(Boolean).find(existsSync);
if (!CHROME) { console.log("No Chrome/Chromium/Edge found. Set CHROME_PATH, or test the five cases by hand (see references/accessibility-fallbacks.md)."); process.exit(2); }
const PORT = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, "--headless=new", `--user-data-dir=${mkdtempSync(join(tmpdir(), "immersive-check-profile-"))}`, "--no-first-run", "--hide-scrollbars", "--allow-file-access-from-files", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--autoplay-policy=document-user-activation-required", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const kill = setTimeout(() => { console.log("Timed out after 4 minutes."); chrome.kill(); process.exit(3); }, 240000);

// Runs in the page before its own scripts: counts drawing work and notes which safety hooks the page installs.
const PROBE = String.raw`(() => {
  if (window.__imm) return;
  const S = window.__imm = { draws: 0, tris: 0, frames: 0, tick: 0, last: -1, raf: 0, ctx: [], media: [], lostHook: false, visHook: false, io: false, wheelBlock: false, d2: 0, fd: 0, ft: 0, maxD: 0, maxT: 0 };
  const raf = window.requestAnimationFrame.bind(window);
  const loop = () => { S.tick++; raf(loop); }; raf(loop);
  window.requestAnimationFrame = (cb) => { S.raf++; return raf(cb); };
  const mark = () => { if (S.last !== S.tick) { S.maxD = Math.max(S.maxD, S.fd); S.maxT = Math.max(S.maxT, S.ft); S.fd = 0; S.ft = 0; S.frames++; S.last = S.tick; } };
  for (const C of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
    if (!C) continue; const P = C.prototype;
    for (const fn of ["drawArrays", "drawElements", "drawArraysInstanced", "drawElementsInstanced"]) {
      const o = P[fn]; if (!o) continue;
      P[fn] = function (mode, a, b, c, d) { S.draws++; mark(); const arrays = fn.startsWith("drawArrays"), count = arrays ? b : a, inst = fn.endsWith("Instanced") ? (arrays ? c : d) : 1;
        const t = (mode === 4 ? Math.floor(count / 3) : mode === 5 || mode === 6 ? Math.max(0, count - 2) : 0) * (inst || 1); S.tris += t; S.fd++; S.ft += t; return o.apply(this, arguments); };
    }
  }
  const C2 = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  if (C2) for (const fn of ["clearRect", "drawImage"]) { const o = C2[fn]; C2[fn] = function () { if (this.canvas && this.canvas.width * this.canvas.height > 40000) { S.d2++; mark(); } return o.apply(this, arguments); }; }
  const get = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    if (window.__immNoGL && /webgl|webgpu/i.test(type)) return null;
    const c = get.call(this, type, ...rest); if (c && /webgl/i.test(type) && !S.ctx.includes(c)) S.ctx.push(c); return c; };
  if (window.__immNoGL && navigator.gpu) try { Object.defineProperty(Navigator.prototype, "gpu", { get: () => undefined }); } catch {}
  const mm = window.matchMedia.bind(window); window.matchMedia = (q) => { S.media.push(String(q)); return mm(q); };
  const add = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, o) {
    if (type === "webglcontextlost") S.lostHook = true; if (type === "visibilitychange") S.visHook = true;
    if ((type === "wheel" || type === "touchmove") && o && typeof o === "object" && o.passive === false) S.wheelBlock = true;
    return add.call(this, type, fn, o); };
  const IO = window.IntersectionObserver; if (IO) window.IntersectionObserver = function (...a) { S.io = true; return new IO(...a); };
})();`;

const FACTS = String.raw`(() => {
  const vis = (e) => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none" && parseFloat(cs.opacity) > 0.05; };
  const shown = (e) => { for (let n = e; n && n.nodeType === 1; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return false; } return true; };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let text = 0, hiddenText = 0;
  for (let n; (n = walker.nextNode());) { const t = n.textContent.trim(); if (!t || !n.parentElement || n.parentElement.closest("script,style,noscript,template,canvas,svg")) continue; if (shown(n.parentElement)) text += t.length; else hiddenText += t.length; }
  const h1 = [...document.querySelectorAll("h1")];
  let rules = ""; for (const s of document.styleSheets) { try { for (const r of s.cssRules) rules += r.cssText + "\n"; } catch {} }
  const canvases = [...document.querySelectorAll("canvas")].filter((c) => c.width * c.height > 40000).map((c) => { const r = c.getBoundingClientRect(); return {
    css: [Math.round(r.width), Math.round(r.height)], backing: [c.width, c.height], ratio: r.width ? +(c.width / r.width).toFixed(2) : 0, megapixels: +((c.width * c.height) / 1e6).toFixed(2),
    hidden: c.getAttribute("aria-hidden") === "true" || !!c.closest("[aria-hidden=true]"), label: c.getAttribute("aria-label") || c.getAttribute("role") || "", inner: c.textContent.trim().length, onScreen: r.bottom > 0 && r.top < innerHeight, shown: vis(c) }; });
  const media = [...document.querySelectorAll("video,audio")].map((m) => ({ tag: m.tagName.toLowerCase(), autoplay: m.autoplay, muted: m.muted, controls: m.controls, loop: m.loop, playing: !m.paused }));
  const de = document.documentElement;
  return { title: document.title, lang: de.lang, text, hiddenText, h1: h1.length, h1Shown: h1.some(shown), h1Text: (h1[0]?.textContent || "").trim().slice(0, 80),
    links: document.querySelectorAll("a[href]").length, buttons: document.querySelectorAll("button,[role=button]").length, main: !!document.querySelector("main,[role=main]"),
    canvases, modelViewers: [...document.querySelectorAll("model-viewer")].map((m) => ({ alt: m.getAttribute("alt") || "", poster: !!m.getAttribute("poster") })), media,
    cssReducedMotion: /prefers-reduced-motion/.test(rules), focusStyle: /:focus/.test(rules),
    pageScreens: +(de.scrollHeight / innerHeight).toFixed(1), scrollHeight: de.scrollHeight, viewport: [innerWidth, innerHeight],
    overflowX: de.scrollWidth > innerWidth + 1, rootOverflow: getComputedStyle(de).overflowY + "/" + getComputedStyle(document.body).overflowY,
    pauseControl: [...document.querySelectorAll("button,[role=button],[role=switch],input[type=checkbox],a")].some((b) => /pause|stop|motion|animation|effects|play/i.test((b.getAttribute("aria-label") || "") + " " + b.textContent + " " + (b.title || ""))),
    skipLink: [...document.querySelectorAll("a[href^='#']")].some((a) => /skip/i.test(a.textContent)),
    running: document.getAnimations ? document.getAnimations().filter((a) => a.playState === "running" && (() => { try { const t = a.effect.getComputedTiming(); return t.iterations === Infinity || t.duration * (t.iterations || 1) > 5000; } catch { return false; } })()).length : 0,
    probe: window.__imm ? { media: [...new Set(window.__imm.media)].filter((q) => /reduced|contrast|hover|pointer/.test(q)), lostHook: window.__imm.lostHook, visHook: window.__imm.visHook, io: window.__imm.io, wheelBlock: window.__imm.wheelBlock, contexts: window.__imm.ctx.length } : null };
})()`;

// Adds up the text a scripted visitor gets to see while scrolling (reveal-on-scroll content counts once it shows).
const SEEN = String.raw`(() => {
  const S = window.__immSeen || (window.__immSeen = { set: new WeakSet(), n: 0 });
  const shown = (e) => { for (let n = e; n && n.nodeType === 1; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return false; } return true; };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) { const t = n.textContent.trim(); if (!t || S.set.has(n) || !n.parentElement || n.parentElement.closest("script,style,noscript,template,canvas,svg")) continue; if (shown(n.parentElement)) { S.set.add(n); S.n += t.length; } }
  return S.n;
})()`;

// How many elements keep changing place with no input. Three looks, 0.45s apart: an element counts only if it moved in BOTH gaps.
// So a ticking clock, a filling bar, or live data that shifts the layout once is not movement; a drifting or sliding element is.
const MOVERS = String.raw`(async () => {
  const els = [...document.body.querySelectorAll("*")].filter((e) => { const r = e.getBoundingClientRect(); return r.width * r.height > 400 && r.bottom > 0 && r.top < innerHeight; }).slice(0, 2500);
  const snap = () => els.map((e) => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  const wait = () => new Promise((r) => setTimeout(r, 450)), far = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) > 1.5;
  const a = snap(); await wait(); const b = snap(); await wait(); const c = snap();
  return a.filter((p, i) => far(p, b[i]) && far(b[i], c[i])).length;
})()`;

// Text that sits straight on the scene with no surface of its own behind it. Not scored: it needs a look in the screenshots.
const OVER = String.raw`(() => {
  const shown = (e) => { for (let n = e; n && n.nodeType === 1; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return false; } return true; };
  const cvs = [...document.querySelectorAll("canvas")].filter((c) => c.width * c.height > 40000 && shown(c)).map((c) => c.getBoundingClientRect()).filter((r) => r.bottom > 0 && r.top < innerHeight);
  if (!cvs.length) return { n: 0, samples: [] };
  let n = 0; const samples = [];
  for (const e of document.body.querySelectorAll("h1,h2,h3,h4,p,a,li,button,label,span,dt,dd")) {
    if (![...e.childNodes].some((t) => t.nodeType === 3 && t.textContent.trim().length > 1)) continue;
    const r = e.getBoundingClientRect(); if (r.width < 2 || r.bottom <= 0 || r.top >= innerHeight || !shown(e)) continue;
    if (!cvs.some((c) => { const w = Math.min(r.right, c.right) - Math.max(r.left, c.left), h = Math.min(r.bottom, c.bottom) - Math.max(r.top, c.top); return w > 0 && h > 0 && w * h > r.width * r.height * 0.5; })) continue;
    let solid = false;
    for (let p = e; p && p !== document.body; p = p.parentElement) { if (p.querySelector("canvas")) break; const cs = getComputedStyle(p), m = cs.backgroundColor.match(/[\d.]+/g) || []; const alpha = m.length > 3 ? +m[3] : m.length === 3 ? 1 : 0; if (alpha > 0.6 || (cs.backdropFilter && cs.backdropFilter !== "none")) { solid = true; break; } }
    if (!solid) { n++; if (samples.length < 3) samples.push(e.textContent.trim().slice(0, 32)); }
  }
  return { n, samples };
})()`;

const PEAK = `window.__imm ? { draws: Math.max(window.__imm.maxD, window.__imm.fd), tris: Math.max(window.__imm.maxT, window.__imm.ft) } : { draws: 0, tris: 0 }`;   // the busiest single frame so far

async function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pending = new Map(), listeners = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } else listeners.forEach((f) => f(d)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); setTimeout(() => { if (pending.delete(i)) r({ error: { message: method + " timed out" } }); }, 20000); });
  return { send, on: (f) => listeners.push(f), close: () => ws.close() };
}

const result = { page: target, passes: {}, checks: [], notes: [] };
try {
  let targets; for (let i = 0; i < 60; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); break; } catch { await sleep(200); } }
  const c = await cdp(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  for (const d of ["Page", "Runtime", "Network"]) await c.send(d + ".enable");
  await c.send("Page.setLifecycleEventsEnabled", { enabled: true });
  c.on((d) => { if (d.method === "Page.javascriptDialogOpening") c.send("Page.handleJavaScriptDialog", { accept: true }); });

  let net = {}, errors = [], fcp = 0;
  c.on((d) => {
    const p = d.params;
    if (d.method === "Network.requestWillBeSent") net[p.requestId] = { url: p.request.url, type: p.type, start: p.timestamp, bytes: 0, data: 0 };
    else if (d.method === "Network.dataReceived" && net[p.requestId]) net[p.requestId].data += p.dataLength;
    else if (d.method === "Network.loadingFinished" && net[p.requestId]) net[p.requestId].bytes = p.encodedDataLength;
    else if (d.method === "Page.lifecycleEvent" && p.name === "firstContentfulPaint" && !fcp) fcp = p.timestamp;
    else if (d.method === "Runtime.exceptionThrown") errors.push((p.exceptionDetails.exception?.description || p.exceptionDetails.text || "error").split("\n")[0].slice(0, 160));
  });
  const ev = async (expression) => { const r = await c.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }); return r.result?.result?.value; };
  const shot = async (name) => { const r = await c.send("Page.captureScreenshot", { format: "png" }); if (r.result?.data) { writeFileSync(join(outDir, name + ".png"), Buffer.from(r.result.data, "base64")); return r.result.data; } return ""; };
  const scrollTo = (frac) => ev(`window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * ${frac}, behavior: "instant" }); scrollY`);
  const sample = async (ms) => { const a = await ev("({...window.__imm, ctx: 0, media: 0})"); await sleep(ms); const b = await ev("({...window.__imm, ctx: 0, media: 0})"); if (!a || !b) return null;
    const frames = b.frames - a.frames, s = ms / 1000; return { framesPerSec: +(frames / s).toFixed(1), drawsPerFrame: frames ? Math.round((b.draws - a.draws) / frames) : 0, trisPerFrame: frames ? Math.round((b.tris - a.tris) / frames) : 0, rafPerSec: +((b.raf - a.raf) / s).toFixed(1) }; };
  const wheel = async (delta) => { const v = await ev("[innerWidth, innerHeight]"); await c.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: v[0] / 2, y: v[1] / 2, deltaX: 0, deltaY: delta }); };

  let scripts = [];
  async function open({ width, height, dpr, mobile, reduced = false, noGL = false, noJS = false }) {
    for (const s of scripts) await c.send("Page.removeScriptToEvaluateOnNewDocument", { identifier: s }); scripts = [];
    net = {}; errors = []; fcp = 0;
    await c.send("Page.navigate", { url: "about:blank" }); await sleep(150);
    await c.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: dpr, mobile });
    await c.send("Emulation.setTouchEmulationEnabled", { enabled: mobile });
    await c.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }, ...(scheme ? [{ name: "prefers-color-scheme", value: scheme }] : [])] });
    await c.send("Emulation.setScriptExecutionDisabled", { value: noJS });
    if (!noJS) { const r = await c.send("Page.addScriptToEvaluateOnNewDocument", { source: (noGL ? "window.__immNoGL = true;" : "") + PROBE }); if (r.result?.identifier) scripts.push(r.result.identifier); }
    net = {}; errors = []; fcp = 0;
    const loaded = new Promise((r) => { c.on((d) => { if (d.method === "Page.loadEventFired") r(); }); setTimeout(r, 15000); });
    await c.send("Page.navigate", { url: target }); await loaded; await sleep(settle);
  }
  const weigh = () => {
    const reqs = Object.values(net).filter((r) => !r.url.startsWith("data:") && !r.url.startsWith("about:")), size = (r) => r.bytes || r.data;
    const sum = (f) => reqs.filter(f).reduce((n, r) => n + size(r), 0), is3d = (r) => /\.(glb|gltf|bin|ktx2|hdr|exr|drc|basis|wasm)(\?|$)/i.test(r.url);
    const early = (r) => fcp && r.start <= fcp;
    return { requests: reqs.length, totalKB: Math.round(sum(() => true) / 1024), scriptKB: Math.round(sum((r) => r.type === "Script") / 1024), imageKB: Math.round(sum((r) => r.type === "Image") / 1024), fontKB: Math.round(sum((r) => r.type === "Font") / 1024),
      assets3dKB: Math.round(sum(is3d) / 1024), mediaKB: Math.round(sum((r) => r.type === "Media") / 1024), scriptBeforePaintKB: fcp ? Math.round(sum((r) => r.type === "Script" && early(r)) / 1024) : null,
      beforePaintKB: fcp ? Math.round(sum(early) / 1024) : null, biggest: reqs.sort((a, b) => size(b) - size(a)).slice(0, 4).map((r) => `${Math.round(size(r) / 1024)} KB ${r.url.split("/").pop().split("?")[0].slice(0, 40) || r.url.slice(0, 40)}`) };
  };

  // ---- 1. desktop, everything on ----
  await open({ width: 1440, height: 900, dpr: 1, mobile: false });
  const D = result.passes.desktop = { facts: await ev(FACTS), weight: weigh(), errors: [...errors] };
  await shot("desktop-0-top");
  D.early = await sample(1500);
  if (posterPath) {                                                                    // the scene alone, as drawn, on the page background: the honest fallback image
    const box = await ev(`(() => { const c = [...document.querySelectorAll("canvas")].filter((c) => c.width * c.height > 40000).sort((a, b) => b.width * b.height - a.width * a.height)[0]; if (!c) return null;
      c.setAttribute("data-imm-poster", ""); const st = document.createElement("style"); st.id = "imm-poster-style";
      st.textContent = "body{visibility:hidden!important}[data-imm-poster]{visibility:visible!important}"; document.head.append(st);
      const r = c.getBoundingClientRect(); return { x: Math.max(0, r.left), y: Math.max(0, r.top + scrollY), width: Math.min(r.width, innerWidth), height: Math.min(r.height, innerHeight) }; })()`);
    if (box && box.width > 8 && box.height > 8) { await sleep(200); const r = await c.send("Page.captureScreenshot", { format: "png", clip: { ...box, scale: 1 } }); if (r.result?.data) { writeFileSync(resolve(posterPath), Buffer.from(r.result.data, "base64")); result.poster = resolve(posterPath); } }
    await ev(`document.getElementById("imm-poster-style")?.remove(); document.querySelector("[data-imm-poster]")?.removeAttribute("data-imm-poster")`);
  }
  D.over = await ev(OVER);
  const screens = Math.min(30, Math.ceil(D.facts.pageScreens / 0.8));                 // walk the page once, so scroll-revealed content gets its chance
  for (let i = 0; i <= screens; i++) { await ev(`window.scrollTo({ top: ${i} * innerHeight * 0.8, behavior: "instant" })`); await sleep(140); D.seenText = await ev(SEEN); }
  await scrollTo(0); await sleep(400);
  const steps = [0.25, 0.5, 0.75, 1];
  for (let i = 0; i < steps.length; i++) { await scrollTo(steps[i]); await sleep(900); await shot(`desktop-${i + 1}-scroll-${steps[i] * 100}`); const o = await ev(OVER); if (o && o.n > (D.over?.n || 0)) D.over = { ...o, at: steps[i] * 100 + "% scroll" }; }
  D.offscreenCanvas = (await ev(FACTS)).canvases.filter((cv) => cv.shown && !cv.onScreen).length; D.offscreen = D.offscreenCanvas ? await sample(1500) : null;
  await scrollTo(0); await sleep(600);
  await wheel(400); await sleep(250); const y1 = await ev("scrollY"); await sleep(1500); const y2 = await ev("scrollY");
  D.wheel = { after250ms: Math.round(y1), settled: Math.round(y2), asked: 400 };
  await scrollTo(0); await sleep(6000); D.rest = await sample(1500);   // 6s with no input: has the ambient motion come to rest?
  const tabs = []; for (let i = 0; i < 3; i++) { await c.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 }); await c.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 }); await sleep(80);
    tabs.push(await ev(`(() => { const e = document.activeElement; if (!e || e === document.body) return "(nothing)"; const r = e.getBoundingClientRect(); return e.tagName.toLowerCase() + " \"" + (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 30) + "\"" + (r.width < 2 ? " (invisible)" : ""); })()`)); }
  D.tabStops = tabs;
  D.peak = await ev(PEAK);
  const before = errors.length;
  D.contextLoss = await ev(`(() => { const s = window.__imm; if (!s || !s.ctx.length) return null; let n = 0; for (const g of s.ctx) { const e = g.getExtension("WEBGL_lose_context"); if (e && !g.isContextLost()) { e.loseContext(); n++; } } return n; })()`);
  if (D.contextLoss) { await sleep(900); await shot("desktop-5-after-context-loss"); D.contextLossErrors = errors.slice(before); }
  D.errors = [...new Set(errors.slice(0, before))];

  // ---- 2. phone ----
  await open({ width: 390, height: 844, dpr: 3, mobile: true });
  const P = result.passes.phone = { facts: await ev(FACTS), errors: [...new Set(errors)] };
  await shot("phone-0-top"); P.early = await sample(1500);
  await scrollTo(0.5); await sleep(900); await shot("phone-1-middle"); await scrollTo(1); await sleep(900); await shot("phone-2-end");
  P.peak = await ev(PEAK);

  // ---- 3. reduced motion ----
  await open({ width: 1440, height: 900, dpr: 1, mobile: false, reduced: true });
  const R = result.passes.reducedMotion = { facts: await ev(FACTS), errors: [...new Set(errors)] };
  await sleep(1500); R.idle = await sample(2000);
  const a = await shot("reduced-0-top"); R.movers = await ev(MOVERS); const b = await c.send("Page.captureScreenshot", { format: "png" }); R.stillFrame = a === b.result?.data;
  await wheel(400); await sleep(250); const r1 = await ev("scrollY"); await sleep(1500); const r2 = await ev("scrollY"); R.wheel = { after250ms: Math.round(r1), settled: Math.round(r2) };
  await scrollTo(0.5); await sleep(900); await shot("reduced-1-middle"); R.afterScroll = await sample(1500);

  // ---- 4. no WebGL ----
  await open({ width: 1440, height: 900, dpr: 1, mobile: false, noGL: true });
  const G = result.passes.noWebGL = { facts: await ev(FACTS), errors: [...new Set(errors)] };
  await shot("nowebgl-0-top"); await scrollTo(0.5); await sleep(700); await shot("nowebgl-1-middle");

  // ---- 5. no JavaScript ----
  await open({ width: 1440, height: 900, dpr: 1, mobile: false, noJS: true });
  await c.send("Emulation.setScriptExecutionDisabled", { value: false });
  const J = result.passes.noJS = { facts: await ev(FACTS) };
  await shot("nojs-0-top");
  c.close();

  // ---- verdicts ----
  const check = (points, ok, name, detail, fix) => result.checks.push({ points, ok: ok === null ? null : !!ok, name, detail, fix });
  const f = D.facts, w = D.weight, hasScene = f.canvases.length > 0 || f.modelViewers.length > 0 || (f.probe && f.probe.contexts > 0);
  const textRatio = (x) => (f.text ? x.facts.text / f.text : 1), seen = Math.max(D.seenText || 0, f.text);
  check(15, appMode ? null : J.facts.h1Shown && J.facts.text >= seen * 0.7, "Content is in the HTML (JavaScript off)", appMode ? "skipped: app window" : `${J.facts.text} characters visible with scripts off, of ${seen} a scripted visitor sees while scrolling; h1 ${J.facts.h1 ? (J.facts.h1Shown ? "visible" : "HIDDEN") : "missing"}`, "Write the headings, copy and links as plain HTML. Never start content at opacity 0 waiting for a script: add the hidden state from JavaScript (for example a class on <html>), so the page reads without it.");
  check(15, !G.errors.length && G.facts.h1Shown && textRatio(G) >= 0.9, "Works without WebGL / WebGPU", `${G.errors.length} error(s)${G.errors[0] ? ": " + G.errors[0] : ""}; ${G.facts.text} of ${f.text} characters visible`, "Test for the context before building the scene; on failure leave the poster or CSS fallback in place and skip the scene code (assets/scene-shell.js does this).");
  const moving = R.idle && (R.idle.framesPerSec > 1.5 || R.afterScroll?.framesPerSec > 1.5), cssMoving = R.facts.running > 0, smooth = Math.abs(R.wheel.settled - R.wheel.after250ms) > 60;
  const reducedKnown = f.cssReducedMotion || (f.probe && f.probe.media.some((q) => /reduced-motion/.test(q)));
  check(15, !moving && !cssMoving && !smooth && !R.movers && (reducedKnown || !hasScene), "Reduced motion: the page holds still", `${R.idle?.framesPerSec ?? 0} scene frames/s when idle, ${R.movers || 0} element(s) changing place, ${R.facts.running} looping or long CSS animation(s), smooth-scroll ${smooth ? "still on" : "off"}${R.stillFrame ? "" : "; the picture still changes between two screenshots (fine if that is live data, a clock or a video the person started)"}${reducedKnown ? "" : "; the page never asks for prefers-reduced-motion"}`, "Under prefers-reduced-motion draw single still frames (one per beat), turn off parallax, scrubbing, smooth-scroll and looping CSS animation, and keep short fades only.");
  const pre = w.scriptBeforePaintKB;
  check(10, pre === null ? null : pre <= 170, "Little script before first paint", pre === null ? "first paint not observed" : `${pre} KB of script requested before first paint (budget 170 KB); ${w.beforePaintKB} KB in all`, "Load the 3D engine with a dynamic import() after first paint (or when the scene is near the viewport). Keep the heading as real text so it paints first.");
  check(10, w.totalKB <= 4096, "Page weight", `${w.totalKB} KB total (script ${w.scriptKB}, images ${w.imageKB}, 3D assets ${w.assets3dKB}, fonts ${w.fontKB}); biggest: ${w.biggest.join("; ")}`, "Budget: first scene under about 1.5 MB on phones and 4 MB on desktop. Compress models (meshopt or Draco) and textures (KTX2 / WebP), cut texture size, lazy-load what is below the fold.");
  const pc = P.facts.canvases.filter((x) => x.shown), worst = pc.reduce((m, x) => Math.max(m, x.ratio), 0), mp = pc.reduce((m, x) => m + x.megapixels, 0);
  check(5, !pc.length ? null : worst <= 2.05 && mp <= 3.2, "Phone: pixel ratio is capped", pc.length ? `canvas draws at ${worst}x on a 3x screen, ${mp.toFixed(1)} megapixels` : "no canvas on the phone view", "Cap the pixel ratio at 1.5 on touch screens (2 at most) and lower it when frames get slow. A 3x canvas draws 9 pixels for every CSS pixel.");
  check(5, !P.facts.overflowX, "Phone: no sideways scroll", P.facts.overflowX ? "the page is wider than 390px" : "fits 390px", "Give the scene host overflow: hidden and min-width: 0; size the canvas from its box, not from the window.");
  const wl = D.wheel, scrollable = f.scrollHeight > f.viewport[1] + 200, native = !scrollable || (wl.settled >= 200 && wl.settled <= 640);
  check(10, native, "Scrolling stays native", scrollable ? `a 400px wheel step moved the page ${wl.settled}px${f.probe?.wheelBlock ? "; a wheel/touch listener blocks the default" : ""}; root overflow ${f.rootOverflow}` : "page does not scroll", "Never change scroll speed or direction and never replace the scrollbar with a transform. Pin with position: sticky and read the scroll position; let the browser do the scrolling.");
  check(5, D.offscreen ? D.offscreen.framesPerSec <= 1.5 : null, "Scene pauses off screen", D.offscreen ? `${D.offscreen.framesPerSec} frames/s drawn while the canvas is scrolled out of view` : "the canvas is always on screen (or there is none)", "Stop the render loop with an IntersectionObserver when the scene leaves the viewport, and on visibilitychange when the tab is hidden.");
  const resting = D.rest && D.rest.framesPerSec <= 1.5;
  check(5, !hasScene ? null : resting || f.pauseControl, "Ambient motion rests or can be paused", D.rest ? `${D.rest.framesPerSec} frames/s still being drawn about 7s after load with no input${f.pauseControl ? "; a pause control was found" : ""}` : "no scene", "Anything that moves by itself for more than 5 seconds needs a visible pause control (WCAG 2.2.2), or should settle and render on demand.");
  check(5, D.contextLoss ? D.contextLossErrors.length === 0 && f.probe.lostHook : null, "Survives a lost graphics context", D.contextLoss ? `${D.contextLossErrors.length} error(s) after the context was lost; webglcontextlost handler ${f.probe.lostHook ? "present" : "MISSING"}` : "no WebGL context to test", "Listen for webglcontextlost (preventDefault, stop the loop, show the fallback) and rebuild on webglcontextrestored. Phones drop contexts when memory is tight.");
  const scored = result.checks.filter((k) => k.ok !== null), max = scored.reduce((n, k) => n + k.points, 0), got = scored.filter((k) => k.ok).reduce((n, k) => n + k.points, 0);
  result.score = max ? Math.round((got / max) * 100) : 100;

  const note = (t) => result.notes.push(t);
  if (!hasScene) note("No canvas, WebGL context or <model-viewer> was found: the page may be pure CSS (fine), or the scene did not start in headless Chrome.");
  if (f.h1 !== 1 && !appMode) note(`${f.h1} <h1> elements: use exactly one.`);
  for (const cv of f.canvases) if (!cv.hidden && !cv.label && !cv.inner) note("A canvas is neither aria-hidden (decorative) nor labelled (meaningful): pick one. Decorative scenes get aria-hidden=\"true\"; meaningful ones need a text alternative beside them.");
  for (const mv of f.modelViewers) if (!mv.alt) note("<model-viewer> has no alt text.");
  for (const m of f.media) if (m.autoplay && (!m.muted || (m.loop && !m.controls))) note(`A ${m.tag} autoplays ${m.muted ? "on a loop with no controls" : "with sound"}: sound never starts by itself, and looping video needs a pause control.`);
  if (f.pageScreens > 9) note(`The page is ${f.pageScreens} screens long: check that every beat earns its scroll length and offer a skip link.`);
  if (f.pageScreens > 5 && !f.skipLink && hasScene) note("Long scroll story with no skip link: add \"Skip the story\" to jump to the content after it.");
  if (!f.focusStyle) note("No :focus style in the CSS: keyboard users cannot see where they are.");
  if (!f.main) note("No <main> landmark.");
  if (D.tabStops.some((t) => /invisible|nothing/.test(t))) note("First Tab stops: " + D.tabStops.join(" -> ") + ". Focus should land on visible links and buttons in reading order.");
  const peak = [D.peak, P.peak].filter(Boolean).reduce((m, s) => ({ draws: Math.max(m.draws, s.draws), tris: Math.max(m.tris, s.tris) }), { draws: 0, tris: 0 });
  if (peak.draws > 100) note(`${peak.draws} draw calls per frame: aim for under 100 on phones (merge meshes, instance repeats, share materials).`);
  if (peak.tris > 150000) note(`${peak.tris.toLocaleString("en")} triangles per frame: aim for under about 100,000 on phones (simplify, use normal maps, lower detail far away).`);
  if (hasScene && f.probe && !f.probe.visHook && !resting) note("No visibilitychange listener: the scene may keep drawing in a hidden tab.");
  if (D.errors.length) note("Console errors with everything on: " + D.errors.slice(0, 3).join(" | "));
  if (hasScene) note("Frame rate was not measured (headless Chrome draws in software). Test on a mid-range phone, or throttle the CPU 4x in DevTools, and aim for a steady 60 fps.");
  if (D.over?.n) note(`${D.over.n} piece(s) of text sit straight on the scene with no surface behind them${D.over.at ? " at " + D.over.at : " at the top"} (for example "${D.over.samples.join('", "')}"). Contrast cannot be measured over a moving image: open that screenshot and check no text crosses the subject; give text a lane, a surface or a scrim.`);
  else if (hasScene) note("No text was found straight on the scene. Still check the screenshots: the subject must not pass behind copy at any scroll position.");
  if (result.poster) note("Poster saved: " + result.poster + ". It shows the scene alone on the page background: use it as the fallback image, and save one per theme if light and dark differ.");

  // ---- report ----
  console.log(`\n${target}\n  Immersive check: ${result.score}/100 (measured parts only)\n`);
  for (const k of result.checks) console.log(`  ${k.ok === null ? "  -  " : k.ok ? " pass" : " FAIL"}  ${k.name}${k.ok === null ? " (not applicable)" : ""}\n         ${k.detail}${k.ok === false ? "\n         Fix: " + k.fix : ""}`);
  console.log(`\n  Scene: ${f.canvases.length} canvas(es), ${peak.draws} draw calls and ${peak.tris.toLocaleString("en")} triangles in the busiest frame, page is ${f.pageScreens} screens long.`);
  if (result.notes.length) console.log("\n  Notes:\n" + result.notes.map((n) => "   - " + n).join("\n"));
  console.log(`\n  Screenshots (open them all, phone as strictly as desktop): ${outDir}\n    desktop-*  phone-*  reduced-*  nowebgl-*  nojs-*`);
  if (jsonPath) writeFileSync(resolve(jsonPath), JSON.stringify(result, null, 2));
} catch (err) {
  console.log("immersive-check failed:", err?.message || err);
  process.exitCode = 4;
} finally { clearTimeout(kill); chrome.kill(); }
process.exit(process.exitCode || 0);
