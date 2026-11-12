# Accessibility

Load this when you build interactive widgets, forms, dialogs, menus, or when you check a screen for WCAG 2.2 AA. WCAG 2 ratios are the legal baseline. APCA is an optional extra check, never a replacement.

## 1. Perceivable

- **Text contrast**: 4.5:1 for normal text. 3:1 for large text (24px+, or 18.66px+ bold). **No rounding**: 4.47 fails. `#777` on white is 4.47 (fail). `#767676` passes.
- **Non-text contrast**: 3:1 for input borders, icons that carry meaning, focus rings, chart lines and bars, toggle states. Custom-styled controls are not exempt.
- **Brand colours**: bright blue, green or orange with white text often sit at 3–4:1. Darken the fill. Do not thin the font.
- **Text on images or gradients**: test the worst spot, or add a solid scrim.
- **Colour is never the only cue**: error = red + icon + words. Link in body text = colour + underline. Chart series = colour + label or pattern.
- **Alt text**: say the purpose, not "image of". Decorative image: `alt=""`. Icon beside text: `aria-hidden="true"`. Icon-only button: `aria-label`. Text that matters is never only inside an image.
- **Headings**: one `h1`, no skipped levels. Pick the level for structure, style it with CSS. Use landmarks: `header`, `nav`, `main`, `footer`. Set `lang` on `<html>` and a unique `<title>`.
- **Reflow**: no two-way scroll at 320px wide. Wide tables scroll inside their own labelled container.
- **Zoom**: usable at 200%. Never `user-scalable=no`. Never `maximum-scale=1`.
- **Text spacing**: nothing clips if a user sets line height 1.5, paragraph gap 2em, letter gap 0.12em, word gap 0.16em. So avoid fixed heights on text boxes; use `min-height`.
- **Motion**: nothing flashes more than 3 times a second.

## 2. Operable

- **Keyboard for everything**: Tab order follows reading order. Enter activates links and buttons. Space activates buttons and checks boxes. Never `tabindex` above 0.
- **Focus visible**: `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }`. Never `outline: none` without a replacement. Ring needs 3:1 against both the element and the page.
- **Focus not hidden**: sticky headers, cookie bars and chat widgets must not cover the focused item (2.4.11). Fix:
  ```css
  html { scroll-padding-top: 72px; scroll-padding-bottom: 72px; } /* match sticky bar heights */
  ```
