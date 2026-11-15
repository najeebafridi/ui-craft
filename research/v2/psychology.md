# Psychology and emotion in interface design (research for v2)

Method: licences and a few key claims were checked on public pages (NN/g, deceptive.design, FTC, calmtech.com). Everything else is from my knowledge of the primary literature and is marked (unverified) where I could not re-check it in this session. All text is my own wording; nothing is copied. Bullet format: finding (source) | Evidence grade | UI use | Ethical line.
Grades: A = replicated / large or meta-analytic; B = several studies, mostly consistent; C = single or lab-only, or context-limited; D = weak / failed replication / folk wisdom.

## 1. Emotional design: Norman, Walter, Kano
Link: https://jnd.org ; https://www.nngroup.com/articles/ (Norman, Emotional Design, 2004) ; Walter, Designing for Emotion (A Book Apart, 2011) ; Kano et al. 1984
Made by: Don Norman; Aarron Walter (Mailchimp); Noriaki Kano
Licence: all copyright, all rights reserved (NN/g footer verified "All Rights Reserved"; jnd.org and book: (unverified)). Cite and paraphrase only.
Findings and rules:
- Norman: three processing levels. Visceral = instant look and feel; behavioural = how well it works in use; reflective = what it says about me afterwards, memory, story. | B (theory, backed by affect research; not one experiment) | Treat first paint (visceral), task flow (behavioural) and the end-of-task message (reflective) as three separate design jobs. | Don't spend the visceral budget to hide a broken behavioural layer.
- Norman: positive affect widens thinking and makes people tolerate small problems; stress narrows focus. | B/C | In stressful tasks (payments, errors) cut options and decoration; in browsing/creative tasks allow more play. | Don't induce stress to push a sale.
- Walter's hierarchy: functional, reliable, usable, pleasurable, in that order; delight only works on a stable base. | C (practitioner model, Maslow-style, untested empirically) | Fix errors, speed, clarity before adding personality. Use as a priority order for backlog. | Delight must not cover for unreliable software.
- Kano: features sort into basic (expected; absence hurts, presence unnoticed), performance (more is better), delighters (unexpected; absence unnoticed). Delighters decay into basics over time. | B (survey method widely used; classification is context- and time-dependent) | Auto-save, search, dark mode are now basics; do not market them as delight. Add one small, genuinely useful surprise per release at most. | Delighters must be useful or kind, not manipulative.
- Kano questionnaire results depend on wording and sample; run it with real users before calling something a delighter. | C | Ask both functional and dysfunctional question per feature. | n/a
- Reflective level: people judge an experience by how it ends and how they retell it, so the closing screen matters (see peak-end). | B | Write a specific confirmation ("Invoice 1042 sent to Anna, 14:02") not "Success". | Don't fake accomplishment.
Notable: Norman's "attractive things work better" has been criticised as overstated; keep as a mood effect, not a usability guarantee.

## 2. First impressions, beauty, fluency
Link: https://www.nngroup.com/articles/aesthetic-usability-effect/ (checked) ; https://en.wikipedia.org/wiki/Processing_fluency ; Lindgaard et al. 2006 Behaviour & Information Technology ; Tuch et al. 2012 Int. J. Human-Computer Studies ; Reber, Schwarz & Winkielman 2004 Personality and Social Psychology Review ; Kurosu & Kashimura 1995 ; Tractinsky et al. 2000
Made by: those authors; NN/g (Nielsen Norman Group)
Licence: NN/g (c) 1998-2026 all rights reserved (verified); Wikipedia CC BY-SA 4.0; journal papers publisher-copyright (abstracts only).
Findings and rules:
- Lindgaard 2006: people rate a page's visual appeal after 50 ms and those ratings correlate very highly (about r .94, unverified exact) with ratings after 500 ms. | B (replicated in later 50 ms studies, e.g. Tractinsky 2006; measures appeal, not trust or usability) | The above-the-fold render, in the first second, is judged before any copy is read; make hero clean, aligned, on-brand. | Don't treat a pretty first frame as permission to hide poor content.
- Tuch et al. 2012 (Google): lower visual complexity and higher prototypicality (looks like a typical site of its type) gave better first impressions, even at very short exposure. | B | Use familiar layouts for the category (shop = grid + cart, bank = calm blue-ish and tabular). Simplify before decorating. | Familiarity must not be used to imitate another brand.
- Kurosu & Kashimura 1995: 26 ATM layouts, 252 people; beauty ratings tracked perceived ease of use more than measured ease of use. Tractinsky 2000 replicated in Israel with different layouts. | B (later work shows the link varies with culture and task) | Polish is part of usability perception; budget time for visual QA. | Don't rely on it to excuse usability bugs.
- NN/g caveat: attractive design forgives minor problems, not severe ones, and in tests it can mask problems because people politely praise visuals. | B | Test by observing behaviour, not by asking "do you like it". | n/a
- Fluency (Reber et al. 2004): easy-to-process stimuli (clear, high contrast, symmetric, familiar, repeated) feel more positive and more true. | B for the mood and liking effect; C for downstream effects | Large readable type, ample contrast, consistent patterns, short sentences. | Don't use easy-to-read styling to make a false claim feel true (truth effect, Hasher 1977, is robust).
- Disfluency-improves-reasoning claims (hard fonts help thinking, Alter 2007) failed large replications (Meyer et al. 2015). | D | Don't make UI harder on purpose. | n/a
- Beauty-is-trustworthy halo is real in short exposures but fades as experience accumulates. | C | First visit = look; repeat visit = reliability. | n/a
Notable: complexity preference differs by age and country (Reinecke & Gajos 2014, 2.4 million ratings, unverified detail), so test with your audience.

