---
name: ui-craft
description: Practical UI/UX design rules for building screens that look professional, modern and easy to use — web apps, dashboards, admin tools, desktop apps, mobile apps and marketing sites. Use whenever you design, build, restyle or review any user interface, page, component, form, table, chart, dashboard or screen mockup, or when the user asks for a UI to "look better", "look professional", "look modern", or wants quick clickable HTML mockups for a client to approve.
---

# ui-craft

Rules for building interfaces that look professional and are easy to use, fast.
Works for any stack. Numbers are in CSS px; for native apps read px as pt (iOS) or dp (Android).

**The core idea:** most bad UI is not ugly, it is *undecided*. Random spacing, five font sizes, three greys, every button shouting. Decide a small system first, then apply it everywhere.

## 1. Workflow (do this every time)

1. **Look before you build.** Check the project for an existing design system: tokens, a theme file, Tailwind config, a component library (shadcn, MUI, etc.), brand colours, fonts. **If one exists, use it. Do not invent a second one.** Only fill the gaps.
2. **Write a 6-line design brief** (in your reply or a comment) before code:
   ```
   Product: B2B invoicing dashboard, used daily by finance staff
   Tone: calm, precise, trustworthy        Density: compact (14px body)
   Accent: deep blue #1D4ED8                Neutrals: cool grey
   Font: Inter (already in project)         Radius: 6px (sharp-ish)
   Primary task on this screen: find an unpaid invoice and send a reminder
   ```
   Pick density, radius and tone from the table in §2. Name the one primary task; the screen is built around it.
3. **Build structure first, then style.** Layout and hierarchy with real-looking content, then colour, then details (icons, shadows, motion). Never use lorem ipsum; write realistic labels, names, numbers.
4. **Design every state**, not just the happy one: loading, empty, error, long text, many items, one item, no permission. See `references/feedback-states.md`.
5. **Review before you say "done".** Run `references/review-checklist.md`. If you can take a screenshot or open a browser, look at the result at 375px and 1440px width and fix what you see. Remove anything that does not help the primary task.

When asked for **quick mockups for a client**, follow `references/mockups.md` (one HTML file per screen, no build step, options side by side).

## 2. Pick the product profile

| Profile | Body text | Density | Radius | Navigation | Feel |
|---|---|---|---|---|---|
| Data tool / admin / dev tool / finance | 14px | compact: rows 36–40px, controls 32–36px | 4–6px | left sidebar 220–280px | quiet, precise, lots of neutral |
| SaaS web app (general) | 14–16px | standard: controls 36–40px | 6–8px | sidebar or top bar | clean, one accent |
| Dashboard / analytics | 14px | compact | 6–8px | sidebar + filters bar | numbers first, colour only for data |
| Marketing / landing site | 16–18px | spacious: sections 80–128px apart | by brand | top bar, 4–6 links + 1 CTA | bold type, one strong visual |
| Mobile app | 16–17px | touch: targets ≥ 44px | 8–12px | bottom tab bar, 3–5 items | big tap areas, one column |
| Desktop app (Electron, native) | 13–14px | compact | 4–6px | sidebar + toolbar | follow the OS look; keyboard shortcuts |
| Consumer / playful | 16px | standard | 12–16px | depends | warmer colours, softer shapes |

Body text defaults to 16px; drop to 14px only for dense desktop tools (rows above). Never below 12px.

Tone → radius: sharp (2–4px) feels technical and serious; medium (6–8px) is the safe default; soft (12–16px) feels friendly. Choose once, use everywhere. A nested element's radius = parent radius minus the padding between them.

## 3. Hierarchy (the biggest win)

