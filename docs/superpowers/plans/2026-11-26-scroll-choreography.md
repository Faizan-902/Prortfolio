# Scroll Choreography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add bespoke pinned split-curtain Bento scroll choreography, project artwork cursor-following pill, smooth FAQ accordion transitions, and Contact-to-Footer parallax across the portfolio.

**Architecture:** Extract pure motion interpolation and viewport-mode selection into `src/lib/motionConfig.ts` (TDD-tested with Node native test runner), build modular `CurtainBentoSection` and `FaqAccordion` components, and wire compositor-only `ScrollTrigger` + `bindPointerDecay` effects in `MotionObserver.tsx` inside `gsap.matchMedia()`.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, GSAP 3.15 (`ScrollTrigger`), Lenis 1.3, Node 26 `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-26-scroll-choreography-design.md`

## Global Constraints

- Preserve all user bio, project copy, skill items, achievements, FAQ copy, CTA hrefs, and `getSiteUrl()` SEO config verbatim.
- Zero `backdrop-filter` blur on sliding curtain leaves (`data-curtain-left`, `data-curtain-right`) to maintain `120fps` scroll performance over `<video>`.
- `prefers-reduced-motion: reduce` and `<= 900px` viewports must never trap or clip Bento cards behind closed curtains.
- `npm run format:check`, `npm run typecheck`, `npm run build`, and `node --test --experimental-strip-types tests/*.test.mts` must all exit `0`.

## Review Focus

- `<= 900px` compact mobile viewport unpins curtains cleanly so tall multi-card Bento grids stay fully scrollable without vertical clipping.
- `prefers-reduced-motion: reduce` disables pinned/scrubbed GSAP timelines AND CSS hides closed curtain leaves so Bento content renders immediately at `opacity: 1; scale: 1`.
- Light/dark theme tokens (`[data-theme="light"]`, `[data-theme="dark"]`) preserve readable ink contrast across curtain panels, Bento highlight borders, and footer wordmark reveal.
- Cursor pill (`data-cursor-pill`) clamps cleanly within artwork container bounds and uses `pointer-events: none` so keyboard and mouse clicks on `Inside the build ↗` never break.
- Repeated window resizes crossing the `900px` breakpoint cleanly revert `gsap.matchMedia()` curtain and contact timelines without duplicate triggers.

---

### Task 1: Pure Motion Config & Geometry Helpers (`motionConfig.ts`)

**Files:**
- Create: `src/lib/motionConfig.ts`
- Test: `tests/motionConfig.test.mts`
- Modify: `package.json:6-12` (add `"test"` script running `node --test --experimental-strip-types tests/*.test.mts`)

**Interfaces:**
- Produces:
  - `export type MotionMode = "desktop-pinned" | "compact" | "reduced";`
  - `export function resolveMotionMode(viewportWidth: number, reducedMotion: boolean): MotionMode`
  - `export function computeCurtainState(progress: number): { leftXPercent: number; rightXPercent: number; stageScale: number; stageOpacity: number }`
  - `export function clampArtworkPill(nx: number, ny: number, width: number, height: number): { x: number; y: number }`

- [ ] **Step 1: Add failing unit tests in `tests/motionConfig.test.mts`**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  clampArtworkPill,
  computeCurtainState,
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
```

- [ ] **Step 2: Run test to verify it fails cleanly**

Run: `node --test --experimental-strip-types tests/motionConfig.test.mts`
Expected: FAIL (`Cannot find module '../src/lib/motionConfig.ts'`)

- [ ] **Step 3: Implement `src/lib/motionConfig.ts` and add `"test"` script in `package.json`**

Implement `resolveMotionMode`, `computeCurtainState` (clamping `progress` in `[0, 1]`, parting & scaling smoothly over `[0, 0.72]` and holding cleanly until `1.0`), and `clampArtworkPill` (`56px` horizontal / `28px` vertical edge margin). Add `"test": "node --test --experimental-strip-types tests/*.test.mts"` to `package.json`.

- [ ] **Step 4: Run test suite + typecheck to verify pass**

Run: `npm test && npm run typecheck`
Expected: PASS (4/4 tests passing, exit 0)

- [ ] **Step 5: Commit Task 1**

```bash
git add package.json src/lib/motionConfig.ts tests/motionConfig.test.mts
git commit -m "feat(motion): add tested motion mode and curtain geometry helpers"
```

---

### Task 2: Bespoke Curtain & Theme Tokens (`globals.css`)

**Files:**
- Modify: `src/app/globals.css:158-270` (curtain panel light/dark tokens)
- Modify: `src/app/globals.css:342-365` (`prefers-reduced-motion` curtain safety)
- Modify: `src/app/globals.css:500-541` (`.faq-accordion`, `.artwork-pill`, `.curtain-grid-pattern`)

**Interfaces:**
- Consumes: `@theme` palette variables (`--color-canvas`, `--color-accent`, `--color-ink`).
- Produces: CSS classes `.curtain-leaf-left`, `.curtain-leaf-right`, `.curtain-stage`, `.curtain-grid-pattern`, `.faq-panel`, `.artwork-pill`.

- [ ] **Step 1: Add CSS structural test in `tests/styles.test.mts` asserting theme variables and reduced-motion bypass rules**

```ts
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css = fs.readFileSync("src/app/globals.css", "utf8");

