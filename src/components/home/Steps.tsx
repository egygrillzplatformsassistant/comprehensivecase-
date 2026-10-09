"use client";

import { MousePointerClick, PenLine, MessageCircle } from "lucide-react";
import { useSite } from "./SiteContext";
import { Reveal } from "./Reveal";

export function Steps() {
  const { t } = useSite();
  const steps = [
    { icon: MousePointerClick, title: t("steps.1t"), desc: t("steps.1d") },
    { icon: PenLine, title: t("steps.2t"), desc: t("steps.2d") },
    { icon: MessageCircle, title: t("steps.3t"), desc: t("steps.3d") },
  ];

  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <Reveal className="mb-10 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {t("steps.title")}
        </h2>
      </Reveal>

      <div className="relative grid gap-4 sm:grid-cols-3 sm:gap-6">
        {/* connecting line */}
        <div className="pointer-events-none absolute inset-x-10 top-10 hidden border-t-2 border-dashed border-teal-600/25 sm:block" />
        {steps.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="glass relative h-full rounded-3xl p-6 text-center shadow-lg shadow-teal-900/5 ring-1 ring-white/70 transition-transform duration-300 hover:-translate-y-1">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-600/30">
                <s.icon className="h-6 w-6" />
              </div>
              <p className="mb-1 text-[11px] font-black text-teal-600">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mb-1.5 text-lg font-extrabold text-slate-900">
                {s.title}
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-500">
                {s.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
