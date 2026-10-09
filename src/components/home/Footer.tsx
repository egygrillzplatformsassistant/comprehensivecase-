"use client";

import { Heart, Lock } from "lucide-react";
import { useSite } from "./SiteContext";
import { ToothLogo } from "./ToothLogo";

export function Footer() {
  const { t } = useSite();

  return (
    <footer className="mx-auto max-w-6xl px-5 pb-28 pt-10 sm:pb-10">
      <div className="glass rounded-[2rem] p-7 text-center shadow-lg shadow-teal-900/5 ring-1 ring-white/70 sm:p-9">
        <div className="mb-4 flex justify-center">
          <ToothLogo size={44} />
        </div>
        <p className="text-lg font-extrabold tracking-tight text-slate-900">
          {t("nav.brandTop") || "ASU DENTISTRY"} — {t("footer.tag")}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-500">{t("footer.contact")}</p>

        <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-2 border-t border-slate-900/10 pt-5 text-xs font-bold text-slate-400">
          <span>© 2026</span>
          <Heart className="h-3.5 w-3.5 text-teal-500" fill="currentColor" />
          <span>ASU Dentistry • Batch ’26</span>
          <a
            href="/admin/login"
            className="ms-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-slate-300 transition hover:bg-slate-900/5 hover:text-slate-500"
            aria-label="Admin"
          >
            <Lock className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
