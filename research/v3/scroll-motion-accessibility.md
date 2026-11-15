# Research v3: scroll storytelling, cinematic motion and accessibility
Method: fetched public pages this session (2026-11-16) with a page reader, and paraphrased every rule.
(verified) = the fetched page said it. (unverified) = from memory, a search snippet, or my own advice; check before relying on it.
Numbers that no page gave are marked "house default" in the table: they are my suggestions, not facts from a source.

## MDN: CSS scroll-driven animations
Link: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
Made by: Mozilla contributors. Licence: CC BY-SA 2.5 for text (unverified); code samples CC0 (unverified).
Rules:
- Scroll progress can drive a CSS animation instead of time. Pick the scroller with `animation-timeline` (named timeline, `scroll()` or `view()`). (verified)
- `scroll()` follows a scroll container's position; `view()` follows an element as it passes through the viewport. (unverified; page only linked to these)
- Wrap the feature in a support test: `@supports not (scroll-timeline: --name)` shows a fallback state. MDN's own demo does this. (verified)
- Use `@layer` to keep animation rules, setup rules and no-support rules apart. (verified)
- The page said nothing on reduced motion; put motion inside `@media (prefers-reduced-motion: no-preference)` yourself. (unverified)
Notable: the `@supports not (...)` fallback pattern is shown in MDN's own example.

## Chrome for Developers: scroll-driven animations
Link: https://developer.chrome.com/docs/css-ui/scroll-driven-animations
Made by: Google Chrome team. Licence: CC BY 4.0 text, Apache 2.0 code (unverified; usual for this site).
Rules:
- Support shown on the page: Chrome and Edge 115, Firefox 159, Safari 26. (verified, page badges)
- These animations can run off the main thread, so they stay smoother than scroll-event JavaScript. (verified)
- Animate `transform` (for example `scaleX`), not `width`, so the browser can composite it. (verified)
- `animation-range` picks when in the scroll the animation plays. `entry`, `exit`, `cover` are range names. Example: `entry 25% cover 50%` finishes a reveal when the item is half way up. (verified)
- `animation-range: entry, exit` gives one element a different animation on the way in and on the way out. (verified)
- The article gave no fallback or reduced-motion advice. (verified: absent)
Notable: ranges use the element's untransformed box, so scaling it will not make the animation flicker.

## scroll-driven-animations.style (Bramus)
Link: https://scroll-driven-animations.style/
Made by: Bramus Van Damme (Chrome). Licence: MIT (unverified).
Rules:
- A polyfill exists for browsers without support (flackr/scroll-timeline on GitHub). Many demos also ship a plain JavaScript version. (verified)
- The site shows the feature heading to "Baseline Newly Available" in Oct 2026. (verified)
- Native CSS first, polyfill second; a polyfill runs on the main thread and loses the smoothness. (unverified)
Notable: the site has no reduced-motion advice; that part is on you.

## Chrome for Developers + MDN: View Transitions
Link: https://developer.chrome.com/docs/web-platform/view-transitions ; https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
Made by: Google Chrome team; Mozilla contributors. Licence: CC BY 4.0 (Chrome, unverified); CC BY-SA 2.5 (MDN, unverified).
Rules:
- Same-document: call `document.startViewTransition(callback)` where the callback updates the page. If the browser lacks it, just update the page directly. (verified)
- Cross-document: both pages add `@view-transition { navigation: auto; }`, same origin. No JavaScript call needed. (verified)
- Support per the Chrome page: same-document Chrome/Edge 111, Firefox 144, Safari 18; cross-document Chrome/Edge 126, Safari 18.2, not Firefox. (verified)
- The browser takes a picture of the old view and the new one, pauses rendering, then animates between them with CSS. (verified)
- `pageswap` (leaving page) and `pagereveal` (arriving page) events let you tune a cross-document transition, for example by direction. (verified)
- Because the browser handles old and new views, you avoid the classic bugs of two copies in the DOM: lost reading position, confused focus, odd live-region announcements. (verified)
- Neither page gave reduced-motion rules or durations. Shorten or remove the `::view-transition-*` animations inside `@media (prefers-reduced-motion: reduce)`. (unverified)
- Keep page changes at 200-500ms, short end for common moves. (unverified, house default)
- Keep the real URL change and history entry: a transition must never replace normal navigation, so back button and deep links keep working. (unverified)
Notable: cross-document transitions are the cheapest "cinematic" page change and need almost no JavaScript.

