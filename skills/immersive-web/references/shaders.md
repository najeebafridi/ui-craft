# Shaders

Load this when you write or review a shader (GLSL, or three.js TSL), build a shader-based hero or texture, or need a palette for one.

## The idea (any medium)

A shader is a tiny program that decides the colour of each pixel. That makes it a **material, a light or a texture with a job**:

- a material (brushed metal that follows the pointer, paper grain, a soft rim)
- a field that shows something (flow, heat, sound, elevation, a signal)
- a transition (one image dissolving into the next along a shape)
- an atmosphere (haze, grain, a slow change of light)

It is not wallpaper. "A cool gradient that moves" is the most common and most generic use; if the shader could sit behind any company's headline, it says nothing about this one.

Good shader work shares these traits in any medium:

- **A small palette from the theme**: two to four colours, mostly the neutrals, the accent rare.
- **Structure before colour.** Decide the shape language first (lines, cells, bands, dots, folds), in black and white. Colour comes last.
- **Slow, and it rests.** Shader motion that never stops is tiring and drains batteries.
- **A physical reference.** Ink in water, light through blinds, contour lines, woven cloth, frost. Things that exist give more convincing results than "abstract".
- **Imperfection.** A little grain and unevenness makes a digital surface feel like a photographed one.

## On the web

### The smallest setup

One fragment shader on one triangle that covers the canvas needs no library (about 40 lines of WebGL, as in `assets/starter.html`). Reach for three.js only when the shader lives on real 3D geometry.

Uniforms every shader hero needs: resolution in pixels, a time value that you control (so it can slow, stop and rest), the theme colours, and at most one input such as pointer or scroll progress.

```glsl
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec3 uBg, uInk, uAccent;
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);   // centred, square units: same look at any size
  ...
}
```

Work in units that do not depend on the canvas size, or the design changes between phone and desktop.

### Shape tools

- **Shaping functions** turn a gradient into a form: `step` and `smoothstep` for edges, `fract` to repeat, `abs` to mirror, `pow` to bend.
- **Distance fields**: write a function that returns the distance to a shape (circle: `length(p) - r`; rounded box; line segment), then draw the edge with `smoothstep`. Shapes blend, repeat and outline cheaply.
- **Anti-alias with derivatives**: `float w = fwidth(d); float a = 1.0 - smoothstep(-w, w, d);` gives a one-pixel soft edge at any zoom (WebGL 1 needs the `OES_standard_derivatives` extension; WebGL 2 has it built in).
- **Noise** gives organic variation. Layer 3-5 octaves (each at double the frequency and half the strength) for cloud-like fields; feed noise into the coordinates of more noise ("domain warping") for flowing, marbled forms. More than 5 octaves is rarely visible and always paid for.
- **Contours**: `fract(height * n)` turns any smooth field into lines. Lines read as designed; blobs read as default.

### Palette from the theme

- Pass theme colours as uniforms from `readTheme()` (see `theme-bridge.md`). Never type a hex into GLSL.
- Lit or blended light: linear in, convert to sRGB on the last line. Flat graphic colour: sRGB in, straight out.
- Blend between colours in **OKLab**, not raw RGB. Either mix on the CPU with `mixOklab()` and pass a ready-made 3-5 stop ramp, or port the two small matrices into the shader. RGB mixing of a blue and an orange goes through grey mud; OKLab keeps it clean.
- Keep most pixels in the neutrals (`--bg`, `--surface`, `--border`). Let the accent appear in one band, one line or one highlight.
- For a transparent canvas over the page, output premultiplied colour: `gl_FragColor = vec4(colour * alpha, alpha);` and fade the alpha to zero toward the canvas edge, so there is no visible rectangle.
- A cosine-based palette function (offset + amplitude x cos of phase) is a compact way to get smooth ramps; drive its constants from the theme colours rather than using a rainbow.

### Grain and banding

Soft gradients on 8-bit screens show steps ("banding"), worst in dark themes. Add a tiny random value per pixel before output:

```glsl
float grain(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) - 0.5; }
colour += grain(gl_FragCoord.xy) * 0.03;            // 2-4%: hides banding, reads as film
```

Animate the grain only if the scene is already moving; static grain under reduced motion.

### Time, motion and rest

- Advance your own clock: `clock += delta * speed * rest`. `rest` falls to 0 within 5 seconds of the last input, and is 0 under reduced motion, so the shader draws a still frame and the loop stops.
- Scale `speed` by the theme tempo (slow themes drift slower).
- Never use raw `performance.now()` as `uTime` for ever: after hours the float loses precision and the pattern jitters. Wrap or reset it.
- Pointer and scroll inputs are smoothed on the CPU before they reach the shader.

### Cost

The fragment shader runs once per pixel, every frame. A full-screen shader on a 3x phone at full resolution is millions of runs.

- Cap the pixel ratio (1.5 on touch; a soft field can even render at 1x or 0.75x and be scaled up).
- Count texture reads and loop iterations: these dominate. A full-screen pass with a 64-step ray march is a desktop-only luxury; keep phone shaders to simple maths and a few noise calls.
- Do work in the vertex shader when it varies slowly (it runs per corner, not per pixel).
- Set precision on purpose: `highp` where coordinates or time need it (phones differ widely at `mediump`), `mediump` for colour maths.
- Avoid drawing transparent layers over each other across the whole screen (overdraw): each layer costs a full screen of pixels again.
- Draw once and stop when nothing changes.

### TSL (three.js)

three.js's node language (TSL) builds shaders in JavaScript and compiles them for WebGL and WebGPU from one source. Prefer it over patching GLSL strings into built-in materials when you extend a lit material (it keeps lights, shadows and tone mapping correct). Plain GLSL is still the simplest route for a stand-alone full-screen effect. Check the current three.js docs for syntax: this area changes quickly.

### Fallbacks

- Reduced motion: the same shader, one still frame (pick a good-looking moment of the clock, not zero).
- No WebGL: a CSS version of the same idea (layered `radial-gradient` / `conic-gradient` in the theme colours, an SVG pattern), or a pre-rendered poster. It should be recognisably the same picture.

## Common mistakes

- A moving purple-blue gradient blob. Fix: start from structure and a physical reference; use the theme's palette.
- Colours typed into the shader, so dark mode and re-theming break. Fix: uniforms from the bridge.
- Visible steps in dark gradients. Fix: grain.
- Hard canvas edge against the page. Fix: transparent output, alpha fade.
- The fan starts on a laptop. Fix: pixel-ratio cap, fewer octaves, render on demand, rest.
- Pattern size differs between phone and desktop. Fix: square, centred units.
