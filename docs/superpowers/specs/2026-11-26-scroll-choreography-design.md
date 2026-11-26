# Scroll Choreography & Interactive Motion Design Spec

**Date:** 2026-11-26
**Scope:** Add pinned split-curtain Bento reveal, project artwork cursor-following case-study pill, smooth FAQ accordion, and Contact-to-Footer parallax while preserving all existing portfolio copy, routes, `<video>` backdrop, light/dark themes, and `120fps` compositor budget.

---

## 1. Intent & Goals

Elevate scrolling flow across the second half of the portfolio (`Beyond the Code`, `#work` media hover, `FAQ`, `#contact`, and `<footer>`) so every section feels cohesive, tactile, and paced like an editorial showcase without adding stock photography or altering the user's personal content.

### Goals
- Pinned symmetric split-curtain runway revealing a 3-column Bento showcase on desktop (`>= 901px`).
- Completely original, theme-aware geometric/typographic vector curtains (no external photos or third-party assets).
- Cursor-following accent pill (`CASE STUDY ↗`) inside hovered project artwork containers on fine-pointer devices.
- Smooth `grid-template-rows` FAQ accordion transitions with sticky left header on desktop and `+ → ×` rotation.
- Subtle atmospheric Contact backdrop parallax transitioning into a scrubbed footer wordmark reveal.
- `prefers-reduced-motion: reduce` safety (curtains never obscure content) and mobile unpinned layout (`<= 900px`).

### Non-Goals & Constraints
- **No content edits:** Bio, project titles/copy, skills, education metrics, achievements, FAQ copy, and external links stay intact.
- **Stack unchanged:** Next.js 15, React 19, TypeScript, Tailwind CSS v4 tokens, Lenis, and GSAP `ScrollTrigger`.
- **120fps budget:** Animate `transform` and `opacity` only; zero `backdrop-filter: blur` on moving curtain leaves.
- **No extra runtime dependencies:** Tests run natively with Node (`node --test --experimental-strip-types`).

---

## 2. Approaches Considered

1. **Full Choreography Match *(Selected)*:** Consolidated Bento reveal inside a pinned `200svh` split-curtain runway (`Beyond the Code` + `The Way I Build`), cursor pill on `#work` artwork, smooth animated FAQ accordion, and `#contact` → `<footer>` parallax.
2. **Curtain Bento Only:** Only add the split-curtain Bento section; leaves `#work` hover, FAQ, and `#contact`/footer static.
3. **Minimal Curtain on Approach Card Only:** Wrap `The Way I Build` alone without Bento layout or secondary section motion.

**Why Approach 1 fits best:** It delivers complete end-to-end pacing through the entire lower half of the page while isolating each motion system in focused components and a single `ScrollTrigger` lifecycle.

---

## 3. Architecture & File Map

- `src/lib/motionConfig.ts`: Pure deterministic helpers for motion mode selection (`"desktop-pinned" | "compact" | "reduced"`), curtain progress/scale interpolation, and clamped cursor pill coordinates.
- `src/components/CurtainBentoSection.tsx`: Bespoke split-curtain panels + 3-column Bento grid uniting Education (`8.56/10`), center statement card (`The Way I Build` with coral gradient accent frame + subtle orbital ring SVG), and Achievements (`ICPC`, `Linux Foundation LFC102`, `Campfire Hackathon`).
- `src/components/FaqAccordion.tsx`: Accessible expandable FAQ rows (`button`, `aria-expanded`, `aria-controls`) with sticky left heading on desktop and CSS grid-row transition.
- `src/components/ProjectCaseStudy.tsx`: Supports programmatic opening when clicking project artwork alongside the `Inside the build ↗` button.
- `src/components/PortfolioExperience.tsx`: Integrates `CurtainBentoSection`, `FaqAccordion`, `#work` artwork cursor pill markup (`data-artwork-hover`, `data-cursor-pill`), and `#contact` / `<footer>` parallax attributes (`data-contact-parallax`, `data-footer-word`).
- `src/components/MotionObserver.tsx`: Registers GSAP timelines inside `gsap.matchMedia()` for curtains, contact/footer parallax, and cursor pill tracking via `bindPointerDecay()`.
- `src/app/globals.css`: Curtain gradients for dark/light themes, `.faq-grid` accordion row animation, `.cursor-pill` compositor transforms, and reduced-motion curtain bypass rules.
