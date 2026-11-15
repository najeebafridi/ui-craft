// Build the ui-craft direction library and the default tokens.css.
// Each direction = colours from scripts/palette.mjs (contrast-solved) + type, shape, depth, density and motion tokens.
// Run after changing a direction:   node tools/build-directions.mjs
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generate, toCss, oklch } from "../skills/ui-craft/scripts/palette.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "skills/ui-craft/assets");
mkdirSync(join(OUT, "directions"), { recursive: true });

const SYS = `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
const SERIF = `ui-serif, "Iowan Old Style", "Palatino Linotype", Georgia, serif`;
const MONO = `ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace`;
const sh = (a) => `rgb(var(--shadow-color) / calc(${a} * var(--shadow-strength)))`;

// Depth styles. Every one keeps a single light source (from above) and tints its shadows via --shadow-color.
const DEPTH = {
  soft: {
    raised: `0 0 0 1px var(--ring), 0 1px 2px ${sh(0.06)}, 0 2px 4px ${sh(0.05)}`,
    overlay: `0 0 0 1px var(--ring), 0 4px 8px ${sh(0.05)}, 0 12px 24px ${sh(0.08)}, 0 24px 48px ${sh(0.08)}`,
    button: `inset 0 1px 0 var(--highlight), 0 1px 2px ${sh(0.14)}`,
  },
  hairline: {
    raised: `0 0 0 1px var(--ring)`,
    overlay: `0 0 0 1px var(--ring), 0 2px 6px ${sh(0.06)}, 0 12px 32px ${sh(0.12)}`,
    button: `inset 0 1px 0 var(--highlight)`,
  },
  crisp: {
    raised: `0 0 0 1px var(--ring), 0 2px 4px ${sh(0.05)}, 0 8px 16px ${sh(0.07)}`,
    overlay: `0 0 0 1px var(--ring), 0 8px 16px ${sh(0.07)}, 0 24px 56px ${sh(0.14)}`,
    button: `inset 0 1px 0 var(--highlight), 0 1px 2px ${sh(0.16)}, 0 2px 6px ${sh(0.08)}`,
  },
  diffuse: {
    raised: `0 2px 6px ${sh(0.04)}, 0 10px 28px ${sh(0.07)}`,
    overlay: `0 8px 16px ${sh(0.05)}, 0 24px 64px ${sh(0.12)}`,
    button: `0 2px 8px ${sh(0.1)}`,
  },
  none: {
    raised: `none`,
    overlay: `0 0 0 1px var(--border-strong), 0 16px 48px ${sh(0.12)}`,
    button: `none`,
  },
  lip: {
    raised: `0 0 0 2px var(--border), 0 4px 0 var(--border)`,
    overlay: `0 0 0 2px var(--border-strong), 0 6px 0 var(--border-strong)`,
    button: `0 4px 0 var(--accent-hover)`,
  },
};

const MOTION = {
  instant: { fast: 90, base: 140, slow: 200, press: 0.98, ease: "cubic-bezier(0.2, 0, 0, 1)" },
  crisp: { fast: 120, base: 200, slow: 300, press: 0.97, ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
  gentle: { fast: 160, base: 260, slow: 400, press: 0.98, ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" },
  slow: { fast: 180, base: 320, slow: 560, press: 0.99, ease: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
  bouncy: { fast: 120, base: 220, slow: 360, press: 0.95, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
};

// accent / secondary are [L, C, H] in OKLCH so the hue choice is explicit; fonts are all SIL OFL (Google Fonts).
const DIRECTIONS = [
  {
    slug: "calm-productivity", name: "Calm productivity", theme: "light",
    for: "General SaaS, project and task tools, calendars, CRMs, internal apps. The safe default when no other direction clearly fits.",
    feeling: "Clear, friendly, capable. Nothing shouts.",
    accent: [0.55, 0.17, 256], neutral: "warm", tint: 1,
    fonts: { display: "Inter", sans: "Inter", mono: "JetBrains Mono" }, gf: [["Inter", "wght@400;500;600"], ["JetBrains Mono", "wght@400;500"]],
    type: "One neutral sans for everything. Headings 600 with tight tracking; body 400.",
    tracking: "-0.022em", weight: 600, radius: [6, 8, 12], depth: "soft", borderW: 1,
    density: { control: 36, row: 40, body: 14, section: 48 }, motion: "crisp",
    shape: "Medium radius. Soft two-layer shadows with a 1px ring; inputs keep a real border.",
    imagery: "Real product UI, simple line icons, avatars. A small custom empty-state illustration at most.",
    voice: "Plain and warm. Verb + object buttons. Specific confirmations.",
    signature: "One satisfying completion moment (a check that draws itself, a row that settles) and beautifully calm lists.",
    watch: "Easy to make generic. It needs exact spacing, real content and one signature detail to rise above a template.",
  },
  {
    slug: "quiet-instrument", name: "Quiet instrument", theme: "dark",
    for: "Developer tools, issue trackers, B2B workflow software, power-user apps that people live in all day.",
    feeling: "Fast, calm, in control. The chrome disappears so the work is the hero.",
    accent: [0.58, 0.19, 262], neutral: "brand", tint: 1,
    fonts: { display: "Geist", sans: "Geist", mono: "Geist Mono" }, gf: [["Geist", "wght@400;500;600"], ["Geist Mono", "wght@400;500"]],
    type: "A precise grotesque at small sizes (13-14px). Mono for IDs, counts and shortcuts.",
    tracking: "-0.02em", weight: 600, radius: [4, 6, 10], depth: "hairline", borderW: 1,
    density: { control: 32, row: 36, body: 14, section: 32 }, motion: "instant",
    shape: "Tight radius. Hairline rings instead of shadows; depth comes from surface lightness.",
    imagery: "The product itself: dense lists, code, keyboard hints. No stock imagery.",
    voice: "Terse. Verbs. No exclamation marks.",
    signature: "Keyboard-first: visible shortcut hints (kbd chips), a command palette, instant response with no decorative motion.",
    watch: "Dark near-black plus one blue-violet accent is the most copied look in software. Earn it with real density, alignment and speed, or change the accent hue.",
  },
  {
    slug: "paper-and-ink", name: "Paper and ink", theme: "light",
    for: "Writing, notes, knowledge bases, documentation, publishing, newsletters, reading apps.",
    feeling: "Literate, calm, unhurried. Like a well-set page.",
    accent: [0.42, 0.11, 258], neutral: "warm", tint: 2,
    fonts: { display: "Newsreader", sans: "Inter", mono: "JetBrains Mono" }, gf: [["Newsreader", "ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400"], ["Inter", "wght@400;500;600"]],
    type: "A reading serif for headings and long text; a plain sans for UI controls. Body 17-18px in reading views, 66 characters wide.",
    tracking: "-0.015em", weight: 500, radius: [3, 5, 8], depth: "none", borderW: 1,
    density: { control: 36, row: 40, body: 16, section: 64 }, motion: "gentle",
    shape: "Nearly square. Thin rules and whitespace instead of boxes; no shadows.",
    imagery: "None, or quiet line illustration. Typography is the image.",
    voice: "Plain, exact, slightly dry. Full sentences.",
    signature: "Typographic care you can feel: true italics, hanging punctuation, old-style or tabular figures used on purpose, a perfect reading measure.",
    watch: "Warm cream plus a rust accent is a known cliche. Keep the accent ink-like and small, and let the type do the work.",
  },
  {
    slug: "studio-gloss", name: "Studio gloss", theme: "light",
    for: "Premium consumer products and apps, hardware, cameras, audio, flagship product pages, portfolios of physical products.",
    feeling: "Polished, expensive, effortless.",
    accent: [0.55, 0.2, 255], neutral: "pure", tint: 0,
    fonts: { display: "Inter", sans: "Inter", mono: "JetBrains Mono" }, gf: [["Inter", "opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700"]],
    type: "One grotesque. Very large headlines (56-96px) set tight; short supporting lines at 20-24px.",
    tracking: "-0.035em", weight: 600, radius: [10, 18, 28], depth: "crisp", borderW: 1,
    density: { control: 44, row: 48, body: 17, section: 96 }, motion: "gentle",
    shape: "Large soft radii on media and panels. Shadows only under the product; UI stays flat.",
    imagery: "Studio product photography or precise renders on plain grounds. Alternate full-width white and near-black panels.",
    voice: "Short declarative lines. One idea per screen.",
    signature: "The product is the hero: one huge image and one sentence per screen, with a scroll reveal that explains a feature.",
    watch: "Fails without real product imagery. Never fill the hero with a gradient blob where the product should be.",
  },
  {
    slug: "maison", name: "Maison", theme: "light",
    for: "Luxury goods, hotels, jewellery, fine dining, fashion, private banking, premium real estate.",
    feeling: "Quiet confidence. Desire through restraint.",
    accent: [0.36, 0.07, 165], neutral: 80, tint: 2,
    fonts: { display: "Cormorant Garamond", sans: "Hanken Grotesk", mono: "JetBrains Mono" }, gf: [["Cormorant Garamond", "ital,wght@0,400;0,500;0,600;1,400"], ["Hanken Grotesk", "wght@300;400;500"]],
    type: "A high-contrast display serif at generous size with a light, quiet sans. Navigation in small tracked capitals (12px, +0.12em).",
    tracking: "-0.01em", weight: 500, radius: [0, 0, 2], depth: "none", borderW: 1,
    density: { control: 48, row: 56, body: 16, section: 128 }, motion: "slow",
    shape: "Square corners. Hairlines only. No shadows, no badges, no bursts.",
    imagery: "Few, large, carefully cropped photographs with one colour grade. Objects are given room.",
    voice: "Sparse and assured. Third person. No exclamation marks, no discounts shouted.",
    signature: "Space as the luxury: one object, one line of text, and a lot of nothing around them. Slow page-level fades.",
    watch: "Do not add urgency, pop-ups or dense grids. Slow motion is for page-level transitions only; controls still respond instantly.",
    altAccents: "oxblood oklch(0.36 0.11 20), ink navy oklch(0.3 0.07 260), or no accent at all (text-colour buttons)",
  },
  {
    slug: "apothecary", name: "Apothecary editorial", theme: "light",
    for: "Skincare, wellness retail, craft food and drink, boutiques, florists, considered e-commerce.",
    feeling: "Warm, intelligent, hand-made.",
    accent: [0.45, 0.075, 122], neutral: 85, tint: 3,
    fonts: { display: "Libre Caslon Text", sans: "Hanken Grotesk", mono: "JetBrains Mono" }, gf: [["Libre Caslon Text", "ital,wght@0,400;0,700;1,400"], ["Hanken Grotesk", "wght@400;500;600"]],
    type: "A bookish serif for names and headings, a humane sans for details. Product names in serif, facts in sans.",
    tracking: "-0.01em", weight: 400, radius: [0, 2, 4], depth: "none", borderW: 1,
    density: { control: 44, row: 52, body: 16, section: 96 }, motion: "gentle",
    shape: "Flat. Thin rules. Label-like blocks, as on a well-designed jar.",
    imagery: "Products on neutral ground in natural light; hands, materials, ingredients. Consistent crop and grade.",
    voice: "Specific and literary: what it is, what it is made of, how to use it.",
    signature: "The label: precise ingredient-style lists and numbered details set like packaging typography.",
    watch: "Without real photography this collapses into the cream-and-earth-tone template. Use real product images or pick another direction.",
  },
  {
    slug: "soft-wellness", name: "Soft wellness", theme: "light",
    for: "Meditation, sleep, therapy, mental health, patient apps, family and care products.",
    feeling: "Safe, slow, kind. Lowers the heart rate.",
    accent: [0.56, 0.085, 205], neutral: "brand", tint: 2,
    fonts: { display: "Nunito", sans: "Nunito Sans", mono: "JetBrains Mono" }, gf: [["Nunito", "wght@500;600;700"], ["Nunito Sans", "opsz,wght@6..12,400;6..12,600"]],
    type: "Rounded, open letterforms. Larger body (16-17px), relaxed line height, short lines.",
    tracking: "-0.01em", weight: 600, radius: [12, 20, 28], depth: "diffuse", borderW: 1,
    density: { control: 48, row: 56, body: 17, section: 64 }, motion: "gentle",
    shape: "Very round. Wide, faint, diffuse shadows; no hard lines.",
    imagery: "Soft flat illustration or calm nature photography; gentle tinted backgrounds.",
    voice: "Kind, second person, no pressure. Never guilt, never streak-shaming.",
    signature: "One slow breathing element (a shape that expands and settles over 4-6s, pausable) and extremely gentle confirmations.",
    watch: "Low saturation must not become low contrast: text still passes 4.5:1. No confetti or alarms for anxious users.",
    altAccents: "sage oklch(0.56 0.07 150), dusk blue oklch(0.52 0.09 255), peach as a secondary only",
  },
  {
    slug: "playful", name: "Playful game-feel", theme: "light",
    for: "Learning apps, kids and family, habit and fitness trackers, casual consumer apps, quizzes.",
    feeling: "Fun, rewarding, tactile.",
    accent: [0.6, 0.2, 252], secondary: [0.86, 0.17, 92], neutral: "pure", tint: 0,
    fonts: { display: "Baloo 2", sans: "Nunito", mono: "JetBrains Mono" }, gf: [["Baloo 2", "wght@600;700;800"], ["Nunito", "wght@500;600;700;800"]],
    type: "A chunky rounded display face for headings and buttons; a rounded sans for text. Bold weights.",
    tracking: "-0.01em", weight: 700, radius: [12, 16, 24], depth: "lip", borderW: 2,
    density: { control: 48, row: 56, body: 16, section: 48 }, motion: "bouncy",
    shape: "Chunky. 2px borders and a solid bottom edge (a lip) instead of blurred shadows; buttons physically press down.",
    imagery: "A mascot or bold flat illustration with 2-3 saturated colours and dark outlines.",
    voice: "Cheeky, encouraging, very short.",
    signature: "Tactile buttons: a 4px solid lip that the button sinks into on press, plus one springy reward moment on success.",
    watch: "Bounce only on rewards and presses, never on navigation. Keep text contrast high; bright does not mean pale.",
  },
  {
    slug: "trusted-ledger", name: "Trusted ledger", theme: "light",
    for: "Banking, accounting, invoicing, payroll, insurance, tax, B2B finance dashboards.",
    feeling: "Safe, exact, modern. Money is handled carefully here.",
    accent: [0.42, 0.13, 255], neutral: "cool", tint: 1,
    fonts: { display: "IBM Plex Sans", sans: "IBM Plex Sans", mono: "IBM Plex Mono" }, gf: [["IBM Plex Sans", "wght@400;500;600"], ["IBM Plex Mono", "wght@400;500"]],
    type: "A sober, engineered sans with excellent numerals. Tabular figures everywhere money appears.",
    tracking: "-0.015em", weight: 600, radius: [4, 6, 10], depth: "soft", borderW: 1,
    density: { control: 36, row: 40, body: 14, section: 40 }, motion: "crisp",
    shape: "Small radius, fine borders, restrained shadows. Tables are first-class.",
    imagery: "Product screens and simple honest charts. No stock handshakes.",
    voice: "Plain, exact, transparent about fees and dates.",
    signature: "Numbers set like a ledger: right-aligned, tabular, decimals lined up, currency symbols quieter than the digits, and confirmations that state the exact amount and time.",
    watch: "Blue is expected here but owned by everyone. Differentiate with a distinctive deep hue (teal, forest, plum) at the same seriousness, not with brightness.",
    altAccents: "deep teal oklch(0.45 0.09 200), forest oklch(0.42 0.1 155), plum oklch(0.4 0.12 330)",
  },
  {
    slug: "neo-bank", name: "Neo-bank bold", theme: "dark",
    for: "Consumer fintech, cards, wallets, subscriptions, investing for younger audiences, bold consumer apps.",
    feeling: "Confident, current, a little loud.",
    accent: [0.88, 0.2, 128], neutral: "pure", tint: 0,
    fonts: { display: "Space Grotesk", sans: "Manrope", mono: "JetBrains Mono" }, gf: [["Space Grotesk", "wght@500;600;700"], ["Manrope", "wght@400;500;600;700"]],
    type: "A wide, characterful grotesque for huge numerals and headings; a clean geometric sans for text.",
    tracking: "-0.03em", weight: 600, radius: [12, 20, 28], depth: "hairline", borderW: 1,
    density: { control: 48, row: 56, body: 16, section: 56 }, motion: "crisp",
    shape: "Large radii and pill-shaped primary buttons. Flat blocks of solid colour; almost no shadow.",
    imagery: "The card or device as an object; big flat colour fields.",
    voice: "Casual, direct, human. Short.",
    signature: "Giant numerals: the balance or key figure at 56-72px, tabular, with one vivid signature colour on black.",
    watch: "One vivid colour only. Dark text on the vivid colour (never white on lime). Money is still serious: confirmations stay calm and exact.",
    altAccents: "coral oklch(0.72 0.19 28), electric blue oklch(0.62 0.22 258), violet oklch(0.62 0.22 300)",
  },
  {
    slug: "public-clarity", name: "Public clarity", theme: "light",
    for: "Government and public services, health portals, utilities, legal and benefits forms, education services, anything used by everyone.",
    feeling: "Dependable, fair, impossible to misread.",
    accent: [0.48, 0.14, 255], neutral: "pure", tint: 0,
    fonts: { display: "Public Sans", sans: "Public Sans", mono: "JetBrains Mono" }, gf: [["Public Sans", "wght@400;500;600;700"]],
    type: "A plain, highly legible sans. Body 18-19px. Bold headings. Underlined links.",
    tracking: "-0.01em", weight: 700, radius: [0, 2, 4], depth: "none", borderW: 2,
    density: { control: 48, row: 52, body: 18, section: 48 }, motion: "instant",
    shape: "Square, strong 2px borders, no shadows, no decoration.",
    imagery: "Almost none. Content only.",
    voice: "Plain language at a reading age of 9-12. One question per page. Say what happens next.",
    signature: "An unmissable focus state (3px ring plus offset) and one question per page with a summary before submit.",
    watch: "Do not prettify at the cost of clarity. Every colour passes AA at minimum; aim for AAA on body text.",
  },
  {
    slug: "marketplace", name: "Open-air marketplace", theme: "light",
    for: "Travel, rentals, food delivery, events, classifieds, consumer marketplaces and booking.",
    feeling: "Inviting, trustworthy, easy.",
    accent: [0.6, 0.2, 18], neutral: 60, tint: 1,
    fonts: { display: "Figtree", sans: "Figtree", mono: "JetBrains Mono" }, gf: [["Figtree", "wght@400;500;600;700"]],
    type: "A friendly geometric sans. Prices and ratings in semibold.",
    tracking: "-0.02em", weight: 600, radius: [10, 14, 20], depth: "crisp", borderW: 1,
    density: { control: 44, row: 52, body: 16, section: 56 }, motion: "crisp",
    shape: "Friendly radii. Photo cards with a 1px inner outline; light shadows only on things that lift.",
    imagery: "Real places, food and people, large and consistent in aspect ratio. Photos carry the colour.",
    voice: "Warm and welcoming. Clear total prices.",
    signature: "Search as the hero: one prominent search bar, then photo cards with honest totals and ratings.",
    watch: "The accent is close to error red: errors use a separate crimson plus icon and text. Total price visible before the last step.",
  },
  {
    slug: "stage-dark", name: "Stage dark", theme: "dark",
    for: "Music, video, podcasts, gaming, events, streaming, portfolios of media work.",
    feeling: "Immersive. The content performs; the interface holds the lights.",
    accent: [0.76, 0.16, 62], neutral: "brand", tint: 1,
    fonts: { display: "Barlow Condensed", sans: "Outfit", mono: "JetBrains Mono" }, gf: [["Barlow Condensed", "wght@500;600;700"], ["Outfit", "wght@400;500;600"]],
    type: "A condensed display face for big titles; a confident geometric sans for everything else.",
    tracking: "0em", weight: 600, radius: [6, 10, 16], depth: "hairline", borderW: 1,
    density: { control: 40, row: 48, body: 15, section: 48 }, motion: "crisp",
    shape: "Depth from surface lightness, not shadow. Artwork gets a 1px inner outline.",
    imagery: "Cover art, posters, stills. They supply all the colour; the UI stays near-black and neutral.",
    voice: "Short, low on hype.",
    signature: "Colour from the content: a faint ambient tint behind the current artwork (blurred, very low opacity) and large condensed titles.",
    watch: "Near-black, never pure black next to bright art. Dark text on the bright accent. Keep motion cinematic but short; no parallax on text.",
    altAccents: "magenta oklch(0.68 0.22 350), acid green oklch(0.84 0.2 135), electric cyan oklch(0.8 0.13 210)",
  },
  {
    slug: "athletic", name: "Athletic monument", theme: "light",
    for: "Sportswear, fitness brands, product drops, campaigns, events, bold e-commerce.",
    feeling: "Powerful, urgent, physical.",
    accent: [0.64, 0.24, 32], neutral: "pure", tint: 0,
    fonts: { display: "Anton", sans: "Inter", mono: "JetBrains Mono" }, gf: [["Anton", null], ["Inter", "wght@400;500;600;700"]],
    type: "Heavy condensed uppercase display type at monumental size (80-200px) over a plain sans.",
    tracking: "0em", weight: 400, radius: [0, 0, 0], depth: "none", borderW: 2,
    density: { control: 52, row: 56, body: 16, section: 96 }, motion: "crisp",
    shape: "Hard edges. Black, white and one colour block. No shadows, no rounding.",
    imagery: "Full-bleed action photography; tight crops; high contrast.",
    voice: "Imperative. Two to four words.",
    signature: "Monumental type over imagery: one giant uppercase word or line that fills the width.",
    watch: "Uppercase display only for short lines (under 5 words). Body text stays sentence case and readable.",
  },
  {
    slug: "graph-paper", name: "Graph-paper technical", theme: "dark",
    for: "APIs, infrastructure, security, data and AI platforms, observability, technical documentation.",
    feeling: "Rigorous, credible, engineered.",
    accent: [0.74, 0.14, 168], neutral: "cool", tint: 1,
    fonts: { display: "Geist", sans: "Geist", mono: "JetBrains Mono" }, gf: [["Geist", "wght@400;500;600"], ["JetBrains Mono", "wght@400;500"]],
    type: "A grotesque for prose, a mono for labels, metrics, IDs and table headers (12px, sentence case).",
    tracking: "-0.02em", weight: 500, radius: [2, 4, 6], depth: "hairline", borderW: 1,
    density: { control: 32, row: 36, body: 14, section: 40 }, motion: "instant",
    shape: "Almost square. Visible structure: hairlines, a faint grid, corner marks. No soft shadows.",
    imagery: "Code, terminal output, diagrams that draw themselves, real metrics.",
    voice: "Exact. No marketing adjectives. Numbers with units.",
    signature: "A visible grid: a faint dotted or lined background and hairline frames that make the layout look measured.",
    watch: "Mono type is for data and labels, not paragraphs. Dark text on the bright accent. The grid stays under 6% contrast.",
    altAccents: "amber oklch(0.8 0.15 80), signal blue oklch(0.62 0.19 255)",
  },
  {
    slug: "bright-workshop", name: "Bright workshop", theme: "light",
    for: "Creative and collaboration tools, agencies, studios, startup launch pages, community products.",
    feeling: "Energetic, witty, organised chaos.",
    accent: [0.5, 0.24, 268], secondary: [0.87, 0.17, 95], neutral: "pure", tint: 0,
    fonts: { display: "Bricolage Grotesque", sans: "DM Sans", mono: "JetBrains Mono" }, gf: [["Bricolage Grotesque", "opsz,wght@12..96,500;12..96,600;12..96,700"], ["DM Sans", "opsz,wght@9..40,400;9..40,500;9..40,600"]],
    type: "A quirky display grotesque for oversized headlines; a tidy sans for text.",
    tracking: "-0.03em", weight: 600, radius: [10, 16, 24], depth: "none", borderW: 2,
    density: { control: 44, row: 52, body: 16, section: 80 }, motion: "crisp",
    shape: "Flat fields of solid colour, 2px dark outlines, slightly offset layers like cut paper.",
    imagery: "Collage: screenshots, shapes and illustrated people overlapping on colour blocks.",
    voice: "Witty and human, never corporate.",
    signature: "Bold colour blocking: two or three solid colour fields with an oversized, slightly odd headline crossing them.",
    watch: "Inside the actual tool, switch to neutral chrome (Calm productivity); the loud colour is for marketing and moments.",
  },
];

function fontsUrl(gf) {
  return "https://fonts.googleapis.com/css2?" + gf.map(([f, axes]) => "family=" + f.replace(/ /g, "+") + (axes ? ":" + axes : "")).join("&") + "&display=swap";
}
const stack = (name, fallback) => `"${name}", ${fallback}`;
const isSerif = (n) => /Newsreader|Cormorant|Caslon|Serif|Garamond|Fraunces|Playfair/.test(n);

function nonColour(d) {
  const dp = DEPTH[d.depth], m = MOTION[d.motion];
  return [
    `  /* type */`,
    `  --font-display: ${stack(d.fonts.display, isSerif(d.fonts.display) ? SERIF : SYS)};`,
    `  --font-sans: ${stack(d.fonts.sans, SYS)};`,
    `  --font-mono: ${stack(d.fonts.mono, MONO)};`,
    `  --tracking-display: ${d.tracking};  --weight-display: ${d.weight};  --text-body: ${d.density.body}px;`,
    `  /* shape and depth (${d.depth}) */`,
    `  --radius-sm: ${d.radius[0]}px;  --radius: ${d.radius[1]}px;  --radius-lg: ${d.radius[2]}px;  --border-w: ${d.borderW}px;`,
    `  --shadow-raised: ${dp.raised};`,
    `  --shadow-overlay: ${dp.overlay};`,
    `  --shadow-button: ${dp.button};`,
    `  /* density and motion (${d.motion}) */`,
    `  --control-h: ${d.density.control}px;  --row-h: ${d.density.row}px;  --space-section: ${d.density.section}px;`,
    `  --dur-fast: ${m.fast}ms;  --dur-base: ${m.base}ms;  --dur-slow: ${m.slow}ms;  --ease-out: ${m.ease};  --press-scale: ${m.press};`,
    ``,
  ].join("\n");
}

const index = [];
for (const d of DIRECTIONS) {
  const accentHex = oklch(...d.accent);
  const res = generate({ accent: accentHex, neutral: String(d.neutral), tint: d.tint, secondary: d.secondary ? oklch(...d.secondary) : null, name: d.name });
  const bad = res.report.filter((r) => !r.ok);
  if (bad.length) { console.error(`CONTRAST FAIL in ${d.slug}:`, bad); process.exitCode = 1; }
  const neutralFlag = d.neutral === "brand" ? "brand" : d.neutral;
  const header = `/* ui-craft direction: ${d.name}
   For:        ${d.for}
   Feeling:    ${d.feeling}
   Signature:  ${d.signature}
   Type:       ${d.type}
   Shape:      ${d.shape}
   Imagery:    ${d.imagery}
   Voice:      ${d.voice}
   Watch out:  ${d.watch}
   Default:    ${d.theme} theme${d.theme === "dark" ? ' (set <html data-theme="dark">; the light theme below also works)' : " (a dark theme is included)"}
   Fonts:      <link rel="stylesheet" href="${fontsUrl(d.gf)}">   (all SIL Open Font License)
   Own brand colour? Keep this direction and swap the colour:
               node scripts/palette.mjs --accent "#YOURHEX" --neutral ${neutralFlag} --tint ${d.tint}${d.altAccents ? `\n   Other accents that suit it: ${d.altAccents}` : ""}
   Load after tokens.css. */\n`;
  const css = toCss(res, nonColour(d)).replace(/^\/\*[\s\S]*?\*\/\n/, header);
  writeFileSync(join(OUT, "directions", `${d.slug}.css`), css);
  index.push({ slug: d.slug, name: d.name, theme: d.theme, for: d.for, feeling: d.feeling, signature: d.signature, accent: res.light.accent, bg: d.theme === "dark" ? res.dark.bg : res.light.bg, fonts: d.fonts, radius: d.radius, depth: d.depth, motion: d.motion, notes: res.notes });
}
writeFileSync(join(OUT, "directions", "index.json"), JSON.stringify(index, null, 2) + "\n");

// ---- tokens.css: the base every direction builds on (default colours = Calm productivity) ----
const base = DIRECTIONS[0];
const baseRes = generate({ accent: oklch(...base.accent), neutral: String(base.neutral), tint: base.tint, name: "ui-craft base" });
const baseExtra = `
  /* ---- Type ---- */
  --font-sans: "Inter", ${SYS};
  --font-display: var(--font-sans);
  --font-mono: ${MONO};
  --text-xs: 12px;  --text-sm: 14px;  --text-md: 16px;  --text-lg: 18px;  --text-xl: 20px;
  --text-2xl: 24px; --text-3xl: 30px; --text-4xl: 36px; --text-5xl: 48px; --text-6xl: 60px;
  --text-body: 16px;                    /* 14px in dense desktop tools */
  --leading-tight: 1.15;  --leading-snug: 1.3;  --leading-normal: 1.5;
  --tracking-display: -0.025em;         /* 36px and up */
  --tracking-heading: -0.015em;         /* 20-30px */
  --tracking-caps: 0.06em;              /* small all-caps labels */
  --weight-regular: 400;  --weight-medium: 500;  --weight-semibold: 600;  --weight-display: 600;

  /* ---- Spacing (4px base) ---- */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-5: 24px;  --space-6: 32px;  --space-7: 48px;  --space-8: 64px;  --space-9: 96px;
  --space-section: 48px;

  /* ---- Shape: one family. Nested radius = outer radius minus the padding between. ---- */
  --radius-sm: 6px;  --radius: 8px;  --radius-lg: 12px;  --radius-full: 9999px;  --border-w: 1px;

  /* ---- Depth: one light source from above; shadows are layered and tinted, never one grey blur. ---- */
  --shadow-raised: ${DEPTH.soft.raised};
  --shadow-overlay: ${DEPTH.soft.overlay};
  --shadow-button: ${DEPTH.soft.button};

  /* ---- Motion ---- */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);      /* entering, and most UI */
  --ease-in: cubic-bezier(0.64, 0, 0.78, 0);       /* leaving */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* moving on screen */
  --ease-spring: linear(0, 0.074, 0.234, 0.415, 0.584, 0.723, 0.83, 0.906, 0.956, 0.988, 1.005, 1.013, 1.015, 1.014, 1.012, 1.009, 1.007, 1.004, 1); /* slight overshoot; use with 550ms on transform only */
  --dur-fast: 120ms;  --dur-base: 200ms;  --dur-slow: 300ms;  --press-scale: 0.97;

  /* ---- Sizes ---- */
  --control-h: 40px;       /* buttons, inputs (32-36 compact, 44+ touch) */
  --row-h: 40px;           /* table rows (36 compact, 44+ touch) */
  --sidebar-w: 248px;  --content-max: 1280px;  --reading-max: 68ch;
