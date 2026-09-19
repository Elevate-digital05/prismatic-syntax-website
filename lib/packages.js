// The four website packages, once. build.mjs bakes the feature lists into the
// package cards on /south-africa (and five of each into the homepage's USD
// cards), so a crawler sees them in the HTML source rather than only after
// JavaScript runs. They were once written out by hand in two places and had
// drifted far enough to promise clients an account manager that does not exist.
//
// A feature is a string, or [label, 'new'] to carry the "New" badge.

export const PACKAGES = {
  Starter: {
    features: [
      '3–5 pages',
      'Custom brand colours & typography',
      'Mobile-responsive design',
      'WhatsApp chat integration',
      'Professional contact form',
      ['Google Business Profile setup', 'new'],
      'Basic on-page SEO',
      '1 round of revisions',
    ],
  },
  Business: {
    features: [
      'Everything in Starter',
      '6–8 pages',
      ['Copywriting for 3 pages', 'new'],
      'Full on-page SEO',
      'Google Maps + Analytics',
      ['Speed & Core Web Vitals optimisation', 'new'],
      'Priority support: same-day reply on weekdays',
      '2 rounds of revisions',
    ],
  },
  Pro: {
    features: [
      'Everything in Business',
      'Up to 12 pages',
      'E-commerce or booking system',
      ['Payment gateway setup', 'new'],
      ['Full copywriting', 'new'],
      'Blog setup + training',
      'Direct access to the people doing the work',
      '3 rounds of revisions',
    ],
  },
  Premium: {
    features: [
      ['Discovery & strategy workshop', 'new'],
      'Unlimited pages',
      'Custom functionality / API integrations',
      'Full SEO dominance strategy',
      'Direct line to the founders throughout',
      'Priority support, replies within 24h on weekdays',
    ],
  },
};
