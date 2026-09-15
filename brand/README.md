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

Inter Tight for display — headings set in uppercase at weight 800 with slightly tight tracking, labels and buttons at 500–600 with open tracking. Manrope for body copy at 400–500. Both free on Google Fonts.

## Clear space

Leave at least the width of one triangle as clear space on all sides of the lockup. Don't stretch it, don't add a shadow, and don't recolour the triangles to anything outside the palette.
