# Dashboards and charts

Load this when you build a dashboard, KPI tiles, any chart, or an analytics screen.

## Start with the questions
- Write 3–5 questions the dashboard must answer ("Are we on track this month?", "Which region is falling behind?"). Every element must answer one. Delete the rest.
- Name the audience and how often they look (daily ops, weekly review, exec glance). This sets density and refresh rate.
- Each chart gets a one-sentence message first. Chart type, title and colour follow from it.

## Layout
- Order by importance, top-left first:
  1. **Filters and date range** in one bar at the top (global).
  2. **KPI tiles: 3–4 max.**
  3. **Main chart** (the trend that answers the top question), 2/3 to full width.
  4. **Secondary charts** (2–3, in a grid).
  5. **Detail table** at the bottom, linked to the charts.
- Use a 12-column grid, 16–24px gaps. Align chart edges.
- No hero banner, no "Welcome back" block. Data is the hero.
- One screen at 1440×900 should show the answer without scrolling. Details can scroll.
- Group related charts under a short section heading. Do not wrap every chart in a card; use whitespace or one subtle border.
- Phone: one column, KPIs first as 2×2 or a horizontal row, charts stacked, tables become lists.

## KPI tiles
A tile needs **value + label + context**.
- Label 12–14px muted; value 24–30px semibold, tabular numbers.
- Context: change vs last period (`▲ 8.2% vs last month`) or progress to target (`72% of $100k goal`).
- Optional sparkline (last 7–30 points), no axes, muted line with the last point marked.
- The delta shows arrow + sign + colour. Good or bad is decided by the metric, not by direction (cost going up is bad).
- Never show a big number alone.
- Max 4 tiles. If you have 8 metrics, make a compact stat table.

## Chart choice
| Goal | Use |
|---|---|
| Change over time | **Line** (area only for one series, or a stacked total) |
| Compare categories | **Bar** (horizontal when labels are long or 7+ categories) |
| Part of whole, 2–4 parts | **Stacked bar** or **donut** with the total in the centre |
| Part of whole, 5+ parts | Sorted bar chart |
| Distribution | **Histogram** or box plot |
| Correlation of two measures | **Scatter** |
| Single value | **Big number with delta** |
| Ranking | Sorted horizontal bar |
| Flow between steps | Funnel bar or Sankey |
| Many series over time | Small multiples (a grid of small lines) |
| Exact values matter | Table |

- Bar charts always start at zero. Line charts may start above zero, but say so.
- Avoid pies with more than 4 slices, 3D, dual y-axes, radar charts, and gauges.
- Sort bars by value, unless the order is natural (months, stages).
- Limit one chart to one message. If you need two, make two charts.

## Colour
- **Grey for context, accent for focus.** Colour the one series that matters; mute the rest.
- **≤ 7 categorical colours** per chart. Beyond that, group into "Other" or change the chart.
- **Sequential** (low to high): one hue, light to dark. Must still read in greyscale.
- **Diverging** (below / above a midpoint): two hues with a **light grey** midpoint (not white).
- **Same category = same colour** on every chart on the page. Fix the mapping in tokens (`--series-1`…).
- **No red/green as the only difference.** Add arrows, icons, labels or a colourblind-safe pair (blue/orange).
- Status colours (red, amber, green) only for real status, never to decorate categories.
- Chart marks need 3:1 contrast against the background. Thin lines need stronger contrast than big areas.

## Axes and gridlines
- Light horizontal gridlines (`--border`, 1px), 3–6 of them. No vertical gridlines unless needed. No chart border.
- Axis labels 12px muted. 4–6 ticks on each axis. Round tick values (0, 25k, 50k).
- Time axis: label sensibly ("Jan", "Feb", or "1 Mar") and avoid rotated text. If labels collide, show fewer.
- Skip the y-axis title when the chart title states the unit.
- Remove the axis line on the value axis if gridlines exist.

## Labels and titles
- **Label lines and bars directly** at their ends instead of a legend. Use a legend only for 4+ series or when direct labels collide.
- Legend at top-left, above the plot, in series order.
- **Titles state the insight:** "Signups grew 18% after the March launch", not "Signups by month". Put the descriptive subtitle ("Weekly, Jan–Jun 2026") under it in muted text.
- Annotate key events (launch, outage) with a small label on the chart.
- Source and last-updated time in small muted text: "Updated 14:05 · Source: billing DB".

