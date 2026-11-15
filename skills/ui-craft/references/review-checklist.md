# Review checklist

Load this before you say a screen is done. Answer each line yes or no. Fix every "no" or drop the item on purpose.
## Purpose & hierarchy
- [ ] The one primary task of this screen is clear within 3 seconds.
- [ ] There is exactly one solid primary button per screen or section.
- [ ] The title or key value is the biggest or boldest thing; labels and meta are quieter.
- [ ] Anything that does not help the primary task is removed.

## Layout & spacing
- [ ] All spacing uses the scale 4/8/12/16/24/32/48/64/96. No odd values.
- [ ] Gaps between groups are at least 2x the gaps inside groups.
- [ ] Elements share clear left edges; nothing is ragged or almost-aligned.
- [ ] Reading text is 65–75 characters wide; content has a max-width.
- [ ] No cards inside cards; borders and boxes only where they group something.

## Type
- [ ] 4–6 font sizes (up to 7 on marketing pages) and at most 3 weights, all from the scale.
- [ ] Body is 16px (14px only in dense tools); nothing under 12px.
- [ ] Numbers in tables and stats use tabular figures and align right.
- [ ] Headings are sentence case; no stray ALL CAPS.

## Colour & contrast
- [ ] Colours come from semantic tokens, not raw hex in components.
- [ ] Neutrals dominate; accent covers about 5–10% of the screen.
- [ ] Text is 4.5:1 or better; large text and UI parts (borders, icons, focus ring) 3:1.
- [ ] No meaning by colour alone: each status also has an icon or text.
- [ ] Dark mode (if present) is its own palette and was checked.

## Components & states
- [ ] Every interactive element has default, hover, focus-visible, pressed, disabled.
- [ ] Buttons say verb + object ("Create invoice"), not "Submit" or "OK".
- [ ] Inputs have visible labels above, helper text, and clear error styling.
- [ ] Icons come from one set, one stroke width; no emoji as icons.
- [ ] Destructive actions are red, named, and confirmed or undoable.

## Content & copy
- [ ] Real, believable content; no lorem ipsum, "John Doe", or placeholder image services.
- [ ] Same thing has the same name everywhere.
- [ ] Dates, money and numbers use real formats; long text and 0/1/many items were tried.
- [ ] No invented testimonials, logos or statistics.

## Feedback states
- [ ] Loading, empty, error and success states exist for each data area.
- [ ] Empty states say what, why, and give one action; no blank panels.
- [ ] Errors say what happened and how to fix it, next to the cause; input is kept.
- [ ] Toasts never hold the only copy of important information.

## Accessibility
- [ ] Keyboard alone can do everything; focus is visible and never hidden by sticky bars.
- [ ] Native elements are used (button, a, label, dialog); headings are in order.
- [ ] Targets are at least 24px (44px on touch); icon-only buttons have an accessible name.
- [ ] Works at 200% zoom and 320px with no sideways scroll; reduced motion is respected.
- [ ] Dialogs trap focus, close on Esc, and return focus.

## Responsive
- [ ] Looks right at 375, 640, 1024 and 1440 widths.
- [ ] On phones: one column, bottom primary action, 44px targets, 16px inputs.
- [ ] Tables become cards or lists on small screens.
- [ ] Safe areas are padded; nothing depends on hover.

## "AI look" smells
- [ ] No purple-blue gradients, gradient text, glow shadows or glass panels.
- [ ] No identical rounded cards with the same shadow everywhere.
- [ ] No row of KPI numbers without comparison; no hero banner inside a dashboard.
- [ ] No coloured icon tile over every heading; no all-caps eyebrow on every section.
- [ ] No fade-up animation on every section; no hover-lift on every card.

## Performance
- [ ] Every image has width/height or aspect-ratio; nothing jumps on load (CLS under 0.1).
- [ ] Images are sized for their display size and lazy-loaded below the fold.
- [ ] Only `transform` and `opacity` are animated; no `transition: all`.
- [ ] Fonts have a close fallback; one family (two on marketing pages) and at most 3 weights.

## How to review
1. Take screenshots at **375px** and **1440px** wide. Look at both.
2. **Squint test**: blur your eyes or the screenshot. The primary action and title should still stand out.
3. **Keyboard pass**: Tab through the whole screen. Check focus, order, Esc.
4. **Compare with the design brief**: tone, density, accent, radius, primary task. Does the screen match?
5. **Fix the top 3 issues first**, then re-check. Do not polish small things while a big one is broken.
