# Colour theory and psychology for interfaces: v2 research

Method note: pages were read through a summarising fetch tool, so quoted numbers come from those summaries. Anything from my own background knowledge, or only seen in a search snippet, is marked (unverified). All rules below are paraphrased. No licence text was visible on most pages; where I could not see one I say so and do not assume.

---

## Evil Martians: "OKLCH in CSS: why we moved from RGB and HSL"
Link: https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
Made by: Andrey Sitnik and Travis Turner, Evil Martians (updated 2025-09-17)
Licence: none stated on the page. Treat as all-rights-reserved; paraphrase only.
Best rules or findings:
- Write colours as `oklch(L C H / alpha)`. You can read the colour from the numbers: L is perceived lightness, C is colourfulness, H is the hue angle.
- The same L looks about equally light across hues, unlike HSL's `l`. That makes "pick text colour by L" and "keep contrast steady when hue changes" safe.
- Changing lightness in OKLCH keeps the hue stable. Older LCH drifts from blue towards purple (roughly hues 270 to 330).
- Relative colour syntax (`oklch(from var(--brand) calc(l + 0.1) c h)`) derives hover, muted and error variants from one source token.
- Chroma has no fixed ceiling. What is displayable depends on hue and lightness and on the display gamut. In practice values stay under about 0.37 for sRGB and P3.
- P3 holds about 30% more colours than sRGB. Out-of-range colours are clipped or mapped by the browser, and clipping can shift hue.
- Pattern for wide gamut: declare the sRGB value first, then a more saturated override inside `@media (color-gamut: p3)`.
- Percentages do not work inside `calc()` in relative colours; use plain numbers (0.1, not 10%).
- OKLCH is not a contrast check. The article points to APCA as the better contrast measure.
Notable: Practical and current. Supports a "define tokens in OKLCH, ship sRGB fallback only for P3 boosts" rule.

## Björn Ottosson: "A perceptual color space for image processing" (Oklab)
Link: https://bottosson.github.io/posts/oklab/
Made by: Björn Ottosson
Licence: code is public domain (MIT offered as alternative), per the page. Prose licence not stated.
Best rules or findings:
- Oklab was built to predict perceived lightness, chroma and hue better than CIELAB/CIELUV for image work.
- CIELAB's main weakness is hue prediction. Blues are especially wrong: blending blue with white drifts to purple in CIELAB, CIELUV and HSV.
- HSV/HSL lightness is not perceptual: yellow, cyan and magenta look much lighter than red and blue at the same "value".
- Oklab gives smoother colour blends and keeps hue when you scale saturation. This is why browsers use it for gradients (CSS Color 4/5).
- Adopted in Photoshop (default gradient interpolation), Unity gradients, Godot colour picker (page claim).
Notable: OKLCH is simply Oklab in polar form. Source of truth for the "why".

## MDN: oklch() reference
Link: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
Made by: Mozilla contributors
Licence: not visible in what I read. Historically CC-BY-SA 2.5 for prose and MPL 2.0 for code (unverified; check the site footer).
Best rules or findings:
- L is 0 to 1 (or 0% to 100%). C is a number where 100% equals 0.4. H is an angle.
- Chroma is unbounded in theory but real colours stay at or below about 0.5. Relative-colour `c` resolves between 0 and 0.4.
- `none` is valid for a channel and acts as 0 (useful for achromatic hue handling).
- Baseline "widely available" since May 2023. Relative colour syntax has less uniform support, so check before relying on it for critical styling.
Notable: The page did not explain gamut mapping, so I rely on Evil Martians and web.dev for that.

## Tailwind CSS v4 colour docs
Link: https://tailwindcss.com/docs/colors
Made by: Tailwind Labs
Licence: docs page shows none; the framework is MIT (unverified, from background knowledge).
Best rules or findings:
- The default palette is 22 families with 11 steps each (50, 100 ... 900, 950), defined in OKLCH, for example `--color-red-500: oklch(63.7% 0.237 25.331)`.
- Colours are CSS variables in the `--color-*` namespace via `@theme`, so replacing a whole palette is one line (`--color-*: initial`).
- The step ladder is a good template for a 10 to 12 step scale: 50 is near-white tint, 500 is the pure brand mid-tone, 950 is near-black.
- Neutral families are themselves slightly tinted (slate, gray, zinc, neutral, stone, taupe...), showing that "grey" should be chosen on purpose.
Notable: A real-world OKLCH scale to sample numbers from (L and C per step) rather than inventing a curve.

