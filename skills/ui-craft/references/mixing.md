# Mixing layers across media

Load this when the request crosses borders: a game-style or sci-fi look on a website, cinematic web motion in a desktop app, a film-title feel on a dashboard, a product's 3D scene carried into its mobile app. Or whenever one product must feel like itself on several media.

## The model: one theme, layers on top

Everything this plugin teaches is one design language with layers:

| Layer | What it holds | Where it lives |
|---|---|---|
| **Theme** (always) | colour, type, shape, depth, density, tempo, voice: the tokens and the direction | ui-craft: `assets/tokens.css`, `assets/directions/`, a Studio `theme.css` / `DESIGN.md` |
| **Look** | layout, hierarchy, components, states | ui-craft |
| **Motion** | timing, easing, transitions, micro-interactions | ui-craft `references/motion.md`; cinematic motion in the immersive-web skill |
| **Scene** | 3D, light, material, shaders, scroll story | the immersive-web skill (same plugin) |
| **Genre** | the borrowed language of a medium: game HUD, sci-fi console, film titles, print editorial, arcade | this guide |

Any layer can sit on any medium because **all of them read the same theme**. Change the tokens and the page, the scene and the motion change together. So "a game theme on a website" or "a website's motion in a desktop app" is not a second design: it is the same theme with a different set of layers switched on.

Two things never mix away:

1. **The platform keeps its bones.** Navigation, controls, gestures, windows and system settings stay native to the medium (`references/platforms.md`). You change the character, not the skeleton.
2. **The floor holds.** Contrast, target sizes, keyboard access, reduced motion, honest patterns. A borrowed style that breaks them is costume, not design.

## How to borrow a genre

A genre is a set of habits people recognise: a HUD, a ship's console, a film title sequence, a newspaper, a toy. Borrow its **grammar**, not a particular work.

1. **Name what the genre is for.** A game HUD exists to show state at a glance without leaving the action. A sci-fi console says "precise machine, expert operator". Film titles set a mood before the story. If the product does not share that purpose, the borrowing will feel like a costume.
2. **Take it apart into traits**, and write them as tokens and rules, not as a picture to copy:

   | Trait | Game HUD / tactical | Sci-fi console | Film titles | Print editorial | Arcade / toy |
   |---|---|---|---|---|---|
   | Colour | dark world, one or two signal colours with fixed meanings | near-black, one cool or amber accent, thin light | few colours, strong contrast, large calm areas | paper, ink, one spot colour | bright flat colour, hard outlines |
   | Type | condensed or mono for readouts, tabular figures | mono or geometric sans, small caps labels with wide tracking | one display face, large, slow | serif text, strong headline scale | rounded, heavy, short words |
   | Shape | cut corners or tight radius, brackets, segmented bars | hairlines, grids, rings, ticks | full-bleed frames, wide margins | columns, rules, captions | chunky, pill, solid drop edge |
   | Depth | flat layers over the world; glow only as a signal | hairline, no shadow | light and focus, not boxes | none | a hard offset shadow (lip) |
   | Motion | instant feedback, short ticks, state changes snap | quick wipes and counters, then stillness | slow fades, long holds, cuts | page turn, none | squash, bounce, reward |
   | Voice | terse status words | technical, exact | sparse | literate | playful, direct |

3. **Pick three to five traits, no more**, the ones that carry the feeling. Leave the rest to the host medium. A website that takes a HUD's readout type, bracket corners and signal colours feels game-like; one that also takes the minimap, the health bar and the scanlines is a parody.
4. **Map each trait onto the theme.** Start from the nearest direction (`references/directions.md`: Quiet instrument or Graph-paper technical for consoles; Stage dark for film; Playful game-feel for arcade; Paper and ink for editorial) and adjust tokens: accent, fonts, radius, depth style, motion preset. Build the palette with `scripts/palette.mjs` so contrast still passes.
5. **Give the genre one signature** and keep everything else plain. One readout that ticks like an instrument. One title that arrives like a film. That is the whole borrowing.
6. **Run the medium's own rules last.** The result must still pass as a good website, app or dashboard by this skill's normal checks.
7. **Then check the brief was met.** Show the first screen to someone with one question: "what genre is this?" If they cannot say, the borrowing is too timid. The owner asked for a feeling; deliver it through the chosen traits at full strength (strong signal colour, confident readout type, decisive line work), not at half strength everywhere. When a product has a working view and a showpiece view (a wall screen, a demo mode), keep the working view calm and give the showpiece view the whole genre.

## What stays with the medium

