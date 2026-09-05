import { palette } from './colors';
import { spacing, radii, hitSlop } from './tokens';
import { typography, fonts } from './typography';
import { shadows } from './shadows';

export { palette, spacing, radii, hitSlop, typography, fonts, shadows };

/** Single theme object for ergonomic access: `theme.color.primary`, etc. */
export const theme = {
  color: palette,
  spacing,
  radii,
  hitSlop,
  typography,
  fonts,
  shadows,
};

export type Theme = typeof theme;
