# Research v3: Blender to browser, and beyond the web
Method: Fetched public pages with a page reader (small model summaries), plus web search snippets. Today is 2026-11-16.
(verified) = read on the fetched page this session. (unverified) = memory or a search snippet only.
All rules are paraphrased. The Blender manual is CC-BY-SA 4.0 (from memory), so nothing is copied.
Several pages failed (404 or empty body); they are listed under "Conflicts and open questions".

# Part A: Blender to browser

## Blender Manual: glTF 2.0 add-on
Link: https://docs.blender.org/manual/en/latest/addons/scene_gltf2.html (the old path .../addons/import_export/scene_gltf2.html now gives 404)
Made by: Blender Foundation and community. Licence: CC-BY-SA 4.0 (unverified); paraphrase only.
Rules:
- Build materials around the Principled BSDF node; that is what exports as metal/rough PBR. (verified)
- An unlit look exports by mixing in a camera ray (the shadeless trick). (verified)
- Clearcoat, sheen and transmission leave Blender as glTF material extensions. (verified)
- glTF reads occlusion from red, roughness from green, metallic from blue. (verified)
- To pack ORM: use Non-Color images and a Separate RGB node; the exporter can then copy the image as is. (verified)
- Occlusion has no Blender shader input; it goes through a custom node group the add-on describes. (verified)
- Turn on the evaluated-mesh option (apply modifiers) so the export has all modifier results. (verified)
- Warning from the Python API page: applying modifiers blocks shape key export. (unverified, snippet)
- Keep "+Y Up" on; it is the glTF rule. (verified)
- Animation modes: Actions (default), Active Actions merged, NLA Tracks (one glTF clip per track), Scene. (verified)
- For several clips (idle, hover), put each in an NLA track and pick NLA Tracks mode. (verified, my reading)
- Draco is a tick-box with a level; higher level = smaller file but slower encode and decode. (verified)
- Draco has separate precision sliders (position, normal, UV, colour); more bits = more precision, bigger file. (verified)
- Images option can save everything as WebP, or add WebP/KTX beside a PNG/JPEG fallback. (verified)
- Does NOT export: area lights and world lighting; only point, spot, sun lights go out. (verified)
- Does NOT export: curves and other non-mesh data until you convert them to meshes. (verified)
- Does NOT export: physics, light or material animation (experimental pointer support aside). (verified)
- Actions not linked to an object (active slot or NLA track) are skipped. (verified)
- Images that are not PNG/JPEG get converted, which slows export. (verified)
- Custom node trees, procedural noise and shader-to-RGB do not travel; bake them first. (unverified; the Khronos guide also says bake node networks)
Notable: Export is mesh + Principled BSDF + bitmaps. Everything else must be baked or rebuilt in code.

## Blender Manual: baking, UV unwrap, lightmap pack, Decimate
Link: https://docs.blender.org/manual/en/latest/render/cycles/baking.html (not fetched)
Made by: Blender Foundation. Licence: CC-BY-SA 4.0 (unverified); paraphrase only.
Rules:
- Cycles baking needs a target image node selected in each material, and a UV map for the object. (unverified)
- Bake types worth using for the web: Combined, Diffuse (colour only), AO, Normal, Roughness, Emit. (unverified)
- Bake lighting into a separate UV set from the tiling texture UV, or use one non-overlapping unwrap. (unverified; echoed by three.js forum)
- Smart UV Project is fast; Lightmap Pack gives non-overlapping islands with margin for baking. (unverified)
- Leave margin between UV islands so mip levels do not bleed colour. (verified via Khronos guide, below)
- Decimate modifier: Collapse with a ratio for quick triangle cuts; Planar for flat parts. Check shading after. (unverified)
- Model low-poly and bake high-poly detail into a normal map. (verified via Khronos guide, below)
Notable: These manual pages were not fetched; treat all as memory.

