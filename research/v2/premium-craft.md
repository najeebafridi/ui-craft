# Premium craft: what makes an interface look expensive (v2 research)

Method: public pages fetched with WebFetch only; rules paraphrased. Licence lines state what the page showed. "No licence stated" means none found on the fetched content, so treat as all rights reserved by default (do not copy text; ideas and short CSS values are fine). Items marked (unverified) are common practice or my own inference, not confirmed on a fetched page.

## Rauno Freiberg: Invisible Details of Interaction Design
Link: https://rauno.me/craft/interaction-design
Made by: Rauno Freiberg
Licence: no licence or copyright text on the page (footer has only icon links). The essay states no AI was used to write it. Treat as all rights reserved.
Best techniques:
- Match motion to frequency: skip or shrink animation on things used constantly (command menu, context menu, window switcher); keep richer motion for rare actions.
- Make animations interruptible: input mid-motion must retarget, never lock the user out.
- Feedback tracks the finger/pointer 1:1 during a gesture (apply the delta directly); animate only when a threshold is crossed.
- Preserve velocity and angle on release; avoid perfectly uniform timing. Lighter objects bounce less.
- Trigger destructive actions on gesture end, not mid-gesture; light overlays may trigger mid-gesture.
- Allow "peek without commit": show the result while dragging, let the user reverse before release.
- Spatial consistency: things should open from where they live and return there.
- Scroll the element under the pointer, not the focused one.
- Fitts's law: corners/edges are huge targets; keep radial/menu option distances constant.
- Add small physical "fidget" satisfaction deliberately, not by accident.
Notable: almost no numbers; value is the principles (frequency-based motion budget, interruptibility).

## Rauno Freiberg: Web Interface Guidelines
Link: https://interfaces.rauno.me (repo github.com/raunofreiberg/interfaces)
Made by: Rauno Freiberg, open to PRs
Licence: no licence on the site; the repo page showed no LICENSE file or licence in its sidebar. Treat as all rights reserved.
Best techniques:
- Text: `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility`; `-webkit-text-size-adjust: 100%`.
- Headings: medium weight 500-600, never below weight 400; keep weight identical on hover/selected so nothing shifts.
- Fluid headings with `clamp()` (example 48px to 72px tracking ~5vw).
- `font-variant-numeric: tabular-nums` for tables and timers.
- Inputs at 16px+ to stop iOS focus zoom.
- Focus rings via `box-shadow` (outline ignored radius in Safari < 16.4).
- Prefer radial gradients over blurred/scaled rectangles (banding); keep `filter`/`backdrop-filter` blur modest.
- Motion: interaction animations 200ms or less; dialogs enter from ~0.8 scale + fade, never 0; pressed buttons scale to ~0.9-0.96; pause off-screen loops; disable transitions while switching theme.
- Wrap hover styles in `@media (hover: hover)`; replace the iOS tap highlight, do not just remove it.
- Open dropdowns on `mousedown`; do not autofocus inputs on touch; arrow-key navigation in lists.
- Nested menus: "prediction cone" so diagonal pointer travel does not close the submenu.
Notable: dense checklist of invisible details; strongest source for codable defaults.

## Emil Kowalski: 7 practical animation tips
Link: https://emilkowal.ski/ui/7-practical-animation-tips
Made by: Emil Kowalski
Licence: no licence or copyright footer on the fetched content (ends with a promo for his paid course). Treat as all rights reserved.
Best techniques:
- Press feedback: `button:active { transform: scale(0.97) }`.
- Never enter from `scale(0)`; start at 0.9+ (his example 0.93) combined with opacity.
- Tooltips: base transition 125ms ease-out, opacity 0 and scale 0.97 at the ends; once one tooltip is open, neighbours open instantly (0ms).
- Use ease-out for enter and exit; built-in CSS curves are too weak, so write custom cubic-beziers. Same 300ms felt faster with ease-out than ease-in-out.
- Popovers should scale from the trigger (`transform-origin` set to the anchor), not centre.
- Keep UI animations under 300ms (a 180ms select felt better than 400ms); drop animation entirely for things done many times a day.
- When a crossfade looks rough, add ~2px `filter: blur()` during the swap to mask the seam.
Notable: practical, specific, easy to turn into tokens.

