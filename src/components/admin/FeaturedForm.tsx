"use client";

import { Loader2, Save, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FeaturedOfferRow } from "@/db/schema";
import { Field, inputCls, textareaCls, Toggle, useNotifier } from "./ui";

export function FeaturedForm({ offer }: { offer: FeaturedOfferRow | null }) {
  const router = useRouter();
  const { notify, node } = useNotifier();
  const [saving, setSaving] = useState(false);

  const [f, setF] = useState({
    enabled: offer?.enabled ?? true,
    badgeEn: offer?.badgeEn ?? "",
    badgeAr: offer?.badgeAr ?? "",
    titleEn: offer?.titleEn ?? "",
    titleAr: offer?.titleAr ?? "",
    descEn: offer?.descEn ?? "",
    descAr: offer?.descAr ?? "",
    includesEn: offer?.includesEn ?? "",
    includesAr: offer?.includesAr ?? "",
    footnoteEn: offer?.footnoteEn ?? "",
    footnoteAr: offer?.footnoteAr ?? "",
    price: offer?.price ?? 0,
    oldPrice: offer?.oldPrice ? String(offer.oldPrice) : "",
  });

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/featured", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, oldPrice: f.oldPrice === "" ? null : Number(f.oldPrice) }),
    });
    setSaving(false);
    notify(res.ok ? "Featured offer saved" : "Error saving");
    if (res.ok) router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
            <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
            Featured Offer
          </h1>
          <p className="text-xs font-semibold text-slate-400">
            The big OFFER card at the top of the page — fully editable
          </p>
        </div>
        <Toggle checked={f.enabled} onChange={(v) => setF({ ...f, enabled: v })} label="Shown on site" />
      </div>

      <div className="space-y-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Badge (EN)" hint="e.g. LIMITED BATCH OFFER">
            <input className={inputCls} value={f.badgeEn} onChange={(e) => setF({ ...f, badgeEn: e.target.value })} />
          </Field>
          <Field label="Badge (AR)">
            <input dir="rtl" className={inputCls} value={f.badgeAr} onChange={(e) => setF({ ...f, badgeAr: e.target.value })} />
          </Field>
          <Field label="Title (EN)">
            <input className={inputCls} value={f.titleEn} onChange={(e) => setF({ ...f, titleEn: e.target.value })} />
          </Field>
          <Field label="Title (AR)">
            <input dir="rtl" className={inputCls} value={f.titleAr} onChange={(e) => setF({ ...f, titleAr: e.target.value })} />
          </Field>
          <Field label="Description (EN)">
            <textarea rows={3} className={textareaCls} value={f.descEn} onChange={(e) => setF({ ...f, descEn: e.target.value })} />
          </Field>
          <Field label="Description (AR)">
            <textarea rows={3} dir="rtl" className={textareaCls} value={f.descAr} onChange={(e) => setF({ ...f, descAr: e.target.value })} />
          </Field>
          <Field label="What’s included (EN)" hint="one per line">
            <textarea rows={6} className={textareaCls} value={f.includesEn} onChange={(e) => setF({ ...f, includesEn: e.target.value })} />
          </Field>
          <Field label="ما يشمله العرض (AR)" hint="سطر لكل بند">
            <textarea rows={6} dir="rtl" className={textareaCls} value={f.includesAr} onChange={(e) => setF({ ...f, includesAr: e.target.value })} />
          </Field>
          <Field label="Footnote (EN)" hint="e.g. bring 2 friends get 5% off">
            <input className={inputCls} value={f.footnoteEn} onChange={(e) => setF({ ...f, footnoteEn: e.target.value })} />
          </Field>
          <Field label="Footnote (AR)">
            <input dir="rtl" className={inputCls} value={f.footnoteAr} onChange={(e) => setF({ ...f, footnoteAr: e.target.value })} />
          </Field>
          <Field label="Price (EGP)">
            <input type="number" className={inputCls} value={f.price} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} />
          </Field>
          <Field label="Old price" hint="optional, crossed out">
            <input type="number" className={inputCls} value={f.oldPrice} onChange={(e) => setF({ ...f, oldPrice: e.target.value })} placeholder="—" />
          </Field>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-teal-600/25 transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save featured offer
        </button>
      </div>
      {node}
    </div>
  );
}