## Khronos glTF 2.0 overview and ratified extensions
Link: https://www.khronos.org/gltf/ and https://github.com/KhronosGroup/glTF/blob/main/extensions/README.md
Made by: Khronos Group. Licence: royalty-free spec; "glTF" is a Khronos trademark. Sample models mixed (some CC BY 4.0).
Rules:
- glTF 2.0 is an ISO standard (ISO/IEC 12113:2022); .glb packs everything in one file. (verified)
- Ratified geometry compression: KHR_draco_mesh_compression and EXT_meshopt_compression. (verified)
- Ratified texture extensions: KHR_texture_basisu (KTX2), KHR_texture_transform, EXT_texture_webp. (verified)
- Ratified material extensions include clearcoat, sheen, transmission, volume, ior, specular, iridescence, anisotropy, dispersion, emissive_strength, unlit. (verified)
- Also ratified: KHR_lights_punctual, KHR_mesh_quantization, EXT_mesh_gpu_instancing, KHR_materials_variants. (verified)
- Mark an extension "required" only if the file breaks without it; use only what your viewer supports. (unverified)
Notable: Pick the extension list to match the loader, not the other way round.

## Khronos 3D Commerce asset creation guidelines
Link: https://github.com/KhronosGroup/3DC-Asset-Creation/blob/main/asset-creation-guidelines/RealtimeAssetCreationGuidelines.md
Made by: Khronos 3D Commerce working group. Licence: not stated on page; read only.
Rules:
- Use only as many triangles as needed; push small detail into normal maps. (verified)
- glTF stores triangles only; no quads or n-gons. (verified)
- Keep one UV set; avoid extra sets and overlapping UVs (except repeated logos). (verified)
- Keep UV islands apart so mipmaps do not bleed. (verified)
- Use metallic-roughness, not specular-glossiness. (verified)
- Metal pixels should be near white or black; grey only on edges. (verified)
- Bake node networks into single bitmaps before export. (verified)
- Channel-pack textures to save size and memory. (verified)
- Author lossless PNG, then make other formats with tools. (verified)
- Publishing-target numbers: the page says "coming soon", so no official Khronos numbers there. (verified)
Notable: Good rules, but no numeric budgets (the targets page returned 404).

## glTF-Transform (gltf-transform.dev)
Link: https://gltf-transform.dev/cli
Made by: Don McCurdy. Licence: MIT (unverified on page; known).
Rules:
- `optimize` runs "all available methods" in one command; defaults may not suit every scene. (verified)
- Example: `gltf-transform optimize in.glb out.glb --compress draco --texture-compress webp`. (verified)
- Separate commands exist: dedup, prune, weld, simplify, resample, draco, meshopt, webp, avif, etc1s, uastc, resize. (verified)
- Run `inspect` first, then choose steps yourself if the scene is unusual. (verified)
- Image steps need the Sharp library installed. (verified)
- Sensible order: dedup, prune, weld, simplify (only if needed), resample, compress geometry, resize and compress textures. (unverified; matches the gltfjsx --transform list)
- Use `--compress meshopt` for animation or fast decode; `draco` for the smallest static mesh. (unverified)
- Quoted savings: none on the page. (verified)
Notable: Sizes are not promised; measure with `inspect` before and after.

## Draco (Google) and meshoptimizer / gltfpack (Arseny Kapoulkine)
Link: https://github.com/google/draco ; https://github.com/zeux/meshoptimizer ; https://meshoptimizer.org/gltf/
Made by: Google; Arseny Kapoulkine. Licence: Draco Apache-2.0 (verified); meshoptimizer MIT (verified).
Rules:
- Draco compresses meshes and point clouds; ships C++ source plus JS/WASM decoders. (verified)
- Draco's page gives no absolute decoder size; v1.3.6 notes the WASM decoder became about 20% smaller. (verified)
- A Draco decoder is roughly 300 KB of WASM, and the meshopt decoder only a few KB. (unverified, memory)
- Meshopt decodes vertex and index data at 3-6 GB/s on desktop CPUs. (verified)
- Meshopt says Draco-style codecs chase ratio but reorder data (worse for the GPU) or decode slower. (verified)
- Meshopt vertex data typically compresses 2-4x over already quantized data; index data about 1-1.2 bytes per triangle. (verified)
- gltfpack: `-cc` compressed meshopt output, `-tc` KTX2 textures, `-tw` WebP, `-si 0.5` simplify to 50%, `-mi` instancing. (verified)
- gltfpack merges meshes, quantizes and prunes the node tree by default; `-kn` keeps named nodes you look up in code. (verified)
- gltfpack does not support Draco. (verified)
- Choose meshopt for animated or skinned models and fast start; Draco for the smallest static download. (unverified, my summary)
- Serving meshopt files with gzip/brotli shrinks them further. (verified)
Notable: Pick one geometry codec per file; do not stack them.

