# UI review: Account settings page, 2026-11-16

**Overall: 69/100 (C)** · Measured 73 · Design 67
Screens: Settings (desktop 1440, phone 390). Both screenshots rendered in dark mode (the page follows `prefers-color-scheme`); light mode was not captured. File: `evals/iteration-2/settings-form/without_skill/outputs/index.html` (not modified).

## Scores

| Area | Score | Evidence |
|---|---|---|
| First impression & trust | 7/10 | Clean, deliberate, one accent and one radius family. Slightly "default SaaS template" (indigo accent, cards). |
| Hierarchy & focus | 7/10 | Section titles are clear. But three solid indigo buttons plus a disabled "Save changes" that reads as washed out; no single obvious primary. |
| Layout & spacing | 7/10 | Shared left edges, steady 24px card gaps, good width (~680px). Spacing off-grid in places (18px field gap, 14px/20px padding): only 57% on the 4px grid. |
| Typography | 7/10 | One system font, small sizes. Sizes off scale: 13px and 22px, plus 12.5px hints. Fine line length. |
| Colour | 6/10 | Neutral-heavy with one accent, good. But white on the dark-mode accent (#8183f4) is 3.24:1 (fails), input borders (~1.3:1) and the off-switch track barely show against the card. |
| Components & states | 6/10 | Hover, focus ring, disabled, loading text ("Saving…") designed. Focus is `outline:none` plus a 25%-alpha ring, weak. The "Show" toggle and nav links are small. Switch off state is low contrast. |
| Content & copy | 8/10 | Plain, specific labels ("Update password", "Save changes"), helpful hints, real sample data. Small gap: the Profile and Password buttons use "Cancel" without saying what is reset. |
| Feedback states | 7/10 | Inline errors with aria, password strength meter, toast, "Saved" status, autosave note. Errors are text-only (no icon); no error summary. |
| Responsive & touch | 6/10 | Phone layout works with no sideways scroll, and nav becomes tabs. Controls stay 30-38px (below 44px); the nav tabs and "Show" buttons are small. |
| Distinct, not generic | 6/10 | Tidy but generic; nothing memorable, though no AI-template excesses (no gradients, emoji or glow). |

**Design total: 67/100**

Measured (73/100): contrast 16/20 · tap targets 0/15 · responsive 15/15 · focus 10/10 · text size 10/10 · type consistency 4/5 · form labels 5/5 · spacing system 0.9/5 · page structure 5/5 · motion 2/5 · content 5/5.
Overall = 0.4 x 73 + 0.6 x 67 = 69.4, rounded to 69 (C).

## Top fixes (biggest win first)

1. **Grow tap targets on touch** (High, S, +15 measured). 23 targets are under 44px on the phone (nav links, "Show" buttons, "Upload photo", inputs, Save/Cancel, switches); 7 are under 24px on desktop. Add:
   `@media (max-width:640px),(pointer:coarse){ .btn, input, select, nav a, .pw button { min-height:44px } input,select{font-size:16px} .switch{width:48px;height:28px} }` and give the "Show" button a 44px hit area (`height:36px; padding:0 12px`, and `padding-right:72px` on the input). Also set `nav a{padding:10px 12px}` so the phone tab bar is 44px tall.
2. **Fix text contrast in dark mode** (High, S, +4). White on `--accent:#8183f4` is 3.24:1 ("Update password", "AM"). Use a darker fill in dark mode for solid buttons, e.g. `--accent:#5b5bd6` for fills and keep `#8183f4` only for rings or links, or make button text `#0f1115`. Also the disabled-looking "Save changes" (opacity .5) is fine technically but reads as broken on dark; use a flat grey fill instead.
3. **Strengthen input and switch borders** (High, S). `--border` (#2a2f3a dark, #e4e7ec light) is about 1.3:1 against the surface. Add `--border-strong` (light `#8a94a6`, dark `#667085`) and use it on `input, select`, `.btn` outlines and the switch off track (before: `background:var(--border)` → after: `background:var(--border-strong)`).
4. **Make one clear primary per card and stronger focus** (Medium, S). The disabled-until-dirty "Save changes" is correct, but the 3 indigo buttons in view compete. Keep them (each card is a separate form) but demote "Upload photo" to a text/outline style and keep "Cancel" outline. Replace the focus ring with `:focus-visible{outline:2px solid var(--accent);outline-offset:2px}` (before: 3px ring at .25 alpha, outline none).
5. **Snap spacing and type to the scales** (Medium, S, +4.1 and +1). Change `.field{margin-bottom:18px}` → 16px or 24px, `.foot` padding 14px → 12px/16px, nav link padding `7px 10px` → `8px 12px`, `.head` padding 20px → 24px; font-sizes 13px → 12px or 14px, 12.5px → 12px, 22px (avatar) → 20px or 24px. Put the values in CSS variables.
6. **Add reduced-motion rule and stop `transition:.15s` on all properties** (Low, S, +3). Add `@media (prefers-reduced-motion:reduce){*{transition:none!important}}` and list properties (`background-color, transform`) instead of the shorthand default.
7. **Add icons to inline errors and an error summary** (Medium, M). Errors are text-only red; add a small icon, and for the password form an error summary at the top when more than one field fails.

## Later
- Capture and audit light mode (default for most users); contrast there is likely better.
- Nav highlight shows "Password" when the page loads at top in the screenshot; check the IntersectionObserver initial state so "Profile" is active at load.
- The Cancel button on Profile should say what it does, or be shown only when the form is dirty.
- Notifications have no "saved" state besides a toast, and the toast holds the only confirmation (autosave): show a short inline "Saved" beside the heading too.
- Add a Danger zone (delete account) only if the product needs it; none present now.

## What is already good
- Semantic structure and labelling: every input has a visible `<label>`, switches have `aria-label`, one `h1`, landmark `nav`, no skipped heading levels (page structure 5/5, form labels 5/5).
- Solid responsive behaviour: no sideways scroll at 390px, nav turns into a scrollable tab row (responsive 15/15).
- Careful form behaviour: Save disabled until changed, inline validation with focus moved to the first error, show/hide password, strength meter, `autocomplete` attributes.

## Expected result
Fixes 1-3 plus 5-6 should lift measured to about 95-100 (tap targets +15, contrast +4, spacing +4, motion +3) and design by about 5 (colour 6→8, components 6→7, responsive 6→8), so overall about 88-90 (B/A).
