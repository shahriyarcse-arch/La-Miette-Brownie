"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const completedRef = useRef(false);
  const pageReadyRef = useRef(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("ssr-loading");
    }

    // ── Track real page load ──
    const markPageReady = () => {
      pageReadyRef.current = true;
    };

    if (typeof document !== "undefined") {
      if (document.readyState === "complete" || document.readyState === "interactive") {
        markPageReady();
      } else {
        window.addEventListener("load", markPageReady);
        document.addEventListener("DOMContentLoaded", markPageReady);
      }
    }

    // ── Ultra-Smooth 60fps/120fps rAF Counter Loop ──
    const startTime = performance.now();
    const DURATION = 2000; // 2 seconds crisp animation
    let animationFrameId: number;

    const animateProgress = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION, 1);

      // easeOutCubic curve for responsive counter
      const eased = 1 - Math.pow(1 - t, 3);
      const target = Math.floor(eased * 100);

      // Cap at 95% if document isn't fully ready
      if (!pageReadyRef.current && target > 95) {
        setProgress(95);
        animationFrameId = requestAnimationFrame(animateProgress);
        return;
      }

      if (t >= 1 && pageReadyRef.current) {
        if (!completedRef.current) {
          completedRef.current = true;
          setProgress(100);
          // Wait 150ms at 100% before smooth slide up
          setTimeout(() => {
            setIsLoading(false);
            onCompleteRef.current?.();
          }, 150);
        }
        return;
      }

      setProgress(target);
      animationFrameId = requestAnimationFrame(animateProgress);
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    // Safety net: never hang longer than 6s
    const safetyTimeout = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      if (!completedRef.current) {
        completedRef.current = true;
        setProgress(100);
        setIsLoading(false);
        onCompleteRef.current?.();
      }
    }, 6000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(safetyTimeout);
      window.removeEventListener("load", markPageReady);
      document.removeEventListener("DOMContentLoaded", markPageReady);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1, y: 0 }}
          exit={{
            y: "-100%",
            opacity: 0.95,
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{ willChange: "transform, opacity" }}
          className="fixed inset-0 z-[10000] bg-[#F7F1E5] text-[#221B12] flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16 select-none overflow-hidden"
        >
          {/* Warm Silk Gradient Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FAF6EE] via-[#F7F1E5] to-[#EFE7D8] pointer-events-none" />

          {/* Top Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#221B12]/10 z-30">
            <div
              className="h-full bg-gradient-to-r from-[#B06A2C] via-[#D9A441] to-[#221B12] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* ── Top Header Row ── */}
          <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-4">
            {/* Left: Brand Label */}
            <motion.span
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-xs sm:text-xs md:text-sm font-mono tracking-[0.14em] sm:tracking-[0.18em] text-[#B06A2C] uppercase font-bold whitespace-nowrap shrink-0"
            >
              HANDCRAFTED DESSERT LAB • EST. 2026
            </motion.span>

            {/* Right: Location */}
            <motion.span
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[11px] sm:text-xs md:text-sm font-mono tracking-[0.12em] sm:tracking-[0.14em] text-[#221B12]/75 uppercase font-semibold text-left sm:text-right"
            >
              <span className="sm:hidden">DHAKA • ALL ZONES</span>
              <span className="hidden sm:inline lg:hidden">DHAKA • GULSHAN • UTTARA • DHANMONDI</span>
              <span className="hidden lg:inline">DHAKA • GULSHAN • BANANI • UTTARA • DHANMONDI • MIRPUR • BASHUNDHARA</span>
            </motion.span>
          </div>

          {/* ── Dead-Centered Brand Identity ── */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
            <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto pointer-events-auto">
              {/* Brand Title */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-[3.25rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif text-[#221B12] tracking-tight font-bold leading-none"
              >
                La{" "}
                <motion.span
                  initial={{ opacity: 0, scale: 0.92, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="inline-block text-[#B06A2C] italic font-serif font-normal"
                >
                  Miette
                </motion.span>{" "}
                Brownie
              </motion.div>

              {/* Gold Line Divider */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.9 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-20 sm:w-24 md:w-36 h-[2px] bg-gradient-to-r from-transparent via-[#B06A2C] to-transparent mx-auto"
              />

              {/* Product Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xs sm:text-xs md:text-sm font-mono uppercase tracking-[0.16em] sm:tracking-[0.28em] text-[#B06A2C] font-bold max-w-[280px] sm:max-w-none mx-auto leading-relaxed sm:leading-normal"
              >
                BROWNIES · PASTRIES · PUDDINGS · CAKES · COOKIES
              </motion.p>
            </div>
          </div>

          {/* ── Bottom Row ── */}
          <div className="relative z-20 flex items-end justify-between gap-4">
            {/* Left: Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-1 pb-0.5 shrink min-w-0"
            >
              <div className="text-[#B06A2C] font-bold flex items-center gap-2 text-xs sm:text-xs md:text-sm font-mono tracking-[0.12em] sm:tracking-[0.15em] uppercase whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[#B06A2C] animate-ping shrink-0" />
                PREPARING FRESH BATCHES...
              </div>
              <p className="text-[11px] sm:text-xs text-[#221B12]/75 font-mono font-semibold tracking-[0.14em] uppercase hidden sm:block">
                DELIVERING FRESH DAILY ALL OVER DHAKA
              </p>
            </motion.div>

            {/* Right: % Counter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-serif font-bold text-right leading-none select-none tracking-tight shrink-0"
            >
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#B06A2C] font-bold">
                {progress}
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic text-[#221B12]/75 ml-0.5 sm:ml-1">
                  %
                </span>
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
