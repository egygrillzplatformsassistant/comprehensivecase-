"use client";

import {
  Banknote,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Package,
  Phone,
  PhoneCall,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderItem } from "@/db/schema";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import { cn } from "@/lib/format";

export type SerializedOrder = {
  id: number;
  name: string;
  section: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-300",
  contacted: "bg-sky-100 text-sky-800 ring-sky-300",
  completed: "bg-emerald-100 text-emerald-800 ring-emerald-300",
};

export function OrdersDashboard({
  orders: initial,
  stats,
}: {
  orders: SerializedOrder[];
  stats: { total: number; pending: number; contacted: number; completed: number; revenueAll: number; revenueDone: number };
}) {
  const router = useRouter();
  const [orders, setOrders] = useState(initial);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [busy, setBusy] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  async function setStatus(id: number, status: OrderStatus) {
    setBusy(id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(id: number) {
    if (!window.confirm(`Delete order #${id}? This cannot be undone.`)) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const cards = [
    { label: "Total orders", value: stats.total, icon: ClipboardList, cls: "bg-slate-900 text-white" },
    { label: "Pending", value: stats.pending, icon: Clock3, cls: "bg-amber-400 text-amber-950" },
    { label: "Contacted", value: stats.contacted, icon: PhoneCall, cls: "bg-sky-500 text-white" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, cls: "bg-emerald-500 text-white" },
    { label: "Revenue (all)", value: `${stats.revenueAll} EGP`, icon: Banknote, cls: "bg-teal-600 text-white" },
    { label: "Revenue (done)", value: `${stats.revenueDone} EGP`, icon: Package, cls: "bg-white text-slate-900 ring-1 ring-slate-200" },
  ];

  const fmt = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      {/* stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className={cn("rounded-2xl p-4 shadow-sm", c.cls)}>
            <c.icon className="mb-2 h-5 w-5 opacity-80" />
            <p className="text-xl font-extrabold leading-tight">{c.value}</p>
            <p className="text-[11px] font-bold uppercase tracking-wide opacity-70">{c.label}</p>
          </div>
        ))}
      </div>

      {/* filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", ...ORDER_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold capitalize transition",
              filter === s
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-900",
            )}
          >
            {s === "all" ? `All (${orders.length})` : `${s} (${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* orders */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center text-sm font-bold text-slate-300 ring-1 ring-slate-200">
          No orders yet — share the link with the batch!
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div
              key={o.id}
              className={cn(
                "rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition sm:p-5",
                busy === o.id && "opacity-60",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-slate-900 px-2 py-0.5 font-mono text-xs font-bold text-white">
                      #{o.id}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900">{o.name}</h3>
                    <span className="text-xs font-bold text-slate-400">Section {o.section}</span>
                  </div>
                  <a
                    href={`tel:${o.phone}`}
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline"
                    dir="ltr"
                  >
                    <Phone className="h-3 w-3" />
                    {o.phone}
                  </a>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {o.items.map((i, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-teal-600/8 px-2.5 py-1 text-[11px] font-bold text-teal-800 ring-1 ring-teal-600/15"
                      >
                        {i.nameEn}
                        {i.deptEn ? ` · ${i.deptEn}` : ""} — {i.price}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-lg font-extrabold text-slate-900">{o.total} EGP</p>
                  <p className="text-[11px] font-bold text-slate-400">
                    {fmt.format(new Date(o.createdAt))}
                  </p>
                  <div className="flex items-center gap-2">
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                      className={cn(
                        "cursor-pointer rounded-full px-3 py-1.5 text-xs font-extrabold capitalize outline-none ring-1 transition",
                        STATUS_STYLE[o.status] ?? STATUS_STYLE.pending,
                      )}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => remove(o.id)}
                      className="rounded-full bg-red-500/10 p-2 text-red-500 ring-1 ring-red-500/15 transition hover:bg-red-500 hover:text-white"
                      aria-label="Delete order"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
