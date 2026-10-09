"use client";

import { FileText, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { SiteText } from "@/db/schema";
import { Field, inputCls, textareaCls, useNotifier } from "./ui";
import { cn } from "@/lib/format";

/**
 * Every piece of copy on the public site, editable from one place.
 * Texts are grouped by section; each group saves independently.
 */
export function ContentEditor({ rows }: { rows: SiteText[] }) {
  const router = useRouter();
  const { notify, node } = useNotifier();

  const [values, setValues] = useState<Record<string, { en: string; ar: string }>>(
    () => Object.fromEntries(rows.map((r) => [r.key, { en: r.valueEn, ar: r.valueAr }])),
  );
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [savingGroup, setSavingGroup] = useState<string | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, SiteText[]>();
    for (const r of rows) {
      const g = r.group || "general";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(r);
    }
    return [...map.entries()];
  }, [rows]);

  const groupDirty = (g: string, list: SiteText[]) => list.some((r) => dirty[r.key]);

  async function saveGroup(g: string, list: SiteText[]) {
    setSavingGroup(g);
    const res = await fetch("/api/admin/texts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        updates: list.map((r) => ({
          key: r.key,
          group: r.group,
          label: r.label,
          valueEn: values[r.key]?.en ?? "",
          valueAr: values[r.key]?.ar ?? "",
        })),
      }),
    });
    setSavingGroup(null);
    if (res.ok) {
      setDirty((d) => {
        const next = { ...d };
        for (const r of list) delete next[r.key];
        return next;
      });
      notify(`Saved — ${g}`);
      router.refresh();
    } else {
      notify("Error saving");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
          <FileText className="h-5 w-5 text-teal-600" />
          Site Content
        </h1>
        <p className="text-xs font-semibold text-slate-400">
          Every word on the website — edit English & Arabic, then save each section
        </p>
      </div>

      {groups.map(([g, list]) => (
        <section key={g} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-teal-700">
              {g}
            </h2>
            <button
              onClick={() => saveGroup(g, list)}
              disabled={savingGroup === g || !groupDirty(g, list)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition",
                groupDirty(g, list)
                  ? "bg-slate-900 text-white shadow hover:-translate-y-0.5"
                  : "bg-slate-100 text-slate-300",
              )}
            >
              {savingGroup === g ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {list.map((r) => {
              const v = values[r.key] ?? { en: "", ar: "" };
              const long = Math.max(v.en.length, v.ar.length, r.valueEn.length, r.valueAr.length) > 80;
              return (
                <div
                  key={r.key}
                  className={cn(
                    "rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100",
                    dirty[r.key] && "ring-2 ring-amber-300",
                    long && "lg:col-span-2",
                  )}
                >
                  <p className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-wide text-slate-400">
                    {r.label || r.key}
                    <span className="font-mono text-[10px] font-medium text-slate-300">{r.key}</span>
                  </p>
                  <div className={cn("grid gap-3", long && "sm:grid-cols-2")}>
                    <Field label="English">
                      {long ? (
                        <textarea
                          rows={3}
                          className={textareaCls}
                          value={v.en}
                          onChange={(e) => {
                            setValues((s) => ({ ...s, [r.key]: { ...v, en: e.target.value } }));
                            setDirty((d) => ({ ...d, [r.key]: true }));
                          }}
                        />
                      ) : (
                        <input
                          className={inputCls}
                          value={v.en}
                          onChange={(e) => {
                            setValues((s) => ({ ...s, [r.key]: { ...v, en: e.target.value } }));
                            setDirty((d) => ({ ...d, [r.key]: true }));
                          }}
                        />
                      )}
                    </Field>
                    <Field label="العربية">
                      {long ? (
                        <textarea
                          rows={3}
                          dir="rtl"
                          className={textareaCls}
                          value={v.ar}
                          onChange={(e) => {
                            setValues((s) => ({ ...s, [r.key]: { ...v, ar: e.target.value } }));
                            setDirty((d) => ({ ...d, [r.key]: true }));
                          }}
                        />
                      ) : (
                        <input
                          dir="rtl"
                          className={inputCls}
                          value={v.ar}
                          onChange={(e) => {
                            setValues((s) => ({ ...s, [r.key]: { ...v, ar: e.target.value } }));
                            setDirty((d) => ({ ...d, [r.key]: true }));
                          }}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
      {node}
    </div>
  );
}
