import React from "react";
import Svg, { Path } from "react-native-svg";

export function LibraryIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Left thin bar */}
      <Path
        d="M6 4v16"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Middle thin bar */}
      <Path
        d="M10 4v16"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Right angled/thicker bar like a book */}
      <Path
        d="M14 4l4 1v15l-4-1V4z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