## 3. Trust and credibility
Link: https://credibility.stanford.edu/guidelines/ (Stanford Web Credibility Project) ; Fogg et al. 2003 "How do users evaluate the credibility of web sites?" (DUX '03, ACM) ; https://www.nngroup.com/articles/trust-or-bust/ and related NN/g trust pages (unverified exact URLs) ; Sillence et al. 2004 (health sites)
Made by: B.J. Fogg and Stanford Persuasive Technology Lab; Jakob Nielsen / NN/g; Sillence, Briggs et al.
Licence: Stanford pages (c) Stanford, all rights reserved (unverified); NN/g all rights reserved; paper publisher-copyright.
Findings and rules:
- Fogg 2003: about 2,600 people commented on credibility of sites; roughly 46% of comments were about visual design/look, far more than any other category. | B (large, but self-reported comments, 2002-era web, ranked sites in a few categories) | Look is the first credibility filter: consistent grid, real photography, no clutter, no broken layout. | Don't use polish to disguise a thin offering.
- Sillence 2004: for health information, people rejected sites on design first (bland, cluttered, ads) and then judged content on source and fit to their situation. | B | Two-stage trust: pass the design gate, then show who is behind the content. | n/a
- Stanford guidelines (my paraphrase): make it easy to verify claims; show a real organisation behind the site; show real people; make it easy to contact you; design professionally; keep content current; limit ads; avoid errors. | B (heuristics from research, not a tested checklist) | See the trust-signals checklist below. | Don't fabricate people, addresses or credentials.
- NN/g: trust is built by consistent behaviour and honest content (clear pricing, policies in plain words, visible contact, no surprises), and lost by one hidden fee or one dark pattern. | B (qualitative research) | Show total price before payment; show cancellation terms at signup. | Asymmetry: trust is slow to build, quick to break.
- Typos, broken links and placeholder text are read as signs of carelessness and lower credibility. | B/C | Copy and link QA before launch. | n/a
- Third-party proof (reviews, certificates, press) raises credibility only if verifiable. | B | Link to the review source; date reviews. | Fake or incentivised-unlabelled reviews are deceptive and illegal in several regions.
Notable: "pyramid of trust" style models are practitioner frames; treat as organising device (C).

