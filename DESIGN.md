# Design System & Motion Architecture

This portfolio uses **Tailwind CSS v4** (`@import "tailwindcss";` + CSS-first `@theme` tokens + `@custom-variant dark`) in `src/app/globals.css`, a fixed **HTML5 `<video>` atmospheric backdrop** (`src/components/BackgroundVideo.tsx`), self-hosted Latin `.woff2` typography, and **Lenis + GSAP ScrollTrigger** choreography (`src/components/MotionObserver.tsx`).

---

## 1. Token Map: Legacy Variables → Tailwind v4 `@theme` Tokens

| Legacy CSS Variable                                       | Tailwind v4 `@theme` Token                                                                                    | Purpose                                                                                                                              |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `--bg-base`                                               | `--color-canvas`                                                                                              | Page background `#070a10` (`#eceae5` light)                                                                                          |
| `--bg-section-tint`                                       | `--color-section-tint`                                                                                        | Translucent section backdrop over `<video>`                                                                                          |
| `--bg-section-deep`                                       | `--color-section-deep`                                                                                        | Deep section backdrop (`#work`, `#contact`, `<footer>`)                                                                              |
| `--surface-glass`                                         | `--color-glass`                                                                                               | Frosted card surface (`bg-glass`)                                                                                                    |
| `--surface-glass-strong`                                  | `--color-glass-strong`                                                                                        | Elevated card & sticky stack surface                                                                                                 |
| `--surface-glass-hover`                                   | `--color-glass-hover`                                                                                         | Card hover surface                                                                                                                   |
| `--surface-nav` / `--surface-nav-scrolled`                | `--color-nav` / `--color-nav-scrolled`                                                                        | Sticky nav base & scrolled blur state                                                                                                |
| `--surface-pill` / `--surface-pill-hover`                 | `--color-pill` / `--color-pill-hover`                                                                         | Tag & pill fills                                                                                                                     |
| `--surface-cta` / `--surface-cta-ink`                     | `--color-cta` / `--color-cta-ink`                                                                             | High-contrast CTA (`bg-cta text-cta-ink`)                                                                                            |
| `--surface-dialog`                                        | `--color-dialog`                                                                                              | Case study modal dialog surface                                                                                                      |
| `--text-primary` / `--text-secondary` / `--text-muted`    | `--color-ink` / `--color-ink-secondary` / `--color-ink-muted`                                                 | WCAG AA foreground ink scale                                                                                                         |
| `--accent` / `--accent-hover`                             | `--color-accent` / `--color-accent-hover`                                                                     | Copper-coral highlights & underlines                                                                                                 |
| `--accent-solid` / `--accent-solid-ink`                   | `--color-accent-solid` / `--color-accent-ink`                                                                 | Solid accent button fill & white ink                                                                                                 |
| `--border-subtle` / `--border-strong` / `--border-dashed` | `--color-border-subtle` / `--color-border-strong` / `--color-border-dashed`                                   | Glass borders & dividers                                                                                                             |
| _(video palette & overlay tokens)_                        | `--color-video-indigo`, `--color-video-cyan`, `--opacity-video-scrim`, `--opacity-video-grain`                | Fallback palette (`#0d1633` / `#154d63`) + `@theme` scrim (`0.92` dark, `0.94` light) & grain (`0.04` dark, `0.025` light) opacities |
| `--font-display` / `--font-body` / `--font-mono`          | `--font-display` / `--font-body` / `--font-mono`                                                              | `Space Grotesk`, `Inter`, `DM Mono`                                                                                                  |
| `--text-xs` … `--text-display`                            | `--text-xs` … `--text-display`, `--text-hero`, `--text-footer`                                                | Fluid `clamp()` typography scale                                                                                                     |
| `--leading-tight` … `--leading-relaxed`                   | `--leading-tight`, `--leading-snug`, `--leading-body`, `--leading-relaxed`                                    | Tight headings (`1.06`–`1.2`), body (`1.6`–`1.68`)                                                                                   |
| `--tracking-tightest` … `--tracking-mono`                 | `--tracking-tightest`, `--tracking-tight`, `--tracking-snug`, `--tracking-mono`                               | Heading & mono letter spacing                                                                                                        |
| `--gutter` / `--section-pad-y`                            | `--spacing-gutter`, `--spacing-section`, `--container-max`                                                    | Fluid page gutter, section padding, `95rem` container                                                                                |
| `--radius-xs` … `--radius-pill`                           | `--radius-xs`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill`                                   | Component border radii                                                                                                               |
| `--shadow-card` / `--shadow-elevated` / `--shadow-glow`   | `--shadow-card`, `--shadow-elevated`, `--shadow-glow`                                                         | Glass elevation & focus glow                                                                                                         |
| `--blur-sm` / `--blur-md` / `--blur-lg`                   | `--blur-sm`, `--blur-md`, `--blur-lg`                                                                         | Backdrop blur (`6px`, `12px`, `16px`) isolated to compact floating chrome                                                            |
| `--duration-fast` … `--duration-slow`, `--ease-out`       | `--duration-fast`, `--duration-base`, `--duration-reveal`, `--duration-slow`, `--ease-out`, `--ease-standard` | Interaction & transition timing                                                                                                      |

---

## 2. Cinematic Video Pipeline (`src/components/BackgroundVideo.tsx`)

- **Generation prompt:** Stored verbatim in [`docs/video-prompt.md`](docs/video-prompt.md). Because no Veo API key or video-generation MCP is configured in this environment, a seamless `10.0s` ping-pong dark indigo/cyan placeholder loop (`public/media/bg.mp4`, `bg.webm`, `bg-mobile.mp4`, `bg-mobile.webm`, `bg-poster.jpg`) was generated using `ffmpeg 9.1` (`gradients` + `perlin` + `noise`). Replace these files at the exact same paths when dropping in the final clip—no code changes required.
- **Responsive playback & LCP strategy:**
  - Instant `<img src="/media/bg-poster.jpg" fetchPriority="high">` layer underneath renders cleanly for LCP without blocking first paint on video decode.
  - `<video autoPlay muted loop playsInline preload="auto" disablePictureInPicture poster="/media/bg-poster.jpg" aria-hidden="true">` serves `<= 1.5MB` (`854x480`) mobile streams (`<source media="(max-width: 767px)">`) and `720p` streams (`<= 2MB`) on desktop.
  - Programmatic `video.play()` catches autoplay rejections (e.g. iOS Low Power Mode), displays the static poster fallback, and retries on first `pointerdown` / `keydown` / `touchstart`.
  - Pauses automatically on `document.hidden` (`visibilitychange`) and off-screen (`IntersectionObserver`), and switches to poster-only under `prefers-reduced-motion: reduce`, `Save-Data`, or `2g` / `slow-2g`.
- **Contrast overlay:** `.bg-scrim-layer` (using `@theme` `--opacity-video-scrim`) and `.bg-grain-layer` (using `--opacity-video-grain`) guarantee WCAG AA text contrast over any frame in dark and light themes.

### FFmpeg Compression Commands (8–12s seamless loop, no audio, CRF 28)

```sh
# 1. Desktop H.264 MP4 (1280x720, 8-12s seamless loop, no audio, faststart, <= 2MB)
ffmpeg -y -i input.mp4 \
  -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,format=yuv420p" \
  -t 10 -c:v libx264 -preset slow -crf 28 -movflags +faststart -an \
  public/media/bg.mp4

