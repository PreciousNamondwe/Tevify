import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

export function PlaylistIcon({ color, size }: { color: string; size: number }) {
  return (
     <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Plus sign */}
      <Path
        d="M12 6v12M6 12h12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