`;
const baseCss = toCss(baseRes, baseExtra).replace(/^\/\*[\s\S]*?\*\/\n/, `/* ui-craft tokens v2: the base every screen starts from. Generated by tools/build-directions.mjs.
   Colours here are the "Calm productivity" direction. To change the look, load one file from assets/directions/ after this one,
   or build a theme from a brand colour:  node scripts/palette.mjs --accent "#HEX"
   Text passes WCAG 2.2 AA (4.5:1) on --bg, --surface and --surface-2; --border-strong, --focus and chart colours pass 3:1.
   Theme follows the OS; force it with <html data-theme="light|dark">. */\n`) + `
/* ---- Base: small details that make everything feel finished ---- */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font: var(--weight-regular) var(--text-body)/var(--leading-normal) var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-optical-sizing: auto;
}
h1, h2, h3, h4 { margin: 0; font-family: var(--font-display); font-weight: var(--weight-display); line-height: var(--leading-tight); letter-spacing: var(--tracking-heading); text-wrap: balance; }
h1 { letter-spacing: var(--tracking-display); }
p { margin: 0; text-wrap: pretty; }
img, video { max-width: 100%; height: auto; }
::selection { background: color-mix(in oklab, var(--accent) 24%, transparent); }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }   /* outline survives Windows high-contrast mode */
input, textarea, select { caret-color: var(--accent); font: inherit; }
button { font: inherit; }
.num { font-variant-numeric: tabular-nums; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
writeFileSync(join(OUT, "tokens.css"), baseCss);
console.log(`Built tokens.css and ${DIRECTIONS.length} directions:`);
for (const i of index) console.log(`  ${i.slug.padEnd(18)} accent ${i.accent}  ${i.theme.padEnd(5)}  ${i.notes.length ? "notes: " + i.notes.length : ""}`);

// ---- gallery.html: every direction on one page, for choosing with a client and for visual QA ----
const allFonts = [...new Map(DIRECTIONS.flatMap((d) => d.gf).map((f) => [f[0], f])).values()];
const block = (t) => Object.entries(t).map(([k, v]) => `--${k}:${v}`).join(";");
const scoped = DIRECTIONS.map((d, i) => {
  const res = generate({ accent: oklch(...d.accent), neutral: String(d.neutral), tint: d.tint, secondary: d.secondary ? oklch(...d.secondary) : null });
  const extra = nonColour(d).split("\n").filter((l) => l.trim().startsWith("--")).join("");
  return `.d-${d.slug}{${block(res.light)};${extra}}\n.d-${d.slug}.dark{${block(res.dark)}}`;
}).join("\n");
const cards = DIRECTIONS.map((d) => `
  <article class="dir d-${d.slug}${d.theme === "dark" ? " dark" : ""}" data-default="${d.theme}">
    <header><p class="eyebrow">${d.slug}.css</p><h2>${d.name}</h2><p class="for">${d.for}</p></header>
    <div class="demo">
      <h3>${d.feeling}</h3>
      <p class="body">${d.signature}</p>
      <div class="row"><button class="btn primary">Continue</button><button class="btn">Not now</button><span class="badge ok">Paid</span><span class="badge bad">Overdue</span></div>
      <label class="field"><span>Email</span><input value="amara@northwind.studio" aria-label="Email"></label>
      <div class="tile"><div><p class="k">Revenue this month</p><p class="v num">$48,210.50</p><p class="d">▲ 8.2% vs October</p></div>
        <div class="sw">${[1, 2, 3, 4, 5, 6].map((n) => `<i style="background:var(--chart-${n})"></i>`).join("")}</div></div>
    </div>
    <footer>${d.fonts.display}${d.fonts.sans !== d.fonts.display ? " + " + d.fonts.sans : ""} · radius ${d.radius[1]}px · ${d.depth} depth · ${d.motion} motion</footer>
  </article>`).join("\n");
writeFileSync(join(OUT, "directions", "gallery.html"), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>ui-craft directions</title>
<!-- Generated by tools/build-directions.mjs. Open in a browser to compare the visual directions. -->
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fontsUrl(allFonts)}">
<link rel="stylesheet" href="../tokens.css">
<style>
body{background:#F3F4F6;color:#111827;font:14px/1.5 ui-sans-serif,system-ui,sans-serif}
.top{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center;padding:24px 32px 8px}
.top h1{font:600 24px/1.2 ui-sans-serif,system-ui,sans-serif;letter-spacing:-0.02em}
.top p{color:#4B5563;max-width:70ch}
.top button{height:40px;padding:0 16px;border-radius:8px;border:1px solid #6B7280;background:#fff;color:#111827;font:500 14px ui-sans-serif,system-ui,sans-serif;cursor:pointer}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,400px),1fr));gap:24px;padding:24px 32px 64px}
.dir{background:var(--bg);color:var(--text);border-radius:16px;overflow:hidden;box-shadow:0 0 0 1px rgb(0 0 0/.08),0 8px 24px rgb(0 0 0/.06);display:flex;flex-direction:column;font:var(--weight-regular) var(--text-body)/1.5 var(--font-sans)}
.dir header{padding:24px 24px 0}
.dir .eyebrow{font:500 12px var(--font-mono);color:var(--text-subtle)}
.dir h2{font-family:var(--font-display);font-weight:var(--weight-display);font-size:30px;letter-spacing:var(--tracking-display);line-height:1.15;margin-top:4px}
.dir .for{color:var(--text-muted);font-size:14px;margin-top:8px}
.demo{margin:24px;padding:24px;background:var(--surface);border-radius:var(--radius-lg);box-shadow:var(--shadow-raised);border:var(--border-w) solid var(--border);display:flex;flex-direction:column;gap:16px}
.demo h3{font-family:var(--font-display);font-weight:var(--weight-display);font-size:20px;letter-spacing:var(--tracking-heading);line-height:1.25}
.demo .body{color:var(--text-muted);font-size:14px}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.btn{height:var(--control-h);padding:0 16px;border-radius:var(--radius);border:var(--border-w) solid var(--border-strong);background:var(--surface);color:var(--text);font:500 14px var(--font-sans);cursor:pointer;transition:transform var(--dur-fast) var(--ease-out),background-color var(--dur-fast)}
.btn.primary{background:var(--accent);color:var(--accent-fg);border-color:transparent;box-shadow:var(--shadow-button)}
.btn.primary:hover{background:var(--accent-hover)}
.btn:active{transform:scale(var(--press-scale))}
.badge{font-size:12px;font-weight:500;padding:4px 8px;border-radius:var(--radius-sm)}
.badge.ok{background:var(--success-soft);color:var(--success-text)} .badge.bad{background:var(--danger-soft);color:var(--danger-text)}
.field{display:flex;flex-direction:column;gap:4px;font-size:14px;font-weight:500}
.field input{height:var(--control-h);padding:0 12px;border-radius:var(--radius);border:var(--border-w) solid var(--border-strong);background:var(--surface);color:var(--text);font:400 16px var(--font-sans)}
.tile{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;padding:16px;background:var(--surface-2);border-radius:var(--radius)}
.tile .k{font-size:12px;color:var(--text-muted)} .tile .v{font-family:var(--font-display);font-weight:var(--weight-display);font-size:24px;letter-spacing:var(--tracking-heading)} .tile .d{font-size:12px;color:var(--success-text)}
.sw{display:flex;gap:4px} .sw i{width:12px;height:32px;border-radius:2px;display:block}
.dir footer{margin-top:auto;padding:0 24px 24px;font-size:12px;color:var(--text-subtle)}
@media (max-width:640px),(pointer:coarse){.btn,.field input,.top button{min-height:44px}.top,.grid{padding-left:16px;padding-right:16px}}
${scoped}
</style></head>
<body>
<div class="top"><div><h1>ui-craft directions</h1><p>Sixteen visual directions. Each is a small theme file in this folder: colours (contrast-checked, light and dark), fonts, shape, depth and motion. Pick the one that fits the audience, then swap in the brand colour.</p></div>
<button type="button" id="flip">Show the other theme</button></div>
<main class="grid">${cards}
</main>
<script>document.getElementById("flip").onclick=()=>document.querySelectorAll(".dir").forEach(d=>d.classList.toggle("dark"));</script>
</body></html>
`);
console.log("Built directions/gallery.html");

// ---- keep the mockup template's inline tokens identical to tokens.css ----
const tplPath = join(OUT, "mockup-template.html");
const tpl = readFileSync(tplPath, "utf8");
const startMark = tpl.indexOf("/* tokens:start"), endMark = tpl.indexOf("/* tokens:end */");
if (startMark < 0 || endMark < 0) throw new Error("token markers missing in mockup-template.html");
const afterStart = tpl.indexOf("\n", startMark) + 1;
const tokensOnly = baseCss.slice(baseCss.indexOf("*/\n") + 3);
writeFileSync(tplPath, tpl.slice(0, afterStart) + tokensOnly + tpl.slice(endMark));
console.log("Synced tokens into mockup-template.html");
