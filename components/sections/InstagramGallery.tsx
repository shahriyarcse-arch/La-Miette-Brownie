"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INSTAGRAM_POSTS } from "@/lib/constants";
import { Instagram, Heart, X } from "lucide-react";
import Image from "next/image";

export function InstagramGallery() {
  const [selectedPost, setSelectedPost] = useState<typeof INSTAGRAM_POSTS[0] | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const QUAD_POSTS = [...INSTAGRAM_POSTS, ...INSTAGRAM_POSTS];

  const openPost = (post: typeof INSTAGRAM_POSTS[0]) => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setSelectedPost(post);
  };

  const closePost = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
    if (!selectedPost) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePost();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [selectedPost]);

  const handleCardKeyDown = (
    e: React.KeyboardEvent,
    post: typeof INSTAGRAM_POSTS[0]
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPost(post);
    }
  };

  return (
    <section className="py-24 bg-[#F7F1E5] text-[#221B12] relative overflow-hidden">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <div>
              <span className="text-xs font-mono text-[#B06A2C] uppercase tracking-[0.3em] block mb-2 font-semibold">
                @MIKA.AND.CO
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#221B12]">
                Instagram Gallery
              </h2>
            </div>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#221B12] text-[#FAF6EE] text-xs font-mono font-semibold uppercase tracking-wider hover:bg-[#B06A2C] transition-all shadow-md group shrink-0"
            >
              <Instagram className="w-4 h-4 text-[#E8AB48] transition-transform group-hover:rotate-12" />
              <span>Follow Atelier On Instagram &rarr;</span>
            </a>
          </motion.div>
        </div>

      {/* 100% Seamless Gapless Slow Infinite Marquee Ribbon */}
      <div className="w-full overflow-hidden select-none">
        <div className="flex w-max items-center gap-8 animate-[marquee_85s_linear_infinite] hover:[animation-play-state:paused]">
          {/* Primary Track */}
          <div className="flex items-center gap-8 shrink-0">
            {QUAD_POSTS.map((post, idx) => (
              <div
                key={`primary-${post.id}-${idx}`}
                onClick={() => openPost(post)}
                onKeyDown={(e) => handleCardKeyDown(e, post)}
                role="button"
                tabIndex={0}
                aria-label={`View Instagram post: ${post.caption}`}
                data-cursor="INSTA"
                className="group relative w-[280px] sm:w-[320px] md:w-[360px] h-[340px] md:h-[400px] rounded-3xl overflow-hidden cursor-pointer shrink-0 border border-[#221B12]/10 bg-[#221B12] shadow-xl transition-all duration-300 hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  loading="eager"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Individual Card Hover Overlay */}
                <div className="absolute inset-0 bg-[#221B12]/80 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6 text-[#FAF6EE]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#D9A441]">
                    <span>@MIKA.AND.CO</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-current text-rose-500" />
                      {post.likes}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-serif line-clamp-2 leading-snug">{post.caption}</p>
                    <span className="text-[10px] font-mono text-[#D9A441] uppercase tracking-wider block">
                      Click to view details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Duplicate Seamless Sibling Track */}
          <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
            {QUAD_POSTS.map((post, idx) => (
              <div
                key={`dup-${post.id}-${idx}`}
                onClick={() => setSelectedPost(post)}
                data-cursor="INSTA"
                className="group relative w-[280px] sm:w-[320px] md:w-[360px] h-[340px] md:h-[400px] rounded-3xl overflow-hidden cursor-pointer shrink-0 border border-[#221B12]/10 bg-[#221B12] shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  loading="eager"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Individual Card Hover Overlay */}
                <div className="absolute inset-0 bg-[#221B12]/80 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6 text-[#FAF6EE]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#D9A441]">
                    <span>@MIKA.AND.CO</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-current text-rose-500" />
                      {post.likes}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-serif line-clamp-2 leading-snug">{post.caption}</p>
                    <span className="text-[10px] font-mono text-[#D9A441] uppercase tracking-wider block">
                      Click to view details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

          {/* Lightbox Modal */}
          <AnimatePresence>
            {selectedPost && (
              <div
                className="fixed inset-0 z-[10000] bg-[#221B12]/80 backdrop-blur-xl flex items-center justify-center p-6"
                onClick={closePost}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label={`Instagram post: ${selectedPost.caption}`}
                  className="relative max-w-lg w-full rounded-3xl bg-[#18120C] text-[#FAF6EE] border border-[#E8AB48]/50 overflow-visible shadow-2xl p-6"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                {/* High-Contrast Luxury Close Button */}
                <button
                  ref={closeButtonRef}
                  onClick={closePost}
                  className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 rounded-full bg-[#18120C] text-[#E8AB48] border-2 border-[#E8AB48] shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:bg-[#E8AB48] hover:text-[#18120C] hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>

              <div className="relative h-72 w-full rounded-2xl overflow-hidden mb-4 bg-[#221B12]">
                <Image
                  src={selectedPost.image}
                  alt={selectedPost.caption}
                  fill
                  loading="eager"
                  className="object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#D9A441] font-mono">
                  <span>@MIKA.AND.CO</span>
                  <span>{selectedPost.likes} Likes</span>
                </div>
                <p className="text-[#FAF6EE]/80 text-sm font-serif leading-relaxed">
                  {selectedPost.caption}
                </p>
              </div>
                  </motion.div>
                </div>
              </div>
        )}
      </AnimatePresence>
      </div>
    </section>
  );
}
