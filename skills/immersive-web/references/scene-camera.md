# Scene and camera

Load this when you compose a 3D scene, choose a lens, move a camera or set up the render loop.

## The idea (any medium)

**A scene is a picture first.** Before any code, say in one line what it shows and why it helps: "the kettle, so people feel its weight", "the route the money takes". If the line is "something cool behind the headline", there is no scene yet.

- **One subject.** It should read as a clear silhouette at thumbnail size. Squint: if you cannot tell what it is, simplify.
- **Quiet space is part of the picture.** Leave room around the subject and where the text sits. Do not fill the frame.
- **Scale and ground.** People read size from contact with a surface and from familiar proportions. A floating object with no shadow has no size and no weight.
- **Depth in three planes**: something near (may be soft or cropped), the subject, something far and faint. Far things move toward the background colour.
- **The frame changes shape.** A phone is tall and narrow, a desktop wide. Compose for the tall frame first; the wide one is easier.
- **Lens.** A long lens (narrow angle) flattens and flatters objects and feels calm and expensive. A wide lens exaggerates depth and feels fast or uneasy; it also bends things near the edge. Product and still life: long. Spaces you move through: medium.
- **Camera height is attitude.** Level with the subject: honest. Slightly above: a product on a table. Low: monumental. Straight down: a map or a plan.
- **The camera moves with a reason, slowly, or not at all.** Good reasons: to reveal, to follow, to compare, to arrive. Each move has a start, a hold and an end. A camera that drifts for ever makes people queasy.
- **One shot per idea.** Establish (the whole), then closer (the detail), then closest (the proof). Do not circle the subject aimlessly.

## On the web

### The frame

- Put the scene in a sized box in the layout (a hero column, a sticky stage), not a fixed full-window canvas behind everything, unless the whole page is the scene. Size the canvas from its box with a `ResizeObserver`.
- Text sits **beside** the scene, or over a calm part of it. Over a busy or moving part, give the text a solid or tinted surface. Check contrast at the busiest frame.
- Keep the subject inside a safe area: about the middle 80% of the frame, more on phones. Recompute the camera distance from the aspect ratio so the subject always fits:
  ```js
  const fov = 28 * Math.PI / 180;                                    // vertical field of view
  const dist = Math.max(halfHeight, halfWidth / aspect) / Math.tan(fov / 2);
  ```
- Field of view: **20-35 degrees** for objects, 40-55 for rooms and landscapes. three.js's default of 50 is wide for a product shot. Set `near` and `far` as tight as the scene allows (for example 0.1 and 50), or depth precision suffers.

### Camera moves

- Describe a move as two or three **poses** (position, target, lens) and blend between them. Blend with the theme's curve (`bezier()` from the bridge) or a critically damped spring; never linear.
- Scene and camera moves take 600-1200 ms (see the tempo table in `theme-bridge.md`). Scroll-driven moves follow the scroll position through a short smoothing (about 100-200 ms of lag at most).
- Pointer follow: a few degrees of tilt, damped, only on devices that hover. It is seasoning. Turn it off under reduced motion.
- Orbit controls for a product viewer: limit the angles so the camera cannot go under the floor or inside the object, damp the motion, and give buttons that do the same turns (keyboard access).
- Never roll the horizon, never zoom fast through text, never move the camera and the layout at the same time.

### The render loop

- **Render on demand.** Draw a frame only when something changed: input, scroll, a running move, a resize, a theme change. `assets/scene-shell.js` does this: `frame()` returns `true` while things move, and `invalidate()` asks for one frame. React Three Fiber: `frameloop="demand"` and `invalidate()`.
- Stop when the scene is off screen (`IntersectionObserver`) and when the tab is hidden (`visibilitychange`). The shell does both.
- Drive motion by **elapsed time**, never by frame count: screens run at 30, 60, 90 or 120 Hz, and low-power modes halve the rate.
- Ambient motion (a float, a slow turn) fades out within 5 seconds of the last input, or has a visible pause control.
- One canvas per page where possible. Browsers allow only a limited number of WebGL contexts; several scenes can share one renderer and draw into different boxes (scissor), or use still images for the secondary ones.

### Building the scene

- Start with the simplest thing that reads: primitive shapes in the theme's neutrals, one light, the real camera. Get the composition right, then add material, then detail.
- Few objects, shared materials, shared geometries. Repeats are instances (`InstancedMesh`), not copies.
- Free what you remove: geometries, materials, textures and render targets must be disposed by hand in three.js.
- With no model supplied, build from simple geometry, extrusions of real shapes (a logo outline, a floor plan), type, lines and shaders. A rough hand-coded "model" of a real object (a car made of boxes) cheapens the whole page: choose an abstract or diagrammatic treatment instead, or ask for the real asset.
- For "show this one model and let people turn it", use `<model-viewer>` (poster, lazy loading, alt text, keyboard orbit, AR) rather than writing a viewer.

### WebGPU

Use WebGL 2 as the base. Treat WebGPU as an optional upgrade (three.js `WebGPURenderer` falls back to WebGL 2 by itself; shaders written in TSL run on both). Check current browser support before relying on it, and keep the same three states either way.

## Common mistakes

- A full-window canvas behind the text, fighting it. Fix: a sized stage beside the copy, or a calm region for text.
- Default 50-75 degree lens on a product, so it bulges. Fix: 20-35 degrees, camera further back.
- The subject is cropped on phones. Fix: fit the camera distance to the aspect ratio.
- A loop that redraws an unchanging scene 60 times a second. Fix: render on demand.
- A camera that never stops drifting. Fix: start, hold, end; rest after 5 seconds.
- An object floating in a void. Fix: a contact shadow and a horizon or floor that fades into `--bg`.
