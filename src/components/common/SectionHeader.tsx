import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { Text } from './Text';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

/** "1Fi Marketplace" / "Featured" style section heading with optional accessory. */
export function SectionHeader({ title, subtitle, right }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textCol}>
        <Text variant="h2">{title}</Text>
        {subtitle && (
          <Text variant="bodySm" color="textSecondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textCol: { flex: 1, marginRight: spacing.md },
  subtitle: { marginTop: 2 },
});
