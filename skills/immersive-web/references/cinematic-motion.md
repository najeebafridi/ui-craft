# Cinematic motion and page transitions

Load this when the brief asks for a "cinematic" or film-like feel, when you time scene and camera moves, or when you add transitions between pages or views. Everyday interface motion (hover, menus, dialogs) is in ui-craft's `references/motion.md` and keeps its own timings.

## The idea (any medium)

Film has a grammar people already understand. Borrow the grammar, not the special effects.

**Shots.** An *establishing* shot shows the whole and where we are. A *medium* shot shows the subject at work. A *close-up* shows the detail that proves the point. A sequence of whole, closer, closest feels natural; the reverse feels like a reveal.

**Cut, dissolve, move.**
- A **cut** (instant change) says "next idea". It is honest, fast, and the right answer more often than people think.
- A **dissolve** (cross-fade) says "meanwhile" or "time passes". Soft, slow, luxurious.
- A **move** (the camera or object travels) says "these are the same thing, look closer". Use it only when the two views are really connected.
- A **wipe** or shaped transition is a flourish. One per product at most.

**Timing is acting.**
- *Weight*: heavy things start slowly and stop slowly; light things are quick. Ease-out for things arriving, ease-in for things leaving.
- *Anticipation and follow-through*: a small move before a big one, and a small settle after it, make motion feel physical. Keep both tiny in interfaces.
- *Hold*: after something important arrives, nothing else moves for a moment. Stillness is what makes the previous move matter.
- *Stagger*: things arriving one after another (30-80 ms apart) read as a group with direction. Everything arriving at once reads as a cut; a long stagger reads as slow.
- *One thing at a time.* The eye follows one motion. Two unrelated motions cancel each other.

**Pacing.** Fast and slow need each other. A quiet page with one bold move feels cinematic; a page where everything moves feels like an advert.

**Sound.** Half of what film feels like is sound, and on an interface it is almost always off. If sound is part of the idea, it is opt-in, with a visible control, and the experience is complete without it.

**Restraint by frequency.** The first visit can be a performance. The tenth must be quick. Anything shown often gets shorter each time or disappears.

## On the web

### Three time scales

| Layer | Duration | Notes |
|---|---|---|
| Interface (hover, press, menu, dialog) | 100-300 ms | ui-craft `motion.md`. Never slower because the page is "cinematic" |
| Page or view transition | 200-500 ms | people wait for these; shorter is kinder |
| Scene and camera move | 600-1200 ms | from the theme tempo (`theme-bridge.md`); with a hold after |
| Opening moment (first visit only) | under 2 s in all, never blocking | the text is readable from the first frame; the scene arrives around it |

Take durations and easing from the tokens (`--dur-*`, `--ease-out`; `bezier()` in the bridge for JavaScript), so the motion belongs to the theme.

### The opening

- No preloader, no "enter site" gate, no percentage counter. The headline and the primary action are visible and usable at once; the scene fades in over its poster when ready.
- One orchestrated entrance at most: the scene settles, then the page is still. Do not also fly in the heading letter by letter.
- Skip the entrance on return visits in the same session, and under reduced motion.

### Page transitions

Prefer the platform's View Transitions over a JavaScript router animation:

```css
@view-transition { navigation: auto; }                       /* cross-document: real pages, real URLs */
@media (prefers-reduced-motion: no-preference) {
  ::view-transition-old(root), ::view-transition-new(root) { animation-duration: 240ms; }
  .product-photo { view-transition-name: product-photo; }    /* one shared element that travels */
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
}
```

- Where it is unsupported, navigation simply happens without the effect. That is the fallback.
- Same-document (single-page apps): wrap the DOM update in `document.startViewTransition(() => update())`, guarded with `if (!document.startViewTransition)`.
- One shared element per transition (a photo, a card, a title). Each `view-transition-name` must be unique on the page.
- **Whatever the effect: the URL changes, Back works, the new page's title is announced, and focus lands at the top of the new content.** Never fake navigation by swapping content without history.
- Do not carry a WebGL canvas across pages as the transition unless the product truly is one continuous scene; it makes every page pay the scene's cost.
- A full-screen colour wipe between every page is a tax. Use a quick cross-fade by default and save a shaped transition for one special journey.

### Scene moves

- Blend poses with a critically damped spring or the theme curve. A spring keeps the motion's speed when the target changes mid-move (a new scroll position, a new click), so it never snaps.
- Overshoot only where the theme's own curve overshoots (playful directions), and only on small, light things.
- After a move ends, hold. Do not start the next effect in the same half second.
- Stagger groups by 30-80 ms, capped so the whole group lands within about 400 ms.
- Tie motion to cause. Things move because the person scrolled, pointed, chose, or because data changed. Motion with no cause is decoration and should rest.

### Text

- Words are for reading. A heading may fade or rise 8-16 px once as it enters. It does not scramble, type itself, split into letters, or move with the scroll.
- Never animate text the person is in the middle of reading, and never delay body text behind an effect.

### Video and sound

- Background video: muted, `playsinline`, no sound track needed, a poster image, and a visible pause control if it lasts more than 5 seconds. Under reduced motion show the poster with a Play button instead.
- Sound starts only after a deliberate action on a labelled control, remembers the choice, and has a mute control that stays in view. Browsers block audio before a user gesture anyway; do not fight it.

### Reduced motion

Moves become cuts or short fades (150-200 ms opacity only). Camera travel, parallax, zooms, spins and staggered entrances are removed. Holds and pacing stay: a still sequence can be cinematic too.

## Common mistakes

- Everything eases for a second because "cinematic". Fix: the interface stays quick; only the one scene is slow.
- A preloader in front of a page that would have painted in a second. Fix: remove it.
- Fade-up on every section. Fix: one entrance; the rest is simply there.
- Transition between pages breaks Back or focus. Fix: View Transitions on real navigations.
- Two things moving at once. Fix: sequence them, with a hold between.
- Sound on load. Fix: opt-in control.
