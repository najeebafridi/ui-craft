# Visual directions: choosing the look

Load this when a product has no settled visual identity, when the user asks for a "premium", "modern" or "distinct" look, when you offer design options, or when a screen came out correct but generic.

A direction is a complete, reasoned look: colour, type, shape, depth, density, motion, imagery and voice that belong together and suit one kind of audience. Choosing one on purpose is what separates a designed product from a default one. Choose **for the audience**, never for novelty.

## How to choose (three questions)

1. **Who uses it, and in what state of mind?** Rushed experts, anxious patients, bored commuters and curious shoppers need different things (see `psychology-emotion.md`).
2. **What should they feel?** Pick two or three words: "safe and exact", "fast and in control", "warm and unhurried".
3. **What does the category expect?** People judge a screen in a fraction of a second, and they prefer one that looks like a good example of its kind. Stay inside the category's conventions for structure; be distinctive in the details and the signature.

Then pick the row that fits. If two fit, choose the quieter one.

| Direction (file) | Best for | Feeling | Theme | Type | Signature |
|---|---|---|---|---|---|
| **Calm productivity** `calm-productivity` | general SaaS, task tools, CRMs, internal apps | clear, friendly, capable | light | Inter | one satisfying completion moment; calm lists |
| **Quiet instrument** `quiet-instrument` | dev tools, trackers, power-user B2B | fast, calm, in control | dark | Geist + Geist Mono | keyboard hints, command palette, zero decoration |
| **Paper and ink** `paper-and-ink` | writing, notes, docs, publishing | literate, unhurried | light | Newsreader + Inter | typographic care, perfect reading measure |
| **Studio gloss** `studio-gloss` | premium consumer products, hardware, flagship pages | polished, expensive | light | Inter, huge and tight | product as hero, one idea per screen |
| **Maison** `maison` | luxury, hotels, jewellery, fashion, private banking | quiet confidence | light | Cormorant Garamond + Hanken Grotesk | space as the luxury |
| **Apothecary editorial** `apothecary` | skincare, craft food, boutiques | warm, intelligent, hand-made | light | Libre Caslon + Hanken Grotesk | label-like detail lists |
| **Soft wellness** `soft-wellness` | meditation, therapy, patient and family apps | safe, slow, kind | light | Nunito + Nunito Sans | one slow breathing element |
| **Playful game-feel** `playful` | learning, kids, habits, casual consumer | fun, rewarding, tactile | light | Baloo 2 + Nunito | buttons with a lip that press down |
| **Trusted ledger** `trusted-ledger` | banking, accounting, invoicing, insurance | safe, exact, modern | light | IBM Plex Sans + Mono | numbers set like a ledger |
| **Neo-bank bold** `neo-bank` | consumer fintech, cards, bold consumer apps | confident, current | dark | Space Grotesk + Manrope | giant numerals, one vivid colour |
| **Public clarity** `public-clarity` | government, health portals, utilities, forms for everyone | dependable, fair | light | Public Sans, 18px | unmissable focus, one question per page |
| **Open-air marketplace** `marketplace` | travel, rentals, food delivery, booking | inviting, easy | light | Figtree | search as hero, photo cards |
| **Stage dark** `stage-dark` | music, video, gaming, events | immersive | dark | Barlow Condensed + Outfit | colour comes from the content |
| **Athletic monument** `athletic` | sportswear, drops, campaigns | powerful, urgent | light | Anton + Inter | monumental uppercase type over imagery |
| **Graph-paper technical** `graph-paper` | APIs, infrastructure, security, data and AI platforms | rigorous, engineered | dark | Geist + JetBrains Mono | a visible measuring grid |
| **Bright workshop** `bright-workshop` | creative tools, agencies, launch pages | energetic, witty | light | Bricolage Grotesque + DM Sans | bold colour blocking |

To see them all, open `assets/directions/gallery.html` in a browser.

## How to apply one

