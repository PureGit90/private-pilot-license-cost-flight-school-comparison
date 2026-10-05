// Working brand, matched to the lead domain candidate (privatepilotlicensecostcompared.com). It and the tagline
// are the only places the brand appears in code, so renaming is a one-file change once Marco picks a domain.
export const SITE_NAME = 'Private Pilot License Cost Compared';
export const TAGLINE = 'What flight schools actually publish about price.';
export const SITE_DESCRIPTION =
  'Aircraft and instructor rates, fees and private pilot estimates for 24 flight schools, each sourced to the school\'s own page with the date we read it.';

// Nothing is crawlable until GATE approval. /publish-directory sets PUBLIC_NOINDEX=false on production only.
export const NOINDEX = import.meta.env.PUBLIC_NOINDEX !== 'false';

// Shown on the legal, About and Corrections pages; the line is omitted when null.
export const CONTACT_EMAIL: string | null = 'sunshinesolutions305@outlook.com';
export const OPERATOR_NAME = 'PALM ICON LLC';
export const OPERATOR_PLACE = 'Miami, Florida';

// The date the schools' own pages were last read. Update it whenever the data is re-read.
export const DATA_DATE = '2026-10-04';
export const DATA_DATE_LABEL = 'October 4, 2026';

export const NAV: { href: string; label: string }[] = [
  { href: '/private-pilot-license-cost/', label: 'Cost' },
  { href: '/ground-school-cost/', label: 'Ground school' },
  { href: '/all/', label: 'All schools' },
  { href: '/how-we-compare/', label: 'Method' },
];

export const CATEGORIES: { slug: string; name: string; short: string; intro: string; seoTitle: string }[] = [
  {
    slug: 'hourly-rates-on-the-page',
    name: 'Hourly rates on the page',
    short: 'Hourly rates published',
    intro:
      'These schools print what an hour of aircraft and an hour of instruction cost. That is the only way to compare schools like for like, and even here the figures differ in what they include: fuel, tax, a minimum number of hours.',
    seoTitle: 'Flight Schools That Publish Hourly Rates',
  },
  {
    slug: 'program-prices-and-ranges',
    name: 'Program prices, ranges and partial rates',
    short: 'Program prices or ranges',
    intro:
      'These schools sell by program, publish ranges, or print only part of a rate sheet. A program total can still be useful, but it hides how many hours it assumes, so read the hours next to the price.',
    seoTitle: 'Flight School Program Prices and Ranges',
  },
];

// Price-source labels. Tone picks the tag color: primary, signal or neutral.
export const CONFIDENCE: Record<string, { label: string; note: string; tone: string }> = {
  vendor: { label: 'School-published', note: "Taken from the school's own page.", tone: 'primary' },
  'third-party': { label: 'Third-party reported', note: 'Not confirmed on the school page; from a named third party and may differ.', tone: 'signal' },
  quote: { label: 'Quote only', note: 'The school does not publish a price.', tone: 'neutral' },
};

// What the school's own page says about fuel in the hourly aircraft rate. Wet means fuel is included.
export const BASIS: Record<string, { label: string; note: string; tag: string }> = {
  wet: { label: 'Wet (fuel included)', note: 'The school says the hourly aircraft rate includes fuel.', tag: 'wet' },
  dry: { label: 'Dry (fuel extra)', note: 'The school says fuel is not included in the hourly aircraft rate.', tag: 'dry' },
  'not-stated': { label: 'Fuel not stated', note: 'The page does not say whether fuel is included. We do not guess.', tag: 'nostated' },
};

export const TRAINING_MODEL: Record<string, string> = {
  'part-141': 'Says it runs a Part 141 program',
  'part-61': 'Says it is a Part 61 school',
  'not-stated': 'Part 61 or Part 141 is not stated on the pages we read',
};

// The one memorable thing on the home page: a school's own dated rate sheet, with the dual hour worked out from it.
export const HERO_PANEL: {
  title: string;
  subtitle?: string;
  rows: { label: string; value: string; kind?: 'sub' | 'total' }[];
  source: { label: string; href: string };
} | null = {
  title: 'One school\'s own rate sheet',
  subtitle: 'Pilot Rise, Dallas and Fort Worth. Updated September 19, 2026.',
  rows: [
    { label: 'Cessna 172, wet, five tail numbers', value: '$165/hr' },
    { label: 'Cessna 172, Garmin 500 and air conditioning', value: '$180/hr' },
    { label: 'Cessna 150', value: '$130/hr' },
    { label: 'Instruction, standard', value: '$70/hr' },
    { label: 'Refundable deposit', value: '$1,500' },
    { label: 'Fuel surcharge from May 11, 2026', value: '$0.90/gal' },
    { label: 'One dual hour, $165 + $70', value: '$235/hr', kind: 'total' },
  ],
  source: { label: 'pilotrise.com/detailed-prices', href: 'https://pilotrise.com/detailed-prices/' },
};

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const categoryByName = (name: string) => CATEGORIES.find((c) => c.name === name);
