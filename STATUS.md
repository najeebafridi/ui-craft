# Status

Where the project is, so a new session can carry on.

## Goal
One open-source plugin ("ui-craft") for Claude Code, Codex, Cursor, Gemini and others, with several skills on one shared theme.
Skills so far: `skills/ui-craft` (interface design) and `skills/immersive-web` (3D, shaders, scroll stories, cinematic motion).
Curate, don't compile. Our own words. MIT licence. Work on local `main`; ask the owner before each push (a push also updates the live Studio).

## Steps
- [x] 0. Set up git, STATUS, LICENSE
- [x] 1. Research -> research/sources.md, research/conflicts.md
- [x] 2. Licence sort -> CREDITS.md
- [x] 3. Write skill -> skills/ui-craft/SKILL.md + 12 references + assets/tokens.css
- [x] 4. Fast mockups -> references/mockups.md, assets/mockup-template.html, assets/options-board.html
- [x] 5. Evals: 2 rounds. Round 2: 97% vs 57% checks passed; blind judge preferred skill on 5/5. See evals/RESULTS.md
- [x] 6. Package: .claude-plugin/ (plugin + marketplace), AGENTS.md (generated), README.md
- [x] 13. Version 2.2.0, Phase 2 of ROADMAP.md: the immersive-web skill.
  - `skills/immersive-web/`: SKILL.md (9 hard rules, workflow, immersion ladder 0-3, budgets), 10 guides in `references/` (each split into "the idea" and "on the web"), `assets/theme-bridge.js` (tokens to scene values), `assets/scene-shell.js` (life cycle with fallbacks), `assets/starter.html` (generated), `scripts/immersive-check.mjs` (tests a page five ways).
  - Mixing: `skills/ui-craft/references/mixing.md`, `skills/immersive-web/references/beyond-web.md`, a new `--immersive` token (0-3) and an `immersive` level plus `scene` line for each direction in `tools/directions-data.mjs`.
  - Studio: an Immersive screen (hand-written WebGL in `tools/studio/immersive-scene.js`, no library), a "3D and scroll effects" control, "Preview as" full / reduced motion / no WebGL, and an "Immersive and motion" section in the exported brief.
  - Research notes: `research/v3/`. Tests: `evals/iteration-5/`, results in `evals/RESULTS.md`.
- [x] 11. Version 2.1.0, Phase 1 of ROADMAP.md: the Studio (docs/index.html, built by tools/build-studio.mjs from tools/studio/template.html; hosted at https://najeebafridi.github.io/ui-craft/). Palette engine split into scripts/palette-core.mjs (browser-safe) and palette.mjs (CLI); direction data moved to tools/directions-data.mjs.
- [x] 12. Version 2.1.1: Studio is live. GitHub Pages serves it from main /docs. The github.io address redirects to http://najeebafridi.me/ui-craft/ because the account has a custom domain; https on that domain is not set up (owner's choice, in the najeebafridi.github.io repo settings). Copy buttons got a fallback for non-https pages.
- [x] 10. Version 2.0.0, the premium upgrade: 16 visual directions (assets/directions + gallery), palette generator (scripts/palette.mjs), new guides (directions, premium-craft, color-theory, psychology-emotion, platforms), craft notes in ui-audit, tools/build-directions.mjs. Tested against v1: v2 preferred in 13 of 14 blind verdicts (evals/RESULTS.md).
- [x] 9. Whole-app review mode + per-page summary (v1.2.0).
- [x] 8. Review mode (v1.1.0): ui-audit score 0-100 + references/review-mode.md. Installed for the user via ~/.claude/settings.json (marketplace ui-craft, autoUpdate on).
- [x] 7. Polish: fresh review fixed 25 consistency issues (tokens = colour guide, no 13px/11px, rows 36/40/44, sections 64–96, Radix credit). Screenshots removed from git history (repo 5.4 MB -> ~0.4 MB); they stay on disk, ignored.

## Next
See ROADMAP.md. Next phase: 3, the Game UI skill (another layer on the same theme tokens). Do one phase per session and stop after each, so the user controls usage.

## Not done yet / next ideas
- Published 2026-11-16: https://github.com/najeebafridi/ui-craft (public, MIT). Push future changes with `git push`.
- Run `claude plugin validate .` once the `claude` CLI is on PATH (it was not available here; JSON checked by hand).
- Description-trigger optimisation (skill-creator run_loop) needs the `claude` CLI; not run.
- immersive-web limits: tested on single HTML files only (no React Three Fiber project, no real Blender model); frame rate on real phones not measured; native shader examples (SwiftUI, Compose) not built. See "Ideas for the immersive layer" in ROADMAP.md.
- Ideas for later: test native iOS/Android/desktop builds; a human designer's review of the directions; more directions if users ask (e.g. education, automotive, gaming UI).

## Rules for whoever continues
- Colours and tokens are generated: edit `tools/build-directions.mjs` and run it (it rebuilds tokens.css, the directions, the gallery and the template's inline tokens, and fails on any contrast miss). Never hand-edit those files.
- **Every release: bump "version" in .claude-plugin/plugin.json AND .claude-plugin/marketplace.json** (1.1.0 -> 1.2.0...). Installed plugins only auto-update when the version changes.
- Read public pages only. No logins, sign-ups or forms. Download or run nothing from sources.
- Copy word for word only from MIT / Apache / CC-BY sources, and credit them in CREDITS.md.
- Edit skills/ui-craft/SKILL.md, then run `python tools/build-agents-md.py` to regenerate AGENTS.md.
- `skills/immersive-web/assets/starter.html` is generated: edit `tools/immersive/starter.template.html`, `theme-bridge.js` or `scene-shell.js`, then run `node tools/build-immersive.mjs` and `node tools/build-studio.mjs` (the Studio inlines the same two files).
- To check the Studio after a change: start the `studio` server from `.claude/launch.json` and drive it in headless Chrome (the embedded browser pane pauses animation frames when hidden, so the 3D scene will not start there).
- Blind tests for immersive pages: build into `evals/iteration-N/<case>/<config>/outputs/index.html`, then `node evals/tools/immersive-blind.mjs evals/iteration-N`.
- Commit after every working step. Update this file each time.
- Write nothing outside this folder.
