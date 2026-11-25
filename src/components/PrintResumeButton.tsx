"use client";

export default function PrintResumeButton() {
  return (
    <button
      type="button"
      className="inline-flex min-h-10 items-center rounded-[var(--radius-xs)] border border-border-subtle bg-glass px-4 font-mono text-[12px] text-ink transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-accent hover:bg-glass-hover"
      onClick={() => window.print()}
    >
      PRINT / SAVE PDF ↗
    </button>
  );
}
