"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects, skills, socialLinks } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import BackgroundVideo from "./BackgroundVideo";
import MotionObserver from "./MotionObserver";
import { ProjectArtwork } from "./ProjectArtwork";
import ProjectCaseStudy from "./ProjectCaseStudy";
import { BrandMark, GlassCard, SectionLabel, SplitAction } from "./ui";

const email = "mailto:2102508769@svyasa-sas.edu.in";

const faqs = [
  [
    "What are you building right now?",
    "I’m developing full-stack applications, AI workflows, and developer tools. Explore the selected projects above for live demos, source code, and engineering notes.",
  ],
  [
    "What opportunities are you looking for?",
    "Internships, open-source contributions, and collaborative software projects where I can put my backend, frontend, and problem-solving skills to work.",
  ],
  [
    "What is your role in the team projects?",
    "I co-led SyncTone and contributed to its backend and AI flows. For Team HumanBot’s InternIQ, I built eligibility, ranking, scam-signal detection, and verification modules. Each project includes a detailed contribution breakdown.",
  ],
  [
    "What’s the best way to reach you?",
    "Email me at 2102508769@svyasa-sas.edu.in, or connect with me on LinkedIn. I’d love to hear what you’re working on.",
  ],
];

const skillArtColors = [
  "bg-[#bdc0bf]",
  "bg-[#b6c5cb]",
  "bg-[#b75432]",
  "bg-[#d8c9b8]",
  "bg-[#737d6c]",
  "bg-[#e47d5a]",
];

