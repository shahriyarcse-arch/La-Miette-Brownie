"use client";

import { motion } from "framer-motion";
import { SEASONAL_COLLECTION } from "@/lib/constants";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function SeasonalCollection() {
  return (
    <section id="seasonal" className="py-28 bg-[#F7F1E5]/70 text-[#221B12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <span className="text-xs font-mono text-[#B06A2C] uppercase tracking-[0.3em] block font-semibold">
            LIMITED EDITION
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#221B12]">
            Seasonal Specials
          </h2>
          <p className="text-[#4A3F2E] text-sm md:text-base">
            Exclusive small-batch creations featuring rare micro-harvest ingredients.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {SEASONAL_COLLECTION.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-3xl bg-white border border-[#221B12]/5 shadow-[0_8px_30px_rgb(34,27,18,0.06)] hover:border-[#B06A2C]/30 hover:shadow-[0_20px_40px_rgb(176,106,44,0.12)] transition-all flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="relative h-52 w-full md:w-52 rounded-2xl overflow-hidden shrink-0 bg-[#221B12]/5">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  loading="eager"
                  className="object-cover"
                />
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#B06A2C] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#F7F1E5] border border-[#221B12]/10">
                    {item.season}
                  </span>
                  <span className="text-lg font-serif font-bold text-[#B06A2C]">
                    {item.price}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#221B12]">
                  {item.title}
                </h3>
                <p className="text-[#4A3F2E] text-xs leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.flavorNotes.map((note) => (
                    <span
                      key={note}
                      className="px-2 py-0.5 rounded bg-[#F7F1E5] text-[#4A3F2E] text-[10px] font-mono"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                <div className="pt-3 flex items-center justify-between text-xs text-[#4A3F2E]">
                  <span className="flex items-center gap-1 font-mono text-[11px] text-[#B06A2C]">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.availableUntil}
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
