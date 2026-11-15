# Mobile and touch

Load this when you design a phone or tablet screen, a native app screen, or the mobile view of a web page. Units are CSS px on web, pt on iOS, dp on Android.

## 1. Targets

- Touch targets: **44px** minimum (iOS, web). **48dp** on Android-native. 24px is only the legal floor for pointers, not for fingers.
- **8px gap** between neighbouring targets. Reason: thumbs are ~10mm wide; a gap turns near-misses into misses, not wrong taps.
- A small icon (20–24px) gets padding to reach the target size. Enlarge the hit area, not the icon.
- Whole list rows are the tap target, not just the chevron or title text.

```css
.icon-btn { min-width: 44px; min-height: 44px; display: grid; place-items: center; }
button, a, [role="button"] { touch-action: manipulation; } /* no double-tap zoom delay */
```

## 2. Thumb zone

- On a phone held in one hand, the bottom third is easy to reach. The top corners are hard.
- Put primary actions at the bottom: tab bar, sticky action bar, bottom sheet. Put titles and info at the top.
- Put destructive actions away from the thumb and away from the primary button. Do not place "Delete" next to "Save".
- Confirm a destructive tap with a sheet that names what is lost, or offer undo.

## 3. Navigation

- **Bottom tab bar, 3–5 items**: icon + label, always visible. Selected item has a clear second cue beyond colour. Do not hide it on scroll in the main flow.
- More than 5 destinations: put the rest under a "More" tab or in a profile/settings screen. Hamburger only for secondary items.
- Back must work: the visible back button, the system back gesture, and the browser Back button all go one step up. Keep deep links working.
- Top bar: title + at most 2 actions. Search goes in a top bar field or its own tab.

## 4. Sheets vs modals

- **Bottom sheet**: pick from a list, filters, share, short forms, secondary details. Has a handle, a close button, and swipe-down to close. Max height ~90%, so the page behind is still visible.
- **Full-screen modal**: long or multi-step tasks (compose, checkout). Close/Cancel at top-left, primary action at top-right or sticky at the bottom.
- **Centred dialog**: only short confirmations ("Delete this draft?").
- Never stack a sheet on a sheet.

## 5. Layout

- One column. Side padding 16px. Full-width primary button (48–52px tall). Secondary action below it, as a text or outline button.
- Show the one task first. Secondary panels go behind a tab, accordion or sheet.
- **Sticky bottom action bar** for the main action of a long form or checkout. It holds one primary button, sits above the home indicator, and the page gets bottom padding so nothing hides behind it.
- Tables become cards or a list with the 2–3 key fields, tap for detail.
- Cards and rows: min 56px tall for two-line rows.

```css
.action-bar {
  position: sticky; bottom: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: var(--surface); border-top: 1px solid var(--border);
}
```

## 6. Inputs

- Font **16px or more** in inputs. Under 16px, iOS Safari zooms in on focus.
- Ask for the right keyboard:
  ```html
  <input type="email" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false">
  <input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code">
  <input type="tel" autocomplete="tel">
  <input type="url" inputmode="url"> <input type="search" enterkeyhint="search">
  ```
- Add `autocomplete` on every personal field (name, address, card). It saves typing and lets password managers work. Allow paste.
- Labels above fields, never only inside. Show formats in the helper text.
- Scroll the focused field into view above the keyboard. Keep the submit button reachable while the keyboard is open.
- Use native pickers (date, select) on phones. They are better than custom ones.
- Fewer fields. Each field costs more on a phone.

