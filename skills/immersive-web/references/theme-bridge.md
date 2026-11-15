# Theme bridge: one theme, every layer

Load this when you wire a scene, a shader or a motion system to the product's theme, or when you need to know how far a given ui-craft direction should go.

## The idea (any medium)

A product has one design language. The page, the 3D scene, the shader and the motion are layers of it, not separate designs. So nothing in the scene is chosen twice:

| The theme says | The scene uses it as |
|---|---|
| `--bg` | the world behind the subject: clear colour, fog colour, the floor |
| `--surface`, `--surface-2`, `--surface-3` | the main materials (neutral, most of the picture) |
| `--accent` | one object, one light or one line. The rarest thing in the frame |
| `--accent-soft` | a tinted fill light, a glow kept faint, a secondary plane |
| `--text`, `--text-muted` | ink: lines, labels, diagram strokes |
| `--border`, `--border-strong` | outlines, wireframes, grid lines |
| `--shadow-color`, `--shadow-strength` | the colour and weight of contact shadows (tinted, never grey-black) |
| `--radius`, `--radius-lg` | bevels, edge roundness, the corner of any card-like object |
| depth style (hairline, soft, crisp, diffuse, flat, lip) | how objects sit: outline only; soft contact shadow; tighter and glossier; wide and faint; none; a hard offset edge |
| `--dur-fast/base/slow`, `--ease-out` | the tempo of every move: camera, object, scroll easing |
| `--press-scale` | how far an object gives when pressed or picked |
| `--font-display`, `--font-sans` | all words, as real text over or beside the scene |
| `--immersive` (0-3) | the ceiling for how much 3D and scroll effect the product carries |

Three rules follow.

1. **Mostly neutral, in 3D too.** The 5-10% accent rule holds for the frame as a whole. A scene made entirely of the brand colour looks like a logo animation.
2. **The scene sits on the page.** No box around it and no second background. Its edges fade into `--bg`.
3. **Both themes.** A scene that follows the tokens gets its dark version for free. In dark themes objects are lighter than the world and separated by a rim or outline, not by shadows.

## On the web

`assets/theme-bridge.js` (no dependencies; copy it into the project, or inline it in a single-file page):

```js
import { readTheme, watchTheme, bezier, mixOklab } from "./theme-bridge.js";

let theme = readTheme();                                  // reads the tokens on <html>
material.color.setRGB(...theme.color.surface.linear);     // three.js: linear values into a lit material
light.color.setRGB(...theme.color.accentSoft.linear);
renderer.setClearColor(0x000000, 0);                      // transparent canvas: the page is the background
gl.uniform3fv(uAccent, theme.color.accent.linear);        // raw WebGL: light in linear, encode to sRGB at the end
gl.uniform3fv(uLine, theme.color.border.srgb);            // flat, unlit drawing: sRGB straight out

const ease = bezier(...theme.motion.ease);                // the theme's own curve, as a function of 0..1
const moveMs = theme.motion.slow * 2.2;                   // a scene move in this theme's tempo
const level = theme.immersive;                            // 0 still, 1 accent, 2 signature, 3 story

watchTheme((next) => { theme = next; applyTheme(); scene.invalidate(); });   // light/dark switch, new direction, reduced motion
```

- **Linear or sRGB?** Lit materials and anything you add, multiply or blend as light need linear values; convert to sRGB once at the end (three.js does this when `outputColorSpace` is sRGB). Flat colour drawn as-is can use the sRGB values directly. Mixing the two is the usual cause of "too dark" or "washed out".
- **Gradients and ramps** between theme colours: `mixOklab(a.linear, b.linear, t)` keeps the middle clean. Mixing raw sRGB goes grey or muddy.
- **Other token names.** Pass a map: `readTheme(document.documentElement, { accent: "--brand-500", bg: "--background" })`. The bridge accepts any CSS colour syntax (hex, rgb, hsl, oklch, color-mix).
- **No tokens at all.** The bridge falls back to the page's own background and text colour, so the scene still belongs. Then go and set up a theme with ui-craft.
- **Text in the scene's colours** needs no bridge: it is HTML and reads the CSS variables itself.
- **Per-frame cost:** read the theme once and on change, never inside the render loop.

