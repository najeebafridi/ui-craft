# Colour and dark mode

Load this when you build a palette, set up theme tokens, add dark mode, or fix contrast.

## 1. Build the palette

You need three families. Do not add more until a real need appears.

1. **Neutral, 11 steps (50, 100, 200 ... 900, 950).** Tint it a little toward the accent hue (cool grey for blue, warm grey for orange). Pure grey looks dead next to a coloured accent.
2. **Accent, 11 steps (50–950).** One hue. Step 600 is usually the solid fill (it must pass 4.5:1 with white text). 500 is often too light for white text.
3. **Status: success, warning, danger, info.** Each needs a strong colour (text, icon, solid), a subtle tint (background) and a border tone.

Define each step once, by hand. Do not make shades on the fly with `lighten()` or `darken()`; results drift. Adjust a step before you add a new one.

## 2. What each step is for (12-step model)

A scale works when every step has a job. This model has 12 steps per hue. Map it onto the 50–950 numbers (1 = lightest in light mode).

| Step | Job | Example use |
|---|---|---|
| 1 | App background | page behind everything |
| 2 | Subtle background | sidebar, striped rows, code blocks |
| 3 | Element background | resting input, badge, ghost button |
| 4 | Element hover | hovered row or button |
| 5 | Element active / selected | pressed button, selected row |
| 6 | Subtle border | dividers, card edges |
| 7 | Normal border | input border, separators that must be seen |
| 8 | Strong border | focus ring, hovered input border |
| 9 | Solid | primary button, badge fill, chart mark |
| 10 | Solid hover | hovered primary button |
| 11 | Low-contrast text | secondary text, links on light bg |
| 12 | High-contrast text | headings, body text |

Rules from the model: steps 1–5 are backgrounds, 6–8 are lines, 9–10 are loud fills, 11–12 are text. Use step 9 text colour (white or near-black) on a solid fill; check it with a contrast tool. The same step numbers work in dark mode with a separate dark scale.

## 3. Semantic tokens

Components use roles, never raw hex. Each surface has a foreground partner.

```css
:root {
  --bg: #F8FAFC;           --fg: #0F172A;
  --surface: #FFFFFF;      --surface-fg: #0F172A;
  --surface-2: #F1F5F9;    --fg-muted: #475569;
  --border: #E2E8F0;       --border-strong: #7C8BA1; /* inputs, 3:1 */
  --accent: #2563EB;       --accent-fg: #FFFFFF;
  --accent-hover: #1D4ED8; --accent-subtle: #EFF6FF;
  --ring: #2563EB;
  --success: #15803D; --warning: #B45309; --danger: #B91C1C; --info: #1D4ED8;
  --success-bg: #DCFCE7; --warning-bg: #FEF3C7; --danger-bg: #FEE2E2; --info-bg: #DBEAFE;
}
```

Pair rule: `bg-accent` always goes with `text-accent-fg`. Never put `--fg` on `--accent`. A component that sets one half of a pair sets the other.

## 4. Worked example palette (hex)

Cool neutral (slate-like) and blue accent. Check any change with a contrast tool.

| Step | Neutral | Accent |
|---|---|---|
| 50 | #F8FAFC | #EFF6FF |
| 100 | #F1F5F9 | #DBEAFE |
| 200 | #E2E8F0 | #BFDBFE |
| 300 | #CBD5E1 | #93C5FD |
| 400 | #94A3B8 | #60A5FA |
| 500 | #64748B | #3B82F6 |
| 600 | #475569 | #2563EB |
| 700 | #334155 | #1D4ED8 |
| 800 | #1E293B | #1E40AF |
| 900 | #0F172A | #1E3A8A |
| 950 | #020617 | #172554 |

Contrast on white: neutral 600 = 7.6:1, neutral 500 = 4.8:1 (OK for muted text), neutral 400 = 2.6:1 (fails for text), accent 600 = 5.2:1 (white text on it passes), accent 500 = 3.7:1 (white text fails; use only for large text, icons, charts).

## 5. How much accent

- About 5–10% of the screen. Primary button, selected nav item, links, focus ring, one key data series.
- Neutral does the rest. If you squint and see colour everywhere, remove some.
- Status colours appear only when there is a status. Do not use green for decoration.
- One accent per product. A second brand colour is for illustrations or charts, not UI chrome.
- Tinted backgrounds (accent-subtle) mark selected rows and info banners. Keep them light.