## Stripe: "Designing accessible color systems"
Link: https://stripe.com/blog/accessible-color-systems
Made by: Daryl Koopersmith and Wilson Miner, Stripe (authors from memory, unverified)
Licence: not stated; paraphrase only.
Best rules or findings:
- Use a perceptually uniform space (they used CIELAB). HSL lightness misleads: at equal HSL lightness, yellow looks far lighter than blue.
- Make every hue follow the same lightness curve, so step N has the same contrast in every hue.
- Because of that, contrast becomes a matter of step distance. Steps at least 5 apart give 4.5:1 for small text; steps at least 4 apart give 3:1 for icons and large text.
- To fix a failing component, move both background and text one step along the scale, not pair by pair.
- Show the feasible gamut while editing. Some combinations (very dark, very saturated yellow) cannot exist, so do not clip silently.
- Keep each hue's identity (its intended hue and saturation) while flattening lightness. Expect to give up some saturation in yellows and greens at the extremes.
Notable: The best argument for "contrast is built into the scale, not tested afterwards".

## Radix Colors: understanding the scale
Link: https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
Made by: WorkOS / Radix team (maintainers; unverified)
Licence: not shown on the page; the library is MIT (unverified).
Best rules or findings:
- 12 steps, each with a job: 1 app background, 2 subtle background, 3 component background, 4 hover, 5 pressed or selected, 6 subtle border (non-interactive), 7 subtle border (interactive), 8 strong border and focus ring, 9 solid fill (the purest brand colour), 10 solid hover, 11 low-contrast text, 12 high-contrast text.
- Steps 11 and 12 are designed to reach APCA Lc 60 and Lc 90 on a step 2 background of the same scale.
- Assigning meaning to steps lets components be themed by swapping the scale (and dark mode is a second scale with the same step meanings).
- Step 9 is where the brand colour lives. Some hues (yellow, lime, amber) need dark text on step 9 instead of white.
Notable: Best mapping from "scale number" to "UI role". Recommended as the default role table.

## Material 3 colour system (HCT, tonal palettes, dynamic colour)
Link: https://m3.material.io/styles/color/system/how-the-system-works and https://m3.material.io/blog/science-of-color-design
Made by: Google Material team
Licence: pages show none; Material guidance is published by Google (reuse terms unverified).
Best rules or findings:
- HCT = hue and chroma from CAM16, tone (lightness) from CIELAB L*. Tone is used so contrast is predictable.
- Contrast guarantee: a tone difference of 40 gives at least 3:1, and a difference of 50 gives at least 4.5:1 (seen on the blog page).
- Each key colour becomes a tonal palette (tones 0 to 100). Roles pick tones: light theme primary around tone 40, on-primary tone 100, container tone 90; dark theme primary around tone 80, container tone 30 (role-tone values from background knowledge, unverified).
- Neutral palettes are low chroma (about 4 to 6) and neutral-variant about 8 (unverified numbers, from memory of the M3 source). The idea is: neutrals carry a faint trace of the primary hue.
- Dynamic colour derives a whole scheme from one source colour (wallpaper or brand), so a harmonious, accessible scheme is a computed output, not a hand-picked set.
Notable: Source for "dark mode = same palette read at different tones, with lower chroma on large surfaces".

## Adobe Leonardo and Spectrum colour
Link: https://leonardocolor.io (tool), npm `@adobe/leonardo-contrast-colors`
Made by: Nate Baldwin, Adobe
Licence: open source (exact licence not seen; unverified).
Best rules or findings:
- Start from target contrast ratios, then let the tool find the colour. This inverts the usual flow (pick colour, check contrast).
- A "colour ratio" ladder (for example 1.1, 1.3, 2, 3, 4.5, 7, 12 against the background) makes a scale usable by contract.
- Contrast is produced against a chosen background, so the same scale can be regenerated for light, dark and dim themes with different lightness.
- Interpolation space matters (RGB, LAB, LCH, OKLCH, etc). Exact ratios may not be producible due to RGB limits.
Notable: Search snippets only; I did not read the docs fully. Confidence moderate.

## Refactoring UI: "Building your color palette"
Link: https://www.refactoringui.com/previews/building-your-color-palette
Made by: Adam Wathan and Steve Schoger
Licence: commercial book excerpt; not reusable.
Best rules or findings (from the preview intro plus my memory of the book; partly unverified):
- A UI needs three groups: neutrals (8 to 10 greys), one primary colour with 5 to 10 shades, and a few accent colours for status.
- Define 9 shades per colour up front; do not make shades on the fly.
- Greys can be tinted warm or cool to match the brand. Saturate lighter and darker shades slightly because greys get dull at the ends.
- When darkening or lightening, shift hue slightly (towards 60 degrees, 180, 300 for lighter; towards 240 for darker) so scales feel more natural than pure lightness changes (unverified).
- Do not rely on colour alone for meaning (add icon or text).
Notable: Source of the "hue shift" folk rule. Reasonable but not research-based.

