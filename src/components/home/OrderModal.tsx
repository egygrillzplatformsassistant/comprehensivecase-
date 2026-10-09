"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Loader2,
  PartyPopper,
  Phone,
  Send,
  User,
  Hash,
  X,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/format";
import { useSite } from "./SiteContext";

type Step = "form" | "done";

export function OrderModal() {
  const { cartOpen, setCartOpen, items, remove, clear, total, lang, t } = useSite();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const list = useMemo(() => [...items.values()], [items]);

  /* lock scroll while open */
  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  function close() {
    setCartOpen(false);
    setError("");
    if (step === "done") {
      setStep("form");
      setName("");
      setSection("");
      setPhone("");
      setOrderId(null);
    }
  }

  async function submit() {
    setError("");
    if (name.trim().length < 3 || section.trim().length === 0) {
      setError(t("form.errRequired"));
      return;
    }
    if (!/^01\d{9}$/.test(phone.trim())) {
      setError(t("form.errPhone"));
      return;
    }
    if (list.length === 0) return;

    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          section: section.trim(),
          phone: phone.trim(),
          items: list.map((i) => i.key),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "failed");
      setOrderId(data.id);
      setStep("done");
      clear();
    } catch {
      setError(t("form.errGeneric"));
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            onClick={close}
          />

          <motion.div
            initial={{ opacity: 0, y: 90, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 90, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] p-6 shadow-2xl ring-1 ring-white/80 sm:rounded-[2rem] sm:p-8"
          >
            <button
              onClick={close}
              className="absolute end-4 top-4 rounded-full bg-slate-900/5 p-2 text-slate-500 transition hover:bg-slate-900/10 hover:text-slate-800"
              aria-label="Close"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {step === "form" ? (
              <>
                <h3 className="mb-1 pr-8 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {t("form.title")}
                </h3>
                <p className="mb-5 text-sm font-medium text-slate-500">
                  {t("form.sub")}
                </p>

                {/* summary */}
                <div className="mb-5 rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/5">
                  <p className="mb-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-teal-700">
                    {t("form.summary")}
                  </p>
                  <ul className="space-y-1.5">
                    {list.map((i) => (
                      <li key={i.key} className="flex items-center justify-between gap-2 text-sm">
                        <span className="min-w-0 font-semibold text-slate-700">
                          <span className="block truncate">
                            {lang === "ar" ? i.nameAr : i.nameEn}
                          </span>
                          {i.deptEn && (
                            <span className="block truncate text-[11px] font-medium text-slate-400">
                              {lang === "ar" ? i.deptAr : i.deptEn}
                            </span>
                          )}
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 font-extrabold text-slate-900">
                          {formatPrice(i.price, lang)}
                          <button
                            onClick={() => remove(i.key)}
                            className="rounded-full p-1 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                            aria-label="Remove"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-300 pt-3">
                    <span className="text-sm font-bold text-slate-500">{t("cart.total")}</span>
                    <span className="text-xl font-extrabold text-teal-700">
                      {formatPrice(total, lang)}
                    </span>
                  </div>
                </div>

                {list.length > 0 ? (
                  <div className="space-y-3.5">
                    <Field
                      icon={<User className="h-4 w-4" />}
                      label={t("form.name")}
                      value={name}
                      onChange={setName}
                      placeholder={t("form.namePh")}
                    />
                    <Field
                      icon={<Hash className="h-4 w-4" />}
                      label={t("form.section")}
                      value={section}
                      onChange={setSection}
                      placeholder={t("form.sectionPh")}
                      inputMode="numeric"
                    />
                    <Field
                      icon={<Phone className="h-4 w-4" />}
                      label={t("form.phone")}
                      value={phone}
                      onChange={setPhone}
                      placeholder={t("form.phonePh")}
                      inputMode="tel"
                      dir="ltr"
                    />

                    {error && (
                      <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-600 ring-1 ring-red-500/20">
                        {error}
                      </p>
                    )}

                    <button
                      onClick={submit}
                      disabled={sending}
                      className="shine flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 py-4 text-sm font-extrabold text-white shadow-xl shadow-teal-600/35 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t("form.sending")}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {t("form.submit")} — {formatPrice(total, lang)}
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs font-semibold text-slate-400">
                      {t("form.note")}
                    </p>
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm font-semibold text-slate-400">
                    —
                  </p>
                )}
              </>
            ) : (
              <div className="py-6 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-2xl shadow-teal-600/40"
                >
                  <PartyPopper className="h-9 w-9" />
                </motion.div>
                <h3 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900">
                  {t("form.successTitle")}
                </h3>
                <p className="mx-auto mb-5 max-w-sm text-sm font-medium leading-relaxed text-slate-500">
                  {t("form.successBody")}
                </p>

                {orderId && (
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(String(orderId));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1600);
                    }}
                    className="mx-auto mb-6 flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-mono text-lg font-bold tracking-widest text-white shadow-lg transition hover:bg-slate-800"
                  >
                    #{orderId}
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-lime-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                )}

                <button
                  onClick={close}
                  className="shine w-full rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 py-4 text-sm font-extrabold text-white shadow-xl shadow-teal-600/35 transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  {t("form.another")}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  dir,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "numeric" | "tel" | "text";
  dir?: "ltr" | "rtl";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold text-slate-600">{label}</span>
      <span className="flex items-center gap-2.5 rounded-2xl bg-white/70 px-4 py-1 ring-1 ring-slate-900/10 transition focus-within:ring-2 focus-within:ring-teal-500">
        <span className="text-slate-400">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          dir={dir}
          className={cn(
            "w-full bg-transparent py-3 text-sm font-bold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-300",
            dir === "ltr" && "text-start",
          )}
        />
      </span>
    </label>
  );
}
