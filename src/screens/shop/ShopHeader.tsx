import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SegmentedTabs, ShopBanner } from '@/components/shop';
import { spacing } from '@/theme';
import { SHOP_TABS, ShopTabKey } from './shopTabs';

interface ShopHeaderProps {
  activeKey: ShopTabKey;
  onChange: (key: ShopTabKey) => void;
  topInset: number;
}

/**
 * Shared top of the Shop page: the marketing banner plus the segmented tab
 * control that floats over the banner's rounded bottom edge. Rendered as the
 * scroll header of each tab so the banner scrolls naturally with content.
 */
export function ShopHeader({ activeKey, onChange, topInset }: ShopHeaderProps) {
  return (
    <View>
      <ShopBanner topInset={topInset} />
      <View style={styles.tabsWrap}>
        <SegmentedTabs tabs={SHOP_TABS} activeKey={activeKey} onChange={onChange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsWrap: {
    paddingHorizontal: spacing.xl,
    marginTop: -34,
  },
});
