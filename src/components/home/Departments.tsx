"use client";

import { GraduationCap } from "lucide-react";
import type { Bundle, Department } from "@/db/schema";
import { useSite } from "./SiteContext";
import { DepartmentCard } from "./DepartmentCard";
import { Reveal } from "./Reveal";

export function Departments({
  departments,
}: {
  departments: (Department & { bundles: Bundle[] })[];
}) {
  const { t } = useSite();
  const visible = departments.filter((d) => d.bundles.length > 0);

  return (
    <section id="departments" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-12 sm:py-16">
      <Reveal className="mb-10 text-center">
        <p className="mb-2 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-teal-600">
          <GraduationCap className="h-4 w-4" />
          ASU DENTISTRY
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {t("departments.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-slate-500 sm:text-base">
          {t("departments.sub")}
        </p>
      </Reveal>

      <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
        {visible.map((dept, i) => (
          <Reveal key={dept.id} delay={(i % 2) * 0.08} className="h-full">
            <DepartmentCard dept={dept} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
