# Prismatic Syntax design system

The tokens and component rules behind prismaticsyntax.com, written down from the CSS as it stands (November 2026). **`theme.css` is the source of truth.** This file explains it, records the scales the stylesheets actually use, and lists the gaps worth closing. Voice and messaging are in `docs/brand-guidelines.md`; logo and material rules are in `brand/README.md`.

## How the tokens are layered

The site has no build step for CSS, so the three usual token layers live as custom properties in `theme.css`, and the three page stylesheets consume them:

| Layer | Where | Examples |
|---|---|---|
| Primitive | Hex values, only inside `theme.css` `:root` | `#05090d`, `#0046ff` |
| Semantic | Role names over the primitives | `--ink`, `--paper`, `--text`, `--grey`, `--blue` |
| Component | Recipes built from semantic tokens | `--glass-fill`, `--glass-rim`, `--lift`, `--ink-glow`, the buttons' `--fill` |

`home.css` (entry pages), `site.css` (service pages) and `article.css` (blog and legal pages) may only use `var(--…)` for colour. A scan in November 2026 found two literal colours outside `theme.css`, both legitimate: a hex quoted as text in a blog post, and print-only white on `/menu`.

## Colour

| Token | Value | Role |
|---|---|---|
| `--ink` | `#05090d` | Nav, dark bands, footer, the colour past either end of the page |
| `--ink-2` | `#0a0f16` | Raised surfaces on ink |
| `--paper` | `#fdfdfd` | Light page background |
| `--mist` | `#f4f6f8` | Alternate light band |
| `--surface` | `#ffffff` | Cards on paper or mist |
| `--line` | `#e4e7ec` | Hairlines on light |
| `--line-dark` | white at 10% | Hairlines on ink |
| `--text` | `#111317` | Headings and body on light |
| `--grey` | `#5a5f69` | Secondary text on light |
| `--grey-dark` | white at 72% | Secondary text on ink |
| `--blue` | `#0046ff` | The one accent: primary action, hero highlight, active states |
| `--blue-dark` | `#0038cc` | Accent hover |
| `--blue-light` | `#6f9bff` | Accent as small text on ink |
| `--whatsapp` | `#25D366` | The floating chat button only |

**Rules.** Blue carries white text, never ink. On ink, small blue text uses `--blue-light`; large display type in `--blue` on ink is fine. Blue stays scarce.

## Typography

| Token | Value |
|---|---|
| `--f-display` | "Inter Tight", Helvetica Neue, Arial, sans-serif |
| `--f-body` | "Manrope", Helvetica Neue, Arial, sans-serif |

Both are variable fonts served from `/assets/fonts/`, never from Google.

### Type roles in use

| Role | Selector | Font | Size / line height | Notes |
|---|---|---|---|---|
| Hero headline | `.hero h1` | Display 700 | `clamp(40px, 4.8vw, 76px)` / 1.02; `clamp(32px, 10vw, 56px)` under 760px | Tracking -.035em |
| Section headline | `.sec-h` | Display 700 | `clamp(32px, 3.6vw, 56px)` / 1.05 | Tracking -.03em |
| Hero lead | `.hero-sub` | Body | `clamp(16px, 1.2vw, 18.5px)` / 1.55 | |
| Section lead | `.sec-sub` | Body | `clamp(15.5px, 1.15vw, 17.5px)` / 1.65 | |
| Mobile menu link | `.mobile-menu > a` | Display 700 | `clamp(30px, 8.4vw, 44px)` / 1.2 | |
| Button | `.btn-primary` and family | Display 600 | 15px / 1 | `.btn-nav` 14px |
| Nav link | `.nav-links a` | Display 600 | 14.5px / 1 | |
| Section label | `.sec-lbl`, `.eyebrow` | Display 500 | 12.5px / 1 | Uppercase, +.08em, the only capitals on the site |
| Form input | `.form-group input` | Body 400 | 16px | 16px stops iOS zooming on focus |

Service and article pages set their own headline clamps in `site.css` and `article.css`.

### What the stylesheets actually use

Sizes are literal values, not tokens. Across the three stylesheets there are about 20 distinct pixel sizes (most used: 14px ×29, 13px ×20, 15px ×16, 16px ×9, 12.5px ×9, 13.5px ×6) and a dozen different `clamp()`s.

The small uppercase labels (`.sec-lbl`, `.eyebrow`, `.info-lbl`, `.foot-h`, `.m-tier-label`, `.tier-name`) all sit at 12.5px. The smallest text on the site is the 11px "New" badge (`.p-feat-new`).

### Proposed scale (not yet applied)

For a later typography pass, the small sizes collapse onto five steps and the headlines onto three:

| Proposed token | Value | Replaces |
|---|---|---|
| `--fs-label` | 12.5px | 11, 12, 12.5px |
| `--fs-sm` | 13.5px | 13, 13.5px |
| `--fs-ui` | 14.5px | 14, 14.5px |
| `--fs-md` | 16px | 15, 16, 16.5px |
| `--fs-lead` | `clamp(16px, 1.2vw, 18.5px)` | the lead clamps |
| `--fs-h2` | `clamp(32px, 3.6vw, 56px)` | section and service headline clamps |
| `--fs-h1` | `clamp(40px, 4.8vw, 76px)` | hero and service page h1 clamps |

