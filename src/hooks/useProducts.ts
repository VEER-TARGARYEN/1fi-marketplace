import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProductById, fetchProducts } from '../services/api';
import { Product, ProductQuery } from '../types';
import { queryKeys } from './queryKeys';

/** Product listing, reacting to category / search / sort. */
export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: queryKeys.products(query),
    queryFn: () => fetchProducts(query),
    placeholderData: (prev) => prev, // keep previous list visible while refetching
  });
}

/** Single product detail. */
export function useProduct(id: string) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    // Seed from a product already resident in any cached list so the detail
    // screen paints instantly instead of flashing a skeleton for data we have.
    initialData: () => {
      const lists = qc.getQueriesData<Product[]>({ queryKey: ['products', 'list'] });
      for (const [, data] of lists) {
        const hit = data?.find((p) => p.id === id);
        if (hit) return hit;
      }
      return undefined;
    },
    initialDataUpdatedAt: 0, // treat the seed as stale so it still revalidates
  });
}
