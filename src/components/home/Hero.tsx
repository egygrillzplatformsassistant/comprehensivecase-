"use client";

import { motion } from "framer-motion";
import { ArrowDown, BadgeCheck, Check, Sparkles } from "lucide-react";
import { useSite } from "./SiteContext";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useSite();

  const chips = [t("hero.chip1"), t("hero.chip2"), t("hero.chip3")].filter(Boolean);
  const stats = [
    { n: t("hero.stat1num"), l: t("hero.stat1") },
    { n: t("hero.stat2num"), l: t("hero.stat2") },
    { n: t("hero.stat3num"), l: t("hero.stat3") },
  ];

  return (
    <section id="top" className="relative overflow-hidden pb-10 pt-32 sm:pt-40">
      {/* floating price pills (desktop decoration) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <span
          className="glass floaty absolute start-[6%] top-[24%] rounded-2xl px-5 py-3 text-lg font-extrabold text-teal-700 shadow-xl shadow-teal-900/10 ring-1 ring-white/70"
          style={{ ["--rot" as string]: "-8deg" }}
        >
          {t("hero.chip1")}
        </span>
        <span
          className="glass floaty absolute end-[7%] top-[30%] rounded-2xl px-5 py-3 text-lg font-extrabold text-cyan-700 shadow-xl shadow-cyan-900/10 ring-1 ring-white/70 [animation-delay:1.4s]"
          style={{ ["--rot" as string]: "6deg" }}
        >
          {t("hero.chip2")}
        </span>
        <span
          className="glass floaty absolute bottom-[26%] end-[13%] rounded-2xl px-5 py-3 text-lg font-extrabold text-teal-800 shadow-xl shadow-teal-900/10 ring-1 ring-white/70 [animation-delay:2.6s]"
          style={{ ["--rot" as string]: "-4deg" }}
        >
          {t("hero.chip3")}
        </span>
      </div>

      <div className="mx-auto max-w-5xl px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-teal-800 shadow-lg shadow-teal-900/5 ring-1 ring-teal-600/20 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t("hero.badge")}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="mb-3 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400"
        >
          {t("hero.kicker")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-6xl md:text-7xl"
        >
          {t("hero.title1")}
          <br />
          <span className="text-grad">{t("hero.title2")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
          className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-slate-600 sm:text-lg"
        >
          {t("hero.sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: EASE }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#offer"
            className="shine group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-teal-600/35 transition-transform duration-300 hover:-translate-y-1 active:scale-95"
          >
            {t("hero.ctaPrimary")}
            <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-8 py-4 text-sm font-extrabold text-slate-700 ring-1 ring-slate-900/10 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:ring-teal-600/30"
          >
            {t("hero.ctaSecondary")}
          </a>
        </motion.div>

        {/* chips — mobile friendly */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 lg:hidden"
        >
          {chips.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-bold text-teal-800 ring-1 ring-teal-600/15 backdrop-blur"
            >
              <BadgeCheck className="h-3.5 w-3.5 text-teal-600" />
              {c}
            </span>
          ))}
        </motion.div>

        {/* stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.48, ease: EASE }}
          className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-slate-900/10 pt-8"
        >
          {stats.map((s, i) => (
            <div key={i}>
              <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {i === stats.length - 1 ? (
                  <span className="inline-flex items-center gap-1.5">
                    {s.n}
                    <Check className="h-5 w-5 text-teal-500" strokeWidth={3.5} />
                  </span>
                ) : (
                  s.n
                )}
              </p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {s.l}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
