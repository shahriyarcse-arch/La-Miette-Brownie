"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

interface HeroProps {
  onExploreProducts?: () => void;
  isPreloaderDone?: boolean;
}

const HERO_PRODUCTS = [
  { name: "Belgian Dark Chocolate Fudgy Brownie", price: "৳450", badge: "BEST SELLER" },
  { name: "Basque Burnt Caramel Cheesecake", price: "৳650", badge: "TOP RATED ★ 4.9" },
  { name: "Nutella Sea Salt Fudgy Brownie", price: "৳480", badge: "POPULAR" },
  { name: "Classic Silk Caramel Custard Pudding", price: "৳380", badge: "FRESH BATCH" },
  { name: "NYC Chunky Choco Chip Cookie", price: "৳320", badge: "FRESHLY BAKED" },
  { name: "Valrhona Dark Ganache Cake", price: "৳1,200", badge: "SIGNATURE" },
  { name: "🚚 SAME DAY EXPRESS DELIVERY ACROSS DHAKA", price: "", badge: "DAILY FRESH" },
  { name: "✨ 100% PURE BUTTER & BELGIAN CHOCOLATE", price: "", badge: "PREMIUM INGREDIENTS" },
];

export function Hero({ onExploreProducts, isPreloaderDone = true }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const CUBIC_EASE = [0.22, 1, 0.36, 1] as const;
  const HEADLINE_EASE = [0.16, 1, 0.3, 1] as const;

  // Animation states tied to preloader completion
  const animateState = isPreloaderDone ? "visible" : "hidden";

  /* ──────────────────────────────────────────────
     Cinematic Staggered Reveal System
     Each element enters with generous spacing
     so the user can clearly see every piece arrive.
     ────────────────────────────────────────────── */

  const videoBgVariants = {
    hidden: { opacity: 0, scale: 1.08 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.8, ease: HEADLINE_EASE },
    },
  };

  const eyebrowVariants = {
    hidden: { opacity: 0, y: -16, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, delay: 0.1, ease: CUBIC_EASE },
    },
  };

  const headlineVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.85, delay: 0.2, ease: HEADLINE_EASE },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.75, delay: 0.35, ease: CUBIC_EASE },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, delay: 0.45, ease: CUBIC_EASE },
    },
  };

  const scrollCueVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: 0.45 },
    },
  };

  const tickerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.55 },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between items-center text-center pt-24 sm:pt-28 md:pt-32 pb-0 overflow-hidden bg-[#221B12]">
      {/* Fullscreen Video Background — Cinematic Scale-In Reveal */}
      <motion.div
        variants={videoBgVariants}
        initial="hidden"
        animate={animateState}
        className="hero-bg-poster absolute inset-0 w-full h-full overflow-hidden z-0"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/hero-poster.jpg"
          className="w-full h-full object-cover object-center transform-gpu"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Crystal-Clear Dark Overlay for High-Definition Video & Optimal Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#18120C]/65 via-[#18120C]/40 to-[#18120C]/80 z-[1]" />
      </motion.div>

      {/* Main Content Container (z-10 over video) */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 space-y-6 my-auto pt-4 sm:pt-8">
        {/* Eyebrow */}
        <motion.p
          variants={eyebrowVariants}
          initial="hidden"
          animate={animateState}
          className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#E8AB48] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          HANDCRAFTED DESSERT LAB • BAKED FRESH DAILY
        </motion.p>

        {/* Editorial Headline */}
        <motion.h1
          variants={headlineVariants}
          initial="hidden"
          animate={animateState}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-serif font-bold text-white tracking-tight leading-[1.1] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] max-w-4xl mx-auto"
        >
          <span className="block text-[#FAF6EE]">Freshly Baked Desserts,</span>
          <em className="block not-italic text-[#E8AB48] font-serif font-semibold italic mt-1 sm:mt-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            Delivered Daily Across Dhaka.
          </em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={subtitleVariants}
          initial="hidden"
          animate={animateState}
          className="text-[#FAF6EE]/95 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal pt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
        >
          Indulge in handcrafted fudgy brownies, Basque cheesecakes, silk caramel puddings, and gourmet cookies — freshly baked in limited batches with Belgian chocolate and pure butter.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate={animateState}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={() => {
              const el = document.getElementById("signature");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#E8AB48] text-[#18120C] text-sm sm:text-base font-bold hover:bg-white transition-all shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Pre-Order Fresh Now</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("products");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/40 text-white text-sm sm:text-base font-semibold hover:bg-white hover:text-[#18120C] transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Explore Full Menu</span>
          </button>
        </motion.div>
      </div>

      {/* Right Luxury Glassmorphic Scroll Indicator Capsule */}
      <motion.div
        variants={scrollCueVariants}
        initial="hidden"
        animate={animateState}
        onClick={() => {
          const el = document.getElementById("signature");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        role="button"
        aria-label="Scroll to Best Sellers"
        className="hidden lg:flex absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-10 px-3 py-6 rounded-full bg-[#18120C]/40 backdrop-blur-xl border border-[#E8AB48]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer hover:border-[#E8AB48] hover:bg-[#18120C]/70 hover:shadow-[0_0_25px_rgba(232,171,72,0.35)] transition-all duration-500 group select-none"
      >
        <span className="[writing-mode:vertical-rl] text-[10px] font-mono tracking-[0.3em] uppercase text-[#FAF6EE]/80 group-hover:text-[#E8AB48] transition-colors duration-300">
          SCROLL TO EXPLORE
        </span>
        
        {/* Animated Liquid Gold Droplet Track */}
        <div className="w-[2px] h-10 bg-[#E8AB48]/20 rounded-full relative overflow-hidden my-1">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
            className="w-full h-1/2 bg-gradient-to-b from-transparent via-[#E8AB48] to-transparent shadow-[0_0_8px_#E8AB48]"
          />
        </div>

        {/* Bouncing Chevron Arrow */}
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-[#E8AB48] group-hover:scale-125 transition-transform" />
        </motion.div>
      </motion.div>

      {/* Bottom Ticker Marquee Carousel Strip */}
      <motion.div
        variants={tickerVariants}
        initial="hidden"
        animate={animateState}
        className="w-full border-t border-white/15 bg-[#18120C]/80 backdrop-blur-md py-3 overflow-hidden z-10 mt-6 sm:mt-8 select-none"
      >
        <div className="flex flex-nowrap w-full overflow-hidden">
          {/* Primary Track */}
          <div className="flex shrink-0 items-center justify-around gap-10 min-w-full animate-[marquee_40s_linear_infinite]">
            {HERO_PRODUCTS.map((item, idx) => (
              <div key={`track1-${idx}`} className="flex items-center gap-3 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8AB48]" />
                <span className="font-bold text-[#FAF6EE] text-xs font-serif tracking-wide">{item.name}</span>
                {item.price && (
                  <span className="font-mono text-[#E8AB48] font-bold text-xs bg-[#E8AB48]/15 px-2 py-0.5 rounded border border-[#E8AB48]/30">
                    {item.price}
                  </span>
                )}
                {item.badge && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-[#E8AB48] font-bold tracking-wider border border-white/20">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Duplicate Seamless Sibling Track */}
          <div className="flex shrink-0 items-center justify-around gap-10 min-w-full animate-[marquee_40s_linear_infinite]" aria-hidden="true">
            {HERO_PRODUCTS.map((item, idx) => (
              <div key={`track2-${idx}`} className="flex items-center gap-3 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8AB48]" />
                <span className="font-bold text-[#FAF6EE] text-xs font-serif tracking-wide">{item.name}</span>
                {item.price && (
                  <span className="font-mono text-[#E8AB48] font-bold text-xs bg-[#E8AB48]/15 px-2 py-0.5 rounded border border-[#E8AB48]/30">
                    {item.price}
                  </span>
                )}
                {item.badge && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-[#E8AB48] font-bold tracking-wider border border-white/20">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
