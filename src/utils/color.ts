/** Tiny hex-color helpers for the generated product graphics. */

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function parse(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const int = parseInt(h, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function toHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => clamp(c).toString(16).padStart(2, '0')).join('');
}

/** Mix a color toward white by `amount` (0..1). */
export function lighten(hex: string, amount: number): string {
  const [r, g, b] = parse(hex);
  return toHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

/** Mix a color toward black by `amount` (0..1). */
export function darken(hex: string, amount: number): string {
  const [r, g, b] = parse(hex);
  return toHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

/** rgba() string from a hex + alpha. */
export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = parse(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Pick black or white text for best contrast on `hex`. */
export function readableOn(hex: string): string {
  const [r, g, b] = parse(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#141319' : '#FFFFFF';
}