## 4. Attention, memory, cognitive load
Link: https://lawsofux.com/ ; https://www.nngroup.com/articles/ (cognitive load, progressive disclosure, recognition vs recall) ; https://en.wikipedia.org/wiki/Hick%27s_law ; https://en.wikipedia.org/wiki/Fitts%27s_law ; https://en.wikipedia.org/wiki/Cognitive_load
Made by: Jon Yablonski (Laws of UX); NN/g; Hick 1952, Fitts 1954, Miller 1956, Sweller 1988, von Restorff 1933
Licence: Laws of UX (c) author, all rights reserved (unverified); Wikipedia CC BY-SA 4.0; NN/g all rights reserved.
Findings and rules:
- Fitts: time to hit a target grows with distance and falls with size. | A | Primary buttons big and near the thumb/pointer; screen edges and corners are easy targets; 44 px touch targets. | Don't enlarge the "accept" button while shrinking "decline" to steer.
- Hick-Hyman: choice time rises with the log of the number of equally likely options; applies to simple, unfamiliar, unordered choices. | B (often over-applied to menus, where grouping and scanning matter more) | Group options, highlight a recommended one, hide rare ones. | Hiding options must not hide the user's rights (cancel, privacy).
- Miller 1956 "7 plus or minus 2" concerns the span of immediately remembered chunks; modern estimates are about 3-5 chunks (Cowan 2001, unverified). | A for limited capacity; D for "7 items in a menu" rule | Chunk phone numbers, card numbers, long forms into steps; do not make 7 a navigation law. | n/a
- Von Restorff: the odd item is remembered. | A (lab) | One highlighted plan or one primary button; if everything is highlighted nothing is. | Don't highlight the costly option by deceptive contrast alone.
- Serial position: first and last items are remembered best. | A | Put key nav items at the ends of a bar; put the primary action first or last in a list. | n/a
- Gestalt (proximity, similarity, common region, continuity, closure): people group by closeness first. | A (perception research; as design rules B) | Spacing and alignment carry structure; fewer borders. | n/a
- Cognitive load (Sweller): working memory is small, so split intrinsic, extraneous and germane load. | A (education research) | Remove extraneous load: one task per screen, visible context, no re-entering data. | n/a
- Recognition over recall (Nielsen heuristic): showing options is cheaper than remembering them. | A | Dropdowns with search, recent items, visible labels not icons alone. | n/a
- Progressive disclosure: show the basics, reveal advanced on demand; keep depth at about 2 levels. | B | Advanced filters behind "More"; summaries then detail. | Don't bury pricing, terms or opt-outs.
Notable: Laws of UX is a curated summary of mixed evidence quality; always go to the primary law for strength.

