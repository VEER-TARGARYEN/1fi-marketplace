/** Spacing scale (4pt grid) used for padding, margins and gaps. */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

/** Corner radii. `pill` gives fully rounded controls. */
export const radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

/** Standard hit slop for small touch targets. */
export const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 } as const;

export type Spacing = keyof typeof spacing;
export type Radius = keyof typeof radii;
