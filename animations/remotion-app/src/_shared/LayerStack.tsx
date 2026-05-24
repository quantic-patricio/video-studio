import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import {
  CpuIcon,
  DesktopIcon,
  LockKeyIcon,
  WifiHighIcon,
  CloudIcon,
  BrainIcon,
} from "@phosphor-icons/react";
import { colors, fonts } from "./theme";

const EASING_ENTER = Easing.bezier(0.16, 1, 0.3, 1);

export type LayerId =
  | "hardware"
  | "os"
  | "app"
  | "radio"
  | "infra"
  | "ia";

interface LayerDef {
  id: LayerId;
  label: string;
  icon: React.ElementType;
  color: string;
}

const LAYERS: LayerDef[] = [
  { id: "ia", label: "IA", icon: BrainIcon, color: colors.accentCool },
  { id: "infra", label: "Infraestructura", icon: CloudIcon, color: colors.accentCool },
  { id: "radio", label: "Radio / Aire", icon: WifiHighIcon, color: colors.accentCool },
  { id: "app", label: "Aplicación", icon: LockKeyIcon, color: colors.accentWarm },
  { id: "os", label: "Sistema Operativo", icon: DesktopIcon, color: colors.accentCool },
  { id: "hardware", label: "Hardware", icon: CpuIcon, color: colors.accentWarm },
];

export interface LayerStackProps {
  revealedLayers?: LayerId[];
  highlightLayer?: LayerId;
  visibleLayers?: LayerId[];
  showLabels?: boolean;
  animateReveal?: boolean;
  revealStartFrame?: number;
  revealStagger?: number;
  scale?: number;
  style?: React.CSSProperties;
}

export const LayerStack: React.FC<LayerStackProps> = ({
  revealedLayers = [],
  highlightLayer,
  visibleLayers,
  showLabels = true,
  animateReveal = false,
  revealStartFrame = 0,
  revealStagger = 8,
  scale = 1,
  style,
}) => {
  const frame = useCurrentFrame();

  const layersToRender = visibleLayers
    ? LAYERS.filter((l) => visibleLayers.indexOf(l.id) !== -1)
    : LAYERS;

  const layerHeight = 48 * scale;
  const layerWidth = 280 * scale;
  const gap = 6 * scale;
  const iconSize = 20 * scale;
  const fontSize = 14 * scale;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        ...style,
      }}
    >
      {layersToRender.map((layer, i) => {
        const isRevealed = revealedLayers.indexOf(layer.id) !== -1;
        const isHighlighted = highlightLayer === layer.id;

        let entryOpacity = 1;
        let entryY = 0;

        if (animateReveal) {
          const layerFrame = revealStartFrame + i * revealStagger;
          entryOpacity = interpolate(
            frame,
            [layerFrame, layerFrame + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING_ENTER }
          );
          entryY = interpolate(
            frame,
            [layerFrame, layerFrame + 20],
            [15, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING_ENTER }
          );
        }

        const bgColor = isRevealed
          ? `${layer.color}22`
          : isHighlighted
            ? `${layer.color}15`
            : colors.bgElevated;

        const borderColor = isRevealed
          ? `${layer.color}55`
          : isHighlighted
            ? `${layer.color}33`
            : colors.border;

        const labelColor = isRevealed
          ? layer.color
          : isHighlighted
            ? colors.fgPrimary
            : colors.fgMuted;

        const glowIntensity = isHighlighted ? 0.2 : isRevealed ? 0.1 : 0;

        return (
          <div
            key={layer.id}
            style={{
              width: layerWidth,
              height: layerHeight,
              borderRadius: 8 * scale,
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
              display: "flex",
              alignItems: "center",
              gap: 10 * scale,
              paddingLeft: 14 * scale,
              paddingRight: 14 * scale,
              opacity: entryOpacity,
              transform: `translateY(${entryY}px)`,
              boxShadow: glowIntensity > 0
                ? `0 0 ${20 * scale}px ${layer.color}${("0" + Math.round(glowIntensity * 255).toString(16)).slice(-2)}`
                : "none",
              transition: "none",
            }}
          >
            <layer.icon
              size={iconSize}
              weight={isRevealed || isHighlighted ? "fill" : "regular"}
              color={labelColor}
            />
            {showLabels && (
              <span
                style={{
                  fontFamily: fonts.body,
                  fontSize,
                  fontWeight: isRevealed || isHighlighted ? 600 : 400,
                  color: labelColor,
                  letterSpacing: 0.5,
                }}
              >
                {layer.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const LAYER_ORDER: LayerId[] = [
  "hardware",
  "os",
  "app",
  "radio",
  "infra",
  "ia",
];