## GSAP docs: ScrollTrigger
Link: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
Made by: GreenSock / Webflow. Licence: see next entry.
Rules:
- `pin` holds an element fixed while the trigger is active; ScrollTrigger adds spacing so later content is not hidden. Do not animate the pinned element itself. (verified)
- `scrub: true` ties progress to the scrollbar. `scrub: <number>` is the seconds the animation takes to catch up; that is the smoothing. (verified)
- `snap` moves to a nearby progress point after scrolling stops: regular steps, a list of values, a function, or timeline labels, with its own delay, duration and ease. (verified)
- `ScrollTrigger.matchMedia()` is deprecated; use `gsap.matchMedia()` for breakpoints. (verified)
- Use `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` for the full effect and `(prefers-reduced-motion: reduce)` for the calm one. (unverified; page did not mention reduced motion)
- `end` can be a string like `"+=300px"`, a number, or a function re-run on refresh. Default `"bottom top"`. (verified)
- Scrub values of about 0.5 to 1 feel smooth without feeling laggy. (unverified, house default)
Notable: the docs do not mention accessibility; reduced motion is your job.

## GSAP licence (Standard "No Charge" licence)
Link: https://gsap.com/standard-license/
Made by: Webflow (owner of GreenSock). Licence: this is the licence itself; not open source.
Rules:
- Now free for everyone, commercial use included, including plugins once paid (SplitText, MorphSVG and others). (verified)
- Banned: a no-code visual animation tool that competes with Webflow's; reverse engineering to build a competing product; removing notices. (verified)
- Webflow may change the terms; using newer versions means accepting them, older versions stay under the terms you got them under. (verified)
- Code written by an AI tool using GSAP is not a banned use. (verified)
Notable: GSAP is free to use but is NOT open source (not MIT). A skill may recommend it; it must not copy GSAP files into the repo.

## Lenis (smooth scroll)
Link: https://github.com/darkroomengineering/lenis
Made by: darkroom.engineering. Licence: MIT.
Rules:
- Lenis wraps the browser's own scroll, so sticky, anchors and the scrollbar keep working. (verified)
- Defaults: `lerp` 0.1; `duration` 1.2 s (ignored when `lerp` is set). (verified)
- `respectReducedMotion` is on by default: smoothing off, programmatic scrolls jump. Do not turn it off. (verified)
- Known gaps: no smoothing over iframes; nested scroll boxes need setup; anchor links blocked while scrolling unless `anchors: true`; no CSS scroll-snap (use its snap plugin); Safari capped at 60 fps (30 in low power). (verified)
- Keyboard behaviour is not documented; test Tab, Space, PageDown, Home, End yourself. (verified: absent)
- Argument against smooth scroll: it overrides the feel the person chose in their OS, adds lag, and can fight assistive tech. Use it only when something (a canvas) must stay in step with scroll. (unverified; echoed by 14islands below)
Notable: an opt-out-of-nothing-by-default library; safer than hand-made scroll hijacking.

## Motion (motion.dev) scroll APIs
Link: https://motion.dev/docs/scroll
Made by: Matt Perry / Motion. Licence: MIT (unverified; page did not say).
Rules:
- `scroll()` links a callback or animation to scroll progress (0 to 1). It uses the native ScrollTimeline when present. (verified)
- Options include `container`, `axis`, `target`, `offset`; it returns a stop function to call on cleanup. (verified)
- For pinning, use `position: sticky`, not JavaScript. (verified)
- `inView()` runs code when an element enters the viewport; `useScroll` is the React hook. (unverified; page barely covered them)
- Honour reduced motion with `useReducedMotion` or `MotionConfig reducedMotion="user"`. (unverified)
Notable: sticky for pinning matches the native CSS advice.

## Nielsen Norman Group: Scrolljacking 101
Link: https://www.nngroup.com/articles/scrolljacking-101/
Made by: NN/g. Licence: all rights reserved; read only.
Rules:
- Scrolljacking = changing scroll speed or direction. Their tests found disorientation, lost time, failed tasks, and users who thought the page was broken. (verified)
- Longer jacks, sideways movement, and text to read during the jack make it worse. (verified)
- Acceptable only with a clear job: reveal information in steps, break complex content down, or support a story. (verified)
- Keep it short and return to normal scrolling fast. (verified)
- Test the scroll rate: not so fast people miss content, not so slow it tires them. (verified)
- Never change scroll direction. (verified)
- Keep key text out of it; text that appears then vanishes strains memory. (verified)
- Avoid on mobile; use only below the fold; never jack the whole page; keep a visible nav as an exit. (verified)
Notable: the strongest evidence against full-page scroll hijacking.

