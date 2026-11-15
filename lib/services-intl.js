// The international versions of the service pages, at /international/<slug>.
// build.mjs starts from each service in lib/services.js and lays this file over
// it, so only what differs for a client in the UK, Europe or North America is
// written here: the prices, and any copy that names South Africa, rands, EFTs,
// Paystack or WhatsApp-first habits. Everything else is shared, so an edit to a
// service's description or FAQ in lib/services.js reaches both versions.
//
// Prices, all USD, set by hand in November 2026 and never converted from the
// rand sheet: at the exchange rate the ZAR figures read as offshore template work
// to a UK or US buyer. Package and retainer tiers must match lib/pricing-usd.js
// (check-build.mjs holds them to it). The standalone figures were set against
// UK/US freelance and small-studio rates for the same scope:
//   SEO: audits $500-$2,500, local SEO retainers $500-$2,000/mo
//   copywriting: $150-$500 a web page, blog posts $200-$500 each
//   short-form video editing: $75-$300 a cut
//   logo design $500-$2,500, a small-business identity $1,500-$5,000
// Each sits mid-band, above the offshore rate and below agency rates, the same
// position as the USD packages, and keeps the steps between tiers on the ZAR sheet.
//
// Shape, per slug (every key optional):
//   metaTitle, metaDescription, lede, who   replace the shared value
//   included: { 'Name': { name?, desc } }    replaces one "What's included" item
//   faqs: { 'Shared question?': { q, a } }   replaces one FAQ, found by its question
//   pricing: { lead, note, prices: { Tier: usd }, feats: { Tier: [...] } }
// build.mjs also swaps "once-off" for "one-off" and the SAST hours for their UTC
// form everywhere on these pages.

import { USD_PACKAGES as P, USD_RETAINERS as R } from './pricing-usd.js';

export const HOURS_INTL = 'Mon–Fri 07:00–19:00 · Sat 12:00–17:00 SAST (UTC+2)';
const REACH = 'That is 05:00–17:00 in London, and until noon in New York (an hour later in summer).';

const usd = n => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const OWN_HOSTING = `which for a site this size typically runs $10–$30 a month, plus a domain renewal of roughly $15–$40 a year`;

