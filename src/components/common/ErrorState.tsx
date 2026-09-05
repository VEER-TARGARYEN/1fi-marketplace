import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette, radii, spacing } from '@/theme';
import { Button } from './Button';
import { Text } from './Text';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
}

/** Friendly full-width error with a retry action — used by every data view. */
export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn’t load this right now. Please try again.',
  onRetry,
  retrying,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="cloud-offline-outline" size={30} color={palette.danger} />
      </View>
      <Text variant="h3" center style={styles.title}>
        {title}
      </Text>
      <Text variant="body" color="textSecondary" center style={styles.message}>
        {message}
      </Text>
      {onRetry && (
        <Button
          title="Try again"
          variant="secondary"
          size="sm"
          leftIcon="refresh"
          loading={retrying}
          onPress={onRetry}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.huge, paddingHorizontal: spacing.xl },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radii.pill,
    backgroundColor: palette.dangerTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { marginBottom: spacing.xs },
  message: { maxWidth: 280 },
  button: { marginTop: spacing.xl, minWidth: 160 },
});
