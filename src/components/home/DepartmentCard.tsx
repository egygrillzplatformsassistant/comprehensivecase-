"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Tag } from "lucide-react";
import { useState } from "react";
import type { Bundle, Department } from "@/db/schema";
import { cn, formatPrice, splitLines } from "@/lib/format";
import { useSite } from "./SiteContext";
import { deptIcon } from "./dept-icons";

/**
 * One compact card per department — the 3 pricing options live
 * inside it as selectable rows instead of separate boxes.
 */
export function DepartmentCard({
  dept,
}: {
  dept: Department & { bundles: Bundle[] };
}) {
  const { lang, t, items, toggle } = useSite();
  const [expanded, setExpanded] = useState<number | null>(null);

  const Icon = deptIcon(dept.icon);
  const name = lang === "ar" ? dept.nameAr : dept.nameEn;
  const minPrice = Math.min(...dept.bundles.map((b) => b.price));

  return (
    <div className="glass flex h-full flex-col rounded-3xl p-4 shadow-lg shadow-teal-900/5 ring-1 ring-white/70 transition-shadow duration-300 hover:shadow-xl sm:p-5">
      {/* header */}
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-600/30">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
            {name}
          </h3>
          <p className="text-[11px] font-bold text-teal-700">
            {t("departments.from")} {formatPrice(minPrice, lang)}
          </p>
        </div>
      </div>

      {/* option rows */}
      <div className="flex flex-1 flex-col gap-2">
        {dept.bundles.map((b) => {
          const key = `bundle:${b.id}`;
          const selected = items.has(key);
          const badge = lang === "ar" ? b.badgeAr : b.badgeEn;
          const features = splitLines(lang === "ar" ? b.featuresAr : b.featuresEn);
          const isOpen = expanded === b.id;

          return (
            <div
              key={b.id}
              className={cn(
                "rounded-2xl ring-1 transition-all duration-300",
                selected
                  ? "bg-teal-600/[0.08] ring-2 ring-teal-500/70"
                  : "bg-white/60 ring-slate-900/10 hover:ring-teal-600/40",
              )}
            >
              <button
                onClick={() =>
                  toggle({
                    key,
                    nameEn: b.nameEn,
                    nameAr: b.nameAr,
                    price: b.price,
                    deptEn: dept.nameEn,
                    deptAr: dept.nameAr,
                  })
                }
                className="flex w-full items-center gap-3 px-3.5 py-3 text-start"
              >
                {/* select circle */}
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-2 transition-all duration-300",
                    selected
                      ? "bg-gradient-to-br from-teal-500 to-cyan-500 ring-teal-500"
                      : "bg-white ring-slate-300",
                  )}
                >
                  {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={4} />}
                </span>

                {/* name + badge */}
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-sm font-extrabold transition-colors",
                      selected ? "text-teal-900" : "text-slate-800",
                    )}
                  >
                    {lang === "ar" ? b.nameAr : b.nameEn}
                  </span>
                  {badge && (
                    <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-700 ring-1 ring-amber-400/40">
                      <Tag className="h-2.5 w-2.5" />
                      {badge}
                    </span>
                  )}
                </span>

                {/* prices + expand */}
                <span className="flex shrink-0 items-center gap-2">
                  <span className="text-end leading-tight">
                    {b.oldPrice && b.oldPrice > b.price && (
                      <span className="block text-[11px] font-bold text-slate-300 line-through">
                        {b.oldPrice}
                      </span>
                    )}
                    <span
                      className={cn(
                        "block text-base font-extrabold",
                        selected ? "text-teal-700" : "text-slate-900",
                      )}
                    >
                      {formatPrice(b.price, lang)}
                    </span>
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(isOpen ? null : b.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        setExpanded(isOpen ? null : b.id);
                      }
                    }}
                    className="rounded-full bg-slate-900/5 p-1.5 text-slate-400 transition hover:bg-slate-900/10 hover:text-slate-600"
                    aria-label="Toggle details"
                  >
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 transition-transform duration-300", isOpen && "rotate-180")}
                    />
                  </span>
                </span>
              </button>

              {/* expandable features */}
              <AnimatePresence initial={false}>
                {isOpen && features.length > 0 && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden px-4 pb-1"
                  >
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 pb-2 text-xs font-medium text-slate-500">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-teal-600" strokeWidth={3.5} />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[10px] font-bold text-slate-400">
        {t("departments.tapHint")}
      </p>
    </div>
  );
}
