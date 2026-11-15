# Status

Where the project is, so a new session can carry on.

## Goal
A general UI/UX design skill ("ui-craft") for Claude Code, Codex, Cursor, Gemini and others.
Curate, don't compile. Our own words. MIT licence. Work on local `main`; push to GitHub later.

## Steps
- [x] 0. Set up git, STATUS, LICENSE
- [x] 1. Research -> research/sources.md, research/conflicts.md
- [x] 2. Licence sort -> CREDITS.md
- [x] 3. Write skill -> skills/ui-craft/SKILL.md + 12 references + assets/tokens.css
- [x] 4. Fast mockups -> references/mockups.md, assets/mockup-template.html, assets/options-board.html
- [x] 5. Evals: 2 rounds. Round 2: 97% vs 57% checks passed; blind judge preferred skill on 5/5. See evals/RESULTS.md
- [x] 6. Package: .claude-plugin/ (plugin + marketplace), AGENTS.md (generated), README.md
- [x] 7. Polish: fresh review fixed 25 consistency issues (tokens = colour guide, no 13px/11px, rows 36/40/44, sections 64–96, Radix credit). Screenshots removed from git history (repo 5.4 MB -> ~0.4 MB); they stay on disk, ignored.

## Not done yet / next ideas
- Push to GitHub: repo `najeebafridi/ui-craft` (username already filled in README.md and plugin.json). `gh` CLI is logged in as najeebafridi; publish only when the user says yes.
- Run `claude plugin validate .` once the `claude` CLI is on PATH (it was not available here; JSON checked by hand).
- Description-trigger optimisation (skill-creator run_loop) needs the `claude` CLI; not run.
- Optional: a round 3 with a different model (e.g. a smaller one) to check the skill helps there too.

## Rules for whoever continues
- Read public pages only. No logins, sign-ups or forms. Download or run nothing from sources.
- Copy word for word only from MIT / Apache / CC-BY sources, and credit them in CREDITS.md.
- Edit skills/ui-craft/SKILL.md, then run `python tools/build-agents-md.py` to regenerate AGENTS.md.
- Commit after every working step. Update this file each time.
- Write nothing outside this folder.
