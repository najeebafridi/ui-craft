# Sources

Research for the `ui-craft` skill. Read on 2026-11-13, public pages only. Nothing was downloaded or run.
All rules below are **paraphrased in our own words**. Tags: `[bg]` or `(S)` = not verified on the official page (page did not render); `(V)` = verified.

## Summary

| Source | Made by | Licence | Can we quote? |
|---|---|---|---|
| Anthropic frontend-design skill | Anthropic | Apache-2.0 | Yes, with credit |
| Vercel Web Interface Guidelines + AGENTS.md | Vercel Labs | MIT (repo) | Yes, with credit |
| ui-ux-pro-max | Next Level Builder | MIT | Yes, with credit |
| awesome-cursorrules | PatrickJS + community | CC0-1.0 | Yes |
| Impeccable | Paul Bakaus | Apache-2.0 | Yes, with credit |
| Uncodixfy | cyxzdev | MIT | Yes, with credit |
| Taste Skill | Leonxlnx | MIT | Yes, with credit |
| Material Design 3 | Google | Docs likely CC BY 4.0, code Apache-2.0 (docs not verified) | Paraphrase only (to be safe) |
| Apple HIG | Apple | All rights reserved | No |
| Fluent 2 | Microsoft | Docs: no licence stated; code MIT | No (docs) |
| Radix Themes / Colors | WorkOS | MIT (themes) | Yes, with credit |
| shadcn/ui | shadcn | MIT | Yes, with credit |
| IBM Carbon | IBM | Code Apache-2.0; docs not verified | Paraphrase only |
| Atlassian Design System | Atlassian | Restrictive, no derivatives | No |
| Shopify Polaris | Shopify | Custom, Shopify-only | No |
| GOV.UK Design System | GDS | Docs OGL v3, code MIT | Yes, with credit |
| WCAG 2.2 | W3C | W3C Document License | Short quotes with credit |
| WAI-ARIA APG | W3C | W3C permissive (per-file not confirmed) | Paraphrase only |
| The A11Y Project | Community | Repo Apache-2.0; content not confirmed | Paraphrase only |
| WebAIM | WebAIM / USU | All rights reserved | No |
| MDN | Mozilla + contributors | Prose CC-BY-SA 2.5 (share-alike) | No (share-alike would bind our MIT text) |
| Inclusive Components | Heydon Pickering | None stated | No |
| APCA | Andrew Somers | Not verified | No |
| Refactoring UI | The UI Company | All rights reserved | No |
| Nielsen Norman Group | NN/g | All rights reserved (heuristics may be reused with credit) | No |
| Laws of UX | Jon Yablonski | None stated | No |
| Datawrapper blog | Datawrapper GmbH | All rights reserved | No |
| Stephen Few | Perceptual Edge | Not verified | No |
| web.dev | Google | Likely CC BY 4.0 (not verified) | Paraphrase only |
| GOV.UK Service Manual | GDS | OGL v3 | Yes, with credit |

**Decision:** the skill is written fully in our own words. We quote no source word for word, so no licence limits us. We still credit every source that shaped a rule (see `CREDITS.md`).


---

# Group: AI-agent design rule sets (raw research)

All rules paraphrased. Licences read from raw LICENSE files via WebFetch unless noted. Star counts are unverified (sources disagree).

