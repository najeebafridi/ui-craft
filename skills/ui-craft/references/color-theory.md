# Colour: theory, psychology and choosing well

Load this when you choose a brand or accent colour, build a palette, decide how a product should feel, localise for another culture, or when colour looks "off" or cheap. For token names, contrast fixes and dark-mode mechanics see `color-dark-mode.md`.

## 1. Start from the feeling, not the hue

Research on colour and emotion agrees on one thing: **how light and how saturated a colour is changes how it feels more than which hue it is.** Lighter colours feel more pleasant and less dominant; more saturated colours feel more exciting; hue has a smaller effect that depends on context. So set these three dials first.

| The product should feel | Lightness | Saturation (chroma) | Neutrals | Accent area |
|---|---|---|---|---|
| Calm, safe | light surfaces | low to medium | tinted, soft | small |
| Energetic, playful | light, bright | high | pure or lightly tinted | larger, 2 hues allowed |
| Serious, expert | mid to dark text on white, or dark theme | low, one precise accent | cool | very small |
| Premium, luxurious | very light or very dark | very low overall; one deep tone | warm stone or deep black | tiny or none |
| Trustworthy | light, high contrast | medium, steady | cool or neutral | small, consistent |
| Warm, human | light, slightly creamy | medium, warm hues | warm | medium |
| Bold, youthful | black or white with one bright block | one very high-chroma colour | pure | one big block |

Then choose the hue for meaning, category fit and differentiation (sections 3 and 4).

## 2. What the evidence supports, and what it does not

Use the strong and moderate findings as rules. Treat the weak ones as conventions. Never repeat the myths to a client.

| Claim | Strength |
|---|---|
| Perceptually even colour spaces (OKLCH) give predictable contrast across hues | strong |
| Never rely on colour alone; about 1 in 12 men has a red-green colour deficiency | strong |
| Saturation raises excitement; lightness raises pleasantness (Valdez & Mehrabian 1994; later replications) | moderate |
| Hue matters less than lightness and saturation, and its meaning depends on context | moderate |
| Colour-emotion associations share a large common core across 30 nations, with local differences (Jonauskaite 2020) | moderate |
| People like colours that remind them of things they like (Palmer & Schloss 2010); blue is the most liked in many countries | moderate |
| A colour should fit the product type: functional products suit cool, practical colours; sensory and social products suit warmer, richer ones (Bottomley & Doyle 2006) | moderate |
| Light themes read slightly better than dark for normal vision, more so with small text (NN/g) | moderate |
| Luxury reads as black, white, deep neutrals and restraint | weak to moderate (convention) |
| 60-30-10 proportions; colour-wheel harmony schemes | weak (useful rules of thumb) |
| Dark mode reduces eye strain | weak |
| "Red makes people perform worse" | weak (failed replication) |
| "62-90% of snap judgements are based on colour" | myth (one over-quoted review) |
| "Each colour has one fixed meaning" | myth |

## 3. Hue meanings (use as a starting map)

Meanings are learned from context. The same red is an error in a form, a sale in a shop, luck at a wedding.

| Hue | Common Western reading | Differences to know | In UI, watch for |
|---|---|---|---|
| Red | danger, error, urgency, passion, sale | luck and celebration in China; rising prices are red in several East Asian markets | conflicts with error states (section 7) |
| Orange | energy, warmth, affordability | sacred associations in parts of South Asia | fails with white text; looks like a warning |
| Yellow | optimism, attention, caution | can read as sickness or cowardice in the West | needs dark text; poor on white |
| Green | nature, health, success, money, "go" | strongly positive in many Muslim-majority cultures | conflicts with success states; avoid red vs green as the only cue |
| Teal | calm, clean, modern health | few strong conflicts | a good alternative to blue |
| Blue | trust, calm, competence | the most liked and the most used | safe but undifferentiated |
| Purple | luxury, creativity, spirituality | mourning in a few regions | the default "AI" colour; needs a reason |
| Pink | care, softness, play | gender coding is fading | pale pinks fail contrast as text |
| Brown, earth | natural, reliable, craft | often the least liked alone | works as a neutral, not as an accent |
| Black | power, formality, luxury, grief | mourning in the West | pure black is harsh on screens; use near-black |
| White | clean, simple, pure | mourning in much of East Asia | pure white glare in dark mode |

When a product ships in another culture, check the brand and status colours with someone from that market, and always pair colour with a label or icon.

## 4. Category conventions, and when to break them

| Category | Convention | How to stand apart without losing trust |
|---|---|---|
| Finance, enterprise, security | blue, navy, teal | another deep hue at the same seriousness (forest, plum, teal), or a warm neutral with a blue accent |
| Health, wellness | soft blue, teal, green, white | warm human neutrals (sand, peach) with a calm accent |
| Food | warm red, orange, yellow, fresh green | dark, moody palette for premium food |
| Developer and data tools | near-monochrome with one hot accent | change the accent hue; warm the neutrals |
| Kids, learning | several saturated hues | fewer hues, used boldly; keep text contrast high |
| Eco, outdoors | green, earth | stone neutrals with one deep green, to avoid the "greenwash" look |
| Luxury | black, white, deep neutrals, a metallic detail | one deep jewel tone instead of gold |

