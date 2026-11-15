# Psychology and emotion: designing for how people feel and decide

Load this when you plan a product or flow, write the "user and feeling" line of the brief, design onboarding, checkout, pricing, errors or anything sensitive, or when a screen works but feels cold, stressful or untrustworthy.

People do not experience a screen as a list of features. They feel something in the first instant, they succeed or struggle while using it, and they remember how it ended. Design for all three. Use psychology to remove effort and build trust, never to trick.

## 1. Three levels, three jobs

| Level | When | What decides it | Your job |
|---|---|---|---|
| **Gut** | the first second | look: order, clarity, quality | make the first view clean, aligned, on-brand, fast |
| **Use** | during the task | ease, control, feedback | fewest steps, clear state, forgiving errors |
| **Memory** | afterwards | the best or worst moment, and the end | fix the worst moment, finish strongly, be worth retelling |

A beautiful first view cannot rescue a broken task, and a working task with an ugly first view never gets tried. Positive mood makes people more tolerant of small problems; stress narrows attention, so stressful steps need fewer choices and less decoration.

## 2. The first impression

- People rate how a page looks within about **50 milliseconds**, and that rating barely changes with more time (Lindgaard 2006).
- Screens that are **visually simple** and **look like a good example of their category** make the best first impressions (Tuch 2012). So: familiar structure, low clutter, and distinctiveness in the details, not in the layout.
- Look is the first credibility filter: in a large study, nearly half of all comments about a site's credibility were about its visual design (Fogg 2003). Clutter, misalignment, typos and broken images read as "careless with my money or data".
- Things that are easy to read and process feel more pleasant and more true. Clear type, strong contrast, symmetry and consistent patterns earn this. Do not use it to make a false claim feel true.
- The halo fades: on later visits, reliability and speed matter more than looks.

## 3. Design for the user's state of mind

Name the state in the brief, then apply the response.

| State | Typical moments | Do | Avoid |
|---|---|---|---|
| **Anxious** | money, health, legal, anything irreversible | say what happens next; summary before commit; Back and "save and finish later"; "you can change this later"; calm colour; visible human help | timers, alarm red, dense legal text, surprise steps |
| **Rushed** | mobile, mid-task, repeat visits | fewest steps; prefilled fields; large targets; remembered details; shortcuts | tours, modals, upsell screens |
| **Sceptical** | new brand, big claim, first payment | evidence beside each claim; real names and photos; full price early; easy refund and cancel | superlatives, countdowns, fake counters |
| **Bored, browsing** | discovery, low stakes | light exploration, progress toward goals they chose, small playful touches | endless feeds, streak guilt |
| **Excited** | just signed up, bought, succeeded | one clear next step; a short celebration; an easy way to share (their choice) | interrupting to ask for ratings or email |
| **Embarrassed or grieving** | debt, illness, loss, a failed payment, their own mistake | neutral tone; ask the minimum; allow skip and delete; private by default | jokes, confetti, cheerful stock photos, shaming copy, "On this day" reminders |
| **Expert in flow** | a tool used daily | density, shortcuts, command palette, undo instead of confirmation, a layout that never moves | hand-holding, blocking animation, redesigns without notice |

## 4. Trust, built on purpose

Trust grows slowly from consistent, honest behaviour and breaks at once on a hidden fee or a trick.

- A named organisation, a real address and a way to reach a human. Real people on the About page, not stock.
- The **full price** (tax, delivery, fees) before the final step. Cancellation and returns in plain words where the decision is made.
- Reviews with a source and a date, including mixed ones. Only security or payment badges you actually hold.
- Dates on content; who wrote or checked it.
- No typos, dead links or placeholder text. Fast, stable loading. A back button that works.
- Honest, specific confirmations: "Refund of $24.00 sent to Visa ending 4242".
- Cancel, export and delete as easy to find as sign up.
- No pop-up on arrival. Ads labelled as ads.
- Accessibility is a trust signal: a keyboard flow that fails reads as carelessness.

## 5. Mental effort

