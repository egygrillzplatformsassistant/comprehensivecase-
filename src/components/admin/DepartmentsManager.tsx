"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Department } from "@/db/schema";
import { deptIcon, DEPT_ICONS } from "@/components/home/dept-icons";
import { Field, inputCls, Modal, Toggle, useNotifier } from "./ui";
import { cn } from "@/lib/format";

type Dept = Department & { bundleCount: number };

type FormState = {
  id: number | null;
  nameEn: string;
  nameAr: string;
  slug: string;
  icon: string;
  sortOrder: number;
  active: boolean;
};

const EMPTY: FormState = {
  id: null,
  nameEn: "",
  nameAr: "",
  slug: "",
  icon: "sparkles",
  sortOrder: 0,
  active: true,
};

export function DepartmentsManager({ departments }: { departments: Dept[] }) {
  const router = useRouter();
  const { notify, node } = useNotifier();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setForm({ ...EMPTY, sortOrder: departments.length + 1 });
  }
  function openEdit(d: Dept) {
    setForm({
      id: d.id,
      nameEn: d.nameEn,
      nameAr: d.nameAr,
      slug: d.slug,
      icon: d.icon,
      sortOrder: d.sortOrder,
      active: d.active,
    });
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    const res = await fetch(
      form.id ? `/api/admin/departments/${form.id}` : "/api/admin/departments",
      {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    setSaving(false);
    if (res.ok) {
      setForm(null);
      notify("Department saved");
      router.refresh();
    } else {
      notify("Error — check names are filled");
    }
  }

  async function remove(d: Dept) {
    if (!window.confirm(`Delete "${d.nameEn}" and ALL its bundles?`)) return;
    await fetch(`/api/admin/departments/${d.id}`, { method: "DELETE" });
    notify("Deleted");
    router.refresh();
  }

  async function toggleActive(d: Dept) {
    await fetch(`/api/admin/departments/${d.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...d, active: !d.active }),
    });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Departments</h1>
          <p className="text-xs font-semibold text-slate-400">
            Sections shown on the site (Endo, Crown & Bridge, …)
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-extrabold text-white shadow transition hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> Add department
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => {
          const Icon = deptIcon(d.icon);
          return (
            <div
              key={d.id}
              className={cn(
                "rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200",
                !d.active && "opacity-55",
              )}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-slate-900">{d.nameEn}</p>
                  <p className="truncate text-xs font-bold text-slate-400" dir="rtl">
                    {d.nameAr}
                  </p>
                </div>
              </div>
              <div className="mb-3 flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>
                  {d.bundleCount} bundle{d.bundleCount === 1 ? "" : "s"} · order {d.sortOrder}
                </span>
                <span className={d.active ? "text-emerald-600" : "text-slate-400"}>
                  {d.active ? "visible" : "hidden"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(d)}
                  className="flex-1 rounded-full bg-slate-900/5 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-900/10"
                >
                  {d.active ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => openEdit(d)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-teal-600/10 px-3 py-2 text-xs font-bold text-teal-700 ring-1 ring-teal-600/20 transition hover:bg-teal-600 hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => remove(d)}
                  className="rounded-full bg-red-500/10 p-2.5 text-red-500 ring-1 ring-red-500/15 transition hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={form !== null} onClose={() => setForm(null)} title={form?.id ? "Edit department" : "New department"}>
        {form && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name (English)">
                <input className={inputCls} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} placeholder="Endodontics (Endo)" />
              </Field>
              <Field label="Name (Arabic)">
                <input dir="rtl" className={inputCls} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} placeholder="علاج الجذور – إندو" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Slug" hint="optional, auto">
                <input className={inputCls} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="endo" dir="ltr" />
              </Field>
              <Field label="Icon">
                <select className={inputCls} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                  {Object.keys(DEPT_ICONS).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Sort order">
                <input type="number" className={inputCls} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </Field>
            </div>
            <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Visible on site" />
            <button
              onClick={save}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save department
            </button>
          </div>
        )}
      </Modal>
      {node}
    </div>
  );
}
