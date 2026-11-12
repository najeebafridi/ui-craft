# Test results

**Short version:** with ui-craft, the AI's screens passed 97% of the measurable checks, against 57% without it. A blind judge preferred the ui-craft version on all 5 screens.

## How we tested

- **5 realistic requests**, each built twice by the same AI model (Claude Sonnet): once with the skill, once without.
  1. A dashboard for a small online candle shop
  2. Account settings for a project management app
  3. A phone booking screen for a barbershop
  4. A landing page for an AI meeting-notes tool
  5. 2–3 design options of a CRM contacts list, for a client to choose from
- **Measured automatically** in headless Chrome at desktop (1440px) and phone (390px) width: text contrast, smallest text, number of font sizes, focus styles, tap-target size, sideways scrolling, form labels, spacing grid, reduced motion, emoji and lorem ipsum. Each screen type also got 1–2 checks of its own. Tools: `evals/tools/check.mjs` and `grade.py`.
- **Judged blind.** A separate AI "senior designer" saw only screenshots labelled X and Y, without knowing which was which. It scored each on 5 points out of 10: professional look, hierarchy, polish, phone version, and "would a client approve it".
- **The test cases** live in `skills/ui-craft/evals/`, in the format `claude plugin eval` reads.

## Results

| | Round 1 (first draft) | Round 2 (after fixes) |
|---|---|---|
| Checks passed, with skill | 88% | **97%** |
| Checks passed, without skill | 56% | 57% |
| Blind judge: screens won by the skill version | 3 of 5 | **5 of 5** |
| Blind judge: average score, with / without skill | 32 / 31 (of 50) | **41 / 28** (of 50) |
| Time per screen, with / without skill | 109s / 46s | 181s / 46s |
| Tokens per screen, with / without skill | 98k / 68k | 107k / 68k |

The "without skill" screens are the same files in both rounds. Their judge score moved a little (31 → 28) only because the judge is not perfectly consistent. Read the trend, not the exact numbers.

**What the skill fixed most often** (common in the screens built without it):

- no keyboard focus styles at all (4 of 5 cases)
- text contrast below WCAG AA
- 11px text
- random spacing (only 27–57% on the 4px grid)
- navigation that disappears on phones
- emoji used as icons
- invented testimonials

**The cost:** the skill makes the AI read rules and check its own work. In round 2 that meant about 2–3× the time and 1.5× the tokens per screen. Most of the extra time is the self-check step, which is also what caught the bugs.

## What round 1 taught us, and what we changed

| Problem seen in round 1 | Change to the skill |
|---|---|
| Dense apps kept 32–36px buttons on phones | Rule plus a ready CSS snippet: controls grow to 44px on touch screens, even in compact apps |
| The skill's own text said labels may be 11px | Fixed: 12px minimum everywhere |
| Landing page used 9 font sizes, some off-scale | Clear limit: 4–6 per app screen, up to 7 on marketing pages, all from the scale |
| A mobile screen was 536px wide on a 390px phone | Rule: nothing wider than the screen; chip rows scroll inside their box; `min-width: 0` on flex and grid children |
| Pinned bottom bars covered content | Rule: pad the content by the bar's height |
| **The AI never looked at its own result** | **New `scripts/ui-audit.mjs`**: measures the page and saves screenshots. In round 2, 3 of 5 runs used it to catch and fix real bugs (sideways scroll, wrapping) |
| Mockup feedback toolbar covered the design | Toolbar starts collapsed as one small button |

After round 2 we added two more small lessons:

- A table that scrolls sideways on a phone looks broken, so prefer cards.
- Client mockups should show the main interaction with a choice already made.

## Limits of this test

- One run per screen per version, with one judge model. Results can vary from run to run.
- The judge is an AI, not a human designer. It agreed with the measured checks but missed some things a person would notice.
- Only HTML screens were tested. Native mobile and desktop apps follow the same rules, but were not tested here.

Full data: `evals/iteration-1/` and `evals/iteration-2/` (outputs, screenshots, `grading.json`, `benchmark.md`, `blind_judgement.json`). To browse them, open `review.html` in each folder.
