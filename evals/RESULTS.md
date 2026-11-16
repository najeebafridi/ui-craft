# Test results

## Immersive-web skill (version 2.2): with the skill against without it

**Short version:** two independent blind judges preferred the page built with the immersive-web skill in **6 of 6 verdicts** in the first round (3 briefs x 2 judges). Average score 54.8 out of 70 with the skill, against 42.0 without. The skill's pages passed all of the measured checks; the pages built without it failed 8 of 30. The gain was in robustness, content, phone quality and craft. **First-impression impact was a tie**, and that changed the skill.

### How we tested

- **3 briefs**, each built twice by the same AI model (Claude Sonnet): once with the plugin's skills (immersive-web, which hands layout, type and colour to ui-craft) and once with no skill at all.
  1. **Kettle launch story.** A launch page for a hand-thrown ceramic kettle: "immersive and cinematic", customers mostly on phones, no 3D model or photos.
  2. **Observatory, themed.** A home page for public stargazing nights with a WebGL hero. Both builds received the same `theme.css` and `DESIGN.md` exported from the Studio (Stage dark, a custom accent, immersion level 2), to test whether the scene follows the theme.
  3. **Print-farm desktop app** (not a website). The main window of an Electron app that monitors six 3D printers. The owner wants "a sci-fi game cockpit with some cinematic 3D" for a wall monitor; operators use it all day. This tests the mixing guidance.
- **Measured automatically** with `skills/immersive-web/scripts/immersive-check.mjs`: each page is opened five ways (desktop, phone, reduced motion, no WebGL, no JavaScript) and scored on content without scripts, the no-WebGL fallback, stillness under reduced motion, script before first paint, page weight, phone pixel ratio, sideways scroll, native scrolling, pausing off screen, ambient motion coming to rest, and surviving a lost graphics context. The no-JavaScript test is skipped for the app window.
- **Judged blind** by two AI judges (Claude Sonnet and the stronger Claude Opus), each with its own random X/Y labels. They saw nine screenshots per page (desktop top, middle and end; phone top, middle and end; reduced motion; no WebGL; no JavaScript) plus the script's measurements, and scored seven points out of 10: impact, scene craft, content, phone, robustness, fit to the audience and platform, and "would a paying client approve it". Tool: `evals/tools/immersive-blind.mjs`.

### Results, round 1

| | With the skill | Without |
|---|---|---|
| Judge verdicts won (6 in total) | **6** | 0 |
| Average judge score (out of 70) | **54.8** | 42.0 |
| Measured checks passed | **30 of 30** | 22 of 30 |
| Measured score, average (out of 100) | **100** | 67 |
| Robustness (out of 10) | **8.3** | 4.5 |
| Content (out of 10) | **8.7** | 6.7 |
| Phone quality (out of 10) | **7.5** | 5.8 |
| Scene craft (out of 10) | **7.2** | 5.8 |
| Fit to audience and platform (out of 10) | **8.3** | 6.7 |
| Client would approve (out of 10) | **7.7** | 5.2 |
| Impact, first impression (out of 10) | 7.2 | 7.3 |
| Time per page | 11 min | 3 min |
| Tokens per page | 181k | 92k |

Per brief (with / without, out of 70): kettle 52 / 42 and 51 / 36; observatory 59 / 49 and 59 / 49; desktop app 56 / 40 and 52 / 36. The two judges agreed on every winner.

**What the pages built without the skill got wrong** (from the measurements):

- Kettle: with JavaScript off, only 109 of 829 characters of content were visible. With no WebGL the script crashed and left one screen. Under reduced motion the scene kept drawing 60 frames a second, and it never came to rest.
- Desktop app: with no WebGL the script crashed and the printer grid was blank. Reduced motion was ignored. Its "live part" was a spinning knot shape labelled as the real part being printed, which one judge called misleading.
- Observatory: this was the strongest page built without the skill, because the Studio's design brief already states the rules in plain words. It still drew for ever and had no handler for a lost graphics context.

**What the judges liked in the skill's pages:** a kettle with throwing rings and a real glaze picker, with the price and the buy button in the first view; a night sky with a forest edge and a chart of moon brightness that explains which nights are dark, in the theme's own colours; a desktop tool where a 3D floor view shows real data (column height is print progress) and a failure banner comes first. No judge found copied or manipulative design in any page.

### What round 1 taught us, and what we changed