# 2. Desktop VP9 WebM (1280x720, no audio)
ffmpeg -y -i public/media/bg.mp4 \
  -c:v libvpx-vp9 -crf 33 -b:v 0 -row-mt 1 -an \
  public/media/bg.webm

# 3. Mobile H.264 & WebM variants (<= 720p, <= 1.5MB)
ffmpeg -y -i public/media/bg.mp4 \
  -vf "scale=854:480:flags=lanczos" \
  -c:v libx264 -preset slow -crf 28 -movflags +faststart -an \
  public/media/bg-mobile.mp4

ffmpeg -y -i public/media/bg-mobile.mp4 \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -an \
  public/media/bg-mobile.webm

# 4. LCP Poster JPEG
ffmpeg -y -i public/media/bg.mp4 -frames:v 1 -q:v 4 -update 1 public/media/bg-poster.jpg
```

---

## 3. Smooth Scroll, Skills Scrub & UX Architecture (`src/components/MotionObserver.tsx`)

- **Lenis Smooth Engine (`prefers-reduced-motion: no-preference`):**
  - Config: `lerp: 0.14`, `smoothWheel: true`, `syncTouch: false` (native touch), `autoRaf: false`, `anchors: false`, `prevent: (node) => !!node.closest("dialog")`.
  - Ticker & Sync: `lenis.on("scroll", () => { ScrollTrigger.update(); ... })`, driven by `gsap.ticker.add((t) => lenis.raf(t * 1000))` with `gsap.ticker.lagSmoothing(0)`.
  - Anchors & Modal Lock: hash anchors route through `lenis.scrollTo(target, { offset: -88 })` (top `#home` uses `0`); open `<dialog>` pauses Lenis cleanly. Disabled completely under `prefers-reduced-motion: reduce`.
