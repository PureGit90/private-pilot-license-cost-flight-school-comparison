import { defineCollection, z } from 'astro:content';

// A published price, as the school's own page words it. perHourHigh is set only when the page gives a range.
const rate = z.object({
  label: z.string().min(1),
  perHour: z.number().positive(),
  perHourHigh: z.number().positive().optional(),
  note: z.string().optional(),
});

const listings = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string().min(1),
    directoryType: z.enum(['local-business']),
    summary: z.string().min(1),
    // A concrete comparative judgment the top-ranking pages do not already have (guardrail 2).
    differentiator: z.string().min(1),
    url: z.string().url(),
    // Tracked referral link, set once an affiliate program approves us. The plain
    // url stays as the fallback so a listing never links nowhere.
    affiliateUrl: z.string().url().optional(),
    pricing: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    category: z.string().min(1),
    // Where the price came from. Every figure here is read from the school's own pages.
    pricingConfidence: z.enum(['vendor', 'third-party', 'quote']).default('vendor'),
    // What the school's own pages say about how it trains. 'not-stated' means we did not see it.
    trainingModel: z.enum(['part-141', 'part-61', 'not-stated']).default('not-stated'),
    // Does the published hourly aircraft rate include fuel, as far as the page says?
    rateBasis: z.enum(['wet', 'dry', 'not-stated']),
    aircraft: z.array(rate).default([]),
    instruction: z.array(rate).default([]),
    // The single-engine trainer and the flight-instruction rate used to build the "one dual hour" figure.
    // Set only when the page gives both. A combined figure the school states itself goes in dualHourStated.
    trainer: z.object({ label: z.string(), perHour: z.number().positive() }).optional(),
    flightInstruction: z.object({ perHour: z.number().positive(), perHourHigh: z.number().positive().optional() }).optional(),
    dualHourStated: z.object({ perHour: z.number().positive(), note: z.string() }).optional(),
    // The school's own estimate for a private pilot certificate, with the hours it assumes.
    estimate: z.object({ amount: z.number().positive(), hoursBasis: z.string(), note: z.string().optional() }).optional(),
    feesNamed: z.array(z.string()).default([]),
    // A date the page itself shows, if any.
    pageDate: z.string().nullable().optional(),
    bestFor: z.string().optional(),
    skipIf: z.string().optional(),
    watchOut: z.array(z.string()).default([]),
    lastChecked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    sources: z.array(z.string().url()).min(1),
  }),
});

// Online ground school and test prep providers: what each one's own page states about price, access, the
// FAA written test endorsement and its pass guarantee. price is null for subscriptions with no single price.
const courses = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string().min(1),
    provider: z.string().min(1),
    kind: z.enum(['full-course', 'bundle', 'test-prep']),
    summary: z.string().min(1),
    url: z.string().url(),
    // Tracked referral link, set once a program approves us. The plain url stays as the fallback.
    affiliateUrl: z.string().url().optional(),
    price: z.number().positive().nullable(),
    priceLabel: z.string().min(1),
    accessTerm: z.string().min(1),
    endorsement: z.enum(['included', 'not-stated']),
    endorsementNote: z.string().optional(),
    guarantee: z.string().min(1),
    includes: z.array(z.string()).default([]),
    watchOut: z.array(z.string()).default([]),
    pageDate: z.string().nullable().optional(),
    lastChecked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    sources: z.array(z.string().url()).min(1),
  }),
});

// Third-party comparison articles and what they list for each provider, so the page can show where they disagree
// with the providers' own pages. Dates are as the article shows them.
const roundups = defineCollection({
  type: 'data',
  schema: z.object({
    publisher: z.string().min(1),
    title: z.string().min(1),
    url: z.string().url(),
    dateLabel: z.string().min(1),
    rows: z.array(z.object({
      course: z.string().min(1),
      priceLow: z.number().positive(),
      priceHigh: z.number().positive().optional(),
      access: z.string().optional(),
      endorsement: z.enum(['included', 'not-included', 'not-stated']).default('not-stated'),
    })),
    lastChecked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    sources: z.array(z.string().url()).min(1),
  }),
});

export const collections = { listings, courses, roundups };