## 5. Motivation and decisions
Link: https://en.wikipedia.org/wiki/Goal_gradient_effect ; https://en.wikipedia.org/wiki/Default_effect ; https://en.wikipedia.org/wiki/Anchoring_effect ; https://en.wikipedia.org/wiki/Zeigarnik_effect ; https://en.wikipedia.org/wiki/Peak%E2%80%93end_rule ; https://en.wikipedia.org/wiki/IKEA_effect ; https://en.wikipedia.org/wiki/Paradox_of_choice ; https://behaviormodel.org (Fogg) ; https://growth.design/psychology (secondary index)
Made by: Kivetz, Urminsky & Zheng 2006; Nunes & Dreze 2006; Zeigarnik 1927; Kahneman et al. 1993; Johnson & Goldstein 2003; Tversky & Kahneman; Huber et al. 1982; Norton, Mochon & Ariely 2012; Buell & Norton 2011; Iyengar & Lepper 2000; Fogg 2009; Eyal 2014
Licence: Wikipedia CC BY-SA 4.0; papers publisher-copyright; behaviormodel.org (c) Fogg (unverified); growth.design (c) Growth.Design (unverified, secondary index only).
Findings and rules:
- Goal gradient (Kivetz 2006): effort rises as the goal nears; coffee-card customers bought faster near the end. | B | Show progress toward a real goal (profile 70% complete, 2 of 5 steps). | Don't invent goals the user did not choose.
- Endowed progress (Nunes & Dreze 2006): car-wash cards with 2 of 10 stamps pre-filled were completed more (34% vs 19%, unverified exact) than 8-stamp blank cards. | B (field experiment; the endowment must be credible) | Onboarding: "Account created, 2 of 5 steps done" when those steps really were completed. | Don't fake completed steps.
- Zeigarnik (1927): unfinished tasks are remembered better. | D (replications mostly fail; the robust finding is that open goals intrude, per Masicampo & Baumeister 2011, unverified) | Saved-draft banners and "continue where you left off" are fine because they are useful, not because of Zeigarnik. | Don't use nagging "you left something behind" loops.
- Peak-end (Kahneman 1993; Fredrickson & Kahneman 1993): remembered experience tracks the most intense moment and the end more than the average. | B (strong in painful/medical lab studies; meta-analytic support moderate, Alaybek 2022, unverified) | Make the final step (confirmation, receipt, first success) the best part; fix the worst moment first. | Don't extend discomfort to engineer a better ending.
- Default effect (Johnson & Goldstein 2003): organ-donor consent was far higher in opt-out countries (about 90%+ vs 15% effective consent; consent, not actual donation). | A (many replications in savings, energy, privacy) | Default to the choice that is best for most users and easy to change (e.g. reminders on, privacy-protecting settings). | Defaults must serve the user, not extract money or data (pre-ticked add-ons are a dark pattern).
- Anchoring (Tversky & Kahneman 1974): a first number biases later estimates. | A for the classic effect (Many Labs 1, Klein 2014); B for pricing pages | Show the full price crossed out only if it was truly charged; put a higher plan first on a plan page. | Fake "was" prices are illegal in many jurisdictions.
- Decoy / asymmetric dominance (Huber 1982): a clearly worse third option shifts choice to the target. | C (lab-heavy; replications mixed and weaker outside lists of numeric attributes, Frederick et al. 2014, unverified) | Three-tier pricing is fine when each tier is real. | Don't plant a useless option to mislead.
- Loss aversion and framing (Kahneman & Tversky 1979): losses weigh more than equal gains; framing changes choice. | B for framing; C for the size of loss aversion (Gal & Rucker 2018 critique, unverified) | Say what a free trial includes and when it ends; "Save $20" vs "avoid $20 fee" is a test, not a law. | Confirmshaming and "you'll lose everything" threats are out.
- Social proof (Cialdini; Goldstein, Cialdini, Griskevicius 2008 hotel towels): people follow the visible norm. | B | Real counts, real reviews with source and date, "most teams choose X" when true. | Fake or inflated numbers, invented "12 people are viewing".
- Scarcity (Cialdini; Worchel 1975): limited supply raises desirability. | C (field replications mixed) | Show real stock or a real deadline. | Fake scarcity and fake countdowns are dark patterns.
- IKEA effect (Norton et al. 2012): people value what they helped build. | B | Let users customise and build (template then edit); personalised setup. | Don't create sunk-cost lock-in to block leaving.
- Labour illusion / operational transparency (Buell & Norton 2011): showing the work being done (e.g. "searching 400 airlines") raises perceived value and tolerance for wait, even when waiting is longer. | B (a few studies, partly replicated by the authors) | Show real steps in a search or checkout. | Don't fake work that is not happening (fake progress bars).
- Paradox of choice (Iyengar & Lepper 2000 jam study): too many options reduce purchase. | C/D (meta-analysis by Scheibehenne et al. 2010 found mean effect near zero; Chernev et al. 2015 found it appears with high difficulty, low preference clarity, no clear best) | Offer 3-5 curated choices with a recommended one when users are novices; offer search/filter for experts. | n/a
- Fogg behaviour model: behaviour = motivation x ability x prompt at the same moment. | C (useful diagnostic, weakly tested as a quantitative model) | When users don't act, first make the action easier, then look at motivation. | Don't use prompts to harass.
- Hooked model and variable rewards (Eyal 2014; Skinner): trigger, action, variable reward, investment. | D for app design as strong science (animal and gambling research does not transfer cleanly; Eyal himself later wrote about healthier use) | Variable reward is acceptable for discovery content with limits (feeds with end states). | Infinite feeds, streaks that punish absence, and slot-machine timing are on the refuse list.
Notable: growth.design lists many effects with uneven evidence; treat as an idea index, not proof.

