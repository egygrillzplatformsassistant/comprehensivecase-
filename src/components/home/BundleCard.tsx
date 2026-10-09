"use client";

import { motion } from "framer-motion";
import { Check, Plus, Tag } from "lucide-react";
import type { Bundle } from "@/db/schema";
import { cn, formatPrice, splitLines } from "@/lib/format";
import { useSite } from "./SiteContext";

export function BundleCard({
  bundle,
  deptEn,
  deptAr,
}: {
  bundle: Bundle;
  deptEn?: string;
  deptAr?: string;
}) {
  const { lang, t, items, toggle } = useSite();
  const key = `bundle:${bundle.id}`;
  const selected = items.has(key);

  const name = lang === "ar" ? bundle.nameAr : bundle.nameEn;
  const desc = lang === "ar" ? bundle.descAr : bundle.descEn;
  const badge = lang === "ar" ? bundle.badgeAr : bundle.badgeEn;
  const features = splitLines(lang === "ar" ? bundle.featuresAr : bundle.featuresEn);
  const saving = bundle.oldPrice ? bundle.oldPrice - bundle.price : 0;

  return (
    <motion.div
      layout
      className={cn(
        "group relative flex h-full flex-col rounded-3xl p-5 transition-all duration-300 sm:p-6",
        selected
          ? "bg-white shadow-2xl shadow-teal-600/20 ring-2 ring-teal-500"
          : "glass shadow-lg shadow-teal-900/5 ring-1 ring-white/70 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-teal-900/10",
      )}
    >
      {badge && (
        <span className="absolute -top-3 start-5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-900 shadow-lg shadow-amber-500/30">
          <Tag className="h-3 w-3" />
          {badge}
        </span>
      )}

      <div className="mb-1 pt-2">
        <h3 className="text-lg font-extrabold leading-snug text-slate-900">
          {name}
        </h3>
        {desc && <p className="mt-0.5 text-xs font-semibold text-slate-400">{desc}</p>}
      </div>

      <div className="my-4 flex items-end gap-2.5">
        {bundle.oldPrice && bundle.oldPrice > bundle.price && (
          <span className="pb-1 text-sm font-bold text-slate-400 line-through decoration-red-400/70 decoration-2">
            {formatPrice(bundle.oldPrice, lang)}
          </span>
        )}
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">
          {formatPrice(bundle.price, lang)}
        </span>
        {saving > 0 && (
          <span className="mb-1 rounded-full bg-teal-600/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-teal-700 ring-1 ring-teal-600/20">
            {t("bundle.save")} {saving}
          </span>
        )}
      </div>

      {features.length > 0 && (
        <ul className="mb-5 flex-1 space-y-2">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-medium text-slate-600">
              <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-teal-600/10">
                <Check className="h-3 w-3 text-teal-600" strokeWidth={3.5} />
              </span>
              <span className="leading-snug">{f}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() =>
          toggle({ key, nameEn: bundle.nameEn, nameAr: bundle.nameAr, price: bundle.price, deptEn, deptAr })
        }
        className={cn(
          "mt-auto flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold transition-all duration-300 active:scale-[0.97]",
          selected
            ? "bg-gradient-to-br from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-600/35"
            : "bg-teal-600/8 text-teal-800 ring-1 ring-teal-600/25 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:shadow-teal-600/30",
        )}
      >
        {selected ? (
          <>
            <Check className="h-4 w-4" strokeWidth={3.5} />
            {t("bundle.selected")}
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" strokeWidth={3} />
            {t("bundle.select")}
          </>
        )}
      </button>
    </motion.div>
  );
}