## Nielsen Norman Group: Animation purpose in UX
Link: https://www.nngroup.com/articles/animation-purpose-ux/
Made by: NN/g. Licence: all rights reserved; read only.
Rules:
- Good jobs for motion: feedback, state change, spatial orientation, reducing disorientation, hints about gestures. (verified)
- Bad: distraction, many animations at once, filler during waits, motion instead of clear labels, motion that pressures people (flashing countdowns). (verified)
- Keep animation brief and subtle. The page gave no millisecond values. (verified)
Notable: "motion should explain, not entertain" is the test for every effect.

## WCAG 2.2 Understanding pages (2.2.2, 2.3.1, 2.3.3, 2.1.1, 1.4.13) and technique C39
Link: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html (siblings: animation-from-interactions, three-flashes-or-below-threshold, keyboard, content-on-hover-or-focus; Techniques/css/C39)
Made by: W3C WAI. Licence: W3C Document License (copy with attribution, no changes).
Rules:
- 2.2.2 (Level A): moving content that starts by itself, sits beside other content and lasts over 5 seconds needs pause, stop or hide. Auto-updating content has no 5 s exception. One control for the whole page is fine. (verified)
- 2.3.3 (Level AAA): motion started by the user's action must be switchable off unless essential. (verified)
- Their non-essential examples: parallax, decorative elements sliding in on scroll, page-flip transitions. Motion that simply brings new content into view is fine. (verified)
- Technique C39: use the CSS `prefers-reduced-motion` query, either "turn motion off when reduce" or "motion only when no-preference". Test with the OS setting on. (verified)
- 2.3.1 (Level A): no more than 3 flashes in any second, or keep the flashing area under about 341 x 256 CSS px (on a 1024 x 768 screen). (verified)
- 2.1.1 (Level A): everything works from a keyboard, without precise timing. Only freehand-path input is exempt. (verified)
- 1.4.13 (Level AA): extra content shown on hover or focus must be dismissible (Esc), hoverable, and persistent. (verified)
Notable: 2.3.3 is AAA, but it is the right bar for a motion-heavy page; treat it as required.

## MDN: prefers-reduced-motion
Link: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
Made by: Mozilla contributors. Licence: CC BY-SA 2.5 (unverified).
Rules:
- Values: `no-preference` and `reduce`. In all major browsers since January 2020. (verified)
- Write the normal animation first, then override it in a `reduce` block (same strength, later in the file). (verified)
- Replace big motion (scaling, panning large objects) with fades or colour changes. (verified)
- Reduced motion does not mean no feedback; small non-moving transitions are still fine. (verified)
- Test on a real device with the OS setting on. (verified)
Notable: the setting lives in the OS; the site never knows why the person turned it on.

## A List Apart (Val Head) and WebKit: motion sensitivity
Link: https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/ ; https://webkit.org/blog/7551/responsive-design-for-motion/
Made by: Val Head; WebKit team. Licence: all rights reserved; read only (unverified for both).
Rules:
- Risky: large movement compared with screen size (full-screen wipes), parallax, motion against the scroll direction, sudden sideways shifts while scrolling down, fast 3D zoom, uncontrollable carousels. (verified, ALA)
- Risky per WebKit: scaling/zooming, spinning, vortex effects, mixed speeds or directions, 2.5D plane tilts, constant motion near text or screen edges. (verified, WebKit)
- Lower risk: opacity, colour and blur changes; small contained movement; motion that follows the person's own scroll. (verified, ALA)
- User-controlled direct manipulation (pinch to zoom) is generally fine. (verified, WebKit)
- Remove only known triggers. If a motion carries meaning, swap it for a simpler cue instead of deleting it. (verified, WebKit)
- Listen for changes with `matchMedia('(prefers-reduced-motion: reduce)')` so the page reacts when the setting flips. (verified, WebKit)
- Offer an in-page motion switch as well as the OS setting; give pause controls on anything looping. (verified, ALA)
Notable: Apple's own product pages swapped 3D zoom for plain scrolling and froze spinning backgrounds under the setting.

