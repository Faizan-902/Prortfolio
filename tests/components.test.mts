import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("CurtainBentoSection preserves all existing milestones and excludes raster images", () => {
  const src = fs.readFileSync("src/components/CurtainBentoSection.tsx", "utf8");
  assert.match(src, /data-curtain-section/);
  assert.match(src, /data-curtain-left/);
  assert.match(src, /data-curtain-right/);
  assert.match(src, /data-curtain-stage/);
  assert.match(src, /8\.56/);
  assert.match(src, /ICPC Preliminary Online Round/);
  assert.match(src, /LFC102/);
  assert.match(src, /Campfire Hackathon/);
  assert.match(src, /THE WAY I BUILD/);
  assert.doesNotMatch(src, /<img\b/i);
});

test("FaqAccordion provides accessible aria-expanded controls and smooth panel hooks", () => {
  const src = fs.readFileSync("src/components/FaqAccordion.tsx", "utf8");
  assert.match(src, /aria-expanded=/);
  assert.match(src, /aria-controls=/);
  assert.match(src, /faq-panel/);
  assert.match(src, /data-open=/);
});

test("PortfolioExperience and MotionObserver wire curtain bento, artwork pill, faq, and footer parallax", () => {
  const exp = fs.readFileSync("src/components/PortfolioExperience.tsx", "utf8");
  const motion = fs.readFileSync("src/components/MotionObserver.tsx", "utf8");

  assert.match(exp, /CurtainBentoSection/);
  assert.match(exp, /FaqAccordion/);
  assert.match(exp, /data-artwork-hover/);
  assert.match(exp, /data-cursor-pill/);
  assert.match(exp, /data-contact-parallax/);
  assert.match(exp, /data-footer-word/);
  assert.doesNotMatch(exp, /group\/faq/);

  assert.match(motion, /computeCurtainState/);
  assert.match(motion, /clampArtworkPill/);
  assert.match(motion, /data-curtain-section/);
  assert.match(motion, /data-artwork-hover/);
  assert.match(motion, /data-contact-parallax/);
  assert.match(motion, /data-footer-word/);
  assert.match(motion, /onEnter\s*=\s*\(e:\s*PointerEvent\)/);
  assert.match(motion, /focusin/);
});

test("Accessibility fixes: inset focus ring on artwork trigger, motion-reduce unpinning, and faq aria-hidden", () => {
  const curtain = fs.readFileSync(
    "src/components/CurtainBentoSection.tsx",
    "utf8",
  );
  const faq = fs.readFileSync("src/components/FaqAccordion.tsx", "utf8");
  const exp = fs.readFileSync("src/components/PortfolioExperience.tsx", "utf8");

  assert.match(exp, /focus-visible:ring-inset/);
  assert.match(curtain, /motion-reduce:min-h-0/);
  assert.match(curtain, /motion-reduce:static/);
  assert.match(faq, /aria-hidden=\{!isOpen\}/);
});

test("Rich scroll & artwork motion hooks cover hero, marquee, counters, artwork visuals, and ResizeObserver", () => {
  const exp = fs.readFileSync("src/components/PortfolioExperience.tsx", "utf8");
  const art = fs.readFileSync("src/components/ProjectArtwork.tsx", "utf8");
  const ui = fs.readFileSync("src/components/ui.tsx", "utf8");
  const motion = fs.readFileSync("src/components/MotionObserver.tsx", "utf8");

  assert.match(exp, /data-marquee-parallax/);
  assert.match(exp, /data-about-star/);
  assert.match(exp, /data-stat-counter/);
  assert.match(exp, /data-ticker-scrub/);
  assert.match(exp, /data-contact-cta/);

  assert.match(art, /data-loop-anim/);
  assert.match(art, /data-env-terminal/);
  assert.match(ui, /data-line-draw/);

  assert.match(motion, /ResizeObserver/);
  assert.match(motion, /formatStatCounterValue/);
  assert.match(motion, /data-about-star/);
});
