# Beyond the website

Load this when the immersive ideas (scene, light, material, shader, cinematic motion, scroll story) are wanted somewhere that is not a marketing web page: a desktop app, a mobile app, a dashboard, an internal tool. Read ui-craft's `references/platforms.md` for the platform's own rules and `references/mixing.md` for borrowing a genre's look.

## The idea

Every guide in this skill has a portable part ("the idea") and a web part. Outside the web, keep the first and translate the second. Four things change:

1. **Frequency.** A landing page is seen once. An app is opened a hundred times. What delights on the first visit irritates on the tenth. So the level drops: story (3) is almost never right in an app; signature (2) is for first run and rare moments; accent (1) is the working maximum; many screens are 0.
2. **Task.** People in an app are doing something. Motion and depth must help the task (show where a thing went, what state it is in, what is connected to what) or stay out of the way.
3. **The platform owns the bones.** Navigation, windows, controls, gestures, system materials and the system's reduced-motion setting belong to the OS. The scene language lives in content areas, empty states, onboarding, transitions and brand moments, never in the title bar, the tab bar or a text field.
4. **Power.** An app left open all day must idle at zero. No render loop when nothing changes; honour low-power mode and heat.

What carries over unchanged: one signature moment; mostly neutral with a rare accent; one light from above; contact shadows; the theme's tempo; three states for every effect; original, licensed assets.

### Where it fits

| Place | Good use | Level |
|---|---|---|
| First run, onboarding, sign-in | one scene that says what the product is; skippable; never again after | 2 |
| Empty states and success moments | a small living illustration that rests | 1-2 |
| A hero object the product is about (a device, a room, a 3D file, a map) | a real viewer with real controls | functional: not decoration |
| Navigation between views | spatial transitions that show where you went (shared element, push, zoom into a card) | 1 |
| Ambient surfaces: a header, a "now playing" area, a lock or idle screen | a slow material or shader tinted by content, resting | 1 |
| Data that has shape: network, terrain, flow, body, building | the data itself as the scene | functional |
| Marketing page for the app | everything in this skill | 2-3 |

### Where it does not fit, and the restrained version

| Product | Why not | Do this instead |
|---|---|---|
| Dense finance, accounting, trading, admin | people scan numbers for hours; movement and depth cost attention and trust | Level 0. Precision is the luxury: exact alignment, tabular figures, instant response. At most one chart that draws itself once, or a number that ticks to its new value |
| Forms, checkout, anything with money or legal weight | people are careful or anxious; effects read as distraction or manipulation | Level 0. Clear steps, a summary before commit. A quiet success mark at the end |
| Health, crisis, government services | users may be stressed, ill, on old devices | Level 0. If a diagram explains, make it a still with a text version |
| Tools used all day (editors, IDEs, mail) | every animation is paid thousands of times | Level 0-1. Motion only as feedback, under 200 ms. A signature moment only in onboarding or the about screen |
| Kiosks, cars, industrial screens | glances, gloves, sunlight, safety | Follow the domain's rules first; large still targets; no ambient motion |

**A work tool that is also a showpiece.** Some screens have two audiences: operators at a desk all day, and a wall monitor, a lobby or a demo. Build two modes and say so. *Desk mode* (the default): level 0-1, dense, quick, everything critical in one window with no page scroll. *Display mode* (a clear toggle and a shortcut): read-only, larger type, and the asked-for character delivered in full at level 2: the scene large, staged and slowly alive, with a pause control. Do not answer "make it feel like a cockpit" with a quiet tool and a small widget: the owner asked for something, and the display mode is where they get it. In display mode the scene **fills** the screen (no dead bands above or below it, nothing cut off at the edges, text sized to read from across a room), and anything urgent (a failure) is still the first thing seen.

**The genre must show at a glance, even when restrained.** If the brief asks for a sci-fi, game or film feel, the first screenshot of the working view should read as that genre through its traits (signal colours with meaning, readout type, line work, a glow used as a state signal), while passing every usability rule. Restraint that makes the character invisible has failed the brief as surely as decoration that hides the data.

"Restrained" is not "none of the character". The theme still carries the direction: its colour, type, corner shape, tempo, one material detail. A finance tool in a sci-fi-inspired theme is sci-fi through thin lines, a mono typeface and exact grids, not through a spinning hologram.

## By platform

### Desktop app in a web shell (Electron, Tauri)

- **Electron** ships its own Chromium: WebGL, WebGPU and CSS behave like that Chrome version, the same on every OS. Everything in this skill applies. Cost: memory and install size, so be stricter about idle (zero frames) and about one context.
- **Tauri** uses the system webview: WebView2 (Chromium) on Windows, WKWebView on macOS and iOS, WebKitGTK on Linux, the system WebView on Android. Four engines, and Linux's can be old. Keep the WebGL path conservative, treat WebGPU as optional, and **always** ship the fallback: here it will really be seen.
- `prefers-reduced-motion`, `prefers-color-scheme` and `prefers-contrast` come through from the OS in both; use them exactly as on the web.
- It is an app, not a page: no scroll story as navigation, no hero banner, no hand cursor on buttons, native-feeling menus and shortcuts, a sidebar and toolbar. The scene lives in a content pane.
- The main view fits the window. At a common size (1440x900, and 1280x720) everything the operator must see is visible without scrolling the page; long lists scroll inside their own pane. Check the first screenshot for anything cut off at the bottom.
- A functional 3D view (a floor plan, a device) needs a flat fallback that shows the **same data**: the six bays as SVG columns, not an empty grid.
- Windows are resized constantly and can sit on two screens with different pixel ratios: size the canvas from its box and re-read the pixel ratio on resize.
- Pause when the window is hidden, minimised or unfocused for an ambient scene (`visibilitychange`, `blur`).
- Window materials (macOS vibrancy, Windows Mica) are the system's own "shader". Prefer them for chrome over a custom effect; Mica falls back to a solid colour by itself in battery saver.

