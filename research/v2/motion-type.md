# Research v2: motion craft and typography craft

Method: public pages only. Pages I fetched this session are marked (verified). Anything from memory, or from a search snippet because the page text did not load, is marked (unverified). All rules are paraphrased. Spring stop lists in Tables were computed by me from the damped-spring formula (unit mass, stiffness = w^2, damping = 2*zeta*w), so they are mine, not a vendor's.

# Part A: Motion

## Emil Kowalski, "You don't need UI animations"
Link: https://emilkowal.ski/ui/you-dont-need-animations
Made by: Emil Kowalski. Licence: all rights reserved (article); read only.
Rules:
- Ask how often a person will see the thing before animating it. Seen many times a day: animate little or not at all (verified).
- Keep UI animation under about 300ms; a 180ms dropdown feels more responsive than a 400ms one (verified).
- Speed beats polish. Fast motion keeps the UI attached to the finger or key press (verified).
- Do not animate keyboard-triggered actions that may repeat hundreds of times a day (verified).
- Rare surfaces (onboarding, first success) may be playful; frequent ones may not (verified).
- Tooltips: delay the first open slightly, but once one is open, neighbours open instantly with no animation (verified).
- Every animation needs a reason: explain, confirm a press, soften an entrance, keep spatial continuity (verified).
- Longer motion is acceptable only on marketing pages (verified).
Notable: the article gives no easing values. His other posts (origin-aware popovers via transform-origin, strong ease-out for entering, clip-path reveals, Sonner toast stacking, Vaul drawer drag/velocity) are (unverified) here; treat the origin-aware and ease-out advice below as common practice, not a quote.

## NN/g, "Executing UX animations: duration and motion"
Link: https://www.nngroup.com/articles/animation-duration/
Made by: Nielsen Norman Group. Licence: all rights reserved.
Rules:
- Small feedback (checkbox, toggle): about 100ms (verified).
- Big screen changes (modal sliding in): about 200-300ms (verified).
- Most UI motion sits in 100-400ms, scaled to complexity and distance (verified).
- 400ms is for large travel across large screens only; 500ms+ starts to drag (verified).
- Enter slightly slower than exit, e.g. popup in about 300ms, out 200-250ms (verified).
- Choose the shortest duration that is not jarring; motion is more often too long than too short (verified).
- Article does not separate mobile/desktop or give element-size tables (verified); the size table below is my synthesis.
Notable: the only baseline numbers source here; everything else is converging practice.

## Material 3 motion (easing and duration tokens, Expressive springs)
Link: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
Made by: Google. Licence: docs CC BY 4.0 (unverified).
Rules (page text did not load; values are from memory plus a search that did not quote Google, all (unverified)):
- Duration tokens run short1 50ms to short4 200ms, medium1 250 to medium4 400, long1 450 to long4 600, extra-long 700 to 1000.
- Easing set: standard (0.2,0,0,1), standard-decelerate (0,0,0,1), standard-accelerate (0.3,0,1,1), emphasized-decelerate (0.05,0.7,0.1,1), emphasized-accelerate (0.3,0,0.8,0.15), legacy (0.4,0,0.2,1).
- Expressive (2025) swaps tweens for springs in two families: spatial (position, size, layout; may overshoot) and effects (opacity, colour; never overshoot).
- Reported spring tokens (unverified): spatial fast 1400/0.9, default 700/0.9, slow 300/0.9; effects fast 3800/1, default 1600/1, slow 800/1 (stiffness / damping ratio).
- Rule of thumb: spatial moves get springs with slight bounce; fades and colour changes get critically damped springs.
- Use the fast/default/slow variants by element size: small controls fast, sheets and full-screen slow.
Notable: the clean spatial-versus-effects split is the most reusable idea; it prevents bouncing opacity.

## Motion (motion.dev) spring docs
Link: https://motion.dev/docs/react-transitions
Made by: Motion team (Matt Perry). Licence: MIT library (unverified); docs all rights reserved.
Rules:
- Defaults: stiffness 1, damping 10, mass 1 for the physics form (verified).
- Duration form: `visualDuration` (seconds) plus `bounce` is easier to reason about; bounce default 0.25, range -1 to 1 (verified).
- bounce 0 is critically damped; negative is overdamped; 1 is extremely bouncy (verified).
- visualDuration marks when the motion looks done; most overshoot happens after it (verified).
- Setting stiffness, damping or mass overrides duration/bounce (verified).
- Interrupted springs inherit velocity, which is why springs suit gestures (verified).
- For layout animations mass can be "auto", derived from element size (verified).
Notable: Motion's default bounce 0.25 is too bouncy for productivity UI; use 0 to 0.15 there.