## KTX Artist Guide (Khronos 3D-Formats-Guidelines)
Link: https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/main/KTXArtistGuide.md
Made by: Khronos Group. Licence: not stated on page; read only.
Rules:
- ETC1S: smallest files; good for flat colour areas, base colour, emissive. (verified)
- UASTC: higher quality; use for normal maps, ORM-packed maps and clearcoat textures. (verified)
- Switch a prominent colourful texture (e.g. glass colour) to UASTC if ETC1S looks bad. (verified)
- PNG/JPEG are fully unpacked on the GPU; KTX2 stays compressed in video memory. (verified)
- Lamp example: about 13 MB files and 96 MB GPU became 10 MB files and 21 MB GPU. (verified)
- Duck example: 118 KB PNG (1.5 MB GPU) became 116 KB KTX (277 KB GPU), about 82% less GPU memory. (verified)
- The download saving can be tiny; the big win is memory and upload time. (verified)
- Mip sizes halve (rounded down, minimum 1); generate mips at compression time (`--genmipmap`). (verified)
- Use power-of-two sizes (2048, 1024, 512); for KTX2/basisu keep multiples of 4 at least. (verified)
Notable: WebP/AVIF only shrink the download. Only KTX2 shrinks GPU memory.

## three.js GLTFLoader, DRACOLoader, KTX2Loader, MeshoptDecoder; Discover three.js tips
Link: https://threejs.org/docs/pages/GLTFLoader.html ; https://discoverthreejs.com/tips-and-tricks/
Made by: three.js authors; Discover three.js. Licence: three.js MIT (unverified); book content read only.
Rules:
- Load with `loadAsync`; result has scene, animations, cameras. `load()` has an onProgress callback for a loading bar. (verified)
- Register `setDRACOLoader`, `setKTX2Loader`, `setMeshoptDecoder` before loading files that need them. (verified)
- KTX2Loader needs a transcoder path and `detectSupport(renderer)`. (verified)
- Loader supports many extensions: clearcoat, transmission, volume, emissive_strength, lights_punctual, quantization, texture_basisu, webp, avif, gpu_instancing. (verified)
- Image bitmaps from glTF are not garbage collected; dispose them yourself when removing a model. (verified)
- Also call `dispose()` on geometries, materials, textures, and on the Draco/KTX2 loaders (stops workers). (unverified for the workers)
- JPG and PNG of the same size use the same video memory; use the smallest textures you can. (verified)
- Cap pixel ratio at 2 or 3 on high-DPI phones. (verified)
- Bake lighting and shadow maps to cut the number of lights. (verified)
- Fewer draw calls is faster; use instancing and LOD. (verified)
- Point light shadows are the costliest (six renders). (verified)
Notable: Our dispose rule should name image bitmaps and loader workers too.

## pmndrs gltfjsx
Link: https://github.com/pmndrs/gltfjsx
Made by: Poimandres collective. Licence: MIT (verified).
Rules:
- `npx gltfjsx Model.glb` makes a React Three Fiber component with named meshes and materials. (verified)
- `--transform` writes `Model-transformed.glb`: Draco, textures resized to 1024 and made WebP, dedup, instance, prune. (verified)
- README claims 70-90% size reduction from `--transform`. (verified)
- `--types` adds TypeScript types; `--instance` reuses repeated geometry. (verified)
- Because it forces 1024 WebP and Draco, check the hero model by eye before accepting. (my advice)
Notable: Good default for React sites; it uses glTF-Transform underneath.

## Google <model-viewer>
Link: https://modelviewer.dev/examples/loading/ and https://modelviewer.dev/examples/augmentedreality/
Made by: Google. Licence: Apache-2.0 (verified, page footer).
Rules:
- Show a `poster` until the model is ready; you can cycle posters and reveal the model on click. (verified)
- Draco, KTX2 and Meshopt decoders load on demand when the file needs them. (verified)
- Attribute names for lazy load and reveal (`loading="lazy"`, `reveal="interaction"`) were not on the fetched page. (unverified)
- Always give `alt` text; keyboard orbit works on the focused element (arrow keys). (unverified)
- AR: WebXR is the default (Chrome 83+ Android, HTTPS), Scene Viewer on Android, Quick Look on iOS. (verified)
- On iOS it auto-makes a USDZ if you omit `ios-src`; supply your own `.usdz` if you need animation. (verified)
- Useful AR attributes: `ar`, `ar-scale="fixed"`, `ar-placement`. (verified)
Notable: For one product model, this one tag beats a custom three.js scene.

