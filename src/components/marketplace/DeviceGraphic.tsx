import React from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { DeviceGraphicType } from '@/types';
import { darken, lighten } from '@/utils/color';

interface DeviceGraphicProps {
  type: DeviceGraphicType;
  color: string;
  /** Unique-ish suffix so multiple gradients on one screen don't collide. */
  idKey: string;
}

/**
 * A crisp, brand-tinted vector illustration of a device. Used as the product
 * image so the app is self-contained (no remote image dependency) while still
 * looking designed. The body picks up each product's accent color; screens use
 * a consistent glass gradient.
 */
export function DeviceGraphic({ type, color, idKey }: DeviceGraphicProps) {
  const bodyId = `body-${idKey}`;
  const glassId = `glass-${idKey}`;
  const stroke = darken(color, 0.28);

  return (
    <Svg width="100%" height="100%" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">
      <Defs>
        <LinearGradient id={bodyId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={lighten(color, 0.22)} />
          <Stop offset="1" stopColor={darken(color, 0.14)} />
        </LinearGradient>
        <LinearGradient id={glassId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3A3F4C" />
          <Stop offset="0.55" stopColor="#1B1E27" />
          <Stop offset="1" stopColor="#0E1016" />
        </LinearGradient>
      </Defs>
      {/* soft ground shadow */}
      <Ellipse cx="60" cy="108" rx="30" ry="4.5" fill="rgba(20,19,25,0.10)" />
      {renderDevice(type, bodyId, glassId, stroke, color)}
    </Svg>
  );
}

function renderDevice(
  type: DeviceGraphicType,
  body: string,
  glass: string,
  stroke: string,
  color: string,
): React.ReactNode {
  const bodyFill = `url(#${body})`;
  const glassFill = `url(#${glass})`;

  switch (type) {
    case 'phone':
      return (
        <G>
          <Rect x="42" y="18" width="36" height="84" rx="10" fill={bodyFill} stroke={stroke} strokeWidth="1" />
          <Rect x="45.5" y="22" width="29" height="72" rx="6.5" fill={glassFill} />
          <Circle cx="60" cy="26" r="1.4" fill="#5B6070" />
          <Rect x="40" y="40" width="2" height="12" rx="1" fill={stroke} />
        </G>
      );
    case 'tablet':
      return (
        <G>
          <Rect x="33" y="16" width="54" height="88" rx="9" fill={bodyFill} stroke={stroke} strokeWidth="1" />
          <Rect x="37.5" y="21" width="45" height="78" rx="5" fill={glassFill} />
          <Circle cx="60" cy="18.5" r="1.2" fill="#5B6070" />
        </G>
      );
    case 'laptop':
      return (
        <G>
          <Rect x="28" y="26" width="64" height="42" rx="4" fill={bodyFill} stroke={stroke} strokeWidth="1" />
          <Rect x="31.5" y="29.5" width="57" height="35" rx="2" fill={glassFill} />
          <Path d="M20 70 L100 70 L94 82 L26 82 Z" fill={lighten(color, 0.05)} stroke={stroke} strokeWidth="1" />
          <Rect x="50" y="72.5" width="20" height="2.4" rx="1.2" fill={darken(color, 0.2)} />
        </G>
      );
    case 'earbuds':
      return (
        <G>
          {[46, 74].map((cx, i) => (
            <G key={i}>
              <Ellipse cx={cx} cy="36" rx="8" ry="9" fill={bodyFill} stroke={stroke} strokeWidth="1" />
              <Rect x={cx - 2.6} y="42" width="5.2" height="26" rx="2.6" fill={bodyFill} stroke={stroke} strokeWidth="1" />
              <Circle cx={cx} cy="35" r="3" fill={glassFill} />
            </G>
          ))}
        </G>
      );
    case 'headphones':
      return (
        <G>
          <Path d="M26 66 C26 28 94 28 94 66" fill="none" stroke={bodyFill} strokeWidth="8" strokeLinecap="round" />
          <Rect x="20" y="58" width="17" height="30" rx="8" fill={bodyFill} stroke={stroke} strokeWidth="1" />
          <Rect x="83" y="58" width="17" height="30" rx="8" fill={bodyFill} stroke={stroke} strokeWidth="1" />
          <Rect x="24" y="63" width="9" height="20" rx="4.5" fill={darken(color, 0.25)} />
          <Rect x="87" y="63" width="9" height="20" rx="4.5" fill={darken(color, 0.25)} />
        </G>
      );
    case 'watch':
      return (
        <G>
          <Rect x="49" y="14" width="22" height="22" rx="7" fill={darken(color, 0.06)} />
          <Rect x="49" y="84" width="22" height="22" rx="7" fill={darken(color, 0.06)} />
          <Rect x="42" y="33" width="36" height="54" rx="14" fill={bodyFill} stroke={stroke} strokeWidth="1" />
          <Rect x="46.5" y="38" width="27" height="44" rx="10" fill={glassFill} />
          <Rect x="78" y="52" width="4" height="9" rx="2" fill={darken(color, 0.2)} />
        </G>
      );
    case 'tv':
      return (
        <G>
          <Rect x="18" y="24" width="84" height="54" rx="5" fill={bodyFill} stroke={stroke} strokeWidth="1" />
          <Rect x="21.5" y="27.5" width="77" height="47" rx="3" fill={glassFill} />
          <Rect x="56" y="78" width="8" height="9" fill={darken(color, 0.1)} />
          <Rect x="42" y="86" width="36" height="4" rx="2" fill={darken(color, 0.12)} />
        </G>
      );
    case 'console':
      return (
        <G>
          <Rect x="43" y="16" width="15" height="88" rx="5" fill={lighten(color, 0.72)} stroke={stroke} strokeWidth="0.8" />
          <Rect x="62" y="16" width="15" height="88" rx="5" fill={lighten(color, 0.72)} stroke={stroke} strokeWidth="0.8" />
          <Rect x="56" y="16" width="8" height="88" fill={darken(color, 0.35)} />
          <Rect x="59" y="24" width="2" height="30" rx="1" fill="#3B82F6" />
        </G>
      );
    case 'camera':
      return (
        <G>
          <Rect x="38" y="30" width="26" height="10" rx="3" fill={darken(color, 0.12)} />
          <Rect x="26" y="38" width="68" height="46" rx="9" fill={bodyFill} stroke={stroke} strokeWidth="1" />
          <Circle cx="60" cy="62" r="18" fill={darken(color, 0.2)} stroke={stroke} strokeWidth="1" />
          <Circle cx="60" cy="62" r="11" fill={glassFill} />
          <Circle cx="55" cy="57" r="3.2" fill="rgba(255,255,255,0.5)" />
          <Circle cx="34" cy="34" r="2.6" fill={darken(color, 0.25)} />
        </G>
      );
    default:
      return null;
  }
}
