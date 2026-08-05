"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Flame, Milk, Award } from "lucide-react";

export function WhyChooseUs() {
  const pillars = [
    {
      icon: Award,
      title: "Premium Belgian Chocolate",
      description: "We use only the finest 70% dark Belgian and Valrhona chocolate to ensure an intensely rich and deep fudgy flavor.",
    },
    {
      icon: Flame,
      title: "Baked Fresh Every Dawn",
      description: "No frozen stocks. Our ovens start glowing before sunrise so you receive perfectly fresh, gooey, and warm desserts every morning.",
    },
    {
      icon: Milk,
      title: "Pure Grass-Fed Butter",
      description: "Hand-mixed with rich, pure grass-fed butter that gives our brownies their iconic shiny crinkle crust and melt-in-your-mouth texture.",
    },
    {
      icon: ShieldCheck,
      title: "Zero Artificial Flavors",
      description: "No chemical shortcuts or artificial essences. Just pure Madagascar vanilla beans, real organic eggs, and unadulterated love.",
    },
  ];

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
            OUR PROMISE TO YOU
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#221B12]">
            Why Dessert Lovers Choose La Miette
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-8 rounded-3xl bg-white border border-[#221B12]/5 shadow-[0_8px_30px_rgb(34,27,18,0.06)] hover:border-[#B06A2C]/30 hover:shadow-[0_20px_40px_rgb(176,106,44,0.12)] transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#D9A441]/20 border border-[#D9A441]/40 flex items-center justify-center text-[#B06A2C] group-hover:scale-110 group-hover:bg-[#D9A441] group-hover:text-[#221B12] transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#221B12] group-hover:text-[#B06A2C] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-[#4A3F2E] text-xs leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