## Josh Comeau: "How to make beautiful gradients"
Link: https://www.joshwcomeau.com/css/make-beautiful-gradients/
Made by: Josh W. Comeau
Licence: personal blog; all rights reserved (inferred, not stated).
Best rules or findings:
- RGB interpolation averages channels, so opposed colours (blue and yellow) pass through a desaturated grey: the "grey dead zone" (term credited to Erik Kennedy).
- Modern CSS lets you pick the space: `linear-gradient(in oklch, ...)` keeps midpoints vivid.
- Provide a plain RGB gradient first as fallback, then the `in oklch` one.
- HSL interpolation is vivid but can look unnaturally bright because it ignores perception.
- For maximum compatibility, generate midpoint stops in a library and pass them all as stops.
- Easing the stop positions changes how the blend feels.
Notable: Practical. Pair with web.dev (see next entry). Note that long hue arcs in OKLCH can pass through unexpected hues; use `shorter hue` or pick closer endpoints (unverified).

## web.dev / CSS colour 4 and 5 (gradients, color-mix, wide gamut)
Link: https://web.dev/articles/cross-browser-color returned 404; I did not read an alternative page. Content below is from background knowledge.
Made by: Adam Argyle and Chrome DevRel (unverified)
Licence: web.dev content CC-BY 4.0, code Apache 2.0 (unverified).
Best rules or findings (all unverified, background knowledge):
- `color-mix(in oklch, var(--a) 70%, var(--b))` produces tints and shades without a preprocessor. Mixing with white or black in oklch is more predictable than in srgb.
- Interpolation in `oklab` avoids hue swings; `oklch` gives vivid but may travel the colour wheel.
- Use `@media (color-gamut: p3)` or `@supports (color: color(display-p3 1 0 0))` to layer richer colour on top of sRGB.
Notable: Gap. Confirm with a direct read of the CSS Color 5 spec before writing rules.

## Okabe and Ito: colour universal design (University of Cologne mirror)
Link: https://jfly.uni-koeln.de/color/
Made by: Masataka Okabe and Kei Ito
Licence: no formal licence; free for teaching, credit requested.
Best rules or findings:
- Never encode information with colour alone; add shape, position, line style or hatching.
- Label elements directly rather than only in a legend.
- Contrast in brightness, not just hue. Avoid red text on green; avoid dark red on black (use vermilion or light red).
- Alternate warm and cool colours in a palette. If two warm (or two cool) colours must sit together, make their lightness or saturation clearly different.
- Magenta plus green beats red plus green for overlays.
- Use thicker lines, larger markers and bolder text for colour-coded items.
- Test with simulators but also with colour-blind people.
- The 8-colour set is commonly cited as: black #000000, orange #E69F00, sky blue #56B4E9, bluish green #009E73, yellow #F0E442, blue #0072B2, vermilion #D55E00, reddish purple #CC79A7 (hex values from memory, unverified; the page itself showed them only as an image).
Notable: The page uses the name "barrier free colour palette", not "Okabe-Ito".

## Wikipedia: Color blindness
Link: https://en.wikipedia.org/wiki/Color_blindness
Made by: Wikipedia contributors
Licence: CC BY-SA 4.0 (standard for Wikipedia).
Best rules or findings:
- Males: dichromacy 2.4% (protanopia 1.3%, deuteranopia 1.2%, tritanopia 0.008%); anomalous trichromacy 6.3% (deuteranomaly 5.0%, protanomaly 1.3%).
- Females: dichromacy 0.03%; anomalous trichromacy 0.37% (deuteranomaly 0.35%).
- Red-green deficiency affects up to about 8% of men of Northern European descent and about 0.4% of women.
- Red-green confusions: cyan with grey, pink with grey, blue with purple, yellow with neon green, red/green/orange/brown.
- Tritan confusions (rare): yellow with grey, blue with green, dark blue with black, violet with yellow-green.
- Design consequence: roughly 1 in 12 men; for a 50/50 audience about 4 to 5% are affected. Red/green status pairs are the most common failure.
Notable: Use the male figure for audience-weighted risk; 8% applies mostly to Northern European descent.

## Nielsen Norman Group: dark mode vs light mode
Link: https://www.nngroup.com/articles/dark-mode/
Made by: Nielsen Norman Group
Licence: proprietary; paraphrase only.
Best rules or findings:
- For people with normal vision, light mode (dark text on light) generally performed better on acuity and proofreading tasks (a 2013 study), and the advantage grows as text gets smaller.
- At night with small text, light mode still did better in a 2017 glanceable reading study; in simulated daytime there was no difference.
- No significant difference in eye strain or fatigue was found between modes (2013 study).
- People with cataract-like conditions read better in dark mode (1985 CRT study; dated).
- Possible long-term myopia link from light mode is suggested by one very small study (7 participants); do not treat as established.
- Do not force dark mode by default. Offer a choice, honour OS preference, and keep it consistent across screens.
Notable: The page did not discuss astigmatism or halation. Those claims below are marked unverified.

