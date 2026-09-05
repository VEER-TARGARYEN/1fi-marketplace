import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { palette, radii, spacing } from '@/theme';
import { BannerArt } from './BannerArt';

/**
 * The hero banner at the top of the Shop page — a faithful reproduction of the
 * existing 1Fi "Shop today, Pay later using Mutual funds" marketing card.
 */
export function ShopBanner({ topInset = 0 }: { topInset?: number }) {
  return (
    <View style={[styles.container, { paddingTop: topInset + spacing.md }]}>
      <LinearGradient
        colors={palette.bannerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.art, { top: topInset }]}>
        <BannerArt />
      </View>

      <View style={styles.content}>
        <View style={styles.pill}>
          <Ionicons name="sparkles" size={12} color={palette.white} />
          <Text variant="caption" color="white" style={styles.pillText}>
            NO-COST EMIs
          </Text>
        </View>

        <Text variant="display" color="white" style={styles.line}>
          Shop today,
        </Text>
        <Text variant="display" color="white" style={[styles.line, styles.italic]}>
          Pay later using
        </Text>
        <Text variant="display" color="white" style={styles.line}>
          Mutual funds.
        </Text>

        <Text variant="bodySm" color="white" style={styles.subtitle}>
          No credit score required. No interest.{'\n'}Backed by your investments.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge + spacing.md,
    borderBottomLeftRadius: radii.xxl + 6,
    borderBottomRightRadius: radii.xxl + 6,
    overflow: 'hidden',
  },
  art: { position: 'absolute', right: spacing.sm, pointerEvents: 'none' },
  content: { maxWidth: '74%' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    marginBottom: spacing.lg,
  },
  pillText: { marginLeft: 5, letterSpacing: 1 },
  line: { marginBottom: 0 },
  italic: { fontStyle: 'italic' },
  subtitle: { marginTop: spacing.md, opacity: 0.86, lineHeight: 19 },
});
