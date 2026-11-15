# Research v3: materials, lighting and shaders
Method: fetched public pages this session with a page-reader tool. Many threejs.org manual URLs gave 404, so pages were read through the working "manual/pages/" form.
(verified) = read on the page this session. (unverified) = from memory or a search snippet only.
All rules are paraphrased. No code or long text copied.

## three.js manual: Lights
Link: https://threejs.org/manual/pages/lights.html
Made by: three.js authors. Licence: MIT (unverified for this page; repo is MIT).
Rules:
- Pick the light by job: ambient (flat fill, stops pure black), hemisphere (sky/ground tint), directional (sun), point, spot, rect area. (verified)
- Each light adds render cost, so use as few as the look needs. (verified)
- Ambient and hemisphere lights have no direction, so they flatten shapes. Keep them low. (verified)
- Directional and spot lights aim at a target; the target must be in the scene. (verified)
- Rect area lights only work with Standard and Physical materials and need a one-time uniforms init. (verified)
- Intensity scales differ by light type (manual samples: about 1 for directional, about 150 for point/spot, about 5 for rect). Tune each type separately, by eye. (verified)
- Since r155 lights use physical units, so old "intensity 1" tutorial values look wrong. (unverified)
- Adding or removing lights at runtime recompiles shaders and stalls. Create up front, toggle visible or intensity. (unverified)
Notable: the manual gives no fixed units, so judge by the picture, not the number.

## three.js manual: Shadows
Link: https://threejs.org/manual/pages/shadows.html
Made by: three.js authors. Licence: MIT (unverified for this page).
Rules:
- Every shadow-casting light re-draws all casters. Five shadow lights means six draws of the scene. (verified)
- A point-light shadow costs six renders (cube faces). Avoid it. (verified)
- Use many lights if needed, but let only one directional light cast shadows. (verified)
- Ground usually only needs receiveShadow; set castShadow only where it matters. (verified)
- Keep the shadow camera box as small as the scene allows. Too big gives blocky shadows; too small clips them. Check with a camera helper. (verified)
- Default shadow map is 512x512. Use the smallest size that looks right. (verified)
- Cheap fake: a soft grey blob plane just above the floor (transparent, depthWrite off, tiny y offset, fade as object rises). (verified)
- Baked lightmaps or baked occlusion are very fast at runtime but static. (verified)
Notable: the cheapest good ground contact is a blob or baked shadow, not a shadow map.

## three.js manual: Color management
Link: https://threejs.org/manual/pages/color-management.html
Made by: three.js authors. Licence: MIT (unverified for this page).
Rules:
- Light and shade in linear space; show in sRGB. (verified)
- Mark colour image textures (map, emissiveMap) as sRGB. Leave data textures (normal, roughness) as no colour space. (verified)
- HDR files (EXR) are linear and may exceed 1. (verified)
- Hex and CSS colours convert from sRGB automatically when colour management is on (default). (verified)
- Set renderer.outputColorSpace to sRGB (default). With post-processing, the output pass must do this conversion. (verified)
- Custom ShaderMaterial must convert on its own; add the colourspace output chunk at the end of main. (verified)
- Missing conversion = too dark. Double conversion (often from post-processing) = washed out. Changing light intensity does not fix either. (verified)
- Two colour mistakes can cancel in average brightness but give harsh, wrong shading. (verified)
- Prefer glTF; older formats have messy colour data. (verified)
- Render targets: sRGB is fine at 8 bit; linear needs half float. (verified)
Notable: "washed out" and "too dark" almost always mean a colour space slip, not a light problem.

## three.js docs: WebGLRenderer and MeshPhysicalMaterial
Link: https://threejs.org/docs/pages/WebGLRenderer.html ; https://threejs.org/docs/pages/MeshPhysicalMaterial.html
Made by: three.js authors. Licence: MIT.
Rules:
- Tone mapping default is none. Options: Linear, Reinhard, Cineon, ACESFilmic, AgX, Neutral, Custom. (verified)
- toneMappingExposure default 1; outputColorSpace default sRGB. (verified)
- Physical material costs more per pixel than Standard. Extra layers (clearcoat, sheen, iridescence) cost only when non-zero. (verified)
- Use Standard unless you need clearcoat, transmission, sheen, etc. (verified)
- Clearcoat gives a glossy top layer without a second transparent mesh. (verified)
- With transmission above zero, keep opacity at 1. (verified)
- Transmission adds an extra scene pass; use sparingly. (unverified)
- Always give PBR materials an environment map. (verified)
- ACES pushes saturated colours toward white/orange; AgX is softer; Neutral keeps colours. (unverified)
Notable: tone mapping is off by default, so a plain scene clips hot highlights to flat white.

