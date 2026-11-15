# Premium craft: the finishing pass

Load this when a screen must look premium, expensive or "designed", when it is correct but flat, and before you call any client-facing screen done.

Premium is not decoration. It is the feeling that every detail was decided by someone who cared. People read that from small, consistent signals: exact alignment, calm depth, type that is tuned for its size, feedback that arrives instantly. Each rule below is one of those signals, with the values to use.

**What every premium product shares:** one decided system (few sizes, one radius family, one accent), one hero per screen, type doing the heavy lifting, real content, depth with discipline, motion that explains, a voice that matches the look, a fit to its audience and platform, finished states, and one signature a user could name.

## 1. Light and depth

Pick **one light source, from above**, and keep it everywhere. Tops of raised things are slightly lighter, undersides slightly darker; things pressed in (inputs, tracks) are slightly darker than the page.

- **Layer shadows.** One blurred grey box-shadow looks cheap. Use 2-5 thin layers whose offset and blur roughly double, each at low opacity. The tokens already do this:
  ```css
  .card   { box-shadow: var(--shadow-raised); }    /* a 1px ring + two soft drops */
  .menu   { box-shadow: var(--shadow-overlay); }   /* ring + three larger drops */
  ```
- **Tint shadows** toward the surface colour, never pure black. `--shadow-color` is already a dark tone of the neutral hue.
- **Higher = larger, softer, fainter.** As elevation grows, offset and blur grow and opacity per layer falls. Three levels only: flat, raised, overlay.
- **Ring instead of border on cards and menus.** A 1px ring in the shadow (`0 0 0 1px var(--ring)`) adapts to any background and does not add to the box size. Form inputs still get a real border that passes 3:1 (`--border-strong`).
- **Inner top highlight** on solid buttons and raised controls: `inset 0 1px 0 var(--highlight)`. It is the edge catching the light. Already part of `--shadow-button`.
- **Radius grows with elevation:** controls `--radius-sm`/`--radius`, panels and cards `--radius-lg`, full-screen sheets larger. Nested corners are concentric: inner radius = outer radius minus the padding between them.
- **Dark themes:** depth comes from lighter surfaces plus the 1px ring. Shadows barely show; keep them only under overlays.
- **One depth technique per product.** If the direction is hairline or flat, do not add soft shadows to one component.
- Never: glow, coloured neon shadows, shadows on text, a shadow on every card.

## 2. Surfaces

- Keep steps between surfaces small: a card differs from its page by at most ~7% lightness in light themes and ~12% in dark themes. Bigger jumps look like a patchwork.
- A **same-hue lighting gradient** is allowed on large surfaces and solid buttons: 2-4% lighter at the top than the bottom. It reads as light, not as decoration. Interpolate in OKLCH so the middle stays clean:
  ```css
  .btn-primary { background: linear-gradient(in oklch, color-mix(in oklch, var(--accent) 92%, white), var(--accent)); }
  ```
- **Blur and translucency are for chrome, not content.** A sticky header may be 80% opaque with `backdrop-filter: blur(12px)` so content shows faintly beneath; a content card may not be glass. On native platforms use the system material (see `platforms.md`).
- A sticky header shows its bottom hairline only after the page has scrolled.
- Avoid two hard dividers side by side (a border next to a background change). Use one, or just space.
- Images and avatars get a 1px inner outline so they never bleed into the page: `outline: 1px solid var(--ring); outline-offset: -1px;`

## 3. Spacing and optical alignment

Maths and the eye disagree. Trust the eye, then encode the fix.

- **Button padding:** horizontal about 2x vertical. With an icon, give the icon side 2-4px less padding than the text side so the label looks centred.
- **Outer padding is at least the inner gap.** A card with 16px gaps between its items has at least 16px (usually 24px) around them.
- **Icons beside text** are optically matched: icon size is about the text's line height minus 4 (16px icon with 14px text, 20px with 16px), same visual weight as the text, slightly lower contrast than the label.
- Align shapes by their visual centre, not their box: a play triangle moves 1-2px toward its point; text baselines line up across columns.
- Align on **both axes**. Labels, values and icons in neighbouring rows and cards share left edges and baselines. This is felt more than seen.
- When in doubt, **double the whitespace** around a group, then remove borders you no longer need.
- Density is a choice, not a default: luxury is spacious, tools are compact, both are exact. In-between mush reads as careless.

## 4. Typography finishing

- **Track by size.** Large text needs tighter letter-spacing; small text needs a little more. For fonts without an optical-size axis:

  | Size | Letter-spacing | Line height |
  |---|---|---|
  | 12px | +0.01em (caps labels +0.06em) | 16px |
  | 14-16px | 0 | 20-24px |
  | 20-24px | -0.01 to -0.015em | 1.3 |
  | 30-36px | -0.02 to -0.025em | 1.2 |
  | 48-60px | -0.03 to -0.035em | 1.05-1.15 |
  | 72px+ | -0.04em | 1.0-1.05 |

  Tokens: `--tracking-heading`, `--tracking-display`, `--tracking-caps`. Fonts with an optical-size axis (Inter 4, Newsreader, Bricolage) do part of this themselves: set `font-optical-sizing: auto`.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs. No orphaned single words.
