# Review mode: score an existing product and suggest improvements

Load this when the user asks to review, audit, score, rate, critique or improve an **existing** product, website, app or screen ("How good is our UI?", "Score my dashboard", "What should we fix first?").

The goal is a clear score the user can track over time, plus a short list of fixes, ranked so the biggest wins come first. Be honest and specific: "the Save button is grey on grey (2.1:1)" helps, "improve contrast" does not.

## 1. Collect the screens

- **Quick review:** 3–5 key screens. If none are named, pick: the main screen (dashboard, home or main list), the core task screen, one form, and the phone view of the main screen.
- **Whole-app review:** every screen. Follow section 8, so usage stays low.
- Accepted inputs: live URLs (`https://…`), a local dev server (`http://localhost:3000/…`), HTML files, or screenshots.
- Pages behind a login: ask the user for a URL that works without login (a staging or demo account they open themselves), exported HTML, or screenshots. Never ask for their password.

## 2. Measure (automatic part, 0–100)

If Node 22+ and Chrome are available, run:

```bash
node <skill-dir>/scripts/ui-audit.mjs https://app.example.com/dashboard https://app.example.com/settings --out ui-review --json ui-review/measured.json
```

This gives each page a **measured score** out of 100 over 11 areas: contrast, tap targets, responsive layout, keyboard focus, text size, type consistency, form labels, spacing system, page structure, motion and content. Each problem comes with a ready fix, ordered by points gained. It also saves desktop and phone screenshots. It checks the light theme by default; if the product has a dark mode, run it again with `--dark` and review both.

With only screenshots (no running page), skip this step and say so in the report. The overall score then uses the design score alone.

## 3. Look and score the design (judgement part, 0–100)

Open every screenshot, desktop and phone. Score each of the 10 areas below from 0 to 10, and write one line of evidence for each: what you see, where. Use the anchors so scores stay consistent between reviews:

- **0–3, broken:** hard to use or clearly amateur.
- **4–6, works but generic:** inconsistent or cluttered.
- **7–8, professional:** a paying client would accept it.
- **9–10, best in class:** calm, precise, memorable, with nothing to remove.

| # | Area | What a 9–10 looks like | What pulls the score down |
|---|---|---|---|
| 1 | First impression & trust | Looks deliberate and current; one consistent style | Dated look, mixed styles, default framework look, broken images |
| 2 | Hierarchy & focus | The main task and one primary button are obvious within 3 seconds | Everything the same weight; several solid buttons fighting; no clear title |
| 3 | Layout & spacing | Shared edges, steady rhythm, generous but not empty space | Ragged alignment, cramped padding, random gaps, cards inside cards |
| 4 | Typography | Few sizes, clear scale, comfortable line length | Many sizes, tiny grey text, long lines, ALL CAPS everywhere |
| 5 | Colour | Mostly neutral, one accent used with intent, status colours with meaning | Rainbow UI, low-contrast "elegant" grey, gradients as filler, colour as the only signal |
| 6 | Components & states | Same button, input and table style everywhere; hover, focus and disabled designed | Three button styles, unstyled inputs, no focus ring, odd one-off widgets |
| 7 | Content & copy | Plain specific labels, real data formats, same name for the same thing | "Submit", jargon, lorem ipsum, mixed names, unformatted numbers |
| 8 | Feedback states | Loading, empty, error and success all designed and helpful | Blank panels, "Error 500", spinners everywhere, no empty state |
| 9 | Responsive & touch | Phone layout rethought; 44px targets; primary action reachable | Desktop squeezed onto a phone, tiny targets, sideways scroll, missing navigation |
| 10 | Distinct, not generic | Has one memorable element; no AI-template look | Purple gradients, identical card grids, KPI tiles without context, emoji icons |

**Design score** = the sum of the 10 areas (out of 100).

To check feedback states (area 8) when you have the code, search it for empty, loading and error handling. If you only have screenshots, score what you can see and mark the area "not visible".

## 4. Overall score

**Overall = 40% measured + 60% design**, rounded. Design counts more because it is what users and clients notice first. The measured part keeps the review honest about accessibility and basics.

Grades: **A** 90+, **B** 80–89, **C** 65–79, **D** 50–64, **F** under 50.

Always show all three numbers (measured, design, overall), so the user sees why the overall score is what it is.

## 5. Choose the fixes

Collect problems from both parts. For each one, note:

- **Impact:** High (blocks or confuses users, fails accessibility, looks broken), Medium (looks unprofessional, slows people down) or Low (polish).
- **Effort:** S (under 30 minutes, CSS or copy only), M (a few hours, one component), L (a redesign of a screen or flow).