## Number formatting
- Use `k` / `M` / `B`: `12.4k`, `$3.2M`. Full numbers in tooltips and tables.
- Always show units and currency: `$`, `%`, `ms`. Put units in the axis title or tick labels, once.
- Percentages: 0–1 decimals (`12%`, `12.5%`). Money in tables: 2 decimals, in tiles: 0.
- Locale-aware separators (`1,234.5` vs `1.234,5`).
- **Deltas:** `▲ +8.2%` in green-ish (dark enough, 4.5:1) or `▼ −3.1%` in red-ish, plus the word or comparison ("vs last month"). Use a true minus sign (−).
- Round the same way everywhere on a screen.

## Tooltips
- Show on hover and keyboard focus, and on tap for touch. Do not make them the only way to read data.
- Content: the x value as a title, then each series with colour swatch, name, and exact value. Keep it to 5–6 lines.
- A vertical guide line for time series; highlight all series at that x.
- Anchor so it never covers the point; clamp inside the chart.

## Empty, loading, error
- Loading: a skeleton shaped like the chart (axes and grey blocks) for a big chart; a spinner for a small tile. Reserve the height so nothing jumps.
- Empty: "No data for this period. Try a longer date range. [Change range]". Keep the title and filters.
- Partial data: draw what you have and label the gap ("Data after 14 May not yet available").
- Error: message inside the chart area with "Try again". Other charts keep working.
- Zero is data. Show a flat line at 0, not an empty state.

## Real-time data
- Update in place without layout jump. Animate small changes (200–300ms) or not at all.
- Show "Live" and the last update time. Pause auto-refresh on hover or when a user is inspecting.
- Update no faster than people can read: every 5–30s for tiles; per-second only for monitoring screens.
- Do not auto-rescale axes every tick; it makes the chart jitter. Use a fixed window and rescale on a threshold.
- Honour `prefers-reduced-motion`; stop animations over 5s on request.

## Dark mode
- Charts use the dark palette tokens, not inverted colours. Series colours get slightly lighter and less saturated.
- Background of the plot = surface colour. Gridlines lower contrast (still visible), text ~#E6E8EB.
- Check each series has 3:1 against the surface. Test greyscale again.
- Avoid pure white lines and glow. Do not use shadows on chart areas.

## Accessibility
- Never colour alone: differ by label, line dash, marker shape, or pattern.
- Give every chart a text title and a short summary: `<figure aria-labelledby>` plus `<figcaption>` ("Revenue rose from $42k in Jan to $61k in Jun").
- Offer a **data table fallback** ("View as table" toggle or a `<details>` with the same data). Screen reader users and anyone who needs exact values benefit.
- Canvas charts: set `role="img"` and `aria-label`. SVG charts: `role="img"` with `<title>` and `<desc>`, or make marks focusable with labels.
- Interactive points reachable by keyboard (Tab to the chart, arrows between points) when the library supports it.
- Text in charts ≥ 12px, 4.5:1.

## Libraries (pick what the project already uses)
- **Recharts** (React, declarative, good for standard charts), **Chart.js** (canvas, small, simple), **Apache ECharts** (rich, big datasets, many chart types), **Observable Plot** (concise, great for exploration), **D3** (full control, more work), or **plain SVG/CSS** for sparklines and simple bars.
- Wrap the library in one small component so colours, fonts and axes stay consistent.
- Pass design tokens into the library theme. Do not accept library defaults (rainbow palettes, heavy gridlines, legends at the bottom).
- Lazy-load chart code; it is often the largest bundle.

## Do / Don't
- Do: tell the story in the title, grey out the context, label directly.
- Do: show comparison on every KPI.
- Don't: use 3D, dual axes, rainbow palettes or more than 4 KPI tiles.
- Don't: use a donut for 8 slices, or truncate a bar chart's axis.

## Common mistakes
- A row of identical KPI cards with no comparison or target.
- Different colours for the same category on different charts.
- Titles like "Chart 1" or "Sales by month" that say nothing.
- Legend far from the data, with 9 near-identical blues.
- Green up / red down as the only signal, and "down" shown as good for costs.
- No empty, loading or error state for any chart.
