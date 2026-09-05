import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { fonts, palette, typography } from '@/theme';
import { TypographyKey } from '@/theme/typography';

type FontWeightKey = keyof typeof fonts;

export interface TextProps extends RNTextProps {
  /** Typographic preset. */
  variant?: TypographyKey;
  /** Any palette token key, or a raw color string. */
  color?: keyof typeof palette | (string & {});
  /** Override the preset's font weight. */
  weight?: FontWeightKey;
  center?: boolean;
}

/**
 * The single text primitive for the app. Every label goes through here so type
 * scale, weights and colors stay consistent — no ad-hoc fontSize/color in
 * screens. Mirrors how the existing 1Fi app renders text.
 */
export function Text({
  variant = 'body',
  color = 'text',
  weight,
  center,
  style,
  ...rest
}: TextProps) {
  const preset = typography[variant] as TextStyle;
  const fromPalette = (palette as Record<string, unknown>)[color as string];
  const resolvedColor = typeof fromPalette === 'string' ? fromPalette : (color as string);

  return (
    <RNText
      {...rest}
      style={[
        preset,
        { color: resolvedColor },
        weight && { fontFamily: fonts[weight] },
        center && { textAlign: 'center' },
        style,
      ]}
    />
  );
}
