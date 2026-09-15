// The rand prices, once. check-prices.mjs holds the package and retainer cards
// on /south-africa to these figures and check-build.mjs holds the service pages
// to them, so a price cannot change in one place and not the others.

export const PACKAGES_ZAR = [8500, 18500, 34999, 75000];

// Retainers are monthly and invoiced separately from the build. The deposit is
// 50% of the package alone — an earlier version folded a month's retainer into
// the once-off total and charged half of it.
export const RETAINERS_ZAR = [799, 1299, 1999, 3500];
