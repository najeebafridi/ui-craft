# Tables and lists

Load this when you build a data table, a list, a filter bar, bulk actions, or anything that shows many records.

## Table, list or cards?
| Use | When |
|---|---|
| **Table** | Users compare rows across several attributes, sort, or scan numbers (invoices, users, orders). |
| **List** | One main thing per row plus 1–2 details; mostly read or tap (inbox, notifications, search results). |
| **Cards** | Items are separate, visual and comparable (projects with thumbnails, products). 3–4 facts per card. |

- More than 4 columns of comparable data means a table. Do not fake a table with cards.
- Phone: tables become a stacked list or cards (see Responsive).
- A table is not a layout tool. Use it only for data.

## Columns
- **First column = human identifier** (name, title, invoice number), never a raw ID. Make it the link to the detail page.
- Order columns by importance. Keep related ones next to each other (Amount, Currency, Status).
- Status column: badge with text plus a dot or icon, never colour alone.
- Dates: one format everywhere ("12 Mar 2026"); relative time ("2h ago") with the exact date in a tooltip.
- Actions column last, narrow, right edge.
- Cap at ~8 visible columns by default. Let users show or hide the rest.

## Alignment and type
- **Text left. Numbers right.** Align by decimal point. Column header matches its data's alignment.
- `font-variant-numeric: tabular-nums` on number columns so digits line up.
- Same decimals in a column (1,200.00 and 35.50).
- Show units in the header ("Amount (USD)"), not in each cell.
- Body 14px in dense tables, 16px otherwise. Header 12–14px, medium weight, muted colour, sentence case.

## Row height and spacing
| Density | Row height | Use |
|---|---|---|
| Compact | 36px | Power users, long lists |
| Default | 40px | Most tables |
| Touch | 44px+ | Phones and tablets |
| Two-line | 56px+ | Name plus a secondary line (email, ID) |

- Header row is the same height as body rows, or 4px taller.
- Cell padding: 12–16px horizontal. Keep first and last columns aligned with the page edge.
- Offer a density toggle only in tools used all day. Remember the choice.

## Header
- **Sticky header** when the table scrolls: `position: sticky; top: 0` with a solid background and a bottom border. Reason: users lose column meaning after a few rows.
- Sticky first column when the table scrolls sideways.
- Sticky headers must not hide a focused row: add `scroll-padding-top` equal to the header height.

## Sorting
- Click a header to sort. Cycle: **ascending, descending, none** (back to default order).
- Show the sort arrow **only on the sorted column**. On hover, show a faint arrow on others.
- Sortable headers are `<button>` elements inside `<th>`, with `aria-sort="ascending|descending|none"` on the `<th>`.
- Default sort should be meaningful (newest first, or by name). Say it in the UI.
- Sort on the server if the data is paged.

## Search and filtering
- Search box top-left of the table, 240–320px wide, placeholder says what it searches ("Search invoices").
- Search results update after ~300ms of no typing, or on Enter. Highlight nothing fancy; keep it fast.
- Filter bar sits above the table: search, then 2–4 common filters (status, owner, date range), then "More filters".
- **Applied filters show as chips** under or next to the bar: "Status: Unpaid ×". Each chip removes itself. Add "Clear all" when 2+ are active.
- Show the result count: "48 of 1,230 invoices".
- Filters, sort, search and page live in the URL, so links and Back work.
- No results after filtering: say which filters are on and offer "Clear filters".

## Pagination, infinite scroll, load more
| Pattern | Use when | Numbers |
|---|---|---|
| **Pagination** | Admin tables, users need to find or return to a spot, have a footer | 25 / 50 / 100 rows per page; default 25 or 50. Show "1–25 of 1,230". |
| **Load more button** | Feeds and lists where position matters less, and a footer matters | 20–50 items per click. |
| **Infinite scroll** | Social-like feeds, browse-only content | Only with a way back to the top and no footer needed. |

- Default to pagination for data tables. Reason: it gives position, count and a stable scroll.
- Never use infinite scroll for tables people act on or compare.
- Keep the page size selector and page controls at the bottom (and optionally top). Controls are 32–40px tall.
- Keep scroll position when users come back from a detail page.

## Selection and bulk actions
- Checkbox in the first column; header checkbox = select all on this page, with an "indeterminate" state. Offer "Select all 1,230" as a link after that.
- Whole-row click opens the detail; the checkbox is the only selection target. Do not mix the two.
- When 1+ rows are selected, show a **bulk action bar**: "3 selected" + actions (Archive, Export, Delete) + "Clear". Place it above the table (replacing the filter bar) or sticky at the bottom. Same height as a row.
- Destructive bulk actions confirm with a count: "Delete 3 invoices?" or offer Undo.
- Selected rows get a tint plus the checked box (not colour alone).
- Disable per-row actions while a bulk selection is active, or keep them; be consistent.

