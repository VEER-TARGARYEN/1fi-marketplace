import { UserLimit } from '../types';

/**
 * Mock signed-in user's 1Fi limit — the mutual-fund-backed purchase power that
 * powers every no-cost EMI. In the real app this comes from the pledged MF
 * portfolio (value × LTV) and is surfaced on the "Limit" tab. Here it seeds the
 * Marketplace so plans can be checked against real available headroom.
 */
export const MOCK_USER_LIMIT: UserLimit = {
  totalLimit: 500000,
  availableLimit: 423500,
  usedLimit: 76500,
  pledgedValue: 1000000, // ₹10L of mutual funds pledged
  ltv: 0.5, // 50% loan-to-value
  currency: 'INR',
};