## 7. Viewport and safe areas

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```
- Never add `user-scalable=no` or `maximum-scale=1`. Pinch zoom stays on.
- With `viewport-fit=cover`, pad fixed bars with `env(safe-area-inset-top|right|bottom|left)`. Never put controls under the notch, status bar or home indicator.
- Use `100dvh`, not `100vh`, for full-height screens (browser bars move).
- Do not lock orientation. Test both.

## 8. Touch behaviour

- **No hover dependence.** Anything shown on hover (menus, tooltips, row actions) must also be reachable by tap. Use `@media (hover: hover)` for hover-only polish.
- **Gestures are shortcuts, not the only way.** Swipe-to-delete also has a visible button or menu item. Long-press also has a "More" button. Drag-to-reorder also has up/down controls. Reason: gestures are hidden, and some users cannot do them (WCAG 2.5.1, 2.5.7).
- **Pull to refresh**: fine as a shortcut. Also keep a refresh button, or auto-refresh. Show the spinner at the top while it runs.
- **Haptics** (native only): light tick for selection and toggles, success/warning/error patterns for outcomes. Never for every tap. Not available on web in a reliable way, so do not depend on it.
- Prevent accidental taps: delay destructive actions, or confirm.
- Avoid edge-swipes for custom actions; they clash with system back.

## 9. Performance and network

- Size images to the displayed size, with `srcset`/`sizes`, modern formats (AVIF/WebP), and `width`/`height` or `aspect-ratio` so nothing jumps. Lazy-load below the fold: `loading="lazy"`.
- Aim for the first screen usable in under 5s on mid-range phone over slow 4G. Cut JS and fonts first.
- Show skeletons for known layouts, and cached data first when offline. Say so: "Offline. Showing saved data."
- Queue writes when offline and retry. Never lose typed text.
- Let big lists load more in pages; keep scroll position on back.

## 10. Native platform notes

**iOS**
- System font (SF) and text styles. Body 17pt. Support Dynamic Type: layouts reflow at the largest sizes, nothing truncated.
- Navigation bar with back + title at top. Tab bar (3–5) at the bottom. Sidebar on iPad.
- Sheets for secondary tasks; action sheet to confirm destructive actions. Prefer standard controls and system gestures (edge swipe back).
- Use semantic system colours so light, dark and increased-contrast all work.

**Android**
- Material: bottom navigation bar on compact windows, navigation rail on medium, drawer or rail on expanded.
- **FAB**: at most one per screen, only for the main create action. Not on every screen.
- Support the system back gesture and predictive back. Respect system bars (edge-to-edge insets).
- Targets 48dp. Use dynamic colour and dark theme from the system when the brand allows.

## 11. Responsive web vs native app

- Web: one codebase, many widths. Design from window width, not "is it a phone". Breakpoints 640 / 1024 / 1440. Hover exists on desktop, not on touch.
- Native: follow the platform's navigation and controls; users expect them. Gestures, haptics, share sheets and biometrics are available.
- A web app on a phone should still feel like a phone UI: bottom actions, large targets, native inputs. Do not just shrink the desktop layout.

## 12. Tablet

- Width ≥ **1024px**: switch to two panes (list on the left 320–400px, detail on the right). Selecting a row fills the detail pane; no page change.
- 640–1023px: single pane plus a navigation rail (72–80px wide), or a collapsed sidebar.
- Side padding 24px. Keep line length 65–75 characters; do not stretch text across the screen.
- Support split-screen and window resizing; layout follows the current width.

## Do / Don't

- Do keep the primary action in the bottom third. Don't put it in the top corner.
- Do give every gesture a visible button twin. Don't hide delete behind a swipe only.
- Do use the right `type`, `inputmode`, `autocomplete`. Don't make users type an email on a full keyboard of letters and symbols.
- Do pad for safe areas. Don't let a bar sit under the home indicator.
- Do test at 375px and with the keyboard open.

## One-screen flows

- When a flow fits on one screen (pick a service, a person, a time), show every step's choices at once with a sensible default already selected ("Any barber", today, the next free slot). Do not lock a later step behind an earlier one unless it truly cannot be shown without it.
- The summary bar always says something useful: the current selection and total, or the next thing to choose. Never an empty bar or a "$0" total.
- Keep the first screen dense with the real choices; long introductions push the task below the fold.

## Common mistakes

- Inputs at 14px, so iOS zooms the page on focus.
- Two 36px icon buttons side by side with a 2px gap.
- Sticky bottom bar covers the last form field or the tab bar.
- Hover-only row actions that never show on touch.
- `100vh` full-screen layouts cut off by the browser toolbar.
- Disabling zoom "to keep the layout stable".