export const INTL = {
  'web-design': {
    metaTitle: 'Custom Website Design & Build for Service Businesses',
    metaDescription: `Hand-built, mobile-first websites for service businesses in the UK, Europe and North America. Packages from ${usd(P.Starter)}, live in about two weeks. See your first concept free.`,
    included: {
      'Built mobile first': { desc: 'Designed at 360px wide before anything else, because that is where most visits to a local service business now arrive.' },
    },
    who: [
      ['You have no website yet', 'and you are losing the customers who look you up before calling.'],
      ['Your site is years old', 'and it looks it, or it does not work properly on a phone.'],
      ['Your enquiries arrive by phone, email and message', 'and you want one proper front door feeding into all of them.'],
      ['You are quoting against bigger competitors', 'and need to look like the safer choice, not the cheaper one.'],
    ],
    pricing: {
      lead: 'One-off, in USD and invoiced directly. A 50% deposit starts the work once you have approved the concept, and the balance is due before launch.',
      prices: { ...P },
      note: `Every package can carry a monthly retainer from ${usd(R['Starter Care'])} to keep the site hosted, backed up and updated after launch. See <a href="/international/maintenance">maintenance</a>.`,
    },
    faqs: {
      'Who hosts it, and what does it cost after launch?': { q: 'Who hosts it, and what does it cost after launch?', a: `Hosting is included in any monthly retainer. Without a retainer you arrange your own, ${OWN_HOSTING}. You get the exact figures before launch.` },
    },
  },

  seo: {
    metaTitle: 'Local SEO Services for Service Businesses',
    metaDescription: 'Local SEO for service businesses in the UK, Europe and North America. Keyword research, on-page and technical SEO, and a Google Business Profile that shows up on Maps.',
    pricing: {
      lead: 'Standalone SEO in USD, priced for a site the size we build. A much larger site scales the audit, and we tell you before starting rather than after.',
      prices: { 'SEO audit': 950, 'Setup & fix': 2200, 'Ongoing SEO': 650 },
      note: `Some of this is already included elsewhere: every <a href="/international/web-design">website package</a> ships with on-page SEO done at build time, and monthly SEO reporting comes with Business Care (${usd(R['Business Care'])}/mo) and Pro Care (${usd(R['Pro Care'])}/mo) on <a href="/international/maintenance">maintenance</a>. If you are getting a new site built, you may not need a separate SEO engagement at all.`,
    },
    faqs: {
      'What is local SEO and why does it matter more here?': { q: 'What is local SEO and why does it matter?', a: 'Local SEO is the work that makes you show up for searches with intent behind them: "electrician in Bristol", or just "electrician near me" on a phone. For a business that serves one city it is worth more than national ranking, because those searchers are ready to call. Most of the leverage sits in your Google Business Profile, not your website.' },
    },
  },

  ecommerce: {
    metaTitle: 'E-Commerce Website Design | Online Stores for Small Businesses',
    metaDescription: `Online stores for small businesses in the UK, Europe and North America. Product catalogue, secure card checkout via Stripe, inventory and order notifications. From ${usd(4500)}.`,
    lede: 'Taking orders through DMs and manual bank transfers works until it does not. A proper shop takes the payment, records the order and tells you about it, while you are doing something else.',
    included: {
      'Paystack integration': { name: 'Stripe integration', desc: 'Cards, Apple Pay and Google Pay, settled to your own bank account in your own currency.' },
    },
    who: [
      ['You sell in person', 'and want the same stock available to people who cannot get to you.'],
      ['You take orders in DMs', 'and are losing track of who paid and who did not.'],
      ['You send manual invoices', 'and chase proof of payment for every single order.'],
      ['You are on a marketplace', 'and want your own storefront that does not take a cut.'],
    ],
    pricing: {
      lead: 'In USD. A small shop fits on the Business package; a full catalogue is Pro. Larger catalogues or custom integrations move to Premium, which is quoted after a discovery session.',
      // Business here is a website-plus-shop bundle, above the plain Business package, as on the ZAR sheet.
      prices: { Business: 4500, Pro: P.Pro, Premium: P.Premium },
      feats: {
        Business: ['Everything in the Business website package', 'Online shop with up to 50 products', 'Stripe checkout', 'Order email notifications', '2 rounds of revisions'],
        Pro: ['Everything in the Business package', 'Full product catalogue', 'Secure checkout', 'Stripe payment gateway setup', 'Inventory and order notifications', 'Full copywriting', '3 rounds of revisions'],
      },
      note: `A shop that takes money should not go unattended. Pro Care at ${usd(R['Pro Care'])}/mo covers store and checkout support alongside the usual hosting, backups and updates. See <a href="/international/maintenance">maintenance</a>.`,
    },
    faqs: {
      'Which payment gateway do you use?': { q: 'Which payment gateway do you use?', a: 'Stripe by default. It works across the UK, Europe and North America, takes the major cards plus Apple Pay and Google Pay, settles to your own bank account, and handles the card entry in its own secure window so card numbers never pass through your site. If you already use PayPal, Square or another provider, tell us before we start and we will tell you honestly whether it fits.' },
      'What happens if the checkout breaks?': { q: 'What happens if the checkout breaks?', a: `A broken checkout costs you money the same day, which is why Pro Care exists. Support runs ${HOURS_INTL}, with a same-day reply on weekdays. ${REACH} We do not offer overnight or Sunday cover, and we would rather tell you that now than have you find out during a problem.` },
    },
  },

  maintenance: {
    metaTitle: 'Website Maintenance Plans | Hosting, Backups & Support',
    metaDescription: `Monthly website maintenance for service businesses. Hosting, weekly backups, SSL and security monitoring, and content updates. Plans from ${usd(R['Starter Care'])} a month.`,
    who: [
      ['Your site is live and nobody is looking after it', 'which is the normal state of most small business websites.'],
      ['It broke once already', 'and you would rather not repeat the week that followed.'],
      ['You do not want to touch it', 'and would rather send an email than log into anything.'],
      ['Your prices or team change often', 'and the site is always three months behind.'],
    ],
    pricing: {
      lead: 'Monthly, in USD. Each plan pairs with a website package, but you do not have to have bought the site from us. Cancel any time with 30 days\' notice.',
      prices: { ...R },
      note: `Premium Care is settled in consultation rather than billed automatically, because "from ${usd(R['Premium Care'])}" depends on what managing it actually involves.`,
    },
    faqs: {
      'What are your support hours?': { q: 'What are your support hours?', a: `${HOURS_INTL}. ${REACH} On Business Care and above you get a same-day reply on weekdays. We do not offer 24/7 or overnight cover. The hours above are the hours we actually work, and we would rather set a promise we can keep than one that sounds better in a brochure. Uptime monitoring runs continuously regardless, so an outage is caught even outside those hours.` },
      'Do I have to take a retainer?': { q: 'Do I have to take a retainer?', a: `No. It is optional on every package. Without one you arrange your own hosting, ${OWN_HOSTING}, and you handle updates yourself or pay hourly when something needs doing. Plenty of clients do exactly that.` },
    },
  },

  'booking-systems': {
    metaTitle: 'Online Booking Systems | Appointment Booking Websites',
    metaDescription: 'Website booking systems for salons, clinics, consultants and trades in the UK, Europe and North America. Online calendar, service and staff selection, automatic confirmations.',
    included: {
      'Optional booking deposit': { desc: 'Take a deposit at the time of booking if no-shows cost you. Uses the same Stripe setup as the shop.' },
    },
    pricing: {
      lead: 'In USD. A booking system is part of the Pro package. More complicated setups, or an integration with software you already run, move to Premium.',
      prices: { Pro: P.Pro, Premium: P.Premium },
      note: `Pro Care at ${usd(R['Pro Care'])}/mo covers booking system support alongside hosting, backups and updates. See <a href="/international/maintenance">maintenance</a>.`,
    },
    faqs: {
      'Can clients pay a deposit when they book?': { q: 'Can clients pay a deposit when they book?', a: 'Yes, if you want them to. It uses the same Stripe card setup as the online shop, so the money settles to your own account. Deposits are the most effective way to cut no-shows, though they do put some people off booking, so it is worth being deliberate about which services need one.' },
    },
  },

  copywriting: {
    metaTitle: 'Website Copywriting | Content That Turns Visitors Into Enquiries',
    metaDescription: 'Website copywriting for service businesses in the UK, Europe and North America. Homepage, about and service page content written to turn visitors into enquiries.',
    pricing: {
      lead: 'Standalone copywriting, in USD. A three-page site and a twelve-page site are different jobs, so the full-site price below covers up to eight pages and scales past that.',
      prices: { 'Page pack': 275, 'Full site copy': 1800, 'Ongoing content': 750 },
      note: `Copy is already bundled into two <a href="/international/web-design">website packages</a>: Business (${usd(P.Business)}) includes copywriting for 3 pages, and Pro (${usd(P.Pro)}) includes full copywriting for the site. If you are having a site built, start there before pricing this separately.`,
    },
    faqs: {
      'Will it sound like me, or like a copywriter?': { q: 'Will it sound like me, or like a copywriter?', a: 'Like you, which is the whole point. Tone of voice is agreed before anything is written, usually off a briefing call and whatever you already have, including the way you write your own quotes and emails. If the first draft does not sound like you, that is what the changes are for.' },
      'Do you write in South African English?': { q: 'Do you write in British or American English?', a: 'Whichever your customers use: British spelling for a UK or European audience, American for a US one, decided at the start and applied consistently. It matters more than it sounds. The wrong spelling on a local business website reads as a template someone bought.' },
    },
  },

  'video-editing': {
    metaTitle: 'Video Editing for Service Businesses | Social & Website Video',
    metaDescription: 'Video editing for trades and service businesses. Job footage cut into social reels and website video, with subtitles, colour and sound handled.',
    pricing: {
      lead: 'Editing only, from footage you supply, in USD. A finished cut is up to about 90 seconds; longer pieces are quoted once we have seen the material.',
      prices: { 'Single cut': 195, Batch: 850, Monthly: 640 },
      note: 'Video sits well alongside <a href="/international/brand-identity">brand identity</a>, since the intro, end card and captions all use the same colours and type as everything else.',
    },
  },

  'brand-identity': {
    metaTitle: 'Brand Identity & Logo Design for Small Businesses',
    metaDescription: 'Logo design and brand identity for trades and service businesses. Colours, typography and usage guidelines, delivered as vector files you own outright.',
    pricing: {
      lead: 'One-off, in USD. If you already have a mark worth keeping, a refresh is quoted lower than a rebuild, and we will tell you which one you actually need.',
      prices: { 'Logo only': 950, Identity: 1900, 'Identity + collateral': 2900 },
      note: 'If a website is part of the plan, the identity is worth doing first. A site designed around a logo you are about to replace gets built twice. See <a href="/international/web-design">web design</a>.',
    },
  },
};
