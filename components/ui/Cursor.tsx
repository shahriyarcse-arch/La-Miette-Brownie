"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState<string>("");
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const checkMotion = () => {
      const isDesktop = window.matchMedia("(pointer: fine)").matches;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsHidden(!isDesktop || prefersReduced);
    };

    checkMotion();

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");

    motionQuery.addEventListener("change", checkMotion);
    pointerQuery.addEventListener("change", checkMotion);

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    const xTo = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });
    const ringXTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringYTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    let labelXTo: Function | null = null;
    let labelYTo: Function | null = null;
    if (label) {
      labelXTo = gsap.quickTo(label, "x", { duration: 0.25, ease: "power2.out" });
      labelYTo = gsap.quickTo(label, "y", { duration: 0.25, ease: "power2.out" });
    }

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      ringXTo(e.clientX);
      ringYTo(e.clientY);
      if (labelXTo && labelYTo) {
        labelXTo(e.clientX);
        labelYTo(e.clientY);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorTarget) {
        const text = cursorTarget.getAttribute("data-cursor");
        if (text && text !== "hover") {
          setCursorText(text);
        } else {
          setCursorText("");
        }
      } else {
        setCursorText("");
      }

      const isInteractive = target.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor]"
      );
      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      motionQuery.removeEventListener("change", checkMotion);
      pointerQuery.removeEventListener("change", checkMotion);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="custom-cursor-dot fixed top-0 left-0 z-[10000] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
          style={{
            backgroundColor: "#E8AB48",
            transform: isHovering ? "translate(-50%, -50%) scale(1.8)" : "translate(-50%, -50%) scale(1)",
          }}
        />
      </div>

      {/* Ring */}
      <div
        ref={ringRef}
        className="custom-cursor-ring fixed top-0 left-0 z-[10000] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-11 h-11 rounded-full border -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
          style={{
            borderColor: isHovering ? "#E8AB48" : "rgba(232, 171, 72, 0.35)",
            transform: isHovering
              ? "translate(-50%, -50%) scale(1.4)"
              : "translate(-50%, -50%) scale(1)",
            backgroundColor: isHovering ? "rgba(232, 171, 72, 0.12)" : "transparent",
          }}
        />
      </div>

      {/* Contextual Label Follower */}
      {cursorText && (
        <div
          ref={labelRef}
          className="fixed top-0 left-0 z-[10000] pointer-events-none"
          aria-hidden="true"
        >
          <span className="translate-x-6 -translate-y-6 block px-2.5 py-1 rounded-full bg-[#18120C]/90 text-[#E8AB48] border border-[#E8AB48]/40 text-[9px] font-mono font-bold uppercase tracking-widest backdrop-blur-md shadow-xl">
            {cursorText}
          </span>
        </div>
      )}
    </>
  );
}