## three.js wiki: Three Shading Language (TSL)
Link: https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language
Made by: three.js authors. Licence: MIT (repo).
Rules:
- TSL is JavaScript node code that compiles to WGSL (WebGPU) or GLSL (WebGL2). One source, both backends. (verified)
- It exists because patching shaders with string hacks (onBeforeCompile) breaks between versions. (verified)
- Assign nodes to material slots (colorNode, positionNode) instead of editing shader text. (verified)
- Use Fn() when you need variables or branches; plain JS functions only give inline expressions. (verified)
- Use If / ElseIf / Else (capital I) for branches and select() for ternary values. (verified)
- Use toVar for reusable values, toConst for inline constants. (verified)
- vertexStage() runs work per vertex and passes it to fragment. (verified)
- Prefer TSL for new work that targets WebGPU; keep GLSL ShaderMaterial for WebGL-only prototypes. (unverified, my judgment)
Notable: TSL keeps one shader working on both renderers.

## Khronos PBR Neutral tone mapper
Link: https://github.com/KhronosGroup/ToneMapping/tree/main/PBR_Neutral
Made by: Khronos Group. Licence: not stated on the page; check repo LICENSE (believed Apache-2.0, unverified).
Rules:
- Built so base colours survive: mid-range channels (about 0.08 to 0.8) pass through almost unchanged. (verified)
- No hue shift; only bright values get compressed and slightly desaturated. (verified)
- Output is sRGB only, and the mapping is reversible. (verified)
- Use it for product shots, brand colours, configurators. (verified reasoning from above)
- Use ACES or AgX when you want a filmic, moody look and accept colour drift. (unverified)
Notable: the answer when a client says "the red must be our red".

## Khronos glTF 2.0 spec (PBR metallic-roughness)
Link: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
Made by: Khronos Group. Licence: copyright Khronos; free to reproduce the unmodified spec; no other rights granted (verified). Read only.
Rules:
- Material inputs are base colour, metallic, roughness (plus normal, occlusion, emissive). (verified from contents list)
- Base colour and emissive textures are sRGB; metal/rough/normal/occlusion are linear data. (unverified)
- Roughness and metal usually share one packed texture (green and blue channels). (unverified)
Notable: the page was too large to read past the start; colour-space rules are from memory.

## Google Filament material notes
Link: https://google.github.io/filament/notes/material_properties.html (also Filament.md.html)
Made by: Google. Licence: Apache-2.0 (unverified on page; repo is Apache-2.0).
Rules:
- Non-metal base colour: keep sRGB about 50 to 240 (loosest 30 to 240). Never pure black or pure white. (verified)
- Metal base colour: bright, about 170 to 255 sRGB. Dirty metal is darker. (verified)
- Metallic is nearly 0 or 1. Use in-between values only at edges like rust. (verified)
- Rust, paint and dirt are not metal. (verified)
- Default non-metal reflectance 0.5 (about 4%). Avoid values under about 0.35. (verified)
- Clamp roughness to at least about 0.089 to avoid divide-by-zero on phones. Avoid exactly 0. (verified)
- Keep baked light and shadow out of base colour. (verified)
- Use real light units (lux for sun, lumens for point/spot) with a camera exposure. Exposure rules were not detailed in what I read. (verified)
Notable: the best fix for plastic-looking scenes is honest base colour plus real roughness.

## The Book of Shaders
Link: https://thebookofshaders.com/
Made by: Patricio Gonzalez Vivo and Jen Lowe. Licence: site shows "Copyright 2015 Patricio Gonzalez Vivo ... All rights reserved". Read only.
Rules:
- Shaping functions bend a 0..1 value: power curves, step (hard cut), smoothstep (soft cut). (verified)
- Sine/cosine give rhythm; use time to animate. (verified)
- Write 1.0 not 1 in GLSL; use built-in functions, they are fast. (verified)
- Noise gives organic variation; stacking octaves (fbm) gives clouds, smoke, terrain. (verified chapter list; method from memory)
- Each fbm octave: about double the frequency, about half the amplitude. 4 to 5 octaves is usually enough. (unverified)
Notable: chapters 05 shaping, 06 colour, 11 noise, 13 fbm cover what a brand background needs.