1. Read the header comment of `assets/directions/<file>.css`. It holds the full recipe: who it is for, type, shape, imagery, voice, the signature and what to watch out for.
2. Load `assets/tokens.css`, then the direction file, then the fonts link from that header:
   ```html
   <link rel="stylesheet" href="tokens.css">
   <link rel="stylesheet" href="directions/trusted-ledger.css">
   <html data-theme="dark">  <!-- only for directions whose default is dark -->
   ```
   No build step? Paste both files into the page's `<style>`.
3. Build with the tokens only: `var(--surface)`, `var(--radius)`, `var(--shadow-raised)`, `var(--font-display)`, `var(--dur-base)`. Never hard-code a colour, radius or shadow next to them.
4. Build the **signature** first. It is the one thing a user could name afterwards. Everything else stays quieter than it.
5. Follow the direction's imagery and voice lines as strictly as its colours. A luxury palette with shouty copy is not luxury.

In a framework: copy the token values into the theme (Tailwind `@theme`, a CSS-in-JS theme object, SwiftUI `Color`/`Font` extensions, Compose `ColorScheme`, Flutter `ThemeData`). Keep the token names.

## The product already has a brand colour

Keep the direction, swap the colour. Each direction header gives the command, for example:

```bash
node scripts/palette.mjs --accent "#0F766E" --neutral cool --tint 1 --out theme.css
```

The script rebuilds every colour (light and dark) around the brand colour and solves text, border and status colours to pass contrast. Load `theme.css` after the direction file. If the brand colour is light (yellow, lime), buttons get dark text automatically. If it is close to error red, the error colour moves away from it.

A brand with its own fonts, logo and guidelines outranks any direction here: use the brand, and borrow only the direction's shape, depth and density if they fit.

## Rules for adapting

- **One direction per product.** Do not mix the type of one with the shape of another. If none fits, write your own (below).
- **Marketing and product may differ in volume, not in family.** The landing page can be louder (bigger type, more colour); the app inside uses the same colours and fonts at a calmer setting. Loud directions (Bright workshop, Athletic monument) switch to Calm productivity chrome inside the working tool.
- **Trust-critical products stay close to convention.** Money, health and government screens may be distinctive in hue and detail, never in structure or seriousness.
- **Native apps keep the platform's bones.** On iOS, Android, macOS and Windows use system components and the system font for chrome; apply the direction through colour, shape where the platform allows it, icons, imagery, voice and the signature. See `platforms.md`.
- **Dark-default directions still ship a light theme**, and the reverse. Follow the user's OS setting unless the product has a reason not to.

## Offering options to a client

Pick two or three directions that differ on a real axis (light and warm vs dark and precise; quiet vs bold), build the same screen in each with the same content, and show them on the options board (`mockups.md`). Name each with who it suits. After the choice, carry that one direction through every screen.

## Writing your own direction

If no row fits, write these ten lines before any code, then generate the colours with `palette.mjs`:

```
Audience and state of mind:
Feeling (2-3 words):
Neutrals: cool / warm / pure, how tinted (0-3)
Accent: hue and how saturated; how much of the screen (usually under 10%)
Theme: light or dark by default, and why
Type: display + text face (free licence), sizes, tracking
Shape and depth: radius family; hairline, soft, crisp, diffuse, none or lip
Density and motion: compact / standard / spacious; instant / crisp / gentle / slow / bouncy
Imagery and voice: what pictures, what tone
Signature: the one thing people will remember
```

Check it against its own default: if the lines could describe any product, they are not a direction yet.

## Common mistakes

- Picking by taste or trend, so a bank looks like a game and a kids' app looks like a law firm.
- Using the direction's colours but ignoring its type, imagery and voice.
- No signature: every part is equally quiet, so nothing is remembered.
- Three signatures: gradient, glow and animation all compete, so it looks cheap.
- Applying a dark, dense tool look to an audience that is anxious or new.
- Treating the direction as a skin on a generic layout. Layout, density and content change with it.
