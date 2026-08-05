"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

import { subscribeNewsletter } from "@/lib/db-actions";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      await subscribeNewsletter(email);
    }
  };

  return (
    <section className="py-28 bg-[#F7F1E5] text-[#221B12] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.95, ease: [0.215, 0.61, 0.355, 1] }}
          className="p-8 md:p-16 rounded-3xl bg-[#221B12] text-[#F7F1E5] border border-[#D9A441]/40 text-center space-y-6 shadow-2xl relative overflow-hidden group"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D9A441]/15 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#D9A441]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />

          <span
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9A441]/20 text-[#D9A441] text-xs font-mono font-semibold uppercase tracking-wider relative z-10"
          >
            <Sparkles className="w-4 h-4 text-[#D9A441] animate-pulse" />
            <span>LETTERS FROM THE KITCHEN</span>
          </span>

          <h2
            className="text-3xl md:text-5xl font-serif font-bold text-[#F7F1E5] relative z-10"
          >
            Join Our Tasting Club
          </h2>

          <p
            className="text-[#F7F1E5]/70 text-sm md:text-base max-w-md mx-auto relative z-10 leading-relaxed"
          >
            Receive sweet notes from our pastry kitchen, secret recipes, and VIP early access when limited-edition dessert batches drop.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-sm max-w-md mx-auto flex items-center justify-center gap-2 relative z-10"
            >
              <Check className="w-5 h-5 text-emerald-400" />
              <span>Welcome to the Tasting Club! Check your inbox for a sweet surprise.</span>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto relative z-10"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full px-5 py-3.5 rounded-full bg-[#F7F1E5]/10 border border-[#F7F1E5]/20 text-[#F7F1E5] placeholder-[#F7F1E5]/50 focus:outline-none focus:border-[#D9A441] focus:ring-2 focus:ring-[#D9A441]/30 transition-all text-sm"
              />
              <MagneticButton variant="secondary" type="submit" className="w-full sm:w-auto shrink-0">
                <span>Subscribe</span>
              </MagneticButton>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
