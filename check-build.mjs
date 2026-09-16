/* The service pages, the homepage service grid, the footer links and the
   sitemap are generated from lib/services.js. Committing an edit to the data
   without re-running build.mjs would ship a site that disagrees with its own
   source — so this re-renders everything in memory and diffs it against what is
   on disk. It also holds the promises the brief made non-negotiable: legal
   links on every page, no invented social proof, and no support claim wider
   than the hours actually worked.
   Run: node check-build.mjs */
import { existsSync, readFileSync, statSync } from 'node:fs';
import assert from 'node:assert/strict';
import { build } from './build.mjs';
import { SERVICES, HOURS } from './lib/services.js';

const { out, tbc } = build({ write: false });

/* ── generated output is current ── */
for (const [path, expected] of out) {
  let actual;
  try { actual = readFileSync(path, 'utf8'); }
  catch { assert.fail(`${path} has never been generated — run: node build.mjs`); }
  assert.equal(actual, expected, `${path} is stale — run: node build.mjs`);
}
console.log(`ok build: ${out.size} generated files match lib/services.js`);

/* ── every service page keeps the promises in the brief ── */
for (const svc of SERVICES) {
  const page = out.get(`services/${svc.slug}.html`);
  const at = m => `${svc.slug}: ${m}`;

  // POPIA: the legal links are not optional on any page.
  for (const legal of ['/privacy', '/terms', '/refund-policy']) {
    assert.ok(page.includes(`href="${legal}"`), at(`footer is missing the ${legal} link`));
  }

  // Head tags, mirroring the homepage pattern including the geo tags.
  for (const tag of ['<title>', 'name="description"', 'rel="canonical"', 'property="og:title"',
                     'property="og:description"', 'property="og:image"', 'name="geo.region"',
                     'name="geo.position"', 'name="twitter:card"']) {
    assert.ok(page.includes(tag), at(`head is missing ${tag}`));
  }
  assert.ok(page.includes(`<link rel="canonical" href="https://www.prismaticsyntax.com/services/${svc.slug}">`),
    at('canonical points at the wrong URL'));
  assert.ok(JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]),
    at('structured data is not valid JSON'));

  // The sections the brief asked every page to carry.
  for (const [needle, what] of [["What's included", "what's included"], ["Who it's for", "who it's for"],
                                ['id="pricing"', 'pricing'], ['class="faq"', 'FAQs'],
                                ['homepage concept free', 'the free-concept offer'],
                                ['wa.me/27650858437', 'a WhatsApp CTA']]) {
    assert.ok(page.includes(needle), at(`page is missing ${what}`));
  }
  assert.ok(svc.faqs.length >= 3 && svc.faqs.length <= 5, at(`has ${svc.faqs.length} FAQs, brief asked for 3–5`));

  // Support hours. Nothing may promise cover wider than what is actually worked.
  // Saying "I do not offer 24/7 cover" is the honest version and must pass, so
  // each hit is only a failure when nothing negates it in the run-up.
  for (const m of page.matchAll(/24\/7|around the clock|any time of day|always available/gi)) {
    const runUp = page.slice(Math.max(0, m.index - 50), m.index);
    assert.match(runUp, /\b(not|no|never|don'?t|doesn'?t|without|rather than)\b/i,
      at(`promises "${m[0]}" support, which is wider than ${HOURS}`));
  }
  assert.ok(page.includes(HOURS), at('does not state the real support hours'));

  // No fabricated social proof. Placeholders are fine; invented clients are not.
  assert.doesNotMatch(page, /testimonial|our clients say|trusted by \d|case stud|\d+\+? happy (clients|customers)/i,
    at('contains social proof that was never supplied'));
}
console.log(`ok pages: ${SERVICES.length} service pages carry legal links, meta, the concept offer and honest hours`);

/* ── the hand-written standalone pages, held to the same bar ──
   These are not generated, so nothing else would notice if they fell behind.
   The blog posts did: they carried a text wordmark instead of the logo and had
   no legal links at all, which is a POPIA gap on a page that gets shared. */
