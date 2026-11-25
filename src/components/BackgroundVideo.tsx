"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type ConnectionInfo = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithHints = Navigator & {
  connection?: ConnectionInfo;
};

function shouldUsePosterOnly(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }
  const conn = (navigator as NavigatorWithHints).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") {
    return true;
  }
  return false;
}

export default function BackgroundVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterOnly, setPosterOnly] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const container = containerRef.current;
    const video = videoRef.current;

    const updatePolicy = () => {
      const restricted = shouldUsePosterOnly();
      setPosterOnly(restricted);
      if (restricted && video) {
        video.pause();
        setVideoVisible(false);
      }
      return restricted;
    };

    const initialRestricted = updatePolicy();
    if (!container || !video) return;

    let disposed = false;
    let isHidden = document.hidden;
    let isOffscreen = false;
    let retryAttached = false;

    const removeRetryListeners = () => {
      if (!retryAttached) return;
      retryAttached = false;
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };

    const attemptPlay = async () => {
      if (
        disposed ||
        isHidden ||
        isOffscreen ||
        shouldUsePosterOnly() ||
        !videoRef.current
      ) {
        return;
      }
      const el = videoRef.current;
      el.muted = true;
      el.defaultMuted = true;
      try {
        await el.play();
        if (!disposed) {
          setVideoVisible(true);
          removeRetryListeners();
        }
      } catch {
        // Browsers (e.g. iOS Low Power Mode) can reject autoplay until user interaction.
        if (!disposed) {
          setVideoVisible(false);
          attachRetryListeners();
        }
      }
    };

    function onFirstInteraction() {
      removeRetryListeners();
      void attemptPlay();
    }

    function attachRetryListeners() {
      if (retryAttached || disposed) return;
      retryAttached = true;
      window.addEventListener("pointerdown", onFirstInteraction, {
        passive: true,
        once: true,
      });
      window.addEventListener("keydown", onFirstInteraction, {
        passive: true,
        once: true,
      });
      window.addEventListener("touchstart", onFirstInteraction, {
        passive: true,
        once: true,
      });
    }

    const onReady = () => {
      if (!shouldUsePosterOnly() && !isHidden && !isOffscreen) {
        void attemptPlay();
      }
    };

    const onPlaying = () => {
      if (!disposed && !shouldUsePosterOnly()) {
        setVideoVisible(true);
      }
    };

    const onVisibilityChange = () => {
      isHidden = document.hidden;
      if (isHidden) {
        video.pause();
      } else if (!isOffscreen && !shouldUsePosterOnly()) {
        void attemptPlay();
      }
    };

    const onPolicyChange = () => {
      const restricted = updatePolicy();
      if (!restricted && !isHidden && !isOffscreen) {
        void attemptPlay();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        isOffscreen = !entries[0]?.isIntersecting;
        if (isOffscreen) {
          video.pause();
        } else if (!isHidden && !shouldUsePosterOnly()) {
          void attemptPlay();
        }
      },
      { threshold: 0.01 },
    );
    io.observe(container);

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("playing", onPlaying);
    document.addEventListener("visibilitychange", onVisibilityChange);
    motionQuery.addEventListener("change", onPolicyChange);

    if (!initialRestricted && !isHidden) {
      if (video.readyState >= 2) {
        void attemptPlay();
      } else {
        void attemptPlay();
      }
    }

    return () => {
      disposed = true;
      removeRetryListeners();
      io.disconnect();
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("playing", onPlaying);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onPolicyChange);
      video.pause();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-fallback-gradient pointer-events-none fixed inset-0 z-0 overflow-hidden [contain:strict]"
      aria-hidden="true"
    >
      <div
        data-video-parallax
        className="absolute inset-0 origin-center transform-gpu motion-reduce:transform-none"
      >
        {/* Static poster layer ensures instant LCP without blocking first paint on video decode */}
        <img
          src="/media/bg-poster.jpg"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
        {!posterOnly && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            poster="/media/bg-poster.jpg"
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-full w-full transform-gpu object-cover transition-opacity duration-[var(--duration-slow)] ease-[var(--ease-out)] motion-reduce:hidden",
              videoVisible ? "opacity-100" : "opacity-0",
            )}
          >
            <source
              media="(max-width: 767px)"
              src="/media/bg-mobile.webm"
              type="video/webm"
            />
            <source
              media="(max-width: 767px)"
              src="/media/bg-mobile.mp4"
              type="video/mp4"
            />
            <source src="/media/bg.webm" type="video/webm" />
            <source src="/media/bg.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      {/* Contrast scrim + vignette + subtle film grain controlled via @theme tokens */}
      <div className="bg-scrim-layer pointer-events-none absolute inset-0 transform-gpu" />
      <div className="bg-grain-layer pointer-events-none absolute inset-0 transform-gpu" />
    </div>
  );
}