## MDN canvas, Chrome autoplay policy, web.dev LCP
Link: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas ; https://developer.chrome.com/blog/autoplay ; https://web.dev/articles/optimize-lcp
Made by: Mozilla; Google Chrome; Google web.dev. Licence: CC BY-SA 2.5; CC BY 4.0 (unverified for each).
Rules:
- A canvas is only a picture; assistive tech cannot see shapes in it. MDN advises avoiding canvas in accessible sites where possible. (verified)
- Put fallback text inside `<canvas>...</canvas>`. Interactive children inside are limited to links, buttons and checkbox/radio/button inputs. (verified)
- A canvas has no built-in role; any ARIA role may be set. (verified)
- Keep real controls as focusable HTML (buttons, links) outside or over the canvas, not drawn shapes. (unverified, common practice)
- Mark purely decorative canvas `aria-hidden="true"` and keep headings and copy as real HTML. (unverified)
- When the camera moves, keep focus on the real control; never move focus for the person. (unverified)
- Chrome always allows muted autoplay; sound needs a user click or tap (or a high Media Engagement score). (verified)
- LCP: good is 2.5 s or less, poor is over 4.0 s. (verified)
- Put the hero in the HTML, give it high fetch priority, never lazy-load it, and do not hide it until JavaScript finishes. (verified)
Notable: the LCP rule alone says a long preloader that hides the hero is a performance failure.

## 14islands: progressive enhancement with WebGL
Link: https://14islands.com/blog/progressive-enhancement-with-webgl-and-react
Made by: 14islands (studio). Licence: all rights reserved; read only.
Rules:
- Start with a text baseline that works without JavaScript; add effects and WebGL only where the device can take it. (verified)
- Lay out text in normal HTML and CSS and use DOM elements as stand-ins for WebGL objects. Do not turn text into textures. (verified)
- Preloaders that fetch every texture first make impatient visitors leave; many projects cannot afford that. (verified)
- JavaScript virtual scroll looks smoother but is slower than native and causes accessibility problems; projects needing a high bar should skip it. If you use a library, keep the native scrollbar. (verified)
- Huge images cause stutter when first sent to the GPU. (verified)
- If load time and wide device support rank first, do not use WebGL at all. (verified)
Notable: the one studio source here that argues for restraint, with reasons.

## The Pudding + Scrollama (newsroom scrollytelling)
Link: https://pudding.cool/process/responsive-scrollytelling/ ; https://github.com/russellsamora/scrollama
Made by: The Pudding; Russell Samora. Licence: article all rights reserved; read only. Scrollama MIT.
Rules:
- Size each step from `window.innerHeight` in pixels, not CSS `vh`, because phone toolbars change `vh` while scrolling. (verified)
- Design mobile first or early; fewer steps on small screens. (verified)
- Avoid steppers (forced clicks) and swipe interfaces (they override native scroll). (verified)
- If each step works as its own chart, or performance is tight, stack static charts instead of scrollytelling. (verified)
- Avoid hover effects; they fire by accident while scrolling. (verified)
- Scrollama watches steps with IntersectionObserver, not scroll events. Default trigger at 0.5 of the viewport; override per step with `data-offset`; prefer pixel offsets on mobile. (verified)
- Scrollama's page says nothing on accessibility, so add it: step text is real headings and paragraphs in reading order, readable with no JavaScript. (unverified, my advice)
- One sticky graphic plus ordinary text steps beside it; screen readers read the steps in order. (unverified)
Notable: the pattern is "text is always HTML; the graphic reacts to which step is visible".

## Wikipedia: Twelve basic principles of animation
Link: https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation
Made by: Wikipedia contributors, summarising Frank Thomas and Ollie Johnston, "The Illusion of Life" (1981). Licence: CC BY-SA 4.0 (unverified).
Rules:
- The twelve: squash and stretch, anticipation, staging, straight-ahead/pose-to-pose, follow-through, slow in and slow out, arcs, secondary action, timing, exaggeration, solid drawing, appeal. (verified)
- Staging: make the one important idea clear and cut detail. On a page: one subject per beat. (verified)
- Slow in and slow out: things ease at start and end. On a page: ease-out, never linear. (verified)
- Timing sets weight and mood: light things are quick, heavy things slow. (verified)
- Shot language mapped to web (my mapping): establishing shot = hero; medium = feature beat; close-up = one detail or number; cut = instant section change; dissolve = fade between states. (unverified)
Notable: "ease is acting" is a film-craft saying (unverified); the verified part is slow in and slow out.

