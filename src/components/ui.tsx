import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-[3px]", className)}
      aria-hidden="true"
    >
      <i className="block h-3.5 w-3.5 bg-current" />
      <i className="block h-3.5 w-3.5 rounded-full bg-accent" />
      <i className="block h-3.5 w-3.5 rounded-full bg-current" />
    </span>
  );
}

export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 flex items-center justify-between border-t border-border-subtle pt-4 font-mono text-xs tracking-[var(--tracking-mono)] text-ink-secondary",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <b className="text-[1.2rem] leading-none font-normal text-accent">✳</b>{" "}
        {children}
      </span>
      <span>@FAIZAN902</span>
    </div>
  );
}

export function SplitAction({
  href,
  children,
  external = false,
  className,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const sharedClass = cn(
    "group/btn inline-flex shrink-0 items-stretch font-mono text-xs tracking-[var(--tracking-mono)] whitespace-nowrap text-cta-ink [transform:translate3d(var(--mx,0px),var(--my,0px),0)] transition-translate duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:-translate-y-0.5 active:scale-[0.985] motion-reduce:transform-none motion-reduce:translate-none motion-reduce:transition-none",
    className,
  );

  const inner = (
    <>
      <span className="clip-skew rounded-[var(--radius-xs)] bg-cta px-5 py-4 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] group-hover/btn:bg-accent-solid group-hover/btn:text-accent-ink">
        ⇥
      </span>
      <span className="clip-skew rounded-[var(--radius-xs)] bg-cta px-6.5 py-4 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] group-hover/btn:bg-accent-solid group-hover/btn:text-accent-ink">
        {children}
      </span>
    </>
  );

  if (external || href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <a
        className={sharedClass}
        data-magnetic
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link className={sharedClass} data-magnetic href={href}>
      {inner}
    </Link>
  );
}

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-border-subtle bg-glass shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}