## Published model budgets (Google Scene Viewer, Shopify, Khronos, Sketchfab, Meta)
Link: https://developers.google.com/ar/develop/scene-viewer ; https://help.shopify.com/partners/resources/creating-3d-models/3d-model-standards-checklist
Made by: Google; Shopify; Sketchfab; Meta. Licence: all rights reserved; read only.
Rules:
- Google Scene Viewer: keep the model under about 10 MB; the validator rejects over 15 MB. (verified)
- Google: 100,000 triangles recommended limit; 30,000-50,000 is the ideal range. (verified)
- Google: textures max 2048 x 2048; JPG preferred when no alpha; sRGB. (verified)
- Google: up to about 10 materials (2 with alpha); one UV set; one mesh per material. (verified)
- Google: +Y up, front faces +Z, 1 unit = 1 metre; do not bake shadows for AR placement. (verified)
- Google: only KHR_materials_unlit and KHR_texture_transform are supported, so Draco/Meshopt GLBs do not fit Scene Viewer. (verified)
- Shopify: model under 15 MB (bigger gets auto-optimised); guidance of about 4 MB for GLB/USDZ; one base colour texture. (unverified, snippet)
- Shopify: PNG base colour only if transparent; otherwise optimised JPG. (unverified)
- Sketchfab: viewer cap 8192 x 8192 textures, up to 100 materials per scene; no official polygon maximum. (unverified, snippet)
- Meta Horizon: no official GLB numbers found; a community doc says FBX, PNG, power-of-two, under 125k triangles. (unverified, not from Meta)
- Third-party only: Windows MR home 10k / 5k / 2.5k triangles per LOD; Gmetri 50k triangles and 50 MB per scene, textures under 4K. (unverified)
Notable: Official web-hero numbers do not exist; the phone/desktop budgets below are my synthesis.

## Light baking for the web
Link: https://threejs-journey.com/lessons/baking-and-exporting-the-scene ; https://discourse.threejs.org/t/how-to-bake-light-with-textures/52076 ; https://www.svilenkovic.com/3d/how-to-bake-lighting-for-web
Made by: Bruno Simon (Three.js Journey, paid course); forum users; Svilenkovic. Licence: all rights reserved; learning only.
Rules:
- Baking = save the finished lit render into a texture and show it with an unlit material; needs a clean UV unwrap. (unverified, snippet)
- Result: no real-time lights or shadows, so it runs well on phones. (verified in Discover three.js tips)
- Use a second UV channel for the lightmap if the main texture tiles. (unverified, snippet)
- Bake static things only; moving parts keep simple real-time light. (unverified)
- Procedural materials are fine in Blender because you bake them to an image. (unverified; sources disagree)
- Group objects into a few atlases (1024-2048) to cut draw calls. (unverified)
Notable: Paid course content is not reproduced. Learn the idea, write our own steps.

## Licences of 3D assets
Link: https://polyhaven.com/license ; https://docs.ambientcg.com/license/ ; Sketchfab licence page (404, unverified)
Made by: Poly Haven; ambientCG; Sketchfab. Licence: as stated below.
Rules:
- Poly Haven HDRIs, textures and models are CC0: any use, commercial too, no credit needed (credit appreciated). (verified)
- Poly Haven logos, avatars, user renders and site text are NOT CC0; scraping needs permission. (verified)
- ambientCG assets are CC0 1.0: copy, change, ship inside a product, no credit needed. (verified)
- Sketchfab models carry per-model licences (CC BY, CC BY-NC, and others); CC BY needs credit; "NC" blocks client work. (unverified)
- Check the licence on every model page and keep a credits file in the repo. (my advice)
- Never rip models from games or films: the rights stay with the owner, even when files are easy to extract. (my advice)
- Prefer models made in Blender; use CC0 for HDRIs and textures. (my advice, supports originality)
Notable: CC0 is safe for client work; "free to download" is not a licence.

# Part B: beyond the web

