"use client";

import { BadgePercent, Check, CheckCircle2, Sparkles } from "lucide-react";
import type { FeaturedOfferRow } from "@/db/schema";
import { cn, formatPrice, splitLines } from "@/lib/format";
import { useSite } from "./SiteContext";
import { Reveal } from "./Reveal";

export function FeaturedOffer({ offer }: { offer: FeaturedOfferRow | null }) {
  const { lang, t, items, toggle } = useSite();
  if (!offer) return null;

  const key = "featured";
  const selected = items.has(key);

  const title = lang === "ar" ? offer.titleAr : offer.titleEn;
  const desc = lang === "ar" ? offer.descAr : offer.descEn;
  const badge = lang === "ar" ? offer.badgeAr : offer.badgeEn;
  const footnote = lang === "ar" ? offer.footnoteAr : offer.footnoteEn;
  const includes = splitLines(lang === "ar" ? offer.includesAr : offer.includesEn);
  const saving = offer.oldPrice ? offer.oldPrice - offer.price : 0;

  return (
    <section id="offer" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-6 pt-10 sm:pt-14">
      <Reveal>
        <div className="shine relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 shadow-2xl shadow-teal-900/30 ring-1 ring-white/20">
          {/* decorative circles */}
          <div className="pointer-events-none absolute -end-20 -top-24 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -start-16 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            {/* text column */}
            <div className="text-white">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-teal-200">
                  {t("featured.sectionLabel")}
                </span>
                {badge && (
                  <span className="pop-ring inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-teal-700 shadow-lg">
                    <BadgePercent className="h-3.5 w-3.5" />
                    {badge}
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
                {title}
              </h2>
              <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-teal-50/90 sm:text-base">
                {desc}
              </p>

              {includes.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] text-teal-200">
                    {t("featured.includes")}
                  </p>
                  <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {includes.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-semibold text-white">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lime-300" />
                        <span className="leading-snug">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {footnote && (
                <p className="mt-6 flex items-center gap-2 text-xs font-bold text-lime-200">
                  <Sparkles className="h-4 w-4" />
                  {footnote}
                </p>
              )}
            </div>

            {/* visual + price column */}
            <div className="relative">
              <div className="relative h-44 overflow-hidden rounded-3xl ring-1 ring-white/30 sm:h-56 lg:absolute lg:inset-x-0 lg:top-0 lg:h-[52%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/offer-smile.jpg"
                  alt="Case photography sample"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 to-transparent" />
              </div>

              <div className="mt-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0">
                <div className="glass-strong rounded-3xl p-5 shadow-2xl ring-1 ring-white/80 sm:p-6">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      {offer.oldPrice && offer.oldPrice > offer.price && (
                        <p className="text-sm font-bold text-slate-400 line-through decoration-red-400/70 decoration-2">
                          {formatPrice(offer.oldPrice, lang)}
                        </p>
                      )}
                      <p className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                        {formatPrice(offer.price, lang)}
                      </p>
                    </div>
                    {saving > 0 && (
                      <span className="rounded-full bg-teal-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-teal-600/40">
                        {t("featured.save")} {saving}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      toggle({
                        key,
                        nameEn: offer.titleEn,
                        nameAr: offer.titleAr,
                        price: offer.price,
                        deptEn: "Special Offer",
                        deptAr: "عرض خاص",
                      })
                    }
                    className={cn(
                      "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold transition-all duration-300 active:scale-[0.97]",
                      selected
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40"
                        : "bg-slate-900 text-white shadow-xl shadow-slate-900/25 hover:-translate-y-0.5",
                    )}
                  >
                    {selected && <Check className="h-4 w-4" strokeWidth={3.5} />}
                    {selected ? t("featured.selected") : t("featured.cta")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