## Apple: Designing Fluid Interfaces (WWDC 2018) and SwiftUI springs
Link: https://developer.apple.com/videos/play/wwdc2018/803/ (not fetched)
Made by: Apple. Licence: all rights reserved.
Rules (all (unverified), from memory):
- Respond instantly; start motion on touch down, not after the gesture is classified.
- Motion is redirectable and interruptible; never lock the user out until an animation ends.
- Use springs described by duration and bounce, not stiffness/damping, for design talk.
- Hand off finger velocity into the spring so a flick continues smoothly.
- Rubber-band at edges rather than hard stops.
- SwiftUI presets: `.smooth` bounce 0, `.snappy` about 0.15, `.bouncy` about 0.3, default duration about 0.5s.
- Prefer low or zero bounce for everyday UI; bounce signals playfulness or a physical throw.
Notable: "fluid" mostly means interruptibility and velocity continuity, not decoration.

## CSS: linear(), View Transitions, scroll-driven, @starting-style, interpolate-size
Link: https://developer.chrome.com/docs/css-ui/css-linear-easing-function ; MDN pages (not fetched)
Made by: Chrome team / MDN. Licence: CC BY 4.0 / CC BY-SA (unverified).
Rules:
- `linear()` takes stops from 0 to 1, evenly spaced, optionally with positions; stops above 1 give overshoot (verified).
- Support: Chrome/Edge 113, Firefox 112, Safari 17.2 (verified).
- Generate stops with a tool rather than by hand; more stops means smoother (verified).
- `@starting-style` gives the entry state for elements appearing from `display:none`; pair with `transition-behavior: allow-discrete` for exits (unverified).
- `interpolate-size: allow-keywords` on :root lets height animate to/from `auto` (unverified, Chromium-first).
- View Transitions: `document.startViewTransition()`; default is a 250ms cross-fade, tune with `::view-transition-old/new(root)` and `view-transition-name` for shared elements (unverified).
- Scroll-driven: `animation-timeline: scroll()` / `view()`; wrap in `@supports` (unverified).
Notable: guard all of these with feature queries; fall back to instant state change.

## The 12 principles applied to UI; Val Head; Rachel Nabors
Link: (not fetched) Val Head "Designing Interface Animation"; Rachel Nabors "Atomic Design"-adjacent animation talks
Made by: various. Licence: all rights reserved.
Rules (unverified, from memory):
- The useful principles for UI are timing, easing (slow in, slow out), anticipation (tiny pre-move before big action), follow-through (overshoot on settle) and staging (one focal motion at a time).
- Skip squash/stretch, exaggeration and arcs in business UI.
- Motion tells where something came from and went (continuity), what changed, and what to look at.
- Stagger gently so the eye reads order, but keep total sequence short.
Notable: pick the principle that serves the message; decoration is not a principle.

## Haptics: Apple HIG and Android guidance
Link: https://developer.apple.com/design/human-interface-guidelines/playing-haptics ; https://developer.android.com/develop/ui/views/haptics/haptics-principles
Made by: Apple, Google. Licence: all rights reserved / CC BY 4.0 (Android docs, unverified).
Rules (Apple page did not load; summary from memory, so (unverified)):
- Three Apple families: impact (collisions, snaps), notification (success/warning/error of a user action), selection (stepping through discrete values).
- Pair with a visual cue; never the only signal; users can disable.
- Fire on the moment of change, with short latency (prepare the engine early).
- Use rarely; a haptic on every tap is noise.
- Android: use predefined effects (CLICK, TICK, HEAVY_CLICK, DOUBLE_CLICK) first; custom waveforms only when needed; confirm, reject, and long-press have distinct feels.
Notable: web has only `navigator.vibrate`, which Safari iOS lacks; treat web haptics as nice-to-have.

# Part B: Typography

## Butterick's Practical Typography
Link: https://practicaltypography.com/summary-of-key-rules.html
Made by: Matthew Butterick. Licence: all rights reserved; read only.
Rules (verified unless noted):
- Body size on the web: 15-25px.
- Line spacing: 120-145% of the font size.
- Line length: 45-90 characters including spaces; 66 is the classic ideal (unverified).
- All caps only for less than one line; add 5-12% letterspacing to caps and small caps.
- Keep kerning on.
- Hierarchy page not covered in my fetch; his view is few levels, distinguish with size/weight/space, not underline plus bold plus caps together (unverified).
- Avoid centred long text, justified text without hyphenation, and bold plus italic stacking (unverified).
Notable: his web numbers are larger than app-UI norms; apply them to reading pages, not dense tools.