- **One primary action per screen or section.** It is the only solid accent button. Others are secondary (outline or subtle fill) or tertiary (text button). Example: "Send reminder" solid blue; "Export" outline; "Cancel" text.
- Make hierarchy with **size, weight and colour together**, not size alone. Secondary text is smaller *and* lighter grey, not just smaller.
- **De-emphasise, don't only emphasise.** To make the title stand out, make labels and meta text quieter instead of making the title huge.
- Labels are quieter than values. In "Revenue: $48,210", the value is the hero: label 12–13px grey, value 24px semibold.
- Group by **spacing first**, then by background tint, then by border, last by shadow. Fewer boxes and lines = cleaner. Related items close, unrelated items far (gap between groups ≥ 2× the gap inside a group).
- Read order matches importance: top-left (in left-to-right languages) is seen first. Put the primary task there or in the centre.

## 4. Layout and spacing

- **Spacing scale (4px base): 4, 8, 12, 16, 24, 32, 48, 64, 96.** Use only these. No 13px, no 22px.
- Inside a component: 4–12. Between components: 16–24. Between sections: 32–64 (apps), 64–128 (marketing).
- Page side padding: 16px mobile, 24px tablet, 32px+ desktop.
- Content max-width: 1200–1440px for apps, ~1120–1280px for marketing, **65–75 characters** (~640–720px) for reading text.
- Use CSS grid/flex with `gap`, not margins on children. Align everything to a shared edge; ragged left edges look amateur.
- Breakpoints: **640, 1024, 1440**. Design mobile and desktop both; check 375 and 1440 at minimum.
- Start with more whitespace than feels needed, then tighten. Cramped padding is the most common "cheap" signal.

Details: `references/layout-spacing.md`.

## 5. Typography

- **Type scale: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60.** Use 4–6 sizes per screen at most.
- Line height: 1.5 for body (16/24), 14/20 for dense UI text, 1.2–1.3 for headings, 1.1 for very large display text.
- Weights: 400 regular, 500 medium, 600 semibold (700 only for big display). Max 3 weights per screen.
- Fonts: use the project's font. Otherwise choose on purpose: one family for apps; at most two for marketing (e.g. a display face for headings + a neutral sans for text). A system font stack is fine for tools. Do not pick a font only because it is the default.
- Headings in **sentence case**. Avoid ALL CAPS except tiny labels (11–12px, +0.05em letter-spacing), and use even those rarely.
- Numbers in tables, prices and stats: `font-variant-numeric: tabular-nums` so columns line up.
- Never below 12px. Body text never lighter than ~4.5:1 contrast.

Details: `references/typography.md`.

## 6. Colour

