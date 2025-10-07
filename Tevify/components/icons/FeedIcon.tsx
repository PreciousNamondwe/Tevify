import React from "react";
import Svg, { Rect } from "react-native-svg";

export function FeedIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Bottom big box */}
      <Rect
        x="4"
        y="12"
        width="16"
        height="8"
        stroke={color}
        strokeWidth={2}
        rx={2}
      />

      {/* Middle small box */}
      <Rect
        x="6"
        y="8"
        width="12"
        height="3"
        stroke={color}
        strokeWidth={2}
        rx={1}
      />

      {/* Top tiny box */}
      <Rect
        x="8"
        y="4"
        width="8"
        height="2"
        stroke={color}
        strokeWidth={2}
        rx={1}
      />
    </Svg>
  );
}
