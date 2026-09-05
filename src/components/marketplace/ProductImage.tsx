import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { DeviceGraphicType } from '@/types';
import { lighten } from '@/utils/color';
import { DeviceGraphic } from './DeviceGraphic';

interface ProductImageProps {
  accentColor: string;
  deviceType: DeviceGraphicType;
  images?: string[];
  idKey: string;
  /** Inner padding around the graphic/image. */
  padding?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Product visual: a soft accent-tinted panel hosting either a real product
 * image (when a URL is provided) or the branded DeviceGraphic fallback. If a
 * remote image fails to load, it gracefully falls back to the vector graphic —
 * the app never shows a broken image.
 */
export function ProductImage({
  accentColor,
  deviceType,
  images,
  idKey,
  padding = 14,
  style,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const hasRemote = !!images && images.length > 0 && !failed;

  return (
    <View style={[styles.panel, style]}>
      <LinearGradient
        colors={[lighten(accentColor, 0.9), '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.inner, { padding }]}>
        {hasRemote ? (
          <Image
            source={{ uri: images![0] }}
            resizeMode="contain"
            onError={() => setFailed(true)}
            style={styles.image}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <DeviceGraphic type={deviceType} color={accentColor} idKey={idKey} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { overflow: 'hidden', backgroundColor: '#FFFFFF' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
});