## 6. Time perception and waiting
Link: https://www.nngroup.com/articles/response-times-3-important-limits/ ; https://www.nngroup.com/articles/skeleton-screens/ ; Maister 1985 "The Psychology of Waiting Lines" (public essay on davidmaister.com) ; https://lawsofux.com/doherty-threshold/
Made by: Miller 1968 and Nielsen (limits); Doherty & Thadhani (IBM, 1982); David Maister; NN/g
Licence: NN/g and Maister essay all rights reserved (unverified for Maister); Laws of UX as above.
Findings and rules:
- Response limits: about 0.1 s feels instant, 1 s keeps flow of thought, 10 s is the edge of attention (Miller 1968; Nielsen 1993). | A/B (old but widely confirmed) | Acknowledge a press within 100 ms; show a loader after about 1 s; give percent and cancel beyond 10 s. | n/a
- Doherty threshold: productivity rises when the system responds in under about 400 ms (IBM, 1982). | C (old mainframe study, since cited as folk rule) | Use as a perf budget target for interactions. | n/a
- Maister: occupied time feels shorter; uncertain waits feel longer than known ones; unexplained waits feel longer; unfair waits feel longer; anxiety lengthens waits. | B (service research, mostly qualitative) | Show what is happening and how long; show queue position; keep a count that moves. | Don't pad waits to look "thorough" without telling the truth.
- Skeleton screens (NN/g): good when layout is known and wait is 2-10 s; spinners for under 2 s or unknown shape; percent bars for longer. | C/B (NN/g guidance; academic evidence thin and mixed on whether skeletons feel faster, unverified) | Skeleton matching real layout; no looping shimmer more than needed. | n/a
- Progress bars that speed up at the end feel faster (Harrison et al. 2007/2010, unverified detail). | C | Prefer honest progress; don't stall the bar at 99%. | Fake progress is deceptive.
- A pause of 300-500 ms after a "heavy" action can raise trust in security tasks (labour illusion cousin). | C/D (unverified) | Not recommended as a design rule. | Don't delay on purpose.
Notable: speed is itself a premium cue (see list below).

## 7. Stress, sensitive contexts, calm, tone
Link: https://calmtech.com/ (checked) ; Amber Case, Calm Technology (O'Reilly 2015) ; https://www.nngroup.com/articles/tone-of-voice-dimensions/ ; NN/g and GOV.UK content design guidance (https://www.gov.uk/guidance/content-design) ; Trauma-informed design (Chamorro-Premuzic not used)
Made by: Amber Case (Calm Tech Institute); Kate Moran / NN/g; UK Government Digital Service
Licence: calmtech.com: "Calm Technology" and "Calm Tech Certified" are registered trademarks, all rights reserved (verified); GOV.UK guidance is Open Government Licence v3.0 (unverified for each page); NN/g all rights reserved.
Findings and rules:
- Calm technology's eight principles (verified list, my words): demand minimal attention; inform without alarm; use the periphery; amplify the best of people and machines; communicate without speaking; degrade gracefully when failing; be the minimum needed; respect social norms. | C (design philosophy, no trials) | Use quiet status (a dot, an inline line) before modals and push; fail to a usable state. | Don't use attention-grabbing alerts for marketing.
- Anxious users re-read, hesitate and fear irreversible steps; reassurance has to be concrete. | B (qualitative from health, finance and government research; no single canonical study) | Say what will happen next, show "you can change this later", provide Back, save draft, confirm summary before commit. | Don't exploit anxiety (e.g. "your account is at risk" to upsell).
- Error messages: blame the system not the person, say what happened, how to fix, keep input. | B (NN/g and GOV.UK practice; limited experiments) | "We couldn't verify the card. Check the number or try another." | No jokes in serious errors; no "Oops".
- NN/g tone dimensions: funny vs serious, formal vs casual, respectful vs irreverent, enthusiastic vs matter-of-fact; tone should shift with the user's emotion and task. | B (qualitative research) | Lower playfulness for errors, payment, health, bereavement; allow more on success screens. | Don't use cute copy when a user has lost money or data.
- Grief, embarrassment, and sensitive data (death, debt, health, abuse): ask once, avoid jokes, explain why you ask, allow skipping, avoid cheerful stock imagery and avoid streaks or celebratory confetti. | C (practitioner consensus, trauma-informed design; (unverified) for numbers) | Offer plain "Remove" or "Pause" for photo memories; no automatic "On this day" for painful content. | Never auto-surface reminders of loss to drive engagement.
- Government and healthcare: plain language (reading age about 9-12), one question per page, clear summary page before submit. | B (GDS has done years of usability testing) | Use one-thing-per-page for complex forms. | Don't reduce legal information that people need.
Notable: GOV.UK design system is the strongest public example of calm, trust-first interaction for anxious users.

