import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { palette, radii, spacing } from '@/theme';

const CONTENT: Record<string, { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string }> = {
  Home: {
    icon: 'home-outline',
    title: 'Home',
    subtitle: 'Your 1Fi dashboard lives here. This assignment focuses on the Shop tab.',
  },
  EMIDues: {
    icon: 'receipt-outline',
    title: 'EMI Dues',
    subtitle: 'Track and pay your no-cost EMIs here. Out of scope for this assignment.',
  },
  Limit: {
    icon: 'stats-chart-outline',
    title: '1Fi Limit',
    subtitle: 'Your mutual-fund-backed purchase limit is managed here.',
  },
  Profile: {
    icon: 'person-outline',
    title: 'Profile',
    subtitle: 'Account, KYC and pledged funds. Out of scope for this assignment.',
  },
};

/** Generic branded placeholder for tabs outside the assignment scope. */
export function PlaceholderScreen() {
  const route = useRoute();
  const content = CONTENT[route.name] ?? CONTENT.Home;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <Ionicons name={content.icon} size={34} color={palette.primary} />
        </View>
        <Text variant="h2" center style={styles.title}>
          {content.title}
        </Text>
        <Text variant="body" color="textSecondary" center style={styles.subtitle}>
          {content.subtitle}
        </Text>
        <View style={styles.hintPill}>
          <Ionicons name="arrow-down" size={14} color={palette.primary} />
          <Text variant="label" color="primary" style={styles.hintText}>
            Open the Shop tab
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: radii.pill,
    backgroundColor: palette.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { marginBottom: spacing.sm },
  subtitle: { maxWidth: 300 },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxl,
    backgroundColor: palette.primaryTint,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  hintText: { marginLeft: 6 },
});
