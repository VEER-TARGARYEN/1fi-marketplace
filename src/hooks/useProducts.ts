import { useQuery } from '@tanstack/react-query';
import {
  fetchFeaturedProducts,
  fetchProductById,
  fetchProducts,
} from '../services/api';
import { ProductQuery } from '../types';
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
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}

/** Featured rail on the marketplace home. */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.featured,
    queryFn: fetchFeaturedProducts,
  });
}