Tempo from the tokens (a guide, not a law):

| Theme motion | UI (`--dur-fast/base/slow`) | Scene and camera move | Ambient motion | Overshoot |
|---|---|---|---|---|
| instant (tools) | 90 / 140 / 200 ms | follows input at once, 300-450 ms | none | no |
| crisp (most products) | 120 / 200 / 300 ms | 600-700 ms | very slight, rests in 5 s | no |
| gentle (care, reading) | 160 / 260 / 400 ms | 800-900 ms | slow breathing, rests | no |
| slow (luxury) | 180 / 320 / 560 ms | 1000-1200 ms, long holds | slow drift, rests | no |
| bouncy (play) | 120 / 220 / 360 ms | 700-800 ms | light bob, rests | one, on reward moments |

## The 16 directions as scenes

Each direction's file header (ui-craft `assets/directions/*.css`) carries its level and scene line. Treat the level as the default ceiling; the product owner may set another in the Studio.

| Direction | Level | Scene character |
|---|---|---|
| Calm productivity | 1 accent | Matte, paper-like forms under soft overhead light. Motion only confirms: one object settles, then rests |
| Quiet instrument | 1 accent | Thin line geometry and points on near-black, no gloss. The data is the scene. Instant; nothing drifts |
| Paper and ink | 1 accent | Flat sheets, hard print-like shadows, ink colour only. Cuts or short fades, like turning a page |
| Studio gloss | 3 story | A studio product shot: one large soft light from above, a glossy object, a floor that fades to the page |
| Maison | 2 signature | A still life: stone, linen, brushed brass, one warm window light. Slow dissolves, long holds, no bounce |
| Apothecary editorial | 2 signature | Ceramic and glass on a paper backdrop in side daylight. One object turns slowly |
| Soft wellness | 1 accent | Soft rounded forms in diffuse light, no hard shadows. Slow breathing motion that rests |
| Playful game-feel | 2 signature | Chunky toy shapes with a solid drop edge, flat bright colour. Squash, stretch, one bounce on reward |
| Trusted ledger | 0 still | No decorative 3D. At most a precise chart that draws itself once |
| Neo-bank bold | 2 signature | Bold card objects on dark, a strong accent rim light. Confident, crisp moves; one hero card |
| Public clarity | 0 still | No decorative 3D or scroll effects. A map or diagram only when it explains something |
| Open-air marketplace | 1 accent | The photos are the scene. A shared-element move from card to detail; no parallax on text |
| Stage dark | 3 story | A dark stage, one spotlight, a little haze, colour from the artwork. Cinematic cuts, slow push-ins |
| Athletic monument | 3 story | A monumental product on a plinth, hard directional light. Fast cuts, big type that moves with the scroll |
| Graph-paper technical | 2 signature | Wireframes, grids, isometric diagrams: points and lines, not surfaces. The data flow is the scene |
| Bright workshop | 2 signature | Cut-paper colour blocks in flat light. Snappy moves; shapes assemble into the product |

Use the line as a starting brief, then make it specific to the product: *what* object, *which* data, *whose* story. A direction gives the manner; the subject must come from the product.

## Common mistakes

- A hex colour typed into a shader. Fix: a uniform fed from the bridge.
- A canvas with its own dark background on a light page. Fix: transparent canvas or clear colour = `--bg`; fade the edges.
- The scene ignores dark mode. Fix: `watchTheme()` and re-apply.
- Everything in the accent colour. Fix: neutrals for the mass, accent for one thing.
- UI moves in 200 ms while the scene floats for 3 seconds. Fix: derive scene timing from the same tokens.
