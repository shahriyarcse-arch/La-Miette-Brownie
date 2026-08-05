"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  variant = "primary",
  onClick,
  type = "button",
  disabled,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * strength;
    const y = (e.clientY - (top + height / 2)) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles =
    "relative inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold tracking-wider uppercase transition-colors rounded-full overflow-hidden group cursor-pointer shadow-lg";

  const variantStyles = {
    primary:
      "bg-[#221B12] text-[#F7F1E5] hover:bg-[#B06A2C] border border-[#221B12]/40 shadow-xl hover:shadow-[#B06A2C]/30",
    secondary:
      "bg-[#D9A441] text-[#221B12] hover:bg-[#B06A2C] hover:text-[#F7F1E5] border border-[#D9A441]/50 shadow-md",
    outline:
      "bg-transparent text-[#221B12] border-2 border-[#221B12] hover:bg-[#221B12] hover:text-[#F7F1E5]",
    ghost:
      "bg-transparent text-[#4A3F2E] hover:text-[#B06A2C] border border-transparent",
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.1 }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/20 to-amber-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
    </motion.button>
  );
}
