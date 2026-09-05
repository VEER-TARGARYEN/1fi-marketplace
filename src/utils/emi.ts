import { EmiPlan, UserLimit } from '../types';

/** Global EMI tenures 1Fi offers (months). Individual products may narrow this. */
export const DEFAULT_EMI_TENURES = [3, 6, 9, 12, 18, 24, 36] as const;

/**
 * Build the list of no-cost EMI plans for a given price.
 *
 * 1Fi EMIs are genuinely no-cost: 0% interest, total payable == price. The
 * monthly amount is simply the price spread across the tenure. We also compute
 * how much of the user's mutual-fund-backed limit each plan blocks, so the UI
 * can flag plans that exceed the available limit.
 */
export function buildEmiPlans(
  price: number,
  tenures: readonly number[] = DEFAULT_EMI_TENURES,
  limit?: UserLimit,
): EmiPlan[] {
  const available = limit?.availableLimit ?? Infinity;
  // Recommend the plan closest to a ~₹5,000/mo sweet spot, else the median.
  const recommendedTenure = pickRecommendedTenure(price, tenures);

  return tenures.map((tenureMonths) => {
    const monthlyAmount = Math.round(price / tenureMonths);
    return {
      tenureMonths,
      monthlyAmount,
      totalPayable: price,
      interestRate: 0,
      noCost: true,
      recommended: tenureMonths === recommendedTenure,
      limitUsage: available === Infinity ? 0 : Math.min(price / available, 1),
      withinLimit: price <= available,
    };
  });
}

function pickRecommendedTenure(
  price: number,
  tenures: readonly number[],
): number {
  const target = 5000; // aim for an affordable monthly amount
  let best = tenures[0];
  let bestDelta = Infinity;
  for (const t of tenures) {
    const delta = Math.abs(price / t - target);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = t;
    }
  }
  return best;
}

/** Lowest possible monthly EMI for a price (longest tenure) — for list cards. */
export function lowestMonthlyEmi(
  price: number,
  tenures: readonly number[] = DEFAULT_EMI_TENURES,
): number {
  const maxTenure = Math.max(...tenures);
  return Math.round(price / maxTenure);
}

/** Human date for the first EMI, N days from a base date (default: 30). */
export function firstEmiDate(base: Date, offsetDays = 30): string {
  const d = new Date(base.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
