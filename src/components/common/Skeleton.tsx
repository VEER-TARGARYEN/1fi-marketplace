import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import { palette, radii } from '@/theme';
import { USE_NATIVE_DRIVER } from '@/utils/animation';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Shimmering placeholder block for loading states. A gradient highlight sweeps
 * across the block on a loop, giving the app a polished "content is coming"
 * feel instead of a blank flash.
 */
export function Skeleton({ width = '100%', height = 16, radius = radii.sm, style }: SkeletonProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const [blockWidth, setBlockWidth] = useState(0);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-blockWidth, blockWidth],
  });

  return (
    <View
      onLayout={(e) => setBlockWidth(e.nativeEvent.layout.width)}
      style={[
        styles.base,
        { width, height, borderRadius: radius },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={[palette.skeleton, palette.skeletonHighlight, palette.skeleton]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: palette.skeleton,
    overflow: 'hidden',
  },
});
