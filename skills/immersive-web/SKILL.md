---
name: immersive-web
description: Build immersive, cinematic "website of the future" experiences that stay fast and accessible - 3D scenes in the browser (Three.js, React Three Fiber, WebGL, WebGPU), shaders (GLSL, TSL), scroll-driven storytelling and scrollytelling, cinematic motion and page transitions, and the path from Blender to the browser (glTF/GLB export, Draco, meshopt, KTX2, baked lighting). Use whenever the user asks for 3D, WebGL, a shader, particles, a 3D product viewer or configurator, a scroll animation, parallax, a pinned or sticky scroll story, an animated or interactive hero, view transitions, an "immersive", "cinematic", "award-winning", "Awwwards-style" or "wow" site, or wants a game-like, sci-fi or film-like feel in a website, desktop app (Electron, Tauri), mobile app or dashboard. Also use to make an existing 3D or animated page faster, to add reduced-motion and no-WebGL fallbacks, or to bring a Blender model onto a page. Works with the ui-craft skill: ui-craft owns layout, type, colour and components; this skill adds the scene, the shader and the motion on the same theme tokens.
---

# immersive-web

How to build 3D, shader and scroll-driven experiences that feel like the best films and games, load like a normal page, and leave nobody out.

**This skill is one layer.** The `ui-craft` skill (same plugin) owns ordinary interface design: layout, hierarchy, type, colour, components, forms, states. Use it for all of that, and do not repeat it here. This skill adds the layer on top: scene, light, material, shader, camera, scroll and cinematic motion. Both read the **same theme tokens**, so one theme drives the page and the scene (`references/theme-bridge.md`).

**Honest limit.** You can direct a scene, light it, move a camera, write shaders and wire a model in. You cannot sculpt film-quality 3D art from nothing. Compose from simple geometry, shaders, type and light, or use a model the team supplies. Never fake it with a crude drawing of the subject.

## 1. The nine hard rules

Break one and the work is not done, however good it looks.

1. **Content first.** Headings, copy, links and buttons are real HTML, readable before any script runs. The scene is added on top and can vanish without loss. Never draw the page's words into a canvas. Never hide content at `opacity: 0` in the CSS waiting for a script to reveal it.
2. **Three states for every effect.** *Full*; *reduced motion* (a still frame or a short fade: `prefers-reduced-motion`, and the OS setting in native apps); *no GPU* (a poster image or CSS/SVG art shown when WebGL or WebGPU is missing, fails, or the context is lost). Design the two fallbacks first. They are also what loads first. **A fallback is the same picture, quieter**: the same subject from the same angle (a poster made from the scene itself), and for a data scene the same data drawn flat. A blank box, a plain gradient or "image to come" is a failure.
3. **A speed budget, decided before building** (§4). The page's text paints first; the engine loads after. On a phone the scene costs less than the content.
4. **One signature moment per page, and make it count.** One scene, one idea, done completely. Everything else stays quiet. Effects everywhere read as a template and exhaust people. Restraint limits the **number** of effects, not their strength: the one moment is an *event* that belongs to this product (the kettle pours; the sky fills with stars as eyes adjust), staged boldly enough that someone would describe it to a friend. An object that only turns as you scroll is not a moment.
5. **Never take the scroll.** The browser scrolls; you only read the position. No changed speed or direction, no wheel hijack, no fake scrollbar. Pin with `position: sticky`, keep it short, give a way to skip.
6. **Words and scene never share a place.** At every scroll position the text sits beside the subject or on its own surface, never across it. Navigation and buttons laid over a scene get a scrim or a surface. Check every scroll screenshot, not only the first.
7. **Keyboard and screen reader reach everything real.** Tab order follows the reading order. A decorative canvas is `aria-hidden="true"`; a meaningful one has a text equivalent beside it. Anything you can do by dragging the scene, you can do with a button.
8. **Motion rests, sound waits, nothing flashes.** Ambient motion settles within 5 seconds or has a visible pause control. Sound is off until asked for. No more than 3 flashes a second, ever. Nothing runs off screen or in a hidden tab.
9. **Original and licensed.** Learn the language of a genre; never copy a product's look, models, characters, logos or sounds. Use only assets you made or that have a clear licence (CC0 libraries such as Poly Haven and ambientCG are safe), and record each one.

## 2. Workflow (do this every time)