## 8. Delight, personality, micro-interactions
Link: https://www.nngroup.com/articles/theory-user-delight/ (unverified exact URL) ; Dan Saffer, Microinteractions (O'Reilly 2013) ; Norman Emotional Design
Made by: Kate Moran / NN/g; Dan Saffer
Licence: all rights reserved on both; paraphrase only.
Findings and rules:
- Saffer's anatomy: trigger, rules, feedback, loops/modes. | C (design framework) | Specify each micro-interaction in these four parts: what starts it, what it does, what the user sees, how long it repeats. | Don't loop reminders endlessly.
- NN/g theory of delight: surface delight (animations, visuals, playful touches) is short-lived and fine on a solid base; deep delight comes from a product that saves time, reduces effort, or understands the user. | C (qualitative) | Invest first in deep delight (smart defaults, anticipating the next step); add surface delight at moments of success only. | Don't use playfulness to distract from poor service.
- Delight works at low-stakes moments (completion, first run, empty state) and annoys when the user is rushed. | C | Show a short, skippable flourish after success; none during blocking tasks. | Respect prefers-reduced-motion.
- Personality needs consistency to read as character: same voice, same motion curve, same icon style. | C | Define 3 voice adjectives; reuse. | n/a
- Humour repeated becomes irritating; novelty wears off (hedonic adaptation). | B | Rotate or remove after first use. | n/a
Notable: delight evidence is mostly qualitative; weigh it below speed and clarity.

## 9. Ethics, dark patterns and law
Link: https://www.deceptive.design/types (checked) ; https://www.ftc.gov/reports/bringing-dark-patterns-light (checked: Sept 2022) ; DSA Regulation (EU) 2022/2065 Art. 25 ; California CPRA regulations (Cal. Code Regs. tit. 11, 7004) ; https://growth.design (secondary)
Made by: Harry Brignull (deceptive.design, formerly darkpatterns.org); US Federal Trade Commission staff; EU Parliament and Council; California Privacy Protection Agency
Licence: deceptive.design (c) 2026 Testimonium Ltd., no open licence stated, asks for attribution (verified); FTC report: US federal work, likely public domain (unverified; FTC page shows no notice); EU law: reuse allowed with source (unverified); CPRA text public.
Findings and rules:
- deceptive.design lists 18 types (verified): sneaking, forced action, hard to cancel, preselection, obstruction, hidden subscription, hidden costs, trick wording, visual interference, fake social proof, fake urgency, nagging, fake scarcity, disguised ads, confirmshaming, comparison prevention, addictive design, currency confusion. | B (taxonomy; prevalence data from academic scans e.g. Mathur et al. 2019, unverified) | Use as the review checklist for every flow. | Refuse all 18.
- FTC Sept 2022 staff report: highlights fake reviews/endorsements, disguised ads, hidden fees, difficult cancellation, and data-privacy tricks as unfair or deceptive; the page links the PDF (verified), the category detail is from the PDF (unverified). | A for legal weight in US (FTC Act s.5; ROSCA for subscriptions) | Make cancel as easy as signup, show total price up front. | Enforcement risk is real.
- FTC "click-to-cancel" rule: finalised 2024, then vacated by a US appeals court in 2025 (unverified); state laws still apply. | C | Plan for symmetric cancellation regardless. | n/a
- DSA Art. 25 (EU): online platforms must not design interfaces that deceive or manipulate or materially distort users' ability to make free, informed decisions; applies to platforms, not covering practices already regulated by UCPD or GDPR. | A (law) | Equal-prominence choices, no repeated nags after refusal, easy to cancel. | n/a
- CPRA rules: consent obtained through dark patterns is not valid; choices must be symmetrical, in plain language, with no guilt-tripping. | A (law) | Equal-size Accept and Reject; no pre-ticked boxes. | n/a
- GDPR consent: must be unambiguous and as easy to withdraw as to give; pre-ticked boxes are invalid (CJEU Planet49, 2019, unverified detail). | A | One-click reject. | n/a
- Test for the ethical line (my rule): would the user, if they saw exactly what you were doing, feel respected or tricked? Does the design serve the user's own goals? Is it reversible and honest? | n/a (heuristic) | Use in review. | n/a
Notable: Persuasion by honest information, convenient defaults and clear framing is acceptable; persuasion that depends on hiding or lying is not.

