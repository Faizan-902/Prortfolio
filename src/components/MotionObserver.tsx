"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  clampArtworkPill,
  computeCurtainState,
  formatStatCounterValue,
} from "@/lib/motionConfig";

function bindPointerDecay(
  el: HTMLElement,
  computeTarget: (nx: number, ny: number, rect: DOMRect) => [number, number],
  onFlush: (cx: number, cy: number, px: number, py: number) => void,
  hasResetDecay: boolean,
): () => void {
  let raf = 0;
  let rect: DOMRect | null = null;
  let settling = false;
  let px = 0.5;
  let py = 0.5;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const step = () => {
    raf = 0;
    if (settling && hasResetDecay) {
      currentX *= 0.82;
      currentY *= 0.82;
      if (Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01) {
        currentX = 0;
        currentY = 0;
        settling = false;
      } else {
        raf = window.requestAnimationFrame(step);
      }
    } else {
      currentX = targetX;
      currentY = targetY;
    }
    onFlush(currentX, currentY, px, py);
  };

  const schedule = () => {
    if (!raf) raf = window.requestAnimationFrame(step);
  };

  const onEnter = (e: PointerEvent) => {
    rect = el.getBoundingClientRect();
    settling = false;
    if (rect.width === 0 || rect.height === 0) return;
    px = (e.clientX - rect.left) / rect.width;
    py = (e.clientY - rect.top) / rect.height;
    [targetX, targetY] = computeTarget(px, py, rect);
    schedule();
  };

  const onMove = (e: PointerEvent) => {
    if (!rect) rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    px = (e.clientX - rect.left) / rect.width;
    py = (e.clientY - rect.top) / rect.height;
    settling = false;
    [targetX, targetY] = computeTarget(px, py, rect);
    schedule();
  };

  const onLeave = () => {
    rect = null;
    if (!hasResetDecay) return;
    targetX = 0;
    targetY = 0;
    settling = true;
    schedule();
  };

  el.addEventListener("pointerenter", onEnter, { passive: true });
  el.addEventListener("pointermove", onMove, { passive: true });
  el.addEventListener("pointerleave", onLeave, { passive: true });

  return () => {
    if (raf) window.cancelAnimationFrame(raf);
    el.removeEventListener("pointerenter", onEnter);
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
  };
}

function setupSkillsScrub(isDesktop: boolean) {
  const panels = gsap.utils.toArray<HTMLElement>("[data-skill-panel]");
  panels.forEach((panel, index) => {
    const header = panel.querySelector<HTMLElement>("[data-skill-header]");
    const subtitle = panel.querySelector<HTMLElement>("[data-skill-subtitle]");
    const items = Array.from(
      panel.querySelectorAll<HTMLElement>("[data-skill-item]"),
    );
    const glyph = panel.querySelector<HTMLElement>("[data-skill-glyph]");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: "top 80%",
        end: "bottom 30%",
        // Lock 1:1 to Lenis 120Hz stream (no secondary scrub tail lag)
        scrub: true,
      },
    });

    const horizontalOffset = isDesktop ? (index % 2 === 0 ? 32 : -32) : 0;

    tl.fromTo(
      panel,
      { opacity: 0.5, x: horizontalOffset },
      { opacity: 1, x: 0, ease: "power1.out", duration: 0.34 },
      0,
    );

    if (glyph) {
      tl.fromTo(
        glyph,
        {
          yPercent: isDesktop ? -15 : -8,
          scale: isDesktop ? 0.9 : 0.94,
          opacity: 0.55,
        },
        {
          yPercent: isDesktop ? 15 : 8,
          scale: 1,
          opacity: 1,
          ease: "none",
          duration: 1,
        },
        0,
      );
    }

    if (header) {
      tl.fromTo(
        header,
        { y: isDesktop ? 40 : 26, opacity: 0.2 },
        { y: 0, opacity: 1, ease: "power1.out", duration: 0.2 },
        0,
      );
    }

    if (subtitle) {
      tl.fromTo(
        subtitle,
        { y: isDesktop ? 24 : 16, opacity: 0 },
        { y: 0, opacity: 1, ease: "power1.out", duration: 0.2 },
        0.06,
      );
    }

    if (items.length > 0) {
      tl.fromTo(
        items,
        { y: isDesktop ? 32 : 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power1.out",
          duration: 0.2,
        },
        0.12,
      );
    }

    tl.to(
      panel,
      {
        opacity: 0.5,
        ease: "none",
        duration: 0.28,
        immediateRender: false,
      },
      0.72,
    );
  });
}

