# Accessibility and fallbacks

Load this before you call any immersive page done, and whenever you design the reduced-motion and no-GPU versions (do that first, not last). ui-craft's `references/accessibility.md` covers ordinary interface accessibility; this file adds what scenes, shaders and scroll effects need.

## The idea (any medium)

An immersive layer is **an enhancement on a complete thing**. Three groups of people get a different version, and each version must be good, not an apology:

1. **People who get sick from motion.** Large moving areas, parallax, zooming, spinning and scroll-linked movement can cause dizziness, nausea and migraines (vestibular disorders are common). They ask the system for less motion; honour it everywhere.
2. **People and devices without the graphics.** Old phones, locked-down work computers, low-power mode, a crashed graphics context, a blocked script, a slow train connection.
3. **People who do not see the screen or do not use a pointer.** Screen-reader users, keyboard users, switch users, voice control.

Principles:

- **The words and the actions are never inside the effect.** They exist as ordinary text and controls.
- **Design the still version first.** If the page is good as a still, the motion is a gift. If it is only good moving, it is fragile.
- **A fallback is the same picture, quieter**: same subject, same colours, same composition. Not a grey box, not "your browser is not supported".
- **Give control.** Pause, skip, mute. A person can always stop what is moving and reach what they came for.
- **Never punish.** No warning banners, no lesser content, no missing prices for people on the fallback.

## On the web

### The three states (hard rule 2)

| State | When | What shows |
|---|---|---|
| Full | WebGL works, no reduced-motion request | the scene, moving |
| Still | `prefers-reduced-motion: reduce` | the same scene as single frames: one per beat, changed by a cut or a 150-200 ms fade. No loop |
| Fallback | no WebGL/WebGPU, init failed, context lost, JavaScript off or still loading, Save-Data | a poster image or CSS/SVG art in the scene's box |

`assets/scene-shell.js` implements all three and sets `data-scene="live|still|fallback"` on the host for CSS. The fallback element is in the HTML from the start, so it is also the loading state.

**Posters.** Make the poster from the scene itself, so it is the same picture: `node <skill-dir>/scripts/immersive-check.mjs page.html --poster hero-poster.png --scheme dark` saves the scene's box as drawn (run it again with `--scheme light` if the themes differ), or screenshot the canvas at the hero pose. Convert to AVIF or WebP if a tool is at hand; a PNG of a simple scene is acceptable. Then build the fallback from it and run the check again.

