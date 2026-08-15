"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Force manual scroll restoration so reloads always start at top Hero section
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }

    // Reset scroll on beforeunload to prevent browser from caching non-zero scroll position
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Respect accessibility reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    (window as unknown as { __lenis?: Lenis | null }).__lenis = lenis;

    // Immediately reset Lenis scroll position to top if no URL hash anchor is targeted
    if (!window.location.hash) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Direct rAF loop for smooth 60fps/120fps scrolling
    let rafId: number;
    function update(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(update);
    }
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis | null }).__lenis = null;
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}