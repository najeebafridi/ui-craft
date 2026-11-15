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
- [x] 11. Version 2.1.0, Phase 1 of ROADMAP.md: the Studio (docs/index.html, built by tools/build-studio.mjs from tools/studio/template.html; hosted at https://najeebafridi.github.io/ui-craft/). Palette engine split into scripts/palette-core.mjs (browser-safe) and palette.mjs (CLI); direction data moved to tools/directions-data.mjs.
- [x] 10. Version 2.0.0, the premium upgrade: 16 visual directions (assets/directions + gallery), palette generator (scripts/palette.mjs), new guides (directions, premium-craft, color-theory, psychology-emotion, platforms), craft notes in ui-audit, tools/build-directions.mjs. Tested against v1: v2 preferred in 13 of 14 blind verdicts (evals/RESULTS.md).
- [x] 9. Whole-app review mode + per-page summary (v1.2.0).
- [x] 8. Review mode (v1.1.0): ui-audit score 0-100 + references/review-mode.md. Installed for the user via ~/.claude/settings.json (marketplace ui-craft, autoUpdate on).
- [x] 7. Polish: fresh review fixed 25 consistency issues (tokens = colour guide, no 13px/11px, rows 36/40/44, sections 64–96, Radix credit). Screenshots removed from git history (repo 5.4 MB -> ~0.4 MB); they stay on disk, ignored.

## Next
See ROADMAP.md. Next phase: 2, the Immersive web skill. Do one phase per session and stop after each, so the user controls usage.

## Not done yet / next ideas
- Published 2026-11-16: https://github.com/najeebafridi/ui-craft (public, MIT). Push future changes with `git push`.
- Run `claude plugin validate .` once the `claude` CLI is on PATH (it was not available here; JSON checked by hand).
- Description-trigger optimisation (skill-creator run_loop) needs the `claude` CLI; not run.
- Ideas for later: test native iOS/Android/desktop builds; a human designer's review of the directions; more directions if users ask (e.g. education, automotive, gaming UI).

## Rules for whoever continues
- Colours and tokens are generated: edit `tools/build-directions.mjs` and run it (it rebuilds tokens.css, the directions, the gallery and the template's inline tokens, and fails on any contrast miss). Never hand-edit those files.
- **Every release: bump "version" in .claude-plugin/plugin.json AND .claude-plugin/marketplace.json** (1.1.0 -> 1.2.0...). Installed plugins only auto-update when the version changes.
- Read public pages only. No logins, sign-ups or forms. Download or run nothing from sources.
- Copy word for word only from MIT / Apache / CC-BY sources, and credit them in CREDITS.md.
- Edit skills/ui-craft/SKILL.md, then run `python tools/build-agents-md.py` to regenerate AGENTS.md.
- Commit after every working step. Update this file each time.
- Write nothing outside this folder.
