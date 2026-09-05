import { spacing } from '@/theme';

/** Clearance so scrollable content isn't hidden behind the floating tab bar. */
export const BOTTOM_NAV_SPACE = 108;

/** Horizontal page gutter used across the marketplace. */
export const PAGE_PADDING = spacing.xl;

/** Gap between grid columns/rows. */
export const GRID_GAP = spacing.md;

/**
 * Responsive grid: 2 columns on phones, more on tablets/web, and a computed
 * card width so cards fill the row exactly regardless of screen size.
 */
export function getGridConfig(width: number) {
  // useWindowDimensions() can report 0 on web's first paint — fall back so we
  // never compute a negative card width.
  const w = width > 0 ? width : 375;
  const columns = w >= 1024 ? 4 : w >= 720 ? 3 : 2;
  const contentWidth = Math.min(w, 1200) - PAGE_PADDING * 2;
  const cardWidth = Math.max(120, (contentWidth - GRID_GAP * (columns - 1)) / columns);
  return { columns, cardWidth };
}
