import { interpolate, useCurrentFrame } from "remotion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

type CipherTextProps = {
  text: string;
  progress: number;
  style?: React.CSSProperties;
  scrambleSpeed?: number;
};

export const CipherText: React.FC<CipherTextProps> = ({
  text,
  progress,
  style,
  scrambleSpeed = 3,
}) => {
  const frame = useCurrentFrame();
  const clampedProgress = Math.max(0, Math.min(1, progress));

  const chars = text.split("").map((char, i) => {
    if (char === " ") return " ";

    const revealThreshold = i / text.length;
    if (clampedProgress >= revealThreshold + 1 / text.length) {
      return char;
    }

    const cycleFrame = Math.floor(frame / scrambleSpeed);
    const seed = cycleFrame * text.length + i;
    const randomChar = CHARS[Math.floor(seededRandom(seed) * CHARS.length)];
    return randomChar;
  });

  return <span style={style}>{chars.join("")}</span>;
};

type CipherTextAnimatedProps = {
  text: string;
  startFrame: number;
  durationFrames: number;
  style?: React.CSSProperties;
  scrambleSpeed?: number;
  mode?: "reveal" | "scramble";
};

export const CipherTextAnimated: React.FC<CipherTextAnimatedProps> = ({
  text,
  startFrame,
  durationFrames,
  style,
  scrambleSpeed = 3,
  mode = "reveal",
}) => {
  const frame = useCurrentFrame();
  const rawProgress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const progress = mode === "scramble" ? 1 - rawProgress : rawProgress;

  return (
    <CipherText
      text={text}
      progress={progress}
      style={style}
      scrambleSpeed={scrambleSpeed}
    />
  );
};