## Inter (rsms.me/inter)
Link: https://rsms.me/inter/
Made by: Rasmus Andersson. Licence: SIL OFL 1.1 (verified from page link).
Rules:
- Inter 4 is a variable font with optical size (opsz): text design at small sizes, display design at large (verified).
- Useful features: `tnum` tabular figures, `cv11` single-storey a, `ss01` open digits, `case` for caps context, `calt` on by default (all verified).
- Also commonly used: `zero` slashed zero for code/IDs, `ss03` round quotes/commas (unverified), `cv05` lowercase l with tail (unverified).
- Page did not give tracking formula in the part I read. Inter's dynamic-metrics idea: tighter tracking as size grows; formula roughly -0.0223 + 0.185*e^(-0.1745*size) em (unverified, from the Figma plugin docs).
- With the opsz axis available, use `font-optical-sizing: auto` and skip manual tracking.
Notable: static Inter (no opsz) needs manual negative tracking at display sizes.

## Apple SF tracking by size, Geist, Google Fonts Knowledge
Link: https://developer.apple.com/fonts/ ; https://vercel.com/font ; https://fonts.google.com/knowledge
Made by: Apple, Vercel, Google. Licence: SF is Apple-platform-only (not for web or non-Apple use); Geist is SIL OFL 1.1 (unverified, matches Google Fonts listing).
Rules (all (unverified)):
- SF text tracking is positive at 11-12pt and shrinks to negative around 20pt+; the sign flip is why small UI text feels airy and big headings feel tight.
- Do not ship SF on the web; use it only via `-apple-system` on Apple devices.
- Geist suits dev/product UIs; Geist Mono pairs with it.
- Variable fonts: one file, many weights; fewer requests and smoother weight transitions.
- Google's pairing advice: contrast in structure (serif and sans) but share proportions; one family with weights is safest.
Notable: SF's published tracking table is the source for the tracking table below, but I reproduced values from memory.

## Utopia (fluid type) and modular scales
Link: https://utopia.fyi/blog/designing-with-fluid-type-scales/ ; https://type-scale.com
Made by: James Gilyead and Trys Mudford; type-scale.com by Jeremy Church. Licence: all rights reserved / site tool.
Rules:
- Define one scale for a small viewport and one for a large; browser interpolates between them (verified).
- Example anchors 320px and 1500px with ratios 1.2 and 1.333 (verified).
- Implement with `clamp(min, preferred, max)` where preferred is `rem + vw`; keep the vw part small so 200% zoom still scales (zoom safety (unverified)).
- Ratios: 1.125 (dense apps), 1.2, 1.25 (default), 1.333, 1.5 (editorial) (unverified).
- App UI rarely needs fluid type; marketing headings do.
Notable: fluid size for display and h1/h2 only; keep body and controls fixed.

## Web font performance (web.dev)
Link: https://web.dev/articles/css-size-adjust
Made by: Google Chrome team. Licence: CC BY 4.0 (unverified).
Rules:
- `size-adjust` scales the fallback so its glyphs match the web font width (verified).
- `ascent-override`, `descent-override`, `line-gap-override` align vertical metrics; Chromium 87+, Firefox 89+ (verified).
- List several adjusted local fallbacks (Arial then Arimo) because one may be missing (verified).
- `font-display: swap` for body, `optional` for non-critical or display faces (unverified).
- Preload only the one or two critical WOFF2 files, with `crossorigin` (unverified).
- Self-host WOFF2 variable fonts; subset to Latin if licence allows (unverified).
Notable: Next.js `next/font` and Fontsource generate fallback metrics automatically.

## Font pairing and categories (Typewolf, Google Fonts Knowledge)
Link: https://www.typewolf.com ; https://fonts.google.com/knowledge/choosing_type/pairing_typefaces
Made by: Typewolf; Google. Licence: all rights reserved / CC BY 4.0 (unverified).
Rules (unverified):
- Max two families per product; three only if one is mono.
- Pair on contrast (serif head, sans body) or on one superfamily.
- Match x-height and width of the pair, or the lines look mismatched.
- Do not pair two lookalike sans faces.
- Let a distinctive face carry headings only; body stays neutral.
Notable: the Pairings table is my synthesis of recurring, popular combinations, not a copied list.