export default function MotionObserver() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const revealAllImmediately = () => {
      revealElements.forEach((el) => {
        el.classList.remove("reveal-pending");
        el.classList.add("is-visible");
        el.style.removeProperty("--reveal-delay");
      });
    };

    // 1. Staggered IntersectionObserver reveals (150-500ms ease-out).
    let revealObserver: IntersectionObserver | undefined;
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealAllImmediately();
    } else {
      revealObserver = new IntersectionObserver(
        (entries) => {
          let batchIndex = 0;
          entries.forEach((entry) => {
            const target = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              const delay = Math.min(batchIndex++, 4) * 55;
              target.style.setProperty("--reveal-delay", `${delay}ms`);
              target.classList.remove("reveal-pending");
              target.classList.add("is-visible");
              revealObserver?.unobserve(target);
            } else if (!target.classList.contains("is-visible")) {
              target.classList.add("reveal-pending");
            }
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px -4% 0px" },
      );

      revealElements.forEach((el) => revealObserver?.observe(el));
    }

    // 2. Active-section nav highlight & off-screen CSS loop pausing.
    const navSections = Array.from(
      document.querySelectorAll<HTMLElement>("section[data-nav-section]"),
    );
    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]"),
    );
    let activeNavId = "";

    const setActiveNav = (id: string) => {
      if (id === activeNavId) return;
      activeNavId = id;
      navLinks.forEach((link) => {
        const active = link.dataset.navLink === id;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };

    let navObserver: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window && navSections.length > 0) {
      navObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible.length > 0) {
            const id = (visible[0].target as HTMLElement).dataset.navSection;
            if (id) setActiveNav(id);
          }
        },
        { rootMargin: "-25% 0px -55% 0px", threshold: [0.05, 0.25, 0.5] },
      );
      navSections.forEach((section) => navObserver?.observe(section));
    }

    const loopAnims = Array.from(
      document.querySelectorAll<HTMLElement>("[data-loop-anim]"),
    );
    let loopObserver: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window && loopAnims.length > 0) {
      loopObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            (entry.target as HTMLElement).style.animationPlayState =
              entry.isIntersecting ? "running" : "paused";
          });
        },
        { threshold: 0.01 },
      );
      loopAnims.forEach((el) => loopObserver?.observe(el));
    }

    // 3. Zero-overhead scroll chrome state caching (prevents DOM writes every 120Hz frame).
    let activeLenis: Lenis | undefined;
    const progressBar = document.querySelector<HTMLElement>(
      "[data-scroll-progress]",
    );
    const header = document.querySelector<HTMLElement>(".site-header");
    const menuToggle = document.querySelector<HTMLElement>(".menu-toggle");
    const backToTop = document.querySelector<HTMLElement>("[data-back-to-top]");

    let maxScroll = 1;
    let vh = 900;
    let lastScrollY = window.scrollY;
    let prevProgress = -1;
    let prevScrolled = false;
    let prevHidden = false;
    let prevShowTop = false;

    const refreshMetrics = () => {
      vh = window.innerHeight || 900;
      maxScroll = Math.max(document.documentElement.scrollHeight - vh, 1);
    };
    const metricRaf = window.requestAnimationFrame(refreshMetrics);

    const updateChromeFromScroll = (y: number) => {
      const delta = y - lastScrollY;
      lastScrollY = y;

      if (progressBar) {
        const progress = Math.min(Math.max(y / maxScroll, 0), 1);
        if (Math.abs(progress - prevProgress) >= 0.0002) {
          prevProgress = progress;
          progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
        }
      }

      if (header) {
        const scrolled = y > 24;
        if (scrolled !== prevScrolled) {
          prevScrolled = scrolled;
          header.classList.toggle("is-scrolled", scrolled);
        }

        const menuOpen = menuToggle?.getAttribute("aria-expanded") === "true";
        let nextHidden = prevHidden;
        if (y <= 96 || menuOpen || delta < -6) {
          nextHidden = false;
        } else if (delta > 10 && y > 96) {
          nextHidden = !header.contains(document.activeElement);
        }
        if (nextHidden !== prevHidden) {
          prevHidden = nextHidden;
          header.classList.toggle("is-hidden", nextHidden);
        }
      }

      if (backToTop) {
        const showTop = y > vh * 0.85;
        if (showTop !== prevShowTop) {
          prevShowTop = showTop;
          backToTop.classList.toggle("is-visible", showTop);
          if (showTop) {
            backToTop.removeAttribute("tabindex");
            backToTop.removeAttribute("aria-hidden");
          } else {
            backToTop.setAttribute("tabindex", "-1");
            backToTop.setAttribute("aria-hidden", "true");
          }
        }
      }
    };

    const onNativeScroll = () => {
      if (!activeLenis) {
        updateChromeFromScroll(window.scrollY);
      }
    };

    const onAnchorClick = (e: MouseEvent) => {
      if (!activeLenis || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (
        e.target as HTMLElement | null
      )?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const target =
        hash === "#home" ? 0 : document.querySelector<HTMLElement>(hash);
      if (target === null) return;

      e.preventDefault();
      activeLenis.scrollTo(target, {
        offset: hash === "#home" ? 0 : -88,
        onComplete: () => {
          if (hash !== "#home" && window.location.hash !== hash) {
            window.history.replaceState(null, "", hash);
          }
        },
      });
    };

    document.addEventListener("click", onAnchorClick);
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", refreshMetrics, { passive: true });

    const onHeaderFocusIn = () => {
      if (prevHidden) {
        prevHidden = false;
        header?.classList.remove("is-hidden");
      }
    };
    header?.addEventListener("focusin", onHeaderFocusIn);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        lerp: 0.14,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        anchors: false,
        prevent: (node) => !!node.closest("dialog"),
      });
      activeLenis = lenis;

      lenis.on("scroll", () => {
        ScrollTrigger.update();
        updateChromeFromScroll(lenis.scroll);
      });

      const onTick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      // Video wrapper parallax locked 1:1 to Lenis frame updates
      const videoParallax = document.querySelector<HTMLElement>(
        "[data-video-parallax]",
      );
      if (videoParallax) {
        gsap.fromTo(
          videoParallax,
          { scale: 1, yPercent: 0 },
          {
            scale: 1.05,
            yPercent: -2,
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
      }

      const heroTop = document.querySelector<HTMLElement>("[data-hero-top]");
      const heroParallax = document.querySelector<HTMLElement>(
        "[data-hero-parallax]",
      );
      const heroSection = document.querySelector<HTMLElement>("#home");
      if (heroSection && heroParallax) {
        gsap.to(heroParallax, {
          y: -28,
          scale: 0.96,
          opacity: 0.72,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (heroSection && heroTop) {
        gsap.to(heroTop, {
          y: -18,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "75% top",
            scrub: true,
          },
        });
      }

      const marqueeParallax = document.querySelector<HTMLElement>(
        "[data-marquee-parallax]",
      );
      if (marqueeParallax) {
        gsap.fromTo(
          marqueeParallax,
          { x: 24 },
          {
            x: -36,
            ease: "none",
            scrollTrigger: {
              trigger: marqueeParallax,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      const aboutSection = document.querySelector<HTMLElement>("#about");
      const aboutStar =
        document.querySelector<HTMLElement>("[data-about-star]");
      if (aboutSection && aboutStar) {
        gsap.fromTo(
          aboutStar,
          { rotation: 0 },
          {
            rotation: 180,
            ease: "none",
            scrollTrigger: {
              trigger: aboutSection,
              start: "top 85%",
              end: "bottom 20%",
              scrub: true,
            },
          },
        );
      }

      const tickerScrub = document.querySelector<HTMLElement>(
        "[data-ticker-scrub]",
      );
      if (tickerScrub) {
        gsap.fromTo(
          tickerScrub,
          { x: -32 },
          {
            x: 42,
            ease: "none",
            scrollTrigger: {
              trigger: tickerScrub,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      document
        .querySelectorAll<HTMLElement>("[data-artwork-parallax]")
        .forEach((art) => {
          gsap.fromTo(
            art,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: art.closest("article") || art,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

      const envTerminal = document.querySelector<HTMLElement>(
        "[data-env-terminal]",
      );
      if (envTerminal) {
        gsap.fromTo(
          envTerminal,
          { rotation: -7, y: 12 },
          {
            rotation: 0,
            y: -8,
            ease: "none",
            scrollTrigger: {
              trigger: envTerminal.closest("article") || envTerminal,
              start: "top 90%",
              end: "bottom 25%",
              scrub: true,
            },
          },
        );
      }

      const wordCleanupFns: Array<() => void> = [];
      document.querySelectorAll<HTMLElement>(".word-reveal").forEach((el) => {
        const original = el.textContent || "";
        const spans = original.split(" ").map((word) => {
          const span = document.createElement("span");
          span.textContent = word + " ";
          span.style.opacity = "0.52";
          return span;
        });
        el.replaceChildren(...spans);
        gsap.to(spans, {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "bottom 42%",
            scrub: true,
          },
        });
        wordCleanupFns.push(() => {
          el.textContent = original;
        });
      });

      const responsiveCtx = gsap.matchMedia();
      responsiveCtx.add("(min-width: 901px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card");
        cards.slice(0, -1).forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card, {
            scale: 0.945,
            opacity: 0.66,
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top 88%",
              end: () => `top ${84 + (i + 1) * 18}px`,
              scrub: true,
            },
          });
        });

        setupSkillsScrub(true);

        const curtainSection = document.querySelector<HTMLElement>(
          "[data-curtain-section]",
        );
        const curtainLeft = curtainSection?.querySelector<HTMLElement>(
          "[data-curtain-left]",
        );
        const curtainRight = curtainSection?.querySelector<HTMLElement>(
          "[data-curtain-right]",
        );
        const curtainStage = curtainSection?.querySelector<HTMLElement>(
          "[data-curtain-stage]",
        );
        const curtainBentoLeft = curtainSection?.querySelector<HTMLElement>(
          "[data-curtain-bento-left]",
        );
        const curtainBentoRight = curtainSection?.querySelector<HTMLElement>(
          "[data-curtain-bento-right]",
        );
        const curtainArtLeft = curtainSection?.querySelector<HTMLElement>(
          "[data-curtain-art-left]",
        );
        const curtainArtRight = curtainSection?.querySelector<HTMLElement>(
          "[data-curtain-art-right]",
        );

        let curtainCleanup: (() => void) | undefined;
        if (curtainSection && curtainLeft && curtainRight && curtainStage) {
          const setLeft = gsap.quickSetter(curtainLeft, "xPercent");
          const setRight = gsap.quickSetter(curtainRight, "xPercent");
          const setStageScale = gsap.quickSetter(curtainStage, "scale");
          const setStageOpacity = gsap.quickSetter(curtainStage, "opacity");
          const setBentoLeftY = curtainBentoLeft
            ? gsap.quickSetter(curtainBentoLeft, "y", "px")
            : undefined;
          const setBentoRightY = curtainBentoRight
            ? gsap.quickSetter(curtainBentoRight, "y", "px")
            : undefined;
          const setArtLeftRot = curtainArtLeft
            ? gsap.quickSetter(curtainArtLeft, "rotation")
            : undefined;
          const setArtRightX = curtainArtRight
            ? gsap.quickSetter(curtainArtRight, "x", "px")
            : undefined;

          const applyCurtain = (progress: number) => {
            const state = computeCurtainState(progress);
            const norm = Math.min(Math.max(progress / 0.72, 0), 1);
            setLeft(state.leftXPercent);
            setRight(state.rightXPercent);
            setStageScale(state.stageScale);
            setStageOpacity(state.stageOpacity);
            setBentoLeftY?.((1 - norm) * 26);
            setBentoRightY?.((1 - norm) * 38);
            setArtLeftRot?.(-18 * norm);
            setArtRightX?.(18 * norm);
          };

          applyCurtain(0);
          const trigger = ScrollTrigger.create({
            trigger: curtainSection,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => applyCurtain(self.progress),
          });
          const onStageFocusIn = () => {
            if (trigger.progress >= 0.72) return;
            const targetY =
              curtainSection.offsetTop +
              Math.round(
                (curtainSection.offsetHeight - window.innerHeight) * 0.76,
              );
            if (activeLenis) {
              activeLenis.scrollTo(targetY);
            } else {
              window.scrollTo({ top: targetY, behavior: "smooth" });
            }
          };
          curtainStage.addEventListener("focusin", onStageFocusIn);
          curtainCleanup = () => {
            curtainStage.removeEventListener("focusin", onStageFocusIn);
            trigger.kill();
            const targets = [
              curtainLeft,
              curtainRight,
              curtainStage,
              curtainBentoLeft,
              curtainBentoRight,
              curtainArtLeft,
              curtainArtRight,
            ].filter(Boolean);
            gsap.set(targets, {
              clearProps: "transform,opacity",
            });
          };
        }

        const statCards = gsap.utils.toArray<HTMLElement>("[data-stat-card]");
        statCards.forEach((card, i) => {
          const offset = i % 2 === 0 ? 14 : -10;
          gsap.fromTo(
            card,
            { y: offset },
            {
              y: -offset,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 95%",
                end: "bottom 15%",
                scrub: true,
              },
            },
          );
        });

        return () => {
          curtainCleanup?.();
        };
      });

      responsiveCtx.add("(max-width: 900px)", () => {
        setupSkillsScrub(false);
      });

      const contactSection = document.querySelector<HTMLElement>("#contact");
      const contactParallax = document.querySelector<HTMLElement>(
        "[data-contact-parallax]",
      );
      const contactHeading = document.querySelector<HTMLElement>(
        "[data-contact-heading]",
      );
      const contactCta =
        document.querySelector<HTMLElement>("[data-contact-cta]");
      if (contactSection && contactParallax) {
        gsap.fromTo(
          contactParallax,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: contactSection,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
      if (contactSection && contactHeading) {
        gsap.fromTo(
          contactHeading,
          { y: 26, opacity: 0.45 },
          {
            y: 0,
            opacity: 1,
            ease: "power1.out",
            scrollTrigger: {
              trigger: contactSection,
              start: "top 86%",
              end: "center 62%",
              scrub: true,
            },
          },
        );
      }
      if (contactSection && contactCta) {
        gsap.fromTo(
          contactCta,
          { scale: 0.88, rotation: -8 },
          {
            scale: 1,
            rotation: 0,
            ease: "power1.out",
            scrollTrigger: {
              trigger: contactSection,
              start: "top 82%",
              end: "center 58%",
              scrub: true,
            },
          },
        );
      }

      const footerEl = document.querySelector<HTMLElement>("footer");
      const footerWord =
        document.querySelector<HTMLElement>("[data-footer-word]");
      if (footerEl && footerWord) {
        gsap.fromTo(
          footerWord,
          { yPercent: 20, opacity: 0.3 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "power1.out",
            scrollTrigger: {
              trigger: footerEl,
              start: "top 92%",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
      }

      return () => {
        activeLenis = undefined;
        responsiveCtx.revert();
        wordCleanupFns.forEach((fn) => fn());
        gsap.ticker.remove(onTick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    });

    // Lock background scroll and pause Lenis while a <dialog> is open.
    const dialogObserver = new MutationObserver(() => {
      const open = !!document.querySelector("dialog[open]");
      root.classList.toggle("modal-open", open);
      if (open) activeLenis?.stop();
      else activeLenis?.start();
    });
    dialogObserver.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["open"],
    });

    // Refresh ScrollTrigger measurements after custom web fonts & images settle.
    const onLoadRefresh = () => {
      refreshMetrics();
      ScrollTrigger.refresh();
    };
    document.fonts?.ready.then(onLoadRefresh);
    window.addEventListener("load", onLoadRefresh);

    // 120Hz zero-layout-read pointer interactions (rect cached on pointerenter, smooth leave decay).
    const pointerCleanups: Array<() => void> = [];
    if (!reducedMotion.matches && finePointer.matches) {
      document
        .querySelectorAll<HTMLElement>("[data-magnetic]")
        .forEach((el) => {
          pointerCleanups.push(
            bindPointerDecay(
              el,
              (px, py) => [(px - 0.5) * 10, (py - 0.5) * 10],
              (cx, cy) => {
                el.style.setProperty("--mx", `${cx.toFixed(2)}px`);
                el.style.setProperty("--my", `${cy.toFixed(2)}px`);
              },
              true,
            ),
          );
        });

      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
        pointerCleanups.push(
          bindPointerDecay(
            card,
            (px, py) => [(0.5 - py) * 3.5, (px - 0.5) * 3.5],
            (rx, ry, px, py) => {
              card.style.setProperty("--glow-x", `${(px * 100).toFixed(1)}%`);
              card.style.setProperty("--glow-y", `${(py * 100).toFixed(1)}%`);
              card.style.setProperty("--tilt-x", `${rx.toFixed(2)}deg`);
              card.style.setProperty("--tilt-y", `${ry.toFixed(2)}deg`);
            },
            true,
          ),
        );
      });

      document
        .querySelectorAll<HTMLElement>("[data-spotlight]")
        .forEach((card) => {
          pointerCleanups.push(
            bindPointerDecay(
              card,
              () => [0, 0],
              (_cx, _cy, px, py) => {
                card.style.setProperty("--glow-x", `${(px * 100).toFixed(1)}%`);
                card.style.setProperty("--glow-y", `${(py * 100).toFixed(1)}%`);
              },
              false,
            ),
          );
        });

      document
        .querySelectorAll<HTMLElement>("[data-artwork-hover]")
        .forEach((box) => {
          pointerCleanups.push(
            bindPointerDecay(
              box,
              (px, py, rect) => {
                const pos = clampArtworkPill(px, py, rect.width, rect.height);
                return [pos.x, pos.y];
              },
              (cx, cy) => {
                if (cx === 0 && cy === 0) return;
                box.style.setProperty("--pill-x", `${cx.toFixed(0)}px`);
                box.style.setProperty("--pill-y", `${cy.toFixed(0)}px`);
              },
              false,
            ),
          );
        });
    }

    // 4. Stat counter roll-up on first intersect + ResizeObserver for accordion reflows.
    const statCleanups: Array<() => void> = [];
    const statEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-stat-counter]"),
    );
    let statObserver: IntersectionObserver | undefined;
    if (
      !reducedMotion.matches &&
      "IntersectionObserver" in window &&
      statEls.length > 0
    ) {
      statObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            statObserver?.unobserve(el);
            const target = el.dataset.statCounter || el.textContent || "";
            const start = Number(el.dataset.statStart || "0");
            const duration = 850;
            const t0 = performance.now();
            let rafId = 0;

            const tickCount = (now: number) => {
              const raw = Math.min((now - t0) / duration, 1);
              const eased = 1 - Math.pow(1 - raw, 3);
              el.textContent = formatStatCounterValue(eased, target, start);
              if (raw < 1) {
                rafId = window.requestAnimationFrame(tickCount);
              }
            };
            rafId = window.requestAnimationFrame(tickCount);
            statCleanups.push(() => {
              window.cancelAnimationFrame(rafId);
              el.textContent = target;
            });
          });
        },
        { threshold: 0.35 },
      );
      statEls.forEach((el) => statObserver?.observe(el));
    }

    const mainEl = document.querySelector<HTMLElement>("main");
    let resizeRaf = 0;
    let lastMainHeight = mainEl?.scrollHeight ?? 0;
    let mainResizeObserver: ResizeObserver | undefined;
    if (mainEl && "ResizeObserver" in window) {
      mainResizeObserver = new ResizeObserver(() => {
        if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
        resizeRaf = window.requestAnimationFrame(() => {
          resizeRaf = 0;
          const nextHeight = mainEl.scrollHeight;
          if (nextHeight !== lastMainHeight) {
            lastMainHeight = nextHeight;
            refreshMetrics();
            ScrollTrigger.refresh();
          }
        });
      });
      mainResizeObserver.observe(mainEl);
    }

    const onReducedMotionChange = () => {
      if (reducedMotion.matches) {
        revealAllImmediately();
        statCleanups.forEach((fn) => fn());
      }
      ScrollTrigger.refresh();
    };
    reducedMotion.addEventListener("change", onReducedMotionChange);
    desktopQuery.addEventListener("change", onLoadRefresh);

    return () => {
      window.cancelAnimationFrame(metricRaf);
      if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", refreshMetrics);
      window.removeEventListener("load", onLoadRefresh);
      header?.removeEventListener("focusin", onHeaderFocusIn);
      revealObserver?.disconnect();
      navObserver?.disconnect();
      loopObserver?.disconnect();
      statObserver?.disconnect();
      mainResizeObserver?.disconnect();
      dialogObserver.disconnect();
      reducedMotion.removeEventListener("change", onReducedMotionChange);
      desktopQuery.removeEventListener("change", onLoadRefresh);
      statCleanups.forEach((fn) => fn());
      pointerCleanups.forEach((fn) => fn());
      mm.revert();
      root.classList.remove("modal-open");
    };
  }, []);

  return null;
}