## Valdez and Mehrabian (1994), "Effects of color on emotions"
Link: https://pubmed.ncbi.nlm.nih.gov/7996122/ (abstract)
Made by: Patricia Valdez and Albert Mehrabian, J. Exp. Psychol.: General 123(4)
Licence: journal abstract; paraphrase only.
Best rules or findings:
- Using Munsell colour chips and the Pleasure-Arousal-Dominance model, saturation and brightness explained more emotion than hue did.
- Reported regressions: Pleasure = .69 Brightness + .22 Saturation; Arousal = -.31 Brightness + .60 Saturation; Dominance = -.76 Brightness + .32 Saturation.
- So lighter and more saturated colours feel more pleasant; saturation raises arousal; brightness slightly lowers arousal.
- Brightness effects were nearly the same for chromatic and grey colours.
- Hue: blue, blue-green, green, purple tones rated most pleasant; yellow and green-yellow least pleasant.
Notable: Lab study with chips on neutral backgrounds, student samples. Direction is plausible and repeatedly cited (Wilms and Oberfeld 2018 support saturation raising arousal), but effect sizes in real interfaces are unknown.

## Wilms and Oberfeld (2018), "Color and emotion: effects of hue, saturation and brightness"
Link: https://www.staff.uni-mainz.de/oberfeld/downloads/Wilms-Oberfeld2018_Article_ColorAndEmotionEffectsOfHueSat.pdf (found in search; not opened)
Made by: Lisa Wilms and Daniel Oberfeld, Psychological Research
Licence: unverified.
Best rules or findings (via search summary only; unverified in detail):
- Saturation has the strongest effect on arousal; higher saturation goes with higher valence and arousal. Brightness adds to valence. Hue effects are smaller and depend on the other two.
Notable: Modern replication-style support for Valdez and Mehrabian. Worth a full read in v2 verification.

## Elliot and Maier: colour-in-context theory and the red effect
Link: search results only (core.ac.uk replication poster pages; sciencedaily summary). Chapter: Elliot and Maier (2012), Advances in Experimental Social Psychology vol. 45, pp. 61 to 125.
Made by: Andrew Elliot, Markus Maier
Licence: paraphrase only.
Best rules or findings:
- Theory: colours carry meanings from learned associations and some biological predispositions, and the meaning depends on context. Red in achievement settings (tests, grades) is said to trigger avoidance.
- Original result (Elliot et al., 2007, JEP: General 136): brief exposure to red reduced anagram performance.
- Independent attempts by Steele and colleagues failed to reproduce the effect, even with stronger red. Treat the red-impairs-performance effect as unreliable.
- A useful methodological point from this literature: studies that do not control saturation and brightness are confounded (Valdez and Mehrabian 1994 is the cited reason).
Notable: Design takeaway is context-dependence: red means "stop/error" in a form, "sale" in retail, "luck" in China. Not "red makes people fail".

## Labrecque and Milne (2012), "Exciting red and competent blue"
Link: https://link.springer.com/article/10.1007/s11747-010-0245-y (DOI 10.1007/s11747-010-0245-y; abstract not fully retrieved)
Made by: Lauren Labrecque and George Milne, J. Acad. Mark. Sci. 40(5)
Licence: paywalled; paraphrase only.
Best rules or findings (secondary summaries; moderate confidence):
- Hue maps to brand personality dimensions: red is rated exciting, blue competent (the title). Other hue associations are in the paper; I did not verify them.
- Higher saturation reads as more exciting and dominant; lower saturation as calmer and gentler.
- Colour affects purchase intent and brand liking, and the effect depends on fit between colour and product.
- Colour fit works via learned associations ("spreading activation"), not hard-wired meaning.
Notable: Student-sample, survey-style marketing research. Credible for direction, not for size.

## Jonauskaite et al. (2020), colour-emotion associations in 30 nations
Link: https://biopen.bi.no/bi-xmlui/bitstream/11250/2761614/1/Jonauskaite_etal_2020_PsychScience.pdf (author manuscript also on Lausanne's Serval repository, CC BY-NC-ND 4.0 per search result)
Made by: Domicele Jonauskaite and colleagues, Psychological Science 31(10)
Licence: author manuscript CC BY-NC-ND 4.0 (per search summary).
Best rules or findings:
- 4,598 participants, 30 nations, 22 languages, 20 emotion concepts against 12 colour terms.
- Patterns were strongly similar across nations (average similarity r = .88), so there is a shared core.
- National differences still predicted associations, and were smaller between linguistically or geographically close nations.
- From the wider paper (unverified in this pass): red tied to love and anger; yellow to joy; black and grey to sadness; white and light colours to relief and calm; pink to love.
Notable: Used colour words, not real stimuli on screens. Use as evidence that cross-cultural overlap is real but not total.

