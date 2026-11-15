# Research v3: 3D engine and performance
Method: Fetched public pages with a page-reader tool on 2026-11-16. Rules are paraphrased, no long copying.
(verified) = I read it on the page this session. (unverified) = from memory, a search snippet, or a summary that the page text did not show.
Note: the tool returns summaries of pages, so exact wording and some numbers may be slightly off. Re-check key numbers before shipping them as hard law.
Not fetched: threejs.org/manual/en/* (404, but threejs.org/manual/pages/*.html worked), Codrops (403), Khronos wiki (403), drei docs site (404), studio case studies (not reached).

## three.js manual (responsive, rendering on demand, cleanup, optimize lots of objects)
Link: https://threejs.org/manual/pages/responsive.html (same folder: rendering-on-demand.html, cleanup.html, optimize-lots-of-objects.html)
Made by: three.js authors (mrdoob and contributors). Licence: MIT (verified on the repo LICENSE file).
Rules:
- Let CSS decide the canvas size. Read clientWidth/clientHeight and resize the buffer only when they differ. (verified)
- Call renderer.setSize(w, h, false) so three.js does not overwrite the canvas CSS size. (verified)
- After a resize, update camera.aspect and call updateProjectionMatrix(). (verified)
- Rendering at device resolution costs the square of the ratio: 3x ratio means 9x the pixels. For heavy scenes, 1x can be the right choice. (verified)
- The manual advises against renderer.setPixelRatio(devicePixelRatio) because setSize then silently multiplies. It prefers applying the ratio yourself inside the resize function. (verified)
- Cap the total pixel count too, not only the ratio. Manual example cap is 3840x2160. If over, scale both sides by sqrt(max/count). Fractional OS scaling can otherwise give huge buffers. (verified)
- Mostly static scenes: render once, then render only on change (controls change event, resize, loaded asset, GUI change). (verified)
- Queue at most one frame at a time with a "render requested" flag, so many events give one render. (verified)
- With damping on, route through requestAnimationFrame so smoothing continues and no infinite loop appears. (verified)
- Continuous rendering is still right for games and animated art. (verified)
- three.js never frees GPU memory for you. Call dispose() on geometries, materials, textures. Removing a mesh from the scene does not free them. (verified)
- Track what you create (a small tracker) and dispose the group together. For loaded models, walk children and dispose geometry, material and every texture on the material. (verified)
- Each Mesh costs a draw call. Merge static meshes into one geometry (mergeGeometries) when they share one material. Use vertex colours for per-part colour. Trade-off: parts no longer move alone. (verified)
- Merging example: about 19,000 separate boxes ran under 20 fps, one merged mesh ran about 60 fps. (verified; one author machine, so folklore-grade)
- Use InstancedMesh for many copies with their own transform. Not covered on the page. (unverified)
Notable: The manual itself says the default pixel ratio of 1 is often fine, which is stronger than the usual "cap at 2" advice.

## three.js docs (WebGLRenderer, WebGPURenderer, KTX2Loader)
Link: https://threejs.org/docs/pages/WebGLRenderer.html (also WebGPURenderer.html, KTX2Loader.html)
Made by: three.js authors. Licence: MIT.
Rules:
- antialias is off by default. Turn it on only if the look needs it. (verified)
- powerPreference accepts default, low-power, high-performance. (verified)
- renderer.dispose() frees GPU resources when the renderer is no longer used. (verified)
- forceContextLoss() and forceContextRestore() exist to test loss handling. Listening for webglcontextlost/restored is your job. (verified)
- WebGPURenderer uses WebGPU when present and falls back to a WebGL 2 backend on its own. forceWebGL:true forces the fallback. (verified)
- The docs page gives no stability label for WebGPURenderer or TSL. For a client site, stay on WebGLRenderer unless you need compute. (unverified, my judgement)
- KTX2Loader turns Basis Universal textures into the GPU format the device supports. Call detectSupport(renderer) before loading. It needs WebAssembly and a transcoder path (host it yourself or use a CDN). (verified)
- Draco or meshopt for geometry, KTX2 for textures, is the standard asset route. (unverified for meshopt)
Notable: The renderer picks the fallback itself, so you do not need your own WebGPU-or-WebGL switch if you adopt WebGPURenderer.

## React Three Fiber docs (scaling performance, pitfalls, Canvas)
Link: https://r3f.docs.pmnd.rs/advanced/scaling-performance (also /advanced/pitfalls, /api/canvas)
Made by: pmndrs (Poimandres). Licence: MIT (repo licence per drei listing; the docs pages themselves showed none).
Rules:
- Set Canvas frameloop="demand" for idle scenes. Call invalidate() when something changes outside React (camera controls). Many calls give one frame. (verified)
- Canvas default dpr is [1, 2], default frameloop is "always", default renderer has antialias and alpha on, powerPreference high-performance. (verified)
- Keep draw calls under about 1,000 at the very most, ideally a few hundred or fewer. (verified, the docs' own words; not measured)
- Instancing can draw around 100,000 objects in one call. (verified)
- Share geometries and materials. Assets from useLoader are cached. (verified)
- Use LOD: swap to cheaper models by distance (docs example thresholds 0, 10, 20). (verified)
- Load a cheap asset first, then swap in the heavy one with nested Suspense. (verified)
- PerformanceMonitor: averages fps, fires callbacks on incline and decline. Docs example: dpr starts 1.5, drops to 1 on decline, goes to 2 on incline, flip-flops capped at 3 before a fallback. (verified)
- "Regress" pattern: lower quality while the camera moves, restore after a 200 ms rest (defaults current 1, min 0.1, max 1). (verified)
- Do not setState inside useFrame or fast pointer events. Mutate refs. (verified)
- Do not allocate new vectors or objects inside loops. (verified)
- Do not mount and unmount meshes, lights, materials often. Toggle visible instead. (verified)
- Use delta time for movement so speed does not depend on fps. (verified)
- Read fast-changing store values with getState() inside useFrame, not by subscribing. (verified)
- Use startTransition to spread heavy creation across frames. Their test: 510 text meshes at once caused about 1.5 s of jank. (verified)
Notable: R3F claims "no overhead" versus plain three.js but gives no benchmark. The real cost is React re-renders in hot paths.

## Discover three.js, Tips and tricks (Lewy Blue)
Link: https://discoverthreejs.com/tips-and-tricks/
Made by: Lewy Blue. Licence: not stated on the page. The page says the book is open source on GitHub, so check the repo. Treat as read only until checked.
Rules:
- Turn off automatic matrix updates for static objects. Call updateMatrix() only when they move. (verified)
- Transparent objects are slow. Use few. Alpha-test cut-outs are faster. (verified)
- Find the bottleneck: override all materials with a basic one. If fps jumps, you are GPU-bound. If not, CPU-bound. (verified)
- Cap pixel ratio at 2 or 3 on high-density phones (ratios can reach 5). Slight blur, big speed gain. (verified)
- Bake lighting and shadows to avoid many lights. (verified)
- Point-light shadows render the scene six times, directional and spot once. (verified)
- Far objects: use LOD, update them every 2nd or 3rd frame, or use billboards. (verified)
- Draco can shrink glTF files to under 10% of original size. (verified; best case)
- Fewer draw calls is generally better. (verified)
Notable: It allows a DPR cap of 3, which is looser than most phone advice. See conflicts.

## web.dev: Core Web Vitals, optimise LCP, INP
Link: https://web.dev/articles/vitals (also /optimize-lcp, /inp)
Made by: Google Chrome team. Licence: text CC BY 4.0, code samples Apache 2.0 (unverified; from memory of the web.dev footer).
Rules:
- LCP good at 2.5 s or less. Over 4.0 s is poor. (verified)
- INP good at 200 ms or less. Poor over 500 ms. (verified)
- CLS good at 0.1 or less. (verified)
- Judged at the 75th percentile of real page loads, split mobile and desktop. (verified)
- Make the LCP element visible in the first HTML. If script adds or hides it, LCP waits for the script. (verified)
- Never lazy-load the LCP image. (verified)
- Big JS bundles make long tasks on the main thread that delay painting and input. Break them up. (verified)
- Avoid blocking scripts in head. Use defer, async or dynamic import. (verified)
- A canvas that fills the first screen may itself become the LCP candidate. Keep real text and a poster image as the LCP, and mount the canvas after. (unverified, my reading)
Notable: LCP delay parts should be near zero. A script that gates the hero is the classic 3D mistake.

## web.dev: performance budgets 101
Link: https://web.dev/articles/performance-budgets-101
Made by: Google Chrome team. Licence: CC BY 4.0 (unverified).
Rules:
- Starting point: under 170 KB of critical-path resources, compressed and minified, and Time to Interactive under 5 s on a Moto G4 over slow 3G. (verified)
- A product page example: under 170 KB JS on mobile. (verified)
- Set budgets per page type and enforce them in the build (Lighthouse CI, bundlesize). (verified)
- If you go over: optimise it, remove it, or do not add it. (verified)
Notable: three.js alone (about 181 kB gzip, see below) is already over this old 170 KB line. So the engine must load after first paint, never on the critical path.

## web.dev: OffscreenCanvas
Link: https://web.dev/articles/offscreen-canvas
Made by: Google Chrome team. Licence: CC BY 4.0 (unverified).
Rules:
- canvas.transferControlToOffscreen() lets a worker draw the canvas, so a busy main thread does not stop the animation. (verified)
- Support listed: Chrome 69, Edge 79, Firefox 105, Safari 16.4. Feature-detect with 'OffscreenCanvas' in window. (verified)
- three.js expects canvas.style.width and height. In a worker you must stub them. (verified)
- DOM-based texture loading needs workarounds in a worker (use ImageBitmap). (verified in part)
Notable: Worth it only for heavy scenes. For a normal hero it adds complexity. (unverified, my judgement)

## MDN: WebGL best practices
Link: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
Made by: MDN contributors. Licence: CC BY-SA 2.5 for text, CC0 for code samples (unverified, from memory).
Rules:
- Zero WebGL errors in production. Only out-of-memory and context-lost are acceptable. (verified)
- There is no portable way to ask for free video memory. Budget low, handle context loss, offer a lower quality setting. (verified)
- Use compressed textures for colour data (not normals). Basis Universal covers all formats from one file. (verified)
- Mipmaps add about 33% memory. Use them for textures seen in 3D. (verified)
- Avoid blocking calls in the frame: getError, getParameter, CPU readPixels, checkFramebufferStatus. Each can cost 1 ms or more. (verified)
- Batch draws: 1000 sprites in one call, use atlases. (verified)
- Render to a smaller backbuffer and upscale when slow. (verified)
- Guaranteed minimum MAX_TEXTURE_SIZE is 4096 (also cube map and renderbuffer). Do not assume more on weak devices. (verified)
- Clamp anisotropy to min(4, max). (verified)
- Check getExtension() for null and have a fallback. (verified)
- Fractional devicePixelRatio can cause moire. Prefer ResizeObserver with device-pixel-content-box, and listen for DPR changes with matchMedia. (verified)
- Resizing a canvas clears it, so resize just before drawing in the frame, not inside the observer. (verified)
- Avoid RGB formats and alpha:false unless needed. (verified)
- Compile and link shaders in parallel, use KHR_parallel_shader_compile where present. (verified)
Notable: The 4096 figure is a spec minimum, not a promise that 4096 textures are cheap on phones.

## MDN: webglcontextlost event
Link: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
Made by: MDN contributors. Licence: CC BY-SA 2.5 (unverified).
Rules:
- The event fires when the drawing buffer is lost. It does not bubble. isContextLost() reports state. (verified)
- Call event.preventDefault() in the lost handler, otherwise the browser will not restore the context. (unverified; the fetch summary added this from the WebGL spec, not from the MDN page)
- Stop the render loop while lost. Rebuild buffers, textures, programs on webglcontextrestored. JS-side data survives. (unverified, same reason)
- Test with the WEBGL_lose_context extension (loseContext and restoreContext). (verified)
- From the WebGL spec text read via GitHub: browsers may drop and later restore contexts in the background to manage power and memory, even for high-performance requests. (verified)
Notable: In three.js, WebGLRenderer re-uploads its own resources on restore, but your custom state and your loop still need handling. (unverified)

## MDN: device and page signals (deviceMemory, hardwareConcurrency, visibilitychange, IntersectionObserver, prefers-reduced-data)
Link: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory (and Navigator/hardwareConcurrency, Document/visibilitychange_event, IntersectionObserver, CSS prefers-reduced-data)
Made by: MDN contributors. Licence: CC BY-SA 2.5 (unverified).
Rules:
- navigator.deviceMemory gives rough RAM in GB, rounded to a power of 2 and clamped. HTTPS only. Not Baseline, non-standard, imprecise on purpose. Use it only as a hint, with a fallback when missing. (verified)
- navigator.hardwareConcurrency counts logical processors, may under-report, is Baseline widely available. A hint only. (verified)
- Neither tells you about the GPU. A fast-CPU phone can still have a weak GPU. (unverified, my judgement)
- On visibilitychange, read document.visibilityState. Stop the render loop when hidden, resume when visible. (verified)
- IntersectionObserver: pause rendering when the canvas leaves the viewport, resume when it returns. One observer can watch many targets. Keep the callback light. (verified)
- prefers-reduced-data is experimental, "not supported by any user agent" per the page. Do not depend on it. (verified)
- Save-Data header and NetworkInformation.saveData: not covered on the fetched page. Use only as a bonus signal. (unverified)
- prefers-reduced-motion should also stop or slow camera moves and autoplay motion. (unverified here; covered in the repo's motion rules)
Notable: Device-signal APIs are fuzzy or missing. Measuring real frame time beats guessing from specs.

## WebGPU support: caniuse, gpuweb wiki, MDN WebGPU, webgpu.org
Link: https://caniuse.com/webgpu ; https://github.com/gpuweb/gpuweb/wiki/Implementation-Status ; https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API ; https://webgpu.org/
Made by: caniuse contributors, the W3C GPU for the Web group, MDN. Licence: caniuse CC BY 4.0 (unverified); gpuweb wiki and spec under W3C terms (unverified); MDN CC BY-SA.
Rules:
- caniuse (read 2026-11-16) shows about 88.6% global support including partial. Chrome and Edge desktop from 113, Safari 26 (flagged partial), Chrome Android and Safari iOS 26 supported. It lists Firefox as disabled by default. (verified, but see conflicts: the gpuweb wiki says otherwise)
- gpuweb wiki: Chrome shipped on Mac, Windows, ChromeOS since 113. Android on selected GPUs, mostly Android 12+. Linux partial. Firefox shipped on Windows in 141 and on macOS in 145-147. Safari 26 on macOS, iOS, iPadOS, visionOS enabled by default. (verified)
- MDN: WebGPU is "limited availability", not Baseline, HTTPS only. Always check navigator.gpu and await requestAdapter(); the adapter can be null. (verified)
- MDN mentions a "compatibility" feature level for older APIs (GL ES 3.1, D3D11). (verified)
- Sensible fallback: WebGL 2 is everywhere, so ship WebGL 2 as the default, and treat WebGPU as an optional upgrade only when you need compute or its features. (unverified, my judgement)
Notable: Both support tables are time-sensitive and disagree on Firefox. Re-check at build time.

## Bundlephobia: size of the three package
Link: https://bundlephobia.com/package/three
Made by: Bundlephobia. Licence: all rights reserved; read only (the numbers are facts).
Rules:
- three v0.187.0 shows 724.9 kB minified and 181.3 kB gzipped for the whole package. (verified)
- Tree-shaking can cut it, but a normal scene still pulls in most of the renderer. Expect roughly 150-190 kB gzip. (unverified estimate)
- Add loaders (Draco, KTX2 transcoder WASM, GLTFLoader) and the model on top. Those are extra downloads. (unverified)
- Load the whole engine with dynamic import() after the page is interactive. (unverified, standard practice)
Notable: The engine alone exceeds the old 170 KB critical budget, so lazy loading is not optional.

## three.js forum: scene optimisation limits (Don McCurdy and Mugen87)
Link: https://discourse.threejs.org/t/three-scene-optimization-texture-size-calculation-in-gpu-compression-merge-meshes-what-the-limits/23972
Made by: three.js forum members (Don McCurdy is a three.js maintainer). Licence: all rights reserved; read only.
Rules:
- Texture GPU memory is about width x height x 4 x 4/3 bytes. A 2K image is about 22 MB uncompressed. (verified)
- Low-end phones may have only about 200-500 MB usable video memory. (verified; a rough guess in the thread)
- Rough per-frame budget for 60-90 fps mobile, borrowed from Oculus Quest guidance: 50-100 draw calls, 50,000-100,000 triangles. Marked in the thread as guesses. (verified)
- KTX2 textures need 4-8x less GPU memory than PNG or JPEG. (verified)
- Pack occlusion, roughness, metalness into R, G, B of one texture. (verified)
- Do not compute memory by hand. Measure in dev tools. (verified)
Notable: The only mobile triangle and draw-call numbers I found come from a forum post calling them guesses.

## Not reached (listed so nobody thinks they were read)
- Khronos WebGL wiki HandlingContextLost (403). It moved to wikis.khronos.org/webgl/HandlingContextLost. (unverified)
- Codrops "Building Efficient Three.js Scenes" (Feb 2025, 403). Only a search snippet seen: it covers R3F, drei, profiling, and mentions Spector.js. Codrops licence: all rights reserved; read only. (unverified)
- Studio case studies (Active Theory, Lusion, Unseen, Bruno Simon): not fetched.
- drei PerformanceMonitor docs page (404). Behaviour taken from the R3F scaling page.

## Numbers table
| Item | Number | Source |
|---|---|---|
| LCP good / poor | 2.5 s / over 4.0 s | web.dev vitals |
| INP good / poor | 200 ms / over 500 ms | web.dev INP |
| CLS good | 0.1 or less | web.dev vitals |
| Percentile judged | 75th, mobile and desktop separate | web.dev vitals |
| Critical-path budget (old baseline) | under 170 KB compressed, TTI under 5 s on Moto G4, slow 3G | web.dev budgets |
| three.js full package | 724.9 kB min, 181.3 kB gzip (v0.187.0) | Bundlephobia |
| Frame budget at 60 fps | 16.7 ms (arithmetic) | maths |
| Frame budget at 120 fps | 8.3 ms (arithmetic) | maths |
| DPR cap | 2 (R3F default [1,2]); 2-3 (Discover three.js); manual says 1x often fine | R3F docs; Discover three.js; three.js manual |
| Phone DPR start I would use | 1.5, drop to 1 (R3F example) | R3F scaling |
| Total pixel cap | 3840x2160 in the manual example | three.js manual |
| Draw calls, hard ceiling | about 1,000, ideal a few hundred | R3F scaling |
| Draw calls, mobile guess | 50-100 (60-90 fps) | three.js forum |
| Triangles per frame, mobile guess | 50,000-100,000 | three.js forum |
| Instancing | about 100,000 objects in one call | R3F scaling |
| Texture memory | w x h x 4 x 4/3 bytes; 2K is about 22 MB | three.js forum |
| Phone video memory (low end) | about 200-500 MB, a guess | three.js forum |
| Texture size guaranteed minimum | 4096 | MDN WebGL best practices |
| Mipmap overhead | about 33% | MDN WebGL best practices |
| KTX2 vs PNG/JPEG GPU memory | 4-8x smaller | three.js forum |
| Draco best case | under 10% of original glTF | Discover three.js |
| Anisotropy clamp | min(4, max) | MDN WebGL best practices |
| Blocking GL call cost | about 1 ms or more each | MDN WebGL best practices |
| Regress debounce | 200 ms | R3F scaling |
| WebGPU global support | about 88.6% incl. partial | caniuse |
| Shadow cost | point light renders 6x | Discover three.js |
| Update far objects | every 2nd or 3rd frame | Discover three.js |

## Conflicts and open questions
- Pixel ratio: the three.js manual says 1x is often right and warns against setPixelRatio; R3F defaults to [1,2]; Discover three.js says cap at 2-3. "2 is enough" is folklore. A reasonable pick for this repo (unverified): start at min(DPR, 1.5) on phones and 2 on desktop, and let measured frame time lower it.
- Draw-call ceilings range from 50-100 (forum, Quest-derived guess) to 1,000 (R3F). None is measured on a real spread of phones. Safe working targets (unverified, my judgement): 100 on phones, 300-500 on desktop.
- Phone triangle budgets (50k-100k) come from one forum answer that calls itself a guess. Modern phones handle far more. Pixel cost (overdraw, transparency, shadows) usually hurts first, but no source here ranks them with data.
- Texture limits: 4096 is a spec minimum. Real GPUs allow 8192-16384 or more, but memory, not the limit, is what hurts. The 200-500 MB phone figure is a rough guess.
- WebGPU in Firefox: caniuse (as summarised) says disabled by default; the gpuweb wiki says shipped on Windows 141 and macOS 145-147. One summary may be wrong, or caniuse may lag. Re-check before claiming support.
- three.js WebGPURenderer and TSL: docs describe the fallback but give no stability label. Not verified as production-ready.
- three.js bundle size: Bundlephobia counts the whole package. The real tree-shaken size depends on the scene. Not measured here.
- Weak-device detection: deviceMemory is non-standard and limited, hardwareConcurrency is coarse, prefers-reduced-data is supported nowhere per MDN. No source gives a reliable pre-load test. Best available: measure fps for the first 1-2 s (R3F PerformanceMonitor pattern), then step quality down.
- Context loss: the preventDefault and rebuild steps came from spec text via a summary, not shown on the MDN page. The Khronos wiki was not readable.
- Total download budget for a 3D hero: no source gives one. Only the old 170 KB critical-path line exists, and it does not fit 3D. A practical split (unverified, my judgement): HTML, CSS and text on the critical path under 170 KB; engine and scene lazy-loaded; first 3D payload under about 1.5 MB on phones and under about 3-5 MB on desktop. Needs real testing.
- Case studies from studios were not read, so no "shipped site" numbers exist in this file.
