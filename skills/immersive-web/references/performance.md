# Performance budgets

Load this when you plan, measure or speed up a 3D, shader or scroll-driven page. Speed is part of the look: a beautiful scene that stutters reads as broken.

## The idea (any medium)

- **Decide the budget before building**, the way a film has a running time. Without one, every effect is "just a bit more".
- **The content never waits for the effect.** Words and the main action arrive first; the scene joins when it is ready.
- **Design for the weakest device you care about**, then let stronger ones have more. Not the other way round.
- **Pay only when something changes.** A still scene should cost nothing: no drawing, no battery.
- **Degrade in steps, not off a cliff.** Lower resolution, then fewer effects, then a still image. Each step should still look intended.
- **Measure on the real thing.** A laptop tells you nothing about a three-year-old phone that is warm and at 20% battery.
- **Heat and battery are part of the experience.** A page that makes a phone hot is a bad page.

## On the web

### 1. Loading: text first, engine later

| Budget | Target |
|---|---|
| Largest Contentful Paint | 2.5 s or less on a mid-range phone; it should be the headline or the poster, never the canvas |
| Interaction to Next Paint | 200 ms or less: do not block the main thread while the scene starts |
| Layout shift | 0.1 or less: the scene's box has a fixed size or `aspect-ratio` from the first paint |
| Script requested before first paint | under 170 KB compressed |
| First scene payload (engine + models + textures) | under 1.5 MB on phones, 4 MB on desktop (working targets) |

How:

- Ship the page as HTML and CSS. The scene's place holds a **poster** (AVIF/WebP, `width` and `height` set) or CSS art.
- Load the engine with a dynamic `import()` **inside the scene's `init()`**, started when the stage is near the viewport (the shell's `IntersectionObserver` does this). three.js is about 180 KB gzip in full; a bundler's tree-shaking and importing only what you use lowers that.
- Put models and textures behind the same lazy start. Preload nothing 3D in `<head>`.
- Never a blocking preloader. If a large model needs seconds, show the poster and a thin progress line on the stage; the rest of the page works meanwhile.
- Compile shaders and upload textures before fading the canvas in (three.js `renderer.compileAsync(scene, camera)`), so the first visible frame does not hitch.
- Spread heavy start-up work across frames; avoid one long task of several hundred milliseconds.
- Respect `navigator.connection?.saveData`: keep the poster and skip the scene.

### 2. Frames: what costs time

In rough order of how often each is the real problem:

1. **Too many pixels.** Fragment work scales with resolution. Cap the pixel ratio: 2 on desktop, 1.5 on touch, lower when slow. A 3x phone at full resolution draws 9 pixels for every CSS pixel. Never pass `devicePixelRatio` straight through.
2. **Overdraw and transparency.** Stacked transparent layers, big particles, full-screen passes: each redraws the screen. Draw opaque things front to back; keep transparent things few and small.
3. **Post-processing.** Every pass is another full screen. 0-1 on phones.
4. **Shadows and lights.** Each shadow-casting light renders the scene again; a point light, six times. One shadow map, or baked.
5. **Draw calls.** Each object-material pair is a call. Working targets: under 100 on phones, under 300 on desktop. Merge static geometry, instance repeats, share materials and atlas textures.
6. **Triangles.** Rarely the first limit today, but keep the hero to 20-60k on phones, about 100k on desktop, and whole scenes within a few hundred thousand.
7. **JavaScript per frame.** No allocations in the loop (reuse vectors and matrices), no layout reads (`getBoundingClientRect`, `offsetHeight`), no DOM writes per frame beyond a transform.

Frame budget: 16.7 ms at 60 Hz, 8.3 ms at 120 Hz. Aim to use about 10 ms on a mid-range phone, leaving room for the browser. Drive motion by elapsed time so 30, 60 and 120 Hz all look right.

### 3. Render on demand, and stop

- Draw only when something changed. Idle scenes draw zero frames. (`scene-shell.js`: return `true` from `frame()` only while moving; call `invalidate()` on input. React Three Fiber: `frameloop="demand"`.)
- Stop off screen (`IntersectionObserver`) and in hidden tabs (`visibilitychange`).
- Ambient motion fades out within 5 seconds of the last input.
- Update far or small things every second or third frame if they must animate.

### 4. Quality steps

Decide the ladder up front and make each rung look intended:

| Step | Change |
|---|---|
| 0 Full | everything on |
| 1 | pixel ratio down (2 to 1.5 to 1) |
| 2 | post-processing off; shadow map smaller or swapped for a blob shadow |
| 3 | fewer particles or instances, simpler material on secondary objects |
| 4 | ambient motion off: render on demand only |
| 5 | the poster |

- **Start** from a guess: touch device or `deviceMemory <= 4` or `hardwareConcurrency <= 4` starts one or two steps down (`deviceTier()` in the shell). These hints are coarse and missing in some browsers.
- **Then measure**: watch frame time for the first second or two and whenever the scene is animating; step down after about 20 slow frames in a row, step up only after several seconds of fast ones (avoid flip-flopping). The shell does this for pixel ratio; add the other steps for bigger scenes. drei's `PerformanceMonitor` does the same in React.
- Never step during a camera move in a way people can see pop; change resolution, which is hard to notice, first.

### 5. Memory

Phones kill tabs that use too much video memory; the first sign is a lost context.

- Texture memory is width x height x 4 bytes, plus a third for mipmaps: 1024 = about 5.6 MB, 2048 = 22 MB, 4096 = 89 MB, whatever the file size. KTX2 cuts this 4-8x.
- 4096 is the largest size every device must support. Use it rarely.
- Render targets (post-processing, shadow maps) are textures too, at screen size times pixel ratio squared.
- Dispose what you remove: geometries, materials, textures, render targets. three.js does not free them for you.
- Handle `webglcontextlost` (call `preventDefault()`, stop the loop, show the fallback) and `webglcontextrestored` (rebuild). The shell does both.
- Keep to one WebGL context per page where you can.

### 6. Scroll and main thread

- Scroll listeners are passive and only store a number.
- Animate `transform` and `opacity` in CSS; scroll-driven CSS animations run off the main thread.
- Sticky positioning is free. JavaScript pinning and smooth-scroll libraries run code on every frame: one more reason to avoid them.
- Heavy scene logic can move to a worker with `OffscreenCanvas` where supported, but most scenes do not need it once they render on demand.

### 7. Measure

- `node <skill-dir>/scripts/immersive-check.mjs page.html`: page weight, script before first paint, draw calls and triangles per frame, phone pixel ratio, whether the scene pauses off screen and rests, a lost-context test. It does **not** measure frame rate (headless Chrome draws in software).
- Frame rate: Chrome DevTools Performance panel with CPU throttled 4x, or a real mid-range phone over USB. Watch it for a minute: heat builds up.
- three.js: `renderer.info.render.calls` and `.triangles`, `renderer.info.memory`.
- Lighthouse or WebPageTest for LCP, INP and layout shift on a throttled connection.

## Common mistakes

- three.js imported in the page's main bundle. Fix: dynamic import inside `init()`.
- `renderer.setPixelRatio(window.devicePixelRatio)`. Fix: cap it.
- A render loop that never stops. Fix: on demand.
- 4K textures on a model shown 300 px wide. Fix: size to how it is seen; KTX2.
- Bloom, depth of field and shadows on a phone. Fix: the quality ladder.
- Tested only on the developer's laptop. Fix: throttle, or use a real phone.