# Tables

## Table 1: duration and easing by element and distance (my synthesis from NN/g and Material; mostly unverified numbers)
| Element / change | Enter | Exit | Easing |
|---|---|---|---|
| Hover, press, colour, toggle | 100-150ms | 100ms | ease-out |
| Checkbox, switch knob | 120-160ms | 120ms | spring (no bounce) or ease-out |
| Tooltip, small popover (under 200px) | 125-175ms | 100ms | ease-out; origin-aware scale 0.96 to 1 plus fade |
| Dropdown, menu (200-400px) | 150-200ms | 120-150ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Toast | 250-300ms | 180-200ms | enter ease-out, exit ease-in |
| Modal, dialog (centre) | 200-250ms | 150-200ms | scale 0.96 to 1 plus fade, ease-out |
| Side panel, drawer, sheet (large travel) | 300-350ms | 200-250ms | `cubic-bezier(0.32, 0.72, 0, 1)` (iOS-like) (unverified) or spring |
| Page / route change | 200-300ms | 150-200ms | fade plus 8-16px shift, or view transition |
| Large hero reveal, marketing | 400-600ms | n/a | `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo-like) |
| Accordion height | 200-300ms | 200ms | ease-out, use `interpolate-size` or grid-rows 0fr to 1fr |
Defaults: entering uses ease-out `cubic-bezier(0.23, 1, 0.32, 1)` (strong ease-out, mine); exiting uses ease-in `cubic-bezier(0.4, 0, 1, 1)`. Avoid built-in `ease-in-out` for UI; it starts slowly and feels laggy. Scale duration roughly with distance: add about 30-50ms per extra 100px beyond the first 100px, capped at 400ms.
Other recipes: stagger 30-50ms per item, cap total at about 300ms and 6-8 items; press feedback `scale(0.97)` at 100ms; focus ring appears instantly (0ms) or 100ms; number change 300-500ms ease-out with `tabular-nums`; list add: height plus fade 200ms; remove: fade 150ms then collapse 200ms; reorder: layout animation with spring (visualDuration 0.3, bounce 0); shared-element: 300ms with the emphasized curve; loading choreography: no spinner before 300ms, skeleton shimmer 1.5s loop, minimum display 500ms.

## Table 2: spring recipes (unit mass, computed by me; settle to 0.2% in the time shown)
| Recipe | Stiffness / damping | Motion `visualDuration`, `bounce` | SwiftUI feel | CSS cubic-bezier approximation | Settle |
|---|---|---|---|---|---|
| Smooth (critically damped) | 144 / 24 | 0.4, 0 | `.smooth` | `cubic-bezier(0.2, 0.9, 0.3, 1)` | 0.52s |
| Snappy (slight overshoot, zeta 0.8) | 196 / 22.4 | 0.35, 0.15 | `.snappy` | `cubic-bezier(0.25, 1, 0.3, 1.04)` | 0.55s |
| Bouncy (zeta 0.5) | 144 / 12 | 0.5, 0.35 | `.bouncy` | none matches; use `linear()` | 1.04s |
CSS `linear()` stops (sample at even spacing; set `transition-duration` to the settle time):
- Smooth: `linear(0, 0.058, 0.183, 0.325, 0.46, 0.578, 0.676, 0.755, 0.816, 0.864, 0.9, 0.926, 0.946, 0.961, 0.972, 0.98, 1)` over 520ms.
- Snappy: `linear(0, 0.074, 0.234, 0.415, 0.584, 0.723, 0.83, 0.906, 0.956, 0.988, 1.005, 1.013, 1.015, 1.014, 1.012, 1.009, 1.007, 1.004, 1)` over 550ms.
- Bouncy: `linear(0, 0.154, 0.472, 0.79, 1.019, 1.137, 1.162, 1.13, 1.077, 1.027, 0.992, 0.976, 0.974, 0.98, 0.989, 0.997, 1.002, 1.004, 1.004, 1.003, 1)` over 1040ms.
Use for transform only; do not run overshooting values through opacity or colour.

## Table 3: letter-spacing and line-height by size (my table; derived from Inter dynamic-metrics idea and SF behaviour, (unverified) as exact numbers)
| Size px | Tracking (em) | Line height | Notes |
|---|---|---|---|
| 11-12 | +0.01 to +0.02 | 16/1.4-1.5 | all-caps labels +0.05 to +0.08 |
| 13-14 | 0 to +0.005 | 20/1.45-1.5 | dense UI text |
| 16 | 0 | 24/1.5 | body |
| 18 | -0.005 | 28/1.5 | lead text |
| 20 | -0.01 | 28/1.4 | |
| 24 | -0.015 | 32/1.3 | |
| 30 | -0.02 | 36/1.25 | |
| 36 | -0.025 | 40/1.2 | |
| 48 | -0.03 | 52/1.1-1.15 | |
| 60 | -0.035 | 64/1.05-1.1 | |
| 72+ | -0.04 | 1.0-1.05 | display only |
Weights: 400 body, 500 labels/buttons, 600 headings; 700+ for big display only. Sets with optical-size axis need less tightening.

## Table 4: pairings (heading / body; mood; fit) (my curation, popularity from Typewolf-style lists, unverified)
| # | Heading / body | Mood | Product type |
|---|---|---|---|
| 1 | Inter / Inter (+ JetBrains Mono) | neutral, precise | SaaS, dev tools |
| 2 | Geist / Geist + Geist Mono | modern technical | developer platforms |
| 3 | Instrument Serif / Inter | editorial, confident | startup marketing, newsletter |
| 4 | Fraunces / Source Sans 3 | warm, characterful | wellness, food, craft |
| 5 | Newsreader / Inter | literary, calm | publishing, reading apps |
| 6 | Bricolage Grotesque / DM Sans | quirky, creative | agencies, creator tools |
| 7 | Space Grotesk / IBM Plex Sans | techy, slightly retro | crypto-adjacent, data |
| 8 | Plus Jakarta Sans / Plus Jakarta Sans | friendly, polished | fintech, consumer SaaS |
| 9 | Playfair Display / Source Sans 3 | classic, luxe | hospitality, fashion |
| 10 | IBM Plex Serif / IBM Plex Sans | institutional, trustworthy | enterprise, gov, legal |
| 11 | Manrope / Inter | geometric, clean | dashboards, B2B |
| 12 | Sora / Figtree | futuristic, light | AI, web3 landing |
| 13 | Cormorant Garamond / Hanken Grotesk | refined, airy | beauty, galleries |
| 14 | Atkinson Hyperlegible Next / same | highly readable | accessibility-first, public sector |

## Table 5: typeface categories and personality (my synthesis)
| Category | Personality | Use | Examples |
|---|---|---|---|
| Neo-grotesque / grotesque | neutral, businesslike | UI, body | Inter, Hanken, Public Sans |
| Geometric sans | modern, friendly, clean | headings, brands | Outfit, Sora, Manrope, Plus Jakarta |
| Humanist sans | warm, readable | long text, healthcare | Source Sans 3, Atkinson, Lexend, Figtree |
| Old-style serif | bookish, trusted | editorial | Newsreader, Source Serif 4, EB Garamond |
| Transitional / Didone | sharp, fashion, luxe | big headings only | Playfair Display |
| Slab | sturdy, retro | signage, accents | Roboto Slab (not tabled below) |
| Mono | technical, honest | code, data | JetBrains Mono, Geist Mono, Plex Mono |
| Rounded | soft, playful | kids, consumer | Nunito |
| Display grotesque | distinct, loud | hero text | Bricolage Grotesque, Clash Display |

## Table 6: font licences
Google Fonts entries: all are distributed under SIL OFL 1.1 unless noted; (unverified) per family beyond Inter, since only the Inter licence link was confirmed this session. OFL allows commercial use, self-hosting and embedding; font files may not be sold on their own. Apache or Ubuntu licence exceptions do not apply to this list as far as I recall.
| Font | Licence | Source |
|---|---|---|
| Inter | OFL 1.1 (verified) | rsms.me, Google Fonts |
| Geist, Geist Mono | OFL 1.1 | Vercel, Google Fonts |
| IBM Plex Sans/Serif/Mono | OFL 1.1 | IBM, Google Fonts |
| Manrope, DM Sans, Instrument Sans, Instrument Serif | OFL 1.1 | Google Fonts |
| Fraunces, Newsreader, Source Serif 4, Source Sans 3 | OFL 1.1 | Google Fonts |
| Bricolage Grotesque, Space Grotesk, Plus Jakarta Sans | OFL 1.1 | Google Fonts |
| Figtree, Onest, Hanken Grotesk, Schibsted Grotesk, Public Sans | OFL 1.1 | Google Fonts |
| Atkinson Hyperlegible (Next) | OFL 1.1 | Braille Institute, Google Fonts |
| Lexend, Nunito, Outfit, Sora, Red Hat Display | OFL 1.1 | Google Fonts |
| Playfair Display, Cormorant Garamond, EB Garamond, Libre Caslon | OFL 1.1 | Google Fonts |
| JetBrains Mono | OFL 1.1 | JetBrains, Google Fonts |
| Satoshi, General Sans, Cabinet Grotesk, Clash Display | ITF Free Font License, not OFL | Fontshare |
ITF Free Font License, as best I could confirm (official text not retrieved, secondary sources only, so (unverified)): free for personal and commercial use; web use via self-hosted WOFF2 or Fontshare CSS API appears allowed; you may not redistribute the font files, serve them as a font service, or modify the font software; point others to fontshare.com. Some Fontshare families are OFL instead, so read the licence file in each download. Re-check before relying on it.

## Table 7: system font stacks
| OS / use | Stack |
|---|---|
| Cross-platform sans | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| Apple only | `-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif` |
| Windows | `"Segoe UI Variable Text", "Segoe UI", sans-serif` |
| Android / ChromeOS | `Roboto, "Noto Sans", sans-serif` |
| Mono | `ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace` |
| Serif | `ui-serif, "Iowan Old Style", "Palatino Linotype", Georgia, serif` |
Add `emoji` fallbacks only if emoji appear. Always append an adjusted local fallback for each web font (size-adjust) to limit layout shift.

## Table 8: haptic mapping (unverified; synthesised from Apple/Android categories)
| Event | iOS | Android | Notes |
|---|---|---|---|
| Toggle, stepper, picker tick | selection | TICK | one per detent |
| Button press (primary) | impact light | CLICK | optional |
| Snap / drop / sheet settles | impact medium or rigid | CLICK | on landing |
| Heavy confirm (delete armed) | impact heavy | HEAVY_CLICK | rare |
| Success | notification success | CONFIRM | after async finish |
| Warning | notification warning | REJECT-like | |
| Error | notification error | REJECT | pair with shake/message |
| Long-press recognised | impact medium | LONG_PRESS | on trigger |
| Scroll, hover, typing | none | none | never |

## Never animate
Layout properties that cause reflow (width, height, top, margin) except via transform/grid tricks; `transition: all`; focus rings; keyboard-repeated actions; error text appearing under the finger where it delays reading; anything above 400ms in everyday UI; more than one hero motion per page; parallax text; infinite loops over 5s without a pause.

## Reduced-motion strategy
Honour `prefers-reduced-motion: reduce`: keep fades and colour changes (about 100ms); remove translation, scale, parallax, autoplay, bounce and spring overshoot; turn view transitions into a cross-fade or nothing; stop looping shimmer. Provide a toggle on web apps if the OS cannot be trusted (unverified). Replace motion cues with static ones (highlight, outline) so state changes stay visible.

## Common typographic tells of cheap UI
Too many sizes and weights; default tracking at 48px+; centred paragraphs; line length over 90 characters; body below 14px; grey-on-white below 4.5:1; all-caps buttons without letterspacing; faux bold/italic; tabular data without `tnum`; mixed quote styles (straight vs curly) and hyphens for dashes; orphaned single words in headings (use `text-wrap: balance`); fonts loaded without fallback metrics causing jumps; icon fonts as text; emoji as bullets.

# Disagreements spotted
- Tween vs spring: Emil and NN/g advise short eased tweens (under 300ms); Apple, Material Expressive and Motion push springs for spatial motion. Resolution used: ease-out for small feedback, spring for drag, layout and sheets.
- Duration ceiling: NN/g allows up to 400ms for big travel; Emil wants under 300ms; Material long tokens go to 600+ (unverified). Use 300 as default, 400 as hard cap for app UI.
- Default bounce: Motion defaults to 0.25; Apple presets treat 0 as normal and 0.15-0.3 as playful. Use 0-0.15 for productivity.
- Line length: Butterick 45-90 characters; this project's AGENTS.md says 65-75. Both fit; 66 is the sweet spot.
- Body size: Butterick 15-25px web; app norm 14-16px. Reading pages 18-20; dense tools 14.
- Tracking: static Inter needs manual negative tracking; the opsz Inter and SF embed it. Apply the tracking table only to fonts without optical size.
- Fontshare is "free for commercial use" but not OFL; some sources imply otherwise. Treat per-font licence files as final.
- Not retrieved: Material 3 token page, Apple HIG pages, WWDC 2018 and Fontshare licence text failed to load as full text; numbers in those areas are from memory.