export default function PortfolioExperience() {
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const headerRef = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = document.documentElement.dataset.theme;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    }
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("faizan-theme", next);
      } catch {
        // Ignore storage quota / privacy mode errors
      }
      return next;
    });
  }

  useEffect(() => {
    if (!menu) return;
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    const onOutsidePointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenu(false);
      }
    };
    const onViewportChange = () => {
      if (desktopQuery.matches) setMenu(false);
    };
    document.addEventListener("keydown", onEscape);
    document.addEventListener("pointerdown", onOutsidePointer, {
      passive: true,
    });
    desktopQuery.addEventListener("change", onViewportChange);
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("pointerdown", onOutsidePointer);
      desktopQuery.removeEventListener("change", onViewportChange);
    };
  }, [menu]);

  return (
    <>
      <BackgroundVideo />
      <MotionObserver />
      <div
        data-scroll-progress
        aria-hidden="true"
        className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[2px] origin-left scale-x-0 bg-accent transition-none"
      />
      <a
        className="fixed -top-28 left-4 z-[9999] rounded-[var(--radius-xs)] bg-cta px-4 py-3 font-mono text-xs text-cta-ink transition-[top] duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:top-4"
        href="#work"
      >
        Skip to selected projects
      </a>

      <header
        ref={headerRef}
        className="site-header group/header fixed top-3 right-0 left-0 z-50 px-[var(--spacing-gutter)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] focus-within:translate-y-0 motion-reduce:transform-none [&.is-hidden]:-translate-y-[calc(100%+24px)]"
      >
        <div
          className={cn(
            "floating-nav mx-auto w-full max-w-[var(--container-max)] rounded-[var(--radius-md)] border border-border-subtle bg-nav shadow-card backdrop-blur-[var(--blur-sm)] transition-[background-color,border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)]",
            "group-[.is-scrolled]/header:border-border-strong group-[.is-scrolled]/header:bg-nav-scrolled group-[.is-scrolled]/header:shadow-elevated",
            menu && "border-border-strong bg-glass-strong shadow-elevated",
          )}
        >
          <div className="flex h-14 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4">
            <a
              className="inline-flex min-h-9 shrink-0 items-center"
              href="#home"
              aria-label="Faizan home"
            >
              <BrandMark />
            </a>
            <nav
              className="hidden items-center gap-1 min-[901px]:flex"
              aria-label="Primary sections"
            >
              {[
                ["Work", "#work", "work"],
                ["Expertise", "#expertise", "expertise"],
                ["About", "#about", "about"],
                ["Contact", "#contact", "contact"],
              ].map(([label, href, id]) => (
                <a
                  key={id}
                  href={href}
                  data-nav-link={id}
                  className="rounded-full px-3 py-1.5 font-mono text-[12px] text-ink-secondary transition-[color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-pill hover:text-ink [&.is-active]:bg-pill-hover [&.is-active]:text-ink"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                className="inline-flex h-[34px] [transform:translate3d(var(--mx,0px),var(--my,0px),0)] items-center gap-1 rounded-[var(--radius-xs)] border border-border-subtle bg-pill px-2.5 font-mono text-[10px] whitespace-nowrap text-ink transition-[background-color,border-color,color] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-border-strong hover:bg-pill-hover sm:px-3 sm:text-[11px]"
                href="/resume"
                data-magnetic
              >
                RESUME
              </Link>
              <a
                className="nav-cta-primary inline-flex h-[34px] [transform:translate3d(var(--mx,0px),var(--my,0px),0)] items-center gap-1 rounded-[var(--radius-xs)] bg-cta px-2.5 font-mono text-[10px] whitespace-nowrap text-cta-ink transition-[background-color,color] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-accent-solid hover:text-accent-ink sm:px-3 sm:text-[11px]"
                href={email}
                data-magnetic
              >
                CONTACT <span>↗</span>
              </a>
              <button
                type="button"
                className="theme-toggle inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border border-border-subtle bg-pill text-sm text-ink-secondary transition-[background-color,border-color,color] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-border-strong hover:bg-pill-hover hover:text-ink"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                aria-pressed={theme === "light"}
              >
                <span aria-hidden="true">{theme === "dark" ? "◐" : "☀"}</span>
              </button>
              <button
                ref={menuButton}
                type="button"
                className="menu-toggle flex h-[34px] w-[34px] flex-col items-center justify-between border-0 bg-transparent px-[5px] py-[7px] min-[901px]:hidden"
                aria-label={menu ? "Close navigation" : "Open navigation"}
                aria-expanded={menu}
                aria-controls="main-menu"
                onClick={() => setMenu(!menu)}
              >
                <i
                  className={cn(
                    "h-[1.5px] w-5 rounded-[1px] bg-current transition-[transform,opacity] duration-[var(--duration-base)] ease-[var(--ease-out)]",
                    menu && "translate-y-[9px] rotate-45",
                  )}
                />
                <i
                  className={cn(
                    "h-[1.5px] w-5 rounded-[1px] bg-current transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                    menu && "opacity-0",
                  )}
                />
                <i
                  className={cn(
                    "h-[1.5px] w-5 rounded-[1px] bg-current transition-[transform,opacity] duration-[var(--duration-base)] ease-[var(--ease-out)]",
                    menu && "-translate-y-[9px] -rotate-45",
                  )}
                />
              </button>
            </div>
          </div>
          {menu && (
            <nav
              id="main-menu"
              className="border-t border-border-subtle px-6 pt-6 pb-4"
              aria-label="Main navigation"
            >
              <div>
                <span className="mb-3 block font-mono text-xs text-ink-muted">
                  EXPLORE
                </span>
                {[
                  ["Home", "#home"],
                  ["Selected work", "#work"],
                  ["My expertise", "#expertise"],
                  ["About me", "#about"],
                  ["Resume", "/resume"],
                  ["Get in touch", "#contact"],
                ].map(([title, url], i) =>
                  url.startsWith("#") ? (
                    <a
                      key={url}
                      href={url}
                      onClick={() => setMenu(false)}
                      className="flex items-center gap-4 py-2 font-display text-lg transition-[color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:translate-x-1 hover:text-accent"
                    >
                      <small className="font-mono text-[11px] text-ink-muted">
                        0{i + 1}
                      </small>
                      {title}
                      <span className="ml-auto text-[1.15rem]">↗</span>
                    </a>
                  ) : (
                    <Link
                      key={url}
                      href={url}
                      onClick={() => setMenu(false)}
                      className="flex items-center gap-4 py-2 font-display text-lg transition-[color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:translate-x-1 hover:text-accent"
                    >
                      <small className="font-mono text-[11px] text-ink-muted">
                        0{i + 1}
                      </small>
                      {title}
                      <span className="ml-auto text-[1.15rem]">↗</span>
                    </Link>
                  ),
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 border-t border-border-subtle pt-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] hover:text-accent"
                  >
                    {s.name} ↗
                  </a>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="relative z-[1]">
        <section
          id="home"
          data-nav-section="home"
          className="relative flex min-h-svh flex-col justify-between gap-6 overflow-clip px-[var(--spacing-gutter)] pt-[104px] pb-6"
          aria-label="Mohd Faizan Khan, software engineer"
        >
          <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col items-start justify-between gap-6 sm:flex-row">
            <GlassCard className="w-full max-w-[380px] p-6">
              <p className="hero-reveal mb-3 font-mono text-xs leading-normal text-ink-secondary [animation-delay:0ms]">
                Mohd Faizan Khan / Software engineer
              </p>
              <p className="hero-reveal mb-6 max-w-[65ch] font-display text-lg leading-[1.25] font-medium tracking-[var(--tracking-snug)] [animation-delay:45ms]">
                Thoughtful code.
                <br />
                Distinctive experiences.
                <br />
                Built to make an impact.
              </p>
              <a
                className="hero-reveal underline-sweep flex min-h-10 items-center justify-between border-b border-border-strong pb-2 font-mono text-xs tracking-[var(--tracking-mono)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] [animation-delay:90ms] hover:text-accent"
                href="#work"
              >
                EXPLORE SELECTED WORK{" "}
                <span
                  className="text-[1.15rem] leading-none"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
              <nav
                className="mt-3 flex flex-wrap gap-x-4 gap-y-1"
                aria-label="My coding and professional profiles"
              >
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-sweep inline-flex min-h-9 items-center gap-1 border-b border-border-subtle font-mono text-[12px] text-ink-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-ink"
                  >
                    {link.name}
                    <span className="text-[11px] opacity-70" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ))}
              </nav>
            </GlassCard>

            <a
              className="hero-reveal inline-flex min-w-[154px] items-center justify-between gap-4 rounded-[var(--radius-xs)] border border-border-subtle bg-glass px-3.5 py-3 font-mono text-xs tracking-[var(--tracking-mono)] shadow-card backdrop-blur-[var(--blur-sm)] transition-[background-color,border-color,translate] duration-[var(--duration-fast)] ease-[var(--ease-out)] [animation-delay:110ms] hover:-translate-y-0.5 hover:border-border-strong hover:bg-glass-hover"
              href="https://pulsecheck-seven.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              PULSECHECK{" "}
              <span className="text-[1.25rem] leading-none text-accent">⊕</span>
            </a>
          </div>

          <div className="mx-auto hidden w-full max-w-[var(--container-max)] items-center justify-end gap-3 font-mono text-xs text-ink-secondary sm:flex">
            <span>©2026</span>
            <span className="text-[1.15rem] tracking-[3px] opacity-45">
              ╵╵╵╵╵│╵╵╵╵╵
            </span>
            <span>01′</span>
          </div>

          <div
            data-hero-parallax
            className="mx-auto w-full max-w-[var(--container-max)] will-change-transform motion-reduce:transform-none"
          >
            <div className="mb-3 flex justify-between font-mono text-[1.1rem] text-ink-muted">
              <span>+</span>
              <span>+</span>
              <span>+</span>
              <span>+</span>
            </div>
            <div className="flex flex-col items-start gap-4 overflow-clip sm:flex-row sm:items-center sm:gap-[4vw]">
              <h1
                className="word-gradient-hero shrink-0 bg-clip-text font-display text-[length:var(--text-hero)] leading-[0.88] font-bold tracking-[var(--tracking-tightest)] whitespace-nowrap text-transparent"
                aria-label="Mohd Faizan Khan"
              >
                FAIZAN
              </h1>
              <div className="w-full min-w-[160px] flex-1 overflow-hidden font-mono text-xs leading-[1.45] text-ink-secondary sm:h-[142px] sm:w-auto">
                <div
                  data-loop-anim
                  className="grid grid-cols-2 gap-x-3 gap-y-2 will-change-transform sm:flex sm:[animation:var(--animate-specialties)] sm:flex-col sm:gap-3"
                >
                  <span>SOFTWARE ENGINEERING</span>
                  <span>FULL-STACK DEVELOPMENT</span>
                  <span>AI APPLICATIONS</span>
                  <span>CREATIVE DEVELOPMENT</span>
                  <span className="hidden sm:inline">ALGORITHMIC THINKING</span>
                  <span className="hidden sm:inline" aria-hidden="true">
                    SOFTWARE ENGINEERING
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="border-t border-border-subtle bg-section-tint px-[var(--spacing-gutter)] pt-16 pb-12"
          aria-label="Tools I build with"
        >
          <div className="mx-auto max-w-[var(--container-max)]">
            <SectionLabel className="mb-12">MY BUILDING BLOCKS</SectionLabel>
            <div className="mask-marquee overflow-hidden">
              <div
                data-loop-anim
                className="flex w-max [animation:var(--animate-marquee)] gap-[clamp(2.5rem,6vw,5.5rem)] will-change-transform"
              >
                {[
                  ...[
                    "React",
                    "Node.js",
                    "Python",
                    "PostgreSQL",
                    "JavaScript",
                    "Docker",
                  ],
                  ...[
                    "React",
                    "Node.js",
                    "Python",
                    "PostgreSQL",
                    "JavaScript",
                    "Docker",
                  ],
                ].map((t, i) => (
                  <span
                    key={i}
                    aria-hidden={i >= 6}
                    className="flex items-center gap-2 font-display text-[clamp(1.35rem,2.2vw,1.9rem)] font-semibold tracking-[var(--tracking-tight)] whitespace-nowrap text-ink-secondary"
                  >
                    <b className="font-mono text-[1.25em] font-normal text-accent">
                      {["⚛", "⬡", "⌘", "◉", "JS", "▧"][i % 6]}
                    </b>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          data-nav-section="about"
          className="bg-section-tint px-[var(--spacing-gutter)] py-[var(--spacing-section)]"
        >
          <div className="mx-auto max-w-[var(--container-max)]">
            <SectionLabel>A LITTLE ABOUT ME</SectionLabel>
            <div className="grid grid-cols-1 gap-12 min-[901px]:grid-cols-[1fr_2fr]">
              <div
                className="flex gap-6 font-mono text-xs leading-[1.75] text-ink-secondary"
                data-reveal
              >
                <span className="text-[3.5rem] leading-none text-accent">
                  ✳
                </span>
                <p className="max-w-[65ch]">
                  MOHD FAIZAN KHAN
                  <br />
                  CSE STUDENT &amp; BUILDER
                  <br />
                  BENGALURU, INDIA
                </p>
              </div>
              <div>
                <h2 className="word-reveal font-display text-2xl leading-[1.18] font-semibold tracking-[var(--tracking-tight)] text-ink">
                  I’m a software engineering student turning complex problems
                  into thoughtful applications through code, curiosity, and a
                  relentless drive to build things that matter.
                </h2>
                <SplitAction
                  className="mt-8"
                  href="https://github.com/Faizan-902"
                  external
                >
                  MORE ABOUT MY WORK
                </SplitAction>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-4 min-[901px]:grid-cols-4">
              {[
                ["300+", "ALGORITHMIC PROBLEMS"],
                ["04", "SELECTED PROJECTS"],
                ["8.56", "CGPA / 10.0"],
                ["2029", "B.TECH GRADUATION"],
              ].map(([num, label]) => (
                <div
                  key={label}
                  data-reveal
                  data-tilt
                  className="tilt-glow rounded-[var(--radius-md)] border border-border-subtle bg-glass px-6 py-8 shadow-card transition-[border-color,background-color,box-shadow,translate] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-border-strong hover:bg-glass-hover hover:shadow-elevated"
                >
                  <strong className="mb-3 block font-display text-[clamp(2.75rem,5.8vw,5.5rem)] leading-[1.05] font-medium tracking-[var(--tracking-tightest)]">
                    {num}
                  </strong>
                  <span className="font-mono text-[11px] tracking-[var(--tracking-mono)] text-ink-muted">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div
          className="overflow-hidden border-b border-border-subtle bg-section-tint pt-3 pb-16"
          aria-hidden="true"
        >
          <div
            data-loop-anim
            className="flex w-max [animation:var(--animate-ticker)] items-center gap-8 font-display text-[clamp(3.75rem,9.5vw,10rem)] leading-none font-semibold tracking-[var(--tracking-tightest)] text-ink will-change-transform"
          >
            THINK <b className="font-normal text-accent">+</b> BUILD{" "}
            <b className="font-normal text-accent">+</b> REFINE{" "}
            <b className="font-normal text-accent">+</b> IMPACT{" "}
            <b className="font-normal text-accent">+</b> THINK{" "}
            <b className="font-normal text-accent">+</b> BUILD{" "}
            <b className="font-normal text-accent">+</b> REFINE{" "}
            <b className="font-normal text-accent">+</b> IMPACT{" "}
            <b className="font-normal text-accent">+</b>
          </div>
        </div>

        <section
          id="work"
          data-nav-section="work"
          className="relative isolate bg-section-deep px-[var(--spacing-gutter)] pt-[var(--spacing-section)] pb-16"
        >
          <div className="mx-auto max-w-[var(--container-max)]">
            <SectionLabel>SELECTED PROJECTS</SectionLabel>
            <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
              <h2
                className="max-w-[820px] font-display text-2xl leading-[var(--leading-snug)] font-semibold tracking-[var(--tracking-tight)]"
                data-reveal
              >
                Projects with real
                <br />
                problems to solve.
              </h2>
              <SplitAction
                href="https://github.com/Faizan-902?tab=repositories"
                external
              >
                EXPLORE GITHUB
              </SplitAction>
            </div>

            <div className="relative flex flex-col gap-8">
              {projects.map((p, i) => (
                <article
                  className="project-card relative grid origin-top transform-gpu grid-cols-1 gap-3 rounded-[var(--radius-lg)] border border-border-subtle bg-glass-strong p-2 shadow-elevated transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)] will-change-transform [contain:layout_paint] hover:border-border-strong hover:shadow-glow min-[901px]:sticky min-[901px]:top-[calc(84px+var(--card-index)*18px)] min-[901px]:min-h-[510px] min-[901px]:grid-cols-2"
                  key={p.id}
                  style={{ "--card-index": i } as React.CSSProperties}
                  aria-labelledby={`project-${p.id}`}
                >
                  <div className="flex min-w-0 flex-col rounded-[var(--radius-md)] border border-border-subtle bg-glass p-[clamp(1.5rem,3vw,2.75rem)]">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <h3
                        id={`project-${p.id}`}
                        className="flex items-center gap-2 font-display text-lg font-medium tracking-[var(--tracking-snug)] whitespace-nowrap"
                      >
                        <span className="text-2xl text-accent">
                          {["◈", "◉", "✳", "⌘"][i]}
                        </span>
                        {p.name}
                      </h3>
                      <span className="font-mono text-xs whitespace-nowrap text-ink-muted">
                        0{i + 1} / 04
                      </span>
                    </div>
                    <p className="max-w-[65ch] border-b border-dashed border-border-dashed pb-6 text-base leading-[var(--leading-body)] text-ink-secondary">
                      {p.detail}
                    </p>
                    <dl className="mb-8">
                      <div className="border-b border-dashed border-border-dashed py-4">
                        <dt className="mb-2 font-mono text-[11px] text-ink-muted">
                          FOCUS:
                        </dt>
                        <dd className="text-md text-ink">
                          {p.category
                            .replace(" · TEAM PROJECT", "")
                            .toLowerCase()}
                        </dd>
                      </div>
                      <div className="border-b border-dashed border-border-dashed py-4">
                        <dt className="mb-2 font-mono text-[11px] text-ink-muted">
                          BUILT WITH:
                        </dt>
                        <dd className="text-md text-ink">
                          {p.stack.join(" · ")}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                      <ProjectCaseStudy project={p} />
                      <div className="flex flex-wrap justify-end gap-3">
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline-sweep inline-flex min-h-10 items-center font-mono text-[12px] text-ink-secondary transition-colors duration-[var(--duration-fast)] hover:text-accent"
                        >
                          GITHUB
                          <span className="sr-only">
                            {" "}
                            — {p.name} source code
                          </span>{" "}
                          ↗
                        </a>
                        {p.demo && (
                          <a
                            href={p.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-sweep inline-flex min-h-10 items-center font-mono text-[12px] text-ink-secondary transition-colors duration-[var(--duration-fast)] hover:text-accent"
                          >
                            LIVE DEMO
                            <span className="sr-only"> — {p.name}</span> ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative min-h-[360px] overflow-clip rounded-[var(--radius-md)] border border-border-subtle min-[901px]:min-h-[480px]">
                    <ProjectArtwork kind={p.kind} />
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-border-subtle pt-6 font-mono text-[11px] text-ink-muted">
              <span>IDEAS ARE ONLY THE BEGINNING.</span>
              <span>THE BUILD IS WHAT COUNTS. ↘</span>
            </div>
          </div>
        </section>

        <section
          id="expertise"
          data-nav-section="expertise"
          className="bg-section-tint px-[var(--spacing-gutter)] py-[var(--spacing-section)]"
        >
          <div className="mx-auto max-w-[var(--container-max)]">
            <SectionLabel>MY EXPERTISE</SectionLabel>
            <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
              <h2 className="word-reveal max-w-[900px] font-display text-2xl leading-[var(--leading-snug)] font-semibold tracking-[var(--tracking-tight)]">
                From the first line of code to the final interaction. A toolkit
                built for thoughtful digital experiences.
              </h2>
              <SplitAction href="#contact">LET’S BUILD SOMETHING</SplitAction>
            </div>

            <div className="flex flex-col gap-8 overflow-clip py-3">
              {skills.map((skill, i) => (
                <article
                  className={cn(
                    "skill-card spotlight-glow group ml-auto grid min-h-[264px] w-full transform-gpu grid-cols-1 items-start gap-6 rounded-[var(--radius-md)] border border-border-subtle bg-glass p-3 shadow-card transition-[background-color,border-color,box-shadow,translate] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-border-strong hover:bg-glass-hover hover:shadow-elevated min-[901px]:w-[78%] min-[901px]:grid-cols-[1.25fr_1fr_0.9fr] min-[901px]:even:ml-0 min-[901px]:even:grid-cols-[1fr_0.9fr_1.25fr] xl:w-[min(62%,900px)]",
                  )}
                  data-skill-panel={i}
                  data-spotlight
                  key={skill.title}
                >
                  <div
                    className={cn(
                      "relative flex min-h-[244px] items-center justify-center overflow-clip rounded-[var(--radius-sm)] text-[#15181c] min-[901px]:col-start-1 min-[901px]:row-start-1 min-[901px]:group-even:col-start-3",
                      skillArtColors[i],
                    )}
                    aria-hidden="true"
                  >
                    <div
                      data-skill-glyph
                      className="flex h-full w-full transform-gpu items-center justify-center will-change-transform"
                    >
                      {i === 0 ? (
                        <div className="-rotate-20 text-[92px] font-extrabold tracking-[-0.11em] text-[#f1f3f1] [text-shadow:-3px_3px_0_#c3c5c2,-8px_8px_0_#9c9e9a,-12px_12px_0_#666a65,4px_-2px_2px_#fff]">
                          {"{"}
                          <span className="text-[#333e36]">/</span>
                          {"}"}
                        </div>
                      ) : i === 1 ? (
                        <div className="h-[170px] w-[85%] -rotate-12 rounded-[5px] border-[6px] border-[#273036] bg-[#d3e7de] p-1.5 shadow-[9px_10px_0_#658183]">
                          <i className="mr-1 inline-block h-[5px] w-[5px] rounded-full bg-[#ee744f]" />
                          <i className="mr-1 inline-block h-[5px] w-[5px] rounded-full bg-[#ee744f]" />
                          <i className="mr-1 inline-block h-[5px] w-[5px] rounded-full bg-[#ee744f]" />
                          <span className="block p-3.5 text-[38px] leading-none font-semibold tracking-[-0.06em]">
                            hello,
                            <br />
                            <em className="font-[Georgia,serif] font-normal">
                              world.
                            </em>
                          </span>
                        </div>
                      ) : i === 2 ? (
                        <div className="flex w-[65%] -rotate-20 flex-col gap-3">
                          {[0, 1, 2].map((n) => (
                            <i
                              key={n}
                              className="relative h-[42px] rounded-md border border-[#919a94] bg-gradient-to-b from-[#c9c9c3] to-[#464e4b] shadow-[7px_7px_0_#303936] after:absolute after:top-1.5 after:left-3 after:text-sm after:text-[#eb7446] after:content-['●']"
                            />
                          ))}
                        </div>
                      ) : i === 3 ? (
                        <div className="relative h-[130px] w-[120px] -rotate-15">
                          <i className="absolute top-[60px] h-[70px] w-[120px] rounded-[50%] border-b-[20px] border-[#666d65] bg-gradient-to-r from-[#777c75] via-[#dddeda] to-[#979d94] shadow-[0_8px_15px_#4e4d4533]" />
                          <i className="absolute top-[30px] h-[70px] w-[120px] rounded-[50%] border-b-[20px] border-[#666d65] bg-gradient-to-r from-[#777c75] via-[#dddeda] to-[#979d94] shadow-[0_8px_15px_#4e4d4533]" />
                          <i className="absolute top-0 h-[70px] w-[120px] rounded-[50%] border-b-[20px] border-[#666d65] bg-gradient-to-r from-[#777c75] via-[#dddeda] to-[#979d94] shadow-[0_8px_15px_#4e4d4533]" />
                        </div>
                      ) : i === 4 ? (
                        <div className="-rotate-15 text-[80px] tracking-[-0.1em] text-[#deded7] [text-shadow:5px_5px_0_#8a8a80,10px_10px_0_#45483d]">
                          O<span className="text-[62px]">(n)</span>
                        </div>
                      ) : (
                        <div className="-rotate-20 text-[150px] leading-none text-[#e9e3d6] [text-shadow:5px_6px_0_#a08e77,10px_12px_0_#604f3e]">
                          ⌘
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="py-3 min-[901px]:col-start-2 min-[901px]:row-start-1 min-[901px]:group-even:col-start-1 min-[901px]:group-even:pl-4">
                    <div className="overflow-hidden">
                      <div data-skill-header>
                        <span className="font-mono text-xs text-accent">
                          0{i + 1}.
                        </span>
                        <h3 className="mt-3 mb-2 font-display text-lg font-medium tracking-[var(--tracking-snug)]">
                          {skill.title}
                        </h3>
                      </div>
                    </div>
                    <p
                      data-skill-subtitle
                      className="max-w-[65ch] text-base leading-[var(--leading-body)] text-ink-secondary"
                    >
                      {
                        [
                          "The right language for the problem.",
                          "Interfaces with clarity and character.",
                          "Reliable APIs and secure applications.",
                          "Structured data. Thoughtful systems.",
                          "A foundation in efficient problem-solving.",
                          "From the first commit to deployment.",
                        ][i]
                      }
                    </p>
                  </div>
                  <ul
                    data-skill-items
                    className="mt-3 mr-3 list-disc pl-4 font-mono text-[12px] leading-[1.6] [overflow-wrap:anywhere] text-ink-secondary uppercase min-[901px]:col-start-3 min-[901px]:row-start-1 min-[901px]:group-even:col-start-2"
                  >
                    {skill.items.map((item) => (
                      <li data-skill-item className="mb-3" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-section-tint px-[var(--spacing-gutter)] py-[var(--spacing-section)]">
          <div className="mx-auto max-w-[var(--container-max)]">
            <SectionLabel>BEYOND THE CODE</SectionLabel>
            <h2
              className="mx-auto mb-16 text-center font-display text-2xl leading-[var(--leading-snug)] font-semibold tracking-[var(--tracking-tight)]"
              data-reveal
            >
              Always learning.
              <br />
              Always moving forward.
            </h2>
            <div className="grid grid-cols-1 gap-4 min-[901px]:grid-cols-2">
              <article
                className="tilt-glow flex flex-col rounded-[var(--radius-md)] border border-border-subtle bg-glass p-[clamp(1.75rem,3vw,2.5rem)] shadow-card transition-[border-color,background-color,box-shadow,translate] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-border-strong hover:bg-glass-hover hover:shadow-elevated"
                data-reveal
                data-tilt
              >
                <span className="font-mono text-xs text-accent">
                  ↗ EDUCATION / 2025—2029
                </span>
                <h3 className="mt-6 mb-4 font-display text-xl leading-[1.15] font-medium tracking-[var(--tracking-snug)]">
                  Computer Science.
                  <br />
                  Real-world curiosity.
                </h3>
                <p className="max-w-[65ch] leading-[var(--leading-body)] text-ink-secondary">
                  Bachelor of Technology in Computer Science
                </p>
                <p className="mb-2 max-w-[65ch] text-base leading-[var(--leading-body)] text-ink-secondary">
                  Newton School of Technology,
                  <br />
                  S-VYASA, Bengaluru
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-6">
                  <strong className="font-display text-[clamp(3rem,4.5vw,4.4rem)] font-medium tracking-[var(--tracking-tightest)]">
                    8.56
                    <span className="text-[1.75rem] text-ink-muted">/10</span>
                  </strong>
                  <span className="font-mono text-[11px] text-ink-muted">
                    CURRENT CGPA
                  </span>
                </div>
              </article>

              <div className="rounded-[var(--radius-md)] border border-border-subtle bg-glass px-[clamp(1.5rem,2.5vw,2rem)] shadow-card">
                {[
                  [
                    "01",
                    "ICPC Preliminary Online Round",
                    "Team Three Pointerss · 3 problems solved · 2,305th rank in the Final Regional Selection Pool.",
                  ],
                  [
                    "02",
                    "Inclusive open source",
                    "Linux Foundation LFC102 · Inclusive Open Source Community Orientation · November 2026.",
                  ],
                  [
                    "03",
                    "Campfire Hackathon",
                    "Team-based game development, rapid prototyping, frontend development, and collaborative problem-solving.",
                  ],
                ].map(([id, title, text]) => (
                  <article
                    className="flex gap-6 border-b border-border-subtle py-6 last:border-b-0"
                    data-reveal
                    key={id}
                  >
                    <span className="font-mono text-xs text-accent">{id}.</span>
                    <div>
                      <h3 className="mb-2 font-display text-md font-medium tracking-[var(--tracking-snug)]">
                        {title}
                      </h3>
                      <p className="max-w-[65ch] text-base leading-[var(--leading-body)] text-ink-secondary">
                        {text}
                      </p>
                      {id === "02" && (
                        <a
                          className="underline-sweep mt-2 inline-flex min-h-9 items-center border-b border-border-strong font-mono text-[11px] text-ink transition-colors duration-[var(--duration-fast)] hover:text-accent"
                          href="https://drive.google.com/file/d/1WgnaVz9RDnPQgcXDWlOW48WAYug8G4NN/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          VIEW CERTIFICATE ↗
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="flex justify-center bg-section-tint px-[var(--spacing-gutter)] py-[var(--spacing-section)]"
          aria-label="My approach"
        >
          <div
            className="approach-card tilt-glow w-full max-w-[820px] rounded-[var(--radius-lg)] border border-border-subtle bg-glass p-[clamp(2rem,5vw,4rem)] text-center shadow-elevated"
            data-reveal
            data-tilt
          >
            <span className="font-mono text-xs text-accent">
              THE WAY I BUILD
            </span>
            <h2 className="my-4 font-display text-3xl leading-[var(--leading-snug)] font-semibold tracking-[var(--tracking-tight)]">
              Good code.
              <br />
              Clear thinking.
              <br />
              <em className="font-[Georgia,serif] tracking-[-0.04em] text-accent italic">
                Meaningful impact.
              </em>
            </h2>
            <p className="mx-auto mb-8 max-w-[65ch] text-md leading-[var(--leading-body)] text-ink-secondary">
              Understand the problem. Question the assumptions.
              <br />
              Build with intent. Keep improving.
            </p>
            <SplitAction href="#contact">LET’S MAKE SOMETHING</SplitAction>
          </div>
        </section>

        <section className="bg-section-tint px-[var(--spacing-gutter)] py-[var(--spacing-section)]">
          <div className="mx-auto max-w-[var(--container-max)]">
            <SectionLabel>A FEW MORE THINGS</SectionLabel>
            <div className="grid grid-cols-1 gap-12 min-[901px]:grid-cols-2">
              <h2
                className="font-display text-2xl leading-[var(--leading-snug)] font-semibold tracking-[var(--tracking-tight)]"
                data-reveal
              >
                Before we get started,
                <br />
                here’s what matters.
              </h2>
              <div>
                {faqs.map(([q, a]) => (
                  <details
                    key={q}
                    className="group/faq border-b border-border-subtle py-4 first:pt-0"
                  >
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-md tracking-[var(--tracking-snug)] transition-colors duration-[var(--duration-fast)] hover:text-accent [&::-webkit-details-marker]:hidden">
                      {q}
                      <span className="font-mono text-[1.4rem] font-normal transition-[transform,color] duration-[var(--duration-base)] ease-[var(--ease-out)] group-open/faq:rotate-45 group-open/faq:text-accent">
                        +
                      </span>
                    </summary>
                    <p className="max-w-[65ch] pt-3 pr-8 text-base leading-[var(--leading-relaxed)] text-ink-secondary">
                      {a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          data-nav-section="contact"
          className="border-t border-border-subtle bg-section-deep px-[var(--spacing-gutter)] pt-[var(--spacing-section)] pb-0"
        >
          <div className="mx-auto max-w-[var(--container-max)]">
            <SectionLabel>HAVE SOMETHING IN MIND?</SectionLabel>
            <div className="flex flex-col items-start justify-between gap-8 pt-4 pb-16 sm:flex-row sm:items-center">
              <h2
                className="font-display text-[length:var(--text-display)] leading-[1.03] font-semibold tracking-[var(--tracking-tightest)]"
                data-reveal
              >
                Let’s make
                <br />
                something impossible
                <br />
                to ignore<span className="text-accent">.</span>
              </h2>
              <a
                href={email}
                data-magnetic
                className="flex h-[clamp(120px,12vw,180px)] w-[clamp(120px,12vw,180px)] shrink-0 [transform:translate3d(var(--mx,0px),var(--my,0px),0)] items-center justify-center gap-3 self-end rounded-full border border-border-strong bg-glass font-mono text-xs shadow-card transition-[background-color,border-color,color,rotate,scale] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:scale-[1.04] hover:-rotate-[8deg] hover:border-accent-solid hover:bg-accent-solid hover:text-accent-ink sm:mr-[4vw] sm:self-auto"
              >
                LET’S TALK <span className="text-[1.45rem]">↗</span>
              </a>
            </div>
            <div className="flex flex-wrap justify-between gap-4 border-t border-border-subtle py-6 font-mono text-[12px] text-ink-secondary">
              <a className="hover:text-accent" href={email}>
                2102508769@svyasa-sas.edu.in ↗
              </a>
              <span>BENGALURU, INDIA · OPEN TO OPPORTUNITIES</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-[1] overflow-clip bg-section-deep px-[var(--spacing-gutter)]">
        <div className="mx-auto max-w-[var(--container-max)]">
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border-subtle py-8 font-mono text-[12px]">
            <a
              className="flex items-center gap-3 hover:text-accent"
              href="#home"
            >
              <BrandMark /> MOHD FAIZAN KHAN
            </a>
            <div className="flex flex-wrap gap-6">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-sweep hover:text-accent"
                >
                  {s.name} ↗
                </a>
              ))}
            </div>
          </div>
          <div
            className="word-gradient-footer bg-clip-text pb-2 font-display text-[length:var(--text-footer)] leading-[0.9] font-bold tracking-[var(--tracking-tightest)] text-transparent"
            aria-hidden="true"
          >
            FAIZAN
          </div>
          <div className="flex flex-wrap justify-between gap-4 border-t border-border-subtle pt-6 pb-8 font-mono text-[11px] text-ink-muted">
            <span>© 2026 MOHD FAIZAN KHAN</span>
            <a className="hover:text-accent" href="#home">
              BACK TO TOP ↑
            </a>
            <span>THOUGHTFULLY BUILT. ALWAYS EVOLVING.</span>
          </div>
        </div>
      </footer>
      <a
        data-back-to-top
        href="#home"
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none fixed right-5 bottom-5 z-40 inline-flex h-10 translate-y-3 items-center gap-2 rounded-full border border-border-strong bg-glass-strong px-4 font-mono text-[11px] text-ink opacity-0 shadow-elevated backdrop-blur-[var(--blur-sm)] transition-[opacity,translate,border-color,color,background-color] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-accent hover:text-accent motion-reduce:translate-none [&.is-visible]:pointer-events-auto [&.is-visible]:translate-y-0 [&.is-visible]:opacity-100"
      >
        <span aria-hidden="true">↑</span>
        <span>Top</span>
        <span className="sr-only"> of page</span>
      </a>
    </>
  );
}