## Palmer and Schloss (2010), ecological valence theory
Link: https://pubmed.ncbi.nlm.nih.gov/20421475/ and https://pmc.ncbi.nlm.nih.gov/articles/PMC2889342
Made by: Stephen Palmer and Karen Schloss, PNAS 107
Licence: open access via PMC (exact licence not checked).
Best rules or findings:
- People like colours in proportion to how much they like objects of that colour (32 colours tested). This explained about 80% of variance in average preference in a later summary.
- This beat rival accounts: cone-opponent contrast, colour appearance, and colour-emotion theories.
- Implication: preference is learned and ecological; blue (sky, water, clean) tends to be liked, dark yellow-brown (rot, waste) disliked.
- Association with the audience's environment matters more than a universal "meaning".
Notable: Strongest theory for why preferences resemble each other across cultures and still differ locally.

## YouGov (2015): blue is the favourite colour in 10 countries
Link: https://yougov.com/en-gb/articles/12331-blue-worlds-favourite-colour
Made by: YouGov
Licence: proprietary; paraphrase.
Best rules or findings:
- Blue ranked first in all 10 countries tested, including China, by 8 to 18 points; share was about 23% (Indonesia) to 33% (Great Britain).
- Second place varied: green, red or purple depending on the country.
- A separate G.F. Smith survey (about 30,000 people, 100 countries) put a deep teal first. Result depends on the survey.
Notable: Preference is not the same as persuasion. Choosing blue for being "liked" is safe, not distinctive.

## Singh (2006), "Impact of color on marketing", and the 62 to 90% claim
Link: https://www.emeraldinsight.com/doi/abs/10.1108/00251740610673332
Made by: Satyendra Singh, Management Decision 44(6)
Licence: paywalled; paraphrase.
Best rules or findings:
- The abstract states people decide within 90 seconds, with 62 to 90% of the assessment based on colour alone. It is a literature review, and the author concedes some of the underlying experiments are not scientific.
- Later web posts squash this into "90% of snap judgements are colour" and cite it without caveats. Search results suggest the repeated figures trace back to this one article (the criticism is from a secondary Spanish-language article; moderate confidence).
- Do not put the figure in a design rule or client pitch.
Notable: A model case of a viral number with a weak chain of evidence.

## Bottomley and Doyle (2006), colour and product appropriateness
Link: https://orca.cardiff.ac.uk/id/eprint/2579/
Made by: Paul Bottomley and John Doyle, Marketing Theory 6(1)
Licence: Cardiff repository copy; terms not checked.
Best rules or findings:
- Logo colour is judged "appropriate" depending on the product type. Functional products (tools, finance, hardware) fit functional colours (cool, practical, e.g. blue); sensory-social products (perfume, party, gifts, fashion) fit sensory-social colours (warmer, richer).
- A well-chosen logo colour can add value even without prior conditioning.
- A second study looked at whether colour can strengthen or weaken brand identity when products straddle both categories.
Notable: Supports "fit to category" as a rule but also shows why a deliberate mismatch is a risk, not an advantage, for trust-critical products.

## Wikipedia: Color symbolism
Link: https://en.wikipedia.org/wiki/Color_symbolism
Made by: Wikipedia contributors
Licence: CC BY-SA 4.0.
Best rules or findings:
- White: purity and cleanliness in the West; death and mourning in parts of East Asia.
- Red: luck, happiness and weddings in contemporary China; danger and warning in the West; also associated with death in some ancient contexts.
- Green: nature, health, youth everywhere; money, greed and jealousy in the US. (Islam link not on the page.)
- Purple: power and royalty (costly dye); in Japan murasaki was off-limits to commoners.
- Yellow: sun and joy; cowardice and sickness in the West; peace/knowledge in India (Krishna).
- Black: death and grief in the West, but also fashion, formality and mourning.
Notable: General encyclopedia; fine for orientation, not for regulated decisions. Always check with locals for target markets.

## Luxury and premium colour sources
Link: various results (4imprint blog, Atlantis Press conference PDF, zoviz). No single strong source.
Made by: vendor blogs and a conference paper.
Licence: unknown; paraphrase.
Best rules or findings:
- A small experimental packaging study (110 adults) rated black packaging as higher quality; sample small (moderate-to-weak).
- A conference paper claims black-and-white palettes in luxury ads raise perceived uniqueness and authenticity.
- A vendor survey (about 1,000 UK consumers) had 20% link black to luxury and 30% to "corporate". Marketing, not peer-reviewed.
- Practitioner consensus: 3 to 4 colours, restraint, gold as a small accent. This is consistent but untested.
Notable: The evidence that restraint signals premium is weak-to-moderate and mostly practitioner. I did not find a rigorous study on saturation and premium perception.

