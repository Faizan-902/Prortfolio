"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type FaqItem = readonly [string, string];

/** Accessible smooth-expanding FAQ list with single-active toggle and + -> x indicator. */
export default function FaqAccordion({
  items,
}: {
  items: ReadonlyArray<FaqItem>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {items.map(([question, answer], index) => {
        const isOpen = openIndex === index;
        const buttonId = `faq-trigger-${index}`;
        const panelId = `faq-panel-${index}`;
        return (
          <div
            key={question}
            data-reveal
            className="border-b border-border-subtle first:border-t first:border-border-subtle"
          >
            <button
              type="button"
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-display text-md tracking-[var(--tracking-snug)] transition-colors duration-[var(--duration-fast)] hover:text-accent"
            >
              <span>{question}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "shrink-0 font-mono text-[1.4rem] font-normal transition-[transform,color] duration-[var(--duration-base)] ease-[var(--ease-out)]",
                  isOpen && "rotate-45 text-accent",
                )}
              >
                +
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              inert={!isOpen || undefined}
              data-open={isOpen ? "true" : "false"}
              className="faq-panel"
            >
              <div>
                <p className="max-w-[65ch] pr-8 pb-5 text-base leading-[var(--leading-relaxed)] text-ink-secondary">
                  {answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
