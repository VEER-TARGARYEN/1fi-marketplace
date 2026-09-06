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
 * Product visual: a soft accent-tinted panel showing a real product photo when
 * one is provided, over the branded DeviceGraphic. The graphic acts as the
 * placeholder while the photo loads and as the fallback if it fails — so the
 * app always shows something and never a broken image, online or offline.
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
  const [loaded, setLoaded] = useState(false);

  const uri = images && images.length > 0 ? images[0] : null;
  const showImage = !!uri && !failed;

  return (
    <View style={[styles.panel, style]}>
      <LinearGradient
        colors={[lighten(accentColor, 0.9), '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.inner, { padding }]}>
        {/* Branded graphic: placeholder while the photo loads, fallback on error. */}
        {(!showImage || !loaded) && (
          <DeviceGraphic type={deviceType} color={accentColor} idKey={idKey} />
        )}
        {showImage && (
          <Image
            source={{ uri }}
            resizeMode="contain"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            style={[
              styles.image,
              { top: padding, left: padding, right: padding, bottom: padding },
              { opacity: loaded ? 1 : 0 },
            ]}
            accessibilityIgnoresInvertColors
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { overflow: 'hidden', backgroundColor: '#FFFFFF' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  image: { position: 'absolute', width: undefined, height: undefined },
});
