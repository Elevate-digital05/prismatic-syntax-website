// USD prices for the international homepage. Deliberately not converted from
// lib/pricing.js: at the rand exchange rate the ZAR sheet reads as offshore
// template pricing to a UK or US buyer, and it caps the ceiling before a
// conversation starts. Revisit these; never derive them from the rand sheet.
//
// Set September 2026 against market rates for the same scope: US freelancers
// charge roughly $1,500-$8,000 for a small business site and US agencies
// $6,000-$15,000 for 5-7 pages; UK small teams £3,000-£8,000; offshore teams
// $1,200-$4,000 for a 5-7 page marketing site; small-business e-commerce or
// booking builds $5,000-$25,000. These sit above the offshore band and below
// US agency rates, roughly keeping the steps between tiers on the ZAR sheet.
//
// If a figure goes back to TBD, build.mjs renders "Every project is quoted after
// a short call." in place of the whole sheet. The homepage FAQ on cost refers to
// "the packages above", so reword it if that happens. The feature lists come from
// lib/packages.js and the page counts from the web design tiers in
// lib/services.js, the same data the ZAR cards on /south-africa use.
//
// Collecting payment: clients are invoiced directly and never charged on the
// site (decided September 2026, when Paystack came off /south-africa too).
export const TBD = null;

export const USD_PACKAGES = {
  Starter:  1900,
  Business: 3900,
  Pro:      7500,
  Premium:  15000,  // shown as a starting figure, like the ZAR Premium tier
};