- Build a small palette: **neutrals (9–11 grey steps, slightly tinted toward the accent hue), one accent (brand) colour with ~10 shades, and status colours** (success green, warning amber, danger red, info blue).
- **Most of the screen is neutral.** Accent covers ~5–10%: primary buttons, links, selected state, focus ring, key data. If everything is coloured, nothing stands out.
- Use **semantic tokens**, never raw hex in components: `--bg`, `--surface`, `--surface-2`, `--border`, `--text`, `--text-muted`, `--accent`, `--accent-fg`, `--danger`… Each surface token has a matching foreground token.
- Text colours: primary text ~ grey-900, secondary ~ grey-600, placeholder and meta ~ grey-500 (must still pass 4.5:1). Only disabled controls may go lighter (they are exempt from contrast). Pure #000 text on #fff is harsh; use near-black like #111827 — but keep true contrast.
- Backgrounds: app background a hair off-white (e.g. #F8FAFC or #FAFAFA) with white cards, **or** white background with grey-50 sections. Not both.
- **Contrast floor (WCAG 2.2 AA): 4.5:1 for text, 3:1 for large text (24px+, or 18.66px+ bold) and for UI parts** (input borders, icons, focus rings, chart lines). Mid-tone brand colours (bright blue/green/orange) with white text often fail; darken the fill (shade 600 or darker is the usual solid button colour). Light-grey borders (~1.5:1) are fine for dividers but **input borders need a stronger grey** (`--border-strong`, ≥ 3:1).
- **Never colour alone** for meaning: pair with an icon, text or shape (error = red + icon + message).
- **Dark mode is its own palette**, not inverted colours: background ~#0B0F14–#111318 (not pure black), raised surfaces get *lighter*, text ~#E6E8EB (not pure white), accent slightly lighter/less saturated. Shadows barely show; use lighter surfaces and borders for depth.

Details: `references/color-dark-mode.md`. Starter tokens: `assets/tokens.css`.

## 7. Components: the rules that matter most

- **Every interactive element has 5 states:** default, hover, focus-visible, active/pressed, disabled. Plus loading for buttons and selected for toggles/rows. Hover alone is never the only cue (touch has no hover).
- Buttons and inputs: 40px default, 32–36px compact, 44–48px touch. Label = verb + object: "Create invoice", not "Submit" or "OK". Icon-only buttons need `aria-label` and a tooltip.
- **Focus ring always visible** for keyboard users: 2px solid accent, 2px offset (`:focus-visible`). Never `outline: none` without a replacement.
- Inputs: visible label above the field (placeholder is not a label), border with ≥ 3:1 contrast, helper text below, error below in red with an icon. Long forms also get an error summary at the top.
- Toggle switch = takes effect instantly. Checkbox = applies when the user saves. Don't mix them up.
- Cards: use only when items are separate, comparable things (projects, products). Do not wrap every section in a card, and never put cards inside cards.
- Elevation: 3 levels max — flat (border only), raised (small 2-layer shadow, e.g. `0 1px 2px rgb(0 0 0/.06), 0 1px 3px rgb(0 0 0/.1)`), overlay (menus, dialogs: larger shadow).
- Icons: one icon set, one stroke width, sizes 16/20/24. Icons support labels; they rarely replace them. Never use emoji as UI icons.
- Images: real or realistic content, fixed `aspect-ratio` or width/height (no layout shift), meaningful `alt`. No placeholder-image services in final work.
- Modals: only for short, focused tasks or confirmations. Prefer inline editing or a side panel for longer work.
- Destructive actions: red, clearly labelled ("Delete project"), and either confirm (name what will be lost) or offer undo. Undo is better for quick, frequent actions.

Forms: `references/forms.md`. Tables and lists: `references/tables-lists.md`. Navigation: `references/navigation.md`.

## 8. Feedback states (loading, empty, error, success)

- Show the press **instantly** (under 100ms). Show a spinner/skeleton only if the wait passes ~300ms, then keep it at least ~500ms (no flicker).
- **Skeletons** for page or section loads where the layout is known; they must match the real layout. **Spinner** inside buttons and small widgets. **Progress bar with %** for anything over ~10s or uploads.
- **Empty state** = what this is + why it is empty + one button to start. "No invoices yet. Invoices you create will appear here. [Create invoice]". Never a blank area. While loading, never show "No results".
- **Error message** = what happened + how to fix it, in plain words, next to where it happened. "Card declined. Check the number or try another card." Never "Error 500", "Invalid input" or "Oops!". Never clear what the user typed.
- **Success**: confirm quietly (toast 4–6s, or inline check), then move the user on. Toasts must not hold the only copy of important information.

Details: `references/feedback-states.md`.

## 9. Accessibility floor (non-negotiable)

- Semantic HTML first: `<button>` for actions, `<a href>` for navigation, `<label>` for inputs, real headings in order (one `h1`, no skipped levels), landmarks (`header`, `nav`, `main`).
- Everything works with keyboard: Tab order follows reading order, Enter/Space activate, Esc closes overlays, focus is trapped in modals and returned afterwards.
- Contrast and focus as in §6–7. Targets ≥ 24×24px everywhere, ≥ 44×44px on touch.
- `prefers-reduced-motion`: turn big motion into a fade or nothing.
- Works at 200% zoom and at 320px width without sideways scrolling.
- Do not disable pinch zoom. Do not lock orientation.
- Sticky headers and footers must not cover the focused element (`scroll-padding-top`).
- Anything that moves by itself for more than 5s needs a pause button.
- Sign-in fields allow paste and password managers. Never block paste.

Details (including keyboard patterns for tabs, menus, dialogs, comboboxes): `references/accessibility.md`.

## 10. Motion

- Animate only `transform` and `opacity`. Never `transition: all`.
- **100–150ms** for hover/press feedback, **200–300ms** for menus, panels, dialogs. Never over 400ms for everyday UI. Ease-out when entering, ease-in when leaving.
- Motion explains a change (where a panel came from, what was added). It is never decoration.
- At most **one signature motion** per page (e.g. a hero reveal). No fade-up on every section, no bounce, no parallax text.

Details: `references/motion.md`.

## 11. Responsive and touch

- Mobile is not "stack everything". Rethink: what is the one task here? Hide secondary panels behind a tab or sheet; keep the primary action reachable (bottom of screen on phones).
- Phone: one column, full-width primary button, bottom tab bar for 3–5 top sections, inputs ≥ 16px font, targets ≥ 44px with 8px gaps.
- Tables on phones become stacked cards or a list with the 2–3 key fields; keep the full table on desktop. Long lists (over ~200 rows) get pagination or virtual scrolling.
- Respect safe areas (`env(safe-area-inset-*)`), notches and home indicators.

Details: `references/mobile-touch.md`.

## 12. Words are part of the design

- Plain, specific, short. "Save changes", not "Submit". "3 invoices overdue", not "Attention required".
- Same name for the same thing everywhere (don't mix "Project", "Workspace" and "Space").
- Sentence case for headings, buttons, labels. No full stop on labels and buttons.
- Numbers: use real formats — `$48,210`, `12 Mar 2026`, `2h ago`. Right-align numbers in tables.
- No fake testimonials, fake logos or invented statistics on real products. In mockups, mark sample data clearly.

## 13. Avoid the "AI-generated" look

These patterns make a screen look generic and cheap. Do not use them unless the brand truly calls for it:

- Purple-to-blue gradients, gradient text, glowing shadows, glassmorphism/blur panels on app screens.
- Every section in an identical rounded card with the same soft shadow; cards inside cards.
- A hero banner inside a dashboard. Decorative "welcome back" copy taking space from data.
- Rows of KPI cards with big numbers and no comparison (no "vs last month", no target).
- A coloured rounded-square icon above every heading; emoji as icons.
- Small all-caps "eyebrow" label above every heading.
- Pill-shaped everything; one huge radius on all elements.
- Grey text on coloured backgrounds; low-contrast "elegant" light grey body text.
- Fade-and-slide-up animation on every section; hover lift on every card.
- Centered text everywhere in an app (apps are left-aligned; centre only short marketing hero text and empty states).
- Lorem ipsum, "John Doe", `placehold.co` images, `$1,234.56` everywhere.

**Instead:** restraint, one strong accent, real content, clear hierarchy, consistent spacing. One memorable element per page (a striking headline, a real product screenshot, a well-made chart) beats ten decorations.

## 14. Reference files (load only what you need)

| File | Load when |
|---|---|
| `references/layout-spacing.md` | page structure, grids, responsive layout, spacing |
| `references/color-dark-mode.md` | building a palette, theming, dark mode, contrast |
| `references/typography.md` | fonts, type scale, text-heavy pages |
| `references/forms.md` | any form, input, validation, sign-up, settings |
| `references/tables-lists.md` | data tables, lists, filters, bulk actions |
| `references/dashboards-charts.md` | dashboards, KPIs, any chart |
| `references/navigation.md` | app shell, menus, tabs, breadcrumbs, search |
| `references/feedback-states.md` | loading, empty, error, success, toasts |
| `references/accessibility.md` | keyboard, screen readers, ARIA widgets, WCAG |
| `references/motion.md` | transitions and animation |
| `references/mobile-touch.md` | phone/tablet screens, native apps, gestures |
| `references/review-checklist.md` | before you say a screen is done |
| `references/mockups.md` | fast clickable HTML mockups for client approval |

Assets: `assets/tokens.css` (starter design tokens, light + dark), `assets/mockup-template.html` (one-file screen mockup), `assets/options-board.html` (show 2–3 options side by side).
