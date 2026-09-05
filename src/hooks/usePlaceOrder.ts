import { useMutation, useQueryClient } from '@tanstack/react-query';
import { placeOrder } from '../services/api';
import { Order, OrderRequest } from '../types';
import { queryKeys } from './queryKeys';

/**
 * Places a no-cost EMI order. On success we invalidate the user's limit so the
 * available headroom reflects the new lien (as it would after a real purchase).
 */
export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation<Order, Error, OrderRequest>({
    mutationFn: placeOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.userLimit });
    },
  });
}
