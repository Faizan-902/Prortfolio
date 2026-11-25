"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

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

      const heroParallax = document.querySelector<HTMLElement>(
        "[data-hero-parallax]",
      );
      const heroSection = document.querySelector<HTMLElement>("#home");
      if (heroParallax && heroSection) {
        gsap.to(heroParallax, {
          y: -24,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
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
      });

      responsiveCtx.add("(max-width: 900px)", () => {
        setupSkillsScrub(false);
      });

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

    // 120Hz zero-layout-read pointer interactions (rect cached on pointerenter).
    const pointerCleanups: Array<() => void> = [];
    if (!reducedMotion.matches && finePointer.matches) {
      document
        .querySelectorAll<HTMLElement>("[data-magnetic]")
        .forEach((el) => {
          let raf = 0;
          let rect: DOMRect | null = null;
          let targetX = 0;
          let targetY = 0;

          const flush = () => {
            raf = 0;
            el.style.setProperty("--mx", `${targetX.toFixed(2)}px`);
            el.style.setProperty("--my", `${targetY.toFixed(2)}px`);
          };
          const onEnter = () => {
            rect = el.getBoundingClientRect();
          };
          const onMove = (e: PointerEvent) => {
            if (!rect) rect = el.getBoundingClientRect();
            targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
            targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
            if (!raf) raf = window.requestAnimationFrame(flush);
          };
          const onLeave = () => {
            rect = null;
            targetX = 0;
            targetY = 0;
            if (!raf) raf = window.requestAnimationFrame(flush);
          };
          el.addEventListener("pointerenter", onEnter, { passive: true });
          el.addEventListener("pointermove", onMove, { passive: true });
          el.addEventListener("pointerleave", onLeave, { passive: true });
          pointerCleanups.push(() => {
            if (raf) window.cancelAnimationFrame(raf);
            el.removeEventListener("pointerenter", onEnter);
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
          });
        });

      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
        let raf = 0;
        let rect: DOMRect | null = null;
        let px = 0.5;
        let py = 0.5;
        let rx = 0;
        let ry = 0;

        const flush = () => {
          raf = 0;
          card.style.setProperty("--glow-x", `${(px * 100).toFixed(1)}%`);
          card.style.setProperty("--glow-y", `${(py * 100).toFixed(1)}%`);
          card.style.setProperty("--tilt-x", `${rx.toFixed(2)}deg`);
          card.style.setProperty("--tilt-y", `${ry.toFixed(2)}deg`);
        };
        const onEnter = () => {
          rect = card.getBoundingClientRect();
        };
        const onMove = (e: PointerEvent) => {
          if (!rect) rect = card.getBoundingClientRect();
          px = (e.clientX - rect.left) / rect.width;
          py = (e.clientY - rect.top) / rect.height;
          rx = (0.5 - py) * 3.5;
          ry = (px - 0.5) * 3.5;
          if (!raf) raf = window.requestAnimationFrame(flush);
        };
        const onLeave = () => {
          rect = null;
          rx = 0;
          ry = 0;
          if (!raf) raf = window.requestAnimationFrame(flush);
        };
        card.addEventListener("pointerenter", onEnter, { passive: true });
        card.addEventListener("pointermove", onMove, { passive: true });
        card.addEventListener("pointerleave", onLeave, { passive: true });
        pointerCleanups.push(() => {
          if (raf) window.cancelAnimationFrame(raf);
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });

      document
        .querySelectorAll<HTMLElement>("[data-spotlight]")
        .forEach((card) => {
          let raf = 0;
          let rect: DOMRect | null = null;
          let px = 0.5;
          let py = 0.5;

          const flush = () => {
            raf = 0;
            card.style.setProperty("--glow-x", `${(px * 100).toFixed(1)}%`);
            card.style.setProperty("--glow-y", `${(py * 100).toFixed(1)}%`);
          };
          const onEnter = () => {
            rect = card.getBoundingClientRect();
          };
          const onMove = (e: PointerEvent) => {
            if (!rect) rect = card.getBoundingClientRect();
            px = (e.clientX - rect.left) / rect.width;
            py = (e.clientY - rect.top) / rect.height;
            if (!raf) raf = window.requestAnimationFrame(flush);
          };
          const onLeave = () => {
            rect = null;
          };
          card.addEventListener("pointerenter", onEnter, { passive: true });
          card.addEventListener("pointermove", onMove, { passive: true });
          card.addEventListener("pointerleave", onLeave, { passive: true });
          pointerCleanups.push(() => {
            if (raf) window.cancelAnimationFrame(raf);
            card.removeEventListener("pointerenter", onEnter);
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });
        });
    }

    const onReducedMotionChange = () => {
      if (reducedMotion.matches) {
        revealAllImmediately();
      }
      ScrollTrigger.refresh();
    };
    reducedMotion.addEventListener("change", onReducedMotionChange);
    desktopQuery.addEventListener("change", onLoadRefresh);

    return () => {
      window.cancelAnimationFrame(metricRaf);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", refreshMetrics);
      window.removeEventListener("load", onLoadRefresh);
      header?.removeEventListener("focusin", onHeaderFocusIn);
      revealObserver?.disconnect();
      navObserver?.disconnect();
      loopObserver?.disconnect();
      dialogObserver.disconnect();
      reducedMotion.removeEventListener("change", onReducedMotionChange);
      desktopQuery.removeEventListener("change", onLoadRefresh);
      pointerCleanups.forEach((fn) => fn());
      mm.revert();
      root.classList.remove("modal-open");
    };
  }, []);

  return null;
}
