"use client";

import { type ReactNode } from "react";
import { useLenis } from "@/hooks/useLenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useLenis();

  return <>{children}</>;
}