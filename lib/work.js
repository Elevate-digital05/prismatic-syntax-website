// The businesses whose work we show, once. build.mjs lays these out on both entry
// pages, so the wall cannot drift between them the way the package lists once did.
//
// The rule from lib/services.js applies here above all: none of this may invent a
// client. Every entry is a business we have actually worked for, and `logo` must
// name a file that exists in assets/work/. An entry gains `url` and `did` only when
// there is a live site to link and a true sentence about what it does; until then a
// logo says what it can honestly say, which is that these are our clients.

export const WORK = [
  { name: 'Krestmore Construction', logo: 'krestmore.webp' },
  { name: 'Delta Scan',             logo: 'delta-scan.webp' },
  { name: 'Civil Engineering Assignments', logo: 'cea.webp' },
  { name: 'Epstein-Hunt Aquatic Physio',   logo: 'epstein-hunt.webp' },
  { name: 'Gilgen Door Systems',    logo: 'gilgen.webp' },
  { name: 'CSC',                    logo: 'csc.webp' },
  { name: 'Paperclip SA',           logo: 'paperclip.webp' },
];
