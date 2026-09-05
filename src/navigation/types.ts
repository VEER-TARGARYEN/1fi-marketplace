import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Order } from '@/types';

/** Params passed from Product Detail into Checkout. */
export interface CheckoutParams {
  productId: string;
  variantSelections: Record<string, string>;
  variantSummary: string;
  tenureMonths: number;
  unitPrice: number;
  monthlyAmount: number;
}

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabParamList>;
  ProductDetail: { productId: string };
  Checkout: CheckoutParams;
  OrderSuccess: { order: Order };
};

export type BottomTabParamList = {
  Home: undefined;
  Shop: undefined;
  EMIDues: undefined;
  Limit: undefined;
  Profile: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

/**
 * Navigation available from inside the Shop tab: it can switch sibling tabs
 * (Limit, etc.) AND push root-stack screens (ProductDetail, Checkout).
 */
export type ShopNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Shop'>,
  NativeStackNavigationProp<RootStackParamList>
>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