- **120fps Reversible GSAP ScrollTrigger Choreography (transform & opacity only, zero secondary scrub tail):**
  - **Video Wrapper Parallax (`[data-video-parallax]`):** `scale: 1 -> 1.05`, `yPercent: 0 -> -2`, `ease: "none"`, `scrub: true` (`top top` → `bottom bottom`) inside a `[contain:strict]` fixed compositor layer.
  - **Hero & Marquee Depth (`[data-hero-top]`, `[data-hero-parallax]`, `[data-marquee-parallax]`, `[data-ticker-scrub]`):** Multi-layer exit depth (`y: 0 -> -28`, `scale: 1 -> 0.96`, `opacity: 1 -> 0.72` on `#home` wordmark; `y: 0 -> -18`, `opacity: 1 -> 0.55` on top cards) paired with opposing horizontal scroll momentum across `MY BUILDING BLOCKS` and `THINK + BUILD`.
  - **About Spin, Counters & Hairline Draws (`#about`, `SectionLabel`):** `[data-about-star]` (`✳`) scrubs `rotation: 0 -> 180deg`, `[data-stat-counter]` rolls up numeric KPIs over `850ms` cubic-out via `formatStatCounterValue()` (`tabular-nums`), desktop stat cards alternate gentle Y parallax, and `SectionLabel` dividers draw `scaleX(0 -> 1)` via `[data-line-draw]`.
  - **Word Reveal (`.word-reveal`):** span opacity `0.52 -> 1`, `stagger: 0.05`, `ease: "none"`, `scrub: true` (`top 88%` → `bottom 42%`), maintaining WCAG AA large-text contrast even at rest.
  - **Desktop Sticky Project Cards & Live Artwork (`.project-card` at `min-width: 901px`):** `scale: 1 -> 0.945`, `opacity: 1 -> 0.66`, `ease: "none"`, `scrub: true` (`top 88%` → `top ${84 + (i + 1) * 18}px`), internal `[data-artwork-parallax]` (`yPercent: -5 -> 5`), straight-tilt `[data-env-terminal]` (`-7° -> 0°`), and off-screen-pausable ECG/equalizer/orbital loops (`[data-loop-anim]`) inside `[contain:layout_paint]` with zero `backdrop-blur` readbacks.
  - **Skills Section Master Timelines (6 panels `[data-skill-panel]`, `start: "top 80%"`, `end: "bottom 30%"`, `scrub: true` locked 1:1 to Lenis):**
    - `0.00 -> 0.34`: Panel focus opacity `0.5 -> 1` (+ alternating desktop horizontal slide `x: ±32px -> 0`), `"power1.out"`.
    - `0.00 -> 1.00`: Big glyph (`[data-skill-glyph]`) parallax `yPercent: -15 -> 15` (`-8 -> 8` mobile), `scale: 0.9 -> 1`, `opacity: 0.55 -> 1`, `"none"`.
    - `0.00 -> 0.20`: Masked `number + title` (`[data-skill-header]`) `y: 40 -> 0`, `opacity: 0.2 -> 1`, `"power1.out"`.
    - `0.06 -> 0.26`: Subtitle (`[data-skill-subtitle]`) `y: 24 -> 0`, `opacity: 0 -> 1`, `"power1.out"`.
    - `0.12 -> 0.48`: Skill items (`[data-skill-item]`) `y: 32 -> 0`, `opacity: 0 -> 1`, `stagger: 0.08`, `"power1.out"`.
    - `0.72 -> 1.00`: Active neighbor fade back to `opacity: 0.5`, `"none"`.
    - Static `will-change-transform` on `[data-skill-glyph]` and `ScrollTrigger.refresh()` after `document.fonts.ready` / `window.load` and `<main>` `ResizeObserver` height changes.
  - **Split-Curtain Bento Reveal (`CurtainBentoSection.tsx`, `min-width: 901px`):**
    - `200svh` (`min-h-[195svh]`) pinned runway housing `[data-curtain-left]` / `[data-curtain-right]` geometric theme-aware curtains (`--curtain-bg-left`, `--curtain-bg-right`, zero `backdrop-filter`).
    - Driven 1:1 by `computeCurtainState(progress)` (`src/lib/motionConfig.ts`) via `gsap.quickSetter`: curtains part `0 -> ±102%`, curtain vector artwork drifts symmetrically, left/right Bento columns converge (`y: 26/38 -> 0`), and `[data-curtain-stage]` scales `0.88 -> 1` (`opacity: 0.25 -> 1`) across `[0, 0.72]` runway progress. Unpins cleanly on `<= 900px`, disables under `prefers-reduced-motion: reduce`, and opens/scrolls on keyboard focus.
  - **Artwork Cursor Pill, Sticky FAQ & Contact-to-Footer Parallax:**
    - Hovered project artwork (`[data-artwork-hover]`) tracks pointer coordinates clamped via `clampArtworkPill()` (`--pill-x`, `--pill-y`) over `[data-cursor-pill]` (`CASE STUDY ↗`) and reveals a non-clipped inset focus ring (`focus-visible:ring-inset`).
    - `FaqAccordion.tsx` animates height cleanly with `.faq-panel` (`grid-template-rows: 0fr -> 1fr`, `aria-hidden`/`inert` when closed) beside a `min-[901px]:sticky` heading.
    - `#contact` radial grid (`[data-contact-parallax]`) glides `yPercent: -8 -> 8`, `[data-contact-heading]` & `[data-contact-cta]` settle on enter, and footer `[data-footer-word]` rises `yPercent: 20 -> 0` (`opacity: 0.3 -> 1`).
- **Global UX & GPU Hygiene:** Only compact floating chrome (`floating-nav` and `back-to-top`) uses `backdrop-blur` (`6px`); large stacked/scrolling cards use high-contrast translucent surfaces with `0` backdrop-blur passes; pointer interactions (`[data-magnetic]`, `[data-tilt]`, `[data-spotlight]`, `[data-artwork-hover]`) cache `DOMRect` on `pointerenter` with smooth `rAF` leave decay, `0` mid-move layout reads, and pause off-screen `[data-loop-anim]` keyframes via `IntersectionObserver`.
