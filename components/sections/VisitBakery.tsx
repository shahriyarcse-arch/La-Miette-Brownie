"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BAKERY_LOCATIONS } from "@/lib/constants";
import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function VisitBakery() {
  const [selectedLoc, setSelectedLoc] = useState(BAKERY_LOCATIONS[0]);

  return (
    <section id="locations" className="py-28 bg-[#F7F1E5] text-[#221B12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-xs font-mono text-[#B06A2C] uppercase tracking-[0.3em] block mb-2 font-semibold">
              ATELIER LOCATIONS
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#221B12]">
              Visit Our Ateliers
            </h2>
          </div>

          {/* Location Switcher Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {BAKERY_LOCATIONS.map((loc) => {
              const isActive = selectedLoc.id === loc.id;
              return (
                <motion.button
                  key={loc.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedLoc(loc)}
                  className={`relative px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-[#D9A441] text-[#221B12] font-bold shadow-md"
                      : "bg-white text-[#4A3F2E] border border-[#221B12]/10 hover:text-[#B06A2C] hover:border-[#B06A2C]/30 shadow-sm"
                  }`}
                >
                  {loc.city}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Display Card with Animated Switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLoc.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Location Detail */}
            <div className="space-y-6">
              <span className="text-xs font-mono text-[#B06A2C] font-semibold uppercase tracking-widest block">
                ATELIER {selectedLoc.city.toUpperCase()}
              </span>
              <h3 className="text-3xl font-serif font-bold text-[#221B12]">
                {selectedLoc.name}
              </h3>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 text-[#4A3F2E] group">
                  <div className="p-2 rounded-xl bg-[#B06A2C]/10 text-[#B06A2C] shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <p className="text-sm pt-1">{selectedLoc.address}</p>
                </div>

                <div className="flex items-start gap-3 text-[#4A3F2E] group">
                  <div className="p-2 rounded-xl bg-[#B06A2C]/10 text-[#B06A2C] shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-sm pt-1">{selectedLoc.hours}</p>
                </div>

                <div className="flex items-start gap-3 text-[#4A3F2E] group">
                  <div className="p-2 rounded-xl bg-[#B06A2C]/10 text-[#B06A2C] shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <p className="text-sm pt-1">{selectedLoc.phone}</p>
                </div>
              </div>

              <div className="pt-4">
                <MagneticButton
                  variant="primary"
                  onClick={() =>
                    window.open(
                      `https://maps.google.com/?q=${encodeURIComponent(
                        selectedLoc.address
                      )}`,
                      "_blank"
                    )
                  }
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions &rarr;</span>
                </MagneticButton>
              </div>
            </div>

            {/* Location Image */}
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.4 }}
              className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-[#221B12]/10 shadow-xl bg-[#221B12]/5 group"
            >
              <Image
                src={selectedLoc.image}
                alt={selectedLoc.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#221B12]/50 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
