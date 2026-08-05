"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { ArrowUp } from "lucide-react";

export function ScrollProgress() {
  const progress = useScrollProgress();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Top Scroll Progress Line (Transparent track, gold fill) */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-transparent z-[9990] pointer-events-none overflow-hidden">
        <div
          className="h-full w-full bg-gradient-to-r from-[#B06A2C] via-[#E8AB48] to-[#FAF6EE] origin-left will-change-transform"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      {/* Floating Back-to-Top Button */}
      {progress > 15 && (
        <button
          onClick={scrollToTop}
          data-cursor="TOP"
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-[9980] w-12 h-12 rounded-full bg-[#18120C]/90 text-[#E8AB48] border border-[#E8AB48]/40 backdrop-blur-xl flex items-center justify-center shadow-2xl hover:bg-[#E8AB48] hover:text-[#18120C] hover:scale-110 transition-all duration-300 group"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5] transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      )}
    </>
  );
}
