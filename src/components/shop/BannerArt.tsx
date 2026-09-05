import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

/**
 * Lightweight decorative art for the Shop banner — a shopping bag with a few
 * floating device glyphs and sparkles, echoing the marketing hero without
 * shipping a heavy 3D asset.
 */
export function BannerArt({ width = 150, height = 190 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 190" fill="none">
      <Defs>
        <LinearGradient id="bag" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FBD36B" />
          <Stop offset="1" stopColor="#E8A02D" />
        </LinearGradient>
        <LinearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#B794F6" />
          <Stop offset="1" stopColor="#7C3AED" />
        </LinearGradient>
      </Defs>

      {/* floating device glyphs */}
      <G opacity="0.95">
        <Rect x="18" y="34" width="26" height="40" rx="6" fill="url(#screen)" transform="rotate(-14 31 54)" />
        <Rect x="70" y="14" width="46" height="30" rx="5" fill="url(#screen)" opacity="0.85" transform="rotate(10 93 29)" />
      </G>

      {/* shopping bag */}
      <Path d="M40 92 L110 92 L104 176 Q103 184 95 184 L55 184 Q47 184 46 176 Z" fill="url(#bag)" />
      <Path d="M40 92 L110 92 L108 108 L42 108 Z" fill="#FFFFFF" opacity="0.18" />
      <Path
        d="M60 92 V80 Q60 66 75 66 Q90 66 90 80 V92"
        stroke="#FFFFFF"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* sparkles */}
      {[
        [124, 70, 5],
        [30, 96, 4],
        [116, 132, 3.5],
        [126, 108, 3],
      ].map(([cx, cy, r], i) => (
        <Circle key={i} cx={cx} cy={cy} r={r} fill="#FFFFFF" opacity={0.9} />
      ))}
      <Path d="M132 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="#FBD36B" opacity="0.95" />
    </Svg>
  );
}
