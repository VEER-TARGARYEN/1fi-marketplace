import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { fonts, hitSlop, palette, radii, shadows, spacing } from '@/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  autoFocus?: boolean;
}

/** Rounded search field matching the existing "Search stores…" bar. */
export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search products…',
  style,
  autoFocus,
}: SearchBarProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={20} color={palette.textTertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.textTertiary}
        style={styles.input}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={hitSlop} accessibilityRole="button" accessibilityLabel="Clear search">
          <Ionicons name="close-circle" size={18} color={palette.textTertiary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    height: 52,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    ...shadows.xs,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: palette.text,
    // remove web focus outline for a native feel
    ...(({ outlineStyle: 'none' } as unknown) as object),
  },
});
