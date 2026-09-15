// The rand prices on /south-africa are hand-written in the package and retainer
// cards; lib/pricing.js holds them once, and check-build.mjs holds the service
// pages to the same figures. This fails loudly if the cards drift from it.
// Run: node check-prices.mjs
import { readFileSync } from 'node:fs';
import { PACKAGES_ZAR, RETAINERS_ZAR } from './lib/pricing.js';

const html = readFileSync(new URL('./south-africa.html', import.meta.url), 'utf8');
const pull = (re) => [...new Set([...html.matchAll(re)].map(m => parseInt(m[1], 10)))];

let bad = 0;
const compare = (name, found, expected) => {
  const a = [...found].sort((x, y) => x - y).join(',');
  const b = [...expected].sort((x, y) => x - y).join(',');
  if (!found.length) { console.error(`FAIL ${name}: none found in south-africa.html — did the markup change?`); bad++; }
  else if (a !== b) { console.error(`FAIL ${name}: south-africa.html has [${a}], lib/pricing.js has [${b}]`); bad++; }
  else console.log(`ok ${name}: [${a}]`);
};

compare('packages', pull(/<div class="p-amount" data-price="(\d+)"/g), PACKAGES_ZAR);
compare('retainers', pull(/<div class="m-price" data-price="(\d+)"/g), RETAINERS_ZAR);
process.exit(bad ? 1 : 0);
