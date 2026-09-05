import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { EmptyState, ErrorState, SearchBar, SectionHeader, Text } from '@/components/common';
import {
  CategoryChips,
  LimitStrip,
  ProductCard,
  ProductCardSkeleton,
  SortSheet,
  sortLabel,
} from '@/components/marketplace';
import { useCategories } from '@/hooks/useCategories';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useProducts } from '@/hooks/useProducts';
import { useUserLimit } from '@/hooks/useUserLimit';
import { ShopNavigationProp } from '@/navigation/types';
import { palette, radii, spacing } from '@/theme';
import { CategoryId, Product, SortKey } from '@/types';
import { BOTTOM_NAV_SPACE, getGridConfig, GRID_GAP, PAGE_PADDING } from '@/utils/layout';
import { ShopHeader } from './ShopHeader';
import { ShopTabKey } from './shopTabs';

interface MarketplaceTabProps {
  activeKey: ShopTabKey;
  onChangeTab: (key: ShopTabKey) => void;
  topInset: number;
}

type GridItem = Product | { skeleton: true; id: string };
const isSkeleton = (item: GridItem): item is { skeleton: true; id: string } =>
  'skeleton' in item;

/**
 * 1Fi Marketplace — browse products on mutual-fund-backed no-cost EMI.
 *
 * A single virtualised FlatList drives the whole tab: the banner + segmented
 * tabs, the limit strip, search, category filter and sort all live in the list
 * header, with the responsive product grid below. Loading, error, empty and
 * refreshing states are all handled.
 */
export function MarketplaceTab({ activeKey, onChangeTab, topInset }: MarketplaceTabProps) {
  const navigation = useNavigation<ShopNavigationProp>();
  const { width } = useWindowDimensions();
  const { columns, cardWidth } = getGridConfig(width);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('featured');
  const [sortVisible, setSortVisible] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 350);

  const productsQuery = useProducts({ category, search: debouncedSearch, sort });
  const categoriesQuery = useCategories();
  const limitQuery = useUserLimit();

  const products = productsQuery.data ?? [];
  const showSkeletons = productsQuery.isLoading;

  const listData: GridItem[] = useMemo(() => {
    if (showSkeletons) {
      return Array.from({ length: columns * 3 }, (_, i) => ({ skeleton: true as const, id: `sk-${i}` }));
    }
    return products;
  }, [showSkeletons, products, columns]);

  const goToProduct = useCallback(
    (product: Product) => navigation.navigate('ProductDetail', { productId: product.id }),
    [navigation],
  );

  const renderItem: ListRenderItem<GridItem> = useCallback(
    ({ item }) =>
      isSkeleton(item) ? (
        <ProductCardSkeleton style={{ width: cardWidth }} />
      ) : (
        <ProductCard product={item} onPress={goToProduct} style={{ width: cardWidth }} />
      ),
    [cardWidth, goToProduct],
  );

  const header = (
    <MarketplaceHeader
      activeKey={activeKey}
      onChangeTab={onChangeTab}
      topInset={topInset}
      search={search}
      onSearch={setSearch}
      categories={categoriesQuery.data ?? []}
      category={category}
      onCategory={setCategory}
      limit={limitQuery.data}
      limitLoading={limitQuery.isLoading}
      onOpenLimit={() => navigation.navigate('Limit')}
      count={products.length}
      showCount={!showSkeletons && !productsQuery.isError}
      sort={sort}
      onOpenSort={() => setSortVisible(true)}
    />
  );

  const empty = productsQuery.isError ? (
    <ErrorState
      title="Couldn’t load products"
      message={productsQuery.error?.message}
      onRetry={() => productsQuery.refetch()}
      retrying={productsQuery.isFetching}
    />
  ) : (
    <EmptyState
      icon="cube-outline"
      title="No products found"
      message="Try a different category or search term."
    />
  );

  return (
    <>
      <FlatList
        key={`grid-${columns}`}
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={productsQuery.isRefetching}
            onRefresh={() => productsQuery.refetch()}
            tintColor={palette.primary}
            colors={[palette.primary]}
          />
        }
      />
      <SortSheet
        visible={sortVisible}
        value={sort}
        onSelect={setSort}
        onClose={() => setSortVisible(false)}
      />
    </>
  );
}

// ─────────────────────────── Header ───────────────────────────
interface MarketplaceHeaderProps {
  activeKey: ShopTabKey;
  onChangeTab: (key: ShopTabKey) => void;
  topInset: number;
  search: string;
  onSearch: (text: string) => void;
  categories: import('@/types').Category[];
  category: CategoryId | 'all';
  onCategory: (id: CategoryId | 'all') => void;
  limit?: import('@/types').UserLimit;
  limitLoading: boolean;
  onOpenLimit: () => void;
  count: number;
  showCount: boolean;
  sort: SortKey;
  onOpenSort: () => void;
}

/**
 * Module-level component (not an inline function) so the FlatList header isn't
 * remounted on every keystroke — which would drop the search field's focus.
 */
function MarketplaceHeader({
  activeKey,
  onChangeTab,
  topInset,
  search,
  onSearch,
  categories,
  category,
  onCategory,
  limit,
  limitLoading,
  onOpenLimit,
  count,
  showCount,
  sort,
  onOpenSort,
}: MarketplaceHeaderProps) {
  return (
    <View style={styles.header}>
      <ShopHeader activeKey={activeKey} onChange={onChangeTab} topInset={topInset} />

      <View style={styles.gutter}>
        <SearchBar value={search} onChangeText={onSearch} style={styles.search} />
      </View>

      {categories.length > 0 && (
        <View style={styles.chips}>
          <CategoryChips categories={categories} selected={category} onSelect={onCategory} />
        </View>
      )}

      <View style={styles.gutter}>
        <LimitStrip limit={limit} loading={limitLoading} onPress={onOpenLimit} />

        <View style={styles.sectionRow}>
          <SectionHeader
            title="1Fi Marketplace"
            subtitle={
              showCount
                ? `${count} ${count === 1 ? 'product' : 'products'} · No-cost EMI on everything`
                : 'No-cost EMI on everything'
            }
            right={
              <Pressable
                onPress={onOpenSort}
                style={styles.sortBtn}
                accessibilityRole="button"
                accessibilityLabel={`Sort by ${sortLabel(sort)}`}
              >
                <Ionicons name="swap-vertical" size={15} color={palette.primary} />
                <Text variant="label" color="primary" style={styles.sortLabel} numberOfLines={1}>
                  {sortLabel(sort)}
                </Text>
              </Pressable>
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: BOTTOM_NAV_SPACE, backgroundColor: palette.background },
  row: { gap: GRID_GAP, paddingHorizontal: PAGE_PADDING, marginBottom: GRID_GAP },
  header: { paddingBottom: spacing.md },
  gutter: { paddingHorizontal: PAGE_PADDING },
  search: { marginTop: spacing.lg },
  chips: { marginTop: spacing.lg },
  sectionRow: { marginTop: spacing.xxl },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.primaryTint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    maxWidth: 150,
  },
  sortLabel: { marginLeft: 5 },
});
