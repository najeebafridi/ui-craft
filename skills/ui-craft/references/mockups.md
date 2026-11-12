# Fast clickable mockups (for client approval)

Load this when the user wants a quick look-and-feel, a prototype, a mockup, "show the client", or several design options **before** real code is written.

The goal: the client approves the look in a day, not a month. Mockups are throwaway. Speed beats perfection. But they must look real, because clients judge what they see.

## The rules

1. **One HTML file per screen.** No build step, no framework, no npm. Plain HTML + CSS in a `<style>` tag + a few lines of JS if needed. It opens with a double-click.
2. **Start from `assets/mockup-template.html`.** It has tokens, an app shell, a light/dark toggle and a feedback tool. Copy it for each screen.
3. **Same tokens in every file.** Copy the `:root` block unchanged into every screen so they match. If you change a colour, change it in all files.
4. **Real content.** Real-sounding names, numbers, dates and text from the client's world. Never lorem ipsum. Clients cannot judge a layout full of fake Latin.
5. **Clickable where it matters.** Link screens with plain `<a href="02-list.html">`. Make the main path work: list → detail → edit → back. Other links can be `href="#"`.
6. **Show the main interaction in use.** If the screen is about choosing (a time slot, a plan, a filter), show it with a realistic choice already made, so the client sees the result, not only the empty start.
7. **Show states, cheaply.** Add `?state=empty` / `?state=error` support, or make separate files (`02-list-empty.html`). Clients forget empty and error states unless they see them.
8. **Responsive is required.** Clients open links on their phone. Check at 390px and 1440px.
9. **Mark it as a mockup.** Put "Mockup v1" in the `<title>`. Sample data looks real, so say it is sample data if it could be mistaken for live numbers.

## File layout

```
mockups/
  index.html              ← list of all screens with one-line descriptions (links)
  01-dashboard.html
  02-invoice-list.html
  02-invoice-list-empty.html
  03-invoice-detail.html
  04-new-invoice.html
  options/
    options-board.html    ← side-by-side comparison (from assets/options-board.html)
    option-a.html
    option-b.html
    option-c.html
```

Number files in the order of the user's journey so they sort correctly.

## Which screens first

Build in this order and stop as soon as the client can decide:

1. **The screen users see most** (usually the dashboard or the main list). This sets the look for everything.
2. **The core task screen**: the detail or edit page where the main job happens (create invoice, book appointment, check out).
3. **One form** (sign-up, settings or the create flow). Forms show whether the style works for real input.
4. **Empty state and one error state** of screen 1 or 2.
5. **Phone view** of screen 1, if mobile matters.
6. Only then: marketing page, settings, admin, edge screens.

Three to five screens is usually enough for approval. Don't mock every screen; the real build will reuse the patterns.

## Showing options side by side

When the direction is not decided, make **2–3 options of the same screen** (normally screen 1):

- **Same content and data in every option.** Only the design changes, so the client compares looks, not data.
- **Make them clearly different**, not three shades of the same idea. Vary one or two big things:
  - density (calm and spacious vs compact and data-rich)
  - colour mood (neutral + one accent vs warmer brand colour vs dark theme)
  - layout (sidebar vs top bar; chart-first vs table-first)
  - type (one clean sans vs a display font for headings)
- **Give each option a name and one line on who it suits**: "B · Bold and visual — for managers who skim".
- **Never more than 3.** More options = harder decision and weaker options.
- Put them in `options-board.html` (from `assets/`). It shows all options at desktop or phone width, lets the client pick one and write notes, then copy their choice as text.
- After the client picks, **merge in the parts they liked** from the others, then build screens 2–5 in that style only.

## Collecting feedback

The template has a built-in feedback tool (bottom-right):

- **Feedback** (small button, bottom-right) opens the panel and shows **Add comment** and a light/dark toggle. It starts collapsed so it does not cover the design.
- **Add comment** → click anywhere on the screen → type a note. A numbered pin appears there.
- **Feedback (n)** → see all notes → **Copy all** or **Download .txt** → paste it into email or chat.
- Notes are saved in the client's own browser (localStorage). Nothing is sent anywhere.

Ask for feedback in a way that gets useful answers:

- Ask about **tasks**, not taste: "Can you find which invoices are overdue? Is anything confusing?" beats "Do you like it?".
- Ask **three specific questions** with each round, e.g. "Is the amount of information on the dashboard right? Does the colour fit your brand? Is anything missing from the invoice page?"
- Get **one combined list** back. Number it. Reply to each item with "done", "changed to…", or "not doing, because…". This avoids endless loops.
- Fix in rounds: v1 → feedback → v2 → feedback → approved. Put the version in the `<title>` and keep old versions in a folder (`v1/`) so you can go back.

## Sharing

- Zip the `mockups/` folder, or
- host it as static files (any static host, a private link, or the AI tool's own artifact/preview feature if it has one). Keep the link private; mockups are not the real product.
- Fonts load from Google Fonts in the template. If the client is offline or blocks it, the system font fallback still looks fine.

## From mockup to real code

- Mockups are **not** production code. Don't ship them.
- What carries over: the **tokens** (colours, spacing, radius, type), the **layout decisions** and the **copy**. Move the `:root` tokens into the real project's theme (Tailwind config, CSS variables, native theme file).
- Write the agreed brief into the project (e.g. `DESIGN.md`) so every future screen follows it.

## Speed tips

- Build the shell (nav + page header) once in screen 1, then copy it.
- Use inline SVG icons (simple 24×24 strokes) or one icon font from a CDN. Don't spend time on custom icons.
- Charts in mockups: a simple inline SVG line/bar shape is enough. Don't wire up a chart library unless the client must see interaction.
- Images: use real product screenshots or the client's photos when you have them. Otherwise use neutral shapes with a caption ("Product photo here"), not random stock or placeholder services.
- Timebox: a first screen in under an hour, each further screen in 15–30 minutes.

## Common mistakes

- Mocking 15 screens before the client has approved the look of one.
- Three options that look almost the same.
- Different colours or spacing on each screen because tokens were retyped instead of copied.
- Only the happy path: no empty, error or phone view.
- Asking "What do you think?" and getting "Looks nice" (no useful feedback).
- Letting mockup code become the real app.