## Electron
Link: https://www.electronjs.org/docs/latest/tutorial/performance ; https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering
Made by: OpenJS Foundation / Electron team. Licence: code MIT (unverified); docs read only.
Rules:
- Electron ships its own Chromium, so WebGL, WebGPU and CSS behave like Chrome of that version. (unverified)
- The performance page has no GPU section; advice is measure first, defer work, keep the main process free. (verified)
- Offscreen rendering supports WebGL with GPU; the default copies frames to the CPU (slower); shared texture is fastest. (verified)
- Offscreen frame cap is 240 fps when not using shared texture; no frames when the page is idle. (verified)
- Software output needs `app.disableHardwareAcceleration()` and loses GPU features. (verified)
- Cost: the whole of Chromium ships with the app (100+ MB install). (unverified)
- Reduced motion: the page's `prefers-reduced-motion` follows the OS setting. (unverified)
Notable: Exists: full web 3D. Costs: install size and a heavy memory floor.

## Tauri
Link: https://v2.tauri.app/reference/webview-versions/
Made by: Tauri Programme (Commons Conservancy). Licence: MIT/Apache-2.0 (unverified).
Rules:
- Windows uses WebView2 (Chromium, self-updating, preinstalled on Windows 11). (verified)
- macOS and iOS use WKWebView, updated with the OS. (verified)
- Linux uses WebKitGTK; version depends on the distro, so it can be old. (verified)
- Android uses the system WebView (Chromium), version varies by device. (verified)
- The page does not mention WebGL or WebGPU; support follows each webview version. (verified)
- WebGPU on WebKitGTK is likely missing or limited; test on the oldest target. (unverified)
- Reduced motion: `prefers-reduced-motion` from the OS through each webview. (unverified)
Notable: Same code, four engines. Keep a WebGL fallback or a still poster.

## Apple: SwiftUI shaders, SceneKit/RealityKit, Reduce Motion
Link: https://developer.apple.com/documentation/swiftui/view/layereffect(_:maxsampleoffset:isenabled:) ; https://developer.apple.com/documentation/swiftui/environmentvalues/accessibilityreducemotion
Made by: Apple. Licence: all rights reserved; read only.
Rules:
- iOS 17+ has `.colorEffect`, `.distortionEffect`, `.layerEffect`; Metal functions load through `ShaderLibrary`. (unverified: Apple pages returned titles only)
- Shader functions are marked `[[stitchable]]` in a .metal file. (unverified)
- `layerEffect` can sample any pixel of the layer; `maxSampleOffset` says how far it reads. (unverified)
- 3D: SceneKit is in maintenance; RealityKit is the current path for new work. (unverified)
- Setting: Settings > Accessibility > Motion > Reduce Motion. (unverified)
- SwiftUI: `@Environment(\.accessibilityReduceMotion)`; UIKit: `UIAccessibility.isReduceMotionEnabled`. (unverified)
- HIG: swap big movement, zoom and parallax for fades; no unstoppable autoplay. (unverified)
Notable: Exists and is cheap for small effects. The fetch tool gave only page titles for Apple.

## Android: Compose and AGSL, Remove animations, Material motion
Link: https://developer.android.com/develop/ui/views/graphics/agsl
Made by: Google. Licence: docs CC-BY 4.0, samples Apache-2.0 (unverified).
Rules:
- AGSL (Android 13+) defines `RuntimeShader`; syntax is close to GLSL fragment shaders. (verified)
- An AGSL effect becomes part of one GPU fragment shader Android builds per draw; no recursion. (verified)
- Compose uses it through `ShaderBrush` or `RenderEffect`. (unverified)
- Setting: Settings > Accessibility > Remove animations (sets the animator scale to 0). (verified, via Flutter doc)
- `ValueAnimator.areAnimatorsEnabled()` (API 26) is false when scale is 0 or Battery Saver is on. (unverified, snippet)
- Material 3 motion: short, simple, purposeful. (unverified)
Notable: Below Android 13 you need a fallback (a static gradient or image).

