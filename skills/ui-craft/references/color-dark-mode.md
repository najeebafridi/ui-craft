# Colour and dark mode

Load this when you build a palette, set up theme tokens, add dark mode, or fix contrast.

## 1. Build the palette

You need three families. Do not add more until a real need appears.

1. **Neutral, 11 steps (50, 100, 200 ... 900, 950).** Tint it a little toward the accent hue (cool grey for blue, warm grey for orange). Pure grey looks dead next to a coloured accent.
2. **Accent, 11 steps (50–950).** One hue. Step 600 is usually the solid fill (it must pass 4.5:1 with white text). 500 is often too light for white text.
3. **Status: success, warning, danger, info.** Each needs a strong colour (text, icon, solid), a subtle tint (background) and a border tone.

Define each step once, by hand. Do not make shades on the fly with `lighten()` or `darken()`; results drift. Adjust a step before you add a new one.

## 2. What each step is for (12-step model)

Give every step of a colour scale one job, and the scale stays easy to use. This 12-step model is adapted from the Radix Colors scale (MIT). Map it onto the 50–950 numbers (1 = lightest in light mode).

| Step | Job | Example use |
|---|---|---|
| 1 | Page background | the base layer behind everything |
| 2 | Quiet background | sidebar, striped rows, code blocks |
| 3 | Control background | an input or badge at rest, a ghost button |
| 4 | Hover fill | a row or button under the pointer |
| 5 | Pressed / selected fill | a pressed button, the selected row |
| 6 | Faint line | dividers, card edges |
| 7 | Visible line | separators that must be seen (input borders need step 8–9 or `--border-strong`) |
| 8 | Strong line | focus ring, hovered input border |
| 9 | Solid colour | primary button, badge fill, chart mark |
| 10 | Solid hover | the primary button under the pointer |
| 11 | Soft text | secondary text, links on a light background |
| 12 | Strong text | headings and body text |

Rules from the model: steps 1–5 are backgrounds, 6–8 are lines, 9–10 are loud fills, 11–12 are text. Text on a step 9 solid fill is white or near-black; check it with a contrast tool. The same step numbers work in dark mode with a separate dark scale.

## 3. Semantic tokens

Components use roles, never raw hex. Each surface has a foreground partner.

```css
:root {                       /* same names and values as assets/tokens.css */
  --bg: #F8FAFC;           --text: #0F172A;
  --surface: #FFFFFF;      --text-muted: #475569;
  --surface-2: #F1F5F9;    --text-subtle: #5B6B82;
  --border: #E2E8F0;       --border-strong: #7C8BA1; /* inputs, 3:1 */
  --accent: #2563EB;       --accent-fg: #FFFFFF;
  --accent-hover: #1D4ED8; --accent-soft: #EFF6FF;  --accent-text: #1D4ED8;
  --success: #15803D; --warning: #B45309; --danger: #DC2626; --info: #2563EB;
  --success-soft: #F0FDF4; --warning-soft: #FFFBEB; --danger-soft: #FEF2F2; --info-soft: #EFF6FF;
  --success-text: #166534; --warning-text: #92400E; --danger-text: #B91C1C; --info-text: #1D4ED8;
}
```

Pair rule: `bg-accent` always goes with `text-accent-fg`. Never put `--text` on `--accent`. A component that sets one half of a pair sets the other.

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
- Tinted backgrounds (`--accent-soft`) mark selected rows and info banners. Keep them light.

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
:root[data-theme="dark"] {     /* same values as assets/tokens.css */
  color-scheme: dark;
  --bg: #0B0F14;          --text: #E6E9EE;
  --surface: #12171E;     --surface-2: #1A2029;   /* higher = lighter */
  --text-muted: #A3ADBC;  --text-subtle: #8792A2;
  --border: #262E3A;      --border-strong: #6B7890;
  --accent: #2563EB;      --accent-fg: #FFFFFF;
  --accent-text: #93C5FD; /* links and accent text on dark */
  --danger: #EF4444;      --success: #22C55E;      --warning: #F59E0B;
}
```

- Background: near-black with a hint of hue (#0B0F14–#111318). Not #000. Reason: pure black next to bright text causes glare and smearing.
- Text: #E6E9EE for body, #A3ADBC for muted. Not #FFF. Check muted text is 4.5:1 or more (this one is about 8:1 on the surface).
- **Elevation = lighter surface.** bg, then surface, then surface-2, then overlay. Shadows barely show on dark, so use a 1px border plus the lighter fill.
- Desaturate the accent. Large saturated areas vibrate on dark. Keep the solid button fill at step 600 with white text, and use a much lighter step (300, #93C5FD) for accent text and links.
- Status colours move lighter (500 steps, see `assets/tokens.css`) and their subtle backgrounds become low-alpha tints (`rgb(248 113 113 / .12)`).
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
