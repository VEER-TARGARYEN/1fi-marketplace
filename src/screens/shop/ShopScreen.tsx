import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { palette } from '@/theme';
import { BlankShopTab } from './BlankShopTab';
import { MarketplaceTab } from './MarketplaceTab';
import { ShopTabKey } from './shopTabs';

/**
 * The Shop page. Hosts the three segmented options — Top Brands, Nearby Stores
 * and the fully-built 1Fi Marketplace. Defaults to Marketplace so the feature
 * is front and centre.
 */
export function ShopScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<ShopTabKey>('marketplace');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {tab === 'marketplace' && (
        <MarketplaceTab activeKey={tab} onChangeTab={setTab} topInset={insets.top} />
      )}
      {tab === 'topBrands' && (
        <BlankShopTab
          activeKey={tab}
          onChangeTab={setTab}
          topInset={insets.top}
          icon="ribbon-outline"
          title="Top Brands"
          message="Curated no-cost EMI offers from top brands will appear here."
        />
      )}
      {tab === 'nearby' && (
        <BlankShopTab
          activeKey={tab}
          onChangeTab={setTab}
          topInset={insets.top}
          icon="location-outline"
          title="Nearby Stores"
          message="Partner stores near you will appear here."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
});