- `font-variant-numeric: tabular-nums` on every number that changes or lines up. Keep font weight the same on hover and selected states so nothing shifts.
- Real typographic characters: curly quotes, an ellipsis character, a multiplication sign in "4 × 6", en dashes in ranges, a non-breaking space between a number and its unit.
- Headings 500-600 weight, never thinner than 400. Bold (700+) only for large display.
- All caps only for short labels, with added letter-spacing.
- Root: `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;` (in `tokens.css`).
- Load web fonts with a metric-matched fallback so text does not jump (`typography.md`).

## 5. Colour finishing

- Neutrals are tinted, never dead grey: a trace of the brand or a warm/cool hue (chroma about 0.005-0.02 in OKLCH). No pure #000 or #FFF for large areas.
- Large areas are low in chroma. High chroma is saved for small, valuable spots: the primary button, a link, one key number.
- `::selection` uses the accent at ~24% and `caret-color` the accent (in `tokens.css`).
- Borders, dividers and hover fills come from the same neutral scale, not a new grey each time.
- Details: `color-theory.md`.

## 6. Micro-interactions

- **Press:** `button:active { transform: scale(var(--press-scale)); }` (0.97; never below 0.9). Feedback within 100ms.
- **Hover** only where hover exists: wrap in `@media (hover: hover)`. 100-150ms, colour or shadow only. Never a lift on every card.
- **Transitions list their properties** (`transition: background-color var(--dur-fast), transform var(--dur-fast)`), use `var(--ease-out)`, and stay interruptible. Never `transition: all`.
- **Enter:** opacity plus a small move (`translateY(8px)`) or a small scale (from 0.96, never from 0), 200-300ms, ease-out. **Exit** is quicker and subtler than enter.
- **Origin-aware:** menus, popovers and tooltips grow from their trigger (`transform-origin` at the anchor), not from their centre.
- **Tooltips:** short delay for the first, ~125ms fade; once one is open, neighbours open instantly.
- **Frequency rule:** the more often something happens, the less it animates. Actions used many times a day (menus, tabs, keyboard shortcuts) get little or no motion. Rare moments (first run, success) may get more.
- **Numbers that change** tick or cross-fade over 300-500ms with tabular figures; they do not jump.
- **Optimistic updates:** apply the change at once, sync in the background, offer undo on failure. Speed is read as quality.
- Switch off transitions while the theme changes, pause looping animation off-screen, and honour reduced motion (`motion.md`).

## 7. Small things that signal care

- Focus ring that is visible, on-brand and never clipped (`--focus`, 2px, 2px offset).
- Thin, themed scrollbars inside panels: `scrollbar-width: thin; scrollbar-color: var(--border-strong) transparent;` and `overscroll-behavior: contain` so a panel does not scroll the page behind it.
- `scroll-padding-top` equal to the sticky header height.
- Scroll containers show a soft edge shadow or fade while more content is hidden.
- Keyboard shortcut hints (`<kbd>`) next to actions in tools; a command palette in apps people use daily.
- Empty, loading and error states designed with the same care as the main state.
- Confirmations that are specific: "Invoice 1042 sent to Anna, 14:02", not "Success".
- One icon set, one stroke width (1.5 or 2px), drawn for the size used.
- Real content everywhere: plausible names, numbers and images. Product screenshots, when shown, are real UI in a simple frame.

## 8. The signature

Each product gets **one** thing a user could name: tactile buttons, a perfectly set ledger of numbers, a monumental headline, a breathing shape. Build it with care, give it room, and keep everything else quiet. Without one, the result is competent and forgettable; with three, it is noisy.

## 9. The finishing pass (in this order)

1. **Working state.** The screen opens in use: real data, defaults selected, the main interaction visible, the main action visible. No empty or locked first view.
2. **Squint.** Is there exactly one hero and one primary action? Quiet whatever competes.
3. **Edges.** Do things share left edges and baselines? Fix every near-miss.
4. **Spacing.** Only scale values; group gaps at least 2x inner gaps; add whitespace, remove borders. No dead space: no card stretched to match a neighbour, no mostly-empty panel.
5. **Type.** 4-6 sizes; headings tracked tighter; numbers tabular; headings balanced.
6. **Colour.** Mostly neutral; accent in a few high-value spots; text contrast passes. A bold direction keeps its big colour fields to the hero and one band; the rest stays calm enough to trust.
7. **Depth.** One technique; layered tinted shadows or rings; concentric radii.
8. **States.** Hover, focus, pressed, disabled, loading, empty, error all exist and look intended.
9. **Motion.** Press feedback instant; one orchestrated moment at most; reduced motion handled.
10. **Content.** Nothing placeholder; copy specific; confirmations exact. Photos are real, or quiet tonal blocks with a caption; never crude drawings standing in for photos.
11. **Signature.** Present, single, and given room.
12. **Phone.** Run `scripts/ui-audit.mjs` and open both screenshots. Judge the phone view as strictly as the desktop: nothing clipped or covered by a floating element, rows not squeezed, the key content and primary action in the first screen.

## Tells of a cheap-looking interface

One heavy grey shadow; pure black on pure white; default blue links and default focus rings; five greys that are almost the same; borders around everything; uneven padding inside similar cards; text touching edges; mismatched radii; icons from mixed sets; stretched or cropped-at-random images; centre-aligned paragraphs; many font sizes and weights; untracked giant headings; numbers that jiggle; hover-only affordances; spinners for everything; layout that jumps on load; placeholder copy; and effects (gradient, blur, glow, animation) standing in for content.
