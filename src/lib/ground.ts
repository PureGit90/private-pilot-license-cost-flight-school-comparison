import type { CollectionEntry } from 'astro:content';
import { median } from './rates';

export type Course = CollectionEntry<'courses'>;
export type Roundup = CollectionEntry<'roundups'>;
type Row = Roundup['data']['rows'][number];

export const fmtPrice = (n: number) => '$' + (Number.isInteger(n) ? n.toLocaleString('en-US') : n.toFixed(2));
export const fmtRow = (r: Row) => (r.priceHigh ? `${fmtPrice(r.priceLow)} to ${fmtPrice(r.priceHigh)}` : fmtPrice(r.priceLow));

// Does an article's listed price disagree with the provider's own current price? A range that contains the own price agrees.
export const differs = (own: number, r: Row) => (r.priceHigh ? own < r.priceLow || own > r.priceHigh : own !== r.priceLow);

export const priceStats = (courses: Course[]) => {
  const prices = courses.filter((c) => c.data.kind === 'full-course' && c.data.price !== null).map((c) => c.data.price as number);
  return { n: prices.length, min: Math.min(...prices), max: Math.max(...prices), median: median(prices) as number };
};

// One entry per article row whose course has a priced own page, with whether the two agree.
export function comparisons(courses: Course[], roundups: Roundup[]) {
  const byId = new Map(courses.map((c) => [c.id, c]));
  const out: { course: Course; roundup: Roundup; row: Row; differs: boolean }[] = [];
  for (const roundup of roundups) {
    for (const row of roundup.data.rows) {
      const course = byId.get(row.course);
      if (course && course.data.price !== null) out.push({ course, roundup, row, differs: differs(course.data.price, row) });
    }
  }
  return out;
}

// Where an article says something about the endorsement that the provider's own page does not say, or contradicts it.
export function endorsementGaps(courses: Course[], roundups: Roundup[]) {
  const byId = new Map(courses.map((c) => [c.id, c]));
  const out: { course: Course; roundup: Roundup; kind: 'contradicts' | 'unstated' }[] = [];
  for (const roundup of roundups) {
    for (const row of roundup.data.rows) {
      const course = byId.get(row.course);
      if (!course) continue;
      if (row.endorsement === 'not-included' && course.data.endorsement === 'included') out.push({ course, roundup, kind: 'contradicts' });
      if (row.endorsement === 'included' && course.data.endorsement === 'not-stated') out.push({ course, roundup, kind: 'unstated' });
    }
  }
  return out;
}
