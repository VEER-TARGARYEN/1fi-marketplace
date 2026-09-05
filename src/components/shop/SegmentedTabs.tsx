import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { palette, radii, shadows, spacing } from '@/theme';
import { USE_NATIVE_DRIVER } from '@/utils/animation';

export interface SegmentTab<K extends string> {
  key: K;
  label: string;
}

interface SegmentedTabsProps<K extends string> {
  tabs: SegmentTab<K>[];
  activeKey: K;
  onChange: (key: K) => void;
}

/**
 * Pill segmented control matching the existing Shop tabs. A white "thumb"
 * animates between segments; the active label turns purple with an underline.
 */
export function SegmentedTabs<K extends string>({
  tabs,
  activeKey,
  onChange,
}: SegmentedTabsProps<K>) {
  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const positioned = useRef(false);

  const activeIndex = Math.max(0, tabs.findIndex((t) => t.key === activeKey));
  // Track width includes the container's 4px padding on each side; the thumb and
  // segments live inside that padding.
  const segmentWidth = trackWidth > 0 ? (trackWidth - 8) / tabs.length : 0;

  useEffect(() => {
    if (segmentWidth <= 0) return;
    const target = activeIndex * segmentWidth;
    if (!positioned.current) {
      // Snap to the correct position on first measure (no start-from-zero slide).
      translateX.setValue(target);
      positioned.current = true;
    } else {
      Animated.spring(translateX, {
        toValue: target,
        useNativeDriver: USE_NATIVE_DRIVER,
        speed: 20,
        bounciness: 4,
      }).start();
    }
  }, [activeIndex, segmentWidth, translateX]);

  const onLayout = (e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.container} onLayout={onLayout}>
      {segmentWidth > 0 && (
        <Animated.View
          style={[
            styles.thumb,
            { width: segmentWidth, transform: [{ translateX }] },
          ]}
        />
      )}
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <Pressable
            key={tab.key}
            style={styles.segment}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              variant="label"
              color={active ? 'primary' : 'textSecondary'}
              weight={active ? 'semibold' : 'medium'}
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.label}
            >
              {tab.label}
            </Text>
            <View style={[styles.underline, active && styles.underlineActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: palette.primaryTintStrong,
    borderRadius: radii.pill,
    padding: 4,
    height: 54,
  },
  thumb: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    backgroundColor: palette.surface,
    borderRadius: radii.pill,
    ...shadows.sm,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  label: { textAlign: 'center' },
  underline: {
    height: 2,
    width: 18,
    borderRadius: 1,
    marginTop: 3,
    backgroundColor: palette.transparent,
  },
  underlineActive: { backgroundColor: palette.primary },
});