## Emil Kowalski: Great animations
Link: https://emilkowal.ski/ui/great-animations
Made by: Emil Kowalski
Licence: no licence stated on fetched content. Treat as all rights reserved.
Best techniques:
- Under 300ms; ease-out as default.
- Animate only `transform` and `opacity` (avoids layout and paint).
- CSS/WAAPI keep running smoothly when the main thread is busy; JS-driven animation janks.
- Use transitions (not keyframes) for anything the user can interrupt.
- Springs tuned by stiffness/damping/mass for gesture-driven motion.
- Reduced motion: replace movement with a ~0.2s fade rather than removing feedback.
- Slower plus `ease` can be right when the tone is elegant (Sonner toasts).
- No animation for keyboard-initiated actions.
- Review animations again after a day.
Notable: framework for deciding when animation helps vs hurts.

## Emil Kowalski: Building a toast component
Link: https://emilkowal.ski/ui/building-a-toast-component
Made by: Emil Kowalski
Licence: no licence stated on fetched content. Treat as all rights reserved.
Best techniques:
- Enter with `transform 400ms ease` from `translateY(100%)`; use transitions so rapid adds retarget smoothly.
- Stack depth: offset 14px per index, scale down 0.05 per index (1, 0.95, 0.9).
- In the collapsed stack, give all toasts the front toast's height so mismatched heights do not poke out.
- Swipe dismiss by distance threshold OR velocity (distance/time) above 0.11.
- Auto-dismiss 4s; pause timer on hover and when the tab is hidden.
- An `:after` pseudo-element fills the gaps so hover does not drop between toasts.
- Pointer capture during drag; add friction past the limit instead of a hard stop.
Notable: shows how premium feel comes from edge cases (hover gaps, velocity, pause on blur).

## Jakub Krehel: Details that make interfaces feel better
Link: https://jakub.kr/writing/details-that-make-interfaces-feel-better
Made by: Jakub Krehel
Licence: none stated on fetched content (page credits the original URL as source). Treat as all rights reserved.
Best techniques:
- `text-wrap: balance` on titles, `text-wrap: pretty` on paragraphs.
- Concentric radii: outer radius = inner radius + padding.
- Antialiased font smoothing set once at layout level (text looks thinner/crisper on macOS).
- `tabular-nums` so changing digits do not jiggle.
- Stagger enters: from `translateY(8px)`, `blur(8px)`, `opacity 0`; 800ms with `cubic-bezier(0.25,0.46,0.45,0.94)`, fill `both`; 100ms between sections, 80ms between split words.
- Exits subtler than enters: shift about -70% (not the full -100%) with opacity 0 and ~4px blur; spring duration 0.45, bounce 0.
- Icon swaps animate opacity, scale and blur together.
- Optical alignment: less padding on the icon side of a button; fix the SVG itself rather than adding margins.
- Replace borders with shadows: light mode = 1px ring at ~6% black plus two soft drops; dark mode = 1px ring at ~8% white; hover darkens to ~8% black / ~12% white, transition `box-shadow` only.
- Images: `outline: 1px solid` ~10% black (white in dark), `outline-offset: -1px`.
- CSS transitions for interactions, keyframes for one-off staged sequences.
Notable: the densest single list of codable details; the 3-layer ring shadow and image outline are directly reusable.