Rule: **follow the category for anything users must recognise** (status colours, up and down in finance, the general seriousness), **differentiate in the brand hue and the details.** If every competitor is the same blue, pick another hue at the same level of trust rather than a louder one. A wild category mismatch lowers trust.

## 5. Building the palette

Use `scripts/palette.mjs`. It works in **OKLCH**, where `L` is perceived lightness (0-1), `C` is colourfulness and `H` is the hue angle. Equal `L` looks equally light in every hue, which HSL cannot promise (HSL yellow and blue at "50% lightness" look nothing alike).

```bash
node scripts/palette.mjs --accent "#0F766E" --neutral warm --tint 2 --out theme.css
```

What it gives you, and the rules behind it:

- **Neutrals carry a trace of colour.** `--tint 1-3` sets chroma 0.006-0.02. Below ~0.005 greys look dead; above ~0.03 they look coloured. `--neutral brand` tints toward the accent (cohesive), `cool` feels technical and clean, `warm` feels human and editorial, `pure` feels stark and gallery-like.
- **One accent, used on roughly 5-10% of the screen.** As a check, a screen is about 60% background neutral, 30% secondary surfaces and text, 10% accent.
- **Text, borders and status colours are solved to pass contrast** on the surfaces they sit on, in light and dark. If white text fails on the brand colour, the fill is darkened slightly or the text becomes dark.
- **Status colours are their own tokens** (`--success`, `--warning`, `--danger`, `--info`) and do not change with the brand.
- **Six chart colours** spread around the wheel with alternating lightness, so they stay distinct for colour-blind viewers.
- Role of each step in a scale: page background, quiet background, control background, hover, pressed or selected, faint line, visible line, strong line, solid colour, solid hover, soft text, strong text (see `color-dark-mode.md`).

**A second colour** is justified only when the product has a second job for it (a playful brand, a second data series, a clear secondary action family). Choose it by relationship to the accent:

- *Analogous* (30-40° away): calm and cohesive.
- *Complementary* (about 180° away): energetic; use in small amounts.
- *Split* (150° or 210° away): lively with less clash.

Pass it as `--secondary "#hex"`. Never a third.

**Wide-gamut screens:** write the normal sRGB value first and add a more vivid one only for accents inside `@media (color-gamut: p3)`. Text and status colours never depend on it.

## 6. What makes colour look premium, or cheap

| Premium | Cheap |
|---|---|
| 3-4 colours in total; one accent | many hues at similar strength |
| tinted neutrals with even lightness steps | default framework greys and default blue |
| low chroma on large areas, high chroma on small valuable spots | colour on every element |
| near-black and off-white | pure #000 and #FFF beside neon |
| contrast that clearly passes | pale grey text, grey text on colour |
| subtle same-hue gradients, blended in OKLCH | gradients across distant hues with a muddy middle |
| a metallic or jewel tone as a thin detail | gold, glow and gloss everywhere |

## 7. Brand colour versus meaning colours

- **Brand red or orange vs errors:** errors get a distinct hue (shift 15-20° toward crimson), plus an icon and words. Do not use the solid brand colour for error states. Destructive buttons are the error colour, not the brand colour.
- **Brand green vs success:** shift success cooler or yellower than the brand, or accept the overlap and rely on icon and text.
- **Brand yellow or amber vs warnings:** warnings keep amber with dark text and an icon; use the brand yellow only as a fill with dark text.
- **Brand blue vs links and info:** share the hue; it is expected.
- In data, never let brand colour imply good or bad by accident.

## 8. Gradients

- Allowed: a same-hue lighting gradient (2-4% lightness) on a surface or button; one deliberate brand gradient as a hero background on a marketing page; a faint ambient tint behind media.
- Blend in a perceptual space so the middle does not go grey: `linear-gradient(in oklch, var(--a), var(--b))`, with a plain gradient declared first as a fallback.
- Keep endpoints within about 60° of hue, or the blend passes through colours you did not choose.
- Not allowed as filler: gradient text, gradient borders on cards, purple-to-blue washes, a blob where the product image should be.

## 9. Colour-blind safety

- About 8% of men and 0.4% of women of Northern European descent have red-green deficiency. In a mixed audience that is 4-5 people in every 100.
- Never use colour as the only signal: add an icon, a label, a pattern or position.
- Pairs that fail as the only difference: red vs green, green vs brown, blue vs purple, pink vs grey.
- Make categories differ in **lightness** as well as hue. Blue with orange is the safest pair.
- Label chart series directly instead of relying on a legend.

## 10. Light and dark

- Offer both and follow the OS setting; do not force dark. Light reads slightly better for most people; dark suits media, long sessions in low light, and personal preference.
- Dark is a second palette, not an inversion: near-black tinted surfaces, raised surfaces lighter, off-white text, accent chroma lowered about 10-25% on large areas. `palette.mjs` builds it; mechanics are in `color-dark-mode.md`.

## Common mistakes

- Choosing the hue first ("we want purple") and the feeling never.
- Quoting colour "psychology" numbers as facts.
- Following the category so closely the product is invisible, or breaking it so hard it loses trust.
- Brand red doing double duty as the error colour.
- Low saturation mistaken for low contrast.
- Checking colours on one calibrated monitor only, in one theme.