## Flutter
Link: https://docs.flutter.dev/ui/design/graphics/fragment-shaders ; https://api.flutter.dev/flutter/widgets/MediaQueryData/disableAnimations.html
Made by: Google. Licence: BSD-3 code (unverified); docs read only.
Rules:
- Write `.frag` GLSL, list it under `shaders:` in pubspec, load with `FragmentProgram.fromAsset`. (verified)
- Both Skia and Impeller run custom shaders; `ImageFilter.shader` only on Impeller. (verified)
- Reuse `FragmentShader` objects; precache programs before animating. (verified)
- Not supported: vertex shaders, UBOs, SSBOs; only `sampler2D`. (verified)
- `MediaQuery.disableAnimations` is true for Android "Remove animations". (verified)
- iOS Reduce Motion is separate: `AccessibilityFeatures.reduceMotion`. (verified)
Notable: Check both flags to cover both OSes.

## React Native (Skia, expo-gl, R3F native, Reanimated)
Link: https://shopify.github.io/react-native-skia/ (404) ; https://docs.swmansion.com/react-native-reanimated/docs/guides/accessibility/
Made by: Shopify; Software Mansion; Expo and pmndrs. Licence: MIT (unverified).
Rules:
- react-native-skia runs SkSL runtime shaders on the GPU, iOS and Android. (unverified; page 404)
- Reanimated `ReduceMotion.System` is the default: animations jump to the end when the OS setting is on. (verified)
- `useReducedMotion()` reads the setting once at app start. (verified)
- R3F native with expo-gl gives WebGL-style 3D and is heavy on battery. (unverified)
- Cap ambient effects at 30 fps, pause off screen, and drop quality when thermal or battery signals rise. (my advice)
Notable: Keep animation on the UI thread (worklets), not in JS.

## Rive and Lottie
Link: https://rive.app/docs/runtimes/getting-started ; https://lottiefiles.github.io/lottie-docs/
Made by: Rive; LottieFiles docs (Design Barn). Licence: Rive runtimes MIT (verified); Lottie docs all rights reserved, format open (unverified).
Rules:
- Rive uses a binary `.riv` file; mark it `binary` in git or line endings corrupt it. (verified)
- Rive runtimes: Web, React, React Native, Apple, Android, Flutter, Unity, Unreal, C++, C#. (verified)
- Rive has state machines for interactive motion. (unverified; not on the fetched page)
- Lottie is vector animation described in JSON; players exist for web, React, Vue, Svelte. (verified)
- Lottie has no real 3D and handles heavy raster poorly; keep layers few. (unverified)
- Fit: Rive for interactive, stateful UI motion; Lottie for one-shot or looping illustration; neither replaces a 3D model. (my advice)
Notable: Both are far cheaper than real-time 3D for onboarding and icon motion.

## Windows: WinUI, Mica, Win2D, animation setting
Link: https://learn.microsoft.com/en-us/windows/apps/design/style/mica
Made by: Microsoft. Licence: docs read only.
Rules:
- Mica is an opaque material that samples the wallpaper once, built for performance. (verified)
- Mica falls back to a solid colour when transparency is off, Battery Saver is on, hardware is low-end, or the window is inactive. (verified)
- Mica needs Windows 11 (build 22000 or later). (verified)
- Setting: Settings > Accessibility > Visual effects > Animation effects ("Show animations in Windows"). (unverified; the animations page 404ed)
- Win2D is the GPU 2D effects library for WinUI. (unverified)
- Apply the backdrop material once per app. (verified)
Notable: Exists, cheap, and the OS already removes it when power is low.

## Battery, heat and low power
Link: https://developer.android.com/develop/background-work/background-tasks/optimize-battery ; Apple ProcessInfo docs
Made by: Google; Apple. Licence: read only.
Rules:
- iOS: `ProcessInfo.isLowPowerModeEnabled` and `thermalState` (nominal, fair, serious, critical), with change notifications. (unverified: Apple pages gave titles only)
- Low Power Mode caps Safari animation callbacks and some CSS animation at 30 fps (WebKit says it is deliberate). (unverified, WebKit bug snippets)
- So drive animation by elapsed time, not frame count. (unverified, GSAP forum advice)
- Android: Battery Saver turns animators off, visible through `areAnimatorsEnabled()`. (unverified)
- The Android battery page is about background work constraints, not frame rates. (verified)
- Web: `prefers-reduced-motion` is standard; `prefers-reduced-data` has limited support. (unverified)
- Pause render loops when the tab or view is hidden or scrolled away. (my advice)
Notable: No platform gives a fixed fps rule; read the signal and drop to 30 fps or a still frame.