1. **Look before you build.** Find the theme: `theme.css`, `DESIGN.md` (from the ui-craft Studio), tokens, a Tailwind config, brand colours. Read `--immersive` and the brief's "Immersive and motion" section if present: they state the intensity the owner chose. Check the stack (plain HTML, React, Vue, an app shell) and any 3D assets already supplied. With no theme at all, use ui-craft first to choose a direction.
2. **Choose the level** on the ladder in §3. Take it from the theme if it says; otherwise pick the lowest level that delivers the idea. Level 3 is rare.
3. **Pick the lightest tool that can do it.**

   | Need | Use | Cost |
   |---|---|---|
   | Reveal, parallax-free scroll effects, page transitions | CSS only: scroll-driven animations, `position: sticky`, View Transitions | 0 KB |
   | A flat living texture, lines, a field, a 2D figure | Canvas 2D or SVG, or one fragment shader on a single triangle (raw WebGL, no library) | 2-5 KB |
   | Show one 3D model people can turn | `<model-viewer>` | about 250 KB, lazy |
   | A real scene: several objects, lights, a moving camera | three.js (React app: React Three Fiber) loaded with dynamic `import()` | 150-180 KB gzip, lazy |
   | Timelines tied to scroll that CSS cannot express | GSAP ScrollTrigger (free, not open source: load it, never copy it in) or Motion | 25-45 KB |
   | Newest GPU features | WebGPU as an upgrade on top of a WebGL path, never alone | - |

   Do not add a smooth-scroll library by default. If the brief demands one, it must turn itself off under reduced motion.
4. **Write the immersive brief** (add it to the ui-craft design brief), before code:
   ```
   Level: 2 signature (theme says --immersive: 2)        Stack: plain HTML + three.js, lazy
   Signature moment (an event, not a turntable): at beat 3 the kettle tips and a thin stream pours, holding its line
   Scene: one matte ceramic kettle in a pool of light on the page background; soft key from above left, warm rim
   Text lane: copy in the left column on desktop, under the pinned scene on phones; the kettle never crosses it
   Camera: 35mm-like, slightly above, never moves by itself         Tempo: gentle (--dur-slow 400ms)
   Beats (level 3 only): 1 whole kettle - 2 the spout, close - 3 pouring - 4 the set on a table
   Reduced motion: one still render per beat, cross-faded        No GPU: a poster of the same scene, same angle
   Budget: text paints first; engine after; scene under 1.5 MB on phones; pixel ratio 1.5 on touch
   ```
5. **Build in this order.** (a) The whole page as plain HTML and CSS with ui-craft, with the poster or CSS fallback in the scene's place. It must already be a good page. (b) The scene shell: `assets/scene-shell.js` gives lazy start, still frames, fallback, pause off screen, pixel-ratio cap, lost-context recovery. (c) The theme bridge: `assets/theme-bridge.js` so colours, radius and tempo come from the tokens. (d) The scene itself, at its simplest. (e) Motion and scroll. (f) Polish: light, material, grain, timing. `assets/starter.html` is a working page with (a)-(c) done; replace its placeholder scene.
6. **Check, then look.** Run `node <skill-dir>/scripts/immersive-check.mjs page.html`. It loads the page five ways (desktop, phone, reduced motion, no WebGL, no JavaScript), measures weight, draw calls, pixel ratio, native scrolling and pauses, and saves screenshots. For an app window (Electron, Tauri, a signed-in web app) add `--app` to skip the no-JavaScript test. **Open every screenshot.** Fix what fails. Look hardest at three: the middle of the scroll (is any text crossing the subject?), the phone's middle (scene and text together in one screen, no empty band?), and the no-WebGL one (the same picture, or a hole?). Make the poster from the scene itself: `--poster hero-poster.png` saves the scene's box from the desktop pass (`--scheme light` or `dark` picks the theme), ready to use as the fallback image. Then run ui-craft's `ui-audit.mjs` for contrast, tap targets and type, and judge the phone as strictly as the desktop. Final pass: `references/accessibility-fallbacks.md` checklist.

## 3. The immersion ladder

Every product sits on one rung. The theme can carry it as `--immersive: 0-3`; each of the 16 ui-craft directions sets a default (`references/theme-bridge.md`).

