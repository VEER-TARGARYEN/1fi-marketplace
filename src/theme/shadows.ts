import { Platform, ViewStyle } from 'react-native';
import { palette } from './colors';

/**
 * Cross-platform soft shadows. iOS reads shadow*, Android reads elevation, and
 * react-native-web understands boxShadow — so we emit all three and let each
 * platform pick. Matches the subtle, diffuse card shadows in the 1Fi app.
 */
function make(
  elevation: number,
  radius: number,
  opacity: number,
  offsetY: number,
): ViewStyle {
  return Platform.select({
    web: {
      // rgba(20,19,25,opacity)
      boxShadow: `0px ${offsetY}px ${radius}px rgba(20, 19, 25, ${opacity})`,
    } as ViewStyle,
    android: { elevation },
    default: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
  }) as ViewStyle;
}

export const shadows = {
  none: {} as ViewStyle,
  xs: make(1, 4, 0.04, 1),
  sm: make(2, 10, 0.06, 4),
  md: make(4, 18, 0.08, 8),
  lg: make(8, 28, 0.12, 14),
  /** Purple-tinted shadow for primary CTAs. */
  primary: Platform.select({
    web: { boxShadow: `0px 8px 20px rgba(108, 43, 217, 0.32)` } as ViewStyle,
    android: { elevation: 6 },
    default: {
      shadowColor: palette.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.32,
      shadowRadius: 16,
    },
  }) as ViewStyle,
};

export type ShadowKey = keyof typeof shadows;