- **Working memory holds about four chunks.** Break long numbers, forms and processes into small groups and steps. ("Seven plus or minus two" is outdated, and was never a rule for menus.)
- **Recognition beats recall.** Show options, recent items and examples instead of asking people to remember. Labels beside icons.
- **Defaults are powerful** (among the best-replicated findings). Set each default to what is best for most users and easy to change, so the screen works from the first second (today's date, the next free slot, "any available"). Never pre-tick something that costs money or gives away data.
- **Progressive disclosure.** Show the basics; reveal advanced options on request. Never bury price, terms or opt-outs this way.
- **Bigger and closer is faster to hit** (Fitts). Primary actions large and near the thumb or pointer. Never make "accept" large and "decline" tiny.
- **One thing stands out only if one thing is different.** One highlighted plan, one primary button.
- **Fewer, grouped choices** help people who are new or unsure; experts want search and filters. (The claim that many options always reduce action did not hold up; it depends on how hard the choice is.)
- People **group by closeness first.** Spacing carries structure better than borders.
- First and last items in a list are remembered best: put key navigation at the ends.

## 6. Motivation, used honestly

Each of these works. Each has a line that must not be crossed.

| Finding | Use it like this | Never |
|---|---|---|
| Effort rises as a goal gets close (goal gradient) | show real progress: "Step 2 of 5", "Profile 70% complete" | invent goals the user did not choose |
| A head start increases completion (endowed progress) | "Account created: 2 of 5 done" when those steps truly are done | fake completed steps |
| People remember the peak and the end | make the last step the best one; fix the single worst moment first | drag out pain to stage a relief |
| People value what they helped make | templates to edit, real customisation, a setup that reflects them | sunk-cost traps that block leaving |
| People follow visible norms (social proof) | real counts, real reviews, "most teams choose Standard" if true | invented numbers or activity |
| Seeing the work raises its perceived value | show real steps: "Checking 3 carriers…" | fake progress or fake "scanning" |
| The first number seen anchors judgement | list the fuller plan first; show a "was" price only if it was really charged | fake reference prices |
| Real limits focus decisions | true stock or a true deadline, stated plainly | fake scarcity, timers that reset |

**Evidence to distrust**, though often quoted: "unfinished tasks are remembered better" (Zeigarnik: mostly fails to replicate), "hook" loops with variable rewards (borrowed from gambling research), a fixed size for loss aversion, decoy pricing as a reliable lever, and national-culture tables as a design spec. Do not build flows on them.

## 7. Time and waiting

- About **0.1s** feels instant, **1s** keeps a train of thought, **10s** is the edge of attention. Acknowledge every press within 100ms; show progress after about 1s; give a percentage and a way to cancel past 10s.
- Waits feel shorter when people are occupied, know how long it will take, know why, and see it moving. Say what is happening and how long is left.
- Honest progress only. Never stall at 99% or pad a wait to look thorough.
- Mechanics: `feedback-states.md`.

## 8. Delight and personality

- **Deep delight** comes from saved time and being understood: smart defaults, the next step ready, nothing asked twice. Invest here first.
- **Surface delight** (a flourish, a playful line) lasts briefly and works only on a solid base. Fix speed, errors and clarity before adding charm.
- Place it at low-stakes moments: first run, an empty state, a success. Keep it short and skippable. None during blocking tasks, errors or sensitive moments.
- **Frequency rule:** the more often a moment happens, the plainer it should be. A joke read daily becomes an irritation.
- Personality reads as character only when it is consistent: choose three voice words ("plain, warm, exact") and one motion curve, and use them everywhere.
- Shift tone with the user's state: more play on success, none when money or data is lost.
- Yesterday's delighter is today's expectation. Auto-save, search and dark mode are basics now, not delights.

## 9. Sensitive subjects

For health, money trouble, death, legal matters and safety: plain language, one question at a time, say why you ask, let people skip and return, show a summary before anything is submitted, and offer a human. No streaks, no celebration animations, no engagement nudges, no cheerful imagery. Never resurface painful content to drive use.

## 10. The ethical line

Ask three questions: **If users saw exactly what this design is doing, would they feel respected or tricked? Does it serve their goal or only ours? Is it honest and easy to undo?**

Persuasion by clear information, good defaults and honest framing is fine. Anything that depends on hiding or lying is not. Refuse to build these, whoever asks, and say why:

- fake urgency or scarcity; fake reviews, counts or activity
- confirmshaming ("No thanks, I don't like saving money")
- pre-ticked add-ons, insurance or newsletters; items added to the basket
- costs revealed only at the last step; subscriptions or renewals that are not clearly stated
- cancelling made harder than signing up; forced account creation to check out
- trick wording and double negatives; a prominent Accept beside a hidden Reject
- tiny or fake close buttons; ads disguised as content or as system warnings
- repeated nagging after a refusal
- fake progress bars; streaks and alerts that punish absence; endless feeds aimed at children

These are also legal risks: regulators in the US, EU and California treat them as deceptive, and consent obtained through them can be invalid. Offer the honest version that meets the same business goal: a clear price, a true deadline, an easy cancel with a pause option.

## 11. Culture and inclusion

- Preferences for colour, density and playfulness vary by country, age and person. Test with the real audience; do not design from a stereotype of a nation.
- Plan for right-to-left scripts, longer translations, different name, date and number formats, and colour meanings (`color-theory.md`).
- Design for hard conditions: glare, one hand, a slow connection, a stressed mind. What helps people with disabilities helps everyone there.

## Putting it in the brief

Write one line: who, in what state, and what they should feel.

```
User and feeling: a small-business owner doing payroll late at night, anxious about mistakes.
They should feel: safe, guided, sure of what happens next.
```

Then check each key screen against section 3.

## Common mistakes

- Designing for a calm, focused, expert user who has all day. Real users are tired, distracted or worried.
- Charm before competence.
- Celebrating at the wrong moment.
- Persuasion tricks copied from growth blogs that the evidence does not support.
- Trust signals added as decoration (badges, stock faces) instead of behaviour (clear price, easy cancel).
- A strong start and a careless ending: the confirmation, receipt and first email are part of the design.