## Josh W. Comeau: Designing Beautiful Shadows in CSS
Link: https://www.joshwcomeau.com/css/designing-shadows/
Made by: Josh W. Comeau
Licence: footer reads "(c) 2018-present Joshua Comeau. All Rights Reserved." No open licence.
Best techniques:
- One light direction for the whole page; keep y-offset about 2x x-offset.
- Higher elevation = bigger offset, bigger blur, LOWER opacity.
- Layer shadows rather than one heavy one: single `0 6px 6px hsl(0 0% 0% / .3)` vs five layers at 0.075 alpha with offsets 1, 2, 4, 8, 16px.
- Tiers: small = one shadow `0.5px 1px 1px` at .7 alpha; medium = three at .333 alpha (offsets 1/2, 2/4, 3/6); large = five at .2 alpha doubling from 1/2 to 16/32px.
- Tint shadows to the background hue (same hue, lower lightness, a bit less saturation) e.g. bg `hsl(220 100% 80%)` -> shadow `hsl(220 60% 50%)`; never pure black.
- Store the shadow colour as a variable triplet: `hsl(var(--shadow-color) / .2)` so a bg change retints everything.
- `filter: drop-shadow()` follows alpha shape (tooltip arrows, transparent PNGs); chain three, ~0.3 alpha, blurs 3/6/12px.
- Cost: do not animate layered shadows; test on low-end devices.
Notable: best-quality recipe for elevation tokens.

## Tobias Ahlin: Smoother & sharper shadows with layered box-shadows
Link: https://tobiasahlin.com/blog/layered-smooth-box-shadows/
Made by: Tobias Ahlin Bjerrome
Licence: no licence or copyright text on page.
Best techniques:
- Baseline: five layers at 1, 2, 4, 8, 16px offset and blur, 12% black each.
- Fewer layers need more alpha (4 layers, 15%); more layers need less (6 layers up to 32px, 11%).
- Sharp: alpha falls with distance 25% to 5% (innermost darkest).
- Diffuse: alpha rises 8% to 20% (innermost lightest).
- Soft: six layers at 7%, blur roughly doubling (2 to 64px).
- Shorter shadow: blur grows faster than y-offset; longer shadow: y-offset grows faster than blur.
Notable: the knobs (layer count, alpha curve, blur:offset ratio) give a vocabulary for tuning.

## Josh W. Comeau: Make Beautiful Gradients
Link: https://www.joshwcomeau.com/css/make-beautiful-gradients/
Made by: Josh W. Comeau
Licence: same site, all rights reserved (footer verified on the shadows page only; assumed same).
Best techniques:
- `linear-gradient(to right in oklch, yellow, blue)` avoids the grey dead zone in the middle; put a plain sRGB gradient first as fallback.
- Or precompute midpoint stops (e.g. 13) in HSL/LAB/HCL and pass the list.
- HSL interpolation with fixed S/L walks the hue wheel; HCL tracks perception better.
- Ease the stop distribution for smoother ramps; the same list works in radial and conic gradients.
- Two close colours barely need it.
Notable: use for subtle same-hue surface lighting; avoid hue-spanning gradients (see tells).

## Anthony Hobday: Visual design rules you can safely follow every time
Link: https://anthonyhobday.com/sideprojects/saferules/
Made by: Anthony Hobday
Licence: no licence or copyright text found.
Best techniques (28 rules; the most useful):
- Near-black/near-white instead of pure; tint neutrals toward the accent (under ~5% HSB saturation).
- Large text: tighter letter-spacing and line-height; small text: looser.
- Container borders must contrast with BOTH container and page.
- Shadow blur = 2x its offset; closer objects get lighter shadows.
- Elements get lighter as they come closer, in light and dark mode.
- Container vs background brightness difference: within ~7% (light UI) or ~12% (dark UI).
- Outer padding >= inner padding.
- Button horizontal padding about 2x vertical.
- Nested radius: inner = outer minus gap.
- Avoid two hard dividers side by side (e.g. border next to a bg change).
- No shadows in dark UIs; use one depth technique per interface.
- Lower the contrast of icons that sit beside text.
- Complex background pairs with simple foreground and vice versa.
- Spacing from a scale (multiples of 8); at most two typefaces; ~70 character lines.
Notable: mildly contradicts others on dark-mode shadows (see Disagreements).

