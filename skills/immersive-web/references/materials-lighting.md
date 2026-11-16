# Materials and lighting

Load this when you light a scene, choose materials, fix colours that look wrong, or add post-processing.

## The idea (any medium)

**Light is the design.** The same grey box looks cheap or expensive depending only on how it is lit.

- **One key light, from above.** It is the same single light source ui-craft uses for shadows on the page, so the scene and the UI agree. Place it above and to one side, in front of the subject.
- **Fill** the shadow side softly so it is dark but readable. Fill is weaker than the key (a third or less) and usually comes from the environment, not a second lamp.
- **Rim** light from behind draws a bright edge that lifts the subject off the background. On dark themes it does the job shadows do on light ones.
- **Soft light flatters, hard light dramatises.** A big light source close to the subject gives soft shadow edges (studio, care, luxury). A small or distant one gives hard edges (sport, drama, print).
- **Light has colour.** Never pure white, never pure black shadow. A slightly warm key with a slightly cool fill (or the reverse) gives depth. Tint the fill and the shadows toward the theme's neutral hue.
- **Motivated light.** Light should seem to come from somewhere: a window, a lamp, the screen, the sky. Light from nowhere looks like a default.
- **Ground the subject.** A soft, dark contact shadow directly under an object tells its weight and position. It matters more than any other shadow.
- **Materials are told by how they blur light.** Rough surfaces scatter (paper, clay, fabric); smooth ones mirror (glass, lacquer, polished metal). Most real things are rougher than you think. Pick one hero material and let the others be plain.
- **Restraint.** Three or four materials in a scene. One of them may be special.
- **Contrast of light is the drama.** A cinematic look is mostly a bright subject against darker surroundings, a clear direction of light, and a rim. Flat, even light looks like a 3D viewer; a pool of light looks like a film. Be bold with the one light, quiet with everything else.

## On the web

### Colour first, or nothing else can be judged

- Colour images (base colour, emissive) are sRGB; data images (normal, roughness, metalness, ambient occlusion) are not colour and must stay linear. In three.js: `texture.colorSpace = THREE.SRGBColorSpace` for colour maps only; `renderer.outputColorSpace = THREE.SRGBColorSpace` (the default in current versions).
- With post-processing, colour conversion and tone mapping happen once, in the final output pass.
- Symptoms: **too dark and contrasty** = a conversion is missing; **pale and washed out** = it happened twice. Do not fix either by changing light intensity.
- Feed theme colours as **linear** values to lit materials (the bridge gives both).

### Tone mapping

Tone mapping squeezes bright light into what a screen can show. It is off by default in three.js.

| Goal | Use |
|---|---|
| Brand and product colours must stay true (most product pages) | Khronos PBR Neutral (`NeutralToneMapping`): colours in the normal range pass through unchanged |
| Moody, filmic, high-contrast scenes | AgX or ACES Filmic: softer highlights, but they shift and desaturate colours |
| Flat, unlit, diagram-like scenes | none |

Then set exposure by eye. If the accent no longer matches the page's accent, the tone mapper is changing it: switch to Neutral.

### Lights

- **Always give physical materials an environment** (`scene.environment`): a small HDR image or a generated studio environment. A standard material with no environment looks dead, and metals look black. For lighting only, 256-512 px is enough; blur it. Tint or choose it to suit the theme.
- Add **one** directional key light for shape and shadow. That is usually the whole rig: environment (fill) + key + perhaps a rim.
- Real-time lights cost per pixel. Phone budget: 1 key + environment. Every extra light should earn its place.
- three.js light intensities depend on units and version; do not copy numbers. Set the key so the lit side of a mid-grey object is clearly brighter than the shadow side, but not white.

### Shadows, cheapest first

1. **Baked** into a texture in Blender (see `blender-pipeline.md`): free at run time, best quality. Use when nothing moves.
2. **Blob or contact shadow**: a soft dark shape under the object (a blurred plane, drei `ContactShadows`, or a few lines of shader). Cheap, and often all you need.
3. **One real-time shadow map** from the key light: `1024` on phones, `2048` at most on desktop. Fit the shadow camera tightly around the subject; a loose box wastes the map and looks blurry. Soften the edge (PCF soft, a small `radius`).
4. Never: shadows from point lights (six renders each), several shadow-casting lights, shadows on everything.

Tint shadows with `--shadow-color` and fade them toward `--bg`. Pure black shadows look pasted on.

### Materials

- `MeshStandardMaterial` covers nearly everything. `MeshPhysicalMaterial` (clearcoat, transmission, sheen, iridescence) costs more per pixel: use it on one hero object, not the scene. Transmission (glass) is the most expensive thing you can add: it renders the scene again.
- Base colour: keep away from pure black and pure white (roughly 20% to 94% brightness for non-metals) so light has something to do.
- Metalness is **0 or 1**. In-between values are for blends in a texture, not a look. Metals take their colour from reflections: without an environment they are black.
- Roughness is the main dial. Avoid 0 (a perfect mirror shimmers and aliases); most things sit between 0.3 and 0.9. Add a little variation with a roughness map on the hero.
- Unlit (`MeshBasicMaterial`) with baked light is the right choice for flat, illustrative and "cut paper" directions, and it is the fastest.
- Edges: real objects have slightly rounded edges that catch a line of light. Bevel hero geometry a little; razor-sharp edges look like placeholders.

### Cheap tricks that read as expensive

- A fresnel rim: brighten surfaces that face away from the camera, tinted with the accent or the fill.
- A soft contact shadow and a floor that fades into `--bg` (fog in the background colour does this).
- A slow, small highlight that crosses the hero as it turns.
- 2-4% film grain over the final image: hides banding, adds a photographic surface.
- A very gentle vignette toward `--bg` (not toward black on a light page).

### Post-processing

Each pass redraws the screen. Budget: 0-1 passes on phones, 1-3 on desktop.

| Cheap | Costly | Avoid by default |
|---|---|---|
| grain, vignette, colour grade, a light bloom at half resolution on a few emissive parts | depth of field, ambient occlusion (SSAO), full-resolution bloom, screen-space reflections | chromatic aberration, heavy glitch, lens flares, god rays on everything |

Bloom on the whole image makes a scene look like a screenshot from 2015. If something should glow, make only that thing bright and bloom only above a high threshold.

## Common mistakes

- Default grey material, white light, black background. Fix: environment, tinted key, theme surface colour, page background.
- Colours do not match the page. Fix: colour spaces, then Neutral tone mapping.
- The object floats. Fix: contact shadow.
- Everything is shiny. Fix: raise roughness; one special material.
- Four lights with shadows on a phone. Fix: environment + one key, baked or blob shadow.
- Glass and bloom to make it "premium". Fix: better light on a simpler material.