## Pipeline in order
1. Model low-poly in Blender; 1 unit = 1 metre, real scale, origin at the base.
2. Apply scale and transforms; fix normals; one UV set, islands spaced, no overlaps.
3. Use only Principled BSDF materials; keep the count small (1-3 for a hero).
4. Bake anything procedural, plus AO or lighting if wanted, into images; pack ORM with Separate RGB.
5. Pick texture sizes by need: 1024 small props, 2048 hero base colour and normal; 4096 only for close-up product detail.
6. Export GLB: +Y up, apply modifiers, Principled BSDF only, Draco off (compress later), PNG/JPEG or WebP images.
7. Run `gltf-transform inspect`, then `optimize` (dedup, prune, weld, simplify if needed, resample).
8. Geometry: meshopt if animated or you want fast start; Draco for the smallest static mesh.
9. Textures: KTX2 (ETC1S colour, UASTC normal/ORM) for GPU memory; WebP fallback if KTX2 is not possible.
10. Check in a viewer (model-viewer or the three.js editor) against the budgets below.
11. Load: GLTFLoader plus the matching decoder, poster first, lazy load below the fold, progress bar.
12. Respect `prefers-reduced-motion` (still pose, no autoplay spin); pause off screen; cap pixel ratio at 2.
13. On unmount: dispose geometries, materials, textures, image bitmaps; dispose the loaders.
14. Record the licence of every asset in a credits file.

## Numbers table
| Item | Number | Source |
|---|---|---|
| Hero GLB download, phone | aim under 2 MB, hard stop 5 MB | my synthesis (unverified) |
| Hero GLB download, desktop | aim under 5 MB, hard stop 10 MB | Google Scene Viewer says about 10 MB (verified) |
| Scene Viewer reject limit | 15 MB | Google (verified) |
| Shopify limit / guidance | 15 MB / about 4 MB | Shopify (unverified snippet) |
| Triangles, phone hero | 20,000-60,000 | Google ideal 30-50k (verified); phone range mine |
| Triangles, desktop hero | up to 100,000 | Google recommended max (verified) |
| Max texture for Scene Viewer | 2048 x 2048 | Google (verified) |
| Texture ceiling in Sketchfab viewer | 8192 x 8192 | Sketchfab (unverified snippet) |
| Texture default for web | 1024 small, 2048 hero | gltfjsx uses 1024 (verified); 2048 mine |
| Materials | up to 10 (2 with alpha) | Google (verified) |
| gltfjsx --transform savings | 70-90% | gltfjsx README (verified) |
| KTX2 vs PNG/JPEG GPU memory | lamp 96 MB to 21 MB; duck 1.5 MB to 277 KB | Khronos KTX guide (verified) |
| KTX2 file saving | small (about 2% duck, about 20% lamp) | Khronos KTX guide (verified) |
| Meshopt decode speed | 3-6 GB/s | meshoptimizer README (verified) |
| Meshopt vertex / index ratio | 2-4x; 1-1.2 bytes per triangle | meshoptimizer README (verified) |
| Draco decoder size | about 300 KB WASM | memory (unverified) |
| Electron offscreen frame cap | 240 fps | Electron docs (verified) |
| Low Power Mode web cap | 30 fps | WebKit bug reports (unverified) |

## Conflicts and open questions
- Blender's old manual path 404s; the node group is called "glTF Material Output" in the new page and "glTF Settings" in older ones. Check your version.
- Blender baking, UV and Decimate pages, and the Sketchfab licence page, were not read.
- Apple HIG, SwiftUI, ProcessInfo pages gave only titles; Windows animations page 404ed. All Apple and Windows setting names are unverified.
- model-viewer docs index pages were empty; `loading`, `reveal`, `alt` and keyboard notes are unverified.
- Khronos 3DC Publishing Targets page: "coming soon" or 404; no official triangle or MB targets from Khronos.
- Shopify 15 MB (cap) vs about 4 MB (advice); third-party sources give 6 MB.
- Meta Horizon: no official GLB limits found; the community page says FBX.
- Google Scene Viewer supports no Draco/Meshopt, while model-viewer uses WebXR first. One file may not serve every AR path; offer an uncompressed fallback.
- No head-to-head Draco vs meshopt size number found; run a blind test on our own hero model.
- react-native-skia, Lottie limits and Tauri WebGPU support are not confirmed.
- Phone budgets (2 MB, 20-60k triangles) are my judgement; test on a mid-range Android.