**The fallback must not be a lesser idea.** These fail: a plain gradient where a kettle was; an empty grid where six printers were; "photograph to come". A 3D object falls back to its poster. A data scene (columns, a map, a network) falls back to the **same data** drawn flat in SVG or CSS, with the same colours and labels. A shader field falls back to a CSS or SVG version of the same structure. For a story, one per beat. Decorative: `alt=""`. For token-driven abstract scenes, CSS gradients or inline SVG in the same tokens re-theme for free.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal, .parallax { transform: none !important; animation: none !important; }
  /* keep short opacity fades; remove movement */
}
```
```js
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
reduced.addEventListener("change", apply);          // people switch it while the page is open
```

| Effect | Reduced version |
|---|---|
| Scene with ambient motion | one still frame |
| Camera move, fly-through, zoom | cut to the new view, or cross-fade stills |
| Scroll-scrubbed animation | whole beats only: the final state of each |
| Parallax | layers fixed |
| Pointer tilt, magnetic buttons, cursor trails | off |
| Staggered entrances, fly-ins | content simply present (a short fade at most) |
| Smooth scrolling | native |
| Page transitions | instant, or a 150 ms cross-fade |
| Background video | poster with a Play button |
| Looping shader | one still frame at a good moment |

Safe under reduced motion: colour changes, opacity fades under about 200 ms, a still scene re-rendered when the theme or the beat changes.

Also for everyone: nothing flashes more than 3 times a second; no strobing or rapid high-contrast flicker in shaders or transitions; anything that moves by itself for more than 5 seconds stops, rests, or has a visible pause button (WCAG 2.2.2). An in-page "Reduce motion" toggle is a welcome extra, not a replacement for the system setting.

### No GPU, no script

```js
// order of defence (the shell does 1-4)
// 1. the fallback is already in the HTML and visible
// 2. test for a context before loading the engine; none = stop here
// 3. try/catch init; any error = fallback stays
// 4. webglcontextlost: preventDefault, stop, show fallback; webglcontextrestored: rebuild
// 5. the page's layout never depends on the scene having started
```

- Content hidden for an entrance animation is hidden **by script**, not in the stylesheet: for example `document.documentElement.classList.add("js")` in a tiny inline script, and `.js .reveal { opacity: 0 }`. With scripts off or failed, everything is visible. Add a time limit so content shows even if the reveal never fires.
- Layouts that only make sense with the scene (a 500vh pinned section) are switched on by script once the scene is live. The default is the plain article layout.
- `<noscript>` is rarely needed if the above holds.

### Screen readers

- **Decorative scene** (it illustrates, the text says everything): `aria-hidden="true"` on the canvas or its host. No tab stops inside.
- **Meaningful scene** (it shows information): the same information as text nearby. Short: `role="img"` with `aria-label`. Longer: a paragraph, list or table beside it, or in a "Describe this" disclosure. A canvas's inner HTML is a fallback for assistive tech and can hold that text.
- **Interactive scene** (a configurator, a 3D map): every action is also an ordinary control outside the canvas: buttons to rotate and zoom, a list of the selectable parts, form controls for options. State changes are announced with a polite live region ("Glaze: sea green"). Hotspots in the scene are real `<button>`s positioned over it, in a sensible order.
- Text is never rendered only as pixels. Labels over the scene are HTML elements positioned with transforms.
- The reading order is the DOM order. A scroll story reads top to bottom as headings and paragraphs.
- Page transitions: after navigation, focus moves to the new page's main heading or `<main>`, and the title is updated.

### Keyboard

- Everything that can be clicked or dragged can be done with Tab, Enter, Space and arrow keys. A draggable 3D viewer needs "Rotate left / right" buttons or arrow-key handling on a focusable, labelled control.
- Visible focus rings on everything (2px, the theme's `--focus`), including controls laid over the scene. Check them against the busiest frame.
- Scrolling stays native, so Space, Page Down, Home and End work. Do not capture them.
- A skip link at the start of any long story: "Skip the story".
- Sticky stages must not cover the focused element: `scroll-margin-top` / `scroll-padding-top` equal to the stage height.
- No keyboard traps in the canvas: Tab always leaves it.

### Contrast and legibility over a scene

- Text needs 4.5:1 against the **busiest, brightest and darkest** frames behind it, not the average. Safest: text beside the scene, or on a solid or strongly tinted surface over it.
- **Give the text a lane.** In a scroll story the subject moves: plan where the words sit at every beat and keep the subject out of that zone (or fade the scene to `--bg` there). A model sliding behind a paragraph mid-scroll is the most common failure.
- Navigation over a scene needs a scrim: a top gradient from `--bg` to transparent, or a solid bar. Links straight on stars or highlights fail contrast.
- No text over moving detail. Calm the area behind words (fade the scene to `--bg` there).
- Support `prefers-contrast: more` by strengthening the text surface and outlines.
- Do not shrink body text to make room for the scene; ui-craft's type rules still hold.

### Control and consent

- Pause control for ambient motion and video; mute for sound; skip for stories. Visible, labelled, 44px on touch.
- Sound never starts by itself.
- Do not ask for motion sensors, camera or location for an effect. If device tilt is used, it is optional and has a non-tilt equivalent.

## Final checklist

Run `node <skill-dir>/scripts/immersive-check.mjs page.html`, open every screenshot, then tick:

- [ ] With JavaScript off, the headline, copy, links and primary action are all visible.
- [ ] With WebGL off, the fallback shows in the scene's place, with no console errors and no broken layout. It is the same subject (or the same data), not a blank box or a plain gradient.
- [ ] With reduced motion, nothing moves by itself; the scene is a still; scroll is native; fades are short.
- [ ] The fallback and the still look like the same design as the full scene, in light and dark.
- [ ] The headline is real text and paints before the scene; no preloader.
- [ ] Phone: nothing clipped or covered, pixel ratio capped, no sideways scroll, controls 44px. The pinned scene and its text share one screen with no empty band; the subject fills its stage.
- [ ] Scrolling is native: speed and direction untouched, scrollbar present.
- [ ] Ambient motion rests within 5 seconds or has a pause control. Nothing runs off screen or in a hidden tab.
- [ ] Decorative canvas is `aria-hidden`; meaningful scenes have a text equivalent; interactive ones have real controls.
- [ ] Tab goes through every control in reading order with a visible ring; there is a skip link for a long story.
- [ ] No text crosses the subject at any scroll position; text and navigation over the scene have a surface or scrim and pass contrast at the worst frame.
- [ ] Sound is off until asked for. Nothing flashes.
- [ ] One signature moment, and it is an event worth describing; the rest of the page is calm.
- [ ] Colours, radius and tempo come from the theme tokens; the scene follows light and dark.
- [ ] Every asset has a known licence, recorded.

## Common mistakes

- `opacity: 0` in the CSS for "reveal on scroll" elements, so a failed script leaves a blank page. Fix: hide from script.
- Reduced motion handled in CSS only, while the WebGL loop keeps running. Fix: the shell's still state.
- A "WebGL not supported" message. Fix: show the poster and say nothing.
- A canvas that swallows Tab or arrow keys. Fix: real controls outside it.
- White text over a scene that turns white at one beat. Fix: check every beat; add a surface.
