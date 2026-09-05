import React, { useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { USE_NATIVE_DRIVER } from '@/utils/animation';

interface PressableScaleProps extends PressableProps {
  /** Scale to animate to while pressed. */
  activeScale?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pressable with a spring press-in scale — the subtle tactile feedback used on
 * every card and button in the app. Built on the core Animated API so it works
 * identically on iOS, Android and web with no extra native deps.
 */
export function PressableScale({
  activeScale = 0.97,
  style,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: USE_NATIVE_DRIVER,
      speed: 40,
      bounciness: 6,
    }).start();

  const handlePressIn = (e: GestureResponderEvent) => {
    animateTo(activeScale);
    onPressIn?.(e);
  };
  const handlePressOut = (e: GestureResponderEvent) => {
    animateTo(1);
    onPressOut?.(e);
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={fill}
        {...rest}
      >
        {children as React.ReactNode}
      </Pressable>
    </Animated.View>
  );
}

// Fill the animated (sized) wrapper so callers' width/height/padding on `style`
// govern layout while the Pressable captures touches across the whole area.
const fill: ViewStyle = { flex: 1, width: '100%' };