---

## Synthesis: answers to the ten questions

### 1. OKLCH model for building scales
- Why: perceptual lightness is consistent across hues, hue stays put when lightness changes, and CSS supports it natively with relative colours and `color-mix()`.
- 11 to 12 step scale. Suggested L targets (my calibration, not from a source, test before shipping): 0.98, 0.96, 0.92, 0.87, 0.80, 0.72, 0.64, 0.56 (brand fill at 0.50 to 0.60), 0.48, 0.40, 0.32, 0.22. Use the Tailwind v4 values as a sanity check.
- Chroma curve: low at the extremes (0.01 to 0.04 at the lightest and darkest steps), peak around mid steps (0.10 to 0.20, up to 0.25 for vivid hues), then taper. Peak is the highest in-gamut chroma at that L and H, so clamp rather than clip.
- Hue shift: keep within about 5 to 15 degrees across the scale (lighter steps toward warmer/yellower, darker toward cooler/bluer, per Refactoring UI folk rule, unverified). Keep hue fixed for strictly brand-critical colours.
- Equal contrast across hues: build with the same L targets for every hue (Stripe, Radix). Use APCA or WCAG to check, not OKLCH alone.
- Tinted neutrals: chroma 0.005 to 0.02 at the brand hue (my range, M3 neutrals sit near that low end, unverified numbers). Under 0.005 looks dead-grey; over 0.03 starts to read as a colour.
- Gamut: write sRGB first, add `@media (color-gamut: p3)` boost for accents only. Never depend on P3-only for text or semantic colours.

### 2. Harmony and hue count
- Most UIs need one brand hue plus neutrals plus status colours. That is 1 to 2 hues in the chrome, with status colours used sparingly.
- 60-30-10: about 60% neutral background, 30% secondary surfaces or text, 10% accent. It is a decorator's rule of thumb, not a studied result (weak). Use as a sanity check on how much accent is on screen.
- Classic harmonies (complementary, analogous, triadic) are starting points, not evidence-based laws (weak). Analogous with one neutral is the safest; complementary only for small accent pairs.
- Use a second brand hue only when the product has two clearly distinct jobs (e.g. data series, product lines).

### 3. Evidence-graded psychology: lightness, saturation, hue
- Lightness: brighter colours feel more pleasant and less dominant (Valdez and Mehrabian 1994; moderate). Dark, low-chroma surfaces read as serious/premium (practitioner; weak).
- Saturation: higher saturation raises arousal and excitement; lower feels calm and gentle (Valdez and Mehrabian 1994; Labrecque and Milne 2012; Wilms and Oberfeld 2018 via summary; moderate).
- Hue: effects are smaller than saturation and brightness, and depend heavily on context and learned association (Palmer and Schloss 2010; Elliot and Maier 2012; moderate). Blue-ish hues are liked and read as competent/trustworthy in surveys (Labrecque and Milne; YouGov; moderate), but liking is not conversion.
- Calm: low saturation, high lightness, cool hue. Energy: high saturation, warm hue, strong contrast. Trust: blue/teal, restrained saturation, plenty of neutral, consistent. Luxury: dark or very light neutrals, minimal chroma, one small accent, space. The luxury mapping is mostly practitioner convention (weak-to-moderate).
- Always test in the product's context; no colour has a fixed effect.

### 4. Hue meaning table (Western plus notable differences)
| Hue | Western meanings | Notable differences | Confidence |
|---|---|---|---|
| Red | danger, error, urgency, passion, sale | luck and celebration in China; stock-market red means "up" in China, Japan, Korea and the reverse of Western convention (unverified) | high for Western and China luck |
| Orange | energy, warmth, caution | sacred/saffron in India (unverified); cheap/discount in some retail | moderate |
| Yellow | optimism, caution, joy | sickness/cowardice in West; peace/knowledge in India; royalty in China (unverified) | moderate |
| Green | nature, health, success, money | jealousy in West; strong positive link with Islam (unverified); in some regions can mean "go" universally via traffic lights | moderate |
| Blue | trust, calm, competence | most liked worldwide (YouGov 2015); mourning in some places (unverified) | high for preference |
| Purple | luxury, creativity, royalty | status colour in Japan history; mourning in some regions (unverified) | moderate |
| Pink | femininity, softness, care | reduced gender coding among younger audiences (unverified) | moderate |
| Brown | earthy, rustic, reliable | consistently the least liked in US surveys (YouGov, search snippet) | moderate |
| Black | formality, power, luxury, grief | mourning in West; elegant in fashion | high |
| White | clean, minimal, purity | mourning in much of East Asia | high |
| Grey | neutral, conservative, sadness (Jonauskaite) | -- | moderate |

