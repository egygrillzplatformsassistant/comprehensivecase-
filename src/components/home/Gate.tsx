"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Languages, MoveLeft, MoveRight, Sparkles } from "lucide-react";
import { useSite } from "./SiteContext";
import { ToothLogo } from "./ToothLogo";

export function LanguageGate() {
  const { chosen, choose, t } = useSite();

  return (
    <AnimatePresence>
      {!chosen && (
        <motion.div
          key="gate"
          className="fixed inset-0 z-[80] flex items-center justify-center p-5"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(14px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* heavy blur wash over the site bg */}
          <div className="absolute inset-0 bg-white/55 backdrop-blur-[10px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-teal-50/60 via-transparent to-cyan-100/50" />

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong relative w-full max-w-lg rounded-[2.2rem] p-8 text-center shadow-2xl shadow-teal-900/20 ring-1 ring-white/70 sm:p-12"
          >
            <div className="mx-auto mb-5 flex justify-center">
              <ToothLogo size={64} className="pop-ring" />
            </div>

            <p className="mb-2 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-teal-700">
              <Sparkles className="h-3.5 w-3.5" />
              {t("gate.tagline") || "Ain Shams Dentistry"}
            </p>

            <h1 className="mb-2 text-2xl font-extrabold leading-snug text-slate-900 sm:text-3xl">
              {t("gate.title") || "One link. Every case. Done."}
            </h1>

            <p className="mb-8 flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
              <Languages className="h-4 w-4" />
              {t("gate.choose") || "Choose your language"}
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => choose("en")}
                className="group shine flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 px-6 py-5 text-start text-white shadow-xl shadow-teal-600/30 transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98]"
              >
                <span>
                  <span className="block text-lg font-extrabold">English</span>
                  <span className="block text-xs font-medium text-teal-100">
                    Continue in English
                  </span>
                </span>
                <span className="rounded-full bg-white/20 p-2 transition-transform duration-300 group-hover:translate-x-1">
                  <MoveRight className="h-4 w-4" />
                </span>
              </button>

              <button
                onClick={() => choose("ar")}
                className="group shine flex items-center justify-between gap-3 rounded-2xl bg-slate-900 px-6 py-5 text-start text-white shadow-xl shadow-slate-900/25 transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98]"
                dir="rtl"
              >
                <span>
                  <span className="block text-lg font-extrabold">العربية</span>
                  <span className="block text-xs font-medium text-slate-300">
                    كمّل بالعربي
                  </span>
                </span>
                <span className="rounded-full bg-white/15 p-2 transition-transform duration-300 group-hover:-translate-x-1">
                  <MoveLeft className="h-4 w-4" />
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