## 10. Inclusive and cultural
Link: https://en.wikipedia.org/wiki/Hofstede%27s_cultural_dimensions_theory ; Reinecke & Gajos 2014 CHI (visual preferences) ; Marcus & Gould 2000 ; WCAG 2.2 https://www.w3.org/TR/WCAG22/
Made by: Geert Hofstede; Katharina Reinecke and Krzysztof Gajos; Aaron Marcus; W3C
Licence: Wikipedia CC BY-SA 4.0; WCAG W3C document licence (permits unmodified copies with attribution; unverified exact terms); papers publisher-copyright.
Findings and rules:
- Hofstede dimensions (power distance, individualism, uncertainty avoidance, etc.) are a coarse national-level model built from IBM surveys; heavily criticised for essentialism and outdated samples (McSweeney 2002, unverified). | C/D as a UI predictor | Use as a prompt to test, not a spec: do not make a "Japan version" from a table. | Don't stereotype users.
- Reinecke & Gajos 2014: large web experiment (about 2.4 million ratings, unverified exact) found visual preferences (complexity, colourfulness) vary by country, age and gender. | B | A/B test visuals per market; check colour meaning and reading direction. | Don't assume Western minimalism is universal.
- Localisation basics: right-to-left layout, date and number formats, longer German text, name forms, honorifics. | A (practical) | Test with pseudo-localisation and real names. | Don't ask for gender, title or surname order by default.
- Accessibility is a trust signal: users with disabilities and all users in poor conditions (glare, one hand, stress) benefit; a failing keyboard flow reads as carelessness. | B | WCAG 2.2 AA floor; plain language. | Don't use accessibility overlays as substitutes (unverified claims about their effectiveness; widely criticised).
- Colour meaning is cultural (red = danger vs luck): always pair with text/icon. | B | n/a | n/a

## Emotional state to design response
| State | Signals | Design response | Avoid |
|---|---|---|---|
| Anxious | money, health, legal, irreversible action | Say what happens next; summary before commit; Back and save draft; calm colours; plain words; visible support contact | Urgency timers, red alarm language, dense legalese |
| Rushed | mobile, mid-task, repeat visits | Fewest steps; prefill; big targets; saved details; keyboard shortcuts; skip onboarding | Tours, modals, upsell interstitials |
| Bored | empty time, browsing, low stakes | Light discovery, progress toward self-chosen goals, small playful moments | Infinite scroll with no end, streak guilt |
| Sceptical | new brand, big claim, payment | Evidence near claims, real names, pricing up front, easy refund/cancel, verifiable reviews | Superlatives, countdowns, fake counters |
| Excited | after sign-up, purchase, success | Keep momentum: clear next step, short celebration, shareable result (opt-in) | Interrupting with asks (rating, newsletter) |
| Grieving or embarrassed | bereavement, debt, illness, mistakes, failed payment | Neutral tone, no jokes or confetti, ask minimal info, allow skip and delete, discreet wording, private by default | Cheerful imagery, "On this day", engagement nudges, shaming copy |
| Expert in flow | power user, daily tool | Density, shortcuts, command palette, no confirmations for reversible acts (offer undo), stable layout | Hand-holding, animations that block, layout change without notice |

## Trust-signals checklist
- Named organisation, real address, working contact (human reachable); About page with real people (not stock).
- Total price (tax, shipping, fees) before the final step; no surprise charges.
- Plain-language privacy and returns/cancellation summary at the point of decision.
- HTTPS, recognised payment logos only if you really use them; no fake security badges.
- Reviews with source, date, mixed ratings, and a link to verify; no invented counts.
- Visible last-updated dates and author/reviewer on advice content.
- Consistent, professional visual design; no typos, broken links, placeholder text.
- Fast, stable loading; no layout jump; working back button.
- Accessible: contrast, keyboard, labels, 200% zoom.
- Honest errors; confirm what was done ("Refund of $24.00 sent to Visa ending 4242").
- Easy cancel, export and delete in account settings.
- No pop-up on arrival; ads clearly labelled.

## What makes something feel premium (psychologically)
- Fluency: one clear focus per screen, large readable type, generous whitespace, predictable patterns. (B)
- Restraint: few colours, one accent, few weights; what is left out signals confidence. (C; practitioner consensus)
- Craftsmanship cues: pixel-aligned grid, consistent radii and spacing, optical alignment, crisp icons, real photography, considered empty and error states. (C/B via aesthetic-usability)
- Effort signals: visible care in details (custom touches, thoughtful copy, a specific confirmation) read as costly signalling; compare labour illusion (B for the effect, but honest only if the work is real).
- Consistency: same component, same word, same motion everywhere; inconsistency is read as cheap. (B)
- Responsiveness: instant feedback under 100 ms, no jank, optimistic updates with undo; speed is read as quality. (B)
- Material cues: subtle depth, quality typography (sometimes a serif or custom face), smooth easing at 200-300 ms; no clutter of badges or discount bursts. (C)
- Quiet confidence in tone: short sentences, no exclamation marks, no shouting discounts. (C)
- Limits: premium is a perception; it cannot compensate for slow, buggy or expensive-in-hidden-ways products.

