import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, Divider, Text } from '@/components/common';
import { RootScreenProps } from '@/navigation/types';
import { palette, radii, spacing } from '@/theme';
import { USE_NATIVE_DRIVER } from '@/utils/animation';
import { formatCurrency } from '@/utils/format';

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Text variant="body" color="textSecondary">
        {label}
      </Text>
      <Text variant="bodyMedium">{value}</Text>
    </View>
  );
}

export function OrderSuccessScreen({ route, navigation }: RootScreenProps<'OrderSuccess'>) {
  const { order } = route.params;
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, useNativeDriver: USE_NATIVE_DRIVER, friction: 5, tension: 80 }),
      Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: USE_NATIVE_DRIVER }),
    ]).start();
  }, [scale, fade]);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <View style={styles.body}>
        <Animated.View style={[styles.check, { transform: [{ scale }] }]}>
          <Ionicons name="checkmark" size={44} color={palette.white} />
        </Animated.View>

        <Animated.View style={{ opacity: fade, width: '100%', alignItems: 'center' }}>
          <Text variant="h1" center style={styles.title}>
            Order confirmed!
          </Text>
          <Text variant="body" color="textSecondary" center style={styles.subtitle}>
            Your no-cost EMI is set up. Order ID {order.id}
          </Text>

          <Card style={styles.card}>
            <Text variant="title" numberOfLines={2}>
              {order.productName}
            </Text>
            {!!order.variantSummary && (
              <Text variant="bodySm" color="textSecondary" style={styles.variant}>
                {order.variantSummary}
              </Text>
            )}
            <Divider />
            <Line label="Amount" value={formatCurrency(order.unitPrice)} />
            <Line
              label="EMI plan"
              value={`${formatCurrency(order.monthlyAmount)}/mo × ${order.tenureMonths}`}
            />
            <Line label="First EMI on" value={order.firstEmiDate} />
            <Line label="MF lien-marked" value={formatCurrency(order.lienAmount)} />
          </Card>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Continue shopping"
          onPress={() => navigation.popToTop()}
          fullWidth
          leftIcon="storefront-outline"
        />
        <Button
          title="View EMI schedule"
          variant="secondary"
          onPress={() => navigation.navigate('Tabs', { screen: 'EMIDues' })}
          fullWidth
          style={styles.secondaryBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  check: {
    width: 92,
    height: 92,
    borderRadius: radii.pill,
    backgroundColor: palette.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { marginBottom: spacing.xs },
  subtitle: { maxWidth: 300, marginBottom: spacing.xl },
  card: { width: '100%' },
  variant: { marginTop: 2 },
  actions: { padding: spacing.xl },
  secondaryBtn: { marginTop: spacing.md },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
});