## Anthropic skills: frontend-design
- Link: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- Made by: Anthropic
- Licence: Apache-2.0 (read skills/frontend-design/LICENSE.txt; SKILL.md frontmatter points to it). Repo README says many skills are Apache-2.0. The docx/pdf/pptx/xlsx folders are commonly described as having different (source-available) terms; my README fetch did not confirm either way, so check those separately before reusing them.
- Best rules (own words):
  - Write a short design plan first (colour, type, layout, principles), check it against the brief for generic defaults, build, then critique (with screenshots if possible) and delete whatever does not serve the brief.
  - Base palette: 4-6 named hex values, kept harmonious. Avoid stock AI palettes: cream + terracotta, near-black + one bright accent; do not use tinted near-blacks (#0B0B0B, #111) as "black".
  - Type: one family, or two clearly different ones; deliberate typeface choice (not the default); a real type scale; line length under ~80 characters; serif body needs more line-height than sans.
  - Headlines are design elements; avoid tells: accenting a single headline word, all-caps labels, needless labels above content.
  - Concentrate boldness in one memorable element; keep the rest restrained.
  - Avoid the "SaaS card kit" (identical rounded cards, one radius everywhere, same soft shadow, gradient washes) and the "broadsheet" look (hairlines, zero radius, dense columns).
  - Dividers, eyebrows and borders must carry information; number things only if sequential. Avoid template chrome: middle-dot meta strings, monospace tiny data labels, arrows on every link/button.
  - Motion: one orchestrated moment (load sequence or single reveal); no fade-slide-up on every section, no hover transition on every card; user-triggered motion is fine when it shows what changed.
  - Quality floor: responsive to mobile, visible keyboard focus, reduced-motion respected, accessible contrast.
  - UX writing: sentence case, active-voice CTAs naming the exact action (same name across the flow), errors say how to fix and do not apologise, empty states invite action.
- Notable: short, opinionated, taste- and process-oriented; no numeric spacing/size values. No other UI skill in the repo confirmed (README lists only broad "Creative & Design" categories).

## Vercel Web Interface Guidelines
- Link: https://vercel.com/design/guidelines ; https://github.com/vercel-labs/web-interface-guidelines
- Made by: Vercel (vercel-labs)
- Licence: MIT, "Copyright (c) 2025 Vercel Labs" (repo LICENSE). The vercel.com page itself states no licence. Some copy rules are Vercel-brand-specific (Vercel says so).
- Best rules:
  - Hit targets at least 24px; 44px on mobile; enlarge the hit area if the visual is smaller. Mobile inputs 16px+ font (prevents iOS zoom); never disable zoom; `touch-action: manipulation`.
  - Always show `:focus-visible` rings, never remove outline without replacement; sticky/fixed bars must not cover focused controls.
  - Animate only `transform`/`opacity`; list properties (no `transition: all`); keep animations interruptible; honour reduced motion; auto-motion over 5s needs pause/stop.
  - Loading: delay spinner/skeleton ~150-300ms, then show it at least ~300-500ms to avoid flicker; skeletons mirror final layout; mutations under 500ms.
  - Forms: never block paste/typing; keep submit enabled until the request starts, then disable + spinner; inline errors beside fields, focus first error; correct `type`/`autocomplete`/`inputmode`; no spellcheck on emails/codes.
  - URL holds UI state (filters, tabs, pagination); real `<a>` for navigation, `<button>` for actions; confirm or offer undo for destructive actions.
  - Depth: 2+ shadow layers; pair borders with shadows; child radius <= parent radius; tint borders/shadows toward the background hue; hover/active/focus need more contrast than rest.
  - Typography details: curly quotes, `…`, tabular-nums for number columns, non-breaking space between number and unit, `text-wrap: balance`; prefers APCA over WCAG2 for contrast (WCAG2 is still the legal baseline).
  - Design every state: empty, sparse, dense, error, long text (truncate/clamp, `min-w-0`); images get explicit width/height; virtualise lists over ~50 items.
  - `color-scheme: dark` and matching `theme-color` for dark themes; respect safe areas via `env()`.
- Notable: the most implementation-precise and testable list (good review checklist); weak on visual taste, palette and hierarchy.

## ui-ux-pro-max
- Link: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Made by: Next Level Builder (nextlevelbuilder)
- Licence: MIT, "Copyright (c) 2024 Next Level Builder" (repo LICENSE).
- Best rules (from its SKILL.md priority table):
  - Priority order: accessibility, touch/interaction, performance, style selection, layout/responsive, typography/colour, animation, forms, navigation, charts.
  - Contrast >= 4.5:1; touch targets >= 44x44px with 8px+ gaps; CLS < 0.1.
  - Body base 16px, line-height 1.5, never body text under 12px; semantic colour tokens, not raw hex in components.
  - Bottom nav max 5 items; predictable back behaviour; deep linking.
  - Do not mix flat and skeuomorphic randomly; SVG icons, not emoji.
  - Animation: durations vary by context (not one for all); animate transform/opacity not width/height; motion must convey meaning.
  - Forms: visible labels (no placeholder-only), errors near the field, helper text.
  - Charts: legends and tooltips; never colour alone for meaning.
  - Spacing by density dial: spacious 24-96px, standard 16-64px, dense 8-32px; dials `variance`, `motion`, `density` each 1-10.
  - Detect the stack from project files; do not assume one.
- Notable: very large lookup database (styles/palettes/fonts) plus a persisted design-system generator (MASTER.md); breadth high, rule text thin on rationale. Star counts reported inconsistently (10k to 130k+).

## awesome-cursorrules (PatrickJS)
- Link: https://github.com/PatrickJS/awesome-cursorrules
- Made by: PatrickJS and community contributors
- Licence: CC0-1.0 (repo LICENSE, "CC0 1.0 Universal"). Individual contributed files may not carry their own notices.
- Best rules (`landing-page-image-quality-cursorrules-prompt-file.mdc`, the only genuinely useful UI file found):
  - No placeholder image services (placehold.co, picsum) or hotlinking random sites; use committed assets, real product screenshots, or approved generated images.
  - Show real interface visuals when users must inspect a workflow, not vague atmospheric imagery.
  - Keep aspect ratios consistent across repeated cards; set width/height or `aspect-ratio`.
  - Informative images get specific alt text; decorative get empty alt; essential text never only inside an image.
  - Verify image paths resolve in the built app; test mobile and desktop; no broken-image icons in loading/error/empty states.
- Notable: the React + TypeScript + shadcn/ui rule file has empty UI sections (just "use latest stable stack"); most Cursor rules are stack boilerplate, not design guidance.

## Vercel AGENTS.md (agent-ready UI instructions)
- Link: https://github.com/vercel-labs/web-interface-guidelines (AGENTS.md at repo root)
- Made by: Vercel Labs
- Licence: MIT (same repo LICENSE as above)
- Best rules (additions beyond the guidelines page):
  - Full keyboard support following WAI-ARIA APG patterns; trap, move and restore focus in dialogs.
  - Announce toasts and inline validation through polite live regions.
  - Warn on navigating away from unsaved edits; trim input values.
  - Optimistic updates, then roll back or offer undo on failure.
  - Restore scroll on back/forward; Cmd/Ctrl-click and middle-click must work (real links).
  - Guard date rendering against hydration mismatches; handle empty strings/arrays without broken layout.
  - Set `transform-origin` so motion starts from the right point.
- Notable: shows guidelines shipped as an agent instruction file. The agents.md site lists no UI-focused example repos (footer: "Copyright AGENTS.md a Series of LF Projects, LLC", no open licence stated). I found no better popular UI-specific AGENTS.md.

## Impeccable (discovered)
- Link: https://github.com/pbakaus/impeccable
- Made by: Paul Bakaus
- Licence: Apache-2.0, "Copyright 2025 Paul Bakaus" (repo LICENSE). Built on Anthropic's frontend-design skill (check for NOTICE/attribution before reuse).
- Best rules:
  - Named AI-slop tells: Inter used for everything; thin serif headlines with italic accent as default; purple-to-blue gradients; grey text on coloured backgrounds; cards nested in cards; rounded-square icon tile above every heading; pill buttons as the default.
  - Build around one anchor (a single central image/idea) rather than a template.
  - Replace vague feedback ("make it pop") with targeted single-element instructions; review one section at a time.
  - Command set (typeset, colorize, layout, animate, quieter, audit) plus a deterministic detector (~27 rules) for cramped padding, skipped heading levels, low contrast, tiny text.
- Notable: closest to a linter plus critique loop; README gives few numeric values.

## Uncodixfy (discovered)
- Link: https://github.com/cyxzdev/Uncodixfy
- Made by: cyxzdev
- Licence: MIT, "Copyright 2026 cyxzdev" (repo LICENSE)
- Best rules:
  - Radius: cards 8-12px max, buttons 8-10px, badges 6-8px; avoid 20-32px and pills.
  - Shadow cap: `0 2px 8px rgba(0,0,0,0.1)`; no glow, coloured or dramatic shadows.
  - Spacing scale 4/8/12/16/24/32; section padding 20-30px; container 1200-1400px; sidebar 240-260px solid with 1px border; toolbar 48-56px; icons 16-20px; body 14-16px.
  - Transitions 100-200ms ease, opacity/colour only; no transform hovers, bounces, slide-ins.
  - Ban: gradients, glassmorphism, blur, glows, eyebrow labels, hero inside a dashboard, decorative copy, donut/fake charts, default KPI-card grids, nested panel types, right-rail quota panels, "mobile = just stack everything".
  - Aim for Linear/Raycast/Stripe/GitHub restraint; when a choice feels like the default AI move, take the plainer option.
  - Reuse the project's existing palette; do not invent colour combos.
- Notable: concrete numbers, great for dashboards/app UIs; heavily negative, and its colour advice is self-contradictory (says avoid blue, lists blue palettes). Only SKILL.md read directly; stars unverified (~2.5k).

## Taste Skill (Leonxlnx, discovered)
- Link: https://github.com/Leonxlnx/taste-skill
- Made by: Leonxlnx
- Licence: MIT, "Copyright (c) 2026 Leonxlnx" (repo LICENSE)
- Best rules (from the file I could read; a site-builder variant, may differ from the main skill):
  - No violet/lavender anywhere (accent, ground, gradient, tint).
  - Outside tech, flat colour only: no gradients, grain, shaders.
  - Radius by domain: sharp for fintech/dev tools, soft default, round consumer.
  - Layout: hero fills first screen; each section 1-2 screens at 1440x900; nest boxes at most 2 deep; test at 1440/1024/820/768/390/320; at 390 single column and full-width buttons; tap targets >= 44px and >= 8px apart.
  - Motion: card hover lift 2px, photo zoom 1.02-1.03; loops cycle 2.5-4s; anything over 5s needs pause; one signature moment per page; no scroll-fade-ins, parallax on text, scroll-jacking, tilt, carousels, timed tabs.
  - Copy: h1 names category and buyer; buttons = verb + object; max 2 hero actions; no invented reviews, customers or figures; placeholder contact details use `.example`.
- Notable: very prescriptive, tunable dials; popular (stars 21k-82k depending on source), but the fetched text read like a pipeline spec, so treat specifics as one opinionated variant.

## Disagreements spotted
- Fonts: Uncodixfy says avoid Inter/Roboto/Arial and no serif/sans mixes; frontend-design allows one family or two distinct ones and serif body with extra leading; Impeccable bans Inter-for-everything but also bans thin serif headline + italic accent as a default.
- Gradients: Uncodixfy bans all; Taste bans outside tech pages (tech allows 0-2 CSS grounds); Impeccable/frontend-design ban only the purple/blue or wash clichés.
- Motion: Uncodixfy allows only opacity/colour, no transforms; Taste allows 2px card lift and 1.02-1.03 zoom; Vercel allows transform + opacity; frontend-design wants one orchestrated load moment.
- Radius: Uncodixfy caps at 8-12px and bans pills; Taste chooses by domain (round for consumer); frontend-design bans one radius everywhere; Vercel says nested radii must nest.
- Touch targets: Vercel 24px minimum (44px mobile); ui-ux-pro-max and Taste 44px with 8px gaps.
- Contrast: Vercel prefers APCA; ui-ux-pro-max uses WCAG 4.5:1.
- Spacing: Uncodixfy fixed 4-32px scale; ui-ux-pro-max density dial 8-96px; frontend-design none.
- Body size: Uncodixfy 14-16px; ui-ux-pro-max base 16px, min 12px; Taste 16px.
- Tone: frontend-design wants one bold memorable element; Uncodixfy and Taste push restraint. Vercel Title Case headings conflict with frontend-design sentence case (Vercel marks its copy rules brand-specific).
- Dashboards: Uncodixfy bans default KPI-card grids and heroes; frontend-design only warns against the big-number + label + gradient default.

---

# Group: Design systems research (raw)

Method note: pages fetched 2026-11-13 via WebFetch (public only). m3.material.io and developer.apple.com are JS-rendered and returned only page titles, so their numbers below are tagged [bg] = from background knowledge / secondary source, NOT verified on the official page. Everything untagged was read from the cited page. Rules are paraphrased.

## Material Design 3
- Link: https://m3.material.io (layout: /foundations/layout/applying-layout/window-size-classes)
- Made by: Google
- Licence: A search result for m3.material.io/get-started says content is available under Apache 2.0 or CC BY 4.0 (page would not render; per-asset split NOT verified). Code repo github.com/material-components/material-web = Apache-2.0 (verified on repo page). Google trademarks excluded. Treat as "CC BY 4.0 docs (attribution needed), Apache-2.0 code" pending a manual check.
- Best rules:
  - Width classes (verified on developer.android.com, which says they map to M3): compact <600dp, medium 600-839, expanded 840-1199, large 1200-1599, extra-large >=1600. Height classes: compact <480, medium 480-899, expanded >=900.
  - Decide layout from window width, not "is tablet"; window size can change at runtime (split screen, fold, resize).
  - Compact = single pane + bottom navigation bar; medium = navigation rail; expanded and up = rail or drawer plus two panes (list-detail, supporting pane). [bg]
  - Layout margins 16dp on compact, 24dp on medium+, 8dp spacing grid with 4dp for small icon/text alignment. [bg]
  - Min touch target 48x48dp even when the visual is smaller (e.g. 24dp icon). [bg]
  - Colour is role-based: primary/secondary/tertiary/error each with on-X, X-container and on-X-container; surface family (surface, surface-container-low..highest, on-surface, outline). Always pair a fill with its on- colour. [bg]
  - Dark theme is a separate tonal mapping of the same roles, not inverted colours. [bg]
  - Elevation is expressed mainly by tonal surface colour; shadows only for a few levels (0-5). [bg]
  - Type roles: display, headline, title, body, label x large/medium/small; body-large 16sp, body-medium 14sp, label-large 14sp. [bg]
  - Shape scale: none 0, extra-small 4, small 8, medium 12, large 16, extra-large 28, full. [bg]
- Notable: the most complete role-based colour + adaptive window-class model; the bar/rail/drawer switch is the best nav rule to copy.

## Apple Human Interface Guidelines
- Link: https://developer.apple.com/design/human-interface-guidelines
- Made by: Apple
- Licence: All rights reserved. Verified at apple.com/legal/internet-services/terms/site.html: content is proprietary, footer "Copyright (c) 2026 Apple Inc. All rights reserved", copying/republishing needs written consent. Do NOT copy text; paraphrase facts only.
- Best rules (all [bg]/secondary; HIG pages did not render; 44pt confirmed via Fluent page and a search snippet of Apple text):
  - Hit target at least 44x44pt for every tappable control; visual may be smaller, padding fills the rest.
  - Respect safe areas and system margins (typically about 16pt side margins on iPhone); never put controls under the home indicator, status bar or Dynamic Island.
  - Use semantic text styles; default body is 17pt, with Dynamic Type scaling (layouts must reflow at large sizes; nothing truncated).
  - Avoid text below about 11pt; use the system font (SF Pro) and weight, not size alone, for hierarchy.
  - Navigation: tab bar for 3-5 top-level destinations (bottom, iPhone); navigation bar with back + title for hierarchy; sidebar on iPad/Mac; avoid hamburger menus.
  - Use semantic system colours (label, secondaryLabel, systemBackground, separator) that adapt to light/dark; support both appearances and increased contrast.
  - Dark mode uses layered backgrounds (base vs elevated) so higher surfaces are lighter.
  - Prefer standard controls and system gestures; destructive actions in red and confirmed via action sheet.
  - Concentric corners: inner radius = outer radius minus padding; continuous ("squircle") corners.
- Notable: the source for 44pt and Dynamic Type; strictly proprietary, so cite by name and paraphrase only.

## Microsoft Fluent 2
- Link: https://fluent2.microsoft.design
- Made by: Microsoft
- Licence: Pages show only "(c) Microsoft 2026" with Terms of use/Trademarks links; no content licence stated (treat as all rights reserved, not verified further). Code repo github.com/microsoft/fluentui = MIT (verified on repo page); fonts and icons under a separate assets licence.
- Best rules:
  - 4px base spacing unit; tokens 0,2,4,6,8,10,12,16,20,24,28,32,36,40,48,52,56 (2/6/10 exist only to fit icon padding).
  - Min touch target 44x44 (iOS/Web) and 48x48 (Android).
  - 12-column grid common; gutters multiples of 4; breakpoints small 320-479, medium 480-639, large 640-1023, x-large 1024-1365, xx-large 1366-1919, xxx-large 1920+.
  - Web type ramp, Segoe UI: caption2 10/14, caption1 12/16, body1 14/20, subtitle2 16/22, subtitle1 20/26, title3 24/32, title2 28/36, title1 32/40, large title 40/52, display 68/92. Body = 14px.
  - Corner radius: none 0 (nav/tab bars), 2 small badges, 4 default (buttons, dropdowns), 8 large, 12 sheets/popovers, circle 50% for personas; shapes under 32px use 2.
  - Shadows come in pairs (sharp key + soft ambient); ramp 2,4,8,16 (cards, tooltips, hover cards) and 28,64 (side nav/sheets, dialogs/panels); keep one consistent light direction.
  - Align text left, objects centred; adapt by reposition, resize, reflow, show/hide, re-architect.
- Notable: densest default (14px body, 4px radius, 4px grid); good for productivity/enterprise screens.

## Radix (Themes + Colors)
- Link: https://www.radix-ui.com/themes/docs/overview/styling ; https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- Made by: WorkOS (Radix team)
- Licence: radix-ui/themes MIT, "Copyright 2023-present WorkOS" (verified on github.com/radix-ui/themes). radix-ui/colors licence not shown in the fetch; believed MIT, NOT verified.
- Best rules:
  - Space scale 1-9: 4, 8, 12, 16, 24, 32, 40, 48, 64px (--space-1..9).
  - Font scale 1-9: 12/16, 14/20, 16/24, 18/26, 20/28, 24/30, 28/36, 35/40, 60/60 (size/line-height px).
  - One `scaling` setting (90-110%) scales spacing, font and line-height together for density.
  - Radius: six steps (--radius-1..6) driven by one factor: none/small/medium/large/full.
  - Colour scale = 12 steps per hue with fixed jobs: 1 app bg, 2 subtle bg, 3 element bg, 4 hover bg, 5 active/selected bg, 6 subtle border, 7 interactive border, 8 strong border/focus ring, 9 solid fill, 10 solid hover, 11 low-contrast text, 12 high-contrast text.
  - Use step 9 for brand/solid fills, 11 for secondary text and 12 for primary text; same step numbers work in dark mode because each hue has a hand-tuned dark scale.
  - Tokens are CSS variables; token changes are treated as breaking, so build on variables, not raw hex.
- Notable: the clearest "what each colour step is for" model; great for consistent light/dark palettes.

## shadcn/ui
- Link: https://ui.shadcn.com/docs/theming
- Made by: shadcn (community project)
- Licence: MIT (verified on github.com/shadcn-ui/ui).
- Best rules:
  - Colour tokens are semantic pairs: `X` for the surface and `X-foreground` for text/icons on it (background, card, popover, primary, secondary, muted, accent, destructive).
  - Use Tailwind utilities that map to tokens (bg-primary text-primary-foreground), never hard-coded hex or raw palette colours in components.
  - Dark mode = override the same variable names under a `.dark` class; `dark:` variant keyed to that class.
  - Default colours are OKLCH (e.g. oklch(0.205 0 0)).
  - One `--radius` (default 0.625rem = 10px) drives the scale via calc multipliers (sm about 0.6x up to 4xl about 2.6x).
  - Also tokens for border, input, ring (focus), chart-1..5, sidebar-* [bg].
  - Components are copied into your repo on top of primitives: edit them, compose with variants rather than wrapping [bg].
- Notable: the de-facto convention for AI-generated React UIs; its neutral default look is generic, so change tokens to avoid samey output.

## IBM Carbon
- Link: https://carbondesignsystem.com
- Made by: IBM
- Licence: Code repo github.com/carbon-design-system/carbon = Apache-2.0 (verified). No separate docs-content licence on the repo page and the site FAQ URL 404ed; docs licence NOT verified.
- Best rules:
  - Spacing scale: 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160px ($spacing-01..13).
  - Type scale px: 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 54, 60, 68, 76, 84, 92; IBM Plex; productive (product UI, fixed headings) vs expressive (editorial, fluid headings).
  - Control heights: xs 24, sm 32, md 40 (default), lg 48 px; use one height for all fields on a page/row.
  - Data table row heights: xs 24, sm 32, md 40 default, lg 48, xl 64 (only for two-line rows); header row matches body row size.
  - Table interactions: sortable headers cycle unsorted/asc/desc, icon persistent only on the sorted column; selecting rows shows a batch-action bar (same height as rows) and disables per-row actions; optional zebra striping.
  - Forms: label above and always present, sentence case, no colon; helper text stays under the field until replaced by an error; errors = red border + icon + message.
  - If most fields are required, mark the optional ones "(optional)"; if most are optional, mark the required ones.
  - Validate on submit unless real-time clearly helps.
- Notable: strongest data-table and form-density guidance, with five table row sizes in exact px.

## Atlassian Design System
- Link: https://atlassian.design
- Made by: Atlassian
- Licence: Restrictive. atlassian.design/license (verified): limited, non-transferable licence to use the system to build add-ons/software for Atlassian products; no modification or derivatives; some code may carry separate open-source terms (community posts say repo code is Apache-2.0; unverified, github repo fetch 404ed). Treat docs as not freely reusable; paraphrase only.
- Best rules:
  - 8px base token `space.100`; scale 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px. Use tokens, not raw px.
  - Small (0-8) for tight UI like icon+text, badges; medium (12-24) for button padding and item gaps; large (32-80) for page layout.
  - Related items closer, unrelated further; group with consistent spacing.
  - Grid: 12 columns desktop (>=1024) with 16px gutters and 32px margins; 6 columns tablet (480-1023) and 2 columns mobile (320-479) with 12px gutters and 16px margins; fixed-wide max 1296px, fixed-narrow max 864px for reading.
  - Colour tokens named color.<property>.<role>.<emphasis>.<state> (e.g. color.background.danger.bold.hovered); roles: neutral, brand, information, success, warning, danger, discovery, accent; emphasis subtlest to bold.
  - Contrast: 4.5:1 text under 24px, 3:1 for large text and essential UI; a selected state needs a second cue beyond colour.
  - Radius: 2 xs (badges, checkboxes), 4 small (tags, tooltips), 6 medium (buttons, inputs), 8 large (cards, menus), 12 xl (modals, tables), 16 xxl, full for pills/avatars.
  - Focus ring sits 2px outside the element with radius = element radius + 2.
  - Elevation: sunken (backdrop), default (flat), raised (movable cards, shadow), overlay (modals/menus, shadow); only raised/overlay get shadows; in dark mode higher = lighter surface.
- Notable: best-documented token naming (property.role.emphasis.state) and a clear 4-level elevation model.

## Shopify Polaris
- Link: https://shopify.dev/docs/api/polaris (old polaris-react.shopify.com 301-redirects here)
- Made by: Shopify
- Licence: github.com/Shopify/polaris code = custom MIT-based licence restricting use to apps that integrate with Shopify (verified on repo page); icons/images under a separate Polaris Design Guidelines licence. Docs content licence not stated. Treat as not freely reusable.
- Best rules: fetchable page is a stub (Polaris is now web components for Admin/Checkout/POS surfaces), so no verified numbers. Background [bg]: 4px-based space tokens; one-column or two-column (2/3 + 1/3) page layouts; one primary action in the page header; tables right-align numbers, left-align text, and collapse to lists/cards on mobile; plain sentence-case merchant-friendly copy.
- Notable: doc site moved and is low-yield now; weight it below Carbon/Atlassian for the skill.

## GOV.UK Design System
- Link: https://design-system.service.gov.uk
- Made by: UK Government Digital Service
- Licence: Docs content "Crown copyright", Open Government Licence v3.0; code MIT (both verified on github.com/alphagov/govuk-frontend README).
- Best rules:
  - Spacing units 0-9: 0, 5, 10, 15, then responsive (small/large): 4 = 15/20, 5 = 15/25, 6 = 20/30, 7 = 25/40, 8 = 30/50, 9 = 40/60 (large applies above the 640px tablet breakpoint). 5px base.
  - Type scale tops out at 80px on desktop; body sizes 16 and 19px; frontend v6 raised small-screen sizes (24/27 -> 21px with 25px line height, 36 -> 27px/30px) and removed the 14px step.
  - One question per page; make the label/legend the page heading; short hint (one sentence, no full stop, no links).
  - Never mark required fields with asterisks; add "(optional)" to optional labels instead.
  - Errors: message in red directly after label/hint, red border on the field, plus an error summary at the top with links; same wording in both; say what went wrong and how to fix it; avoid "please", "invalid", "oops"; never clear user input.
  - Primary button: "Continue" not "Next", left-aligned; one default button per page; avoid disabled buttons (poor contrast, confusing).
  - Focus state is yellow background with a thick black underline/border so it works on any background.
  - Button labels in sentence case, naming the action ("Save and continue").
- Notable: the gold standard for accessible forms and error handling; larger text and plainer layouts than commercial systems.

## Disagreements spotted
- Touch target: Apple 44x44pt; Fluent 44x44 (iOS/Web) but 48x48 (Android); Material 48x48dp [bg]; WCAG 2.2 AA minimum is 24x24 CSS px (from knowledge, not re-fetched). Safe default: 44px web, 48 Android, 8px gaps.
- Base body font size: Carbon 16px (scale also has 14); Radix step 3 = 16px (step 2 = 14); Fluent 14px (14/20); Material body-large 16 / medium 14 [bg]; Apple 17pt; GOV.UK 16 and 19px (19 as the main reading size). Dense apps 14, content/mobile 16+.
- Spacing base unit: Fluent 4px; Radix 4px steps (4,8,12,16,24,...); Atlassian 8px (tokens at 0.25x = 2px); Carbon 2/4/8 family; Material 8dp grid [bg]; GOV.UK 5px (5,10,15,20,25). Compromise: 4px tokens, 8px for layout rhythm.
- Corner radius for buttons/inputs: Atlassian 6px (cards 8, modals 12); Fluent 4px (large 8, sheets 12); shadcn about 10px base (md about 8); Radix factor-based none..full; Material buttons fully rounded and cards 12 [bg]; Carbon near-square (not fetched); GOV.UK square.
- Table/control density: Carbon default row 40px (options 24/32/40/48/64); Fluent and Atlassian give no verified row height; Material rows 52-56dp [bg]. Density default differs: Carbon medium 40, Fluent compact.
- Responsive spacing: GOV.UK enlarges tokens on large screens (unit 9: 40 to 60); Atlassian keeps tokens fixed but changes columns/gutters/margins by breakpoint (margins 16 to 32); Radix/Carbon keep tokens fixed and scale via density factor.
- Breakpoints: Material 600/840/1200/1600 dp; Fluent 480/640/1024/1366/1920; Atlassian 480/768/1024/1440/1768; GOV.UK 641 tablet [bg]. No common set; choose 640/1024/1440 for web.
- Grid: Fluent and Atlassian 12 columns on desktop; Atlassian 6 on tablet and 2 on mobile; Material 4/8/12 [bg].
- Dark-mode elevation: Material and Atlassian lighten higher surfaces; Fluent keeps shadow pairs; Apple uses base vs elevated backgrounds.
- Required-field marking: GOV.UK forbids asterisks and marks "(optional)"; Carbon marks whichever group is the minority; many commercial systems still use asterisks.
- Validation timing: Carbon and GOV.UK validate on submit (Carbon allows real-time); on-blur is common elsewhere.
- Focus indicator: GOV.UK yellow/black thick; Atlassian 2px-offset ring with radius+2; Radix step 8 for rings; shadcn `ring` token.
- Navigation: Apple 3-5 tab bar and no hamburger; Material bottom bar (compact), rail (medium), drawer (expanded); Atlassian/Fluent lean on side nav + top bar on desktop.

---

# Group: Accessibility sources (research notes)
Verified via public page fetches, 2026-11. Rules paraphrased in own words.

## WCAG 2.2 (+ "What's new in 2.2")
- Link: https://www.w3.org/TR/WCAG22/ ; https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- Made by: W3C Accessibility Guidelines WG. Licence (verified on page): (c) 2020-2024 W3C; "W3C liability, trademark and document use rules" -> W3C Document License (not the Software+Document one). Quoting/linking fine; the licence forbids altering the spec text itself. New-in-22 page points to "Permission to Use WAI Material".
- Best rules:
  1. SC 1.4.3 (AA): body text contrast >= 4.5:1; large text (>=24px, or >=18.66px bold) >= 3:1. No rounding (4.47 fails).
  2. SC 1.4.11 (AA): UI component boundaries/states (input borders, meaningful icons, chart marks, focus ring) >= 3:1 vs adjacent colours.
  3. SC 1.4.1 (A): colour is never the only cue; add icon, text, underline or pattern (errors, required, inline links, chart series).
  4. SC 2.4.7 (AA) focus visible; SC 2.4.11 (AA, new): a focused item must not be entirely hidden by sticky headers, cookie banners, chat widgets (use scroll-padding-top / scroll-margin). AAA 2.4.12 = no part hidden; AAA 2.4.13 = indicator at least 2px perimeter and 3:1 change.
  5. SC 2.5.8 (AA, new): pointer targets >= 24x24 CSS px, unless: spacing (a 24px circle centred on each undersized target must not overlap another), inline in text, equivalent control on page, or browser-default control.
  6. SC 2.5.7 (AA, new): anything done by drag (sliders, reorder, kanban, map) also needs a single-pointer alternative (buttons, tap-tap, number input).
  7. SC 3.3.7 (A, new) Redundant Entry: do not make users retype data from earlier in the same flow (prefill/select, e.g. shipping->billing). SC 3.3.8 (AA, new) Accessible Authentication: no memory/puzzle/transcription test without an alternative; allow paste and password managers, offer passkeys/email link; use autocomplete attributes.
  8. SC 3.2.6 (A, new) Consistent Help: help/contact/chat/FAQ link sits in the same relative place on every page where it appears.
  9. SC 3.3.1/3.3.2/3.3.3 (A/AA): name the field in error in text, give a visible persistent label plus instructions, suggest the fix. SC 3.3.4: legal/financial submits must be reversible, checked or confirmed.
  10. SC 1.3.1/2.4.6/2.4.2: real headings in order (one h1, no skipped levels for styling), landmarks, unique page title. SC 1.1.1: meaningful alt; alt="" for decoration. SC 2.2.2 (A): pause/stop auto-moving content longer than 5s; SC 2.3.1: nothing flashes more than 3x/sec. SC 1.4.10 reflow at 320px width without 2-D scroll; 1.4.4 200% text zoom; 1.4.12 text-spacing overrides must not clip.
  11. 4.1.1 Parsing was removed in 2.2 (obsolete).
- Notable: 2.2 added 9 SCs (6 at A/AA); target size is only 24px at AA, not 44.

## WAI-ARIA Authoring Practices Guide (APG)
- Link: https://www.w3.org/WAI/ARIA/apg/ ; patterns at /apg/patterns/
- Made by: W3C ARIA WG / APG Task Force. Licence: footer says (c) 2026 W3C, "permissive license rules apply unless otherwise noted", linking W3C Software License and Permission to Use WAI Material. Per-file licence of code examples not independently confirmed -> attribute and link, do not bulk copy.
- Best rules (own words; key behaviours from APG patterns, recalled from the spec, not all re-fetched):
  1. First rule of ARIA: use the native element (button, a, select, details, dialog) before adding role=. A role promises keyboard behaviour you must then implement.
  2. Tabs: role=tablist; Left/Right arrows move between tabs, Home/End jump; only the active tab is in the tab order (roving tabindex); Tab moves into the panel; aria-selected + aria-controls.
  3. Modal dialog: on open move focus inside, trap Tab/Shift+Tab, Esc closes, restore focus to the opener, background inert, aria-labelledby on the title. Prefer <dialog>.showModal().
  4. Menu button: role=menu is for app-style action menus, not site nav. Enter/Space/Down opens; arrows move; Esc closes and returns focus to the button.
  5. Combobox: input role=combobox with aria-expanded, aria-controls, aria-activedescendant; Down opens, arrows move highlight while DOM focus stays in the input, Enter selects, Esc closes; announce result count in a live region.
  6. Accordion/disclosure: a button with aria-expanded inside the heading; Enter/Space toggles.
  7. Composite widgets (tabs, toolbar, listbox, tree, grid): one tab stop, arrows inside (roving tabindex or aria-activedescendant); active item always visibly focused.
  8. Every mouse action needs a key equivalent; no keyboard traps.
- Notable: Authoritative per-widget keyboard spec; APG itself says patterns are examples and need assistive-tech testing.

## The A11Y Project (checklist)
- Link: https://www.a11yproject.com/checklist/ ; repo https://github.com/a11yproject/a11yproject.com
- Made by: A11Y Project community (founder Dave Rupert, many contributors). Licence (verified): repo is Apache-2.0 (file LICENSE-APLv2); a separate content licence was not confirmed from the repo page -> check before copying text.
- Best rules (checklist items, paraphrased):
  1. Use landmarks (header/nav/main/footer) and a skip link as the first focusable element.
  2. Never remove outline without a replacement; focus indicator clearly visible (3:1).
  3. Every control has an associated label; placeholder is not a label.
  4. Link text makes sense out of context ("Pricing guide", not "click here"); buttons act, links navigate.
  5. lang on <html>; unique descriptive <title>.
  6. Honour prefers-reduced-motion; no autoplay; captions for video.
  7. Works at 200% zoom and 320px; do not lock orientation or disable pinch zoom.
  8. No hover-only content; tooltips dismissible and hoverable.
  9. Tables only for data, with th/scope/caption.
  10. Decorative images alt=""; informative images say purpose, not "image of".
- Notable: Plain-language and checkable, so a good basis for an AI self-review list.

## WebAIM (contrast + checklist)
- Link: https://webaim.org/articles/contrast/ ; https://webaim.org/standards/wcag/checklist ; https://webaim.org/resources/contrastchecker/
- Made by: WebAIM, Utah State University. Licence: footer "(c) 2026 WebAIM, Utah State University"; no open licence -> treat as all rights reserved; link and paraphrase only.
- Best rules (contrast page verified):
  1. Ratio scale 1:1 to 21:1; AA 4.5 normal / 3 large; AAA 7 / 4.5. Rounding up is not allowed (#777 on white = 4.47 fails; #767676 passes).
  2. Large = 18pt (24px) or 14pt (18.66px) bold.
  3. Non-text UI/graphics 3:1 (browser-default controls exempt; custom-styled ones are not).
  4. Links distinguished only by colour need 3:1 vs surrounding text plus 4.5:1 vs background plus a non-colour cue on hover/focus; simplest fix is underline.
  5. Disabled controls are exempt from contrast, but do not hide needed info there.
  6. Text over images/gradients: test the worst spot, or add a scrim.
  7. Brand-colour trap: mid-tone brand blues/greens/oranges with white text often land at 3-4:1; darken the fill rather than thinning the text.
  8. Checklist basics: alt text, form labels, heading order, keyboard operability, no trap, captions, errors in words.
- Notable: Best source for concrete pass/fail hex examples; WebAIM Million reports low contrast as the most common failure.

## MDN accessibility guides
- Link: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- Made by: Mozilla and contributors. Licence (verified on MDN attribution page): prose CC-BY-SA 2.5 or later (attribution + share-alike); code samples CC0 if added after 20 Aug 2010, else MIT.
- Best rules:
  1. Semantic HTML first: button for actions, a for navigation, label for inputs, fieldset/legend for groups; div+onclick is keyboard-dead.
  2. Everything interactive reachable and operable via Tab, Enter/Space; never tabindex > 0; tabindex=-1 only for programmatic focus.
  3. aria-label / aria-labelledby for icon-only buttons; aria-live polite for async status; role=alert sparingly for errors.
  4. aria-hidden on a focusable element creates a ghost focus stop; use inert or remove from tab order.
  5. Do not convey meaning by colour alone; check in greyscale.
  6. @media (prefers-reduced-motion: reduce): swap parallax, big transforms, auto-scroll for fades or nothing; also support prefers-contrast and forced-colors (keep real borders, do not rely on background-only cues).
  7. Avoid flashing more than 3/sec; offer pause for animation.
  8. JS widgets: manage focus explicitly, use roving tabindex, mirror APG keys.
  9. Mobile: adequate touch targets, allow zoom and both orientations.
- Notable: Best-licensed source to cite, but CC-BY-SA share-alike applies to derivative text.

## Inclusive Components (Heydon Pickering)
- Link: https://inclusive-components.design/
- Made by: Heydon Pickering. Licence: none stated on the site (only "Designed, built, and maintained by Heydon Pickering") -> treat as all rights reserved; paraphrase with attribution. Pattern list verified (cards, data tables, notifications, content slider, collapsible sections, tabs, theme switcher, tooltips/toggletips, menus & menu buttons, todo list, toggle buttons); the rules below are from memory of those articles.
- Best rules:
  1. Tabs: enhance a list of in-page anchor links progressively; panels labelled by their tabs.
  2. Toggle buttons: state in aria-pressed with a constant label; do not change label text AND pressed state together.
  3. Tooltip = supplementary label on hover/focus, dismissible with Esc, no interactive content inside; toggletip = button that injects text into a live region.
  4. Site navigation is usually a disclosure + list of links, not role=menu.
  5. Cards: one primary link per card; stretch it over the card with a pseudo-element so screen readers do not hear duplicates.
  6. Data tables: real table, caption, th scope; if it overflows, wrap in a focusable, labelled scroll container.
  7. Notifications: role=status/alert region must exist in DOM before content is injected.
  8. Collapsible sections: heading containing a button with aria-expanded.
  9. Theme switcher: toggle button with persisted state; default to prefers-color-scheme.
- Notable: Explains failure modes behind each pattern; pairs well with APG.

## APCA (note)
- Link: https://git.apcacontrast.com/ ; context in the WCAG 3 draft https://www.w3.org/TR/wcag-3.0/ . By Andrew Somers (Myndex). Licence not verified; cite only, do not copy.
- Rules (from memory, unverified this session): output is Lc 0-106, polarity-aware and dependent on font size/weight; rough targets Lc 75 body text, Lc 60 content/large text, Lc 45 headlines and large UI, Lc 30 non-essential text.
- Notable: not normative; WCAG 3 is a draft and its contrast method is unsettled. Legal conformance today = WCAG 2.x ratios; use APCA only as a sanity check.

## Disagreements spotted
- WCAG 2 ratio vs APCA: the ratio passes some dark-on-mid colour pairs that read poorly and fails some light-on-dark that read fine; APCA weights size and weight. Treat WCAG 2 as the floor, APCA as optional check.
- Target size: WCAG 2.5.8 AA = 24x24 CSS px (with spacing exception); WCAG 2.5.5 AAA = 44x44; Apple HIG 44pt; Material 48dp. Skill: 24px hard minimum, 44px for primary/touch controls.
- Focus: 2.4.7 only demands "visible"; 2.4.13 (AAA) wants 2px + 3:1. Practitioner sources advise the stronger one as default.
- Large text: WCAG = 18pt (24px) / 14pt bold (18.66px); some guides loosely say "18px", which is wrong.
- Menus: APG role=menu is for application menus; Inclusive Components says site nav should be disclosure + links; devs often misapply role=menu.
- Tabs: APG allows automatic or manual activation; the choice depends on whether panel content loads instantly.
- Placeholders: WCAG allows several labelling techniques, but WebAIM and A11Y Project say keep a visible persistent label; placeholder-only is also low contrast.
- Disabled controls: WCAG exempts them from contrast; many advocates prefer aria-disabled, focusable, with an explanation.

---

# Group: Craft writing, UX research and specialist topics (raw notes)

Method: public pages fetched via WebFetch/WebSearch only. All rules paraphrased. "(V)" = verified from the fetched page this session; "(S)" = secondary/unverified, re-check before relying.

## Refactoring UI (Adam Wathan & Steve Schoger)
- Link: https://refactoringui.com/ ; free preview https://refactoringui.com/previews/building-your-color-palette/ ; Medium "7 Practical Tips for Cheating at Design" (fetch returned 403, not read directly).
- Made by: Adam Wathan, Steve Schoger (The UI Company Inc.)
- Licence: all rights reserved (footer "Copyright 2026 The UI Company Inc.") (V). Paraphrase only. Icons have a separate licence.
- Best rules:
  - Greys: define 8-10 fixed shades from near-black to near-white; do not generate shades on the fly with lighten()/darken() (V).
  - Primary colour: 1 (max 2) hue with 5-10 shades; accents (error/warning/positive) a few hues, 5-10 shades each, used sparingly (V).
  - Number shades 100-900: base = 500 (must work as a button background), darkest 900, lightest 100; fill 700 and 300 first, then the rest. Adjust existing shades before adding new ones (V).
  - Use fewer borders: separate with a box shadow, a slightly different background, or more spacing (V, homepage sample tip).
  - Do not scale up icons drawn for small sizes; they look clunky (S, Medium chapter heading).
  - Constrain choices up front: fixed type scale, spacing scale, palette (S).
  - Start with generous whitespace and remove it; add details (icons, shadows) only after layout and hierarchy work (S).
  - Keep shadows subtle and use them to express elevation layers (S).
  - Hierarchy comes from size, weight and colour contrast together; de-emphasise secondary text instead of only enlarging primary (S).
- Notable: the verifiable public material is mostly the palette rules; most "tips" circulate via third-party summaries.

## Nielsen Norman Group (NN/g)
- Link: https://www.nngroup.com/articles/ten-usability-heuristics/ , /progress-indicators/ , /skeleton-screens/ , /empty-state-interface-design/ , /errors-forms-design-guidelines/ , /web-form-design/ , /data-tables/ , /animation-duration/ , /ux-prototype-hi-lo-fidelity/
- Made by: Nielsen Norman Group (heuristics: Jakob Nielsen, 1994)
- Licence: all rights reserved, "Copyright 1998-2026 NN/g" (V). The heuristics page allows reuse in your own work if you credit Jakob Nielsen and link or cite. Everything else: paraphrase and cite.
- Best rules:
  - Ten heuristics (V): visible system status; real-world language; user control plus undo/exit; consistency and platform conventions; prevent errors or confirm risky actions; recognition over recall; shortcuts for experts; minimalist design; plain-language errors with a fix; task-focused, in-context help.
  - Loading feedback (V): acknowledge a click instantly (pressed state); under ~1 s no looping animation; 1 s and up show an indicator; 2-9 s looped spinner; 10 s+ percent-done bar plus time estimate; batches under 10 s can show "3 of 50"; never bare static "Loading..."; offer cancel on long tasks; say what is loading; show the first click registered instead of "don't click twice" warnings.
  - Skeleton screens (V): not for waits under 1 s; fine for full-page loads of roughly 1-10 s; single module/card = spinner; uploads/downloads/conversions or >10 s = progress bar; skeleton must mirror final layout (a bare header/footer "frame" is discouraged); shimmer optional and can hurt accessibility; does not replace real performance work.
  - Empty states (V): never an unexplained blank panel; say why it is empty; teach what belongs there; include a button to start the key task (plus optional "learn more"/demo data); show loading, not "No records", while fetching.
  - Form errors (V): validate inline after the field is finished, not while typing; message next to the field, specific and polite; colour plus icon plus text weight, never red alone; avoid modals and tooltips for errors; a top summary alone is not enough; keep the user's input; 3+ errors in one attempt signals a design problem.
  - Form layout (V): guideline-following forms had 78% error-free first submissions vs 42% for violating ones (CHI 2014); cut fields; single column (short related fields like city/state/zip may share a row); labels above fields on mobile; field width matches expected input; radios instead of dropdown for 2-3 options; 1-2 optional fields max, labelled; no placeholder as label; state formats up front; no Reset/Clear button (Cancel far weaker than Submit); verify Tab order.
  - Data tables (V): first column is a human-readable identifier, not an ID; columns ordered by importance, related ones adjacent; freeze header row/column when scrolling; borders, zebra or hover highlight to track rows; easy hide/reorder columns showing hidden count; deep editing in a non-modal side panel; 1-2 inline row actions max; checkboxes plus "select all" plus action bar for batch.
  - Animation duration (V): ~100 ms simple feedback; 200-300 ms modals/screen changes; general range 100-400 ms; avoid 500 ms+; enter slightly slower than exit (e.g. 300 in, 200-250 out); ease-out entering, ease-in exiting, avoid linear; honour reduce-motion.
  - Prototype fidelity (V): fidelity has three axes (interactivity, visuals, content), mix them; go low-fi when time is short, the design will change, you want candid negative reactions, or stakeholders must see it is unfinished (polish triggers premature "ship it"); go hi-fi to test workflows, components, hierarchy/legibility and realistic timing; pilot the prototype before sessions.
- Notable: the only source here with hard second-level loading thresholds; anchors the loading/empty/error/form/table rules.

## Laws of UX (lawsofux.com)
- Link: https://lawsofux.com/ (30 laws; pages /doherty-threshold/, /fittss-law/, /hicks-law/, /millers-law/)
- Made by: Jon Yablonski
- Licence: NOT verified; none shown in fetched content. Treat as all rights reserved; paraphrase and cite.
- Best rules:
  - Doherty: give feedback within ~400 ms (the older standard was 2 s); beyond that use animation/progress so it feels responsive (V).
  - Fitts: bigger and nearer targets are faster to hit; large tap targets on touch, gaps between neighbours, controls near current attention (V).
  - Hick: more or more complex choices slow decisions; split tasks into steps, highlight a recommended option, reveal features progressively, strip distractions from key screens, but do not oversimplify (V).
  - Miller: "7 plus or minus 2" is an average, not a design cap; the useful part is chunking (V).
  - Jakob: users expect your product to work like others they know; reuse conventions (V, summary).
  - Proximity, common region, similarity, uniform connectedness: group by spacing, shared container, matching style, or connecting lines (V, summary).
  - Peak-end: polish the success and error moments and the final step (V, summary).
  - Von Restorff: the one differing item stands out; reserve emphasis for the single primary action (V, summary).
  - Postel: accept input flexibly (formats, spacing), output strictly (V, summary).
- Notable: a good shared vocabulary for reviews; mostly qualitative, only Doherty has a number.

## Dashboards and charts: Datawrapper blog + Stephen Few
- Link: https://www.datawrapper.de/blog/chart-types-guide ; https://www.datawrapper.de/blog/colors ; Few: perceptualedge.com "Common Pitfalls in Dashboard Design" (original PDF unreadable via fetch; Few points below are from secondary summaries).
- Made by: Datawrapper GmbH; Stephen Few
- Licence: Datawrapper shows only "(c) 2026 Datawrapper GmbH", no reuse licence (V), so all rights reserved. Few: not verified; paraphrase only.
- Best rules:
  - Write the chart's one-sentence main statement first; it drives chart type, title and colour (V).
  - Defaults: line for change over time (small multiples if many series); bars for absolute comparison; columns for few time points; scatter for correlation; Sankey/alluvial for flows; choropleth for regions (V).
  - Pie/donut only for simple shares with few slices; use bars when values are close; grouped columns should not compare totals (V).
  - On small screens prefer horizontal bars over many-category columns (V).
  - Max ~7 categorical colours; beyond that group categories or change chart type; same category = same colour across charts (V).
  - Sequential: light = low, dark = high, built from lightness (no rainbow), must still read in greyscale; never use a gradient for unordered categories (V).
  - Diverging: two clearly different hues, light grey (not white) midpoint (V).
  - Grey for context, colour only for the key data; warm the grey slightly if it looks cold (V).
  - Contrast: 4:1 for small text, 2.5:1 for large text; thin lines and dots need stronger contrast than big areas; avoid red/green pairs; add a key for every encoded colour (V).
  - Few (S): glanceable one-screen dashboards but not at the cost of function; add context (target, prior period) to bare numbers; avoid excess colour and decoration; no more than ~2 alert indicators; do not split related data into separate small views.
- Notable: Datawrapper's colour rules are the most directly codable; Few's original text still needs re-verification.

## Motion and web performance: web.dev + Material
- Link: https://web.dev/articles/cls ; /optimize-cls ; /animations-guide ; /responsive-web-design-basics ; /rail ; Material https://m3.material.io/styles/motion/easing-and-duration (body came back as a stub, values not verified)
- Made by: Google Chrome / web.dev team; Material Design team
- Licence: web.dev is commonly stated as CC BY 4.0 (content) and Apache 2.0 (code samples), but this was NOT verified: fetched pages showed no licence line and /about only linked Google Terms. Material: not verified.
- Best rules:
  - CLS (V): good <= 0.1, poor > 0.25, measured at the 75th percentile, mobile and desktop separately.
  - Put width and height attributes on every img/video (with `height:auto; width:100%`), or use `aspect-ratio`, so space is reserved before load (V).
  - Reserve ad/embed/banner space with min-height sized to the smallest expected creative; keep the placeholder if nothing loads (V).
  - Late-loading forms and cookie notices get a placeholder/skeleton or an overlay outside document flow; skeleton shape must match final content (V).
  - Fonts: close fallback stack, tune `size-adjust` and ascent/descent/line-gap overrides, preload critical fonts, `font-display: optional` avoids shift (V).
  - Never insert content above existing content after load; for lists use a fixed container or a user-triggered "Load more" (V).
  - Animate `transform` and `opacity` only; top/left/width/height trigger layout. Use `will-change` sparingly. Respect `prefers-reduced-motion` (V).
  - RAIL budgets (V, older page): respond to input in <50 ms for a visible reaction in <100 ms; frame work <10 ms (16 ms budget at 60 fps); idle chunks <=50 ms; first load interactive <=5 s on mid-range mobile/slow 3G; later loads <2 s; ~10 s+ users abandon.
  - Responsive (V): `<meta name="viewport" content="width=device-width, initial-scale=1">`; never block zoom; relative units/flex/grid, not fixed px; breakpoints where the layout breaks, not per device; design small-screen first; line length ~70-80 characters; do not hide content just because the screen is small; use hover/pointer media queries for touch.
  - Material tokens (S, third-party reports): durations run ~50 ms (short1) to 1000 ms (extra-long4), long2 ~500 ms; emphasized-decelerate commonly cubic-bezier(0.05, 0.7, 0.1, 1.0). Use NN/g's 100-400 ms for ordinary UI.
- Notable: web.dev supplies the numbers (CLS, RAIL), NN/g the durations; Material's own page was unreadable.

## Prototyping and stakeholder approval: NN/g + GOV.UK
- Link: https://www.nngroup.com/articles/ux-prototype-hi-lo-fidelity/ ; https://www.gov.uk/service-manual/design/making-prototypes ; https://prototype-kit.service.gov.uk/docs/
- Made by: NN/g; Government Digital Service (GOV.UK)
- Licence: GOV.UK content under Open Government Licence v3.0, Crown copyright (V on both pages); reusable with attribution. NN/g all rights reserved.
- Best rules:
  - Start with quick sketches to explore and discuss ideas with colleagues; move to a coded prototype for user research, especially on mobile (V).
  - Make several prototypes quickly and discard those that test badly; keep prototyping in every phase (V).
  - Prototype code needs no production quality; never ship it or use it for live services (V).
  - Publish prototypes behind a password so nobody mistakes them for the real service (V).
  - Reuse design-system components and templates; aim for interactive, accessible and realistic (V).
  - Choose fidelity per question: rough for early stakeholder talks (avoids premature "ship it"), polished for hierarchy, legibility and timing checks (V).
  - Pilot the prototype first; wrong or broken screens distort feedback (V).
  - Process tips (my synthesis, not from a single source): build the primary journey screens first (home/landing, the core task, the success state), then empty and error states; show 2-3 materially different options side by side with a one-line rationale each; ask reviewers to react to a specific task, not "do you like it"; collect feedback in one numbered list so each item can be accepted or declined.
- Notable: no fetched public page prescribes the side-by-side options routine; that part is synthesis.

## Disagreements spotted
- Skeletons: NN/g limits them to full-page loads (spinner for single modules); many design systems use skeletons per card. web.dev recommends placeholders mainly for layout stability, not perceived speed.
- Loading thresholds: Doherty says feedback by ~400 ms; NN/g says nothing looping under ~1 s; RAIL says a visible reaction in 100 ms. Reconcile: instant pressed state under 100 ms, delay any spinner to ~400 ms-1 s.
- Duration: NN/g says avoid 500 ms+; Material's long tokens go 500-1000 ms (S), suitable only for rare, large transitions.
- Miller's 7: Laws of UX itself says do not design around 7, yet many guides cite it as a rule; use chunking.
- Grayscale-first: one secondary Refactoring UI summary recommends it, another says it hides hierarchy problems (S); neither verified from the book.
- Pie charts: Datawrapper allows them for simple shares; stricter guides discourage them.
- Single-screen dashboards: Few's classic rule vs commentary warning that rigid adherence puts form over function.
- Form validation: NN/g says validate after leaving a field, not while typing, yet live positive feedback (password strength, availability) is fine.