### 5. Industry conventions and when to break them
- Finance, enterprise, security: blue, navy, teal. Safe for trust; undifferentiated. Break with a distinctive accent hue or a warm neutral, but keep seriousness (steady type, restrained chroma).
- Health, wellness: soft blue, green, teal, white. Clean and calm. Differentiate with warm, human colours (peach, sand) only if care tone suits.
- Food: warm reds, oranges, yellows, greens (practitioner; weak). Green signals fresh/health; red-orange appetite. Break with dark moody palettes for premium.
- Tech and developer tools: blue, purple, black; in 2020s many use near-monochrome with a single hot accent.
- Kids: saturated, multi-hue, rounded. Keep text contrast high; do not let multi-hue lower readability.
- Eco and sustainability: green, earth tones. Over-used ("greenwashing look"); break with warm stone neutrals plus a single deep green.
- Luxury: black, white, deep neutrals, metallic small accents.
- Rule: follow the category for conventions users must recognise (status colours, finance up/down), break it for brand colour where recognition is not a safety issue. Check that the competitor set is not identical; if every competitor is blue, pick another hue at the same trust level (teal, indigo).
- Bottomley and Doyle: mismatch between product type and colour lowers appropriateness, so differentiate by hue shade and saturation, not by wild category violation.

### 6. Premium vs cheap, concretely
Evidence is mostly practitioner (weak to moderate). Consistent patterns:
- Premium: few colours (3 to 4); tinted neutrals; one accent at low area; lower to moderate chroma; consistent lightness steps; generous whitespace; gold or metallic only as a thin detail; dark or very light surfaces with strong text contrast; gradients subtle and interpolated in OKLab/OKLCH.
- Cheap: many hues at similar saturation; pure #000/#fff next to neon accents; default framework blues and greys; heavy gradients across distant hues; colour used on every element; low contrast grey-on-colour text; sRGB gradients with a muddy middle.
- Practical: reduce chroma of large surfaces, keep high chroma for small high-value spots (buttons, links, key data).

### 7. Brand colour vs semantic colour conflicts
- Brand red vs error red: separate the two by lightness, saturation and always an icon plus text. Use a distinct error hue (shift hue by about 10 to 20 degrees towards red-orange or magenta), different shape, and never colour-only. Reserve brand red for non-interactive branding and hero moments, and do not use it for destructive buttons unless the product treats all clicks as dangerous.
- Brand green vs success: use a different hue angle for success (e.g. cooler or yellower), or make brand green the logo only.
- Brand blue vs link: usually fine; keep the same hue for links and primary.
- Brand orange or yellow vs warning: similar risk. Warning uses amber with dark text and an icon.
- Ensure status colours are separate tokens, not derived from brand scale (`--danger`, `--success` stay constant even if brand changes).
- Test colour-blind simulation for the pair.

### 8. Colour-blind-safe practice
- Prevalence: about 8% of men and 0.4% of women of Northern European ancestry have red-green deficiency; overall about 1 in 12 men (Wikipedia).
- Never encode with colour alone; add icon, label, pattern, position (Okabe and Ito; WCAG 1.4.1).
- Avoid red vs green, green vs brown, blue vs purple, pink vs grey as only differentiators.
- Differentiate by lightness as well as hue.
- Use the Okabe-Ito palette for categorical data; prefer blue/orange as a safe pair.
- Direct labels over legends.
- Test with simulators, and with at least one real user if possible.

### 9. Dark-mode colour rules
- Do not invert. Build a separate scale at different tone targets; keep role names the same.
- Background: very dark tinted neutral, roughly L 0.14 to 0.22, not pure black; text off-white about L 0.92 to 0.95 (my range). Pure white on black produces glare ("halation", unverified for effect size; many designers cite it, astigmatism link is not in NN/g).
- Reduce chroma on accent colours by about 10 to 25% and raise lightness; fully saturated colours vibrate on dark surfaces (practitioner; moderate).
- Elevation: raised surfaces get lighter, not just shadowed (Material and common practice; moderate).
- Borders do more work in dark mode than shadows.
- Contrast: maintain 4.5:1 for text. Material's tone rule applies (difference of 50 tones for 4.5:1).
- NN/g: light mode tends to win on legibility for normal vision; do not make dark the only mode.

### 10. Data-viz palette rules (brief)
- Use sequential (one hue, lightness varies) for ordered values, diverging (two hues, neutral midpoint) for values around a midpoint, categorical (distinct hues at similar lightness) for categories. Limit categorical to about 5 to 8 colours.
- Make categories differ in lightness as well as hue so greyscale and colour-blind users can separate them.
- Use Okabe-Ito or a similar tested palette.
- Do not use red/green as the only pair; use blue/orange.
- Put direct labels next to the data; use legends only as backup.
- Keep chart colours separate from brand and status colours, or mark overlap.
- Use muted colour for context (grey) and strong colour for the highlight.

---

## Evidence grades

