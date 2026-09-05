import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { palette, radii, shadows, spacing } from '@/theme';

type IconPair = { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap };

const ICONS: Record<string, IconPair> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Shop: { active: 'storefront', inactive: 'storefront-outline' },
  EMIDues: { active: 'receipt', inactive: 'receipt-outline' },
  Limit: { active: 'stats-chart', inactive: 'stats-chart-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

const LABELS: Record<string, string> = {
  Home: 'Home',
  Shop: 'Shop',
  EMIDues: 'EMI Dues',
  Limit: 'Limit',
  Profile: 'Profile',
};

/**
 * Floating bottom navigation matching the existing 1Fi app: a rounded white bar
 * with a purple indicator + filled icon on the active tab.
 */
export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const icons = ICONS[route.name];
          const color = focused ? palette.primary : palette.textTertiary;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              style={styles.item}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={LABELS[route.name]}
            >
              <View style={[styles.indicator, focused && styles.indicatorActive]} />
              <Ionicons name={focused ? icons.active : icons.inactive} size={23} color={color} />
              <Text
                variant="caption"
                color={focused ? 'primary' : 'textTertiary'}
                weight={focused ? 'semibold' : 'medium'}
                style={styles.label}
              >
                {LABELS[route.name]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.transparent,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: palette.surface,
    borderRadius: radii.xxl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    ...shadows.lg,
  },
  item: { flex: 1, alignItems: 'center', paddingTop: 6 },
  indicator: {
    position: 'absolute',
    top: -spacing.sm,
    height: 3,
    width: 26,
    borderRadius: 2,
    backgroundColor: palette.transparent,
  },
  indicatorActive: { backgroundColor: palette.primary },
  label: { marginTop: 3 },
});
