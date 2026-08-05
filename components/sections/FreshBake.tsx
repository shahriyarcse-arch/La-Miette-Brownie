"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Clock, Bell, Check } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const SCHEDULE = [
  { hour: 7, minute: 0, label: "07:00 AM", item: "Basque Burnt Caramel Cheesecake" },
  { hour: 11, minute: 30, label: "11:30 AM", item: "Belgian Dark Chocolate Fudgy Brownie" },
  { hour: 15, minute: 30, label: "03:30 PM", item: "NYC Chunky Double Choco Chip Cookie" },
];

export function FreshBake() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [activeBatchIndex, setActiveBatchIndex] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      let nextBatchIdx = 0;
      let targetTime = new Date(now);

      const found = SCHEDULE.findIndex(
        (b) => currentHour < b.hour || (currentHour === b.hour && currentMinute < b.minute)
      );

      if (found !== -1) {
        nextBatchIdx = found;
        targetTime.setHours(SCHEDULE[found].hour, SCHEDULE[found].minute, 0, 0);
      } else {
        nextBatchIdx = 0;
        targetTime.setDate(targetTime.getDate() + 1);
        targetTime.setHours(SCHEDULE[0].hour, SCHEDULE[0].minute, 0, 0);
      }

      setActiveBatchIndex(nextBatchIdx);

      const diff = targetTime.getTime() - now.getTime();
      if (diff > 0) {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const batches = SCHEDULE.map((b, idx) => {
    let status = "Upcoming";
    if (mounted) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const isPast = currentHour > b.hour || (currentHour === b.hour && currentMinute >= b.minute);
      
      if (isPast) {
        status = "Completed";
      } else if (idx === activeBatchIndex) {
        status = "Next Batch";
      }
    }
    return { time: b.label, item: b.item, status };
  });

  return (
    <section id="fresh-bake" className="py-28 bg-[#F7F1E5] text-[#221B12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.95, ease: [0.215, 0.61, 0.355, 1] }}
          className="p-8 md:p-16 rounded-3xl bg-[#221B12] text-[#F7F1E5] border border-[#D9A441]/40 shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Countdown Box */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9A441]/20 text-[#D9A441] text-xs font-mono font-semibold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-[#D9A441] animate-pulse" />
                <span>FRESH OVEN BATCH</span>
              </span>

              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gold-gradient">
                Next Batch Fresh Out in:
              </h2>

              {/* Big Timer Display */}
              <div className="flex items-center gap-2 md:gap-4 py-4">
                <div className="p-4 md:p-6 rounded-2xl bg-[#F7F1E5]/10 border border-[#D9A441]/40 text-center min-w-[80px] md:min-w-[100px]">
                  <span suppressHydrationWarning className="text-3xl md:text-5xl font-mono font-bold text-[#D9A441]">
                    {mounted ? String(timeLeft.hours).padStart(2, "0") : "00"}
                  </span>
                  <span className="text-[10px] font-mono text-[#F7F1E5]/60 uppercase tracking-widest block mt-1">
                    Hours
                  </span>
                </div>

                <span className="text-3xl md:text-4xl font-serif font-bold text-[#D9A441]">:</span>

                <div className="p-4 md:p-6 rounded-2xl bg-[#F7F1E5]/10 border border-[#D9A441]/40 text-center min-w-[80px] md:min-w-[100px]">
                  <span suppressHydrationWarning className="text-3xl md:text-5xl font-mono font-bold text-[#D9A441]">
                    {mounted ? String(timeLeft.minutes).padStart(2, "0") : "00"}
                  </span>
                  <span className="text-[10px] font-mono text-[#F7F1E5]/60 uppercase tracking-widest block mt-1">
                    Minutes
                  </span>
                </div>

                <span className="text-3xl md:text-4xl font-serif font-bold text-[#D9A441]">:</span>

                <div className="p-4 md:p-6 rounded-2xl bg-[#F7F1E5]/10 border border-[#D9A441]/40 text-center min-w-[80px] md:min-w-[100px]">
                  <span suppressHydrationWarning className="text-3xl md:text-5xl font-mono font-bold text-[#D9A441]">
                    {mounted ? String(timeLeft.seconds).padStart(2, "0") : "00"}
                  </span>
                  <span className="text-[10px] font-mono text-[#F7F1E5]/60 uppercase tracking-widest block mt-1">
                    Seconds
                  </span>
                </div>
              </div>

              <p className="text-[#F7F1E5]/70 text-sm">
                Get intensely rich, melt-in-your-mouth brownies and soft baked cookies straight from our ovens while they are perfectly gooey.
              </p>

              <MagneticButton
                variant="secondary"
                onClick={() => setSubscribed(!subscribed)}
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Alert Saved!</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Notify Me When Fresh Desserts Are Ready</span>
                  </>
                )}
              </MagneticButton>
            </div>

            {/* Today's Schedule */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-[#F7F1E5] mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D9A441]" />
                Today&apos;s Bake Schedule
              </h3>

              <div className="space-y-3">
                {batches.map((b) => (
                  <div
                    key={b.time}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      b.status === "Next Batch"
                        ? "bg-[#D9A441]/20 border-[#D9A441] text-[#F7F1E5]"
                        : "bg-[#F7F1E5]/05 border-[#F7F1E5]/15 text-[#F7F1E5]/70"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-[#D9A441] block">
                        {b.time}
                      </span>
                      <p className="text-sm font-semibold text-[#F7F1E5]">{b.item}</p>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full ${
                        b.status === "Next Batch"
                          ? "bg-[#D9A441] text-[#221B12] font-bold"
                          : b.status === "Completed"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-[#F7F1E5]/10 text-[#F7F1E5]/60"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
