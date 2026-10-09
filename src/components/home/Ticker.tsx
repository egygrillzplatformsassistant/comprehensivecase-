"use client";

import { BadgePercent } from "lucide-react";
import { useSite } from "./SiteContext";

export function Ticker() {
  const { t } = useSite();
  const items = [1, 2, 3, 4, 5, 6]
    .map((i) => t(`ticker.${i}`))
    .filter(Boolean);

  if (items.length === 0) return null;
  const row = [...items, ...items, ...items];

  return (
    <div className="marquee-mask relative overflow-hidden border-y border-teal-800/10 bg-teal-700/90 py-3 shadow-lg shadow-teal-900/10 backdrop-blur">
      <div className="marquee-track flex w-max items-center gap-8 pe-8" dir="ltr">
        {[...row, ...row].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap text-xs font-black uppercase tracking-[0.22em] text-teal-50"
          >
            {item}
            <BadgePercent className="h-4 w-4 text-teal-300" />
          </span>
        ))}
      </div>
    </div>
  );
}
