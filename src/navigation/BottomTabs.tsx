import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { PlaceholderScreen } from '@/screens/PlaceholderScreen';
import { ShopScreen } from '@/screens/shop/ShopScreen';
import { BottomTabParamList } from './types';
import { CustomTabBar } from './CustomTabBar';

const Tab = createBottomTabNavigator<BottomTabParamList>();

/** Five-tab bottom navigation; only Shop is in scope for this assignment. */
export function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Shop"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={PlaceholderScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="EMIDues" component={PlaceholderScreen} />
      <Tab.Screen name="Limit" component={PlaceholderScreen} />
      <Tab.Screen name="Profile" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}
