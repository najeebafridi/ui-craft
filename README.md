# ui-craft

**Design skill for AI coding agents.** With ui-craft, the screens your AI builds look premium, fit the people who use them, are easy to use, and get done fast.

The plugin holds two skills that share one theme. **ui-craft** designs the interface. **immersive-web** adds 3D scenes, shaders, scroll stories and cinematic motion on top, and keeps them fast and accessible. Each loads only when its kind of work comes up.

It works for any kind of software: web apps, dashboards, admin tools, desktop apps, mobile apps and marketing sites. It works in Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, Windsurf, Cline and any tool that reads `AGENTS.md`.

## Try it in your browser: ui-craft Studio

**[https://najeebafridi.github.io/ui-craft](https://najeebafridi.github.io/ui-craft/)**

A free visual tool, no install and no AI needed:

1. Pick one of 16 visual directions.
2. Set your brand colour, fonts, corner shape, depth, density and motion.
3. Watch five live screens change (dashboard, landing page, mobile app, components, and an **Immersive** screen with a real 3D scene that follows your theme), in light and dark, on desktop and phone.
4. Choose how much 3D and scroll effect the product should carry: none, a quiet accent, one hero moment, or a scroll story. The Immersive screen can also be previewed with reduced motion and with no WebGL.
5. Export the theme for **CSS, Tailwind, SwiftUI, Jetpack Compose, Flutter or JSON**, plus a **design brief** to paste into any AI coding tool. The brief includes an "Immersive and motion" section.

Every colour is checked for accessibility contrast as you go. "Copy link" gives you a link to send to a client.

## What it does

When your AI builds a screen, ui-craft makes it:

1. **Check the project first.** If you already have colours, fonts or a component library, it uses them.
2. **Think about the person.** Who uses this, in what state of mind (rushed, anxious, sceptical, expert), and what should they feel?
3. **Choose a visual direction on purpose.** 16 ready directions, from a quiet developer tool to a luxury house to a playful learning app. Each sets colours, fonts, shape, depth, motion and voice that belong together.
4. **Build colours properly.** One command turns your brand colour into a full light and dark colour system where every text and border colour passes accessibility contrast.
5. **Follow clear rules with real numbers**: spacing and type scales, 44px tap targets on phones, loading, empty and error states, platform conventions for iOS, Android, Mac and Windows.
6. **Finish like a designer**: layered shadows, tuned letter-spacing, press feedback, one signature detail. These small things are what make a screen look expensive.
7. **Check the result** with a script that scores the page, lists fixes and saves screenshots.
8. **Stay honest.** It uses psychology to reduce effort and build trust, and refuses manipulative "dark patterns".

It also helps you **win client approval fast** (clickable mockups, design options side by side, click-to-comment feedback) and **score an existing product** out of 100 with a ranked list of fixes.

**Example.** Ask *"Build the room-selection screen for our luxury hotel booking app"*:

- **Without ui-craft:** a generic card grid in default blue.
- **With ui-craft:** it picks the "Maison" direction (warm stone neutrals, a deep green, a display serif, square corners, lots of space), writes a brief about the guest and the feeling, shows the full price for the stay, and finishes the details.

### The 16 directions

Open [skills/ui-craft/assets/directions/gallery.html](skills/ui-craft/assets/directions/gallery.html) in a browser to see them all, in light and dark.

| Direction | For |
|---|---|
| Calm productivity | general SaaS, task tools, CRMs |
| Quiet instrument | developer tools, power-user B2B |
| Paper and ink | writing, notes, docs, publishing |
| Studio gloss | premium consumer products, flagship pages |
| Maison | luxury, hotels, fashion, private banking |
| Apothecary editorial | skincare, craft food, boutiques |
| Soft wellness | meditation, therapy, patient and family apps |
| Playful game-feel | learning, kids, habit apps |
| Trusted ledger | banking, accounting, invoicing |
| Neo-bank bold | consumer fintech, bold consumer apps |
| Public clarity | government, health portals, forms for everyone |
| Open-air marketplace | travel, rentals, food delivery |
| Stage dark | music, video, gaming, events |
| Athletic monument | sportswear, campaigns, product drops |
| Graph-paper technical | APIs, infrastructure, data and AI platforms |
| Bright workshop | creative tools, agencies, launch pages |

### A palette from your brand colour

```bash
node .agents/skills/ui-craft/scripts/palette.mjs --accent "#0F766E" --neutral warm --out theme.css
```

You get background, surface, text, border, accent, status and chart colours for light and dark themes. Every pair is checked: if white text would fail on your brand colour, the script adjusts it and tells you.

## Immersive web: 3D, shaders and scroll stories

Ask for a 3D hero, a shader, a scroll-driven story, page transitions, or "make it feel cinematic", and the **immersive-web** skill takes over. It works with Three.js, React Three Fiber, plain WebGL, WebGPU and CSS, and covers the path from Blender to the browser.

It follows eight hard rules:

1. **Content first.** Headings, copy and buttons are real HTML. The scene sits on top and can vanish without loss.
2. **Three states for every effect:** full, a still version for people who ask for reduced motion, and a fallback when the device has no WebGL.
3. **A speed budget.** Text paints first, the 3D engine loads after, phones get a lighter scene.
4. **One signature moment per page**, not effects everywhere.
5. **Never take over the scroll.**
6. **Keyboard and screen readers** reach everything real.
7. **Motion rests, sound waits, nothing flashes.**
8. **Original and licensed** work only.

**One theme drives everything.** The scene reads the same theme tokens as the page (`--accent`, `--bg`, `--surface`, the motion tokens), so any of the 16 directions can colour a 3D scene, a shader palette or a motion style, in light and dark. Each direction also says how far to go, on a ladder from 0 (still) to 3 (scroll story). A finance tool stays at 0; a product launch may go to 3.

**It mixes.** `skills/ui-craft/references/mixing.md` explains how to borrow the language of one genre for another medium (a game or sci-fi look on a website, film-style motion in a desktop app) while the platform keeps its normal navigation, accessibility holds and the work stays original. `skills/immersive-web/references/beyond-web.md` covers desktop apps (Electron, Tauri, native), mobile apps and dashboards, and says plainly where 3D does not belong.

**It checks its own work:**

```bash
node .agents/skills/immersive-web/scripts/immersive-check.mjs page.html
```

The script opens the page five ways (desktop, phone, reduced motion, no WebGL, no JavaScript). It measures page weight, what loads before first paint, draw calls, the phone's pixel ratio, native scrolling, and whether the scene pauses off screen. It saves screenshots of every case. It cannot measure frame rate or judge beauty.

**Honest limit:** an AI can direct a scene, light it, write shaders and wire a model in. It cannot sculpt film-quality 3D art from nothing. For that you still need a 3D artist or a licensed model.

## Install


### Claude Code (plugin, recommended)

```
/plugin marketplace add najeebafridi/ui-craft
/plugin install ui-craft@ui-craft
```

Or from a terminal: `claude plugin marketplace add najeebafridi/ui-craft`, then `claude plugin install ui-craft@ui-craft`.

Both skills load by themselves: ui-craft whenever you ask for UI work, immersive-web when you ask for 3D, shaders, scroll animation or a cinematic feel. You can also call them directly with `/ui-craft:ui-craft` and `/ui-craft:immersive-web`.

**Without the plugin system:** copy the `skills/ui-craft` and `skills/immersive-web` folders to `~/.claude/skills/` (all your projects) or `.claude/skills/` (one project).

### Codex, Cursor, Gemini CLI, GitHub Copilot, Windsurf

These tools read skills from a shared folder, `.agents/skills/`. Copy the skill there, plus `AGENTS.md`:

```bash
git clone https://github.com/najeebafridi/ui-craft /tmp/ui-craft
mkdir -p .agents/skills
cp -r /tmp/ui-craft/skills/ui-craft .agents/skills/ui-craft
cp -r /tmp/ui-craft/skills/immersive-web .agents/skills/immersive-web   # optional: 3D, shaders, scroll stories
cp /tmp/ui-craft/AGENTS.md ./AGENTS.md        # or paste its contents into your existing AGENTS.md
```

On Windows PowerShell, use `Copy-Item -Recurse` instead of `cp -r`.

For every project, copy the folder to `~/.agents/skills/ui-craft` instead.

| Tool | What it reads | Notes |
|---|---|---|
| **Codex** | `.agents/skills/` and `AGENTS.md` | Restart Codex if the skill does not show up. |
| **Cursor** | `.agents/skills/` and `AGENTS.md` | Nothing else to do. |
| **Gemini CLI** | `.agents/skills/` | Or run `gemini skills install https://github.com/najeebafridi/ui-craft --path skills/ui-craft`. To also read `AGENTS.md`, add `"context": {"fileName": ["AGENTS.md", "GEMINI.md"]}` to `settings.json`. |
| **GitHub Copilot** | `.agents/skills/` (or `.github/skills/`) and `AGENTS.md` | Works in VS Code agent mode, the Copilot CLI and the cloud agent. |
| **Windsurf / Devin** | `.agents/skills/` and `AGENTS.md` | Nothing else to do. |
| **Cline** | `.claude/skills/` or `.cline/skills/`, and `AGENTS.md` | Copy the folder to `.cline/skills/ui-craft` instead. |
| **Any other tool** | `AGENTS.md` | Keep the folder at `.agents/skills/ui-craft`: `AGENTS.md` points there for the detailed guides. |

## What's inside

```
skills/ui-craft/
  SKILL.md                  the core rules and workflow (short; always loaded)
  references/               detailed guides, loaded only when needed
    directions.md       premium-craft.md     color-theory.md      psychology-emotion.md
    platforms.md        layout-spacing.md    color-dark-mode.md   typography.md
    forms.md            tables-lists.md      dashboards-charts.md navigation.md
    feedback-states.md  accessibility.md     motion.md            mobile-touch.md
    review-checklist.md mockups.md           review-mode.md       mixing.md
  assets/
    tokens.css              base design tokens (light + dark, contrast-checked)
    directions/             16 visual directions (one small CSS file each) + gallery.html
    mockup-template.html    one-file screen mockup with a feedback tool
    options-board.html      show 2-3 design options side by side
  scripts/
    palette.mjs             build an accessible colour system from a brand colour
    ui-audit.mjs            measure, score and screenshot a page or live URL (needs Chrome)
  evals/                    test cases used to check the skill
skills/immersive-web/
  SKILL.md                  hard rules, workflow, budgets, the immersion ladder (short)
  references/               theme-bridge, scene-camera, materials-lighting, shaders, scroll-storytelling,
                            cinematic-motion, blender-pipeline, performance, accessibility-fallbacks, beyond-web
  assets/
    theme-bridge.js         reads the theme tokens for a 3D scene, shader or canvas
    scene-shell.js          scene life cycle with fallbacks, reduced motion and pausing built in
    starter.html            a working page with both; replace its placeholder scene
  scripts/
    immersive-check.mjs     test a page five ways and screenshot each (needs Chrome)
AGENTS.md                   the same core rules for Codex, Cursor, Gemini, Copilot…
docs/index.html             the Studio (one self-contained page, hosted on GitHub Pages)
```

All scripts need Node 22 or newer and no npm packages.

### The audit script (also used by review mode)

```bash
node .agents/skills/ui-craft/scripts/ui-audit.mjs page.html
```

It opens the page in headless Chrome at desktop (1440px) and phone (390px) width. It lists problems like these:

```
- [phone] 8 tap target(s) under 44px: Overview, Orders, Settings
- 4 text element(s) below WCAG AA contrast, e.g. "Delivered" 4.37:1
```

It also saves screenshots. It needs no npm packages. It cannot judge taste, so still look at the screenshots.

## Score your existing product

Ask your AI something like:

> "Review our app at https://app.example.com: score it and tell me what to fix first."

It will:

1. **Measure** each page automatically: contrast, tap targets, phone layout, focus, text sizes, labels and more. This gives a **measured score** out of 100.
2. **Look** at desktop and phone screenshots and score 10 design areas: first impression, hierarchy, layout, type, colour, components, copy, feedback states, mobile, and the "AI look". This gives a **design score** out of 100.
3. **Report** an overall score with a grade, plus the top fixes, biggest win first. Each fix comes with the exact change. Example: *"Overall 71/100 (C). Fix 1: three solid buttons compete on /invoices. Keep 'New invoice' solid, make 'Export' an outline button."*
4. **Fix and re-score** if you ask, so you see the progress (for example 71 → 86).

**Whole app?** Ask it to "review every screen". It measures all pages with the script (almost no AI usage), groups pages that share a layout, design-scores one page per group with a cheaper model, and writes one app-wide report with fixes that apply everywhere listed first.

Just the measured part, from a terminal:

```bash
node .agents/skills/ui-craft/scripts/ui-audit.mjs https://your-site.com https://your-site.com/pricing --json scores.json
```

```
https://your-site.com
  Measured score: 68/100 (C)
  Fixes, biggest gain first:
   1. [+10 pts] Keyboard focus: No visible focus style
   2. [+8 pts] Text contrast: 4 text elements below WCAG AA, e.g. "30 days" 4.44:1
   ...
```

It checks the light theme by default; add `--dark` to check dark mode. See a real example report: [evals/review-test/ui-review.md](evals/review-test/ui-review.md).

It works on live websites, `localhost` and HTML files. For pages behind a login, use a demo or staging URL you can open without signing in, or give the AI screenshots.

## Fast mockups for clients

Ask your AI something like:

> "Before we build anything, make quick mockups of the dashboard and the invoice page so my client can approve the look. Show 3 design directions for the dashboard."

You get plain HTML files you can zip or host. The client clicks **Feedback** → **Add comment**, clicks anywhere on the screen, types a note, then copies all notes into an email. See `skills/ui-craft/references/mockups.md`.

## How it was made

- **Curated, not compiled.** The rules come from public design systems (Material, Apple HIG, Fluent, Radix, shadcn, Carbon, GOV.UK), from WCAG 2.2, from research on colour, emotion and trust, from the writing of respected interface craftspeople, and from the best existing AI design rule sets. Claims are graded by evidence, and popular myths are named as myths. Everything is rewritten in our own words. Where sources disagree, we picked one rule and wrote down why: [research/conflicts.md](research/conflicts.md). Sources and licences: [research/sources.md](research/sources.md) and [CREDITS.md](CREDITS.md).
- **Tested.** The same 5 screens were built with and without the skill, then measured automatically and judged blind from screenshots. Results: [evals/RESULTS.md](evals/RESULTS.md).

## Updating the rules

Edit `skills/ui-craft/SKILL.md` or the reference files, then rebuild `AGENTS.md`:

```bash
python tools/build-agents-md.py
```

To change a direction, edit `tools/directions-data.mjs`; for the base tokens edit `tools/build-directions.mjs`. Then run both builds (the second rebuilds the Studio at `docs/index.html`). It regenerates `tokens.css`, the direction files and the gallery, and fails if any colour pair misses contrast:

```bash
node tools/build-directions.mjs
```

```bash
node tools/build-studio.mjs
```

The Studio's Immersive screen and the immersive starter page are built from `skills/immersive-web/assets/theme-bridge.js` and `scene-shell.js`. After changing either, run the Studio build above and:

```bash
node tools/build-immersive.mjs
```

To re-run the tests (needs Node and Chrome), build the screens into `evals/iteration-N/<case>/<config>/outputs/`, then:

```bash
node evals/tools/check.mjs evals/iteration-N/*/*
python evals/tools/grade.py evals/iteration-N
```

## Licence

MIT. See [LICENSE](LICENSE). Credits to the sources that shaped the rules are in [CREDITS.md](CREDITS.md).
