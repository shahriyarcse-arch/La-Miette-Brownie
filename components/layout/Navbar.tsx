"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

import Image from "next/image";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: "Best Sellers", href: "#signature" },
    { label: "Our Menu", href: "#products" },
    { label: "How We Bake", href: "#process" },
    { label: "Daily Batches", href: "#fresh-bake" },
    { label: "Limited Edition", href: "#seasonal" },
    { label: "Visit Us", href: "#locations" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9000] px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none transition-all duration-300 select-none">
        <div
          className={`max-w-[1360px] mx-auto px-5 sm:px-8 py-3 rounded-full pointer-events-auto transition-all duration-300 ease-out flex items-center justify-between gap-4 ${
            isScrolled
              ? "bg-[#FFFDF9]/95 backdrop-blur-xl border border-[#D9A441]/40 shadow-[0_12px_40px_rgba(34,27,18,0.22)] text-[#1C130B]"
              : "bg-[#18120C]/40 backdrop-blur-md border border-white/15 text-[#FAF6EE] shadow-lg"
          }`}
        >
          {/* Logo */}
          <a
            href="#"
            data-cursor="La Miette Brownie"
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 whitespace-nowrap"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8AB48] shadow-[0_0_10px_rgba(232,171,72,0.9)] transition-transform duration-300 group-hover:scale-125" />
            <span className={`text-xl md:text-2xl font-serif font-bold tracking-tight whitespace-nowrap transition-colors duration-300 ${
              isScrolled ? "text-[#1C130B]" : "text-[#FAF6EE] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            }`}>
              La Miette Brownie
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-[11px] font-mono font-semibold uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-300 py-1 relative group ${
                  isScrolled ? "text-[#2C2015] hover:text-[#B06A2C]" : "text-[#FAF6EE] hover:text-[#E8AB48] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 ${
                  isScrolled ? "bg-[#B06A2C] group-hover:w-full" : "bg-[#E8AB48] group-hover:w-full"
                }`} />
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3.5 shrink-0 whitespace-nowrap">
            {/* Bag Button */}
            <button
              onClick={onOpenCart}
              data-cursor="CART"
              className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 group hover:scale-110 ${
                isScrolled
                  ? "border-[#D9A441]/40 bg-[#FFFDF9] text-[#1C130B] hover:border-[#E8AB48] hover:bg-[#E8AB48] hover:text-[#18120C] shadow-sm hover:shadow-[0_0_15px_rgba(232,171,72,0.4)]"
                  : "border-white/20 bg-[#18120C]/70 backdrop-blur-md text-[#FAF6EE] hover:border-[#E8AB48] hover:text-[#E8AB48] shadow-md hover:shadow-[0_0_15px_rgba(232,171,72,0.4)]"
              }`}
              aria-label="View Basket"
            >
              <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-300 group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#E8AB48] text-[#18120C] font-bold text-[10px] flex items-center justify-center shadow-md ring-2 ring-[#18120C]/20">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Order Now Button */}
            <div className="hidden sm:block whitespace-nowrap">
              <button
                onClick={() => {
                  const el = document.getElementById("products");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                data-cursor="ORDER"
                className="px-5 py-2.5 rounded-full bg-[#E8AB48] hover:bg-[#D9A441] text-[#18120C] font-mono font-bold text-[11px] uppercase tracking-[0.12em] shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                Pre-Order Now
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors focus:outline-none ${
                isScrolled ? "text-[#1C130B]" : "text-[#FAF6EE]"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[8999] bg-[#F7F1E5]/98 backdrop-blur-2xl flex flex-col justify-center px-8 py-16 lg:hidden">
          <nav className="flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-serif text-[#221B12] hover:text-[#B06A2C] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-6">
              <MagneticButton
                variant="primary"
                className="w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById("products");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Pre-Order Now
              </MagneticButton>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