Applying it shifts many sizes by half a pixel to a pixel, so it belongs in a reviewed pass (`/impeccable typeset`), not a silent refactor.

## Spacing and layout

| Token | Value | Role |
|---|---|---|
| `--pad` | `clamp(20px, 4.9vw, 96px)` | Page gutter on the entry pages |
| `--nav-h` | 84px | Nav height including its top inset; also the anchor offset |

- Content column: `.sec` caps at 1400px with `clamp(64px, 7vw, 112px)` vertical padding.
- Service pages use `.wrap`: 1180px with `clamp(20px, 4vw, 48px)` gutters.
- Other spacing is literal. The common values are 16, 18, 12, 10, 22, 24, 8, 28, 6, 4, 48 and 14px. They are even numbers but not one grid (18, 22 and 14 sit between 8px steps). The detector's "cramped padding" warnings (28 of them) cluster in small chips, tags and list rows.

## Radii

| Token | Default | With `corner-shape: squircle` | Use |
|---|---|---|---|
| `--r-lg` | 28px | 46px | Cards and panels |
| `--r-md` | 20px | 34px | Things inside cards |
| `--r-sm` | 14px | 24px | Inputs, small tiles |
| `--r-xs` | 10px | 16px | Menu items, the smallest nested boxes |
| `--r-pill` | 999px | 999px | Buttons, tags, nav controls |

Corners nest: a child takes a smaller radius than its container. Icon buttons are circles (`50%`).

## Material and elevation

| Token | Role |
|---|---|
| `--glass-fill`, `--glass-fill-light` | Dark glass over dark content, frosted white over light |
| `--glass-blur` | `blur(22px) saturate(190%)` |
| `--glass-rim`, `--glass-rim-light`, `--glass-edge`, `--glass-shine` | The bright 1px rim and lit top edge |
| `--glass-card`, `--glass-card-rec`, `--glass-card-edge` | Light-band cards as glass, plus the Recommended tint |
| `--lift` | The only shadow on light cards: barely raised |
| `--ink-glow` | Dark bands with soft blue light for glass to pick up |

Every glass surface has a solid fallback for `prefers-reduced-transparency`, `prefers-contrast: more` and browsers without `backdrop-filter`.

## Motion

| Token | Value | Use |
|---|---|---|
| `--ease` | `cubic-bezier(.16, 1, .3, 1)` | Interface: button fills, menus, the FAQ, hero entrances |
| `--ease-slow` | `cubic-bezier(.5, 0, 0, 1)` | Page transitions and the splash parting |
| `--ease-soft` | `cubic-bezier(.39, .575, .565, 1)` | Text sharpening out of blur |
| `--slant` | 14vh | Half the horizontal offset of the shard-angle cut (about 15.6deg) |
| `--intro` | 0s, or 1s while the splash plays | Delays hero and nav entrances |

Durations: .3s for colour and opacity changes, .45s for button fills, .6–.8s for reveals and transitions, 1.2–1.4s for the hero glass.

**Reduced motion holds movement still but never switches every transition off.** Fades, colour changes, fills and the FAQ still animate; anything that travels stops. Page transitions fall back to a crossfade, and the splash is skipped. `check-build.mjs` fails if a blanket `transition-duration: .01ms` rule comes back.

## Components

### Buttons

| | `.btn-primary` | `.btn-ghost` | `.btn-link` |
|---|---|---|---|
| Size | 54px tall, 26px side padding, pill | 54px, pill, 1px border | Text with a 1px underline |
| Default | `--blue` fill, white text, lit top edge | Transparent, `--text` text and border | Underline at 55% |
| Hover and focus | `--fill` sweeps in from the left over .45s (ink on light, white on dark); text recolours | Fill sweeps in; text turns white | Underline to 100% |
| On dark | Fill becomes `--surface`, text turns blue | Translucent white fill and border | Inherits |
| Disabled | `.btn-submit:disabled` dims to 60% with a progress cursor while the form sends, and the fill stays out | Not used | Not used |

Variants: `.btn-nav` is 44px with 14px text, and `.btn-submit` is 56px and full width.

### Form fields

16px Manrope on translucent white over ink, `--line-dark` border, `--r-sm` corners. Focus turns the border `--blue-light` and adds a 3px halo at 25%.

### Nav

A floating glass pill. It is dark over dark sections and frosted white (`.on-light`) over light ones; `home.js` decides by hit-testing what sits under it, and waits out page transitions. The current item is a bright pill with dark text.

### Cards

`--surface` on light bands with `--lift`, or clear glass on a `.glass-stage`, showing a still of the prism through the rim. `--r-lg` corners.

## Gaps to close

In order of value:

1. **Type is not tokenized.** Adopt the proposed scale in a reviewed typography pass.
2. **Spacing is off-grid.** Pick a 4px base and add spacing tokens when the layout is next reworked.
3. **Near-duplicate durations** (.3, .4, .45 and .5s). Two or three duration tokens would cover them.

Closed in the November 2026 polish pass: text below 12px on labels, the missing disabled state on the submit button, small `--blue` text on ink (the process step numbers now use `--blue-light`), the service-page footer line breaking into a grid, and footer text running under the floating buttons on phones.
