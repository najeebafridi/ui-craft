# ui-craft

**Design rules for AI coding agents.** With ui-craft, the screens your AI builds look professional and modern, are easy to use, and get done fast.

It works for any kind of software: web apps, dashboards, admin tools, desktop apps, mobile apps and marketing sites. It works in Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, Windsurf, Cline and any tool that reads `AGENTS.md`.

## What it does

When your AI builds a screen, ui-craft makes it:

1. **Check the project first.** If you already have colours, fonts or a component library, it uses them.
2. **Write a short design brief** (tone, density, colour, font, corner radius, the one main task) before coding.
3. **Follow clear rules with real numbers**: a spacing scale, a type scale, contrast that passes WCAG, 44px tap targets on phones, and loading, empty and error states.
4. **Avoid the "AI-generated look"**: no purple gradients, no cards inside cards, no KPI numbers without context, no emoji icons.
5. **Check the result**: a checklist plus an optional script that measures contrast, text sizes, tap targets and sideways scrolling, and takes screenshots.

It also helps you **win client approval fast**: one clickable HTML file per screen, two or three design options side by side, and a built-in "click to comment" feedback tool. No build step needed.

**Example.** Ask *"Build a dashboard for my candle shop"*:

- **Without ui-craft:** often no keyboard focus styles, 11px text, random spacing, and navigation that disappears on phones.
- **With ui-craft:** a design brief first, KPIs with "vs last month", a low-stock table with a clear action, a phone layout, and passing contrast.

## Install

Replace `YOUR-NAME` with the GitHub account that hosts this repo.

### Claude Code (plugin, recommended)

```
/plugin marketplace add YOUR-NAME/ui-craft
/plugin install ui-craft@ui-craft
```

Or from a terminal: `claude plugin marketplace add YOUR-NAME/ui-craft`, then `claude plugin install ui-craft@ui-craft`.

The skill loads by itself whenever you ask for UI work. You can also call it directly with `/ui-craft:ui-craft`.

**Without the plugin system:** copy the `skills/ui-craft` folder to `~/.claude/skills/ui-craft` (all your projects) or `.claude/skills/ui-craft` (one project).

### Codex, Cursor, Gemini CLI, GitHub Copilot, Windsurf

These tools read skills from a shared folder, `.agents/skills/`. Copy the skill there, plus `AGENTS.md`:

```bash
git clone https://github.com/YOUR-NAME/ui-craft /tmp/ui-craft
mkdir -p .agents/skills
cp -r /tmp/ui-craft/skills/ui-craft .agents/skills/ui-craft
cp /tmp/ui-craft/AGENTS.md ./AGENTS.md        # or paste its contents into your existing AGENTS.md
```

On Windows PowerShell, use `Copy-Item -Recurse` instead of `cp -r`.

For every project, copy the folder to `~/.agents/skills/ui-craft` instead.

| Tool | What it reads | Notes |
|---|---|---|
| **Codex** | `.agents/skills/` and `AGENTS.md` | Restart Codex if the skill does not show up. |
| **Cursor** | `.agents/skills/` and `AGENTS.md` | Nothing else to do. |
| **Gemini CLI** | `.agents/skills/` | Or run `gemini skills install https://github.com/YOUR-NAME/ui-craft --path skills/ui-craft`. To also read `AGENTS.md`, add `"context": {"fileName": ["AGENTS.md", "GEMINI.md"]}` to `settings.json`. |
| **GitHub Copilot** | `.agents/skills/` (or `.github/skills/`) and `AGENTS.md` | Works in VS Code agent mode, the Copilot CLI and the cloud agent. |
| **Windsurf / Devin** | `.agents/skills/` and `AGENTS.md` | Nothing else to do. |
| **Cline** | `.claude/skills/` or `.cline/skills/`, and `AGENTS.md` | Copy the folder to `.cline/skills/ui-craft` instead. |
| **Any other tool** | `AGENTS.md` | Keep the folder at `.agents/skills/ui-craft`: `AGENTS.md` points there for the detailed guides. |

## What's inside

```
skills/ui-craft/
  SKILL.md                  the core rules (short; always loaded)
  references/               detailed guides, loaded only when needed
    layout-spacing.md   color-dark-mode.md   typography.md     forms.md
    tables-lists.md     dashboards-charts.md navigation.md     feedback-states.md
    accessibility.md    motion.md            mobile-touch.md   review-checklist.md
    mockups.md          (fast client mockups: which screens first, options, feedback)
  assets/
    tokens.css              starter colours, spacing, type (light + dark, contrast-checked)
    mockup-template.html    one-file screen mockup with a feedback tool
    options-board.html      show 2–3 design options side by side
  scripts/
    ui-audit.mjs            measure a finished page (needs Node 22+ and Chrome)
  evals/                    test cases used to check the skill
AGENTS.md                   the same rules for Codex, Cursor, Gemini, Copilot…
```

### The audit script

```bash
node .agents/skills/ui-craft/scripts/ui-audit.mjs page.html
```

It opens the page in headless Chrome at desktop (1440px) and phone (390px) width. It lists problems like these:

```
- [phone] 8 tap target(s) under 44px: Overview, Orders, Settings
- 4 text element(s) below WCAG AA contrast, e.g. "Delivered" 4.37:1
```

It also saves screenshots. It needs no npm packages. It cannot judge taste, so still look at the screenshots.

## Fast mockups for clients

Ask your AI something like:

> "Before we build anything, make quick mockups of the dashboard and the invoice page so my client can approve the look. Show 3 design directions for the dashboard."

You get plain HTML files you can zip or host. The client clicks **Feedback** → **Add comment**, clicks anywhere on the screen, types a note, then copies all notes into an email. See `skills/ui-craft/references/mockups.md`.

## How it was made

- **Curated, not compiled.** The rules come from public design systems (Material, Apple HIG, Fluent, Radix, shadcn, Carbon, GOV.UK), from WCAG 2.2, and from the best existing AI design rule sets. Everything is rewritten in our own words. Where sources disagree, we picked one rule and wrote down why: [research/conflicts.md](research/conflicts.md). Sources and licences: [research/sources.md](research/sources.md) and [CREDITS.md](CREDITS.md).
- **Tested.** The same 5 screens were built with and without the skill, then measured automatically and judged blind from screenshots. Results: [evals/RESULTS.md](evals/RESULTS.md).

## Updating the rules

Edit `skills/ui-craft/SKILL.md` or the reference files, then rebuild `AGENTS.md`:

```bash
python tools/build-agents-md.py
```

To re-run the tests (needs Node and Chrome), build the screens into `evals/iteration-N/<case>/<config>/outputs/`, then:

```bash
node evals/tools/check.mjs evals/iteration-N/*/*
python evals/tools/grade.py evals/iteration-N
```

## Licence

MIT. See [LICENSE](LICENSE). Credits to the sources that shaped the rules are in [CREDITS.md](CREDITS.md).