## Inigo Quilez articles
Link: https://iquilezles.org/articles/palettes/
Made by: Inigo Quilez. Licence: not read (page returned 404 through the tool). Believed: code snippets are free to use; confirm before copying.
Rules:
- Cosine palette: colour = a + b * cos(2*pi*(c*t + d)), with a, b, c, d as RGB triples. One cheap formula gives smooth looping gradients. (unverified, search snippet)
- Start with a = b = 0.5, c = 1, then shift d per channel for hue. (unverified)
- Smooth minimum blends shapes in distance-field scenes; domain warping (feeding noise into noise) gives marbled, liquid motion. (unverified)
Notable: not read this session; treat all rules as leads.

## pmndrs drei (Environment, ContactShadows) and postprocessing
Link: https://drei.docs.pmnd.rs/staging/environment ; https://drei.docs.pmnd.rs/staging/contact-shadows ; https://github.com/pmndrs/postprocessing
Made by: Poimandres. Licence: drei MIT (unverified); postprocessing Zlib, based on MIT three.js code (verified).
Rules:
- Built-in Environment presets load from a CDN and are not for production. Self-host. (verified)
- Environment accepts .hdr, .exr, gainmap jpg/webp, or six cube images. Gainmap files are the smallest. (verified)
- Custom-children environments use a cube camera; keep resolution low (example 256) and render once if static. (verified)
- Background can be blurred (0 to 1) and dimmed separately from the lighting. (verified)
- ContactShadows is "rather expensive"; set frames to 1 for static scenes. (verified)
- EffectPass merges effects into one pass; prefer one merged pass to many. (verified)
- Turn off antialias, stencil and depth on the main renderer when a composer does the final pass. (verified)
- Half-float buffers suit HDR work on desktop; 8-bit is lighter. (verified)
- Cheap effects: vignette, noise/grain, simple tone mapping. Costly: SSAO, depth of field, full-res bloom. (unverified; page gives no ranking)
- AccumulativeShadows (soft shadows built up over frames, then frozen) was not read. (unverified)
Notable: baked-once shadows and a small HDRI beat anything live on a phone.

## MDN: WebGL best practices
Link: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
Made by: MDN contributors. Licence: CC BY-SA 2.5 (unverified); code samples public domain (unverified).
Rules:
- Fragment shaders run far more often than vertex shaders; move work to vertices when the look allows. (verified)
- Use built-ins (mix, dot, normalize). (verified)
- Compile and link all programs first, check status after; use parallel compile where available. (verified)
- Declare precision explicitly. mediump is float16 and can corrupt visuals on phones in WebGL1. (verified)
- Use highp for anything needing accuracy (positions, time, large UVs). (verified)
- Mipmaps for textures seen in 3D (about 33% extra memory). (verified)
- Compressed textures (ASTC, ETC, S3TC) save memory; do not use them for normal maps. (verified)
- Prefer RGBA8 over RGB8. (verified)
- Batch draws, use atlases, upload textures before drawing. (verified)
- Check for float render-target support before using it. (verified)
Notable: precision and texture format are the usual phone-only bugs.

## ARM Mali / Qualcomm developer guidance
Link: https://developer.arm.com/documentation/101897/latest/
Made by: Arm. Licence: all rights reserved; read only.
Rules:
- Page content did not load (title only). Not read.
- From memory: overdraw and big blended layers cost the most on phones; keep full-screen blended layers few. (unverified)
- From memory: avoid heavy loops and chained texture reads in fragment shaders; cap pixel ratio (about 1.5 to 2) before anything else. (unverified)
Notable: could not be fetched; all lines unverified.

## Maxime Heckel: The study of shaders with React Three Fiber
Link: https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/
Made by: Maxime Heckel. Licence: copyright notice only ("2026 Maxime Heckel"); read only.
Rules:
- Pass animation values as uniforms; memoize the uniforms object or animation stops updating. (verified)
- Use noise for organic variation, not per-pixel random. (verified)
- Colours in GLSL run 0 to 1. mix() blends two colours; a height varying maps colour to shape. (verified)
- Start with a plain plane and a fragment shader. A compile error means a blank screen. (verified)
Notable: good learning order: gradient, noise, displacement.

