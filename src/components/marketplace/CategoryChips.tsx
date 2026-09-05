import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { PressableScale } from '@/components/common/PressableScale';
import { Text } from '@/components/common/Text';
import { palette, radii, spacing } from '@/theme';
import { Category, CategoryId } from '@/types';

interface CategoryChipsProps {
  categories: Category[];
  selected: CategoryId | 'all';
  onSelect: (id: CategoryId | 'all') => void;
}

/** Horizontally-scrolling category filter chips. */
export function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {categories.map((cat) => {
        const active = cat.id === selected;
        return (
          <PressableScale
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            activeScale={0.95}
            style={styles.chipWrap}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <View style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}>
              <Ionicons
                name={cat.icon as keyof typeof Ionicons.glyphMap}
                size={15}
                color={active ? palette.white : palette.textSecondary}
              />
              <Text
                variant="label"
                color={active ? 'white' : 'textSecondary'}
                style={styles.label}
              >
                {cat.label}
              </Text>
            </View>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, gap: spacing.sm },
  chipWrap: { borderRadius: radii.pill },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 1,
    borderRadius: radii.pill,
  },
  chipActive: { backgroundColor: palette.primary },
  chipIdle: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  label: { marginLeft: 6 },
});
