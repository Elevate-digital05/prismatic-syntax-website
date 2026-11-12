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
| `--f-display` | "Inter Tight", "Inter Tight Fallback", Helvetica Neue, Arial, sans-serif |
| `--f-body` | "Manrope", "Manrope Fallback", Helvetica Neue, Arial, sans-serif |

Both are variable fonts served from `/assets/fonts/`, never from Google. The entry pages preload the two Latin files. The `… Fallback` faces are Arial with `size-adjust` and ascent/descent overrides measured against the real fonts, so text barely moves when the web fonts swap in.

### Type roles

Every size on the site comes from one of these tokens in `theme.css`. A new element picks the role it plays, not a pixel value.

| Token | Value | Role | Used by |
|---|---|---|---|
| `--fs-display` | `clamp(34px, 2.95vw + 26.5px, 76px)` | Hero and closing headlines | `.hero h1` on every template, `.cta-inner h2` |
| `--fs-heading` | `clamp(32px, 3.6vw, 56px)` | Section headlines | `.sec-h`, `.faq-main-header`, service `.sec > h2`, `.close-cta h2` |
| `--fs-figure` | `clamp(30px, 2.6vw, 42px)` | Prices | `.p-amount`, `.tier-price` |
| `--fs-lead` | `clamp(16px, 1.2vw, 18.5px)` | The paragraph under a headline | `.hero-sub`, `.sec-sub`, `.cta-inner p`, service `.lede` |
| `--fs-title` | 17px, weight 600, leading 1.3 | Card and step titles | `.svc-name`, `.step-nm`, `.team-name`, `.m-name`, `.blog-title`, `.incl h3` |
| `--fs-body` | 16px | Reading text, inputs | article paragraphs, form fields, FAQ questions |
| `--fs-body-sm` | 15px | Answers, bios, supporting paragraphs | `.faq-a-accordion`, `.founder-bio`, service `.faq p` |
| `--fs-ui` | 15px | Buttons | `.btn-primary` and family, `.btn-p` |
| `--fs-small` | 14px | Card copy, nav, links, notes | `.svc-desc`, `.p-feats li`, `.nav-links a`, footer links |
| `--fs-meta` | 13px | Roles, periods, dates, fine print | `.team-role`, `.p-period`, `.foot-bottom` |
| `--fs-label` | 12.5px | Uppercase labels, at 500–600 with +.08em | `.sec-lbl`, `.eyebrow`, `.info-lbl`, `.foot-h`, tags |

Display is one fluid curve. The old hero jumped from 56px to 40px as the viewport crossed 761px. At 390px it is 38px, at 1280px 64px, and from 1680px it holds at 76px. Section headlines are now the same size on the entry pages and the service pages.

Left as literal values on purpose: the article template's own headings (`article.css` h1 and h2, a Read surface), the mobile menu links, the splash, the "+" glyphs on FAQ toggles, the path and retainer price displays, and the 11px "New" badge.

### Wrapping and measure

- Headings use `text-wrap: balance`; paragraphs and list items use `text-wrap: pretty` (both in `theme.css`, inside `:where()` so any rule can override them).
- Running text stops at about 70 characters: `article > :is(p, ul, ol)` and `.faq-a-accordion` cap at `60ch`. Manrope's zero is wide, so 60ch is about 70 real characters.

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

Outcomes on the homepage form (`#contact-status`, always in the page so screen readers hear it):
- **Sending:** the button reads "Sending…" and is disabled.
- **Sent:** white text, the button reads "Request sent" and stays disabled until the form changes, so one request cannot go twice.
- **Failed:** a box tinted with `--alert` (errors on ink only), announced assertively. It keeps the typed text and offers email and WhatsApp links that carry the message.

The pricing cards' links carry `data-package`, which preselects the form's optional Package field.

### FAQ

Native `<details>`/`<summary>` on both entry pages, questions visible by default, no height cap. Chrome animates the opening through `::details-content`; other browsers open instantly. `check-build.mjs` keeps them uncollapsed.

### Consent notice

Appears on the first scroll of a visit, never on load, so it cannot cover the hero. Bottom-right on wide screens above the floating button, full-width at the foot of a phone. "Allow" and "No thanks" share one neutral style.

### Hero

Text column with the live glass beside it on desktop. Up to 1080px the glass stacks above the text. On phones (760px and under) the order flips to headline, offer and **Book a call** first, then the glass, so the primary action is in the first screen. The glass is `aria-hidden`, so reading and focus order never change.

### Calls to action

One label everywhere for the primary action: **Get your free concept** (hero, nav, mobile menu, phone pill). The form's own action is **Request a call**, the first step towards the concept. On phones a floating pill repeats the call to action once the hero's button has scrolled away, and hides at the contact form, under an open menu and under the consent notice.

### Nav

A floating glass pill. It is dark over dark sections and frosted white (`.on-light`) over light ones; `home.js` decides by hit-testing what sits under it, and waits out page transitions. The current item is a bright pill with dark text.

### Cards

`--surface` on light bands with `--lift`, or clear glass on a `.glass-stage`, showing a still of the prism through the rim. `--r-lg` corners.

## Gaps to close

In order of value:

1. **Spacing is off-grid.** Pick a 4px base and add spacing tokens when the layout is next reworked.
2. **Near-duplicate durations** (.3, .4, .45 and .5s). Two or three duration tokens would cover them.

Closed in November 2026: text below 12px on labels, the missing disabled state on the submit button, small `--blue` text on ink, the service-page footer line breaking into a grid, footer text under the floating buttons on phones (polish), and the untokenized type scale, the hero size jump at 761px, the over-long FAQ and article lines, and font-swap reflow (typeset).