| Medium | Keeps, whatever the genre |
|---|---|
| Website | native scrolling, real links, real text, responsive layout, the browser's back button, fast first paint |
| Web or desktop app | app shell (sidebar, toolbar), system shortcuts and menus, density, no hero, no scroll-as-story |
| Mobile app | system navigation and gestures, 44-48 targets, system text sizing, safe areas |
| Dashboard | flat charts for flat data, readable numbers, no ambient motion, an obvious "what needs attention" |
| Game UI (when it is a real game) | the game's own conventions: controller focus, safe zones, readability in motion |

So: a sci-fi look on a website still scrolls like a website. Cinematic motion in a desktop app happens in content and transitions, never in the menus. A game-style dashboard still puts the alert first and uses tabular figures.

## Keep it accessible

Genres come with habits that fail real users. Translate them:

| Genre habit | Problem | Keep the feeling with |
|---|---|---|
| Thin neon text on black; dim grey labels | fails contrast, glows blur | solid text at 4.5:1; put the glow on a line or an icon, never on words |
| Tiny all-caps mono labels | unreadable under 12px, slow to read in bulk | 12px minimum, +0.06em tracking, caps for short labels only |
| Colour-only status (red/green) | invisible to many | colour + shape + word |
| Scanlines, flicker, glitch, chromatic split | motion sickness, flashing risk, unreadable | a still texture at low opacity, or one short glitch on a decorative element, off under reduced motion |
| Angled, clipped or tiny hit areas | hard to hit | the visible shape can be cut; the target stays a 44px rectangle |
| Everything animated on a loop | fatigue, battery | motion on state change only; ambient motion rests in 5 s |
| Custom cursor, sound on hover | disorienting, startling | system cursor; sound off until asked |
| Fake boot sequences and loading theatre | wastes time, feels dishonest | show the product at once |

## Keep it original

- **Learn the genre, never copy a work.** Do not reproduce a specific game's HUD, a film's title design, a console from a named franchise, or their names, logos, fonts made for them, icons, sounds or characters. If someone could name the source from a screenshot, it is a copy.
- **Test:** describe the design without naming any product. "Amber readouts on near-black, bracketed panels, mono figures" is a genre. "Like the menus in (a named game)" is a brief to rewrite into traits.
- When a client asks for "the look of X", extract the three traits they actually like (usually colour mood, type and one motion), build those from the theme, and change everything else.
- Assets (icons, models, textures, sounds, fonts) are made for the project or carry a clear licence. No rips.
- The strongest work mixes **two** sources the genre does not usually combine (a tactical HUD with warm editorial type; film pacing with graph-paper precision). That is where an original voice comes from.

## Worked examples

**A game-style look for a website (an esports team's site).**
Layers: theme + look + motion + genre. Start from Stage dark. Take three HUD traits: a condensed display face with tabular score figures; bracket-cornered panels (radius 0-2px, a 1px `--border-strong` corner mark); two signal colours with fixed meanings (live, win). Keep: normal scrolling, a top bar with real links, readable body text at 16px, light theme available. Signature: the match score ticks up like a scoreboard, once. Not taken: minimaps, health bars, scanlines, sound.

**Cinematic web motion in a desktop app (a video review tool).**
Layers: theme + look + motion. The app shell is native: sidebar, toolbar, shortcuts, instant menus (100-200 ms). Film grammar goes only where content changes: opening a clip is a shared-element move from thumbnail to player (300 ms), switching projects is a quick dissolve, and the first run has one slow title moment that never returns. Reduced motion: cuts. Nothing ambient: the footage is the motion.

**A sci-fi console feel on a logistics dashboard.**
Layers: theme + look + genre, immersion level 0. Start from Graph-paper technical. Traits: hairline grid, mono figures, small tracked labels, one amber accent reserved for "needs attention". Keep: flat charts, compact tables, the exceptions list first, full contrast. Signature: counters that settle to their value with a short tick. No holograms, no 3D globe, no boot screen.

**A product's 3D launch scene carried into its mobile app.**
Layers: theme + scene on the web; in the app the scene drops one level (immersive-web `references/beyond-web.md`): the launch page's scroll story becomes a single still-capable hero in onboarding and a small resting material detail on the home screen. Same tokens, exported for SwiftUI or Compose from the Studio.

## Checklist

- [ ] One theme: every layer reads the same tokens.
- [ ] Three to five genre traits, written down; one signature.
- [ ] The medium's navigation, controls and scrolling are untouched.
- [ ] Contrast, targets, keyboard and reduced motion pass as usual.
- [ ] Nobody could name a specific product as the source.
- [ ] Assets are original or licensed.
- [ ] Without the genre layer, the screen is still a good screen.
- [ ] With it, a stranger can name the genre from one screenshot.
