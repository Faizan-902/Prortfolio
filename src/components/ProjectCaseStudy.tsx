"use client";

import { useRef } from "react";

type Project = {
  name: string;
  kind: string;
  stack: string[];
  github: string;
  demo?: string;
};

const notes: Record<
  string,
  {
    role: string;
    challenge: string;
    contribution: string[];
    decisions: { title: string; text: string }[];
  }
> = {
  pulse: {
    role: "Full-stack development",
    challenge:
      "Monitoring an endpoint is easy. Keeping checks safe, scheduled, persistent, and useful across failures is the harder engineering problem.",
    contribution: [
      "Built an Express API and React dashboard backed by PostgreSQL check history and incidents.",
      "Implemented persistent worker scheduling with database leases to prevent duplicate jobs.",
      "Added SSRF protection, Argon2id authentication, CSRF protection, and ownership checks.",
    ],
    decisions: [
      {
        title: "Scheduling belongs outside the browser.",
        text: "A separately runnable worker persists checks and incidents, with database-backed coordination between workers.",
      },
      {
        title: "Network access needs boundaries.",
        text: "Monitored URLs are treated as untrusted input. Public address validation and redirect checks help protect internal network targets.",
      },
    ],
  },
  sync: {
    role: "Co-led team project · Backend and AI flows",
    challenge:
      "A multi-character story needs more than one narrator. The pipeline has to connect novel analysis, character identity, voice assignment, storage, and synthesis.",
    contribution: [
      "Co-led the group project and contributed backend flows for novel analysis and character detection.",
      "Worked on voice assignment and planned character voice progression to reflect aging.",
      "Collaborated on persistent storage, background workers, and text-to-speech integration.",
    ],
    decisions: [
      {
        title: "Separate analysis from synthesis.",
        text: "Character detection and voice assignment form explicit steps before audio generation, making the pipeline easier to reason about.",
      },
      {
        title: "Treat generation as background work.",
        text: "Persistent storage and worker-based processing support long-running audio tasks beyond an individual browser request.",
      },
    ],
  },
  intern: {
    role: "Team HumanBot · Evaluation and verification",
    challenge:
      "Internship recommendations need more than a similarity score. Eligibility, ranking, scam signals, and generated claims all need transparent checks.",
    contribution: [
      "Built a deterministic eligibility engine and transparent hybrid ranking logic.",
      "Implemented scam-signal detection, grounded document generation, and claim verification.",
      "Created evaluation benchmarks and scenario tests for the verification modules.",
    ],
    decisions: [
      {
        title: "Hard constraints come first.",
        text: "Eligibility checks are deterministic, so a semantic match cannot override requirements that an applicant does not meet.",
      },
      {
        title: "Make recommendations explainable.",
        text: "Ranking and verification expose the reasoning behind a result rather than presenting an unexplained score.",
      },
    ],
  },
  env: {
    role: "Python CLI and SDK development",
    challenge:
      "Missing, invalid, or inconsistent environment variables can delay a deployment or break an otherwise correct application.",
    contribution: [
      "Built commands to validate, compare, and synchronize environment files.",
      "Added typed validation rules and safe environment-template generation.",
      "Implemented atomic writes and deterministic exit codes for CI workflows.",
    ],
    decisions: [
      {
        title: "Configuration checks should be composable.",
        text: "The CLI supports terminal and CI use, while the SDK allows validation to become part of application startup or a test suite.",
      },
      {
        title: "File writes should preserve intent.",
        text: "Atomic writes and careful parsing reduce the chance of a tooling command leaving configuration partially updated.",
      },
    ],
  },
};

export default function ProjectCaseStudy({ project }: { project: Project }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const note = notes[project.kind];

  return (
    <>
      <button
        id={`case-study-btn-${project.kind}`}
        type="button"
        className="case-study-button underline-sweep inline-flex min-h-10 items-center border-0 border-b border-current bg-transparent pb-0.5 font-mono text-[12px] whitespace-nowrap uppercase transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-accent"
        onClick={() => dialog.current?.showModal()}
      >
        Inside the build <span className="ml-2">↗</span>
      </button>
      <dialog
        ref={dialog}
        data-lenis-prevent
        className="m-auto max-h-[88svh] w-[min(1060px,94vw)] overscroll-contain rounded-[var(--radius-md)] border border-border-strong bg-dialog p-0 text-ink shadow-elevated backdrop:bg-black/75 backdrop:backdrop-blur-[var(--blur-md)]"
        aria-label={`${project.name} engineering case study`}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="px-[clamp(1.25rem,3vw,2.75rem)] pb-12">
          <header className="sticky top-0 z-[2] flex items-center justify-between border-b border-border-subtle bg-dialog py-4 font-mono text-[12px] uppercase">
            <span>Engineering notes</span>
            <button
              type="button"
              className="close-button inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border-subtle bg-pill text-2xl leading-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-accent hover:bg-pill-hover"
              aria-label={`Close ${project.name} case study`}
              onClick={() => dialog.current?.close()}
              autoFocus
            >
              ×
            </button>
          </header>
          <p className="pt-8 pb-4 font-mono text-[12px] text-accent uppercase">
            {note.role}
          </p>
          <h2 className="mb-6 font-display text-2xl leading-[var(--leading-snug)] font-semibold tracking-[var(--tracking-tight)]">
            {project.name}
          </h2>
          <p className="max-w-[65ch] text-md leading-normal text-ink-secondary">
            {note.challenge}
          </p>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            <section>
              <h3 className="mb-4 font-display text-lg font-medium tracking-[var(--tracking-snug)]">
                My contribution
              </h3>
              <ul className="max-w-[65ch] list-disc pl-4 text-base leading-[var(--leading-body)] text-ink-secondary">
                {note.contribution.map((item) => (
                  <li className="mb-3" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="mb-4 font-display text-lg font-medium tracking-[var(--tracking-snug)]">
                Engineering decisions
              </h3>
              {note.decisions.map((item) => (
                <div className="mb-6" key={item.title}>
                  <h4 className="mb-2 text-[1.05rem] font-semibold">
                    {item.title}
                  </h4>
                  <p className="max-w-[65ch] text-base leading-[var(--leading-body)] text-ink-secondary">
                    {item.text}
                  </p>
                </div>
              ))}
            </section>
          </div>
          <footer className="mt-6 flex flex-wrap items-center gap-4 border-t border-border-subtle pt-6 font-mono text-[11px]">
            <div className="mb-2 flex w-full flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  className="rounded-[var(--radius-xs)] border border-border-subtle bg-pill px-3 py-1.5"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>
            <a
              className="underline-sweep inline-flex min-h-9 items-center border-b border-border-strong transition-colors duration-[var(--duration-fast)] hover:border-accent hover:text-accent"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore the source ↗
            </a>
            {project.demo && (
              <a
                className="underline-sweep inline-flex min-h-9 items-center border-b border-border-strong transition-colors duration-[var(--duration-fast)] hover:border-accent hover:text-accent"
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open the live project ↗
              </a>
            )}
          </footer>
        </div>
      </dialog>
    </>
  );
}