| Problem the judges saw in the skill's pages | Change to the skill |
|---|---|
| **Impact was a tie.** The pages built without the skill were often more dramatic (a spotlit plinth, steam, a close-up of the pour; glowing cockpit panels). The skill had made the AI careful, not bold | Rule 4 is now "one signature moment, and make it count": restraint limits the number of effects, not their strength. The moment must be an event (the kettle pours), not an object on a turntable. New advice on staging and contrast of light |
| Mid-scroll, the kettle slid behind a heading and paragraph, and nav links sat on bright stars | New hard rule: words and scene never share a place. Plan a text lane for every beat; navigation over a scene gets a scrim. The check script now lists text that sits straight on the scene |
| On phones the pinned scene sat above a large empty band, with the text far below | The scroll-story pattern now starts the text right under the pinned scene, and the finishing step says to open the phone's middle screenshot |
| Fallbacks were a lesser idea: a plain green tile for the kettle, an empty grid for the printer floor | "A fallback is the same picture, quieter." The check script got `--poster`, which saves the scene itself as an image to use as the fallback. A data scene must fall back to the same data drawn flat |
| The desktop app was too restrained for an owner who asked for a cockpit, and its cards ran below the window | New guidance: a work tool that is also a showpiece gets two modes (a calm desk mode, a display mode with the full character); the genre must show at a glance; an app's main view fits its window |
| The check script counted a ticking clock and live data as "motion", and could not see content hidden until scroll | It now counts only elements that keep changing place, walks the page so scroll-revealed content is counted, and has `--app` for app windows |

### Round 2: did the changes work?

We rebuilt the two briefs with the most problems (the kettle page and the desktop app) with the changed skill, and both judges compared them, blind again, with the same pages built without the skill. For the desktop app the judges also saw each build's wall-display mode.

| On these two briefs | Round 1, with skill | Round 2, with skill | Without (round 1 / round 2 scores) |
|---|---|---|---|
| Judge verdicts won | 4 of 4 | **4 of 4** | 0 |
| Average judge score (out of 70) | 52.8 | **55.0** | 38.5 / 31.0 |
| Impact, first impression (out of 10) | 6.5 | **7.5** | 7.5 / 5.8 |
| Scene craft (out of 10) | 6.8 | **7.3** | 5.8 / 4.0 |
| Measured score (out of 100) | 100 | 100 | 55 |

The pages built without the skill are the same files in both rounds. Their scores fell in round 2 because judges score each page against the one beside it. So trust the direction, not the size: **impact went from behind (6.5 against 7.5) to ahead (7.5 against 5.8).**

What changed on screen: the kettle now tips and pours a thin stream into a cup (an event, not a turntable), the text has its own lane, and the no-WebGL fallback is a picture of the same kettle made with `--poster`, one per beat. The desktop app now has a dense desk mode that fits its window and a display mode with six 3D print bays, parts growing in them, and a tangle of failed filament on the printer that stopped. One judge called it "a real cockpit".

**Still weak after round 2** (written into the guides, not re-tested): on the phone the kettle page's first screen did not show the price and buy path; in display mode the 3D row left dead bands and cut off one bay. And the judges still describe the kettle as a tidy render that "reads more like a teapot": an AI building a model from code is no substitute for a 3D artist or a real photograph.

### The cost

With the skill a page took about 11 minutes and 181k tokens in round 1 (14 minutes and 213k in round 2), against 3 minutes and 92k without. That is about 2x the tokens and 4x the time. Most of the extra goes on reading the guides, building the fallbacks and running the check script, which is also what produced the robustness gap.

### Limits of this test

- One build per brief per round, and AI judges, not human designers. Scores move between rounds; trust the direction.
- Judges saw screenshots, not motion. Timing, easing and how the scroll feels were not judged by anyone.
- Frame rate was not measured. Headless Chrome draws 3D in software, so nothing here says how these pages run on a real phone.
- All builds were single HTML files. A React Three Fiber project, a real Blender model with the compression pipeline, and native app shaders were not tested. The desktop app ran as a web page, not inside Electron.
- "Without the skill" means no plugin at all. We did not test ui-craft alone against ui-craft plus immersive-web, so part of the gain in content and phone quality belongs to ui-craft.
- The same model wrote the skill's check script and built the pages that pass it. The blind judges are the independent part.

Data: `evals/iteration-5/` (round 1) and `evals/iteration-6/` (round 2): outputs, `immersive.json`, `blind-*_judgement.json`, `blind-*_key.json`, `timing.json`. To re-run: build pages into `evals/iteration-N/<case>/<config>/outputs/index.html`, then `node evals/tools/immersive-blind.mjs evals/iteration-N`.

---

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
