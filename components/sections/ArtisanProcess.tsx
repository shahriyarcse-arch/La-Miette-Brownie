"use client";

import { motion } from "framer-motion";
import { ARTISAN_PROCESS } from "@/lib/constants";

export function ArtisanProcess() {
  return (
    <section id="process" className="py-28 bg-[#221B12] text-[#F7F1E5] relative rounded-[2.5rem] mx-3 md:mx-6 my-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <span className="text-xs font-mono text-[#D9A441] uppercase tracking-[0.3em] tracking-expand block font-semibold cursor-default">
            THE ART OF BAKING
          </span>
          <h2 className="text-3xl md:text-6xl font-serif font-bold text-gold-gradient">
            How Our Desserts Are Born
          </h2>
          <p className="text-[#F7F1E5]/75 text-base md:text-lg font-light leading-relaxed">
            From sourcing the finest Belgian chocolate to handcrafting every batch with precision before the city wakes.
          </p>
        </motion.div>

        {/* 4 Steps Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
        >
          {ARTISAN_PROCESS.map((item) => (
            <div
              key={item.step}
              className="relative p-8 rounded-3xl bg-[#F7F1E5]/05 border border-[#F7F1E5]/12 hover:border-[#D9A441]/60 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#F7F1E5]/10 pb-4">
                  <span className="text-4xl font-serif font-bold text-[#D9A441] group-hover:scale-110 transition-transform">
                    {item.step}
                  </span>
                  <span className="text-[9px] sm:text-[10px] whitespace-nowrap font-mono text-[#D9A441] uppercase px-2.5 py-1 rounded-full bg-[#F7F1E5]/10">
                    {item.duration}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#F7F1E5]">
                  {item.title}
                </h3>
                <p className="text-[#F7F1E5]/70 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F7F1E5]/10 text-[11px] text-[#D9A441] font-mono italic">
                &ldquo;{item.detail}&rdquo;
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
