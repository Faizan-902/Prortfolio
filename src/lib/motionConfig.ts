export type MotionMode = "desktop-pinned" | "compact" | "reduced";

export type CurtainState = {
  leftXPercent: number;
  rightXPercent: number;
  stageScale: number;
  stageOpacity: number;
};

const DESKTOP_MIN_WIDTH = 901;
const CURTAIN_END_PROGRESS = 0.72;
const PILL_MARGIN_X = 56;
const PILL_MARGIN_Y = 28;

/** Clamp a numeric value cleanly inside [min, max]. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Determine layout choreography mode for viewport width and motion preference. */
export function resolveMotionMode(
  viewportWidth: number,
  reducedMotion: boolean,
): MotionMode {
  if (reducedMotion) return "reduced";
  return viewportWidth >= DESKTOP_MIN_WIDTH ? "desktop-pinned" : "compact";
}

/**
 * Compute compositor transform targets for the split-curtain Bento reveal.
 * Curtains complete opening at 72% runway progress so visitors get a quiet settle zone.
 */
export function computeCurtainState(progress: number): CurtainState {
  const normalized = clamp(progress / CURTAIN_END_PROGRESS, 0, 1);
  return {
    leftXPercent: normalized === 0 ? 0 : -102 * normalized,
    rightXPercent: 102 * normalized,
    stageScale: 0.88 + 0.12 * normalized,
    stageOpacity: 0.25 + 0.75 * normalized,
  };
}

/** Keep the hovered project artwork pill cleanly padded inside container bounds. */
export function clampArtworkPill(
  nx: number,
  ny: number,
  width: number,
  height: number,
): { x: number; y: number } {
  const maxX = Math.max(PILL_MARGIN_X, width - PILL_MARGIN_X);
  const maxY = Math.max(PILL_MARGIN_Y, height - PILL_MARGIN_Y);
  return {
    x: Math.round(clamp(nx * width, PILL_MARGIN_X, maxX)),
    y: Math.round(clamp(ny * height, PILL_MARGIN_Y, maxY)),
  };
}

/**
 * Interpolate numeric stat display strings cleanly while preserving prefix/suffix,
 * zero padding, and decimal precision (returns exact target at progress === 1).
 */
export function formatStatCounterValue(
  progress: number,
  targetText: string,
  startValue = 0,
): string {
  const t = clamp(progress, 0, 1);
  if (t === 1) return targetText;

  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(targetText.trim());
  if (!match) return targetText;

  const [, numStr, suffix] = match;
  const targetNum = Number(numStr);
  const current = startValue + (targetNum - startValue) * t;
  const dotIndex = numStr.indexOf(".");

  if (dotIndex >= 0) {
    const decimals = numStr.length - dotIndex - 1;
    return `${current.toFixed(decimals)}${suffix}`;
  }

  const rounded = Math.round(current);
  const padded =
    numStr.length > 1 && numStr.startsWith("0")
      ? String(rounded).padStart(numStr.length, "0")
      : String(rounded);
  return `${padded}${suffix}`;
}