for (const page of ['blog/website-cost-south-africa-2026.html', 'blog/whatsapp-marketing-website.html',
                    'blog/mobile-first-web-design-south-africa.html',
                    'privacy.html', 'terms.html', 'refund-policy.html']) {
  const html = readFileSync(page, 'utf8');
  const legal = ['/privacy', '/terms', '/refund-policy'].filter(l => html.includes(`href="${l}"`));
  // A legal page does not link to itself, so it carries the other two.
  const wanted = page.match(/^(privacy|terms|refund-policy)\.html$/) ? 2 : 3;
  assert.equal(legal.length, wanted, `${page}: expected ${wanted} legal links in the footer, found ${legal.length}`);
  assert.doesNotMatch(html, /class="logo">PRISMATIC/,
    `${page}: still uses the text wordmark instead of /brand/logo.svg`);
  // one shared stylesheet; these six pages used to drift apart as inline copies
  assert.ok(html.includes('<link rel="stylesheet" href="/article.css">') && !html.includes('<style>'),
    `${page}: styles itself inline again instead of using /article.css`);
}
console.log('ok standalone pages: blog and legal pages carry the real logo and the legal links');

/* ── the homepage actually links through to them ── */
const index = out.get('south-africa.html');
for (const svc of SERVICES) {
  assert.ok(index.includes(`href="/services/${svc.slug}"`),
    `south-africa.html does not link to /services/${svc.slug}`);
}
assert.ok(index.includes('routeFromHash'),
  'south-africa.html lost the hash router, so every /#services link lands on the hero again');

/* ── English only ── the Afrikaans, isiZulu and isiXhosa dictionaries were
   removed in September 2026. Nothing may bring back half a language switcher. */
assert.doesNotMatch(index, /data-i18n|TRANSLATIONS|setLangAll|lang-selector|mob-pill/,
  'south-africa.html has language switching again; the site is English only');
console.log('ok english only: no translation markup or language switcher on /south-africa');

/* ── the printable menu ──
   It gets emailed as a PDF, so the things that break silently are: a raster
   logo (bloats the file and blurs when zoomed), a missing page rule, screen
   chrome that prints, and a service quietly dropping out of the document. */
const menu = out.get('menu.html');

assert.ok(menu.includes('name="robots" content="noindex, nofollow"'),
  'menu.html is indexable — it is a document to send, not a landing page');
assert.ok(!out.get('sitemap.xml').includes('/menu'), 'menu is in the sitemap but marked noindex');
// A link Kabelo sends directly, not a destination on the site.
assert.doesNotMatch(index, /href="\/menu"|navTo\('menu'\)|showPage\('menu'\)/,
  'south-africa.html links to the menu — it is meant to stay out of the site navigation');

