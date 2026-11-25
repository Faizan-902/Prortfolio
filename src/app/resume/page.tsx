import type { Metadata } from "next";
import Link from "next/link";
import { projects, skills, socialLinks } from "@/data/portfolio";
import PrintResumeButton from "@/components/PrintResumeButton";

export const metadata: Metadata = {
  title: "Resume — Mohd Faizan Khan",
  description:
    "Resume and engineering overview for Mohd Faizan Khan, Computer Science student and full-stack software engineer in Bengaluru.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <main className="min-h-svh bg-canvas px-[var(--spacing-gutter)] pt-8 pb-16 print:bg-white print:p-0">
      <div className="mx-auto mb-6 flex max-w-[920px] items-center justify-between gap-4 print:hidden">
        <Link
          className="inline-flex min-h-10 items-center rounded-[var(--radius-xs)] border border-border-subtle bg-glass px-4 font-mono text-[12px] text-ink transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-accent hover:bg-glass-hover"
          href="/"
        >
          ← BACK TO PORTFOLIO
        </Link>
        <PrintResumeButton />
      </div>

      <article className="mx-auto max-w-[920px] rounded-[var(--radius-md)] border border-border-subtle bg-glass-strong p-[clamp(1.5rem,4vw,3rem)] shadow-elevated print:border-0 print:bg-white print:p-0 print:shadow-none">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-border-subtle pb-8">
          <div>
            <p className="font-mono text-xs tracking-[var(--tracking-mono)] text-accent">
              SOFTWARE ENGINEER / BENGALURU, INDIA
            </p>
            <h1 className="mt-2 mb-3 font-display text-2xl leading-[var(--leading-snug)] font-semibold tracking-[var(--tracking-tight)]">
              Mohd Faizan Khan
            </h1>
            <p className="max-w-[65ch] leading-[var(--leading-body)] text-ink-secondary print:text-[#333]">
              Software engineering student turning complex problems into
              thoughtful applications through code, curiosity, and a relentless
              drive to build things that matter.
            </p>
          </div>
          <div className="flex flex-col gap-2 font-mono text-[12px]">
            <a
              className="hover:text-accent"
              href="mailto:2102508769@svyasa-sas.edu.in"
            >
              2102508769@svyasa-sas.edu.in ↗
            </a>
            {socialLinks.map((link) => (
              <a
                className="hover:text-accent"
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.name} ↗
              </a>
            ))}
          </div>
        </header>

        <section className="border-b border-border-subtle py-6">
          <h2 className="mb-4 font-mono text-[12px] tracking-[var(--tracking-mono)] text-accent">
            EDUCATION
          </h2>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <div>
              <h3 className="font-display text-md font-medium">
                Bachelor of Technology in Computer Science
              </h3>
              <p className="text-sm leading-[var(--leading-body)] text-ink-secondary print:text-[#333]">
                Newton School of Technology, S-VYASA, Bengaluru
              </p>
            </div>
            <div className="flex gap-4 font-mono text-xs text-ink-muted print:text-[#333]">
              <span>2025 — 2029</span>
              <span>CGPA: 8.56 / 10</span>
            </div>
          </div>
        </section>

        <section className="border-b border-border-subtle py-6">
          <h2 className="mb-4 font-mono text-[12px] tracking-[var(--tracking-mono)] text-accent">
            SELECTED PROJECTS
          </h2>
          <div className="grid gap-4">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="mb-1 font-display text-md font-medium">
                    {p.name}
                  </h3>
                  <span className="font-mono text-xs text-ink-muted">
                    {p.stack.join(" · ")}
                  </span>
                </div>
                <p className="max-w-[65ch] text-sm leading-[var(--leading-body)] text-ink-secondary print:text-[#333]">
                  {p.detail}
                </p>
                <div className="mt-2 flex gap-4 font-mono text-xs">
                  <a
                    className="hover:text-accent"
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source ↗
                  </a>
                  {p.demo && (
                    <a
                      className="hover:text-accent"
                      href={p.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-border-subtle py-6">
          <h2 className="mb-4 font-mono text-[12px] tracking-[var(--tracking-mono)] text-accent">
            TECHNICAL SKILLS
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {skills.map((group) => (
              <div key={group.title}>
                <h3 className="mb-1 font-display text-md font-medium">
                  {group.title}
                </h3>
                <p className="text-sm leading-[var(--leading-body)] text-ink-secondary print:text-[#333]">
                  {group.items.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-6">
          <h2 className="mb-4 font-mono text-[12px] tracking-[var(--tracking-mono)] text-accent">
            ACHIEVEMENTS &amp; MILESTONES
          </h2>
          <ul className="m-0 grid list-disc gap-2 pl-4 text-sm leading-[var(--leading-body)] text-ink-secondary print:text-[#333]">
            <li>
              <strong>ICPC Preliminary Online Round:</strong> Team Three
              Pointerss · 3 problems solved · 2,305th rank in the Final Regional
              Selection Pool.
            </li>
            <li>
              <strong>Inclusive Open Source:</strong> Linux Foundation LFC102 ·
              Inclusive Open Source Community Orientation · November 2026.
            </li>
            <li>
              <strong>Campfire Hackathon:</strong> Team-based game development,
              rapid prototyping, frontend development, and collaborative
              problem-solving.
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}
