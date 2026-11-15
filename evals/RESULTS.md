# Test results

## Version 2 (premium upgrade): is it better than version 1?

**Short version:** yes. On the final builds, two independent blind judges preferred the version 2 screen in **13 of 14 verdicts** (7 screens x 2 judges). Average score 47 out of 60 for version 2 against 40 for version 1.

### How we tested

- **7 requests**, each built by the same AI model (Claude Sonnet) twice: once with ui-craft 1.2 and once with ui-craft 2.0. The five from the first test (shop dashboard, settings form, barbershop booking on a phone, SaaS landing page, CRM design options) plus two new ones aimed at the upgrade: a **luxury hotel room-selection screen** and a **Mac writing app**.
- **Two blind judges** (two different AI models), each with its own random X/Y labels, scored screenshots on six points out of 10: premium look, hierarchy, craft, fit to the audience with a distinct character, phone quality, and "would a paying client approve it".
- **Measured checks** as before (contrast, tap targets, overflow and so on), plus a new check for craft problems.

### Results

| | Version 1.2 | Version 2.0 |
|---|---|---|
| Judge verdicts won (final builds, 14 in total) | 1 | **13** |
| Average judge score (out of 60) | 40.1 | **47.1** |
| Fit to audience, distinct character (out of 10, round 3) | 6.4 | **8.1** |
| Premium look (out of 10, round 3) | 6.6 | **7.7** |
| Phone quality (out of 10, final builds) | 6.8 | **7.5** |
| Measured checks passed (round 3) | 93% | **100%** |
| Tokens per screen (round 3 average) | 108k | 126k |

Both judges agreed with each other on every screen in round 3.

**What version 2 did differently**, in the judges' words: the candle shop got a warm brand character instead of a generic dashboard; the hotel screen was restrained and honest where version 1 added "Only 2 left" scarcity badges (both judges flagged those as manipulative); the landing page had a distinct identity instead of "a stock teal SaaS template"; the three CRM options were really different directions; the Mac app looked native.

### What round 3 taught us, and what we changed

Version 2 first lost two screens (settings and mobile booking) and scored lower on phones. Causes and fixes:

| Problem | Change to the skill |
|---|---|
| The booking screen opened empty: time slots hidden until a barber was picked, a "£0" total | New rule "Show it working": the first view is the screen in use, with sensible defaults selected and the main interaction visible |
| The Save button appeared only after an edit | A form's main action is visible from the start |
| Phone views got less care than desktop | The finishing pass now says: judge the phone screenshot as strictly as the desktop one |
| A stretched card left a dead empty block; a floating pill covered text | Rules: no dead space; nothing floating covers content |
| Crude drawings stood in for photos on the luxury screen | Use a quiet tonal block with a caption until real photos exist |
| The audit script hung on pages that open a dialog | Script now dismisses dialogs, times out stuck steps and always exits |

After the fixes we re-ran the two lost screens and the narrowest win. Version 2 won 5 of those 6 verdicts. The one loss was a consistency bug ("Any barber" selected while the summary named a barber), which became one more rule: the screen must tell one story.

### Limits

- One build per screen per version, and AI judges, not human designers. Judges vary; trust the direction more than the exact numbers.
- All tests are HTML screens. The platform guidance for native iOS, Android, Mac and Windows apps was written from the platforms' public guidelines and was not tested with native code.
- Version 2 costs about 17% more tokens per screen than version 1.

Data: `evals/iteration-3/` and `evals/iteration-4/` (outputs, `grading.json`, `blind-*_judgement.json`, `review.html`).

---

## Version 1: with the skill against without it
**Short version (version 1):** with ui-craft, the AI's screens passed 97% of the measurable checks, against 57% without it. A blind judge preferred the ui-craft version on all 5 screens.

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