| Claim | Strength | Source |
|---|---|---|
| OKLCH lightness is more perceptually uniform than HSL | strong | Ottosson (Oklab post); Evil Martians |
| CIELAB/LCH has blue-to-purple hue drift; OKLab fixes most of it | strong | Ottosson; Evil Martians |
| Interpolating gradients in sRGB gives grey middles; OKLab/OKLCH helps | strong | Comeau; Ottosson |
| Equal-lightness steps across hues give predictable contrast | strong | Stripe; Radix; Material tone rule |
| Tone difference 40 gives 3:1 and 50 gives 4.5:1 (HCT) | strong (vendor spec) | Material 3 blog |
| Red-green deficiency affects up to 8% of men (Northern European) | strong | Wikipedia (Color blindness) |
| Do not encode information by colour alone | strong | Okabe and Ito; WCAG 1.4.1 (unverified here, standard) |
| Saturation raises arousal; brightness raises pleasure | moderate | Valdez and Mehrabian 1994; Wilms and Oberfeld 2018 (summary) |
| Hue affects emotion less than saturation and brightness | moderate | Valdez and Mehrabian 1994 |
| Colour-emotion associations show a large shared core across nations (r about .88) with local variation | moderate | Jonauskaite et al. 2020 |
| Colour preferences come from liking of associated objects | moderate | Palmer and Schloss 2010 |
| Blue is the most liked colour in many countries | moderate | YouGov 2015 (survey; another survey found teal) |
| Red reads exciting, blue competent in brand perception | moderate | Labrecque and Milne 2012 (summary) |
| Colour should fit product type (functional vs sensory-social) | moderate | Bottomley and Doyle 2006 |
| Light mode gives better legibility for normal vision, esp. small text | moderate | NN/g summary of 2013 and 2017 studies |
| Dark mode reduces eye strain | weak | NN/g found no significant fatigue difference |
| Red text or background reduces cognitive performance | weak (replication failures) | Elliot et al. 2007 vs Steele et al. replications |
| 62 to 90% of snap judgements are due to colour alone | myth | Singh 2006 (review, caveated; figure over-repeated) |
| Luxury = black, white, gold, restraint, few colours | weak to moderate | small packaging study; practitioner blogs |
| 60-30-10 proportions | weak (rule of thumb) | decorators' convention; no study found |
| Colour wheel harmony schemes make interfaces pleasing | weak | convention; no UI-specific evidence found |
| Hue shift across a scale looks more natural than pure lightness change | weak (practitioner) | Refactoring UI (unverified) |
| Dark mode: reduce accent chroma and avoid pure white to avoid halation | weak to moderate (practitioner); halation/astigmatism link unverified | background knowledge; NN/g silent |
| Green is sacred in Islam; red is lucky in China; white is mourning in East Asia | moderate to strong (cultural); Islam item unverified here | Wikipedia (Color symbolism); background knowledge |
| "Colours have fixed meanings" (red = passion, blue = calm in every context) | myth | Elliot and Maier 2012; Palmer and Schloss 2010 |

## Disagreements spotted
- Lightness model: Stripe used CIELAB, Material uses HCT (CAM16 hue/chroma plus L* tone), others use OKLCH. All agree on equal-lightness-for-equal-contrast; they differ on the space. OKLCH is simplest for CSS.
- Blue as trust colour: Labrecque and Milne and surveys favour blue, yet blue is also the most overused, which erodes differentiation. Do not equate "most liked" with "best for brand".
- Hue shift in scales: Refactoring UI advises shifting hue; Radix and Stripe flatten lightness but keep hue closer to constant. Both work; hue shifts of over about 15 degrees risk off-brand tints.
- Neutral tint amount: Material uses very low chroma neutrals; Tailwind offers visibly tinted ones (slate, stone). Choose by tone (clinical vs warm).
- Dark mode: NN/g shows light mode wins for acuity in normal vision; designers cite eye comfort and battery. Both are partly true: dark is a preference and a context option, not a universal upgrade.
- Red effect: original studies say red harms performance; replications mostly fail. Do not design around it.
- Contrast metric: WCAG 2 ratios are the legal floor; APCA (used by Radix, recommended by Evil Martians) is more perceptual but not yet a standard. Use WCAG for compliance, APCA as a second opinion.
- Favourite colour surveys disagree (blue in YouGov 2015, teal in G.F. Smith 2017).

## Gaps to verify in v2 follow-up
- Open Wilms and Oberfeld 2018 and Jonauskaite 2020 full text to confirm hue-level claims.
- Read CSS Color 4/5 spec for interpolation and hue-arc keywords (web.dev URL returned 404).
- Confirm Material neutral chroma numbers and Okabe-Ito hex values from primary source.
- Verify Islam/green and China stock-market colour claims with a reputable localisation source.