## 6. Contrast numbers and fixes

- Text: **4.5:1.** Large text (24px+, or 18.66px+ bold): **3:1.** UI parts (input borders, icons, focus rings, chart lines): **3:1.** Numbers are not rounded: 4.47 fails.
- Default light-grey input border (#CBD5E1, 1.5:1) fails. Use a 3:1 border (#7C8BA1) or a visible fill change.
- Placeholder text also needs 4.5:1. Use neutral 500, not 400.
- White text on a bright brand fill fails often. Fix: darken the fill (use 600–700). Do not thin or lighten the text.
- Text on images or gradients: add a dark scrim, or test the worst spot.
- Links inside body text: underline them. Colour alone is not enough.
- Never use colour alone for meaning. Error = red + icon + message. Chart series = colour + label or pattern.
- Optional extra check: APCA. WCAG 2.2 ratios decide pass/fail.

## 7. Dark mode is its own palette

Do not invert. Build it on purpose.

```css
:root[data-theme="dark"] {
  --bg: #0F1419;          --fg: #E6E8EB;
  --surface: #161B22;     --surface-2: #1D232B;   /* higher = lighter */
  --fg-muted: #9AA4B2;
  --border: #2A323C;      --border-strong: #5B6675;
  --accent: #2563EB;      --accent-fg: #FFFFFF;
  --accent-text: #60A5FA; /* links and accent text on dark */
  --ring: #60A5FA;
  --danger: #F87171;      --success: #4ADE80;      --warning: #FBBF24;
}
```

- Background: near-black with a hint of hue (#0B0F14–#111318). Not #000. Reason: pure black next to bright text causes glare and smearing.
- Text: #E6E8EB for body, #9AA4B2 for muted. Not #FFF. Check muted text is 4.5:1 or more (this one is 7:1).
- **Elevation = lighter surface.** bg, then surface, then surface-2, then overlay. Shadows barely show on dark, so use a 1px border plus the lighter fill.
- Desaturate the accent. Large saturated areas vibrate on dark. Keep the solid button fill at step 600 with white text, and use a lighter step (400) for accent text and links.
- Status colours move lighter (400 steps) and their subtle backgrounds become low-alpha tints (`rgb(248 113 113 / .12)`).
- Re-check every contrast pair in dark mode. Do not assume.
- Images: dim slightly (`filter: brightness(.9)`) or give logos a dark variant. Charts need their own dark palette.

## 8. Wiring it up

```css
:root { color-scheme: light dark; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* same values as the dark block */ }
}
```

- `color-scheme` makes scrollbars, form controls and default text match the theme. Set it on `:root`, and on `[data-theme="dark"]` set `color-scheme: dark`.
- Default to the system setting. Offer a toggle with three states: System, Light, Dark.
- Store the choice in `localStorage` and set `data-theme` on `<html>` in a tiny inline script before first paint. Reason: no flash of the wrong theme.
- Set `<meta name="theme-color">` for light and dark.
- Native: use semantic system colours (iOS `label`, `systemBackground`; Android Material colour roles). Do not hard-code hex.
- Charts: series colours, greys and dark variants live in `dashboards-charts.md`. Do not invent chart colours here.

## Do / Don't

- Do use semantic tokens and pairs. Don't write `#3B82F6` in a component.
- Do tint your greys. Don't use pure #000 or #FFF for large areas or text.
- Do darken a fill to pass contrast. Don't lighten the label.
- Do test dark mode as a real design. Don't ship `filter: invert(1)`.

## Common mistakes

- Accent used on every card border, icon and heading. Fix: neutral first, accent for action only.
- Light grey placeholder and disabled-looking helper text below 4.5:1. Fix: neutral 500+.
- Dark mode with the same shadows and same white cards darkened. Fix: lighter surface steps and borders.
- A brand blue at step 500 with white text (3.7:1). Fix: use 600 or 700.
- Red/green status with no icon or label. Fix: add icon and text.
- Theme toggle flashes white on load. Fix: set `data-theme` before the stylesheet paints.
