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

export const collections = { listings };