Order: High impact with S effort first, then High with M, then Medium with S, and so on. Show the **top 5–7** in full. Put the rest in a short "later" list. Group the same problem across pages into one fix ("focus ring missing on all 4 pages").

Every fix must be concrete. Give the place, the problem, the change, and a small before/after when it is code or copy:

> **Make the primary action stand out** (High, S). On /invoices there are three solid blue buttons. Keep "New invoice" solid, make "Export" outline, and make "Filters" a text button. → `.btn-export { background: transparent; border: 1px solid var(--border-strong); color: var(--text); }`

## 6. Report template

Write the report in the chat, or as `ui-review.md` in the project if the user wants a file. Keep it short.

```markdown
# UI review: <product>, <date>

**Overall: 71/100 (C)** · Measured 82 · Design 64
Screens: Dashboard, Invoice list, Invoice form, Dashboard (phone)

## Scores
| Area | Score | Evidence |
|---|---|---|
| First impression & trust | 6/10 | Clean, but looks like a default template; logo and colours do not match |
| … | … | … |
Measured: contrast 14/20 (6 grey labels at 3.9:1) · targets 9/15 (phone filters 32px) · …

## Top fixes (biggest win first)
1. **<title>** (High, S): <where>. <what is wrong>. <the change, with before → after>.
2. …

## Later
- …

## What is already good
- <2–3 specific strengths, so they are kept>

## Expected result
Doing fixes 1–5 should raise the overall score to about <n>.
```

Estimate "expected result" from the points each fix recovers: measured points from the audit, design points from your rubric.

## 7. Fix and re-score (if the user wants)

1. Apply the fixes in order, smallest effort first within the same impact.
2. Re-run `ui-audit.mjs` on the same pages, and re-score the design areas you touched.
3. Show before → after for each score: "Overall 71 → 86 (C → B). Contrast 14 → 20, Hierarchy 5 → 8."
4. Save the JSON from each run (e.g. `ui-review/measured-2026-11-16.json`), so progress can be tracked over time.

## 8. Whole-app review (all screens, without wasting usage)

Use this when the user wants every screen checked, not just the key ones. The trick: let the script do the measuring, never score the same layout twice, and give the repetitive looking to a cheaper model.

1. **List every screen.** Find the routes in the code (router config, `pages/` or `app/` folders, navigation menus), a sitemap, or by following the app's links. Include the important states: an empty list, a form with errors, a modal or dialog, the phone view. Show the list to the user first, with a count.
2. **Measure all of them in one run.** The script costs no AI usage per page:
   ```bash
   node <skill-dir>/scripts/ui-audit.mjs <url-1> <url-2> ... <url-n> --out ui-review --json ui-review/measured.json
   ```
   It ends with a one-line-per-page summary, worst first, and an average. Pages that need sample data: use the app's seed or demo data.
3. **Group screens by layout.** Pages built from the same template (every "detail" page, every "settings" tab) share their design problems. Put them in groups such as "list pages (6)", "detail pages (14)", "forms (5)".
4. **Design-score one representative per group**, plus any page whose measured score is much worse than its group. Look at the others only quickly: do they break the group's pattern?
5. **Use the right model for each job,** if your tool can run helper agents or subagents (Claude Code can):
   - Per-group design scoring from screenshots: a mid-size, cheaper model (for example Sonnet) at normal effort. Give it this file's rubric and the group's screenshots. Ask for scores, evidence and fixes only.
   - Listing routes and running the script: the cheapest model (for example Haiku) or the main session itself. It is simple work.
   - The final report, overall score and fix ranking: the main model, at normal or high effort. This is where judgement matters.
   - Without helper agents, do it all in one session, but still score one screen per group, not every page.
6. **Report for the whole app.** Same template as section 6, plus:
   - **App score** = the average overall score of the groups, weighted by how many screens each group has.
   - A table of every group (or every screen, if there are few): measured, design and overall score, and the top issue. Worst first.
   - Fixes that apply across the app come first ("the focus ring is missing everywhere: fix once in the shared CSS"), because one change raises many pages.

Rough cost guide: 30 screens in 6 groups means 30 script runs (almost free), 6 cheaper-model scoring passes, and one main-model report. That is far cheaper than 30 full reviews, and the report is easier to act on.

## Common mistakes

- Generous scores to be polite. A 7 means "a paying client would accept it". Use the anchors.
- Vague fixes ("improve spacing"). Name the element, the value now and the value to use.
- Fixing taste before basics. Contrast, targets, overflow and focus come first: they are cheap and they affect real users.
- Reviewing only the desktop. Always score the phone view.
- Forgetting what is good. List the strengths too, so a redesign does not throw them away.
