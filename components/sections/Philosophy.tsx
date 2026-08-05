"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Heart, Award } from "lucide-react";

export function Philosophy() {
  return (
    <section className="py-28 bg-[#F7F1E5] text-[#221B12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)", scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative h-[480px] md:h-[600px] w-full rounded-3xl overflow-hidden border border-[#221B12]/10 shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop"
                alt="Baker slicing dark chocolate cake"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#221B12]/60 via-transparent to-transparent" />
            </div>

            {/* Overlapping Card */}
            <div className="absolute -bottom-8 -right-4 md:-right-8 p-6 rounded-2xl bg-[#221B12] text-[#F7F1E5] border border-[#D9A441]/40 backdrop-blur-xl shadow-2xl max-w-xs space-y-2">
              <div className="flex items-center gap-2 text-[#D9A441]">
                <Award className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Baker&apos;s Promise
                </span>
              </div>
              <p className="text-xs text-[#F7F1E5]/80 italic font-serif leading-relaxed">
                &ldquo;Baking is an exact science, but dessert is pure emotion. We bake to create moments of unadulterated joy.&rdquo;
              </p>
              <p className="text-[10px] font-mono text-[#D9A441] uppercase pt-1">
                — Mika, Head Pastry Chef
              </p>
            </div>
          </motion.div>

          {/* Philosophy Text */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <span className="text-xs font-mono text-[#B06A2C] uppercase tracking-[0.3em] block font-semibold">
              WHY WE BAKE
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#221B12] leading-tight">
              Joy Is In The Details
            </h2>
            <p className="text-[#4A3F2E] text-base md:text-lg leading-relaxed font-normal">
              In a fast-paced world, we slow down. True indulgence cannot be rushed by machines or chemical shortcuts. At Mika &amp; Co., we wake up before dawn to honor the quiet rhythm of melting chocolate, whipping cream, and folding batters by hand.
            </p>
            <p className="text-[#4A3F2E]/90 text-sm leading-relaxed">
              Every morning, our pastry chefs handcraft every single brownie, cake, and pudding. Guided by a dedication to French pastry techniques, our desserts carry the warmth of roasted hazelnuts, shiny crinkled crusts, and intensely rich fudgy centers.
            </p>

            {/* Feature Bullets */}
            <div className="pt-4 space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#221B12]/5 shadow-[0_8px_30px_rgb(34,27,18,0.06)] hover:shadow-lg transition-shadow duration-300">
                <span className="p-2 rounded-xl bg-[#D9A441]/20 text-[#B06A2C] shrink-0">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#221B12]">Premium, Honest Ingredients</h4>
                  <p className="text-xs text-[#4A3F2E] mt-1">Only pure Belgian chocolate, grass-fed butter, and Madagascar vanilla. Nothing artificial, ever.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#221B12]/5 shadow-[0_8px_30px_rgb(34,27,18,0.06)] hover:shadow-lg transition-shadow duration-300">
                <span className="p-2 rounded-xl bg-[#D9A441]/20 text-[#B06A2C] shrink-0">
                  <Heart className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#221B12]">Baked Fresh Every Morning</h4>
                  <p className="text-xs text-[#4A3F2E] mt-1">No frozen stocks or preservatives. Every dessert is prepared fresh daily for maximum indulgence.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
