# Blender to the browser

Load this when a 3D model has to get from Blender (or any 3D tool) onto a page: export settings, compression, baked lighting, loading, and asset licences. Some steps happen in Blender by a person; say clearly which steps you can run and which the artist must do.

## The idea (any medium)

A real-time model is a different product from a rendered one. A film render can spend minutes on one frame; a phone has a hundredth of a second. So the work is to **move cost out of run time and into the file**:

- **Bake what does not change.** Soft shadows, bounced light, ambient occlusion, procedural patterns: paint them into textures once, so the device only shows a picture.
- **Detail lives in textures, not triangles.** A low-polygon shape with a good normal map and baked light looks richer than a dense mesh with flat colour.
- **Few materials, few objects.** Every separate material and object is a separate job for the GPU.
- **Size textures to how they are seen.** The hero's face needs resolution; the underside does not.
- **Compress twice**: once for the download (file size), once for the GPU (memory). They are different problems with different tools.
- **Keep the source, ship the export.** The `.blend` file is the master; the web file is a generated product you can rebuild.
- **Know where every asset came from** and under what licence.

## On the web

The format is **glTF 2.0**, as one binary file (`.glb`).

### 1. In Blender (the artist's part)

- Real scale (1 unit = 1 metre), origin at the base or the pivot, transforms applied (Ctrl+A: rotation and scale), normals facing out.
- **Principled BSDF only.** It is the one shader that exports as glTF's metal/rough material. Custom node trees, procedural noise and anything non-standard do not travel: bake them to image textures first.
- One UV map for materials with no overlaps where light will be baked; a second UV set for a lightmap if needed.
- Keep materials to 1-3 for a hero object (10 at the very most). Merge by sharing a texture atlas.
- Pack occlusion (red), roughness (green) and metalness (blue) into one image, marked Non-Color.
- Triangles: 20-60k for a phone hero, up to about 100k on desktop. Use the Decimate modifier or retopology; put lost detail into a normal map.
- Animation: one action per clip; put clips on NLA tracks to export several.
- What does **not** export: area lights and world (HDRI) lighting, curves and text that are not converted to mesh, physics, most material animation, modifiers unless applied on export.

### 2. Baking light (optional, large payoff for static scenes)

- In Cycles, bake **Diffuse** (with direct and indirect light) or **Combined** to an image for each object or for an atlas; bake **Ambient Occlusion** for a cheap contact-shadow map.
- Use the baked image as the base colour of an **unlit** material on the web (`MeshBasicMaterial`): no lights needed at run time, best looking shadows, fastest to draw.
- Baked light cannot react: use it for the environment and the things that never move; light the one moving hero in real time, with matching direction and colour.
- Bake at the size it will be seen: 1024-2048 for a whole small scene is common. Denoise the bake.

### 3. Export

`File > Export > glTF 2.0`:

| Setting | Value |
|---|---|
| Format | glTF Binary (`.glb`) |
| Include | Selected Objects (export only what the page needs); no cameras or lights unless used |
| Transform | +Y Up on |
| Mesh | Apply Modifiers on; UVs and Normals on; Tangents only if you use normal maps and see seams |
| Material | Export; images as-is (compress in the next step, not here) |
| Animation | on only if needed; NLA Tracks mode for several clips |
| Compression (Draco) | **off**: compress afterwards with better tools |

### 4. Optimise (you can run this)

`glTF-Transform` (MIT, command line and library) does the whole job:

```bash
npx @gltf-transform/cli inspect model.glb            # what is in it: triangles, textures, sizes, memory
npx @gltf-transform/cli optimize model.glb out.glb --compress meshopt --texture-compress webp --texture-size 2048
```

`optimize` removes duplicates and unused data, welds and simplifies, resamples animation, compresses geometry and resizes and compresses textures. Typical saving: 70-90% of the file.

**Geometry codec: pick one.**

| | Meshopt | Draco |
|---|---|---|
| Best for | animated models, morph targets, fast start-up | the smallest possible static mesh |
| Decoder | tiny, very fast | about 300 KB of WASM, slower to decode |
| three.js | `loader.setMeshoptDecoder(MeshoptDecoder)` | `DRACOLoader` with decoder files hosted beside your app |

**Textures: two different savings.**

- **WebP or AVIF** make the *download* small, but unpack to full size in video memory: a 2048 px image is about 22 MB on the GPU with mipmaps.
- **KTX2 (Basis Universal)** stays compressed *on the GPU*: 4-8x less video memory, which is what crashes phones. Use ETC1S mode for colour maps (smallest) and UASTC for normal and roughness/metal maps (cleaner). Needs `KTX2Loader` and its transcoder files, and power-of-two sizes (1024, 2048).
- Rule: more than two or three 2K textures, or a phone audience, means KTX2. One small model: WebP is fine.

### 5. Budgets to check with `inspect`

| | Phone | Desktop |
|---|---|---|
| File (compressed) | under 2 MB (5 MB hard stop) | under 5 MB (10 MB hard stop) |
| Triangles | 20-60k | up to 100k |
| Textures | 1024; 2048 for the hero only | 2048; 4096 only for close-up detail |
| Materials | 1-3 | up to 10 |
| Draw calls it adds | under 20 | under 50 |

### 6. Load

```js
// inside the scene's init(), after first paint, when the scene is near the viewport
const [{ GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
  import("three/addons/loaders/GLTFLoader.js"), import("three/addons/libs/meshopt_decoder.module.js")]);
const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync("/models/kettle.glb");
```

- The poster image (a render of the same model from the same angle) is in the HTML from the start; the model fades in over it. No blocking progress screen. For a file over about 2 MB a thin, quiet progress line on the stage is fair.
- Keep colour right: the loader marks colour textures as sRGB; do not change them. Apply the theme by tinting a neutral material or a light, not by repainting the model's textures at run time.
- React: `gltfjsx` turns a GLB into a component (`--transform` also optimises it). Simple viewer: `<model-viewer src poster alt loading="lazy">`.
- When the scene goes away, dispose geometries, materials, textures and the loaders' workers.

### 7. Assets and licences

- Use models, textures and HDRIs you made, that the client owns, or that carry a clear licence. **CC0** libraries (Poly Haven, ambientCG) can be used for anything with no credit required. Marketplaces and Sketchfab set a licence **per model**: read it; many forbid commercial use or need attribution.
- Never use assets ripped from a game, a film or another site, and never model a recognisable product, character or building that belongs to someone else.
- Keep an `ASSETS.md` (or a section in the README): file, source link, author, licence, date. Add credit on the page where the licence asks for it.
- Fonts converted to 3D text, and logos, carry their own licences too.

## If there is no artist and no model

Do not invent a detailed object in code. Choose a scene that simple geometry, light and shaders can do well (abstract forms, type, lines, the product's own UI as planes, data), or use a CC0 model that truly fits, or ask for the asset and build with a neutral stand-in clearly marked as one.

## Common mistakes

- A 40 MB GLB straight from Blender. Fix: `optimize`, texture size, KTX2.
- Materials look different on the web. Fix: Principled BSDF only; bake the rest; add an environment map.
- The model is black. Fix: metals need an environment; check normals and that colour spaces were left alone.
- Lights and HDRI "did not export". They never do: bake them, or rebuild the light rig in code.
- Draco ticked in Blender and again in the optimiser. Fix: compress once, at the end.
- No record of where the model came from. Fix: `ASSETS.md` before it ships.
