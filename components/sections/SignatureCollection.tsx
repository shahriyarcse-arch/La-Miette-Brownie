"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SIGNATURE_PRODUCTS, Product } from "@/lib/constants";
import { Star, Plus, Check } from "lucide-react";
import Image from "next/image";

interface SignatureCollectionProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function SignatureCollection({
  onSelectProduct,
  onAddToCart,
}: SignatureCollectionProps) {
  const [addedId, setAddedId] = useState<string | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedId(product.id);
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => setAddedId(null), 1500);
  };

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, product: Product) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectProduct(product);
    }
  };

  return (
    <section id="signature" className="py-28 bg-[#F7F1E5] text-[#221B12] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-xs font-mono text-[#B06A2C] uppercase tracking-[0.25em] tracking-expand block mb-2 font-semibold cursor-default">
              FROM OUR MORNING OVEN
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gold-shimmer">
              Best Sellers
            </h2>
          </div>
          <p className="text-[#4A3F2E] text-sm md:text-base max-w-md font-sans leading-relaxed">
            Handcrafted daily in small batches with 70% Belgian dark chocolate, pure grass-fed butter, and organic vanilla beans.
          </p>
        </motion.div>

        {/* Product Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {SIGNATURE_PRODUCTS.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelect(product)}
              onKeyDown={(e) => handleCardKeyDown(e, product)}
              role="button"
              tabIndex={0}
              data-cursor="VIEW"
              className="group relative rounded-3xl bg-white border border-[#221B12]/5 shadow-[0_8px_30px_rgb(34,27,18,0.06)] overflow-hidden hover:border-[#B06A2C]/40 hover:shadow-[0_20px_40px_rgb(176,106,44,0.12)] transition-all duration-500 flex flex-col justify-between cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden bg-[#221B12]/5">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#221B12]/60 via-transparent to-transparent" />

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#221B12]/80 backdrop-blur-md border border-[#D9A441]/40 text-[#D9A441] text-[10px] font-mono tracking-wider uppercase">
                    {product.badge}
                  </span>
                )}

                {/* Rating */}
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#221B12]/80 backdrop-blur-md text-[#D9A441] text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#B06A2C] font-semibold block mb-1">
                    {product.category}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#221B12] group-hover:text-[#B06A2C] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[#4A3F2E] text-xs line-clamp-2 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Ingredients Tag */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {product.ingredients.slice(0, 3).map((ing, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#F7F1E5] text-[#4A3F2E] border border-[#221B12]/10 text-[10px] font-sans"
                    >
                      {ing}
                    </span>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-[#221B12]/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#4A3F2E] block font-mono">Price</span>
                    <span className="text-xl font-serif font-bold text-[#B06A2C]">
                      {product.price}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAdd(e, product)}
                    data-cursor="ADD"
                    className="p-3 rounded-full bg-[#221B12] text-[#F7F1E5] hover:bg-[#B06A2C] transition-colors shadow-md"
                    aria-label={`Add ${product.name} to basket`}
                  >
                    {addedId === product.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
