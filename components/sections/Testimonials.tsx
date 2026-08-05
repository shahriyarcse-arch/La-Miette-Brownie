"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

export function Testimonials() {
  return (
    <section className="py-28 bg-[#F7F1E5] text-[#221B12] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <span className="text-xs font-mono text-[#B06A2C] uppercase tracking-[0.3em] block font-semibold">
            REVIEWS &amp; ACCOLADES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#221B12]">
            What Critics Are Saying
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-white border border-[#221B12]/5 shadow-[0_8px_30px_rgb(34,27,18,0.06)] hover:border-[#B06A2C]/30 hover:shadow-[0_20px_40px_rgb(176,106,44,0.12)] transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#D9A441]">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-[#B06A2C]/30" />
                <p className="text-[#4A3F2E] text-sm italic font-serif leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-[#221B12]/10">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#B06A2C]/40">
                  <Image
                    src={t.avatar}
                    alt={t.author}
                    fill
                    loading="eager"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-serif text-[#221B12]">
                    {t.author}
                  </h4>
                  <span className="text-[10px] font-mono text-[#B06A2C] uppercase block">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
