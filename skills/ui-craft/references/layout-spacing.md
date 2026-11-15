# Layout and spacing

Load this when you plan a page structure, a grid, a responsive layout, or you fix spacing that looks off.

## 1. Spacing scale

Use only: **4, 8, 12, 16, 24, 32, 48, 64, 96.** Tokens: `--space-1` = 4 up to `--space-9` = 96.

| Where | Use |
|---|---|
| Icon to label, badge padding | 4–8 |
| Inside a button, input, list row | 8–12 (vertical), 12–16 (horizontal) |
| Card padding | 16 (compact), 24 (standard) |
| Between fields in a form | 16–24 |
| Between components | 16–24 |
| Between page sections (apps) | 32–48 |
| Between sections (marketing) | 64–96 (96 is the default) |

- Gap between groups is at least 2x the gap inside a group. This is the cheapest way to show structure.
- Use `gap` on flex/grid. Do not put margins on children. Reason: gaps stay correct when items are added, removed or wrapped.
- Same level, same spacing. If one card has 24 padding, all cards do.
- Start generous, then tighten. Cramped padding is the number one "cheap" signal.
- Native: 4px = 4pt (iOS) or 4dp (Android). Android layouts sit on an 8dp rhythm; match it with 8-multiples.

## 2. Grid

- Desktop (1024+): **12 columns**, gutter 24, side margin 32.
- Tablet (640–1023): **8 columns** (or 6), gutter 16–24, margin 24.
- Mobile (< 640): **4 columns** (or 1 stacked column), gutter 16, margin 16.
- Do not build a 12-col grid by hand for every block. Use CSS grid with `repeat(auto-fit, minmax(280px, 1fr))` for card walls and `grid-template-columns: 1fr 320px` for main + aside.
- Cards of one row share one height and one baseline. Do not mix card sizes without a reason.

```css
.page { max-width: 1280px; margin-inline: auto; padding-inline: 16px; }
@media (min-width: 640px)  { .page { padding-inline: 24px; } }
@media (min-width: 1024px) { .page { padding-inline: 32px; } }
.card-grid { display: grid; gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
```

## 3. Max widths

- App content: 1200–1440px. Past 1440, centre it or let tables use the full width, but cap forms and text.
- Marketing sections: 1120–1280px. Full-bleed backgrounds, contained content.
- Reading text: 640–720px (65–75 characters). Use `max-width: 68ch`.
- Forms: 480–640px for one column. Wider forms are harder to scan.
- Settings content: 640–720px, even on a wide screen. Do not stretch it.
- Dialogs: 400–560px (confirm), 560–720px (form). Side panels: 360–480px.

## 4. Breakpoints

Use **640, 1024, 1440**. Write CSS mobile-first with `min-width`. Add a breakpoint only where the content breaks, not per device. Always check 375 and 1440; also 640 and 1024 around the breakpoints.

## 5. Responsive strategies

Pick one per component. Name the strategy in your head before you write media queries.

1. **Reflow.** Columns drop to fewer columns. Card grids, feature rows, footers.
2. **Reposition.** Move a block. Sidebar filters become a top bar; the aside moves under the main content.
3. **Show / hide.** Hide secondary things behind a tab, sheet or "More" menu. Never hide the primary task. Do not drop content only because the screen is small; move it.
4. **Re-architect.** Change the pattern. Sidebar becomes a bottom tab bar. Table becomes a card list. List-detail becomes two separate screens with a back button.

Also use `clamp()` for fluid headings and padding: `font-size: clamp(2.25rem, 1.5rem + 3vw, 3.75rem)`.

## 6. App shell layouts

**Sidebar + content (most apps).** Sidebar 220–280px (collapsed rail 56–72px), full height, 1px right border. Top bar 48–56px inside the content area holds the page title, search and the primary action. Content scrolls; sidebar and top bar stay. Below 1024px: rail. Below 640px: bottom tab bar.

**List-detail (inbox, tickets, files).** List 320–400px, detail takes the rest. Select a row, the detail updates; the URL holds the selection. Below 1024px: show the list; the detail opens as a full screen with a back button.

**Settings page.** Left sub-nav 200–240px (or tabs on mobile) + one content column of 640–720px. Group settings under headings. One "Save changes" per section or a sticky save bar. Danger zone last, separated.

**Dashboard.** Filter bar on top (sticky), then up to 4 KPI tiles, then 1–2 main charts, then a table. Grid of 12 columns; charts span 6–12. See `dashboards-charts.md`.

**Marketing page.** Top bar (logo, 4–6 links, one CTA). Sections in order: hero (headline, one sentence, one CTA, one real visual), proof (real logos or numbers only), features (3–4 max), detail or demo, pricing or CTA, footer. One idea per section. Sections 80–128px apart. Alternate backgrounds with white and grey-50, not many colours.

## 7. Alignment

- Align to a shared left edge. Labels, inputs, headings and buttons in a column start at the same x.
- Text is left-aligned. Numbers in tables are right-aligned. Centre only short hero text and empty states.
- Align text baselines in a row (`align-items: baseline`) when mixing sizes, for example a big number and its unit.
- Icon + text: centre the icon on the first line of text, not the whole block.
- Optical fix: a round icon or play triangle may need a 1–2px nudge.

## 8. Whitespace

- Whitespace is structure. Remove a border before you remove space.
- Prefer space, then a tint, then a border, then a shadow, to group things.
- Do not fill empty space just because it is there. A calm margin on a wide screen is fine.
- Keep the same page padding on every screen of the product.

## 9. Z-index scale

Use named layers. Never write `z-index: 9999`.

```css
:root {
  --z-base: 0;
  --z-sticky: 100;    /* sticky headers, table headers */
  --z-dropdown: 200;  /* menus, popovers, tooltips */
  --z-overlay: 300;   /* backdrop for dialogs and drawers */
  --z-modal: 400;     /* dialogs, drawers */
  --z-toast: 500;     /* toasts sit above everything */
}
```

Create a stacking context (`isolation: isolate`) on components that use local z-index, so inner values stay inside.

## 10. Container queries

Use container queries for components that live in different widths (a card in a sidebar and in a full page). Use media queries for the page shell.

```css
.card-wrap { container-type: inline-size; }
@container (min-width: 480px) { .card { grid-template-columns: 160px 1fr; } }
```

Reason: the component reacts to the space it gets, not to the screen.

## Do / Don't

- Do use the spacing scale and `gap`. Don't use 13px, 22px or 30px.
- Do cap line length and form width. Don't stretch text across 1440px.
- Do give the primary action a fixed, findable spot. Don't move it between breakpoints without a reason.
- Do respect safe areas: `padding-bottom: env(safe-area-inset-bottom)` on bottom bars.
- Don't nest scroll areas. One scroll per axis per region.

## Common mistakes

- Equal spacing everywhere, so nothing groups. Fix: make between-group gaps 2x the inner gaps.
- Cards inside cards, each with its own padding. Fix: remove the inner card; use a divider or space.
- A 12-column grid that collapses to 12 tiny columns on mobile. Fix: set explicit 1-column rules under 640px.
- Sidebar that stays at 260px on a 700px screen. Fix: rail or bottom tabs below 1024px.
- Full-width forms and paragraphs on desktop. Fix: max-width 640–720px.
- Sticky header that covers focused fields or anchors. Fix: `scroll-padding-top` equal to header height.
