import assert from "node:assert/strict";
import test from "node:test";
import {
  clampArtworkPill,
  computeCurtainState,
  formatStatCounterValue,
  resolveMotionMode,
} from "../src/lib/motionConfig.ts";

test("resolveMotionMode returns reduced when reducedMotion is true regardless of width", () => {
  assert.equal(resolveMotionMode(1440, true), "reduced");
  assert.equal(resolveMotionMode(360, true), "reduced");
});

test("resolveMotionMode returns desktop-pinned only at >= 901px without reduced motion", () => {
  assert.equal(resolveMotionMode(900, false), "compact");
  assert.equal(resolveMotionMode(901, false), "desktop-pinned");
});

test("computeCurtainState parts curtains from 0 to +-102% and scales stage from 0.88 to 1", () => {
  const start = computeCurtainState(-0.2);
  assert.deepEqual(start, {
    leftXPercent: 0,
    rightXPercent: 0,
    stageScale: 0.88,
    stageOpacity: 0.25,
  });

  const mid = computeCurtainState(0.36);
  assert.equal(mid.leftXPercent, -51);
  assert.equal(mid.rightXPercent, 51);
  assert.equal(mid.stageScale, 0.94);
  assert.equal(mid.stageOpacity, 0.625);

  const settled = computeCurtainState(0.75);
  assert.deepEqual(settled, {
    leftXPercent: -102,
    rightXPercent: 102,
    stageScale: 1,
    stageOpacity: 1,
  });
});

test("clampArtworkPill bounds cursor offsets inside card padding", () => {
  const inside = clampArtworkPill(0.5, 0.5, 400, 300);
  assert.deepEqual(inside, { x: 200, y: 150 });
  const clamped = clampArtworkPill(1.2, -0.3, 400, 300);
  assert.equal(clamped.x, 344);
  assert.equal(clamped.y, 28);
});

test("formatStatCounterValue interpolates padded, suffixed, decimal, and year stats accurately", () => {
  assert.equal(formatStatCounterValue(0, "300+"), "0+");
  assert.equal(formatStatCounterValue(0.5, "300+"), "150+");
  assert.equal(formatStatCounterValue(1, "300+"), "300+");

  assert.equal(formatStatCounterValue(0.25, "04"), "01");
  assert.equal(formatStatCounterValue(1, "04"), "04");

  assert.equal(formatStatCounterValue(0.5, "8.56"), "4.28");
  assert.equal(formatStatCounterValue(1, "8.56"), "8.56");

  assert.equal(formatStatCounterValue(0, "2029", 2025), "2025");
  assert.equal(formatStatCounterValue(1, "2029", 2025), "2029");
});
