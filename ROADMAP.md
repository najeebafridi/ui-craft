# Roadmap

The aim: one open-source plugin that helps anyone, with any AI coding tool and any tech stack, design interfaces at the level of a senior design team. It grows in phases. Each phase is one focused piece of work, tested with blind judges before release. One plugin, several skills: each part loads only when its use case comes up.

**How the parts fit.** There is one shared theme (the tokens and the 16 directions) and layers on top of it: look, motion, 3D and immersive, and later game UI. Every layer reads the same theme, so the layers mix on any platform and any tech stack. A game-style theme can dress a website; a website's motion can move a desktop app.

| Phase | What it adds | Status |
|---|---|---|
| 0 | **ui-craft core**: design rules, 16 visual directions, palette generator, audit and scoring, client mockups | Done (v2.0) |
| 1 | **Studio**: a visual tool to pick and tune a direction on live screens and export a theme for any framework | Done (v2.1) |
| 2 | **Immersive web** (new skill, a layer on the theme): 3D scenes, shaders, scroll storytelling, cinematic motion, the path from Blender to the browser, with speed budgets and reduced-motion and no-WebGL fallbacks. A guide to mixing layers across media. An Immersive screen in the Studio | Done (v2.2) |
| 3 | **Game UI** (new skill, another layer on the same theme tokens): HUDs, menus, inventories, sci-fi and tactical interface styles (original, not copies), controller navigation, safe zones; notes for Unity, Unreal and Godot. The same theme a website uses can skin a game's menus, and a game style can be exported back to web and app | Next |
| 4 | **Stack recipes and more directions**: ready component recipes for React, Vue, Svelte, SwiftUI, Compose, Flutter; grow the direction library | Planned |
| 5 | **Knowledge and community**: deeper research from the classic design books (in our own words), a showcase site, a contribution guide, a public benchmark | Planned |

## Principles

- **Everything mixes: one shared theme, layers on top.** Look, motion, 3D and game UI all read the same tokens, so any layer can be used on any medium. The platform keeps its bones, accessibility holds, and the work stays original (`skills/ui-craft/references/mixing.md`).
- **Curate, do not compile.** Learn from the best sources, write in our own words, credit them, grade claims by evidence.
- **Original work.** Learn the language of a genre; never copy a product's look, assets or names.
- **Honest limits.** A skill guides an AI. It can teach interface design and real-time web graphics; it cannot produce the art of a AAA game.
- **Prove it.** Nothing is called better until a blind test says so. Results are published in `evals/RESULTS.md`.
- **Small pieces.** Each skill stays short and loads detail only when needed.
- **Accessible and ethical by default.** Contrast, keyboard, reduced motion, and no manipulative patterns.

## Ideas for the immersive layer (Phase 2 follow-ups)

- Test with a real Blender model and a real React Three Fiber project (the first tests were single HTML files).
- More Studio scenes, so each direction shows its own scene character, not one shared scene.
- Native examples: a SwiftUI shader and a Compose (AGSL) shader that read an exported theme.
- Measure frame rate on real phones (the check script cannot).

## Ideas for the Studio (Phase 1 follow-ups)

- More preview screens (settings, table-heavy admin, onboarding).
- Upload a logo or screenshot and suggest a direction and brand colour.
- Save several themes side by side for a client to choose.
- Export for more targets (Android XML, WinUI, CSS-in-JS theme objects).
