# Prismatic Syntax — brand assets

## Palette

Every value lives in `/theme.css`. Nothing else in the repo should carry a literal colour.

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#05090D` | Nav, dark sections, footer |
| `--paper` | `#FDFDFD` | Light page background |
| `--mist` | `#F4F6F8` | Alternate light band |
| `--line` | `#E4E7EC` | Hairlines on light |
| `--text` | `#111317` | Headings and body on light |
| `--grey` | `#5A5F69` | Secondary text on light |
| `--blue` | `#0046FF` | Accent — buttons, links, active states |
| `--blue-light` | `#6F9BFF` | Accent as small text on ink |

**The one hard rule:** blue carries white text, never ink. And as small text on ink, use `--blue-light`: `#0046FF` on `#05090D` is too dark to read at body size. Large display type in `--blue` on ink is fine.

Use the accent sparingly — the primary button, the highlighted words in a heading, active states. It stops working the moment it is everywhere.

## The mark

Four triangles split along a shallow diagonal: two in blue, two in ink (or white on dark). It reads as a prism up close and as a sharp, single shape at favicon size. Flat colour only — no gradient, no shadow, no transparency — so it holds at 16px and prints in two colours.

## Files

**Lockups** (mark + stacked wordmark, "PRISMATIC" over "SYNTAX")
- `logo.svg` — on light backgrounds. The default.
- `logo-on-dark.svg` — on ink and photography
- `logo-800.png` — raster for email signatures

**Mark alone**
- `mark.svg`, `mark-on-dark.svg`

**Icons and social**
- `favicon.svg` + `favicon-180.png` — browser tab and Apple touch icon. The SVG swaps the ink triangles to white in dark mode.
- `app-icon.svg` / `app-icon-512.png` — rounded corners, for app-style contexts
- `profile-square.svg` / `profile-square-1000.png` — WhatsApp Business, Instagram, Facebook, LinkedIn. Square corners; every platform crops to a circle itself and the mark sits well inside the safe area.
- `og-image.svg` / `og-image-1200x630.png` — link preview for the homepage. **Use the PNG.** The SVG's headline is live text in Inter Tight; it falls back to another font on machines without it.
- `og-image-south-africa.svg` / `og-image-south-africa-1200x630.png` — link preview for `/south-africa`, the service pages and the blog, with the South African headline and rand pricing.

**Email**
- `email-signature.html` — paste as HTML. It loads `logo-800.png` from prismaticsyntax.com, so the domain has to be live first; Gmail blocks images hosted on random services.

## Typeface

Inter Tight for display: headlines in sentence case at weight 700 with tight tracking, like iOS large titles; small section labels in uppercase at 500–600 with open tracking; buttons and controls in sentence case at 600. Manrope for body copy at 400–500. Both free on Google Fonts.

## Shape and material

Since September 2026 the site follows iOS 27's Liquid Glass, matched against a screen recording of the system. The tokens live in `theme.css`, and all three stylesheets use them: `home.css` for the entry pages, `site.css` for the service pages and `article.css` for the blog and legal pages.

- **Glass is clear, with a bright rim.** Floating things (the nav bar, mobile menu, WhatsApp button) and the cards on dark bands are blurred glass with a 1px rim that is brightest at the corners, not a flat tint or a drop shadow.
- **Glass follows what is behind it.** The nav is dark glass over dark sections and frosted white over light ones (`home.js` switches it). Dark bands carry a soft blue light for the glass to pick up.
- **Switched on means bright.** The current nav item is a white pill with dark text, like an iOS toggle that is on.
- **Corners nest and curve.** Cards and panels use `--r-lg`, things inside them `--r-md` or `--r-sm`; buttons, tags and nav controls are capsules; icon buttons are circles. Browsers that support `corner-shape` draw Apple's continuous curves.
- **Everything speaks in sentence case.** Headlines, buttons, nav, tags, form labels and card titles; only small section labels keep capitals, like widget labels.
- **One tint.** Blue fills the primary action and the Recommended card; secondary buttons are grey capsules.
- **The prism.** The glass form in both entry pages' hero is rendered live in WebGL by `prism.js`, not an image: a core and four droplets that each move on their own and melt together, made of the same liquid glass as the interface. It is lit only in `--ink`, `--blue` and `--blue-light`; the rainbow at its edges is the glass splitting white light, which is the one place the site shows a spectrum. It appears twice on an entry page and nowhere else: large behind the hero headline, then smaller in the gap beside the steps in the dark band further down, which phones drop entirely. They sit far enough apart that a reader never sees both at once, which is what keeps a second one affordable; below about 200px across it stops reading as glass, so it is never used as a small decoration. With reduced motion it moves at half pace and stops following the pointer rather than freezing, because Windows reports reduced motion whenever "Animation effects" is off.
- **Always a solid fallback** for reduced transparency, increased contrast and browsers without `backdrop-filter`.

## Clear space

Leave at least the width of one triangle as clear space on all sides of the lockup. Don't stretch it, don't add a shadow, and don't recolour the triangles to anything outside the palette.
