"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useSite } from "./SiteContext";

export function CartBar() {
  const { count, total, lang, t, cartOpen, setCartOpen } = useSite();

  return (
    <AnimatePresence>
      {count > 0 && !cartOpen && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.94 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-lg"
        >
          <div className="glass-strong flex items-center justify-between gap-3 rounded-full py-2.5 pe-2.5 ps-5 shadow-2xl shadow-teal-900/25 ring-1 ring-white/80">
            <div className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-teal-600/10 text-teal-700">
                <ShoppingBag className="h-4.5 w-4.5" />
                <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-black text-white ring-2 ring-white">
                  {count}
                </span>
              </span>
              <div className="leading-tight">
                <p className="text-[11px] font-bold text-slate-500">
                  {count} {count === 1 ? t("cart.singular") : t("cart.plural")}
                </p>
                <p className="text-base font-extrabold text-slate-900">
                  {t("cart.total")}: {formatPrice(total, lang)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="shine flex items-center gap-2 rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 px-6 py-3 text-sm font-extrabold text-white shadow-xl shadow-teal-600/35 transition-transform duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              {t("cart.cta")}
              {lang === "ar" ? (
                <ArrowLeft className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
