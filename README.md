# Prismatic Syntax

Static site. No framework, no dependencies. Two entry pages share one stylesheet
(`home.css`) and the hero motion (`home.js`):

- `index.html` is the international homepage. English only, one long page, no
  rand prices, no Paystack, no currency or language switch. Contact offers a
  call first, then email, then WhatsApp.
- `south-africa.html` (`/south-africa`) is the site for South African trades and
  service businesses, and was the homepage until September 2026. Via
  `showPage()` it is also the services / packages / pay / blog / contact views,
  with the ZAR prices and the Paystack deposit calculator.

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
each feature list into the package cards *and* the payment calculator, so both
surfaces come from one source and a crawler reads them in the HTML rather than
after a script runs. They were hand-written in two places once and drifted far
enough to sell an account manager who did not exist.

The homepage's prices are separate and in USD: `lib/pricing-usd.js`. They are set
by hand, never converted from the rand sheet, because at the exchange rate the
ZAR prices read as offshore template work to a UK or US buyer. While any figure
is `TBD`, `build.mjs` renders "Every project is quoted after a short call."
instead of a price sheet and says so in its output. Before filling them in,
confirm how an overseas client pays the deposit: the Paystack flow charges ZAR.

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
`vercel.json` rather than restating them.

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
  pages and `/menu` keep their path, everything else goes to the homepage. This
  only takes effect once that domain is added to this Vercel project.

`dev-server.mjs` matches redirects by exact path, so it ignores these host rules.

## Checks

Run these before pushing. They exist because each one has already caught a live bug.

```
node check-prices.mjs      # south-africa.html prices match what the server will accept
node check-menu-scroll.mjs # tapping a mobile menu link lands at the top of the new page
node check-packages.mjs    # package cards and the pay calculator render the same features
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
says where the studio is based and the footer link to `/south-africa`, the
homepage may not mention South Africa, Cape Town, Johannesburg or Paystack, show
a rand figure, carry the geo or keywords tags, or name SAST without `(UTC+2)`.
Contact must offer a call, then email, then WhatsApp; `/south-africa` must keep
its geo tags, `en_ZA` locale and its own canonical; and the vercel.app host must
stay noindexed.

Both entry pages are also held to the September 2026 decluttering: the hero is the
only thing that moves, only its headline carries the blue highlight, the homepage
FAQ stays at six questions or fewer, and each FAQ's structured data lists exactly
the questions on the page.

## Payments

Paystack. Card entry happens in Paystack's own popup; no card data touches this site.

- `api/verify-payment.js` — confirms a deposit server-side before we act on it
- `api/start-retainer.js` — turns a monthly retainer into a Paystack subscription,
  charged against the card authorisation left behind by the deposit
- `lib/pricing.js` — prices, valid deposit amounts, retainer plan lookup

The deposit is 50% of the package **only**. Retainers are subscriptions and must
never be folded into it.

### Environment variables (Vercel → Settings → Environment Variables)

```
PAYSTACK_SECRET_KEY           sk_live_...
PAYSTACK_PLAN_STARTER_CARE    PLN_...
PAYSTACK_PLAN_BUSINESS_CARE   PLN_...
PAYSTACK_PLAN_PRO_CARE        PLN_...
```

Premium Care has no plan on purpose: it is priced "from R3,500" and settled in
consultation, so a fixed monthly plan would bill the wrong amount. The pay page
shows it as a note, not a toggle. Set those subscriptions up by hand.

The four plan codes come from a one-time script. Put the secret key in
`.env.local` (gitignored) so it stays out of your shell history:

```
echo 'PAYSTACK_SECRET_KEY=sk_live_...' > .env.local
node setup-paystack-plans.mjs --list   # what already exists
node setup-paystack-plans.mjs          # create the four plans
```

It creates three monthly ZAR plans and prints the env lines. Running it twice
creates duplicates — Paystack does not dedupe by name, so check `--list` first.

Until those four variables are set, `start-retainer` returns "Retainer plans are
not configured" and the deposit still works: the client is told the retainer was
not started and to message on WhatsApp.

## Brand

`theme.css` holds every colour as a custom property. Nothing else in the repo
should carry a literal colour value. `/brand` holds the logo files, favicons and
og-image; `brand/README.md` is the source of truth for usage.

## Tools

`tools/invoice.html` — fillable, printable invoice. Not linked from the site.
