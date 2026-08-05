"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_PRODUCTS, Product } from "@/lib/constants";
import { Star, Plus, Check, Filter } from "lucide-react";
import Image from "next/image";

interface FeaturedProductsProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function FeaturedProducts({
  onSelectProduct,
  onAddToCart,
}: FeaturedProductsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = ["All", "Brownies", "Pastries", "Puddings", "Cakes", "Cookies"];

  const filteredProducts =
    activeCategory === "All"
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter((p) => p.category === activeCategory);

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="products" className="py-28 bg-[#F7F1E5]/70 text-[#221B12] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header & Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
        >
          <div>
            <span className="text-xs font-mono text-[#B06A2C] uppercase tracking-[0.25em] tracking-expand block mb-2 font-semibold cursor-default">
              FRESH FROM THE BAKEHOUSE
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gold-shimmer">
              Our Bakehouse Menu
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#D9A441] text-[#221B12] shadow-md"
                    : "bg-white/80 text-[#4A3F2E] hover:text-[#B06A2C] border border-[#221B12]/15"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  data-cursor="DETAILS"
                  className="group rounded-3xl bg-white/80 border border-[#221B12]/10 overflow-hidden hover:border-[#B06A2C]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden bg-[#221B12]/5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    loading="eager"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#221B12]/40 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-[#B06A2C] font-semibold uppercase">{product.category}</span>
                      <span className="flex items-center gap-1 text-[#D9A441]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-[#221B12] font-semibold">{product.rating}</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#221B12] group-hover:text-[#B06A2C] transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-[#221B12]/10 flex items-center justify-between">
                    <span className="text-lg font-serif font-bold text-[#B06A2C]">
                      {product.price}
                    </span>

                    <button
                      onClick={(e) => handleAdd(e, product)}
                      className="p-2.5 rounded-full bg-[#221B12] text-[#F7F1E5] hover:bg-[#B06A2C] transition-colors shadow-md"
                      aria-label="Add product"
                    >
                      {addedId === product.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
