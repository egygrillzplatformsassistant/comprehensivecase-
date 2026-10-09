"use client";

import { Globe, ShoppingBag } from "lucide-react";
import { useSite } from "./SiteContext";
import { ToothLogo } from "./ToothLogo";
import { cn } from "@/lib/format";

export function Nav() {
  const { lang, choose, t, count, setCartOpen } = useSite();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 shadow-lg shadow-teal-900/5 ring-1 ring-white/70">
        <a href="#top" className="flex min-w-0 items-center gap-2.5">
          <ToothLogo size={38} />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[13px] font-extrabold tracking-wide text-slate-900">
              {t("nav.brandTop") || "ASU DENTISTRY"}
            </span>
            <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-700">
              {t("nav.brandBottom") || "Case Packages"}
            </span>
          </span>
        </a>

        <div className="flex items-center gap-2">
          {/* language switcher — always visible */}
          <div className="flex items-center rounded-full bg-slate-900/[0.06] p-1 ring-1 ring-slate-900/5">
            <Globe className="mx-1.5 hidden h-3.5 w-3.5 text-slate-400 sm:block" />
            {(["en", "ar"] as const).map((l) => (
              <button
                key={l}
                onClick={() => choose(l)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold transition-all duration-300",
                  lang === l
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                {l === "en" ? "EN" : "عربي"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCartOpen(count > 0)}
            className="shine relative flex items-center gap-2 rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 px-4 py-2 text-xs font-extrabold text-white shadow-lg shadow-teal-600/30 transition-transform duration-300 hover:-translate-y-0.5 active:scale-95 sm:text-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">{t("nav.cta") || "Order now"}</span>
            {count > 0 && (
              <span className="absolute -end-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-black text-slate-900 ring-2 ring-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
