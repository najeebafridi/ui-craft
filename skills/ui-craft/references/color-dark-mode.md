# Colour tokens, contrast and dark mode

Load this when you set up theme tokens, add dark mode, or fix contrast. For choosing colours (feeling, psychology, culture, brand) see `color-theory.md`.

## 1. Build the palette

Do not pick hex values by eye. Generate the palette, so lightness steps are even and every pair is contrast-checked:

```bash
node scripts/palette.mjs --accent "#0F766E" --neutral warm --tint 2 --out theme.css
```

or load a ready direction from `assets/directions/`. Either way you get three families:

1. **Neutrals**, tinted a little toward a hue (warm, cool or the brand). Pure grey looks dead next to a coloured accent.
2. **One accent**, with its hover, soft background and text variants. The solid fill must carry its text at 4.5:1 (white text, or dark text on light accents such as yellow).
3. **Status colours**: success, warning, danger, info, each with a strong colour, a soft background and a text colour. They do not change with the brand.

Never make shades on the fly with `lighten()` or `darken()`; results drift between hues. Adjust the generator inputs instead.

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

Components use roles, never raw hex. Values live in `assets/tokens.css` (or the direction or generated theme loaded after it).

| Token | Job |
|---|---|
| `--bg` | page background |
| `--surface` | cards, panels, inputs |
| `--surface-2`, `--surface-3` | quiet fills, table headers, hover and pressed rows |
| `--border` | dividers and card edges (decorative, may be faint) |
| `--border-strong` | input, checkbox and outline-button edges (passes 3:1) |
| `--text`, `--text-muted`, `--text-subtle` | primary text, secondary text, meta and placeholders (all pass 4.5:1 on bg, surface and surface-2) |
| `--accent`, `--accent-hover`, `--accent-fg` | solid primary fill, its hover, and the text on it |
| `--accent-soft`, `--accent-text` | selected rows and soft badges; accent-coloured text and links |
| `--focus` | focus ring (passes 3:1 on surfaces in both themes) |
| `--success`, `--warning`, `--danger`, `--info` (+ `-soft`, `-text`) | status icon or solid, soft background, text on that background |
| `--chart-1` … `--chart-6` | categorical chart colours, 3:1 on the surface, varied in lightness |
| `--ring`, `--highlight`, `--shadow-color` | the 1px edge in shadows, the inner top highlight, the shadow tint |

Pair rule: a surface always goes with its partner (`--accent` with `--accent-fg`, `--danger-soft` with `--danger-text`). Never put `--text` on `--accent`. Links and accent-coloured text use `--accent-text`, not `--accent`.

## 4. Why the generated values are safe

The generator works in OKLCH, where equal lightness looks equal in every hue. That is why one set of rules gives passing contrast for a teal, a red or a yellow brand. In hex or HSL the same recipe would pass for blue and fail for yellow. If you must hand-edit a colour, re-run the contrast check (the script prints every pair) instead of trusting your eye.

Typical results on a white surface: primary text about 16:1, muted text about 7:1, subtle text 4.6:1 or more, input borders just over 3:1. Mid-tone brand fills (bright blue, green, orange, pink) usually need darkening to carry white text; the script does it and tells you.

## 5. How much accent

- About 5–10% of the screen. Primary button, selected nav item, links, focus ring, one key data series.
- Neutral does the rest. If you squint and see colour everywhere, remove some.
- Status colours appear only when there is a status. Do not use green for decoration.
- One accent per product. A second brand colour is for illustrations or charts, not UI chrome.
- Tinted backgrounds (`--accent-soft`) mark selected rows and info banners. Keep them light.

## 6. Contrast numbers and fixes

- Text: **4.5:1.** Large text (24px+, or 18.66px+ bold): **3:1.** UI parts (input borders, icons, focus rings, chart lines): **3:1.** Numbers are not rounded: 4.47 fails.
- A default light-grey input border (about 1.5:1) fails. Use `--border-strong` (3:1) or a visible fill change.
- Placeholder text also needs 4.5:1. Use `--text-subtle`, nothing lighter.
- White text on a bright brand fill fails often. Fix: darken the fill, or switch to dark text on a light fill. Do not thin or lighten the text.
- Text on images or gradients: add a dark scrim, or test the worst spot.
- Links inside body text: underline them. Colour alone is not enough.
- Never use colour alone for meaning. Error = red + icon + message. Chart series = colour + label or pattern.
- Optional extra check: APCA. WCAG 2.2 ratios decide pass/fail.

## 7. Dark mode is its own palette

Do not invert. `palette.mjs` and every direction file include a dark theme built on purpose:

- **Background:** near-black with a hint of the neutral hue, not #000. Pure black beside bright text glares and smears on OLED screens.
- **Elevation = lighter surface.** `--bg`, then `--surface`, `--surface-2`, `--surface-3`. Shadows barely show, so depth comes from the lighter fill plus the 1px `--ring`.
- **Text:** off-white, not #FFF. Muted and subtle text are re-solved for contrast on the dark surfaces.
- **Accent:** the solid button keeps a fill that carries its text at 4.5:1 and still stands out from the surface (a very dark brand colour is lightened). Accent text and links use the much lighter `--accent-text`.
- **Status colours** move lighter for icons and text; their soft backgrounds become dark tints.
- Large saturated areas vibrate on dark surfaces. Keep strong colour to small spots.
- Images: dim slightly (`filter: brightness(.9)`) or supply a dark variant of logos.
- Light themes read a little better for most people; dark suits media, low light and preference. Offer both and follow the OS. Never ship dark only without a reason.

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
