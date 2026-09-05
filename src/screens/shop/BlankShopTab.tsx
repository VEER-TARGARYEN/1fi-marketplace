import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@/components/common';
import { palette, radii, spacing } from '@/theme';
import { BOTTOM_NAV_SPACE } from '@/utils/layout';
import { ShopHeader } from './ShopHeader';
import { ShopTabKey } from './shopTabs';

interface BlankShopTabProps {
  activeKey: ShopTabKey;
  onChangeTab: (key: ShopTabKey) => void;
  topInset: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

/**
 * Top Brands / Nearby Stores. Per the assignment these are intentionally left
 * unimplemented — shown here as a clean, on-brand placeholder rather than a
 * broken blank screen.
 */
export function BlankShopTab({
  activeKey,
  onChangeTab,
  topInset,
  icon,
  title,
  message,
}: BlankShopTabProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ShopHeader activeKey={activeKey} onChange={onChangeTab} topInset={topInset} />
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={30} color={palette.primary} />
        </View>
        <Text variant="h3" center style={styles.title}>
          {title}
        </Text>
        <Text variant="body" color="textSecondary" center style={styles.message}>
          {message}
        </Text>
        <View style={styles.hintPill}>
          <Ionicons name="arrow-up" size={14} color={palette.primary} />
          <Text variant="label" color="primary" style={styles.hintText}>
            Try 1Fi Marketplace
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: BOTTOM_NAV_SPACE, backgroundColor: palette.background, flexGrow: 1 },
  body: { alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.huge },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radii.pill,
    backgroundColor: palette.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { marginBottom: spacing.sm },
  message: { maxWidth: 300 },
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
