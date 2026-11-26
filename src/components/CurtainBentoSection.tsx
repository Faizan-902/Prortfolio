import { SectionLabel, SplitAction } from "./ui";

const achievements = [
  {
    id: "01",
    title: "ICPC Preliminary Online Round",
    text: "Team Three Pointerss · 3 problems solved · 2,305th rank in the Final Regional Selection Pool.",
  },
  {
    id: "02",
    title: "Inclusive open source",
    text: "Linux Foundation LFC102 · Inclusive Open Source Community Orientation · November 2026.",
    href: "https://drive.google.com/file/d/1WgnaVz9RDnPQgcXDWlOW48WAYug8G4NN/view?usp=sharing",
    linkLabel: "VIEW CERTIFICATE ↗",
  },
  {
    id: "03",
    title: "Campfire Hackathon",
    text: "Team-based game development, rapid prototyping, frontend development, and collaborative problem-solving.",
  },
] as const;

/** Architectural pinned split-curtain runway unveiling the unified Beyond the Code & approach Bento grid. */
export default function CurtainBentoSection() {
  return (
    <section
      data-curtain-section
      aria-label="Education, milestones, and building approach"
      className="relative bg-section-tint motion-reduce:min-h-0 min-[901px]:min-h-[195svh]"
    >
      <div className="px-[var(--spacing-gutter)] py-[var(--spacing-section)] motion-reduce:static motion-reduce:min-h-0 motion-reduce:py-[var(--spacing-section)] min-[901px]:sticky min-[901px]:top-0 min-[901px]:flex min-[901px]:min-h-svh min-[901px]:items-center min-[901px]:overflow-clip min-[901px]:pt-20 min-[901px]:pb-10">
        {/* Desktop Split Curtains (transform-only, zero blur for 120fps) */}
        <div
          data-curtain-left
          aria-hidden="true"
          className="curtain-leaf-left curtain-grid-pattern pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-1/2 flex-col justify-between border-r border-border-strong p-10 will-change-transform min-[901px]:flex xl:p-14"
        >
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[var(--tracking-mono)] text-ink-muted">
            <span>+</span>
            <span>01 / PERSPECTIVE</span>
          </div>
          <div className="relative flex flex-col items-end gap-4 pr-2">
            <svg
              data-curtain-art-left
              className="h-28 w-44 text-accent opacity-80 will-change-transform"
              viewBox="0 0 180 110"
              fill="none"
            >
              <circle
                cx="140"
                cy="55"
                r="42"
                stroke="currentColor"
                strokeOpacity="0.45"
                strokeWidth="1.25"
              />
              <circle
                cx="140"
                cy="55"
                r="24"
                stroke="currentColor"
                strokeWidth="1.25"
              />
              <path
                d="M12 55H176M140 12V98"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeDasharray="3 4"
              />
            </svg>
            <span className="font-display text-[clamp(2.8rem,5.4vw,5.2rem)] leading-none font-bold tracking-[var(--tracking-tightest)] text-ink">
              BEYOND
            </span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[var(--tracking-mono)] text-ink-muted">
            <span>THINK + BUILD</span>
            <span>+</span>
          </div>
        </div>

        <div
          data-curtain-right
          aria-hidden="true"
          className="curtain-leaf-right curtain-grid-pattern pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-1/2 flex-col justify-between p-10 will-change-transform min-[901px]:flex xl:p-14"
        >
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[var(--tracking-mono)] text-ink-muted">
            <span>SCROLL TO REVEAL</span>
            <span>+</span>
          </div>
          <div className="relative flex flex-col items-start gap-4 pl-2">
            <svg
              data-curtain-art-right
              className="h-28 w-48 text-ink-muted opacity-85 will-change-transform"
              viewBox="0 0 200 110"
              fill="none"
            >
              <path
                d="M8 62C36 22 64 22 92 56C120 90 148 90 188 38"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
              />
              <path
                d="M8 76C42 42 74 42 104 68C134 94 160 88 188 54"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeDasharray="4 4"
              />
              <circle cx="92" cy="56" r="4" fill="var(--color-accent)" />
            </svg>
            <span className="font-display text-[clamp(2.8rem,5.4vw,5.2rem)] leading-none font-bold tracking-[var(--tracking-tightest)] text-ink-secondary">
              THE CODE
            </span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[var(--tracking-mono)] text-ink-muted">
            <span>+</span>
            <span>BENGALURU · 2026</span>
          </div>
        </div>

        {/* Center Bento Grid revealed cleanly behind parting curtains */}
        <div
          data-curtain-stage
          className="mx-auto w-full max-w-[var(--container-max)] transform-gpu will-change-transform"
        >
          <SectionLabel className="mb-6">BEYOND THE CODE</SectionLabel>
          <h2
            className="mx-auto mb-8 text-center font-display text-2xl leading-[var(--leading-snug)] font-semibold tracking-[var(--tracking-tight)]"
            data-reveal
          >
            Always learning.
            <br />
            Always moving forward.
          </h2>

          <div className="grid grid-cols-1 items-stretch gap-4 min-[901px]:grid-cols-[0.95fr_1.15fr_1fr]">
            {/* Left Bento Card: Education */}
            <article
              data-curtain-bento-left
              className="tilt-glow flex flex-col rounded-[var(--radius-md)] border border-border-subtle bg-glass p-[clamp(1.5rem,2.4vw,2rem)] shadow-card transition-[border-color,background-color,box-shadow,translate] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-border-strong hover:bg-glass-hover hover:shadow-elevated"
              data-reveal
              data-tilt
            >
              <div className="flex items-center justify-between font-mono text-xs text-accent">
                <span>↗ EDUCATION / 2025—2029</span>
                <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              </div>
              <h3 className="mt-5 mb-3 font-display text-xl leading-[1.15] font-medium tracking-[var(--tracking-snug)]">
                Computer Science.
                <br />
                Real-world curiosity.
              </h3>
              <p className="max-w-[65ch] text-base leading-[var(--leading-body)] text-ink-secondary">
                Bachelor of Technology in Computer Science
              </p>
              <p className="mb-4 max-w-[65ch] text-sm leading-[var(--leading-body)] text-ink-muted">
                Newton School of Technology,
                <br />
                S-VYASA, Bengaluru
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-4">
                <strong className="font-display text-[clamp(2.5rem,3.8vw,3.8rem)] leading-none font-medium tracking-[var(--tracking-tightest)]">
                  8.56
                  <span className="text-[1.4rem] text-ink-muted">/10</span>
                </strong>
                <span className="font-mono text-[11px] text-ink-muted">
                  CURRENT CGPA
                </span>
              </div>
            </article>

            {/* Centerpiece Bento Card: The Way I Build */}
            <article
              className="approach-card tilt-glow bento-spotlight-ring relative flex flex-col items-center justify-between overflow-clip rounded-[var(--radius-md)] border border-accent/40 bg-glass-strong p-[clamp(1.75rem,3vw,2.5rem)] text-center shadow-elevated transition-[border-color,background-color,box-shadow,translate] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-accent"
              data-reveal
              data-tilt
            >
              <svg
                data-loop-anim
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 right-0 left-0 mx-auto h-52 w-52 text-accent opacity-20 motion-safe:animate-[spin_36s_linear_infinite]"
                viewBox="0 0 200 200"
                fill="none"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="82"
                  stroke="currentColor"
                  strokeDasharray="5 7"
                />
                <circle cx="100" cy="100" r="56" stroke="currentColor" />
              </svg>
              <span className="relative z-[1] font-mono text-xs text-accent">
                THE WAY I BUILD
              </span>
              <h3 className="relative z-[1] my-4 font-display text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[var(--leading-snug)] font-semibold tracking-[var(--tracking-tight)]">
                Good code.
                <br />
                Clear thinking.
                <br />
                <em className="font-[Georgia,serif] tracking-[-0.04em] text-accent italic">
                  Meaningful impact.
                </em>
              </h3>
              <p className="relative z-[1] mx-auto mb-6 max-w-[65ch] text-sm leading-[var(--leading-body)] text-ink-secondary">
                Understand the problem. Question the assumptions.
                <br />
                Build with intent. Keep improving.
              </p>
              <SplitAction href="#contact" className="relative z-[1]">
                LET’S MAKE SOMETHING
              </SplitAction>
            </article>

            {/* Right Bento Stack: Achievements */}
            <div data-curtain-bento-right className="flex flex-col gap-4">
              {achievements.map((item) => (
                <article
                  key={item.id}
                  data-reveal
                  data-spotlight
                  className="spotlight-glow flex flex-1 gap-4 rounded-[var(--radius-md)] border border-border-subtle bg-glass px-5 py-4 shadow-card transition-[border-color,background-color,translate] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-border-strong hover:bg-glass-hover"
                >
                  <span className="pt-0.5 font-mono text-xs text-accent">
                    {item.id}.
                  </span>
                  <div className="min-w-0">
                    <h3 className="mb-1 font-display text-md font-medium tracking-[var(--tracking-snug)]">
                      {item.title}
                    </h3>
                    <p className="max-w-[65ch] text-sm leading-[var(--leading-body)] text-ink-secondary">
                      {item.text}
                    </p>
                    {"href" in item && item.href && (
                      <a
                        className="underline-sweep mt-2 inline-flex min-h-8 items-center border-b border-border-strong font-mono text-[11px] text-ink transition-colors duration-[var(--duration-fast)] hover:text-accent"
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.linkLabel}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
