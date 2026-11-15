// scene-shell.js (ui-craft, immersive-web skill). MIT licence. No dependencies.
// The life cycle every real-time scene needs, written once. It works with three.js, raw WebGL, WebGPU or a 2D canvas:
// you supply init / frame / resize, the shell supplies the rules.
//
//   - the fallback inside the host stays visible until the first frame is drawn, and comes back if the scene fails
//   - prefers-reduced-motion: the scene draws single still frames, never a running loop
//   - no WebGL, a thrown init, or a lost context: the fallback shows, the page keeps working
//   - nothing runs while the scene is off screen or the tab is hidden
//   - renders on demand: frame() returns true only while something is still moving
//   - pixel ratio is capped, then lowered step by step if frames get slow
//
//   <div class="scene" id="hero-scene" aria-hidden="true">
//     <img class="scene-fallback" src="hero-poster.avif" alt="">      <!-- or CSS / SVG art -->
//   </div>
//
//   const scene = mountScene(document.getElementById("hero-scene"), {
//     init(canvas) { /* create renderer or context; may be async (lazy import of a library goes here) */ },
//     resize(width, height, pixelRatio) { /* renderer.setPixelRatio(pixelRatio); renderer.setSize(width, height, false) */ },
//     frame(time, delta, state) { /* draw; state.reduced is true for still frames; return true to keep animating */ },
//     dispose() { /* free geometries, materials, textures, the renderer */ },
//   });
//   scene.invalidate();        // ask for a frame after any change (scroll, theme, pointer)
//
// CSS the shell expects:
//   .scene { position: relative }  .scene canvas, .scene-fallback { position: absolute; inset: 0; width: 100%; height: 100% }
//   .scene canvas { opacity: 0; transition: opacity var(--dur-slow) var(--ease-out) }
//   .scene[data-scene="live"] canvas, .scene[data-scene="still"] canvas { opacity: 1 }
//   .scene[data-scene="live"] .scene-fallback, .scene[data-scene="still"] .scene-fallback { visibility: hidden }

export function supports(kind = "webgl") {
  if (kind === "webgpu") return "gpu" in navigator;
  if (kind === "2d") return true;
  try {
    const c = document.createElement("canvas"), gl = c.getContext(kind === "webgl2" ? "webgl2" : "webgl", { failIfMajorPerformanceCaveat: false });
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();   // hand the test context straight back
    return true;
  } catch { return false; }
}

// A coarse guess at the device, to pick a starting quality. Measure real frame times before trusting it.
export function deviceTier() {
  const nav = navigator, coarse = matchMedia("(pointer: coarse)").matches;
  if (nav.connection?.saveData || matchMedia("(prefers-reduced-data: reduce)").matches) return "low";
  if ((nav.deviceMemory && nav.deviceMemory <= 4) || (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4)) return "low";
  return coarse ? "mid" : "high";
}

export function mountScene(host, hooks, options = {}) {
  const opt = { need: "webgl", maxPixelRatio: 2, touchMaxPixelRatio: 1.5, minScale: 0.5, lazy: true, rootMargin: "200px", slowFrameMs: 24, ...options };
  const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const state = { mode: "fallback", reduced: opt.reduced ?? reducedQuery.matches, visible: false, width: 0, height: 0, pixelRatio: 1, scale: 1, tier: deviceTier() };
  let canvas = host.querySelector("canvas"), ready = false, starting = false, dead = false, wired = false, raf = 0, last = 0, wanted = false, slow = 0, quick = 0;
  const setMode = (m) => { state.mode = m; host.dataset.scene = m; };
  setMode("fallback");

  const cap = () => Math.min(devicePixelRatio || 1, matchMedia("(pointer: coarse)").matches ? opt.touchMaxPixelRatio : opt.maxPixelRatio) * (state.tier === "low" ? 0.75 : 1);
  function measure() {
    const r = host.getBoundingClientRect(), w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height)), pr = Math.max(0.5, cap() * state.scale);
    if (w === state.width && h === state.height && pr === state.pixelRatio) return;
    state.width = w; state.height = h; state.pixelRatio = pr;
    if (ready) { hooks.resize?.(w, h, pr); invalidate(); }
  }

  function tick(now) {
    raf = 0;
    if (!ready || dead || !state.visible || document.hidden) return;
    const delta = last ? Math.min(100, now - last) : 16.7; last = now; wanted = false;
    let more = false;
    try { more = hooks.frame(now, delta, state) === true; } catch (err) { fail(err); return; }
    if (state.mode === "fallback") setMode(state.reduced ? "still" : "live");
    if (state.reduced) { last = 0; return; }                  // still frames only: never loop
    if (more) {                                               // adapt resolution only while the loop is really running
      if (delta > opt.slowFrameMs) { quick = 0; if (++slow > 20 && state.scale > opt.minScale) { state.scale = Math.max(opt.minScale, state.scale * 0.85); slow = 0; measure(); } }
      else if (delta < 13) { slow = 0; if (++quick > 240 && state.scale < 1) { state.scale = Math.min(1, state.scale / 0.85); quick = 0; measure(); } }
    } else last = 0;
    if (more || wanted) raf = requestAnimationFrame(tick);
  }
  function invalidate() { wanted = true; if (!raf && ready && !dead && state.visible && !document.hidden) raf = requestAnimationFrame(tick); }

  function fail(err) {
    if (err) console.warn("Scene stopped, showing the fallback:", err);
    ready = false; cancelAnimationFrame(raf); raf = 0; setMode("fallback");
  }

  async function start() {
    if (ready || starting || dead || opt.disabled) return;
    if (!supports(opt.need)) return;                          // fallback stays
    starting = true;
    try {
      if (!canvas) { canvas = document.createElement("canvas"); canvas.setAttribute("aria-hidden", "true"); host.append(canvas); }
      if (!wired) {                                           // once per canvas, however often the scene restarts
        wired = true;
        canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); fail(); });
        canvas.addEventListener("webglcontextrestored", () => { if (!ready && !starting) start(); });
      }
      const ok = await hooks.init(canvas, state);
      if (ok === false || dead) { starting = false; return; }
      ready = true; state.width = 0; measure();             // measure() calls resize() and asks for the first frame
    } catch (err) { fail(err); }
    starting = false;
  }

  const io = new IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting;
    if (state.visible) { if (!ready) start(); else { last = 0; invalidate(); } }
  }, { rootMargin: opt.lazy ? opt.rootMargin : "100000px" });
  io.observe(host);
  const ro = new ResizeObserver(measure); ro.observe(host);
  const onVisibility = () => { if (!document.hidden) { last = 0; invalidate(); } };
  const onMotion = () => { if (opt.reduced === undefined) { state.reduced = reducedQuery.matches; last = 0; invalidate(); } };
  document.addEventListener("visibilitychange", onVisibility);
  reducedQuery.addEventListener("change", onMotion);

  return {
    state, invalidate,
    setReduced(v) { state.reduced = !!v; opt.reduced = !!v; last = 0; if (ready) setMode(v ? "still" : "live"); invalidate(); },
    destroy() {
      dead = true; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility); reducedQuery.removeEventListener("change", onMotion);
      if (ready) { try { hooks.dispose?.(); } catch {} }
      ready = false; setMode("fallback");
    },
  };
}