## Not fetched
- Codrops ZERO case study (tympanus.net, July 2026): HTTP 403. Only a search snippet seen. No rules taken.
- NYT, Active Theory, Lusion, Resn, Locomotive, Unseen Studio, Immersive Garden: not fetched; no rules taken.
- Disney principles: read via Wikipedia, not a Disney page.

## Numbers table
| Number | Meaning | Source | Status |
|---|---|---|---|
| 5 s | moving content longer than this needs pause/stop/hide | WCAG 2.2.2 | verified |
| 3 per second; 341 x 256 px | flash limit and area | WCAG 2.3.1 | verified |
| 2.5 s / 4.0 s | LCP good / poor | web.dev | verified |
| lerp 0.1, duration 1.2 s | Lenis defaults | Lenis README | verified |
| scrub number = seconds to catch up | GSAP smoothing | GSAP docs | verified |
| scrub 0.5 to 1 | pleasant smoothing | house default | unverified |
| 0.5 | Scrollama default trigger point | Scrollama | verified |
| Chrome/Edge 115, Firefox 159, Safari 26 | scroll-driven animations | Chrome docs badges | verified |
| Chrome/Edge 111, Firefox 144, Safari 18 | same-doc view transitions | Chrome docs | verified |
| Chrome/Edge 126, Safari 18.2 | cross-doc view transitions | Chrome docs | verified |
| 100-150 ms hover, 200-300 ms panels, never over 400 ms in everyday UI | motion durations | AGENTS.md section 12 | project rule |
| 200-500 ms | page transition length | house default | unverified |
| 100 to 150 vh per beat (one idea) | scroll length per beat | house default | unverified |
| 3 to 6 beats; pinned run under about 5 viewport heights | most a pinned section should last | house default (NN/g says only "short") | unverified |
| content readable within 1 to 2 s; any preloader under about 2 s; never gate the hero | load limit | house default, anchored to LCP 2.5 s | unverified |
| 7 s, 200 x 140 px | what counts toward Chrome's media engagement | Chrome autoplay | verified |

## Reduced-motion equivalents
- Parallax layers -> layers fixed, or one slow single-speed move; no mixed speeds.
- Scrubbed animation -> final state shown at once, or a short fade-in as the section enters (about 200 ms).
- Pinned multi-step section -> normal flow: each step is a plain block in order.
- Camera fly-through / 3D zoom -> one still frame per section, cross-fade between them.
- Full-screen wipe or slide page transition -> instant change or a 150 ms cross-fade.
- View transition -> remove the `::view-transition-*` animations; keep the navigation.
- Smooth-scroll library (Lenis) -> off (it does this itself); native scroll.
- Autoplay or looping background video -> poster image with a visible Play button; no loop.
- Spinning or floating decoration -> static image.
- Hover tilt, magnetic cursor, split-text movement -> colour or opacity change only.
- Auto-advancing carousel -> manual with arrows, or paused with a visible Pause.
- Sound -> off by default always; never starts by itself.

## Conflicts and open questions
- Pinning: NN/g says avoid scrolljacking; The Pudding and Motion use sticky for scrollytelling. Reconcile: sticky, native scroll speed and direction, short, then normal flow resumes.
- CSS sticky vs GSAP pin: sticky keeps native feel and is simpler; GSAP pin adds spacer elements but gives timelines. Prefer sticky unless a timeline is needed (my view).
- WCAG 2.3.3 is AAA but a motion-heavy page should still meet it. Decision for the skill: required.
- Motion's licence and Scrollama accessibility were not confirmed on the pages; check the repos before naming a licence.
- No source measured how long a pinned section can be before people give up; NN/g says only "short". The 5 viewport-height cap is a guess; test it.
- Cross-document view transitions lack Firefox; plain page change is the fallback.
- Scroll-driven animations only reach Baseline around Oct 2026 and Firefox 159 is new, so keep the `@supports` fallback.
- Still to read: Codrops ZERO and Pell Mell, studio notes on sound and preloaders, newsroom scrollytelling posts.
