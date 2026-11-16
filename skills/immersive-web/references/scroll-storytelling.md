# Scroll storytelling

Load this when the page tells a story as the person scrolls: a pinned scene with steps, scroll-linked animation, a "scrollytelling" feature, parallax requests.

## The idea (any medium)

Scroll storytelling is a slide show the reader controls with their thumb. It works when **the reader sets the pace and every step says one thing**.

- **Beats.** A beat is one idea: a line of text plus one change in the picture. Write the beats as a list before designing anything:
  ```
  1 Establish   The whole kettle.                    "Thrown by hand in Stoke since 1982."
  2 Detail      Close on the spout.                  "A spout cut to stop the drip."
  3 Proof       Pouring; the stream holds its line.  "Pours clean from first cup to last."
  4 Invitation  The set on a table.                  "From £48."  [Choose your glaze]
  ```
  Three to five beats. If a beat has no sentence worth reading, cut it. A story of nine beats is a story nobody finishes.
- **Structure.** Establish, develop, pay off. The last beat hands over to action (the product, the button, the next chapter). End strongly: people remember the end.
- **The reader is in charge.** Scrolling forward advances; scrolling back rewinds exactly; stopping stops. Nothing plays by itself for long, and nothing forces the pace.
- **Text and picture take turns.** When the picture changes, the text is short. When the text matters, the picture holds still.
- **A way out.** Offer "Skip the story" at the start, and never trap someone who only wanted the price.
- **It must survive being flattened.** With motion off, on a slow phone, or read aloud, the same beats work as plain sections: picture, heading, sentence. If the story only works animated, it is a demo, not a story.

## On the web

### The standard build: sticky scene, scrolling steps

The text steps are ordinary HTML in the normal flow. The scene sits beside (desktop) or above (phone) them and sticks while they pass.

```html
<section class="story">
  <div class="stage" aria-hidden="true">  <!-- sticky; holds the canvas and its fallback -->
    <img class="scene-fallback" src="kettle.avif" alt="">
  </div>
  <ol class="steps">
    <li data-beat="1"><h2>A spout cut to stop the drip</h2><p>…</p></li>
    <li data-beat="2">…</li>
  </ol>
</section>
<a id="after-story"></a>
```
```css
.story { display: grid; grid-template-columns: 1fr 1.2fr; }
.stage { position: sticky; top: 0; height: 100vh; grid-column: 2; grid-row: 1; }   /* 100dvh where supported */
.steps > li { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; }
@media (max-width: 860px) {
  .story { display: block; }
  .stage { height: 40vh; z-index: 1; background: var(--bg); }      /* scene pinned on top, steps pass below */
  .steps > li { min-height: 55vh; justify-content: flex-start; padding-top: 24px; }   /* text starts right under the scene: no empty gap */
}
```

On a phone the pinned scene and the current step's text must be visible **together** in one screen, with the subject filling its stage. A small object at the top, a dark gap, and text far below is the most common phone failure: open the phone screenshot at the middle of the story and check.

- `position: sticky` keeps native scrolling, the scrollbar, keyboard scrolling and find-in-page. Avoid libraries that pin by taking over the scroll.
- Sticky fails silently if an ancestor has `overflow: hidden/auto` or the sticky box has no room to travel. In a grid, let the stage span every row of the story.
- **Length.** About 80-150vh of scroll per beat on desktop, 50-80vh on phones. The whole pinned run stays under about five screens. Longer feels like being stuck.
- **Only add the story layout once the scene is running** (for example a `data-story` attribute set by script). Until then, and whenever the scene fails, the steps are a normal list with the poster beside them.

### Reading the scroll

- Work out progress from the steps' positions: which step is nearest the middle of the screen, and how far between it and the next. Measure positions once (and on resize), not on every scroll event.
- Listen with `{ passive: true }`, store the number, and let the render loop use it. Do no layout reads or heavy work inside the scroll handler.
- Ease **between** beats (smoothstep) so the scene dwells on each beat and moves in between; follow with a short damping (100-200 ms) so wheel steps do not look jerky. Take the damping from the theme tempo.
- Mark the active step (`.is-active`) for a quiet highlight. Do not dim the other steps below readable contrast.
- CSS scroll-driven animations (`animation-timeline: scroll()` / `view()`) can do reveals, progress bars and simple scrubs with no JavaScript and no main-thread work. Wrap them in `@supports (animation-timeline: view())` with a static default, and in `@media (prefers-reduced-motion: no-preference)`.
- A scroll library (GSAP ScrollTrigger, Motion's `scroll`) is worth it only for timelines CSS cannot express. ScrollTrigger's `matchMedia` should switch the whole timeline off for reduced motion and narrow screens.

### What never to do

- Change scroll speed or direction, snap whole screens by force, or scroll sideways when the wheel goes down.
- Replace the scroll with a transform on a wrapper ("virtual scroll"): it breaks the scrollbar, anchors, find-in-page, keyboard and assistive tech.
- Add smooth-scroll smoothing to "feel premium". If the brief insists, use one that keeps native scroll position, and turn it off under reduced motion and on touch.
- Autoplay the story by time. Time-based parts are short (under about a second), triggered by reaching a beat, and finish by themselves.
- Parallax on text. Moving layers at different speeds is the motion most likely to make people ill; keep it off words and very small on images.
- Hide the content of later beats until scripts run. They are in the HTML from the start.

### Keyboard, screen readers, deep links

- Steps are real headings and paragraphs in DOM order, so a screen reader reads the story straight through. The stage is `aria-hidden="true"` when it only illustrates.
- Space, Page Down and arrow keys scroll natively because scrolling is native. Do not capture them.
- Give each beat an `id` so it can be linked to, and make the skip link (`<a href="#after-story">Skip the story</a>`) the first focusable thing in the story.
- If the scene shows information that is not in the step text (a number, a label), put it in the text too.
- Focus must never be moved by scrolling, and a focused element must not be hidden under the sticky stage: give steps `scroll-margin-top` equal to the stage height on phones.

### Reduced motion: the film becomes slides

| Full | Reduced |
|---|---|
| Scrubbed scene between beats | one still frame per beat; the change is a cut or a 150-200 ms cross-fade |
| Camera travel | fixed camera, a new still per beat |
| Parallax layers | layers fixed |
| Step text fading or sliding in | text simply present |
| Smooth scrolling | native |

The sticky layout itself may stay (it is not motion). Round the progress to whole beats and render on demand.

### No WebGL, no JavaScript

The steps are a normal list. Give each one its own still image (the poster for that beat), so the story is complete as a plain illustrated article.

## Common mistakes

- Nine beats, each a full screen of scrolling. Fix: 3-5 beats, shorter runs, a skip link.
- The scene animates but the text says nothing. Fix: write the sentence for each beat first.
- Scroll feels heavy or laggy. Fix: remove the smooth-scroll library; passive listener; render on demand.
- Works on desktop, broken on phones (the stage covers the text). Fix: stage 40vh on top, steps below, `scroll-margin-top`.
- Blank page when the script fails. Fix: plain layout by default; story layout only when the scene is live.
