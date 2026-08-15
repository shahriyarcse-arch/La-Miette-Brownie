"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, Twitter, MapPin, Clock, Phone, X, ShieldCheck, FileText, AlertCircle } from "lucide-react";

type ModalType = "privacy" | "terms" | "allergen" | null;

export function Footer() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#120B06] text-[#FAF6EE] pt-24 pb-12 border-t border-[#D9A441]/20 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D9A441]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B5A2B]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-6 md:px-12 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-[#FAF6EE]/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (typeof window !== "undefined") {
                  const win = window as unknown as {
                    __lenis?: { scrollTo: (target: number | string, opts?: { duration?: number; force?: boolean }) => void };
                  };
                  if (win.__lenis) {
                    win.__lenis.scrollTo(0, { duration: 1.6, force: true });
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  if (window.location.hash) {
                    window.history.replaceState(null, "", window.location.pathname);
                  }
                }
              }}
              className="flex items-center gap-3 group cursor-pointer w-fit text-left bg-transparent border-0 p-0"
              aria-label="Scroll to top"
            >
              <span className="w-3 h-3 rounded-full bg-[#E8AB48] shadow-[0_0_12px_rgba(232,171,72,0.9)] transition-transform duration-300 group-hover:scale-125" />
              <span className="text-2xl md:text-3xl font-serif font-bold text-[#FAF6EE] tracking-tight group-hover:text-[#E8AB48] transition-colors duration-300">
                La Miette Brownie
              </span>
            </button>
            <p className="text-[#FAF6EE]/70 text-sm leading-relaxed max-w-sm font-sans">
              Artisanal luxury dessert boutique &amp; cake studio. Handcrafting intensely rich Belgian chocolate brownies, molten cheesecakes, and NYC-style chunky cookies daily with pure passion in Dhaka.
            </p>

            {/* Social Media Links with Real URLs */}
            <div className="flex items-center gap-3 text-[#E8AB48]">
              <motion.a
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-[#E8AB48] hover:text-[#E8AB48] hover:bg-[#E8AB48]/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-[#E8AB48] hover:text-[#E8AB48] hover:bg-[#E8AB48]/10 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-[#E8AB48] hover:text-[#E8AB48] hover:bg-[#E8AB48]/10 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Our Menu */}
          <div className="space-y-4">
            <h4 className="text-[#E8AB48] font-mono font-bold tracking-widest text-xs uppercase">
              OUR MENU
            </h4>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <a href="#signature" onClick={(e) => handleNavClick("signature", e)} className="text-[#FAF6EE]/80 hover:text-[#E8AB48] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Belgian Fudgy Brownies
                </a>
              </li>
              <li>
                <a href="#signature" onClick={(e) => handleNavClick("signature", e)} className="text-[#FAF6EE]/80 hover:text-[#E8AB48] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Burnt Caramel Cheesecakes
                </a>
              </li>
              <li>
                <a href="#products" onClick={(e) => handleNavClick("products", e)} className="text-[#FAF6EE]/80 hover:text-[#E8AB48] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Chunky NYC Cookies
                </a>
              </li>
              <li>
                <a href="#seasonal" onClick={(e) => handleNavClick("seasonal", e)} className="text-[#FAF6EE]/80 hover:text-[#E8AB48] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Seasonal Dessert Boxes
                </a>
              </li>
              <li>
                <a href="#products" onClick={(e) => handleNavClick("products", e)} className="text-[#FAF6EE]/80 hover:text-[#E8AB48] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Silk Custard Puddings
                </a>
              </li>
            </ul>
          </div>

          {/* Our Craft */}
          <div className="space-y-4">
            <h4 className="text-[#E8AB48] font-mono font-bold tracking-widest text-xs uppercase">
              OUR CRAFT
            </h4>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <a href="#process" onClick={(e) => handleNavClick("process", e)} className="text-[#FAF6EE]/80 hover:text-[#E8AB48] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Pure Belgian Cacao
                </a>
              </li>
              <li>
                <a href="#process" onClick={(e) => handleNavClick("process", e)} className="text-[#FAF6EE]/80 hover:text-[#E8AB48] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Grass-Fed Butter
                </a>
              </li>
              <li>
                <a href="#fresh-bake" onClick={(e) => handleNavClick("fresh-bake", e)} className="text-[#FAF6EE]/80 hover:text-[#E8AB48] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Live Oven Batches
                </a>
              </li>
              <li>
                <a href="#locations" onClick={(e) => handleNavClick("locations", e)} className="text-[#FAF6EE]/80 hover:text-[#E8AB48] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Gulshan Atelier
                </a>
              </li>
              <li>
                <a href="#locations" onClick={(e) => handleNavClick("locations", e)} className="text-[#FAF6EE]/80 hover:text-[#E8AB48] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Dhanmondi Studio
                </a>
              </li>
            </ul>
          </div>

          {/* Studio Hours & Contact */}
          <div className="space-y-4">
            <h4 className="text-[#E8AB48] font-mono font-bold tracking-widest text-xs uppercase">
              STUDIO HOURS
            </h4>
            <div className="space-y-3 text-xs leading-relaxed font-sans">
              <div className="flex items-start gap-2.5 text-[#FAF6EE]">
                <Clock className="w-4 h-4 text-[#E8AB48] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#FAF6EE]">Daily Oven Batches</p>
                  <p className="text-[#FAF6EE]/60 font-mono">09:00 AM – 11:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-[#FAF6EE]">
                <MapPin className="w-4 h-4 text-[#E8AB48] shrink-0 mt-0.5" />
                <p className="text-[#FAF6EE]/60">House 14, Road 53, Gulshan-2, Dhaka</p>
              </div>
              <div className="flex items-start gap-2.5 text-[#FAF6EE]">
                <Phone className="w-4 h-4 text-[#E8AB48] shrink-0 mt-0.5" />
                <p className="text-[#FAF6EE]/60 font-mono">+880 1711-902341</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Scroll-to-Top & Legal Modals */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#FAF6EE]/50">
          <p suppressHydrationWarning>© {new Date().getFullYear()} La Miette Brownie — Luxury Dessert Boutique. All Rights Reserved.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveModal("privacy")}
              className="hover:text-[#E8AB48] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveModal("terms")}
              className="hover:text-[#E8AB48] transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActiveModal("allergen")}
              className="hover:text-[#E8AB48] transition-colors"
            >
              Allergen Guide
            </button>
          </div>
        </div>
      </motion.div>

      {/* Policy & Allergen Modals */}
      <AnimatePresence>
        {activeModal && (
          <div
            className="fixed inset-0 z-[10000] bg-[#18120C]/85 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl bg-[#18120C] text-[#FAF6EE] border border-[#E8AB48]/40 shadow-2xl p-6 md:p-8 space-y-4"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-[#FAF6EE] hover:text-[#E8AB48] hover:bg-white/20 transition-all"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {activeModal === "privacy" && (
                <>
                  <div className="flex items-center gap-3 text-[#E8AB48]">
                    <ShieldCheck className="w-6 h-6" />
                    <h3 className="text-xl font-serif font-bold text-[#FAF6EE]">Privacy Policy</h3>
                  </div>
                  <p className="text-sm text-[#FAF6EE]/80 font-sans leading-relaxed">
                    At La Miette Brownie, your privacy is paramount. All order information and delivery details are stored securely. We never share your personal data with third parties.
                  </p>
                </>
              )}

              {activeModal === "terms" && (
                <>
                  <div className="flex items-center gap-3 text-[#E8AB48]">
                    <FileText className="w-6 h-6" />
                    <h3 className="text-xl font-serif font-bold text-[#FAF6EE]">Terms of Service</h3>
                  </div>
                  <p className="text-sm text-[#FAF6EE]/80 font-sans leading-relaxed">
                    Orders are baked fresh daily. Express same-day delivery across Dhaka applies to orders confirmed before 4:00 PM. Dessert batch availability is limited to ensure artisanal quality.
                  </p>
                </>
              )}

              {activeModal === "allergen" && (
                <>
                  <div className="flex items-center gap-3 text-[#E8AB48]">
                    <AlertCircle className="w-6 h-6" />
                    <h3 className="text-xl font-serif font-bold text-[#FAF6EE]">Allergen &amp; Dietary Guide</h3>
                  </div>
                  <p className="text-sm text-[#FAF6EE]/80 font-sans leading-relaxed">
                    Our desserts contain dairy (pure butter, cream), eggs, and gluten. Select items contain tree nuts (hazelnuts, walnuts). 100% alcohol-free &amp; pork-free.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
