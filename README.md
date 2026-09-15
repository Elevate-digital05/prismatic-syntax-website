# Prismatic Syntax

Static site. No framework, no dependencies. Two entry pages share one stylesheet
(`home.css`), the hero motion (`home.js`) and the hero's live WebGL glass form
(`prism.js`):

- `index.html` is the international homepage. English only, one long page, no
  rand prices, no currency or language switch. Contact offers a call first, then
  email, then WhatsApp.
- `south-africa.html` (`/south-africa`) is the site for South African trades and
  service businesses, and was the homepage until September 2026. Via
  `showPage()` it is also the services / packages / blog / contact views, with
  the ZAR prices.

Alongside them are the generated service pages, three blog posts and three legal
pages. The service pages and blog posts still speak to South African trades, so
they link back to `/south-africa`, not the homepage. Deployed on Vercel, which
serves the extensionless URLs (`cleanUrls`).

## Service pages are generated

`lib/services.js` is the single source of truth for every service line. From it,
`build.mjs` writes `services/*.html` and injects the derived bits between
`<!--BUILD:…-->` markers: into `south-africa.html` (the service grid, the nav
dropdown, the mobile menu group and the footer links), into `index.html` (the
homepage's services list, deliberately without links or prices) and into
`sitemap.xml`. Everything outside those markers is hand-written and safe to
edit.

`lib/packages.js` does the same for the four website packages: `build.mjs` bakes
each feature list into the package cards, so a crawler reads them in the HTML
rather than after a script runs. They were hand-written in two places once and drifted far
enough to sell an account manager who did not exist.

The homepage's prices are separate and in USD: `lib/pricing-usd.js`. They are set
by hand, never converted from the rand sheet, because at the exchange rate the
ZAR prices read as offshore template work to a UK or US buyer. While any figure
is `TBD`, `build.mjs` renders "Every project is quoted after a short call."
instead of a price sheet and says so in its output.

```
node build.mjs
```

Run it after any edit to `lib/services.js`, and **commit the generated files** —
Vercel serves them as-is and does not run this. The run prints every unset
`PRICE_TBC` so a placeholder cannot be published by accident.

To add or change a service, edit `lib/services.js` and re-run. Nothing else
needs touching: the page, the homepage card, the nav entry, the footer link, the
sitemap entry and the printable menu all come from that one object.

## The printable menu

`/menu` is generated from the same data. It is deliberately **not in the nav**
and carries `noindex` — it is a link you send directly and a PDF you attach to
email, not a landing page.

Printing: open `/menu`, hit **Save as PDF** (or Cmd-P), and choose "Save as
PDF". It is set up for A4 portrait with one service per page; the toolbar and
the contents list do not print. The current 8 services come to 9 pages at about
500KB, with Inter Tight and Manrope embedded and the logo as vector — no raster anywhere, so it
stays sharp at any zoom and small enough to attach.

`check-build.mjs` fails if the menu ever grows a raster image, loses the A4 page
rule, drops a service's contact block, or gets linked from the nav.

## Running it locally

```
node dev-server.mjs
```

Serves the repo on http://localhost:4321, resolving URLs the way Vercel does —
it reads `cleanUrls`, `trailingSlash` and the redirects straight out of
`vercel.json` rather than restating them. It also sends the site-wide headers
from `vercel.json`, so the security headers can be tested before a push, and it
only listens on this machine and refuses hidden files like `.git` and
`.env.local`, because it serves straight out of the repo.

Use this rather than `python -m http.server`, which has no concept of clean
URLs: under it every extensionless link on the site (`/services/web-design`,
`/blog/whatsapp-marketing-website`, `/menu`) 404s locally while working fine in
production, so links can only be checked by reading their href instead of
clicking them.

## Domains

`www.prismaticsyntax.com` is the canonical host everywhere: canonical tags,
`og:url` and the sitemap. `vercel.json` carries host rules so nothing needs a
code change on launch day:

- Every `*.vercel.app` host gets `X-Robots-Tag: noindex, nofollow`, so the
  preview URL stays out of Google while the real domain is not live. It never
  applies to prismaticsyntax.com, so there is no tag to remember to remove.
- `prismaticsyntax.com` (apex) 301s to `www`.
- `elevatedigitals.co.za` 301s to `www`: `/services/*`, `/blog/*`, the legal
  pages and `/menu` keep their path, everything else goes to `/south-africa`. This
  only takes effect once that domain is added to this Vercel project.

`dev-server.mjs` matches redirects by exact path, so it ignores these host rules.

## Security headers

`vercel.json` sends a Content-Security-Policy on every page: scripts and styles
only from this site (inline allowed, because the pages use inline handlers),
fonts from Google Fonts, form posts only to Formspree, and no framing by other
sites. **Adding a third-party script, embed, font, image host or form endpoint
means adding it to that policy first**, or browsers silently block it; a booking
calendar embed is the next thing that will need it. `.vercelignore` keeps build
scripts, `lib/`, `tools/` and `.claude/` out of the deployment, because Vercel
serves every file it uploads. Both contact forms carry Formspree's `_gotcha`
honeypot, so bots that fill every field are dropped.

## Checks

Run these before pushing. They exist because each one has already caught a live bug.

```
node check-prices.mjs      # the rand package and retainer cards match lib/pricing.js
node check-menu-scroll.mjs # tapping a mobile menu link lands at the top of the new page
node check-packages.mjs    # package cards render the features in lib/packages.js
node check-build.mjs       # generated pages are current, and keep the promises we can keep
```

`check-build.mjs` also resolves every internal link against the real filesystem
using `vercel.json`'s rules, so a link that goes nowhere fails here rather than
in front of a visitor.

`check-build.mjs` is the one that guards the copy: every service page must carry
the POPIA legal links, the free-concept offer, a WhatsApp CTA and the real
support hours, must not invent social proof, and must not price anything at a
figure that is not published elsewhere on the site.

It also holds the homepage to the international brief. Outside the one FAQ that
says where the studio is based and the link to `/south-africa` at the top, the
homepage may not mention South Africa, Cape Town, Johannesburg or Paystack, show
a rand figure, carry the geo or keywords tags, or name SAST without `(UTC+2)`.
Contact must offer a call, then email, then WhatsApp; `/south-africa` must keep
its geo tags, `en_ZA` locale and its own canonical; and the vercel.app host must
stay noindexed.

Both entry pages are also held to the September 2026 decluttering: the hero is the
only thing that moves, only its headline carries the blue highlight, the homepage
FAQ stays at six questions or fewer, and each FAQ's structured data lists exactly
the questions on the page.

The two entry pages also carry matching hreflang tags (`en` and `x-default` for
the homepage, `en-ZA` for `/south-africa`), and the service pages and blog posts,
which are written for South African trades, never link to the homepage. The way
across is a link at the top of each entry page, in the nav, so nobody meets a
price in the wrong currency first: "South Africa →" on the homepage and
"International →" on `/south-africa`.

## Payments

The site takes no payments. Clients are invoiced directly and pay by EFT: a 50%
deposit once they approve the concept, the balance before launch, and retainers
monthly. `tools/invoice.html` is the invoice. Paystack was removed in September
2026, and `check-build.mjs` fails if a checkout or payment API comes back.

## Brand

`theme.css` holds every colour, and the corner and glass tokens, as custom properties; `home.css`, `site.css` (service pages) and `article.css` (blog and legal pages) build on it. Nothing else in the repo
should carry a literal colour value. `/brand` holds the logo files, favicons and
og-image; `brand/README.md` is the source of truth for usage.

## Tools

`tools/invoice.html` — fillable, printable invoice. Not deployed (see
`.vercelignore`); open it locally at http://localhost:4321/tools/invoice.
