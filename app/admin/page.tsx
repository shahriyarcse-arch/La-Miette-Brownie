"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  LogOut,
  Search,
  Package,
  Clock,
  ChefHat,
  BarChart3,
  Download,
  Eye,
  Trash2,
  ArrowRight,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Users,
  X,
  Flame,
  CheckCircle2,
  Timer,
  ToggleLeft,
  ToggleRight,
  Bell,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCart, BakeryOrder, OrderStatus } from "@/context/CartContext";
import { ALL_PRODUCTS, parsePrice } from "@/lib/constants";
import { updateDatabaseOrderStatus, toggleDatabaseProductStock } from "@/lib/db-actions";

// ─── Admin Passcode ──────────────────────────────────────────────
const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "1984";

// ─── Order Status Pipeline ───────────────────────────────────────
const STATUS_PIPELINE: OrderStatus[] = [
  "Reserved",
  "In Oven",
  "Ready For Pickup",
  "Completed",
];

const STATUS_CONFIG: Record<
  OrderStatus,
  { color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  Reserved: {
    color: "text-amber-300",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    icon: <Timer className="w-3.5 h-3.5" />,
  },
  "In Oven": {
    color: "text-orange-400",
    bg: "bg-orange-500/15",
    border: "border-orange-500/30",
    icon: <Flame className="w-3.5 h-3.5" />,
  },
  "Ready For Pickup": {
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  Completed: {
    color: "text-sky-400",
    bg: "bg-sky-500/15",
    border: "border-sky-500/30",
    icon: <Package className="w-3.5 h-3.5" />,
  },
};

// ─── Oven Batch Schedules ────────────────────────────────────────
interface OvenBatch {
  id: string;
  label: string;
  time: string;
  description: string;
  active: boolean;
}

const DEFAULT_BATCHES: OvenBatch[] = [
  {
    id: "dawn",
    label: "Dawn Batch",
    time: "07:00 AM",
    description: "Sourdough loaves, croissants, brioches",
    active: true,
  },
  {
    id: "noon",
    label: "Noon Oven",
    time: "11:30 AM",
    description: "Baguettes, focaccia, tartlets",
    active: true,
  },
  {
    id: "evening",
    label: "Evening Batch",
    time: "03:30 PM",
    description: "Pain au chocolat, seasonal pastries",
    active: false,
  },
];

// ─── Tab IDs ─────────────────────────────────────────────────────
type AdminTab = "orders" | "inventory" | "oven" | "analytics";

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: "orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { id: "inventory", label: "Inventory", icon: <Package className="w-4 h-4" /> },
  { id: "oven", label: "Oven Schedule", icon: <ChefHat className="w-4 h-4" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
];

// ─── Utility: CSV Export ─────────────────────────────────────────
function exportOrdersCsv(orders: BakeryOrder[]) {
  const header = "Order ID,Customer,Phone,Email,Pickup,Status,Subtotal,Items,Date\n";
  const rows = orders.map((o) => {
    const items = o.items.map((i) => `${i.quantity}x ${i.product.name}`).join(" | ");
    return `${o.orderId},"${o.customer.name}","${o.customer.phone}","${o.customer.email}","${o.customer.pickupTime}",${o.status},৳${o.subtotal},"${items}",${o.createdAtISO || o.createdAt}`;
  });
  const csv = header + rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mika-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Page Component ──────────────────────────────────────────────
export default function AdminDashboard() {
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    productStock,
    toggleProductStock,
  } = useCart();

  const [authenticated, setAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [selectedOrder, setSelectedOrder] = useState<BakeryOrder | null>(null);
  const [ovenBatches, setOvenBatches] = useState<OvenBatch[]>(DEFAULT_BATCHES);
  const [mounted, setMounted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState<BakeryOrder | null>(null);
  const [prevOrdersCount, setPrevOrdersCount] = useState(orders.length);

  // Web Audio API — Luxury Bakery Bell Sound Synthesizer
  const playOrderChime = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(880, 0, 0.5);   // High A5 note
      playTone(1174.66, 0.15, 0.8); // High D6 gold bell note
    } catch {
      // AudioContext blocked before user interaction
    }
  }, [soundEnabled]);

  // Real-Time New Order Detection
  useEffect(() => {
    if (orders.length > prevOrdersCount && prevOrdersCount > 0) {
      const latest = orders[0];
      setNewOrderAlert(latest);
      playOrderChime();
    }
    setPrevOrdersCount(orders.length);
  }, [orders, prevOrdersCount, playOrderChime]);

  useEffect(() => {
    setMounted(true);
    // Restore admin session
    try {
      const saved = sessionStorage.getItem("mika_admin_auth");
      if (saved === "true") setAuthenticated(true);
    } catch {
      // silent
    }
  }, []);

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (passcodeInput === ADMIN_PASSCODE) {
        setAuthenticated(true);
        setPasscodeError(false);
        try {
          sessionStorage.setItem("mika_admin_auth", "true");
        } catch {
          // silent
        }
      } else {
        setPasscodeError(true);
        setPasscodeInput("");
      }
    },
    [passcodeInput]
  );

  const handleLogout = useCallback(() => {
    setAuthenticated(false);
    try {
      sessionStorage.removeItem("mika_admin_auth");
    } catch {
      // silent
    }
  }, []);

  // ── Escape Key handler ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedOrder(null);
        setDeleteConfirm(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ── KPI Metrics ──
  const kpis = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter(
      (o) => (o.createdAtISO || "").slice(0, 10) === todayStr
    );
    const totalRevenue = todayOrders.reduce(
      (s, o) => s + parseFloat(o.subtotal),
      0
    );
    const pendingCount = orders.filter(
      (o) => o.status !== "Completed"
    ).length;
    const avgOrder =
      todayOrders.length > 0 ? totalRevenue / todayOrders.length : 0;
    return {
      todayRevenue: totalRevenue.toFixed(2),
      todayOrderCount: todayOrders.length,
      avgOrder: avgOrder.toFixed(2),
      pendingCount,
      totalOrders: orders.length,
    };
  }, [orders]);

  // ── Filtered orders ──
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        statusFilter === "All" || o.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        o.orderId.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // ── Analytics data ──
  const analyticsData = useMemo(() => {
    const categoryMap: Record<string, { revenue: number; count: number }> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const cat = item.product.category;
        if (!categoryMap[cat]) categoryMap[cat] = { revenue: 0, count: 0 };
        const price = parsePrice(item.product.price);
        categoryMap[cat].revenue += price * item.quantity;
        categoryMap[cat].count += item.quantity;
      });
    });
    const maxRevenue = Math.max(
      ...Object.values(categoryMap).map((v) => v.revenue),
      1
    );
    return { categoryMap, maxRevenue };
  }, [orders]);

  // ── Get next status in pipeline ──
  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = STATUS_PIPELINE.indexOf(current);
    return idx < STATUS_PIPELINE.length - 1
      ? STATUS_PIPELINE[idx + 1]
      : null;
  };

  // ── SSR guard ──
  if (!mounted) return null;

  // ═══════════════════════════════════════════════════════════════
  // PASSCODE LOGIN GATE
  // ═══════════════════════════════════════════════════════════════
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0F0D0A] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#D9A441]/8 blur-[160px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md"
        >
          <div className="rounded-3xl bg-[#1A1612]/80 backdrop-blur-2xl border border-[#F7F1E5]/10 p-8 md:p-10 shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D9A441] to-[#B06A2C] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D9A441]/20">
                <Lock className="w-7 h-7 text-[#0F0D0A]" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-[#F7F1E5]">
                Mika & Co.
              </h1>
              <p className="text-[#F7F1E5]/40 text-xs font-mono mt-1 tracking-widest uppercase">
                Admin Dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-passcode"
                  className="text-[10px] font-mono text-[#D9A441] uppercase tracking-widest block mb-2"
                >
                  Staff Passcode
                </label>
                <input
                  id="admin-passcode"
                  type="password"
                  autoFocus
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    setPasscodeError(false);
                  }}
                  placeholder="Enter 4-digit passcode"
                  className={`w-full px-5 py-3.5 rounded-xl bg-[#F7F1E5]/5 border text-[#F7F1E5] placeholder-[#F7F1E5]/25 text-sm tracking-[0.25em] text-center font-mono focus:outline-none transition-colors ${
                    passcodeError
                      ? "border-red-500/60 bg-red-500/5"
                      : "border-[#F7F1E5]/15 focus:border-[#D9A441]"
                  }`}
                />
                <AnimatePresence>
                  {passcodeError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-xs text-center mt-2 font-mono"
                    >
                      Invalid passcode. Try again.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#B06A2C] text-[#0F0D0A] text-sm font-bold tracking-wide hover:shadow-lg hover:shadow-[#D9A441]/20 transition-all duration-300 active:scale-[0.98]"
              >
                Unlock Dashboard
              </button>
            </form>

            <p className="text-center text-[#F7F1E5]/20 text-[10px] font-mono mt-6 tracking-wide">
              AUTHORIZED PERSONNEL ONLY
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN ADMIN DASHBOARD
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0F0D0A] text-[#F7F1E5] selection:bg-[#D9A441] selection:text-[#0F0D0A]">
      {/* ── TOP BAR ── */}
      <header className="sticky top-0 z-50 bg-[#0F0D0A]/90 backdrop-blur-xl border-b border-[#F7F1E5]/8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D9A441] to-[#B06A2C] flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-[#0F0D0A]" />
            </div>
            <div>
              <h1 className="text-sm font-serif font-bold text-[#F7F1E5] leading-tight">
                Mika & Co.
              </h1>
              <p className="text-[9px] font-mono text-[#F7F1E5]/35 uppercase tracking-widest">
                Bakery Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              REAL-TIME SYNC
            </div>

            {/* Sound Chime Toggle Button */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playOrderChime();
              }}
              className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                soundEnabled
                  ? "bg-[#D9A441]/10 text-[#D9A441] border-[#D9A441]/30"
                  : "bg-white/5 text-white/40 border-white/10"
              }`}
              title={soundEnabled ? "Order Sound Alert Active" : "Sound Muted"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{soundEnabled ? "Sound ON" : "Muted"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-mono text-[#F7F1E5]/50 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/5"
              aria-label="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── REAL-TIME NEW ORDER GLOWING ALERT BANNER ── */}
      <AnimatePresence>
        {newOrderAlert && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-amber-500/20 via-[#D9A441]/30 to-amber-500/20 border-b border-[#D9A441]/50 backdrop-blur-xl py-3 px-4"
          >
            <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D9A441] text-[#0F0D0A] flex items-center justify-center animate-bounce shadow-[0_0_15px_#D9A441]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F7F1E5] flex items-center gap-2 font-mono">
                    <span>🔔 NEW RESERVATION RECEIVED!</span>
                    <span className="text-[#D9A441]">#{newOrderAlert.orderId}</span>
                  </h4>
                  <p className="text-[11px] text-[#F7F1E5]/80 font-mono">
                    Customer: <strong>{newOrderAlert.customer.name}</strong> ({newOrderAlert.customer.phone}) — Pickup: {newOrderAlert.customer.pickupTime}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedOrder(newOrderAlert);
                  setNewOrderAlert(null);
                }}
                className="px-4 py-1.5 rounded-full bg-[#D9A441] text-[#0F0D0A] text-xs font-mono font-bold hover:bg-white transition-all shrink-0"
              >
                View Order
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── KPI CARDS ── */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              label: "Today's Revenue",
              value: `$${kpis.todayRevenue}`,
              icon: <DollarSign className="w-5 h-5" />,
              accent: "from-emerald-500/20 to-emerald-500/5",
              iconBg: "bg-emerald-500/15 text-emerald-400",
            },
            {
              label: "Today's Orders",
              value: kpis.todayOrderCount.toString(),
              icon: <ShoppingBag className="w-5 h-5" />,
              accent: "from-sky-500/20 to-sky-500/5",
              iconBg: "bg-sky-500/15 text-sky-400",
            },
            {
              label: "Avg Order Value",
              value: `$${kpis.avgOrder}`,
              icon: <TrendingUp className="w-5 h-5" />,
              accent: "from-violet-500/20 to-violet-500/5",
              iconBg: "bg-violet-500/15 text-violet-400",
            },
            {
              label: "Pending Orders",
              value: kpis.pendingCount.toString(),
              icon: <Users className="w-5 h-5" />,
              accent: "from-amber-500/20 to-amber-500/5",
              iconBg: "bg-amber-500/15 text-amber-400",
            },
          ].map((kpi) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl bg-gradient-to-br ${kpi.accent} border border-[#F7F1E5]/6 p-4 md:p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono text-[#F7F1E5]/45 uppercase tracking-wider">
                  {kpi.label}
                </p>
                <div className={`w-8 h-8 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
                  {kpi.icon}
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-serif font-bold text-[#F7F1E5]">
                {kpi.value}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TAB NAVIGATION ── */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex gap-1 overflow-x-auto scrollbar-none border-b border-[#F7F1E5]/8 pb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono tracking-wide whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-[#D9A441] text-[#D9A441]"
                  : "border-transparent text-[#F7F1E5]/40 hover:text-[#F7F1E5]/70"
              }`}
              aria-label={`${tab.label} tab`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 pb-20">
        <AnimatePresence mode="wait">
          {/* ═══════ ORDERS TAB ═══════ */}
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Controls Bar */}
              <div className="flex flex-col md:flex-row gap-3 mb-5">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#F7F1E5]/30 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, name, or phone..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F1E5]/5 border border-[#F7F1E5]/10 text-[#F7F1E5] placeholder-[#F7F1E5]/25 text-xs font-mono focus:outline-none focus:border-[#D9A441]/50 transition-colors"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                  {(["All", ...STATUS_PIPELINE] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-2 rounded-lg text-[10px] font-mono tracking-wide whitespace-nowrap transition-all border ${
                        statusFilter === s
                          ? "bg-[#D9A441]/15 border-[#D9A441]/40 text-[#D9A441]"
                          : "bg-[#F7F1E5]/3 border-[#F7F1E5]/8 text-[#F7F1E5]/40 hover:text-[#F7F1E5]/60"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* CSV Export */}
                <button
                  onClick={() => exportOrdersCsv(orders)}
                  disabled={orders.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7F1E5]/5 border border-[#F7F1E5]/10 text-xs font-mono text-[#F7F1E5]/50 hover:text-[#D9A441] hover:border-[#D9A441]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>

              {/* Orders Table */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="w-12 h-12 mx-auto text-[#F7F1E5]/10 mb-3" />
                  <p className="text-[#F7F1E5]/30 text-sm font-mono">
                    {orders.length === 0
                      ? "No orders yet. Waiting for customers..."
                      : "No orders match your filters."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredOrders.map((order) => {
                    const cfg = STATUS_CONFIG[order.status];
                    const nextStatus = getNextStatus(order.status);
                    return (
                      <motion.div
                        layout
                        key={order.orderId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`rounded-2xl bg-[#1A1612]/60 border ${cfg.border} p-4 md:p-5 group hover:bg-[#1A1612]/80 transition-colors`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
                          {/* Order ID + Customer */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-mono font-bold text-[#D9A441]">
                                #{order.orderId}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${cfg.bg} ${cfg.color} ${cfg.border} border`}
                              >
                                {cfg.icon}
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-[#F7F1E5]/70 truncate">
                              <span className="font-semibold text-[#F7F1E5]/90">
                                {order.customer.name}
                              </span>
                              {" · "}
                              {order.customer.phone}
                              {" · "}
                              <span className="text-[#D9A441]/70">
                                Pickup: {order.customer.pickupTime}
                              </span>
                            </p>
                            <p className="text-[10px] font-mono text-[#F7F1E5]/30 mt-0.5">
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""} · ৳
                              {order.subtotal} · {order.createdAt}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* View detail */}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2.5 rounded-xl bg-[#F7F1E5]/5 border border-[#F7F1E5]/8 text-[#F7F1E5]/40 hover:text-[#D9A441] hover:border-[#D9A441]/30 transition-colors"
                              aria-label={`View order ${order.orderId}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Advance status */}
                            {nextStatus && (
                              <button
                                onClick={() => {
                                  updateOrderStatus(order.orderId, nextStatus);
                                  updateDatabaseOrderStatus(order.orderId, nextStatus);
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D9A441]/10 border border-[#D9A441]/25 text-[10px] font-mono text-[#D9A441] hover:bg-[#D9A441]/20 transition-colors whitespace-nowrap"
                                aria-label={`Move to ${nextStatus}`}
                              >
                                <ArrowRight className="w-3 h-3" />
                                {nextStatus}
                              </button>
                            )}

                            {/* Delete */}
                            {deleteConfirm === order.orderId ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    deleteOrder(order.orderId);
                                    setDeleteConfirm(null);
                                  }}
                                  className="px-2.5 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-[10px] font-mono text-red-400 hover:bg-red-500/25 transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-2 py-2 rounded-lg text-[10px] font-mono text-[#F7F1E5]/30 hover:text-[#F7F1E5]/60"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  setDeleteConfirm(order.orderId)
                                }
                                className="p-2.5 rounded-xl bg-[#F7F1E5]/3 border border-[#F7F1E5]/6 text-[#F7F1E5]/20 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-colors"
                                aria-label={`Delete order ${order.orderId}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════ INVENTORY TAB ═══════ */}
          {activeTab === "inventory" && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {ALL_PRODUCTS.map((product) => {
                  const inStock = productStock[product.id] !== false;
                  return (
                    <div
                      key={product.id}
                      className={`rounded-2xl border p-4 transition-all ${
                        inStock
                          ? "bg-[#1A1612]/60 border-[#F7F1E5]/8 hover:border-[#D9A441]/20"
                          : "bg-red-950/20 border-red-500/15 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-mono text-[#B06A2C] uppercase tracking-widest mb-0.5">
                            {product.category}
                          </p>
                          <h3 className="text-sm font-serif font-bold text-[#F7F1E5] truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs font-mono text-[#D9A441] mt-1">
                            {product.price}
                          </p>
                        </div>

                        {/* Stock Toggle */}
                        <button
                          onClick={() => {
                            toggleProductStock(product.id);
                            toggleDatabaseProductStock(product.id);
                          }}
                          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono border transition-all ${
                            inStock
                              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                              : "bg-red-500/10 border-red-500/25 text-red-400"
                          }`}
                          aria-label={`Toggle stock for ${product.name}`}
                        >
                          {inStock ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                          {inStock ? "In Stock" : "Sold Out"}
                        </button>
                      </div>

                      <p className="text-[11px] text-[#F7F1E5]/35 mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#F7F1E5]/5 text-[10px] font-mono text-[#F7F1E5]/30">
                        <span>{product.prepTime}</span>
                        <span>·</span>
                        <span>{product.calories}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ═══════ OVEN SCHEDULE TAB ═══════ */}
          {activeTab === "oven" && (
            <motion.div
              key="oven"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-3">
                {ovenBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className={`rounded-2xl border p-5 md:p-6 transition-all ${
                      batch.active
                        ? "bg-[#1A1612]/60 border-orange-500/20"
                        : "bg-[#1A1612]/30 border-[#F7F1E5]/6 opacity-50"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            batch.active
                              ? "bg-orange-500/15 text-orange-400"
                              : "bg-[#F7F1E5]/5 text-[#F7F1E5]/20"
                          }`}
                        >
                          <Flame className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-serif font-bold text-[#F7F1E5]">
                            {batch.label}
                          </h3>
                          <p className="text-xs font-mono text-[#D9A441] mt-0.5">
                            {batch.time}
                          </p>
                          <p className="text-[11px] text-[#F7F1E5]/35 mt-1">
                            {batch.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setOvenBatches((prev) =>
                            prev.map((b) =>
                              b.id === batch.id
                                ? { ...b, active: !b.active }
                                : b
                            )
                          )
                        }
                        className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono border transition-all ${
                          batch.active
                            ? "bg-orange-500/10 border-orange-500/25 text-orange-400 hover:bg-orange-500/20"
                            : "bg-[#F7F1E5]/3 border-[#F7F1E5]/8 text-[#F7F1E5]/30 hover:text-[#F7F1E5]/50"
                        }`}
                        aria-label={`Toggle ${batch.label}`}
                      >
                        {batch.active ? (
                          <>
                            <Flame className="w-3.5 h-3.5" />
                            Active
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            Inactive
                          </>
                        )}
                      </button>
                    </div>

                    {/* Orders for this pickup window */}
                    {batch.active && (
                      <div className="mt-4 pt-4 border-t border-[#F7F1E5]/5">
                        <p className="text-[10px] font-mono text-[#F7F1E5]/25 uppercase tracking-widest mb-2">
                          Reservations for this batch
                        </p>
                        {(() => {
                          const batchOrders = orders.filter(
                            (o) =>
                              o.customer.pickupTime === batch.time &&
                              o.status !== "Completed"
                          );
                          if (batchOrders.length === 0) {
                            return (
                              <p className="text-[11px] font-mono text-[#F7F1E5]/15">
                                No pending reservations
                              </p>
                            );
                          }
                          return (
                            <div className="space-y-1.5">
                              {batchOrders.map((o) => (
                                <div
                                  key={o.orderId}
                                  className="flex items-center justify-between text-[11px] font-mono"
                                >
                                  <span className="text-[#D9A441]">
                                    #{o.orderId}
                                  </span>
                                  <span className="text-[#F7F1E5]/50 truncate mx-2">
                                    {o.customer.name}
                                  </span>
                                  <span
                                    className={`${STATUS_CONFIG[o.status].color}`}
                                  >
                                    {o.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════ ANALYTICS TAB ═══════ */}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {orders.length === 0 ? (
                <div className="text-center py-20">
                  <BarChart3 className="w-12 h-12 mx-auto text-[#F7F1E5]/10 mb-3" />
                  <p className="text-[#F7F1E5]/30 text-sm font-mono">
                    No data yet. Analytics will populate as orders come in.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-[#1A1612]/60 border border-[#F7F1E5]/6 p-5">
                      <p className="text-[10px] font-mono text-[#F7F1E5]/35 uppercase tracking-widest mb-2">
                        All-Time Revenue
                      </p>
                      <p className="text-3xl font-serif font-bold text-emerald-400">
                        $
                        {orders
                          .reduce((s, o) => s + parseFloat(o.subtotal), 0)
                          .toFixed(2)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#1A1612]/60 border border-[#F7F1E5]/6 p-5">
                      <p className="text-[10px] font-mono text-[#F7F1E5]/35 uppercase tracking-widest mb-2">
                        Total Orders
                      </p>
                      <p className="text-3xl font-serif font-bold text-sky-400">
                        {orders.length}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#1A1612]/60 border border-[#F7F1E5]/6 p-5">
                      <p className="text-[10px] font-mono text-[#F7F1E5]/35 uppercase tracking-widest mb-2">
                        Total Items Sold
                      </p>
                      <p className="text-3xl font-serif font-bold text-violet-400">
                        {orders.reduce(
                          (s, o) =>
                            s + o.items.reduce((x, i) => x + i.quantity, 0),
                          0
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Category Revenue Breakdown */}
                  <div className="rounded-2xl bg-[#1A1612]/60 border border-[#F7F1E5]/6 p-5 md:p-6">
                    <h3 className="text-sm font-serif font-bold text-[#F7F1E5] mb-4">
                      Revenue by Category
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(analyticsData.categoryMap).map(
                        ([category, data]) => {
                          const pct =
                            (data.revenue / analyticsData.maxRevenue) * 100;
                          const colors: Record<string, string> = {
                            Viennoiserie: "bg-amber-400",
                            "Artisanal Bread": "bg-orange-400",
                            Patisserie: "bg-pink-400",
                            Specialty: "bg-emerald-400",
                          };
                          return (
                            <div key={category}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-mono text-[#F7F1E5]/60">
                                  {category}
                                </span>
                                <span className="text-xs font-mono text-[#D9A441]">
                                  ${data.revenue.toFixed(2)} · {data.count}{" "}
                                  sold
                                </span>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-[#F7F1E5]/5 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{
                                    duration: 0.8,
                                    ease: [0.22, 1, 0.36, 1],
                                  }}
                                  className={`h-full rounded-full ${colors[category] || "bg-[#D9A441]"}`}
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Order Status Distribution */}
                  <div className="rounded-2xl bg-[#1A1612]/60 border border-[#F7F1E5]/6 p-5 md:p-6">
                    <h3 className="text-sm font-serif font-bold text-[#F7F1E5] mb-4">
                      Order Status Distribution
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {STATUS_PIPELINE.map((status) => {
                        const count = orders.filter(
                          (o) => o.status === status
                        ).length;
                        const cfg = STATUS_CONFIG[status];
                        return (
                          <div
                            key={status}
                            className={`rounded-xl ${cfg.bg} border ${cfg.border} p-4 text-center`}
                          >
                            <div
                              className={`${cfg.color} flex items-center justify-center gap-1 mb-1`}
                            >
                              {cfg.icon}
                            </div>
                            <p
                              className={`text-2xl font-serif font-bold ${cfg.color}`}
                            >
                              {count}
                            </p>
                            <p className="text-[10px] font-mono text-[#F7F1E5]/30 mt-0.5">
                              {status}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── ORDER DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedOrder && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Order ${selectedOrder.orderId} details`}
            className="fixed inset-0 z-[10000] bg-[#0F0D0A]/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-lg rounded-3xl bg-[#1A1612] border border-[#F7F1E5]/10 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#F7F1E5]">
                    Order #{selectedOrder.orderId}
                  </h2>
                  <p className="text-[10px] font-mono text-[#F7F1E5]/30 mt-0.5">
                    Placed at {selectedOrder.createdAt}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-full text-[#F7F1E5]/30 hover:text-[#F7F1E5]/60 transition-colors"
                  aria-label="Close order details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badge */}
              {(() => {
                const cfg = STATUS_CONFIG[selectedOrder.status];
                return (
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono ${cfg.bg} ${cfg.color} ${cfg.border} border mb-5`}
                  >
                    {cfg.icon}
                    {selectedOrder.status}
                  </div>
                );
              })()}

              {/* Customer Details */}
              <div className="rounded-2xl bg-[#F7F1E5]/3 border border-[#F7F1E5]/8 p-4 mb-5 space-y-2.5">
                <h3 className="text-[10px] font-mono text-[#D9A441] uppercase tracking-widest mb-2">
                  Customer Details
                </h3>
                {[
                  { label: "Name", value: selectedOrder.customer.name },
                  { label: "Phone", value: selectedOrder.customer.phone },
                  { label: "Email", value: selectedOrder.customer.email || "—" },
                  {
                    label: "Pickup",
                    value: selectedOrder.customer.pickupTime,
                  },
                  {
                    label: "Notes",
                    value: selectedOrder.customer.notes || "—",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between text-xs font-mono"
                  >
                    <span className="text-[#F7F1E5]/40">{row.label}</span>
                    <span className="text-[#F7F1E5]/80 text-right max-w-[60%] truncate">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div className="space-y-2 mb-5">
                <h3 className="text-[10px] font-mono text-[#D9A441] uppercase tracking-widest">
                  Items
                </h3>
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-[#F7F1E5]/3 border border-[#F7F1E5]/6 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-serif font-bold text-[#F7F1E5] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] font-mono text-[#F7F1E5]/30">
                        {item.product.category} · {item.product.calories}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-xs font-mono text-[#D9A441]">
                        {item.quantity}x {item.product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between pt-4 border-t border-[#F7F1E5]/8">
                <span className="text-xs font-mono text-[#F7F1E5]/40">
                  Order Total
                </span>
                <span className="text-xl font-serif font-bold text-[#D9A441]">
                  ${selectedOrder.subtotal}
                </span>
              </div>

              {/* Actions */}
              {getNextStatus(selectedOrder.status) && (
                <button
                  onClick={() => {
                    const next = getNextStatus(selectedOrder.status);
                    if (next) {
                      updateOrderStatus(selectedOrder.orderId, next);
                      setSelectedOrder({
                        ...selectedOrder,
                        status: next,
                      });
                    }
                  }}
                  className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#B06A2C] text-[#0F0D0A] text-sm font-bold tracking-wide hover:shadow-lg hover:shadow-[#D9A441]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Move to {getNextStatus(selectedOrder.status)}
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
