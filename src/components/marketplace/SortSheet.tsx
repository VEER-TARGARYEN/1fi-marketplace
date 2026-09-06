import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { hitSlop, palette, radii, spacing } from '@/theme';
import { SortKey } from '@/types';

interface SortSheetProps {
  visible: boolean;
  value: SortKey;
  onSelect: (key: SortKey) => void;
  onClose: () => void;
}

export const SORT_OPTIONS: { key: SortKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'featured', label: 'Featured', icon: 'star-outline' },
  { key: 'price_asc', label: 'Price: Low to High', icon: 'arrow-up-outline' },
  { key: 'price_desc', label: 'Price: High to Low', icon: 'arrow-down-outline' },
  { key: 'rating_desc', label: 'Top rated', icon: 'trophy-outline' },
  { key: 'emi_asc', label: 'Lowest monthly EMI', icon: 'pricetag-outline' },
];

export function sortLabel(key: SortKey): string {
  return SORT_OPTIONS.find((o) => o.key === key)?.label ?? 'Featured';
}

/** Bottom sheet for choosing the product sort order. */
export function SortSheet({ visible, value, onSelect, onClose }: SortSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close sort menu">
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text variant="h3">Sort by</Text>
            <Pressable onPress={onClose} hitSlop={hitSlop} accessibilityRole="button" accessibilityLabel="Close">
              <Ionicons name="close" size={22} color={palette.textSecondary} />
            </Pressable>
          </View>

          {SORT_OPTIONS.map((option) => {
            const active = option.key === value;
            return (
              <Pressable
                key={option.key}
                style={styles.option}
                onPress={() => {
                  onSelect(option.key);
                  onClose();
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
              >
                <Ionicons
                  name={option.icon}
                  size={19}
                  color={active ? palette.primary : palette.textSecondary}
                />
                <Text
                  variant="bodyMedium"
                  color={active ? 'primary' : 'text'}
                  style={styles.optionLabel}
                >
                  {option.label}
                </Text>
                {active && <Ionicons name="checkmark-circle" size={20} color={palette.primary} />}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: palette.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.borderStrong,
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md + 2,
  },
  optionLabel: { flex: 1, marginLeft: spacing.md },
});