| Level | What it is | Fits | Does not fit |
|---|---|---|---|
| **0 Still** | No 3D, shaders or scroll effects. Ordinary interface motion only | finance tools, admin, government, health forms, dense dashboards, anything used all day | - |
| **1 Accent** | One quiet living detail: a material, a slow shader texture, a view transition. It rests after a few seconds. No scroll-driven scenes | SaaS apps, docs, most product UI, desktop and mobile apps | tasks where people are anxious or rushed |
| **2 Signature** | One hero moment: an object or shader that answers the pointer or the first scroll. Then a normal page | landing pages, product pages, portfolios, onboarding, a launch screen | pages people revisit daily |
| **3 Story** | A scroll-driven sequence of 3-5 beats with one persistent scene | launches, campaigns, editorial features, museum and brand stories | apps, checkout, anything with a task |

Rules of the ladder: the level is a **ceiling**, not a target. Frequency lowers it: the more often a person sees a screen, the lower the level. A task lowers it: where someone is paying, signing or fixing a problem, use level 0. When unsure, go one level down and finish it better.

## 4. Budgets

Working targets. Measure; do not guess. Numbers marked * are sensible defaults, not published limits.

| What | Phone | Desktop |
|---|---|---|
| Largest Contentful Paint (must be text or a poster, never the canvas) | 2.5 s or less | 2.5 s or less |
| Script requested before first paint | under 170 KB compressed | same |
| Engine (three.js about 180 KB gzip) | after first paint, dynamic `import()`, only when the scene is near the viewport | same |
| First scene payload: engine + models + textures * | under 1.5 MB | under 4 MB |
| Hero model (GLB, compressed) * | under 2 MB, 20-60k triangles | under 5 MB, up to 100k |
| Textures | 1024 px; 2048 only for the hero; KTX2 for GPU memory | 2048; 4096 only for close-ups |
| Pixel ratio | cap 1.5, drop to 1 when slow | cap 2 |
| Draw calls per frame * | under 100 | under 300 |
| Real-time lights | 1 key (+ environment); 1 shadow map of 1024, or a baked / blob shadow | 1-3; shadow map 2048 at most |
| Post-processing passes | 0-1 | 1-3 |
| Frame time | 60 fps steady; step quality down before dropping under 30 | 60 fps |
| Scroll story | 3-5 beats, 100-150vh each, pinned run under 5 screens *, a skip link | same |
| Preloader | none; the page is readable in 1-2 s and the scene fades in when ready | same |

A 2048 px texture costs about 22 MB of video memory once unpacked, whatever its file size, unless it is KTX2. Details and the step-down order: `references/performance.md`.

## 5. One theme drives every layer

- Read colours from the tokens (`--bg`, `--surface`, `--accent`, `--accent-soft`, `--text`, `--border`...), never hard-code a hex in a shader or material. `readTheme()` in `assets/theme-bridge.js` returns each as linear RGB for lighting maths and sRGB for flat drawing, and `watchTheme()` re-reads on a light/dark switch.
- The scene sits **on the page background**: a transparent canvas, or a clear colour equal to `--bg`. No visible rectangle, no second background colour.
- The accent stays rare in 3D too: one object, one light, one line. Mostly neutral.
- The theme's shape carries over: corner radius becomes bevel and edge radius; the depth style becomes the shadow style (hairline: thin outline, almost no shadow; soft: wide soft contact shadow; crisp: tighter and glossier; lip: a hard offset edge; flat: none).
- The motion tokens set the tempo: `--dur-*` and `--ease-out` shape camera moves and scroll easing (`bezier()` in the bridge), so an "instant" tool and a "slow" luxury house move differently with the same code. Bounce only where the theme's curve overshoots.
- Type stays HTML in `--font-display` and `--font-sans`, laid over or beside the canvas.

## 6. Craft, in short

**Scene and camera** (`references/scene-camera.md`)
- One subject, one clear silhouette, a lot of quiet space. Compose for the phone's tall frame first.
- A long lens (field of view 20-35 degrees) flatters objects; wide angles distort. The camera moves slowly and with a reason, or not at all.
- Render on demand. A scene that is not changing draws nothing.

**Light and material** (`references/materials-lighting.md`)
- One key light from above (the same single light source as the UI), a soft fill, a rim to separate the subject from the background. Light is never pure white; shadows are never pure black.
- Ground the subject: a soft contact shadow, or it floats.
- Set colour spaces before judging anything. Too dark or washed out is a colour-space mistake, not a lighting one.
- Bake light into textures when the scene is static. It is the cheapest light there is.