- **Target size**: 24×24px is the hard minimum (2.5.8). Use 44px for touch and primary actions. Small visuals get padding to enlarge the hit area. Small targets are allowed only with 24px of free space around them.
- **Dragging**: every drag (reorder, slider, kanban, map pan) needs a single-click option: up/down buttons, a "Move to…" menu, a number field (2.5.7).
- **No traps**: if focus enters a widget, Esc or Tab gets it out. Modal focus lock is fine because Esc closes.
- **Skip link**: first focusable element. `<a href="#main" class="skip">Skip to content</a>`; show it on focus. Give `<main id="main">`.
- **Reduced motion**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
  }
  ```
  Better: replace big movement with a fade, keep small state changes.
- **Auto-moving content over 5s** (carousels, tickers, video loops) needs a visible pause button. No autoplay with sound.
- **Hover content** (tooltips, menus) must be dismissible with Esc, stay open while the pointer is over it, and also work on focus.

## 3. Understandable

- **Labels**: every input has a visible, persistent `<label>`. Placeholder is a hint, not a label (it vanishes and is low contrast).
- **Errors**: name the field in text, say what is wrong, suggest the fix. Link errors to inputs with `aria-describedby`; set `aria-invalid="true"`. Move focus to the first error or a summary.
- **Consistent help**: help, contact or chat sits in the same place on every page that has it (3.2.6). Put it in the footer or header and keep it there.
- **Redundant entry**: do not ask again for what the user already gave in this flow. Prefill or offer "Same as shipping" (3.3.7).
- **Accessible sign-in** (3.3.8): allow paste in every field, including password and OTP. Do not block password managers. Add `autocomplete="username"`, `"current-password"`, `"new-password"`, `"one-time-code"`. Offer a passkey or email link. No puzzles, no "type the characters you see" without an alternative.
- **Risky submits** (payments, legal, deleting): allow review, undo, or confirm (3.3.4).
- **Predictable**: changing a select must not navigate away. Do not open new windows without warning.

## 4. Robust

- **Native first**: `<button>`, `<a href>`, `<input>`, `<select>`, `<details>`, `<dialog>`. They bring keyboard, focus and roles for free.
- **First rule of ARIA**: if a native element does the job, use it. A `role` promises keyboard behaviour that you must then build.
- **Name, role, value**: every control has an accessible name, a role, and exposed state (`aria-expanded`, `aria-pressed`, `aria-selected`, `aria-current`).
- `aria-hidden="true"` on a focusable element makes a ghost focus stop. Use `inert` or remove it from the tab order.
- `div onclick` is keyboard-dead. Never.
- Do not add ARIA that repeats native meaning (`<button role="button">`).

## 5. Keyboard patterns

Test every custom widget against these. Prefer the native element when one exists.

**Dialog / modal** (`<dialog>` + `showModal()`)
- Open: move focus inside (the first field, or the title for plain confirms).
- Tab and Shift+Tab loop inside. Background is inert. Esc closes.
- On close, return focus to the button that opened it. `aria-labelledby` points to the title.

**Tabs**
- One tab stop on the tab list (roving `tabindex`). Left/Right move between tabs. Home/End jump to first/last.
- Tab moves into the panel. Use `aria-selected`, `aria-controls`. Activate on focus only if the panel loads instantly.

**Menu button** (action menus only, `role="menu"`)
- Enter, Space or Down opens, focus on first item. Up/Down move. Esc closes and returns focus to the button. Type a letter to jump.
- Site navigation is NOT a menu: use a list of links, with a disclosure button on mobile.

**Disclosure / accordion**
- A `<button aria-expanded>` inside the heading. Enter/Space toggles. Each header is a tab stop.

**Combobox (autocomplete)**
- Input has `role="combobox"`, `aria-expanded`, `aria-controls`. Down opens the list. Arrows move the highlight while focus stays in the input (`aria-activedescendant`). Enter picks. Esc closes (second Esc clears).
- Announce the count in a live region: "5 results".

**Listbox / custom select**
- One tab stop. Up/Down move. Home/End jump. Type to search. Enter or Space selects. Prefer native `<select>` unless you need rich options.

**Toggle button**
- `<button aria-pressed="true">` with a constant label ("Mute"). Do not change the label and the state together.

**Tooltip vs toggletip**
- Tooltip: extra label on hover and focus, text only, Esc dismisses. Never put links or buttons inside.
- Toggletip: a button that, when pressed, injects help text into a live region. Use it when the help is longer or has links.

**Toast / live region**
- Region exists in the DOM first, then inject text. `role="status"` (polite) for success and info; `role="alert"` for blocking errors only.
- Toast has a close button, pauses on hover and focus, lasts 4–6s.

```html
<button aria-expanded="false" aria-controls="faq1">What is your refund policy?</button>
<div id="faq1" hidden>You can request a refund within 30 days.</div>
```

## 6. The 5-minute test

1. **Keyboard only**: unplug the mouse. Tab through the screen. Can you reach and use everything? Is focus always visible? Does Esc close overlays? Does focus return?
2. **Zoom 200%** and resize to 320px wide. Any clipped text or sideways scroll?
3. **Greyscale**: apply a greyscale filter. Is every status, error and chart still readable?
4. **Screen reader spot check**: NVDA (Windows) or VoiceOver (Mac) for 1 minute. Do headings list in order? Do buttons have names? Is the toast read out?
5. **Contrast checker**: run the main text, muted text, borders, focus ring and button colours through a checker. Plus run an automated scan (axe, Lighthouse). Tools find about a third of problems; steps 1–4 find the rest.

## Do / Don't

- Do use `<button>` and `<a>`. Don't build them from `div`.
- Do show focus on every control. Don't remove outlines.
- Do give each icon button a name. Don't rely on a tooltip alone.
- Do pair colour with text or an icon. Don't use red/green alone.
- Do let users paste into any field. Don't block password managers.

## Common mistakes

- Muted grey text at 3.2:1 because it "looks elegant".
- Sticky header hides the focused field when tabbing down a long form (add `scroll-padding-top`).
- `outline: none` on inputs with only a 1px light-grey border as the focus cue.
- Modal that opens but leaves focus on the page behind it, or never returns focus.
- Custom dropdown built from `div`s with no arrow-key support.
- Placeholder used as the only label; error shown only by a red border.
