/**
 * Currency + number formatting helpers.
 *
 * We format with the Indian numbering system (lakh/crore grouping) manually so
 * the output is identical across Hermes, JSC and web — independent of whether
 * `Intl` is available on the platform.
 */

/** 1234900 -> "12,34,900" (Indian grouping). */
function groupIndian(value: number): string {
  const isNegative = value < 0;
  const digits = Math.abs(Math.round(value)).toString();
  if (digits.length <= 3) return (isNegative ? '-' : '') + digits;

  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return (isNegative ? '-' : '') + grouped + ',' + last3;
}

/** 134900 -> "₹1,34,900". */
export function formatCurrency(amount: number): string {
  return `₹${groupIndian(amount)}`;
}

/** 423500 -> "₹4.24L", 12500000 -> "₹1.25Cr" (compact, for tight spaces). */
export function formatCompactCurrency(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
  return formatCurrency(amount);
}

/** mrp 149900, price 134900 -> 10 (percent off, rounded). */
export function discountPercent(mrp: number, price: number): number {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/** 12500 -> "12.5K", 1200000 -> "1.2M" — for review counts. */
export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}
