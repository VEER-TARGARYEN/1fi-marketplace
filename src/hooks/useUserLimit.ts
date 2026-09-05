import { useQuery } from '@tanstack/react-query';
import { fetchUserLimit } from '../services/api';
import { queryKeys } from './queryKeys';

/** The user's mutual-fund-backed 1Fi limit — powers every EMI in the app. */
export function useUserLimit() {
  return useQuery({
    queryKey: queryKeys.userLimit,
    queryFn: fetchUserLimit,
    staleTime: 5 * 60 * 1000,
  });
}