test("globals.css defines dark and light curtain surface tokens without blur on curtain leaves", () => {
  assert.match(css, /--curtain-bg-left:/);
  assert.match(css, /--curtain-bg-right:/);
  assert.match(css, /\.curtain-leaf-left/);
  assert.doesNotMatch(css, /\.curtain-leaf[^{]*\{[^}]*backdrop-filter/s);
});

test("globals.css hides curtain panels and restores stage under prefers-reduced-motion", () => {
  assert.match(css, /\[data-curtain-left\][\s\S]*display:\s*none/);
  assert.match(css, /\[data-curtain-stage\][\s\S]*opacity:\s*1\s*!important/);
});
```

- [ ] **Step 2: Run CSS test to verify it fails**

Run: `node --test --experimental-strip-types tests/styles.test.mts`
Expected: FAIL (`AssertionError` on missing `--curtain-bg-left` / rules)

- [ ] **Step 3: Add curtain surface tokens, FAQ grid animation, artwork cursor pill styles, and reduced-motion overrides to `src/app/globals.css`**

Dark theme uses deep obsidian/indigo left (`--curtain-bg-left`) and slate/copper-tinted right (`--curtain-bg-right`); light theme uses layered alabaster/stone surfaces matching `--color-canvas`. Add `.faq-panel` (`grid-template-rows: 0fr -> 1fr`) and `.artwork-pill` (`transform: translate3d(var(--pill-x, 50%), var(--pill-y, 50%), 0) translate(-50%, -50%)`).

- [ ] **Step 4: Run tests + format check**

Run: `npm test && npm run format:check`
Expected: PASS (6/6 tests pass; run `npm run format` if Prettier formatting needs updating first)

- [ ] **Step 5: Commit Task 2**

```bash
git add src/app/globals.css tests/styles.test.mts
git commit -m "style(tokens): add theme-aware curtain surfaces, faq accordion, and cursor pill utilities"
```

---

### Task 3: Modular `CurtainBentoSection` & `FaqAccordion` Components

**Files:**
- Create: `src/components/CurtainBentoSection.tsx`
- Create: `src/components/FaqAccordion.tsx`
- Test: `tests/components.test.mts`

**Interfaces:**
- Produces:
  - `export default function CurtainBentoSection()` rendering `[data-curtain-section]`, `[data-curtain-left]`, `[data-curtain-right]`, `[data-curtain-stage]` with Education (`8.56/10`), `The Way I Build` centerpiece card, and Achievements (`01 ICPC`, `02 Inclusive open source`, `03 Campfire Hackathon`).
  - `export default function FaqAccordion({ items }: { items: ReadonlyArray<readonly [string, string]> })` rendering interactive accessible buttons (`aria-expanded`, `aria-controls`) and animated `.faq-panel` wrappers.

- [ ] **Step 1: Add component render tests in `tests/components.test.mts` checking markup & zero prohibited references**

Verify `CurtainBentoSection.tsx` renders all user milestones (`8.56`, `ICPC`, `LFC102`, `Campfire Hackathon`, `The Way I Build`), `FaqAccordion.tsx` renders accessible `aria-expanded` toggles, and no image elements (`<img`) are introduced on curtain panels.

- [ ] **Step 2: Run component test to verify it fails**

Run: `node --test --experimental-strip-types tests/components.test.mts`
Expected: FAIL (`ENOENT`)

- [ ] **Step 3: Implement `CurtainBentoSection.tsx` and `FaqAccordion.tsx`**

Build geometric architectural SVG/typographic curtains (`BEYOND THE CODE // 01` left, geometric wave/node constellation + `CRAFT & IMPACT // 02` right) hiding completely below `901px` (`hidden min-[901px]:flex`) and under `prefers-reduced-motion`, revealing a responsive 3-column Bento grid inside `[data-curtain-stage]`. Keep `FaqAccordion` stateful with `openIndex` (`useState<number | null>(0)` so the first answer starts open cleanly like the recording!).

- [ ] **Step 4: Run tests, format check & typecheck**

Run: `npm run format && npm test && npm run typecheck`
Expected: PASS

- [ ] **Step 5: Commit Task 3**

```bash
git add src/components/CurtainBentoSection.tsx src/components/FaqAccordion.tsx tests/components.test.mts
git commit -m "feat(ui): add bespoke CurtainBentoSection and accessible FaqAccordion components"
```

---

### Task 4: Wire Bento Curtain, Artwork Pill, Case Study Trigger & Contact Parallax

**Files:**
- Modify: `src/components/ProjectCaseStudy.tsx:104-125` (expose click-through / custom trigger support cleanly or ref-less accessible artwork click wrapper)
- Modify: `src/components/PortfolioExperience.tsx:480-958` (integrate `CurtainBentoSection`, `FaqAccordion`, artwork hover pill + open callback, and `#contact` / `<footer>` parallax attributes)
- Modify: `src/components/MotionObserver.tsx:320-620` (wire `[data-curtain-section]` GSAP scrub timeline, `[data-contact-parallax]`, `[data-footer-word]`, and `[data-artwork-hover]` cursor tracking using `computeCurtainState` & `clampArtworkPill`)

**Interfaces:**
- Consumes: `CurtainBentoSection`, `FaqAccordion`, `resolveMotionMode`, `computeCurtainState`, `clampArtworkPill` from Task 1 & Task 3.

- [ ] **Step 1: Extend `tests/components.test.mts` to verify `PortfolioExperience.tsx` & `MotionObserver.tsx` wiring**

Assert `PortfolioExperience.tsx` uses `CurtainBentoSection` + `FaqAccordion` (replacing inline duplicated approach/FAQ blocks), attaches `data-artwork-hover` + `data-cursor-pill`, attaches `data-contact-parallax` + `data-footer-word`, and `MotionObserver.tsx` references `data-curtain-section`, `data-contact-parallax`, `data-footer-word`, `data-artwork-hover`.

- [ ] **Step 2: Run tests to verify new assertions fail**

Run: `node --test --experimental-strip-types tests/components.test.mts`
Expected: FAIL

- [ ] **Step 3: Update `ProjectCaseStudy.tsx`, `PortfolioExperience.tsx`, and `MotionObserver.tsx`**

Wire `ProjectCaseStudy` cleanly with a controllable open handler or event, replace the standalone `Beyond the Code` + `The Way I Build` sections with `CurtainBentoSection`, swap FAQ `<details>` with `<FaqAccordion items={faqs} />`, add the floating `CASE STUDY ↗` pill inside project artwork cards, and drive `[data-curtain-left]`, `[data-curtain-right]`, and `[data-curtain-stage]` via `ScrollTrigger` `onUpdate` calling `computeCurtainState(self.progress)` + `gsap.quickSetter` alongside `#contact`/`<footer>` parallax inside `gsap.matchMedia()`.

- [ ] **Step 4: Format, test, typecheck, and build full production bundle**

Run: `npm run format && npm run format:check && npm test && npm run typecheck && rm -rf .next && npm run build`
Expected: PASS (exit 0 across all checks, 9/9 Next.js static routes built)

- [ ] **Step 5: Commit Task 4**

```bash
git add src/components/ProjectCaseStudy.tsx src/components/PortfolioExperience.tsx src/components/MotionObserver.tsx tests/components.test.mts
git commit -m "feat(choreography): integrate curtain bento, artwork cursor pill, faq accordion, and footer parallax"
```

---

### Task 5: End-to-End Verification, Clean Push to `Prortfolio`, & Vercel Production Deploy

**Files:**
- Modify: `DESIGN.md` (document new curtain bento, FAQ, cursor pill, and contact parallax tokens/timings cleanly)

- [ ] **Step 1: Verify zero forbidden template references across workspace & commit history, run full verification suite**

Run: `npm run format:check && npm test && npm run typecheck && rm -rf .next && npm run build`
Expected: All verification checks pass cleanly with zero forbidden external template strings.

- [ ] **Step 2: Commit `DESIGN.md` update, verify live rendered SSR routes, push cleanly to `prortfolio/main`, and confirm Vercel + CI green**