## Dark patterns to refuse
Fake urgency (countdowns that reset); fake scarcity ("only 2 left" when not true); fake social proof ("12 people viewing", invented reviews); confirmshaming ("No thanks, I hate saving money"); pre-ticked add-ons, insurance or newsletters; hidden costs revealed at checkout; hidden or auto-renewing subscriptions without clear notice and reminder; cancel path harder than signup (phone-only, buried, multi-step "are you sure" loops); sneak-into-basket; forced account creation to check out or read; forced sharing of contacts; trick wording (double negatives, "Don't not send"); visual interference (grey-on-grey Decline, tiny close X, fake close buttons); nagging after a refusal (repeat prompts for notifications, ratings, permissions); disguised ads; comparison prevention; asymmetric consent banners (big Accept, hidden Reject); roach-motel data deletion; streaks and loss-based notifications that punish absence; infinite feeds without natural stopping points aimed at minors; virtual-currency price obfuscation; fake progress bars or fake "scanning" theatre; fake system warnings.

## Evidence grades
| Principle | Grade | Note |
|---|---|---|
| Fitts' law | A | Very robust |
| Cognitive load / chunking capacity | A | Capacity ~4 chunks; "7 plus or minus 2" is popular but outdated |
| Default effect | A | Replicated across domains |
| Anchoring (classic) | A | Many Labs 1; pricing-page effects B |
| 50 ms first impression (Lindgaard) | B | Appeal only; replicated |
| Aesthetic-usability effect | B | Perceived, not real usability; culture-dependent |
| Processing fluency (liking) | B | Disfluency-for-reasoning D |
| Credibility = look (Fogg 2003) | B | Self-reported comments, 2002 web |
| Goal gradient | B | Field and lab |
| Endowed progress | B | Needs credible endowment |
| Peak-end | B | Strong in lab, mixed for long real experiences |
| Social proof | B | Context dependent |
| IKEA effect | B | Needs completed effort |
| Labour illusion | B | Few labs, same authors |
| Hick's law | B | Over-applied to menus |
| Gestalt grouping | A | Perception research |
| Maister waiting principles | B | Qualitative |
| Doherty threshold | C | Old IBM study, folk rule |
| Decoy effect | C | Mixed replications |
| Loss aversion magnitude | C | Contested |
| Scarcity | C | Mixed field results |
| Kano model | B/C | Classification unstable |
| Walter hierarchy, Norman levels | C | Frameworks |
| Fogg behaviour model | C | Diagnostic, not quantitative |
| Paradox of choice | C/D | Meta-analysis near zero |
| Zeigarnik effect | D | Mostly fails to replicate |
| Hooked / variable rewards | D | Borrowed from animal/gambling research |
| Hofstede for UI | C/D | Coarse national stereotypes |
| Dark patterns harm and law | A | Regulation (FTC, DSA, CPRA) |

## Disagreements spotted
- Aesthetic-usability: Norman's "attractive things work better" vs NN/g and test evidence that beauty changes perceived, not actual, usability; and can mask problems in user tests.
- Choice: Hick and "fewer options" folk rules vs Scheibehenne 2010 (no average choice overload) vs Chernev 2015 (depends on conditions).
- Delight: Walter and Norman push for emotion and personality; NN/g says surface delight is secondary to usability; Kano says delighters decay.
- Zeigarnik and Hooked are widely quoted in growth blogs (incl. growth.design) but weakly supported.
- Miller's 7+-2 vs Cowan's ~4: popular rule vs modern estimate.
- Fluency: "make it easy" vs "desirable difficulty / disfluency helps reasoning"; the latter did not replicate, but deliberate friction (confirm destructive acts) remains justified on safety grounds.
- Labour illusion and fake progress: research shows effect works; ethics and the DSA/FTC line says only real work may be shown.
- Scarcity, urgency and social proof: marketing literature treats them as standard tools; regulators treat fake versions as deceptive. Rule: only if true and verifiable.
- Cultural models: Hofstede and Marcus & Gould suggest country templates; Reinecke & Gajos show wide variance inside countries; test, don't assume.
- Legal status of "click to cancel" in the US changed in 2025 (unverified); keep symmetric cancellation as a design rule either way.
