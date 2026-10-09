"use client";

import { Flame } from "lucide-react";
import type { Bundle } from "@/db/schema";
import { useSite } from "./SiteContext";
import { BundleCard } from "./BundleCard";
import { Reveal } from "./Reveal";

export function Highlights({ bundles }: { bundles: Bundle[] }) {
  const { t } = useSite();
  if (bundles.length === 0) return null;

  return (
    <section id="deals" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-12 sm:py-16">
      <Reveal className="mb-9 text-center">
        <p className="mb-2 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">
          <Flame className="h-4 w-4" />
          {t("bundle.save") || "SAVE"}
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {t("highlights.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-slate-500 sm:text-base">
          {t("highlights.sub")}
        </p>
      </Reveal>

      <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
        {bundles.slice(0, 4).map((b, i) => (
          <Reveal key={b.id} delay={(i % 2) * 0.08} className="h-full">
            <BundleCard bundle={b} deptEn="Bundle Deal" deptAr="عرض موفّر" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
