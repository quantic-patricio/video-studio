import type React from "react";

export interface ComponentEntry {
  id: string;
  name: string;
  description: string;
  path: string;
  component: React.FC;
  durationInFrames: number;
  props?: Record<string, string>;
}

export const componentRegistry: ComponentEntry[] = [
  // Components are added here as they are created in _shared/.
  // Each entry maps to a component that can be previewed in the showcase.
  //
  // Example:
  // {
  //   id: "glow-blob",
  //   name: "GlowBlob",
  //   description: "Ambient glow sphere with pulse animation",
  //   path: "_shared/GlowBlob.tsx",
  //   component: GlowBlobPreview,
  //   durationInFrames: 120,
  //   props: { color: "string", size: "number", x: "string", y: "string" },
  // },
];
