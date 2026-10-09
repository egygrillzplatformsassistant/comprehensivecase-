"use client";

import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Bundle, Department } from "@/db/schema";
import { Field, inputCls, Modal, Toggle, textareaCls, useNotifier } from "./ui";
import { cn } from "@/lib/format";

type FormState = {
  id: number | null;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  badgeEn: string;
  badgeAr: string;
  featuresEn: string;
  featuresAr: string;
  price: number;
  oldPrice: string;
  highlighted: boolean;
  departmentId: number | "";
  sortOrder: number;
  active: boolean;
};

const EMPTY: FormState = {
  id: null,
  nameEn: "",
  nameAr: "",
  descEn: "",
  descAr: "",
  badgeEn: "",
  badgeAr: "",
  featuresEn: "",
  featuresAr: "",
  price: 400,
  oldPrice: "",
  highlighted: false,
  departmentId: "",
  sortOrder: 0,
  active: true,
};

export function BundlesManager({
  bundles,
  departments,
}: {
  bundles: Bundle[];
  departments: Department[];
}) {
  const router = useRouter();
  const { notify, node } = useNotifier();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return bundles;
    if (filter === "highlighted") return bundles.filter((b) => b.highlighted);
    return bundles.filter((b) => b.departmentId === Number(filter));
  }, [bundles, filter]);

  const deptName = (id: number | null) =>
    id ? departments.find((d) => d.id === id)?.nameEn ?? "—" : null;

  function openEdit(b: Bundle) {
    setForm({
      id: b.id,
      nameEn: b.nameEn,
      nameAr: b.nameAr,
      descEn: b.descEn,
      descAr: b.descAr,
      badgeEn: b.badgeEn,
      badgeAr: b.badgeAr,
      featuresEn: b.featuresEn,
      featuresAr: b.featuresAr,
      price: b.price,
      oldPrice: b.oldPrice ? String(b.oldPrice) : "",
      highlighted: b.highlighted,
      departmentId: b.departmentId ?? "",
      sortOrder: b.sortOrder,
      active: b.active,
    });
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    const res = await fetch(form.id ? `/api/admin/bundles/${form.id}` : "/api/admin/bundles", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, oldPrice: form.oldPrice === "" ? null : Number(form.oldPrice) }),
    });
    setSaving(false);
    if (res.ok) {
      setForm(null);
      notify("Bundle saved");
      router.refresh();
    } else {
      notify("Error — names (EN/AR) are required");
    }
  }

  async function remove(b: Bundle) {
    if (!window.confirm(`Delete "${b.nameEn}"?`)) return;
    await fetch(`/api/admin/bundles/${b.id}`, { method: "DELETE" });
    notify("Deleted");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Bundles</h1>
          <p className="text-xs font-semibold text-slate-400">
            All pricing options — highlighted row & department bundles
          </p>
        </div>
        <button
          onClick={() => setForm({ ...EMPTY })}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-extrabold text-white shadow transition hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> Add bundle
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {[{ id: "all", label: `All (${bundles.length})` }, { id: "highlighted", label: "Highlighted row" }, ...departments.map((d) => ({ id: String(d.id), label: d.nameEn }))].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition",
              filter === f.id
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-900",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filtered.map((b) => (
          <div
            key={b.id}
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200",
              !b.active && "opacity-55",
            )}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {b.highlighted && <Star className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />}
                <p className="text-sm font-extrabold text-slate-900">{b.nameEn}</p>
                <span className="text-xs font-bold text-slate-400" dir="rtl">{b.nameAr}</span>
              </div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-400">
                {b.highlighted ? "Highlighted row" : deptName(b.departmentId) ?? "No department"} · order {b.sortOrder}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-end">
                {b.oldPrice && (
                  <span className="me-2 text-xs font-bold text-slate-300 line-through">{b.oldPrice}</span>
                )}
                <span className="text-base font-extrabold text-teal-700">{b.price} EGP</span>
              </div>
              <button
                onClick={() => openEdit(b)}
                className="flex items-center gap-1.5 rounded-full bg-teal-600/10 px-3.5 py-2 text-xs font-bold text-teal-700 ring-1 ring-teal-600/20 transition hover:bg-teal-600 hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => remove(b)}
                className="rounded-full bg-red-500/10 p-2.5 text-red-500 ring-1 ring-red-500/15 transition hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl bg-white p-10 text-center text-sm font-bold text-slate-300 ring-1 ring-slate-200">
            No bundles here yet.
          </p>
        )}
      </div>

      <Modal open={form !== null} onClose={() => setForm(null)} title={form?.id ? "Edit bundle" : "New bundle"}>
        {form && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name (English)">
                <input className={inputCls} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} placeholder="Photography + Editing" />
              </Field>
              <Field label="Name (Arabic)">
                <input dir="rtl" className={inputCls} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} placeholder="تصوير + تعديل" />
              </Field>
              <Field label="Small description (EN)">
                <input className={inputCls} value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} placeholder="Per comprehensive case" />
              </Field>
              <Field label="Small description (AR)">
                <input dir="rtl" className={inputCls} value={form.descAr} onChange={(e) => setForm({ ...form, descAr: e.target.value })} placeholder="لكل عيّنة شاملة" />
              </Field>
              <Field label="Badge (EN)" hint="e.g. MOST POPULAR">
                <input className={inputCls} value={form.badgeEn} onChange={(e) => setForm({ ...form, badgeEn: e.target.value })} />
              </Field>
              <Field label="Badge (AR)">
                <input dir="rtl" className={inputCls} value={form.badgeAr} onChange={(e) => setForm({ ...form, badgeAr: e.target.value })} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Features (EN)" hint="one per line">
                <textarea rows={5} className={textareaCls} value={form.featuresEn} onChange={(e) => setForm({ ...form, featuresEn: e.target.value })} />
              </Field>
              <Field label="Features (AR)" hint="سطر لكل ميزة">
                <textarea rows={5} dir="rtl" className={textareaCls} value={form.featuresAr} onChange={(e) => setForm({ ...form, featuresAr: e.target.value })} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Price (EGP)">
                <input type="number" className={inputCls} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </Field>
              <Field label="Old price" hint="optional, shows as crossed out">
                <input type="number" className={inputCls} value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} placeholder="—" />
              </Field>
              <Field label="Sort order">
                <input type="number" className={inputCls} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </Field>
              <Field label="Department">
                <select
                  className={inputCls}
                  value={form.highlighted ? "" : form.departmentId}
                  disabled={form.highlighted}
                  onChange={(e) => setForm({ ...form, departmentId: e.target.value === "" ? "" : Number(e.target.value) })}
                >
                  <option value="">— none —</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nameEn}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="flex flex-wrap gap-6">
              <Toggle
                checked={form.highlighted}
                onChange={(v) => setForm({ ...form, highlighted: v, departmentId: v ? "" : form.departmentId })}
                label="Show in the 4 highlighted deals row"
              />
              <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Visible on site" />
            </div>

            <button
              onClick={save}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save bundle
            </button>
          </div>
        )}
      </Modal>
      {node}
    </div>
  );
}
