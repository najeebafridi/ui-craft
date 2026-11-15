# Design brief: Stage dark (customised)

Use the ui-craft skill and follow this brief for every screen. Live preview: https://najeebafridi.github.io/ui-craft/#d=stage-dark&a=7FA8FF&n=brand&t=1&s=&fd=Barlow+Condensed&ft=Outfit&r=&dp=hairline&bw=1&dn=&m=crisp&im=2&th=dark

- **Direction:** Stage dark. Immersive. The content performs; the interface holds the lights.
- **Made for:** Music, video, podcasts, gaming, events, streaming, portfolios of media work.
- **Signature to build:** Colour from the content: a faint ambient tint behind the current artwork (blurred, very low opacity) and large condensed titles.
- **Colour:** brand #7FA8FF on brand-tinted neutrals. Default theme: dark; ship both.
- **Type:** headings in Barlow Condensed (weight 600, letter-spacing 0em), text in Outfit, code and IDs in JetBrains Mono. Body 15px.
- **Shape and depth:** radius 6/10/16px, hairline depth, 1px borders.
- **Density:** controls 40px, rows 48px, sections 48px apart. Controls grow to 44px on touch screens.
- **Motion:** crisp (120/200/300ms, press scale 0.97).
- **Imagery:** Cover art, posters, stills. They supply all the colour; the UI stays near-black and neutral.
- **Voice:** Short, low on hype.
- **Watch out:** Near-black, never pure black next to bright art. Dark text on the bright accent. Keep motion cinematic but short; no parallax on text.

## Immersive and motion

- **Intensity:** level 2 of 3, Signature. One hero moment (a 3D object or shader that reacts to the pointer or the first scroll), then a normal page.
- **The direction's advice for 3D and scroll:** A dark stage, one spotlight, a little haze, colour taken from the artwork. Cinematic cuts and slow push-ins, kept short.
- **Tempo:** crisp. Interface motion 120/200/300ms. Scene, camera and scroll moves settle in about 650ms with the same character (cubic-bezier(0.22, 1, 0.36, 1)). No bounce.
- **Always:** the page reads and works with every effect switched off. Each effect has a reduced-motion version and a no-WebGL fallback. Text stays real HTML. The 3D engine loads after the first paint.
- **How:** for any 3D, shader or scroll-driven work use the immersive-web skill (same plugin as ui-craft). It reads these tokens (`--accent`, `--bg`, `--surface`, `--font-display`, `--dur-*`, `--ease-out`, `--immersive`), so the scene follows this theme.

## Rules

1. Use only the tokens in theme.css (`var(--surface)`, `var(--accent)`, `var(--radius)`, `var(--shadow-raised)`…). Never hard-code a colour, radius or shadow.
2. One primary action per screen. Show the screen in use, with real content.
3. Check every screen at 390px and 1440px, in light and dark.

## Fonts

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
```

## Tokens

Export **CSS** from the Studio link above and save it as theme.css.