## Row actions
- **At most 1–2 visible actions** per row (e.g. "Edit"), plus an overflow "⋯" menu for the rest. Reason: five icons per row is noise.
- Overflow button needs `aria-label="More actions for INV-2041"`, and a 32px+ hit area (44px on touch).
- Destructive items in the menu are last, red, separated.
- Row actions can show on hover only if they are also reachable by keyboard focus and always visible on touch.

## Empty, loading, error
- **Loading:** skeleton rows matching the real row height and column widths (5–10 rows). Never "No results" while loading.
- **Empty (no data yet):** what this is, why empty, one button: "No invoices yet. Create your first invoice. [Create invoice]".
- **Empty (filtered):** "No invoices match these filters. [Clear filters]".
- **Error:** message in the table area with "Try again". Keep the header and filters visible.
- Background refresh: keep old rows, show a small spinner in the toolbar.

## Row styling: zebra, borders, hover
- Default: **horizontal 1px borders** (`--border`), no vertical lines, plus a hover tint. Clean and enough.
- **Zebra** only for wide tables with many columns (8+), where the eye loses its row. Keep stripes very light.
- Never zebra and heavy borders together.
- Hover tint is a cue for clickable rows; do not rely on it alone (touch). Add a pointer cursor and a visible link in the first column.

## Truncation
- One line per cell by default: `white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: …`.
- Put the full text in a tooltip (`title` or a real tooltip) and make it reachable by keyboard focus.
- Never truncate numbers, dates or statuses. Truncate in the middle for IDs and file names ("report-…-final.pdf").
- Allow wrapping to 2 lines in description columns; then rows are 56px+.

## Column resize, reorder, hide
- Offer a "Columns" menu with checkboxes to show or hide. Show how many are hidden.
- Resizing and reordering only in tools for power users. Save the layout per user.
- Min column width 80px. Resize handle must also work with keyboard (arrow keys) or have a menu alternative.

## Responsive
- **Phone (<640px): convert rows to stacked cards or a list.** Show the identifier, status and 1–2 key fields. Tap opens the detail. Filters move into a bottom sheet.
- **Alternative:** keep the table in a horizontal scroll container with a **sticky first column** and a visible edge shadow. Use this only when users must compare many columns.
- Make the scroll container focusable: `tabindex="0" role="region" aria-label="Invoices table"`.
- Pagination on phones: Previous / Next plus "Page 2 of 40".

## Large data
- Over **~200 rows** rendered at once, **virtualise** (render only visible rows). Keep fixed row height so scrolling is smooth.
- Virtual lists still need correct row counts (`aria-rowcount`, `aria-rowindex`) and a keyboard path.
- Prefer server-side paging and filtering above ~1,000 rows.

## Accessibility
- Real `<table>`, `<thead>`, `<tbody>`, `<th scope="col">` and `<th scope="row">` for the identifier column.
- `<caption>` (can be visually hidden) names the table: "Invoices, sorted by due date".
- Icon-only buttons have `aria-label`. Sort state in `aria-sort`.
- Checkbox labels name the row: `aria-label="Select INV-2041"`.
- Announce result counts after filtering in a polite live region.
- Do not use `role="grid"` unless you build full arrow-key cell navigation.

```html
<div class="table-wrap" tabindex="0" role="region" aria-label="Invoices">
  <table>
    <caption class="sr-only">Invoices, sorted by due date</caption>
    <thead><tr>
      <th scope="col">Invoice</th>
      <th scope="col" aria-sort="ascending"><button>Due date ▲</button></th>
      <th scope="col" class="num">Amount (USD)</th>
    </tr></thead>
    <tbody><tr>
      <th scope="row"><a href="/invoices/2041">INV-2041 · Acme Ltd</a></th>
      <td>12 Mar 2026</td><td class="num">4,210.00</td>
    </tr></tbody>
  </table>
</div>
```

## Do / Don't
- Do: put a name first, numbers right, header sticky, one hover style.
- Do: show count, filters as chips, and a clear way to reset.
- Don't: show more than 2 row actions, vertical gridlines everywhere, or icons on every sortable column.
- Don't: use infinite scroll for work tables.

## Common mistakes
- ID or UUID in the first column.
- Left-aligned numbers, so digits do not line up.
- Filters that change but do not appear anywhere (no chips, no count).
- Wrapping every cell to 3–4 lines, so rows have random heights.
- A table crushed to fit 375px instead of becoming a list.
- Selecting rows by row click, so users open details by accident.
