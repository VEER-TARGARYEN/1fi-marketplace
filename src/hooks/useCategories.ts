import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../services/api';
import { queryKeys } from './queryKeys';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
    staleTime: Infinity, // categories rarely change
  });
}