## Film lighting basics (Blender manual, cinematography primers)
Link: https://docs.blender.org/manual/en/latest/render/lights/light_object.html
Made by: Blender Foundation. Licence: CC-BY-SA 4.0 (unverified).
Rules:
- Page text did not load past navigation. All rules below are from memory. (unverified)
- Three-point: a key (main, from one side and above), a fill (softer, opposite, about half the key), a rim/back light (edge separation). (unverified)
- Warm key with cool fill, or the reverse, adds depth. Keep the contrast intentional. (unverified)
- Big soft lights look premium; small hard lights look harsh. (unverified)
- Motivate every light: it should look like it comes from a window, lamp or sky. (unverified)
Notable: not verified; learning only.

## Codrops and other tutorials
Link: https://tympanus.net/codrops/
Made by: Codrops. Licence: not read (fetch returned 403).
Rules:
- Not read. No rules taken.
Notable: could not be fetched.

## Numbers and defaults table
| Item | Value | Source |
|---|---|---|
| Default shadow map | 512x512; smallest that looks right | three.js shadows (verified) |
| Shadow lights | 1 directional; no point-light shadows | three.js shadows (verified) |
| Phone shadow map | 1024 (2048 max), 1 shadow light | my judgment (unverified) |
| Real-time lights on phone | 1 key + 1 to 2 cheap fills + environment | my judgment (unverified) |
| Renderer defaults | tone mapping none, exposure 1, output sRGB | three.js docs (verified) |
| Non-metal base colour | sRGB 50 to 240 | Filament (verified) |
| Metal base colour | sRGB 170 to 255 | Filament (verified) |
| Metallic | 0 or 1 | Filament (verified) |
| Roughness minimum | about 0.089 | Filament (verified) |
| Default reflectance | 0.5 (about 4%) | Filament (verified) |
| Neutral tone map safe range | channels 0.08 to 0.8 unchanged | Khronos (verified) |
| Live cube-camera env map | about 256 | drei (verified) |
| HDRI size, static background | 1k to 2k wide; 256 to 512 for lighting only | my judgment (unverified) |
| HDRI format | gainmap jpg/webp smallest; .hdr or .exr otherwise | drei (verified) |
| Pixel ratio cap | 1.5 to 2 | common practice (unverified) |
| Cosine palette start | a=b=0.5, c=1, vary d | iq (unverified) |
| fbm octaves | 4 to 5 | common practice (unverified) |
| Grain strength | 2 to 4% to hide banding | common practice (unverified) |

## Rules summary for an AI coding tool
- Set colour spaces first: sRGB textures marked, renderer sRGB, output pass present with post-processing. (verified)
- Always add an environment map; a PBR material without one looks dead. (verified)
- Pick the tone mapper by job: Neutral for true brand/product colour; AgX or ACES for moody, cinematic scenes. (mixed)
- One shadow-casting light, tight shadow box, plus a blob or baked contact shadow. (verified)
- Never leave default grey plastic: base colour in the safe range, real roughness, metal 0 or 1. (verified)
- Mix brand colours in OKLab or OKLCH, not raw sRGB, to avoid muddy middles. (unverified)
- Hide banding in dark gradients with 2 to 4% grain or dither. (unverified)
- Cheap premium tricks (unverified, practice): fresnel rim, soft contact shadow, fog the same colour as the background, slight grain, gentle vignette.
- Cheap-look tells (unverified): pure white lights, no ground contact, over-bloom, rainbow gradients, flat grey default material, hard black shadows.

## Conflicts and open questions
- ACES vs AgX vs Neutral: no source ranks them; choice is by look. Needs a blind test.
- Light intensity: three.js manual uses sample numbers, Filament uses real units. No single number is right; judge by the render.
- Phone budget numbers (lights, shadow size, HDRI size) are my judgment, not a source.
- Not read: iq articles, ARM/Qualcomm, Blender lighting text, Codrops, glTF colour-space section, AccumulativeShadows, effect cost ranking.
- Many threejs.org manual URLs (manual/en/...) returned 404; the manual/pages/ form worked for lights, shadows, colour management.
- Book of Shaders is all rights reserved: learn from it, never copy its code into the skill.