## Erik Kennedy: 7 Rules for Creating Gorgeous UI (Part 1)
Link: https://www.learnui.design/blog/7-rules-for-creating-gorgeous-ui-part-1.html
Made by: Erik Kennedy (Learn UI Design)
Licence: footer "(c)2026 Kennedy Design, Inc."; no licence granted.
Best techniques:
- Light comes from above: top edges lighter, undersides darker; inset (fields, pressed, tracks) vs outset (buttons, cards, popups) must read differently.
- Aim for a "flatty" middle: slight depth cues without full skeuomorphism.
- Design greyscale first, add colour last; one accent or one hue in several shades.
- Double the whitespace: gap between menu items roughly equals text height (12px items); ~15px title-to-underline; ~25px between lists.
Notable: rules 4-7 are in Part 2 (not read).

## Linear: How we redesigned the Linear UI
Link: https://linear.app/now/how-we-redesigned-the-linear-ui
Made by: Karri Saarinen and three others (28 Mar 2024)
Licence: none shown on fetched content; company blog, treat as all rights reserved.
Best techniques:
- Generate themes in LCH (perceptual) rather than HSL; same L looks equally bright across hues.
- Theme reduced to 3 inputs: base colour, accent colour, contrast (replacing 98 variables).
- Use the brand accent sparingly inside neutral calculations for a calmer, timeless chrome.
- Contrast is a variable: darker text/icons in light mode, lighter in dark mode.
- Reduce visual noise via denser, clearer navigation hierarchy; simplified headers/filters.
- Align icons and labels on both axes ("felt more than seen").
- Inter Display for headings, regular Inter for body.
Notable: shows systematic derivation of surfaces from few inputs = consistency = premium.

## Stripe: Designing accessible color systems
Link: https://stripe.com/blog/accessible-color-systems
Made by: Stripe design team
Licence: footer "(c) 2026 Stripe, LLC"; no licence for content.
Best techniques:
- Work in CIELAB so lightness is perceptually even.
- Each hue gets its own lightness curve so every step has equal contrast.
- Keep brand hue/saturation; only adjust lightness to hit contrast.
- Test text against white AND the lightest tint of each hue.
- Step rule: 5+ steps apart for small text, 4+ for icons/large text.
- Badges shift bg and text together one step to keep contrast.
Notable: build a visual tool; iterate on real components.

## Vercel Geist: Materials
Link: https://vercel.com/geist/materials
Made by: Vercel
Licence: none on page.
Best techniques:
- Radius by tier: base/small 6px, medium/large 12px, tooltip 6px, menu/modal 12px, fullscreen 16px.
- Floating elements get bigger radius as they lift (shadow values not on page).
Notable: tiny numeric system: a handful of radii tied to elevation.

## Benji Taylor: Family Values
Link: https://benji.org/family-values
Made by: Benji Taylor
Licence: none stated; footer has app link and acknowledgements.
Best techniques (qualitative, no numbers):
- Each step of a flow uses a differently sized sheet so users sense progress.
- Dark flows get dark sheets (context theming).
- Directional tab motion; button labels morph keeping shared letters.
- Persistent elements stay and move rather than duplicate across steps.
- Delight scaled inversely to frequency: rare screens get more.
- Number input with shifting thousands separator; shimmer on hidden balances.
Notable: philosophy of "delight budget".

