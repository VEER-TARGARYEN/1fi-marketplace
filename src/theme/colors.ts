/**
 * 1Fi brand color tokens.
 *
 * Sampled to match the existing 1Fi app: a vivid violet brand color, a deep
 * indigo→violet banner gradient, soft gray surfaces and near-black text.
 * Keeping every color here (rather than inline in components) is what lets the
 * whole Marketplace stay visually consistent with the rest of the app.
 */
export const palette = {
  // Brand
  primary: '#6C2BD9',
  primaryDark: '#4A17A8',
  primaryDeep: '#33107A',
  primaryLight: '#8B5CF6',
  primaryTint: '#F4EFFE', // segmented control / chip background
  primaryTintStrong: '#E9DEFB',

  // Banner gradient (top-left → bottom-right)
  bannerGradient: ['#5B23C9', '#4A17A8', '#2E0E73'] as const,
  ctaGradient: ['#7C3AED', '#6C2BD9'] as const,

  // Accents
  gold: '#F5A623',
  goldSoft: '#FCEBCB',

  // Neutrals / surfaces
  background: '#F4F4F7',
  surface: '#FFFFFF',
  surfaceAlt: '#FAFAFC',
  card: '#FFFFFF',

  // Text
  text: '#141319',
  textSecondary: '#6C6B78',
  textTertiary: '#9B9AA6',
  textInverse: '#FFFFFF',

  // Lines
  border: '#EEEEF3',
  borderStrong: '#E1E1E9',

  // Status
  success: '#0FA968',
  successTint: '#E7F7F0',
  danger: '#E5484D',
  dangerTint: '#FDECEC',
  warning: '#F79009',
  warningTint: '#FEF3E2',

  // Misc
  star: '#FFB020',
  overlay: 'rgba(20, 19, 25, 0.45)',
  skeleton: '#E9E9F0',
  skeletonHighlight: '#F4F4F8',
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
};

export type Palette = typeof palette;
