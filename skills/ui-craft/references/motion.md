# Motion

Load this when you add transitions, animations, loading effects or micro-interactions.

## 1. Rules first

- Motion explains a change: where something came from, what was added, what was removed. If it explains nothing, delete it.
- Animate only `transform` and `opacity`. They run on the GPU and do not force layout.
- Never `transition: all`. List the properties.
- Everyday UI never goes over 400ms. Most should be 100–300ms.
- Motion must be interruptible. If the user clicks again mid-animation, it reverses or jumps; it never blocks input.

## 2. Durations

| Use | Duration |
|---|---|
| Hover, press, focus colour change | 100–150ms |
| Toggle, checkbox, small control | 150–200ms |
| Dropdown, tooltip, popover | 150–200ms |
| Menu, side panel, toast | 200–250ms |
| Dialog, sheet, page change | 250–300ms |
| Big layout change, hero reveal (rare) | 400ms max |

- Larger things move longer. A 12px tooltip should not take as long as a full-screen sheet.
- Enter a little slower than exit. Example: 250ms in, 180ms out. Reason: users wait for what appears, but want a closing thing gone fast.
- Under 100ms the eye does not see the motion; use it only for colour changes.

## 3. Easings

```css
:root {
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);   /* things entering: fast start, soft landing */
  --ease-in:     cubic-bezier(0.64, 0, 0.78, 0);   /* things leaving: slow start, quick exit */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* things moving on screen from A to B */
  --dur-fast: 120ms; --dur-base: 200ms; --dur-slow: 300ms;
}
```

- **Entering: ease-out. Leaving: ease-in. Moving or resizing: ease-in-out.** Never `linear` for movement (only for spinners and progress).
- Do not use springs or bounce overshoot in business UI. A small overshoot is allowed only in playful consumer apps.
- Pick from these three. Do not invent a new curve per component.

## 4. What to animate

Good:
- Opacity fade plus 4–8px translate for menus and popovers (from the trigger).
- Panels and drawers slide in from the edge they belong to.
- New list items fade in; removed items fade out, then the gap closes.
- Colour and background change on hover (colour is allowed for hover; keep it under 150ms).
- A single progress or success check mark.

Not good:
- Width, height, top, left, margin, box-shadow size. They trigger layout. For a height reveal, animate `grid-template-rows: 0fr` to `1fr`, or use a transform.
- Text content that changes while the user reads it.
- Anything that moves while the user is trying to click it.

Set `transform-origin` where the thing comes from (a popover grows from its trigger, not from its centre).

## 5. Enter and exit

```css
.menu { opacity: 0; transform: translateY(-4px) scale(.98); transform-origin: top left;
  transition: opacity 160ms var(--ease-out), transform 160ms var(--ease-out); }
.menu[data-open="true"] { opacity: 1; transform: none; }
```

- Exit: run the leave animation (opacity to 0), then remove from the DOM or set `display: none` and `inert`. Use `transitionend`, or `@starting-style` and `transition-behavior: allow-discrete` where supported.
- Hidden things must leave the tab order (`hidden`, `inert` or `visibility: hidden`).
- Dialog: fade the backdrop (200ms) and move the panel up 8–12px with fade (250ms). Focus rules are in `accessibility.md`.

## 6. Micro-interactions

- **Button press:** on `:active`, `transform: scale(.98)` over 80–120ms, and a darker fill. Release returns in 150ms.
- **Toggle / switch:** the knob slides 150–200ms (ease-in-out) and the track colour changes together. Keep the label still.
- **Checkbox:** tick draws in 150ms. No bounce.
- **Hover on rows and cards:** change background tint. Do not lift every card; use hover lift only for clickable cards, and at most 2px.
- **List add / remove:** new item fades and slides 8px in (200ms). Removed item fades out (150ms), then siblings move up (200ms). Offer Undo for removals.
- **Inline validation:** the error text fades in; do not shake the field.
- **Copy button:** swap the icon for a check for 1.5s. No toast needed.
- **Loading button:** keep the width fixed, swap the label for a spinner. Spinner rotates 800–1000ms linear.

## 7. Page and panel transitions

- Between pages in an app: keep the shell still. Cross-fade the content area (150–200ms) or do nothing. Do not slide full pages on desktop.
- Drill-in on mobile: new screen slides from the right (250–300ms); back reverses. This matches iOS and Android habits.
- Side panels: slide 16–24px with fade, 250ms. Push the content only if there is room; otherwise overlay.
- Tab content change: instant swap or 120ms fade. No slide.
- Shared-element and View Transitions API are fine for one signature moment, not for everything.

## 8. Skeleton shimmer (optional)

A static grey skeleton is enough. If you add shimmer, make it slow and calm, and turn it off for reduced motion.

```css
.skeleton { background: var(--surface-2); border-radius: var(--radius-sm); }
@media (prefers-reduced-motion: no-preference) {
  .skeleton { position: relative; overflow: hidden; }
  .skeleton::after { content: ""; position: absolute; inset: 0; transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    animation: shimmer 1.6s linear infinite; }   /* moves with transform, not background-position */
}
@keyframes shimmer { to { transform: translateX(100%); } }
```

When to show a skeleton at all is in `feedback-states.md`.

## 9. Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important;
    transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```

- Colour and opacity changes are safe (they are not vestibular triggers), but the block above makes them instant too; to keep short fades, limit the override to `transform` animations. Remove slides, zooms, parallax and auto-scrolling. Swap them for a fade.
- Anything that moves by itself for more than 5 seconds needs a pause control. Nothing flashes more than 3 times a second.
- Native: honour "Reduce Motion" (iOS) and "Remove animations" (Android).

## 10. Performance

- Target 60fps: about 10ms of work per frame. Test on a mid-range phone, not only your laptop.
- `will-change: transform` only on an element that is about to animate, and remove it after. Too many promoted layers use memory and slow the page.
- Do not animate `filter: blur` on large areas, large box-shadows, or background images.
- Do not run animations off-screen. Pause them with `IntersectionObserver` or only start on view.
- Never trigger layout in the animation loop (no reading `offsetHeight` each frame).

## 11. One signature motion

- A page gets **one** memorable motion at most: a hero reveal, a number count-up, a logo draw. Everything else is quick, quiet feedback.
- Keep it under 800ms total, play it once, and never block content or the primary button.
- Skip it entirely in dashboards, forms and admin tools.

## Do / Don't

- Do use the three easings and the duration table. Don't invent timings per component.
- Do animate from where the thing lives. Don't fade everything up from the bottom.
- Don't use parallax text, scroll-jacking, auto-playing carousels, bounce, or looping decoration.
- Don't delay content behind an animation. The user came to do a task.
- Don't add a fade-and-slide to every section on scroll.

## Common mistakes

- `transition: all .3s` on every element. Fix: list `opacity, transform, background-color`.
- Menu that slides 40px and takes 500ms. Fix: 160–200ms, 4–8px.
- Animating `height` for an accordion and getting jank. Fix: grid-rows trick or transform.
- Spinner that shows for 80ms and flickers. Fix: delay it, then keep it at least 500ms.
- No reduced-motion block. Fix: add the CSS from section 9.
- Hover lift, glow and scale on every card. Fix: tint only.
