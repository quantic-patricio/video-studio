import React from "react";
import { colors } from "./theme";

const PHONE_WIDTH = 320;
const PHONE_HEIGHT = 640;
const BEZEL = 12;
const OUTER_RADIUS = 44;
const INNER_RADIUS = 32;
const NOTCH_WIDTH = 100;
const NOTCH_HEIGHT = 24;
const NOTCH_RADIUS = 12;

export interface PhoneMockupProps {
  children?: React.ReactNode;
  scale?: number;
  style?: React.CSSProperties;
  showNotch?: boolean;
  bezelColor?: string;
  screenColor?: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  scale = 1,
  style,
  showNotch = true,
  bezelColor = colors.bgSubtle,
  screenColor = colors.bgBase,
}) => {
  const screenWidth = PHONE_WIDTH - BEZEL * 2;
  const screenHeight = PHONE_HEIGHT - BEZEL * 2;

  return (
    <div
      style={{
        width: PHONE_WIDTH,
        height: PHONE_HEIGHT,
        borderRadius: OUTER_RADIUS,
        backgroundColor: bezelColor,
        position: "relative",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        boxShadow: `0 0 60px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1)`,
        ...style,
      }}
    >
      {/* Screen */}
      <div
        style={{
          position: "absolute",
          top: BEZEL,
          left: BEZEL,
          width: screenWidth,
          height: screenHeight,
          borderRadius: INNER_RADIUS,
          backgroundColor: screenColor,
          overflow: "hidden",
        }}
      >
        {children}
      </div>

      {/* Notch */}
      {showNotch && (
        <div
          style={{
            position: "absolute",
            top: BEZEL - 1,
            left: (PHONE_WIDTH - NOTCH_WIDTH) / 2,
            width: NOTCH_WIDTH,
            height: NOTCH_HEIGHT,
            borderRadius: `0 0 ${NOTCH_RADIUS}px ${NOTCH_RADIUS}px`,
            backgroundColor: bezelColor,
            zIndex: 10,
          }}
        />
      )}

      {/* Side button (power) */}
      <div
        style={{
          position: "absolute",
          right: -3,
          top: 140,
          width: 3,
          height: 48,
          borderRadius: "0 2px 2px 0",
          backgroundColor: colors.bgSubtle,
        }}
      />

      {/* Volume buttons */}
      <div
        style={{
          position: "absolute",
          left: -3,
          top: 120,
          width: 3,
          height: 32,
          borderRadius: "2px 0 0 2px",
          backgroundColor: colors.bgSubtle,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -3,
          top: 165,
          width: 3,
          height: 32,
          borderRadius: "2px 0 0 2px",
          backgroundColor: colors.bgSubtle,
        }}
      />
    </div>
  );
};

export const PHONE_DIMENSIONS = {
  width: PHONE_WIDTH,
  height: PHONE_HEIGHT,
  screenWidth: PHONE_WIDTH - BEZEL * 2,
  screenHeight: PHONE_HEIGHT - BEZEL * 2,
  bezel: BEZEL,
  outerRadius: OUTER_RADIUS,
  innerRadius: INNER_RADIUS,
} as const;
