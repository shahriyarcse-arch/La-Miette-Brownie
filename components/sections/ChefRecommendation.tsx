"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Volume2, VolumeX, Coffee } from "lucide-react";

export function ChefRecommendation() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      stopCrackle();
    };
  }, []);

  const stopCrackle = () => {
    try {
      noiseSourceRef.current?.stop();
      gainNodeRef.current?.disconnect();
      audioContextRef.current?.close();
    } catch {
      // ignore already-closed context errors
    }
    noiseSourceRef.current = null;
    gainNodeRef.current = null;
    audioContextRef.current = null;
  };

  const toggleCrackleSound = () => {
    if (isPlayingAudio) {
      stopCrackle();
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const crackle =
          Math.random() * 2 - 1;
        const flicker = Math.random() < 0.08 ? Math.random() * 0.8 : 0;
        data[i] = crackle * 0.15 + flicker;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = 0.4;
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 900;

      source.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);
      source.start();

      noiseSourceRef.current = source;
      gainNodeRef.current = gain;
      setIsPlayingAudio(true);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  return (
    <section className="py-28 bg-[#F7F1E5] text-[#221B12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.95, ease: [0.215, 0.61, 0.355, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Content */}
          <div className="space-y-6">
            <span className="text-xs font-mono text-[#B06A2C] uppercase tracking-[0.3em] block font-semibold">
              PASTRY CHEF&apos;S RITUAL
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#221B12]">
              La Miette&apos;s Perfect Morning
            </h2>
            <p className="text-[#4A3F2E] text-base md:text-lg font-normal leading-relaxed">
              &ldquo; Break open a freshly baked, intensely fudgy brownie while the chocolate core is still molten. A drizzle of sea salt, a scoop of vanilla bean gelato, and a fresh cup of hot espresso. There is no simpler joy in the world. &rdquo;
            </p>

            <div className="p-6 rounded-2xl bg-white/80 border border-[#221B12]/10 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <Coffee className="w-5 h-5 text-[#B06A2C]" />
                <h4 className="text-base font-serif font-semibold text-[#221B12]">
                  Sensory Notes
                </h4>
              </div>
              <p className="text-xs text-[#4A3F2E] leading-relaxed">
                The rich aroma of dark Belgian cocoa melting into pure grass-fed butter, balanced by the gentle sweetness of Madagascar vanilla.
              </p>
            </div>

            {/* Crackle Sound Toggle */}
            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={toggleCrackleSound}
                aria-pressed={isPlayingAudio}
                aria-label={isPlayingAudio ? "Stop kitchen ambience audio" : "Play kitchen ambience audio"}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[#221B12] text-[#F7F1E5] border border-[#221B12] hover:bg-[#B06A2C] transition-all font-mono text-xs uppercase shadow-md"
              >
                {isPlayingAudio ? <Volume2 className="w-4 h-4 text-[#D9A441] animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                <span>{isPlayingAudio ? "Kitchen Ambience Playing..." : "Listen to Kitchen Ambience"}</span>
              </button>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="relative h-[450px] w-full rounded-3xl overflow-hidden border border-[#221B12]/10 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop"
              alt="Chef Fudgy Brownie"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#221B12]/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#221B12]/90 backdrop-blur-md border border-[#F7F1E5]/20 text-xs text-[#F7F1E5] font-mono">
              <span className="text-[#D9A441] font-bold block">KITCHEN AUDIO SAMPLER</span>
              Captured live from the Chocolate Room at 05:45 AM
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
