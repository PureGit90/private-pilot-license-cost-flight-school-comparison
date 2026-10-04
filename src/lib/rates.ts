import type { CollectionEntry } from 'astro:content';

export type Listing = CollectionEntry<'listings'>;

export const fmtUsd = (n: number) =>
  '$' + (Number.isInteger(n) ? n.toLocaleString('en-US') : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
export const fmtRange = (low: number, high?: number | null) => (high ? `${fmtUsd(low)} to ${fmtUsd(high)}` : fmtUsd(low));

export const alpha = (a: Listing, b: Listing) => a.data.name.localeCompare(b.data.name);

// One hour of dual instruction: aircraft plus instructor. Built only when the page gives both, or the school
// states a combined figure itself. It is not like for like across schools (fuel, tax, minimums differ).
export type Dual = { low: number; high: number | null; kind: 'sum' | 'stated'; note: string };
export function dual(l: Listing): Dual | null {
  const d = l.data;
  if (d.dualHourStated) return { low: d.dualHourStated.perHour, high: null, kind: 'stated', note: d.dualHourStated.note };
  if (d.trainer && d.flightInstruction) {
    const low = Math.round((d.trainer.perHour + d.flightInstruction.perHour) * 100) / 100;
    const high = d.flightInstruction.perHourHigh ? Math.round((d.trainer.perHour + d.flightInstruction.perHourHigh) * 100) / 100 : null;
    return { low, high, kind: 'sum', note: `${d.trainer.label} at ${fmtUsd(d.trainer.perHour)} plus instruction at ${fmtRange(d.flightInstruction.perHour, d.flightInstruction.perHourHigh)}.` };
  }
  return null;
}

export const median = (nums: number[]) => {
  const s = nums.slice().sort((a, b) => a - b);
  if (s.length === 0) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export type Stats = { n: number; min: number | null; median: number | null; max: number | null };
export const stats = (nums: number[]): Stats => ({ n: nums.length, min: nums.length ? Math.min(...nums) : null, median: median(nums), max: nums.length ? Math.max(...nums) : null });

// Cessna 172 headline rates, from the trainer row of schools whose trainer is a Cessna 172. Split by what each page says about fuel.
export function cessna172(listings: Listing[]) {
  const rows = listings
    .filter((l) => l.data.trainer && /cessna 172/i.test(l.data.trainer.label))
    .map((l) => ({ id: l.id, name: l.data.name, basis: l.data.rateBasis, perHour: l.data.trainer!.perHour }));
  const by = (b: string) => stats(rows.filter((r) => r.basis === b).map((r) => r.perHour));
  return { rows, all: stats(rows.map((r) => r.perHour)), wet: by('wet'), dry: by('dry'), notStated: by('not-stated') };
}

export const duals = (listings: Listing[]) =>
  listings.map((l) => ({ l, d: dual(l) })).filter((x): x is { l: Listing; d: Dual } => x.d !== null);

export const estimates = (listings: Listing[]) =>
  listings.filter((l) => l.data.estimate).map((l) => ({ l, e: l.data.estimate! })).sort((a, b) => a.e.amount - b.e.amount);
