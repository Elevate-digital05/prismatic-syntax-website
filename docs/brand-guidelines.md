# Prismatic Syntax brand guidelines v1.0

How Prismatic Syntax looks and sounds. Product facts, audiences and evidence rules live in `PRODUCT.md`. The visual rules live in `brand/README.md` and the tokens in `theme.css`, and this file points to them instead of copying them, so there is one place to change each.

## Quick reference

- **Name:** Prismatic Syntax. Never "Elevate Digitals", which no longer exists.
- **Lead promise:** see your homepage design before you pay anything.
- **Voice:** plain, specific, sure of itself, on the client's side.
- **Case:** sentence case everywhere. Only small section labels are in capitals.
- **Colour:** ink, paper and one blue (`#0046FF`). Blue carries white text, never ink.
- **Type:** Inter Tight for display, Manrope for body.
- **Proof:** only the seven real client logos in `lib/work.js`. No testimonials, numbers or case studies until real ones exist.

## 1. Visual identity

The palette, the mark, the lockups, the typefaces, the Liquid Glass material, corner rules and clear space are all in **`brand/README.md`**. Every colour, radius, glass and easing value is a custom property in **`theme.css`**, and no other file may carry a literal colour.

The rules that matter most when making anything new:

1. **Blue carries white text, never ink.** On ink, small blue text uses `--blue-light` (`#6F9BFF`).
2. **One tint.** Blue marks the primary action, the hero highlight and active states. It stops working the moment it is everywhere.
3. **The prism appears once, large.** The live glass form sits behind the hero headline on each entry page, never as a small decoration.
4. **Motion sharpens rather than slides.** Headings come out of a blur in place, and pages part along the slant of the logo's shards. Reduced motion holds movement still but keeps fades.

## 2. Voice

### Personality

Prismatic Syntax sounds like a capable founder explaining the job across a table: direct about price and time, specific about what the client gets, and quietly confident because the work is shown before money changes hands.

### Voice chart

| Trait | We are | We are not |
|---|---|---|
| Plain | Short sentences, everyday words. "We design your homepage concept free." | Agency jargon: "solutions", "synergy", "digital presence ecosystem". |
| Specific | Concrete details that prove we know the trade. "Designed at 360px wide before anything else." | Vague praise: "stunning", "world-class", "cutting-edge". |
| Sure of ourselves | We state what we do and stand behind it. "You owe nothing." | Hype or pressure: "the #1 agency", "limited spots", "act now". |
| On the client's side | We name their worry and answer it. "Do I own the website when it is finished? Yes." | Talking about ourselves. "We are passionate about pixels." |
| Honest | Conditions attached. "Usually in about two weeks, once content lands." | Guarantees we cannot keep, invented numbers, borrowed clients. |

### Tone by context

The voice stays the same everywhere; the tone shifts with what the reader is doing.

| Context | Tone | Example from the site |
|---|---|---|
| Hero and headlines | Confident and short | "A full-stack creative agency. Built by hand." |
| Service pages | Practical, trade-specific | "A tap-to-chat button on every page, pre-filled with a message so they do not have to think of what to say." |
| Pricing and FAQ | Straight answers, the yes or no first | "Yes. Once the final payment is made, the domain, the files, and the content are yours." |
| Reassurance | Calm, removes the risk | "If you do not want to go ahead after seeing it, you owe nothing." |
| Form success | Says what happens next and when | "Request received. We will email you within one working day to set up the call." |
| Form error | No blame, gives a way through | "Could not send. Email us instead: info@prismaticsyntax.com." |

### Writing rules

- **Lead with the answer.** In FAQs and pricing, the first word answers the question.
- **Write to "you", speak as "we".** The client is the subject of most sentences.
- **Numbers stay exact and true.** Prices come from `lib/pricing.js` and `lib/pricing-usd.js` only. Timelines carry their condition.
- **Sentence case** for headlines, buttons, nav, labels and card titles.
- **British spelling** (optimise, colour), matching the site.
- **No exclamation marks** in body copy.

### Words we avoid

| Avoid | Why | Use instead |
|---|---|---|
| Elevate, elevated | The old agency name, and an agency cliché | Say what improves |
| Solutions, leverage, synergy, unlock | Jargon that says nothing | The actual thing: a website, a booking system |
| Stunning, world-class, cutting-edge, best-in-class | Unprovable praise | A specific, checkable detail |
| Guaranteed, #1, award-winning | Claims we cannot back | What we actually promise |
| Account manager | We do not have one | "A founder's number" |
| Cheap, budget | Undercuts the work | "Starting prices", "once-off" |

### Watch in current copy

Lines that drift from the voice and are worth rewriting when the page is next touched:

- `/south-africa` hero: "Turn your website into a lead-generating machine" leans on a marketing cliché. The service pages say the same thing more concretely ("Turn a phone screen into a…").
- `lib/services.js` copywriting card: "Clear, compelling, on-brand" is three adjectives instead of one specific claim.

## 3. Messaging

### Primary message

**See your homepage design before you pay anything.** It removes the biggest risk of hiring an agency, and it is something a competitor using templates cannot easily match.

### Supporting messages

1. **You own everything.** Hand-built, with no page builder and no proprietary CMS. The files, content and domain are handed over, and the client can take them to any developer.
2. **Fast launch.** Most sites go live in about two weeks once the deposit and content have landed.
3. **One team for the whole job.** Website, brand identity, copy and video, with a founder on every project. True and worth saying, but it supports the first two rather than leading.

### Pitches

- **One line:** Hand-built websites for service businesses. See your homepage design free before you pay anything.
- **Thirty seconds:** We build websites by hand for service businesses: trades, clinics, studios and consultancies. After a short call we design your homepage free, so you see exactly what you are getting before you pay. Most sites launch in about two weeks, and when we hand over, the files, the content and the domain are yours.

### By audience

| | International (`/`) | South Africa (`/south-africa`) |
|---|---|---|
| Who | Service businesses in the UK, Europe and North America | Trades and service businesses in South Africa |
| Currency | USD only; never rand on this page | ZAR |
| Lead with | The free concept, then ownership | The free concept, then mobile and WhatsApp |
| First contact | Book a call, then email, then WhatsApp | WhatsApp first, then the form |
| Must mention | Remote working across time zones, hours in UTC+2 | Load speed on mobile data, Google Maps, POPIA |
| Never | South Africa outside the location FAQ, rand, Paystack | Links to the international homepage from service pages or blog posts |

### Proof rules

- Show only the seven real clients in `lib/work.js`. A logo means "we worked for them", nothing more, until a live site and a true sentence exist.
- No testimonials, results, star ratings, client counts or awards until real ones are on file.
- Peninsula Roofing was a spec mockup, not a client, and never appears as work.

## 4. Imagery

- **Photography:** none on the site today. When added, use real work and real people: the team, client sites on real devices. No stock "agency team at whiteboard" shots.
- **Illustration:** the prism is the brand's only illustrative element. No generic 3D blobs, mascots or clip art beside it.
- **Icons:** simple 1.75px line icons in the text colour, as in the contact list. No emoji as icons.
- **Client work:** logos on the client wall, each at its natural colours on a neutral tile.