## Synthesis: the 25 highest-impact premium techniques
1. Layered shadows: 3-5 layers, offsets doubling (1,2,4,8,16px), blur = offset, 8-12% alpha each; never one hard shadow.
2. Tint shadows to surface hue: `hsl(var(--shadow-color)/.1)`, same hue, lower lightness; no pure black.
3. Ring-shadow instead of border: `0 0 0 1px rgb(0 0 0/.06)` plus soft drops; dark mode ring `rgb(255 255 255/.08)`.
4. Near-black / near-white text and surfaces tinted <5% saturation toward accent (e.g. #111827 not #000).
5. Concentric radii: inner = outer - padding (or outer = inner + padding); one radius family, 6px control / 12px panel / 16px overlay.
6. Press scale `:active{transform:scale(.97)}`, 100-150ms; never below 0.9.
7. Enter animations: opacity + translateY(8px) + optional blur(4-8px), ease-out custom curve, 200-300ms; never from scale(0), start >= 0.9.
8. Only animate transform/opacity/colour/box-shadow; never `transition: all`; list properties explicitly.
9. Skip animation for high-frequency actions (menus, keyboard shortcuts); animate out only if at all.
10. Interruptible motion: CSS transitions for interactions, keyframes only for one-offs.
11. `text-wrap: balance` on headings, `pretty` on paragraphs.
12. `tabular-nums` on every changing/aligned number; keep weight constant on hover/select.
13. Large text tighter (display: letter-spacing about -0.02em, line-height 1.1), small text looser (12px: +0.02 to +0.05em) (values partly unverified; direction is from Hobday).
14. Antialiased smoothing + `text-rendering: optimizeLegibility` at root.
15. 1px image outline at 10% black/white, `outline-offset:-1px`, fixed aspect-ratio.
16. Optical alignment: less padding on icon side (e.g. 12px icon side vs 16px text side); button horizontal padding about 2x vertical.
17. Borders contrast with both container and page; avoid two hard dividers adjacent; prefer spacing/tint to lines.
18. Surfaces lighter as they rise (both modes); container vs bg lightness gap <= 7% light, <= 12% dark.
19. Dark mode: depth from lighter surfaces plus 1px white-alpha (8%) ring, not shadows.
20. Generate palettes in a perceptual space (OKLCH/LCH/LAB); interpolate gradients `in oklch` to avoid grey middles.
21. Inner top highlight on raised buttons/cards: `inset 0 1px 0 rgb(255 255 255/.1)` (unverified; consistent with "light from above").
22. Popovers/tooltips scale from the trigger origin; tooltips 125ms; adjacent tooltips open instantly after the first.
23. Wrap hover in `@media (hover:hover)`; focus ring as 2px accent box-shadow with offset, visible for keyboard only.
24. Disable transitions during theme switch; pause looping animations off-screen; respect reduced motion with 0.2s fade.
25. Restraint: one accent, one depth technique, one radius family, 4-6 sizes; every extra effect needs a job.

Also worth coding (unverified, common practice): `scrollbar-width:thin; scrollbar-color`, `::selection` in accent at ~25% alpha, `caret-color: var(--accent)`, `scroll-padding-top`, sticky header `backdrop-filter: blur(8px)` with 80% bg alpha and a hairline bottom border appearing only after scroll.

## Disagreements spotted
- Shadows in dark mode: Hobday says avoid shadows in dark UIs; Krehel keeps shadow layers plus a white ring in dark mode. Resolution: use ring plus lighter surfaces; soft shadows only for overlays.
- Press scale: Rauno suggests 0.9-0.96, Emil 0.97. Take 0.96-0.97 for buttons; deeper for large icons.
- Animation length: Rauno <=200ms, Emil <300ms, Krehel uses 800ms for staged page enters, Toast uses 400ms. Rule: 100-200 interaction, 200-300 overlays, up to ~800 only for one-off page reveals.
- Blur in motion: Emil/Krehel use 2-8px blur to hide seams; Rauno warns large filter blurs are slow. Keep blur at or under 8px and short-lived.
- Eased gradients/colour space: Comeau recommends HSL/HCL tricks, Linear/Stripe argue LCH/LAB for systems; both agree HSL alone is perceptually uneven.
- Borders vs shadows: Hobday wants strong borders contrasting both sides; Krehel replaces borders with 6%-alpha rings. Resolution: ring for decorative cards, strong 3:1 border for form inputs (matches project rule).
