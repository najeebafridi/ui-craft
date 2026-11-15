# UI design rules (ui-craft)

<!-- Generated from skills/ui-craft/SKILL.md by tools/build-agents-md.py. Edit SKILL.md, not this file. -->

Follow these rules whenever you design, build, restyle or review any user interface in this project:
pages, components, forms, tables, dashboards, charts, mobile screens, or quick HTML mockups for a client.

Detailed guides and templates live in `.agents/skills/ui-craft/` (copy the `skills/ui-craft` folder from the ui-craft repo there).
Read a guide only when the task needs it; the table at the end says which.

How to build interfaces that look premium and are easy to use, on any platform.
Numbers are in CSS px; for native apps read px as pt (iOS, macOS), dp (Android) or epx (Windows).

**Premium means four things.** *Appropriate*: it fits the audience, their state of mind and the platform. *Decided*: a small system (few sizes, one radius family, one accent) applied everywhere. *Crafted*: the details are finished. *Honest*: it earns trust and never tricks. A screen that is only correct looks generic; a screen that is only decorated looks cheap.

## 1. Workflow (do this every time)

1. **Look before you build.** Check for an existing design system: tokens, theme file, Tailwind config, component library, brand colours, fonts, or a `DESIGN.md` brief and `theme.css` exported from the ui-craft Studio. **If one exists, use it; do not invent a second.** Fill gaps only.
2. **Understand the person.** Who uses this, in what state of mind (rushed, anxious, sceptical, expert in flow), and what should they feel? One line. See `.agents/skills/ui-craft/references/psychology-emotion.md`.
3. **Choose a direction.** With no settled identity, pick one visual direction from `.agents/skills/ui-craft/references/directions.md` to fit the audience (not for novelty), read the header of its file in `.agents/skills/ui-craft/assets/directions/`, and note its signature. With a brand colour, keep the direction and rebuild the colours: `node .agents/skills/ui-craft/scripts/palette.mjs --accent "#HEX"`. People who prefer to choose by eye can use the ui-craft Studio (https://najeebafridi.github.io/ui-craft/): pick a direction, tune it on live screens, and export `theme.css` and a `DESIGN.md` brief for you to follow.
4. **Write the design brief** before code (in your reply or a comment):
   ```
   Product: payroll for small businesses (web app, desktop first)
   User and feeling: owner doing payroll at night, anxious about mistakes -> safe, guided, exact
   Direction: Trusted ledger; accent deep teal (their brand), cool neutrals, light theme
   Type: IBM Plex Sans + Mono, 14px body, tabular numbers      Shape and depth: 6px radius, soft shadows
   Density and motion: compact, crisp (120-200ms)              Platform: responsive web
   Signature: numbers set like a ledger; confirmations state the exact amount and time
   Primary task on this screen: review this month's run and approve it
   ```
5. **Build structure first, then style.** Layout and hierarchy with real content, then the system (tokens), then detail. No lorem ipsum: write realistic names, numbers and copy. Build the signature early and keep everything else quieter than it.
   **Show it working.** The first view is the screen in use: real data, sensible defaults already selected, the main interaction visible. Never open on an all-empty or locked state, a dead "$0" total, or a key step hidden until an earlier one is done.
6. **Design every state**: loading, empty, error, success, long text, many items, one item, no permission (`.agents/skills/ui-craft/references/feedback-states.md`).
7. **Finish and check.** Do the finishing pass in `.agents/skills/ui-craft/references/premium-craft.md`. Then **look at the result**: with Node and Chrome available, run `node .agents/skills/ui-craft/scripts/ui-audit.mjs page.html`. It scores contrast, sizes, tap targets and overflow at 1440px and 390px, notes craft problems, and saves screenshots. **Open both screenshots and judge the phone one as strictly as the desktop one**: nothing clipped, covered or squeezed, the key content in the first screen. Check that the screen **tells one story**: the summary matches the selection, totals add up, counts match the lists, dates agree. Fix what you see, then remove anything that does not help the primary task. Checklist: `.agents/skills/ui-craft/references/review-checklist.md`.

Quick mockups for a client: `.agents/skills/ui-craft/references/mockups.md`. Reviewing or scoring an existing product: `.agents/skills/ui-craft/references/review-mode.md`.

**Layers on the same theme.** For 3D scenes, shaders, scroll storytelling or cinematic motion, use the `immersive-web` skill (same plugin): it reads these same tokens, and the theme's `--immersive` level (0 still to 3 story) says how far to go. To borrow the look of another genre or medium (game, sci-fi, film) read `.agents/skills/ui-craft/references/mixing.md`.

## 2. Density by product type

| Product | Body text | Density | Navigation |
|---|---|---|---|
| Data tool, admin, dev tool, finance | 14px | compact: rows 36px, controls 32-36px | left sidebar 220-280px |
| SaaS web app | 14-16px | standard: controls 36-40px | sidebar or top bar |
| Dashboard, analytics | 14px | compact | sidebar + filter bar |
| Marketing, landing page | 16-18px | spacious: sections 64-96px apart | top bar, 4-6 links + 1 action |
| Mobile app | 16-17px | touch: targets 44px or more | bottom tab bar, 3-5 items |
| Desktop app | 13-14px (platform default) | compact | sidebar + toolbar; follow the OS |
| Consumer, playful | 16px | standard | by platform |

Body text defaults to 16px; 14px only in dense desktop tools. Never below 12px. **Compact density is for mouse and keyboard only**: on touch screens every control grows to 44px (§13).

## 3. Hierarchy (the biggest win)

- **One hero and one primary action per screen.** The primary action is the only solid accent button; others are outline, subtle or text buttons.
- Build hierarchy with **size, weight and colour together**. To make the title stand out, quiet the labels and meta text instead of enlarging the title.
- Labels are quieter than values. In "Revenue $48,210", the label is 12-14px muted and the value 24px semibold.
- Group by **spacing first**, then background tint, then a line, last a shadow. The gap between groups is at least twice the gap inside them. Fewer boxes and lines look more expensive.
- Reading order matches importance: the primary task sits top-left (in left-to-right languages) or centre.

## 4. Layout and spacing

- **Spacing scale (4px base): 4, 8, 12, 16, 24, 32, 48, 64, 96.** Only these.
- Inside a component 4-12; between components 16-24; between sections 32-48 (apps), 64-96 (marketing).
- Page side padding: 16px mobile, 24px tablet, 32px or more desktop. Content max-width 1200-1440px (apps), 1120-1280px (marketing); reading text 65-75 characters.
- Lay out with grid or flex and `gap`. Align on both axes: neighbours share left edges and baselines. Near-misses look amateur.
- Outer padding is at least the inner gap. When unsure, add whitespace and remove a border.
- **No dead space.** Do not stretch a card to match a taller neighbour (`align-items: start`), and do not leave a panel mostly empty: give it real content, shrink it, or remove it.
- Density is a decision: spacious or compact, always exact. Breakpoints 640, 1024, 1440; check 375 and 1440 at minimum.

Details: `.agents/skills/ui-craft/references/layout-spacing.md`.

## 5. Typography

- **Type scale: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60** (larger only for display). 4-6 sizes per app screen, up to 7 on a marketing page.
- Fonts come from the direction or the brand: one family for apps, two at most (a display face for headings plus a neutral text face). Never a font because it is the default. All suggested fonts are free (SIL OFL).
- **Tune type for its size.** Line height 1.5 for body, 1.2-1.3 for headings, 1.05-1.15 for display. Letter-spacing: 0 at 14-16px, about -0.015em at 20-24px, -0.025em at 30-36px, -0.03 to -0.04em at 48px and up; +0.06em on small all-caps labels.
- Weights: 400 body, 500 labels and buttons, 600 headings; 700+ for large display only. At most 3 per screen. Weight never changes on hover.
- `text-wrap: balance` on headings, `pretty` on paragraphs. `font-variant-numeric: tabular-nums` on every number that changes or lines up; right-align numbers in tables.
- Sentence case for headings, buttons and labels. Real quotes, dashes and ellipses.

Details: `.agents/skills/ui-craft/references/typography.md`.

## 6. Colour

- **Choose the feeling first.** Lightness and saturation change how a screen feels more than hue: lighter is more pleasant, more saturated is more exciting, low saturation with strong contrast is calm and serious. Then choose the hue for meaning, category fit and difference from competitors. `.agents/skills/ui-craft/references/color-theory.md`.
- A palette is **tinted neutrals + one accent + status colours** (success, warning, danger, info). Neutrals carry a trace of colour (warm, cool or the brand hue), never dead grey; no pure black or white for large areas.
- **Mostly neutral.** The accent covers about 5-10%: primary button, links, selection, focus, key data. High saturation only on small, valuable spots.
- Build it with `.agents/skills/ui-craft/scripts/palette.mjs` (OKLCH, light + dark, every text and border colour solved to pass contrast) or take it from a direction. Never invent hex values by eye.
- **Semantic tokens only** in components: `--bg`, `--surface`, `--surface-2`, `--border`, `--border-strong`, `--text`, `--text-muted`, `--text-subtle`, `--accent`, `--accent-fg`, `--accent-soft`, `--accent-text`, `--focus`, `--danger`… Each surface has its foreground partner.
- **Contrast floor (WCAG 2.2 AA): 4.5:1 for text, 3:1 for large text (24px+, or 18.66px+ bold) and for UI parts** (input borders, icons, focus rings, chart marks). Dividers may be faint; input borders use `--border-strong`.
- **Never colour alone** for meaning: add an icon, text or shape. Status colours stay separate from the brand colour; a red brand never doubles as the error colour.
- **Dark mode is its own palette**: near-black tinted surfaces, raised surfaces lighter, off-white text, calmer accent. Offer both themes and follow the OS.

Details: `.agents/skills/ui-craft/references/color-theory.md`, `.agents/skills/ui-craft/references/color-dark-mode.md`. Tokens: `.agents/skills/ui-craft/assets/tokens.css`, `.agents/skills/ui-craft/assets/directions/`.

## 7. Light, depth and shape

- **One light source, from above**, everywhere. **Three levels only:** flat, raised (`--shadow-raised`), overlay (`--shadow-overlay`).
- Shadows are **layered and tinted**: several thin layers, never one grey blur. Higher means larger, softer, fainter.
- Cards and menus use a **1px ring** in the shadow instead of a border; solid buttons get a faint inner top highlight (`--shadow-button`).
- **One radius family.** Radius grows with elevation (controls, then cards, then sheets). Nested corners are concentric: inner radius = outer radius minus the padding between.
- In dark themes depth comes from lighter surfaces and the ring, not shadows.
- **One depth technique per product** (hairline, soft, crisp, diffuse, flat or lip, set by the direction). No glow, no shadow on every card.
- Blur and translucency belong to chrome only (a sticky header, a sheet, system materials), never to content cards.

Details: `.agents/skills/ui-craft/references/premium-craft.md`.

## 8. Components

- **Every interactive element has states:** default, hover, focus-visible, pressed, disabled; loading for buttons; selected for rows and toggles. Hover is never the only cue.
- Buttons and inputs: 40px default, 32-36px compact, 44-48px touch. Horizontal padding about twice the vertical. Label = verb + object ("Create invoice"). Icon-only buttons need `aria-label` and a tooltip.
- **Focus ring always visible** for keyboard users: 2px `--focus`, 2px offset. Never `outline: none` without a replacement.
- Inputs: visible label above (a placeholder is not a label), `--border-strong` edge, helper text below, error below with icon and words. Long forms add an error summary on top.
- A form's main action (Save, Continue) is visible from the start. It may look quieter until something changes; it never appears only after an edit.
- A toggle switch takes effect at once; a checkbox applies on save.
- Cards only for separate, comparable things. Not around every section; never cards inside cards.
- Icons: one set, one stroke width, sized to the text beside them. Never emoji as icons.
- Images: real content, fixed `aspect-ratio`, meaningful `alt`, a 1px inner outline. No placeholder services. With no real photo yet, use a quiet tonal block in the final crop with a small caption ("Photograph: garden room"); never a crude drawing of the subject, which cheapens everything around it.
- Modals only for short focused tasks; prefer inline editing or a side panel.
- Destructive actions: danger colour, named ("Delete project"), confirmed or undoable. Undo beats confirm for frequent actions.

`.agents/skills/ui-craft/references/forms.md`, `.agents/skills/ui-craft/references/tables-lists.md`, `.agents/skills/ui-craft/references/navigation.md`, `.agents/skills/ui-craft/references/dashboards-charts.md`.

## 9. Feedback states

- Acknowledge every press within 100ms. Show a spinner or skeleton only after ~300ms, then keep it ~500ms.
- Skeletons for page or section loads with a known layout; a spinner inside buttons and small widgets; a progress bar with % past ~10s.
- **Empty state** = what this is + why it is empty + one action. **Error** = what happened + how to fix it, in plain words, where it happened; never clear the user's input.
- **Success** is quiet and specific ("Invoice 1042 sent to Anna, 14:02"). Toasts 4-6s, never the only copy of important information.
- Update optimistically where it is safe, with undo on failure. Speed is read as quality.

Details: `.agents/skills/ui-craft/references/feedback-states.md`.

## 10. Emotion and trust

- People judge a screen's look in about 50ms and that look is their first test of credibility. **Simple, familiar in structure, distinctive in detail** wins.
- Match the design to the user's state: *anxious* (say what happens next, summary before commit, easy way back), *rushed* (fewest steps, prefilled, shortcuts), *sceptical* (proof beside claims, full price early), *expert* (density, shortcuts, undo instead of confirm), *embarrassed or grieving* (neutral tone, no celebration).
- Finish strongly: the last step and the confirmation are what people remember.
- Delight sits at low-stakes moments (first run, empty state, success) and never during errors or sensitive tasks. The more often something happens, the plainer it is.
- **Refuse dark patterns**: fake urgency or scarcity, fake reviews, pre-ticked extras, hidden costs, hard-to-cancel, confirmshaming, a big Accept beside a hidden Reject. Offer the honest version instead.

Details: `.agents/skills/ui-craft/references/psychology-emotion.md`.

## 11. Accessibility floor (non-negotiable)

- Semantic HTML first: `<button>` for actions, `<a href>` for navigation, `<label>` for inputs, headings in order (one `h1`), landmarks.
- Everything works by keyboard: logical Tab order, Enter and Space activate, Esc closes, focus trapped in modals and returned after.
- Contrast and focus as in §6 and §8. Targets at least 24x24px everywhere, 44x44px on touch.
- Honour `prefers-reduced-motion`. Works at 200% zoom and at 320px wide without sideways scrolling. Never disable zoom.
- Sticky bars must not cover the focused element. Anything moving for more than 5s can be paused. Sign-in allows paste and password managers.

Details: `.agents/skills/ui-craft/references/accessibility.md`.

## 12. Motion

- Animate `transform` and `opacity` (plus colour for hover and press). Never `transition: all`; never layout properties.
- **100-150ms** for hover and press; **200-300ms** for menus, panels, dialogs; never over 400ms in everyday UI. Ease-out to enter, ease-in to leave, exit quicker than enter. Tokens: `--dur-*`, `--ease-out`.
- Press feedback: `transform: scale(var(--press-scale))` (about 0.97). Popovers grow from their trigger. Nothing enters from scale 0.
- **The more often it happens, the less it moves.** Menus, tabs and keyboard actions barely animate; one orchestrated moment per page at most.
- Springs for things that move or are dragged; plain fades for colour and opacity.

Details: `.agents/skills/ui-craft/references/motion.md`.

## 13. Responsive and touch

- Mobile is not "stack everything": decide the one task, tuck secondary panels behind a tab or sheet, keep the primary action reachable at the bottom.
- Phone: one column, full-width primary button, bottom tab bar for 3-5 sections, inputs 16px or larger, targets 44px with 8px gaps.
- **Grow controls on touch, even in compact apps:**
  ```css
  @media (max-width: 640px), (pointer: coarse) {
    button, .btn, input, select, [role="tab"], .nav a { min-height: 44px; }
    input, select, textarea { font-size: 16px; }   /* stops iOS zoom */
  }
  ```
- **Nothing is wider than the screen.** Chip and date rows scroll inside their own box, flex and grid children get `min-width: 0`, long words wrap, tables become cards or a list of key fields on phones. Sideways page scroll at 390px is a bug.
- A pinned bottom bar never hides content: pad the scroller by the bar's height plus the safe area. Respect `env(safe-area-inset-*)`. The same goes for anything floating (a goal pill, a chat button, a toolbar): dock it or reserve its space, at every width.

Details: `.agents/skills/ui-craft/references/mobile-touch.md`.

## 14. Platforms

**The platform owns the bones; the brand owns the character.** On iOS, Android, macOS and Windows use the system's navigation, controls, gestures, shortcuts, materials and font for chrome; express the product through colour, content, icons, voice and the signature. No hamburger on iPhone, no bottom tabs on a desktop app, no hand cursor on desktop buttons. Tablets and wide windows get two panes; lay out from the window width, never the device type.

Details: `.agents/skills/ui-craft/references/platforms.md`.

## 15. Words are part of the design

- Plain, specific, short: "Save changes", "3 invoices overdue". The same name for the same thing everywhere.
- The voice matches the direction (terse for tools, warm for care, sparse for luxury) and softens when the user is stressed.
- Real formats: `$48,210`, `12 Mar 2026`, `2h ago`.
- No fake testimonials, logos or statistics. Mark sample data in mockups.

## 16. Decisions, not defaults

Generic output comes from accepting defaults. These read as templates; use them only when the direction truly calls for them:

- the default font, default blue and default grey for every product
- purple-to-blue gradients, gradient text, glow, glass content cards
- every section in an identical rounded card with the same shadow; cards inside cards
- a row of big numbers with no comparison; a hero banner inside a dashboard
- a coloured icon tile above every heading; an all-caps eyebrow above every heading; emoji as icons
- one large radius and pill shape on everything
- pale grey text; grey text on colour; centred body text in an app
- fade-up on every section; hover-lift on every card
- lorem ipsum, "John Doe", placeholder images, round fake numbers

Banning a pattern is not a design: do not swap one default for the next. **Decide** from the audience and the direction, build one signature, and keep the rest restrained.

## 17. Reference files (load only what you need)

| File | Load when |
|---|---|
| `.agents/skills/ui-craft/references/directions.md` | choosing the look; premium or distinct results; design options |
| `.agents/skills/ui-craft/references/premium-craft.md` | finishing pass; depth, edges, micro-interactions, details |
| `.agents/skills/ui-craft/references/color-theory.md` | choosing colours; colour psychology and culture; palettes |
| `.agents/skills/ui-craft/references/color-dark-mode.md` | tokens, contrast fixes, dark mode mechanics |
| `.agents/skills/ui-craft/references/psychology-emotion.md` | users' state of mind, trust, motivation, ethics, delight |
| `.agents/skills/ui-craft/references/platforms.md` | iOS, Android, Mac, Windows, Linux, Electron, tablets, watch, TV, cross-platform |
| `.agents/skills/ui-craft/references/layout-spacing.md` | page structure, grids, responsive layout |
| `.agents/skills/ui-craft/references/typography.md` | fonts, pairing, type scale, text-heavy pages |
| `.agents/skills/ui-craft/references/forms.md` | forms, inputs, validation, sign-up, settings |
| `.agents/skills/ui-craft/references/tables-lists.md` | tables, lists, filters, bulk actions |
| `.agents/skills/ui-craft/references/dashboards-charts.md` | dashboards, KPIs, charts |
| `.agents/skills/ui-craft/references/navigation.md` | app shell, menus, tabs, search |
| `.agents/skills/ui-craft/references/feedback-states.md` | loading, empty, error, success, toasts |
| `.agents/skills/ui-craft/references/accessibility.md` | keyboard, screen readers, ARIA widgets, WCAG |
| `.agents/skills/ui-craft/references/motion.md` | transitions, springs, micro-interactions |
| `.agents/skills/ui-craft/references/mobile-touch.md` | phone and tablet screens, gestures |
| `.agents/skills/ui-craft/references/review-checklist.md` | before you call a screen done |
| `.agents/skills/ui-craft/references/mockups.md` | fast clickable mockups and options for client approval |
| `.agents/skills/ui-craft/references/review-mode.md` | scoring and improving an existing product |
| `.agents/skills/ui-craft/references/mixing.md` | a game, sci-fi or film look on a website or app; one theme across web, app, 3D scene and motion |

Assets: `.agents/skills/ui-craft/assets/tokens.css` (base tokens), `.agents/skills/ui-craft/assets/directions/*.css` (16 directions; `gallery.html` shows them all), `.agents/skills/ui-craft/assets/mockup-template.html`, `.agents/skills/ui-craft/assets/options-board.html`.
Scripts (Node 22+, no packages): `.agents/skills/ui-craft/scripts/palette.mjs` (accessible palette from a brand colour), `.agents/skills/ui-craft/scripts/ui-audit.mjs` (measure, score and screenshot a page or URL; needs Chrome).