**Shaders** (`references/shaders.md`)
- A shader is a material, a light or a texture with a job. Not a wallpaper.
- Palette from 2-4 theme colours, mixed in OKLab so the middle stays clean. No rainbow.
- Add 2-4% grain to hide banding in soft gradients. Keep fragment work cheap on phones: few texture reads, no long loops.

**Scroll storytelling** (`references/scroll-storytelling.md`)
- Each beat is one idea with a line of real text. If a beat has nothing to say, cut it.
- The text scrolls normally; the scene holds still (sticky) and changes with it. Scrub position, never time.
- Reduced motion turns the film into slides: one still per beat.

**Cinematic motion** (`references/cinematic-motion.md`)
- Cut or dissolve between ideas; move within one. Hold on what matters. Ease is acting: weight, not decoration.
- Interface motion keeps ui-craft's timing (100-300 ms). Scene and camera moves take 600-1200 ms. Page transitions 200-500 ms, and the URL, back button and focus keep working.

**Blender to the browser** (`references/blender-pipeline.md`)
- Principled BSDF only, bake the rest, export GLB, then compress: `gltf-transform optimize`, meshopt or Draco, KTX2 textures. Inspect the file before it ships.

## 7. Decisions, not defaults

These read as generic or cheap. Use them only when the brief truly calls for them:

- a purple-blue gradient blob, an "aurora" or a particle field behind the headline
- a spinning shiny torus knot, a wobbling sphere, floating glass shapes with no subject
- the subject on a turntable: it rotates as you scroll and nothing ever happens
- a stand-in shape labelled as the real thing (a knot captioned "your part")
- flat, even light on a dark page: no pool of light, no rim, no staging
- default grey plastic material, pure white light, no ground contact
- bloom on everything, rainbow iridescence, chromatic aberration as a style
- stars, a wireframe globe or a neon grid floor because the product is "tech"
- a preloader with a percentage counting up
- text that flies in letter by letter, section after section
- scroll-jacked full-screen slides; a custom cursor; a sound that starts by itself
- an effect copied from a famous site with the colours changed

Banning a pattern is not a design. Decide what the scene is **about** (the product, its material, its data, its story), build that one thing well, and keep the rest of the page calm.

## 8. Beyond a website

The ideas travel; the technique changes. A desktop app, a mobile app or a dashboard can carry the same scene language at a lower level, with the platform keeping its bones. A dense finance tool gets level 0 or one precise accent. A work tool that is also a showpiece (a wall screen, a demo) gets two modes: a calm desk mode and a display mode where the asked-for character is delivered in full. Read `references/beyond-web.md` before using any of this outside a normal web page, and ui-craft's `references/mixing.md` for borrowing a genre's look (game, sci-fi, film) on another medium.

## 9. Reference files (load only what you need)

| File | Load when |
|---|---|
| `references/theme-bridge.md` | wiring the scene to the theme; per-direction scene character and level |
| `references/scene-camera.md` | composing a scene, choosing a lens, camera moves, the render loop |
| `references/materials-lighting.md` | materials, lights, shadows, colour space, tone mapping, post-processing |
| `references/shaders.md` | writing GLSL or TSL, shader palettes, noise, grain, shader cost |
| `references/scroll-storytelling.md` | scroll-driven sequences, sticky scenes, beats, progress |
| `references/cinematic-motion.md` | timing and easing for scenes, cuts and dissolves, page transitions, sound |
| `references/blender-pipeline.md` | exporting from Blender, glTF, compression, baking, asset licences |
| `references/performance.md` | budgets, lazy loading, quality steps, memory, measuring |
| `references/accessibility-fallbacks.md` | reduced motion, no-WebGL, keyboard, screen readers, the final checklist |
| `references/beyond-web.md` | desktop apps, mobile apps, dashboards; where it does not fit |

Assets: `assets/theme-bridge.js` (tokens to scene values), `assets/scene-shell.js` (life cycle with fallbacks built in), `assets/starter.html` (a working page with both; replace its placeholder scene).
Scripts (Node 22+, no packages): `scripts/immersive-check.mjs` (test a page five ways and screenshot each; needs Chrome).