assert.match(menu, /@page\s*{\s*size:\s*A4 portrait/, 'menu.html has no A4 portrait page rule');
assert.ok(menu.includes('.m-svc { break-before:page;'), 'services no longer start on a fresh page');

// Live text and vector only. An <img>, a background-image or a data: URI here
// would mean the logo rasterises into the PDF, which the brief ruled out.
assert.ok(menu.includes('<svg class="logo"'), 'the logo is not inlined vector SVG');
assert.doesNotMatch(menu, /<img|background-image|url\(["']?data:image\/(png|jpe?g|gif|webp)/i,
  'menu.html contains a raster image — it must stay live text and vector');
assert.ok(menu.includes("family=Inter+Tight"), 'menu.html is not loading the Inter Tight webfont');

// Screen-only chrome must not reach paper.
const printCss = menu.slice(menu.indexOf('@media print'));
assert.match(printCss, /\.bar[^{]*{[^}]*display:none/, 'the toolbar prints');
for (const [sel, what] of [['.bar-btn', 'the Save as PDF button'], ['.m-index', 'the on-screen contents list']]) {
  assert.ok(menu.includes(sel), `menu.html lost ${what}`);
}
// south-africa.html owns the currency and language toggles; the menu has neither, so
// there is nothing to hide rather than a rule that hides nothing.
assert.doesNotMatch(menu, /currency-selector|lang-selector|toggleCurrency|setLangAll/,
  'the menu grew a currency or language toggle — it is ZAR and English by design');

// Every service, and a contact block in every section.
for (const svc of SERVICES) {
  assert.ok(menu.includes(`id="${svc.slug}"`), `menu.html is missing ${svc.slug}`);
}
// A contact block inside every service section, so a page that gets separated
// from the rest still says how to reach him. Counting them site-wide would
// break every time the cover or the closing block changed.
for (const chunk of menu.split('<section class="m-svc"').slice(1)) {
  const slug = chunk.match(/id="([^"]+)"/)[1];
  assert.ok(chunk.slice(0, chunk.indexOf('</section>')).includes('class="m-contact"'),
    `menu section ${slug} has no contact block`);
}
for (const detail of ['wa.me/27650858437', 'hello@prismaticsyntax.com', '+27 65 085 8437', 'prismaticsyntax.com']) {
  assert.ok(menu.includes(detail), `menu.html is missing ${detail}`);
}
console.log(`ok menu: ${SERVICES.length} sections, A4 print rules, inline vector logo, no raster`);

/* ── every internal link resolves to a file ──
   Checking that an href holds the right string is not the same as checking it
   goes anywhere. Resolution follows vercel.json's cleanUrls, which is also what
   dev-server.mjs implements, so a link that works locally works deployed. */
const { cleanUrls, redirects } = JSON.parse(readFileSync('vercel.json', 'utf8'));
const exists = p => { try { return statSync(p).isFile(); } catch { return false; } };
const resolves = href => {
  const path = href.split(/[?#]/)[0];
  if (path === '' || path === '/') return true;                 // homepage
  if (redirects.some(r => r.source === path)) return true;
  const rel = path.replace(/^\//, '');
  return exists(rel) || (cleanUrls && exists(rel + '.html')) || exists(rel + '/south-africa.html');
};

const linkSources = [...out].map(([p, b]) => [p, b]).concat(
  ['blog/website-cost-south-africa-2026.html', 'blog/whatsapp-marketing-website.html',
   'blog/mobile-first-web-design-south-africa.html', 'privacy.html', 'terms.html', 'refund-policy.html']
    .map(p => [p, readFileSync(p, 'utf8')]));

let links = 0;
for (const [page, raw] of linkSources) {
  if (!page.endsWith('.html')) continue;
  // Commented-out markup is not a link. south-africa.html parks a founder-photo
  // <img src="/kabelo.jpg"> in a TODO comment against a file that does not
  // exist yet, which is fine precisely because it never renders.
  const html = raw.replace(/<!--[\s\S]*?-->/g, '');
  for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    links++;
    assert.ok(resolves(href), `${page} links to ${href}, which resolves to no file — it will 404`);
  }
}
console.log(`ok links: ${links} internal links across ${linkSources.length} pages all resolve`);

/* ── package and retainer prices match the rand price list ──
   A service page quoting a package at a figure lib/pricing.js does not list
   would quote a client one price there and another on the packages view.
   Standalone service prices are Kabelo's to set and are only sanity-checked. */
const { PACKAGES_ZAR, RETAINERS_ZAR } = await import('./lib/pricing.js');
const listed = { Starter: 8500, Business: 18500, Pro: 34999, Premium: 75000 };
for (const [name, zar] of Object.entries(listed)) {
  assert.ok(PACKAGES_ZAR.includes(zar), `lib/pricing.js no longer lists R${zar} for ${name}`);
}

for (const svc of SERVICES) {
  for (const t of svc.pricing.tiers) {
    if (t.price?.tbc) continue;
    assert.ok(Number.isInteger(t.price) && t.price > 0,
      `${svc.slug}: "${t.name}" has a price that is not a whole number of rands`);

    if (listed[t.name]) {
      assert.equal(t.price, listed[t.name],
        `${svc.slug}: "${t.name}" is priced R${t.price} but the packages view sells it at R${listed[t.name]}`);
    }
    if (t.name.endsWith('Care')) {
      assert.ok(RETAINERS_ZAR.includes(t.price),
        `${svc.slug}: retainer "${t.name}" is R${t.price}, which lib/pricing.js does not list`);
    }
  }
}
console.log(tbc.length
  ? `ok prices: packages and retainers match lib/pricing.js; ${tbc.length} still marked PRICE_TBC`
  : 'ok prices: packages and retainers match lib/pricing.js, no placeholders left');

/* ── the international homepage (/) ──
   The homepage has to read as a studio that works internationally; everything
   written for South African trades lives on /south-africa. These are the
   repositioning brief's acceptance checks, so a string pasted back from the old
   page fails here rather than in front of a client in London. */
const home = out.get('index.html');
const saPage = out.get('south-africa.html');
// The two places the homepage names the country on purpose: the FAQ that says
// plainly where the studio is based, and the link to /south-africa at the top.
const abroadQ = 'Do you work with clients outside South Africa?';
const abroadA = 'Yes. We are based in Cape Town and work with clients across the UK, Europe and North America.';
assert.ok(home.includes(abroadQ) && home.includes(abroadA), 'the homepage lost the "clients outside South Africa" FAQ');
const regionLink = '<a class="nav-region" href="/south-africa">South Africa →</a>';
assert.ok(home.includes(regionLink), 'the homepage lost its "South Africa →" link at the top');
const homeRest = home.replaceAll(abroadQ, '').replaceAll(abroadA, '').replaceAll(regionLink, '');
for (const banned of ['South Africa', 'Cape Town', 'Johannesburg', 'Paystack', 'ZAR', 'en_ZA', 'geo.', 'name="ICBM"', 'name="keywords"',
                      'currency-selector', 'lang-selector', 'lead-generating machine', 'twitter:site']) {
  assert.ok(!homeRest.includes(banned), `the homepage contains "${banned}", which belongs on /south-africa or nowhere`);
}
assert.doesNotMatch(homeRest, /\bR\d{1,3}(,\d{3})+|\bR\d{4,}/, 'the homepage shows a rand figure');
for (const m of home.matchAll(/SAST/g)) {
  assert.equal(home.slice(m.index, m.index + 12), 'SAST (UTC+2)', 'the homepage names SAST without its UTC offset');
}
assert.doesNotMatch(home, /optimiz|specializ|Absolutely!|Yes!/, 'the homepage has American spelling or an exclamation mark the brief cut');
assert.ok(home.includes('<meta property="og:locale" content="en_GB">'), 'the homepage og:locale is not en_GB');

const contactBlock = home.slice(home.indexOf('id="contact"'));
const [book, mail, whatsapp] = ['>Book a call<', 'mailto:hello@prismaticsyntax.com', 'wa.me/'].map(s => contactBlock.indexOf(s));
assert.ok(book >= 0 && book < mail && mail < whatsapp, 'the homepage contact block must offer a call, then email, then WhatsApp');
assert.ok(home.slice(home.indexOf('<nav'), home.indexOf('</nav>')).includes(regionLink),
  'the "South Africa →" link belongs in the nav, where a South African visitor sees it before any dollar price');

for (const tag of ['name="keywords"', 'name="geo.region"', 'name="geo.placename"', 'name="geo.position"', 'name="ICBM"',
                   '<meta property="og:locale" content="en_ZA">', '<link rel="canonical" href="https://www.prismaticsyntax.com/south-africa">']) {
  assert.ok(saPage.includes(tag), `/south-africa is missing ${tag}`);
}
assert.doesNotMatch(saPage, /name="robots" content="noindex/, '/south-africa must stay indexable; it is the local SEO asset');
assert.ok(out.get('sitemap.xml').includes('<loc>https://www.prismaticsyntax.com/south-africa</loc>'), 'sitemap.xml does not list /south-africa');

// prismaticsyntax.com does not resolve yet, so every canonical points at a dead
// address. Noindexing the vercel.app host keeps the preview out of Google
// without a tag anyone has to remember to delete on launch day.
const { headers: vercelHeaders = [] } = JSON.parse(readFileSync('vercel.json', 'utf8'));
assert.ok(vercelHeaders.some(h => h.has?.some(c => c.type === 'host') &&
  h.headers.some(x => x.key.toLowerCase() === 'x-robots-tag' && x.value.includes('noindex'))),
  'vercel.json no longer noindexes the vercel.app host');
for (const [page, body] of linkSources) {
  assert.ok(!body.includes('@ElevateDigitals'), `${page} still references @ElevateDigitals`);
}
console.log('ok homepage: international copy only, call/email/WhatsApp order, /south-africa carries the local tags, preview host noindexed');

/* ── homepage USD prices ── set by hand in lib/pricing-usd.js, whole dollars, and
   actually on the page. A missing figure is allowed: the build then shows the
   quote-on-call line instead of a partial sheet. */
const { USD_PACKAGES } = await import('./lib/pricing-usd.js');
const usdSet = Object.entries(USD_PACKAGES).filter(([, v]) => v != null);
for (const [name, price] of usdSet) {
  assert.ok(Number.isInteger(price) && price > 0, `lib/pricing-usd.js: ${name} is not a whole number of dollars`);
  assert.ok(home.includes(`<div class="p-amount">$${String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`),
    `the homepage does not show ${name} at the price in lib/pricing-usd.js`);
}
if (usdSet.length === Object.keys(USD_PACKAGES).length) {
  assert.doesNotMatch(home, /quote-line/, 'every USD price is set but the homepage still shows the quote-on-call line');
}
console.log(usdSet.length ? `ok usd: ${usdSet.length} homepage prices match lib/pricing-usd.js` : 'ok usd: no prices set, homepage shows the quote-on-call line');

/* ── no currency converter, and the FAQ collapses ── the ZAR/USD toggle priced
   the rand sheet at offshore rates for anyone abroad, and the homepage now has
   its own USD sheet. Both FAQs collapse under their heading. */
assert.doesNotMatch(saPage, /currency-selector|setCurrencyAll|data-rate=/, '/south-africa has the ZAR/USD converter again');
for (const [name, page] of [['index.html', home], ['south-africa.html', saPage]]) {
  assert.ok(page.includes('class="faq-toggle" aria-expanded="false" aria-controls="faq-panel"') && page.includes('<div class="faq-panel" id="faq-panel">'),
    `${name}: the FAQ heading no longer collapses the list`);
}
console.log('ok faq and currency: no converter on /south-africa, both FAQs collapse under their heading');

/* ── both entry pages stay calm ── September 2026: the site read as busy. The
   hero is the only thing that moves, only its headline carries the blue
   highlight, and each FAQ's structured data lists exactly the questions shown. */
for (const [name, page] of [['index.html', home], ['south-africa.html', saPage]]) {
  assert.doesNotMatch(page, /reveal-(?:card|section)|class="words"|scroll-progress|class="feat |class="art/,
    `${name}: scroll reveals, cycling words, the progress bar, the six-point section or the art composition came back`);
  assert.equal(page.match(/class="hl"/g).length, 1, `${name}: only the hero headline may carry the blue highlight`);
  const shown = [...page.matchAll(/<div class="faq-q-accordion">(.*?)<\/div>/g)].map(m => m[1]);
  const graph = [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m => { const d = JSON.parse(m[1]); return d['@graph'] || [d]; });
  assert.deepEqual(graph.find(n => n['@type'] === 'FAQPage').mainEntity.map(q => q.name), shown,
    `${name}: the FAQ structured data does not list the questions on the page`);
}
assert.ok(home.match(/class="faq-q-accordion"/g).length <= 6, 'the homepage FAQ is back over six questions');
console.log('ok calm: no scroll reveals or cycling words, one highlight per page, FAQ structured data matches the page');

/* ── each audience stays on its own page ── the two entry pages carry the same
   hreflang set, so Google shows South African searchers /south-africa and
   everyone else the homepage; hreflang is ignored unless both pages list it.
   The service pages and blog posts are written for South African trades, so
   none of their links may drop a reader onto dollar pricing at /. */
const hreflang = ['<link rel="alternate" hreflang="en" href="https://www.prismaticsyntax.com/">',
                  '<link rel="alternate" hreflang="en-ZA" href="https://www.prismaticsyntax.com/south-africa">',
                  '<link rel="alternate" hreflang="x-default" href="https://www.prismaticsyntax.com/">'];
for (const [name, page] of [['index.html', home], ['south-africa.html', saPage]]) {
  for (const tag of hreflang) assert.ok(page.includes(tag), `${name} is missing ${tag}`);
}
for (const [page, body] of linkSources.filter(([p]) => /^(services|blog)\//.test(p))) {
  assert.doesNotMatch(body.replace(/<!--[\s\S]*?-->/g, ''), /href="\/(?:#[^"]*)?"/,
    `${page} links to the international homepage; pages for South African trades lead back to /south-africa`);
}
// The way across sits at the top of each entry page, in the nav, so a visitor
// sees it before any price in the wrong currency.
assert.ok(saPage.slice(saPage.indexOf('<nav'), saPage.indexOf('</nav>')).includes('<a class="nav-region" href="/">International →</a>'),
  '/south-africa lost its "International →" link at the top');
console.log('ok audiences: matching hreflang, a link across at the top of both entry pages, service pages and blog posts never link to /');

/* ── the glass ── both entry pages carry three of the live WebGL form (prism.js): the
   hero, the dark band much further down, and the contact one. Each is a ray tracer, so
   this is only affordable because no two can share a screen and prism.js builds and
   draws one only while it is in view. On index.html the gaps are measured: hero to band
   1567px, band to contact 2454px, against a reach of about a screen height plus the
   400px of rootMargin. On south-africa.html the third sits in the contact view, which
   is only displayed when the home view is not. Adding a fourth in the footer or the CTA
   banner would break it: those sit 629px and 734px from their neighbours.
   The portrait the hero replaced is gone. */
for (const [name, page] of [['index.html', home], ['south-africa.html', saPage]]) {
  assert.equal(page.match(/class="prism-canvas"/g)?.length, 3, `${name}: three prism canvases, the hero, the band and contact`);
  assert.match(page, /<div class="contact-prism" aria-hidden="true"><canvas class="prism-canvas"><\/canvas><\/div>/, `${name}: the contact canvas moved`);
  assert.match(page, /<div class="hero-media" aria-hidden="true">\s*<canvas class="prism-canvas">/, `${name}: the hero canvas moved`);
  assert.match(page, /<div class="band-prism" aria-hidden="true"><canvas class="prism-canvas"><\/canvas><\/div>/, `${name}: the band canvas moved`);
  assert.ok(page.includes('<script src="/prism.js" defer></script>'), `${name} does not load prism.js`);
  assert.doesNotMatch(page, /hero-portrait/, `${name} still shows the portrait`);
}
assert.match(readFileSync('prism.js', 'utf8'), /querySelectorAll\('\.prism-canvas'\)/, 'prism.js drives only one canvas');
assert.ok(!existsSync('assets/hero-portrait.jpg'), 'assets/hero-portrait.jpg came back');
console.log('ok prism: both entry pages render the glass form three times, in the hero, the band and contact, and the portrait is gone');

/* ── WhatsApp buttons are plain links ── the package and retainer buttons called
   window.open, which in-app browsers and some phones block as a popup, so
   "Get Started" did nothing. A link to wa.me opens WhatsApp everywhere. */
for (const [name, page] of [['index.html', home], ['south-africa.html', saPage]]) {
  assert.doesNotMatch(page, /window\.open\(|onclick="waEnquire/,
    `${name}: opens WhatsApp through window.open, which gets blocked as a popup; link to wa.me instead`);
}
console.log('ok whatsapp: every WhatsApp button is a plain link, nothing relies on window.open');

/* ── no payments on the site ── Paystack was removed in September 2026: clients
   are invoiced directly. Nothing may take a card or call a payment API again. */
for (const [name, page] of [['index.html', home], ['south-africa.html', saPage]]) {
  assert.doesNotMatch(page, /js\.paystack\.co|PaystackPop|pk_(?:live|test)_|\/api\/|id="page-pay"/,
    `${name}: takes payments on the site again; clients are invoiced directly`);
}
for (const gone of ['api', 'lib/paystack.js', 'setup-paystack-plans.mjs', '.well-known/apple-developer-merchantid-domain-association']) {
  assert.ok(!existsSync(gone), `${gone} is back; the site no longer takes payments`);
}
console.log('ok no payments: no Paystack checkout, payment API or Apple Pay file');

/* ── audit fixes stay fixed ── the September 2026 audit found the dev server open
   to the whole network and serving .git, no security headers, a garbled link
   that broke /south-africa, build files downloadable from the live site, and no
   spam trap on the contact forms. */
const devServer = readFileSync('dev-server.mjs', 'utf8');
assert.match(devServer, /\.listen\(port, '127\.0\.0\.1'/, 'dev-server.mjs listens beyond this machine again');
assert.match(devServer, /startsWith\('\.'\)/, 'dev-server.mjs serves hidden files like .git and .env.local again');
const siteWide = vercelHeaders.filter(h => h.source === '/(.*)' && !h.has).flatMap(h => h.headers);
const header = key => (siteWide.find(x => x.key.toLowerCase() === key) || {}).value || '';
assert.match(header('content-security-policy'), /frame-ancestors 'none'/, 'vercel.json lost the CSP that stops other sites framing ours');
assert.equal(header('x-frame-options'), 'DENY', 'vercel.json lost X-Frame-Options');
assert.equal(header('x-content-type-options'), 'nosniff', 'vercel.json lost X-Content-Type-Options');
assert.doesNotMatch(saPage, /decodeURIComponent\(location\.hash/, 'south-africa.html decodes the hash again; a malformed link throws and stops the page script');
const ignored = readFileSync('.vercelignore', 'utf8').split('\n').map(l => l.trim());
for (const entry of ['*.mjs', 'lib/', 'tools/', '.claude/']) {
  assert.ok(ignored.includes(entry), `.vercelignore no longer keeps ${entry} out of the deployment`);
}
for (const [name, page] of [['index.html', home], ['south-africa.html', saPage]]) {
  assert.ok(page.includes('name="_gotcha"'), `${name}: the contact form lost its spam honeypot`);
}
console.log('ok audit: dev server local-only, security headers set, hash parsing safe, tooling not deployed, forms trap spam');

/* ── the glass stays accessible ── the nav, menu and WhatsApp button are glass,
   and must turn solid for visitors who ask for less transparency or more
   contrast, and in browsers that cannot blur what is behind them. */
for (const sheet of ['home.css', 'site.css', 'article.css']) {
const sheetCss = readFileSync(sheet, 'utf8');
for (const [needle, what] of [['prefers-reduced-transparency:reduce', 'its reduced-transparency fallback'],
                              ['prefers-contrast:more', 'its increased-contrast fallback'],
                              ['@supports not ((-webkit-backdrop-filter', 'its fallback for browsers without backdrop-filter']]) {
  assert.ok(sheetCss.includes(needle), `${sheet} lost ${what} for the glass`);
}
}
console.log('ok glass: home.css, site.css and article.css keep solid fallbacks for reduced transparency, increased contrast and no backdrop-filter');

/* ── the homepage menus follow the page ── the nav once listed Pricing before
   Team while the page showed Team first. The nav, the mobile menu and the footer
   must list sections in the order they appear. */
const sectionOrder = [...home.matchAll(/<div class="band[^"]*" id="([a-z]+)"/g)].map(m => m[1]);
const inOrder = html => [...new Set([...html.matchAll(/href="#([a-z]+)"/g)].map(m => m[1]))].filter(id => sectionOrder.includes(id));
const expected = list => sectionOrder.filter(id => list.includes(id));
for (const [what, html] of [['nav', home.slice(home.indexOf('<nav'), home.indexOf('</nav>'))],
                            ['mobile menu', home.slice(home.indexOf('id="mobileMenu"'), home.indexOf('<main'))],
                            // the Studio column only; the Contact column lists ways to get in touch, not sections
                            ['footer', home.slice(home.indexOf('<footer'), home.indexOf('</ul>', home.indexOf('<footer')))]]) {
  const got = inOrder(html);
  assert.deepEqual(got, expected(got), `the homepage ${what} lists sections as ${got.join(', ')}; the page runs ${sectionOrder.join(', ')}`);
}
console.log('ok homepage menus: nav, mobile menu and footer list sections in page order');

/* ── headlines in sentence case, like iOS ── the display headings were set in
   capitals by CSS, which also hid Title Case copy underneath. Neither comes back. */
for (const [sheet, selectors] of [['home.css', ['.sec-h{', '.hero h1{', '.path-v{', '.cta-inner h2{', '.faq-main-header{']],
                                  ['site.css', ['.hero h1 {', '.sec > h2 {', '.close-cta h2 {']],
                                  ['article.css', ['h1 {', 'h2 {']]]) {
  const css = readFileSync(sheet, 'utf8');
  for (const sel of selectors) {
    const at = css.indexOf(sel);
    assert.ok(at >= 0 && !/text-transform:\s*uppercase/.test(css.slice(at, css.indexOf('}', at))),
      `${sheet}: ${sel} is set in capitals again; headlines are sentence case`);
  }
}
console.log('ok headlines: display headings are sentence case in home.css, site.css and article.css');

/* ── PCs get the animations too ── Windows sets prefers-reduced-motion whenever
   "Animation effects" is off, and a blanket rule that zeroed every transition gave
   those PCs a site with no animation at all. Reduced motion may hold movement still,
   never switch every transition off. */
for (const sheet of ['home.css', 'site.css', 'article.css']) {
  assert.doesNotMatch(readFileSync(sheet, 'utf8'), /transition-duration:\s*\.01ms/,
    `${sheet}: reduced motion switches every transition off again; hold movement still instead`);
}
console.log('ok motion: reduced motion stills movement without switching every transition off');
