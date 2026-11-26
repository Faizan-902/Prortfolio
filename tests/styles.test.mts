import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css = fs.readFileSync("src/app/globals.css", "utf8");

test("globals.css defines dark and light curtain surface tokens without blur on curtain leaves", () => {
  assert.match(css, /--curtain-bg-left:/);
  assert.match(css, /--curtain-bg-right:/);
  assert.match(css, /\.curtain-leaf-left/);
  assert.match(css, /\.curtain-leaf-right/);
  assert.doesNotMatch(css, /\.curtain-leaf[^{]*\{[^}]*backdrop-filter/s);
});

test("globals.css hides curtain panels and restores stage under prefers-reduced-motion", () => {
  assert.match(css, /\[data-curtain-left\][\s\S]*display:\s*none/);
  assert.match(css, /\[data-curtain-stage\][\s\S]*opacity:\s*1\s*!important/);
});

test("globals.css avoids transitioning transform on artwork-pill, gates hover to fine pointers, hides closed faq-panel, and reveals curtains on focus", () => {
  const pillRule = css.match(/\.artwork-pill\s*\{[^}]*\}/)?.[0] ?? "";
  assert.doesNotMatch(pillRule, /transform\s+var\(/);
  assert.match(css, /@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)/);
  assert.match(
    css,
    /\.faq-panel\[data-open="false"\][\s\S]*visibility:\s*hidden/,
  );
  assert.match(css, /\[data-curtain-section\]:has\([^)]*:focus-visible\)/);
});

test("globals.css defines waveform equalizer, pulse sweep, and line-draw animations with reduced-motion safety", () => {
  assert.match(css, /@keyframes\s+eq-pulse/);
  assert.match(css, /@keyframes\s+ecg-sweep/);
  assert.match(css, /\[data-line-draw\]/);
  assert.match(css, /\[data-line-draw\][\s\S]*scaleX\(1\)/);
});
