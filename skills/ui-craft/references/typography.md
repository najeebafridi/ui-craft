# Typography

Load this when you choose fonts, set a type scale, style headings, or build text-heavy pages.

## 1. Type scale

Sizes (px): **12, 14, 16, 18, 20, 24, 30, 36, 48, 60.** Use 4–6 per screen.

| Role | Size / line height | Weight | Notes |
|---|---|---|---|
| Caption, meta | 12 / 16 | 400–500 | never below 12 |
| Dense body (tables, admin) | 14 / 20 | 400 | allowed for dense desktop tools |
| Body (default) | 16 / 24 | 400 | 1.5 |
| Lead / large body | 18 / 28 | 400 | intros, marketing |
| H4 / card title | 18–20 / 28 | 600 | |
| H3 / section | 20–24 / 28–32 | 600 | |
| H2 / page title (apps) | 24–30 / 36 | 600 | |
| H1 (marketing) | 36–48 / 1.15–1.2 | 600–700 | |
| Display (hero) | 60 / 1.1 | 600–700 | marketing only |

- Line height: **1.5 body, 1.2–1.3 headings, 1.1 for very large display.** Reason: big text needs less relative leading, small text needs more.
- Serif body needs a bit more leading (1.55–1.65) than sans.
- Fluid headings on marketing pages: `font-size: clamp(2.25rem, 1.5rem + 3vw, 3.75rem)`. App UIs use fixed sizes.
- Use `rem` for type so user font settings work. Never set a root size below 100%.
- Hierarchy uses size, weight and colour together. Primary text neutral 900, secondary 600, never below 4.5:1.

## 2. Weights

- 400 body, 500 labels and buttons, 600 headings and emphasis. 700 only for big display.
- At most 3 weights on a screen. Do not use 300 or lighter for body text; thin strokes fail at small sizes.
- Do not fake bold or italic. Load the real weights you use.

## 3. Choose a font by tone

Use the project's font if it has one. If not, choose on purpose. One family for apps. At most two for marketing.

**Neutral UI sans (apps, dashboards, tools):**
- **Inter**: very legible at 12–16px, wide range of weights, tabular numbers. The safe pick for dense UI. It is common, so for brand-led marketing choose something with more character.
- **Geist**: clean, slightly technical, good for developer tools. Pair with Geist Mono for code.
- **IBM Plex Sans**: engineered, serious, a bit narrow; suits enterprise and finance.
- **Source Sans 3**: warm, very readable, compact; good for long reading and forms.
- **Manrope**: modern, geometric, friendly; good for fintech and SaaS headings.
- **DM Sans**: soft geometric, low contrast; good for consumer and startup UI.

**Serif and display (marketing, editorial):**
- **Fraunces**: soft, quirky variable serif; feels warm and human. Headings only.
- **Instrument Serif**: elegant condensed display serif; strong at 48px+ for hero lines. One weight, so use it only for large text.
- **Newsreader**: made for screen reading; good for article body and quiet editorial headings.

Pairing: serif display for headings + neutral sans for body and UI. Never two display faces. Mono (Geist Mono, JetBrains Mono, IBM Plex Mono) only for code and IDs.

**System stack** (fast, zero loading, fine for tools and native-feeling apps):

```css
font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; /* code */
```

## 4. Line length and alignment

- Reading text: 65–75 characters. `max-width: 68ch`. Hard limit about 80.
- Captions and card text can be shorter (40–50 characters).
- Left-align text. Do not justify. Centre only short hero lines (under 3 lines) and empty states.
- Do not centre paragraphs. Do not centre text next to left-aligned controls.
- Paragraph spacing: 1em between paragraphs, or 16px. Do not use both an indent and spacing.

## 5. Letter-spacing and case

- Large headings (36px+): `letter-spacing: -0.01em` to `-0.03em`. Reason: big type looks loose at default spacing.
- Body: leave at 0. Never tighten small text.
- Small labels in ALL CAPS (12px): `+0.05em` to `+0.08em`, weight 500–600. Use rarely.
- Sentence case for headings, buttons and labels. Do not use all caps for anything longer than one or two words.

## 6. Numbers

- `font-variant-numeric: tabular-nums` for tables, prices, timers, stats. Columns then line up.
- Right-align numeric columns. Keep the same decimals in a column.
- Use a non-breaking space between number and unit: `5&nbsp;GB`. Use real minus and curly quotes where it is cheap.
- Big stat value: 24–36px, 600. Its label: 12–14px, neutral 600.

## 7. Wrapping, truncation, clamping

```css
h1, h2, h3 { text-wrap: balance; }   /* even line lengths in headings */
p, li { text-wrap: pretty; }         /* avoids one-word last lines */
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
```

- A flex child that truncates needs `min-width: 0`. Without it, the text pushes the layout.
- Truncate names, titles and file names; show the full text in a tooltip or on the detail page. Never truncate error messages, prices or the only copy of important text.
- Long unbroken strings (emails, URLs): `overflow-wrap: anywhere`.
- Test every text slot with a very long and a very short value.

## 8. Load fonts without layout shift

- Self-host. Use WOFF2. Subset to the languages you need.
- `font-display: swap` for text fonts. `optional` for non-critical fonts, when you accept the fallback if it is slow.
- Preload the one or two critical files: `<link rel="preload" as="font" type="font/woff2" crossorigin href="...">`.
- Match the fallback to the web font so the swap does not move text:

```css
@font-face {
  font-family: "Inter Fallback";
  src: local("Arial");
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
body { font-family: "Inter", "Inter Fallback", system-ui, sans-serif; }
```

- Prefer one variable font file over many static weights.

## 9. Native mapping

- iOS: use text styles (Body 17pt, Headline, Caption) so Dynamic Type works. Layouts must reflow at the largest sizes; never truncate to fit. System font is SF Pro. Avoid text under 12pt.
- Android: size in `sp` (Body 16sp, Label 14sp), spacing in `dp`. Use Material type roles (display, headline, title, body, label). System font is Roboto.
- Web: `rem` units, so browser font settings apply. Test at 200% zoom.
- Mobile inputs: 16px or more, so iOS Safari does not zoom in.

## Do / Don't

- Do pick a scale and stick to it. Don't use 15px, 17px or 22px.
- Do vary weight and colour for hierarchy. Don't only change size.
- Do set `text-wrap: balance` on headings. Don't hand-place `<br>` in headings.
- Don't use more than two families, or three weights, on one screen.

## Common mistakes

- Light grey body text (#9CA3AF on white, 2.5:1). Fix: neutral 600 or darker.
- Giant headings with default letter-spacing and 1.5 line height. Fix: -0.02em and 1.1.
- Numbers in a table that do not line up. Fix: tabular-nums and right-align.
- Text lines 120 characters wide. Fix: `max-width: 68ch`.
- Fonts that jump when they load. Fix: preload, `size-adjust` fallback.
- Title Case Everywhere And ALL CAPS Buttons. Fix: sentence case.
