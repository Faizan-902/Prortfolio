# Mohd Faizan Khan — Portfolio

A personal engineering portfolio built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, an HTML5 `<video>` atmospheric background, Lenis smooth scroll, and GSAP ScrollTrigger choreography.

## Run locally

```sh
npm install
npm run dev
```

## Verify, format & build for production

```sh
npx prettier --check "src/**/*.{ts,tsx,css}" DESIGN.md README.md
npm run typecheck
npm run build
npm start
```

## Architecture

- **Styling & tokens (`src/app/globals.css`, `DESIGN.md`):** CSS-first Tailwind v4 (`@import "tailwindcss";`, `@theme`, `@custom-variant dark`) with dark-first glass surfaces, overlay opacity `@theme` tokens, and a light theme toggle.
- **Video background (`src/components/BackgroundVideo.tsx`, `docs/video-prompt.md`):** Full-viewport `<video>` with desktop (`<= 2MB`) and mobile (`<= 1.5MB`) MP4/WebM streams, fast LCP poster fallback (`public/media/bg-poster.jpg`), iOS interaction retry, tab/off-screen pause, and contrast scrim/grain overlays.
- **Typography (`public/media/fonts/`, `src/app/layout.tsx`):** Self-hosted Latin `.woff2` `Space Grotesk` (display), `Inter` (body), and `DM Mono` (mono) with `font-display: swap`, preloads, fluid `clamp()` type scale, and `65ch` max reading measure.
- **Scroll & UX (`src/components/MotionObserver.tsx`):** Lenis (`lerp: 0.14`) synchronized with `gsap.ticker`, `scrub: true` ScrollTrigger timelines across all 6 Skills panels, isolated `[contain:layout_paint]` project cards, scrubbed word sweep, off-screen paused CSS loops, scroll-direction sticky nav, and back-to-top navigation.

## Deployment

Connected to Vercel production: `https://prortfolio-rho.vercel.app/`