### Native mobile (iOS, Android)

- **Lighter tools first.** For motion design in an app, a vector animation runtime (Rive for interactive, state-driven pieces; Lottie for one-shot or looping illustration) is far cheaper than real-time 3D and re-themes with colour inputs. Use real 3D only when the product is about a 3D thing.
- **Shaders are available natively for small surfaces**: SwiftUI `colorEffect` / `layerEffect` with Metal functions (iOS 17 and later); Android `RuntimeShader` with AGSL (Android 13 and later; older versions need a still fallback); Flutter fragment shaders (`FragmentProgram`); React Native Skia runtime shaders. Use them for one material or transition, not a whole screen running for ever.
- **Real 3D**: RealityKit (SceneKit is in maintenance) on Apple platforms, Filament or a game engine view on Android, `expo-gl` with three.js or React Three Fiber native in React Native. Battery and heat cost is high: render on demand, cap at 30 fps for ambient scenes, pause off screen.
- **System motion settings, not just the web one**: iOS Reduce Motion (`accessibilityReduceMotion` in SwiftUI, `UIAccessibility.isReduceMotionEnabled`); Android "Remove animations" (animator duration scale 0; `ValueAnimator.areAnimatorsEnabled()`); Flutter `MediaQuery.disableAnimations` (and the separate iOS reduce-motion flag); React Native Reanimated follows the system by default. Check them and supply the still.
- **Low Power Mode and thermal state**: lower frame rate, drop ambient effects, or show the still when the system says it is saving power or running hot. Drive animation by elapsed time: the system may cap callbacks at 30 fps.
- Navigation and gestures stay native: the back swipe, bottom tabs, sheets. Spatial transitions use the platform's own (matched geometry / shared element / container transform), tuned with the theme's tempo.
- Haptics can do what a visual flourish would: a soft tick as an object lands (see ui-craft `motion.md`).
- Touch: no hover, so no pointer-tilt effects. Device tilt needs no permission prompt abuse and always has a still equivalent.

### Native desktop (macOS, Windows, Linux)

- Use the system's materials and its animation setting ("Reduce motion" on macOS, "Animation effects" on Windows, the GNOME animations toggle).
- Custom GPU views (Metal, Direct3D/Win2D, Vulkan) follow the same life cycle: on demand, paused when the window is occluded, a still fallback.
- Density is higher and the pointer is precise: effects are smaller and quicker than on the web.

### Dashboards and data tools

- **The data is the scene.** 3D is justified only when the data has three real dimensions or a real shape (terrain, a building, a molecule, a network you can turn). Never 3D bars, 3D pies or a tilted table: they make values harder to read.
- A dashboard gets no hero and no ambient background. Level 0-1.
- Motion shows **change**: a value ticking to its new number (300-500 ms, tabular figures), a line extending, a row moving to its new rank. Once, then still. Nothing loops.
- A 3D view always has a 2D or table equivalent one click away, and its controls (reset view, layers, selection) are ordinary buttons.
- Shader use that earns its place: density and heat fields, flow lines, large point clouds that the DOM or SVG cannot draw fast enough. Still labelled with real text and a legend.
- Live data must not make the screen twitch: batch updates, animate only what changed, and let people pause the stream.

### Presentations, kiosks, installations

Controlled hardware removes the weak-device problem, not the human one: still offer a non-moving mode, keep text real, avoid flashing, and make every interaction possible without a precise pointer.

## Translating a web piece into an app

1. Lower the level by at least one.
2. Move the scene out of chrome and into a content area or a moment (first run, empty state, success).
3. Replace scroll-as-story with steps the person advances (Next, swipe, or the task itself).
4. Swap web technique for the platform's (table above); keep the tokens: export the theme from the Studio for SwiftUI, Compose, Flutter or JSON.
5. Wire the OS reduced-motion and low-power signals. Build the still first.
6. Make it idle at zero.

## Common mistakes

- A landing-page hero inside an app's main window. Fix: an app shell; the scene in onboarding only.
- An ambient shader behind a data table. Fix: remove it; put the craft into type and alignment.
- Tauri app tested only on Windows; blank pane on Linux. Fix: the fallback, and test the oldest webview.
- Reduced motion handled for the web view but not for native transitions. Fix: check the OS flag in both.
- Battery drain from a loop behind a minimised window. Fix: pause on hidden and unfocused.
- 3D chart for flat data. Fix: a flat chart.
