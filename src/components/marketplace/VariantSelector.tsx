import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { palette, radii, spacing } from '@/theme';
import { VariantGroup } from '@/types';
import { readableOn } from '@/utils/color';
import { formatCurrency } from '@/utils/format';

interface VariantSelectorProps {
  groups: VariantGroup[];
  selections: Record<string, string>;
  onSelect: (groupId: string, valueId: string) => void;
}

/** Renders each variant group as colour swatches or selectable chips. */
export function VariantSelector({ groups, selections, onSelect }: VariantSelectorProps) {
  return (
    <View style={styles.container}>
      {groups.map((group) => {
        const selectedId = selections[group.id];
        const selectedValue = group.values.find((v) => v.id === selectedId);

        return (
          <View key={group.id} style={styles.group}>
            <View style={styles.groupHeader}>
              <Text variant="label" color="textSecondary">
                {group.name}
              </Text>
              {selectedValue && (
                <Text variant="label" color="text" style={styles.selectedLabel}>
                  {selectedValue.label}
                </Text>
              )}
            </View>

            {group.type === 'swatch' ? (
              <View style={styles.swatchRow}>
                {group.values.map((value) => {
                  const active = value.id === selectedId;
                  return (
                    <Pressable
                      key={value.id}
                      onPress={() => onSelect(group.id, value.id)}
                      style={[styles.swatchWrap, active && styles.swatchWrapActive]}
                      accessibilityRole="button"
                      accessibilityLabel={value.label}
                      accessibilityState={{ selected: active }}
                    >
                      <View style={[styles.swatch, { backgroundColor: value.swatch }]}>
                        {active && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color={readableOn(value.swatch ?? '#000')}
                          />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View style={styles.chipRow}>
                {group.values.map((value) => {
                  const active = value.id === selectedId;
                  const delta = value.priceDelta ?? 0;
                  return (
                    <Pressable
                      key={value.id}
                      onPress={() => onSelect(group.id, value.id)}
                      style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                    >
                      <Text variant="label" color={active ? 'primary' : 'text'}>
                        {value.label}
                      </Text>
                      {delta !== 0 && (
                        <Text variant="caption" color={active ? 'primary' : 'textTertiary'} style={styles.delta}>
                          {delta > 0 ? '+' : '−'}
                          {formatCurrency(Math.abs(delta))}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xl },
  group: {},
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  selectedLabel: {},
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  swatchWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.transparent,
  },
  swatchWrapActive: { borderColor: palette.primary },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderStrong,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  chipIdle: { borderColor: palette.border, backgroundColor: palette.surface },
  chipActive: { borderColor: palette.primary, backgroundColor: palette.primaryTint },
  delta: { marginTop: 2 },
});
