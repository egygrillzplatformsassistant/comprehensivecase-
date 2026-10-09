"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/format";

export const inputCls =
  "w-full rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 outline-none transition focus:ring-2 focus:ring-teal-500 placeholder:font-normal placeholder:text-slate-300";

export const textareaCls = cn(inputCls, "leading-relaxed");

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-baseline justify-between text-xs font-bold text-slate-500">
        {label}
        {hint && <span className="text-[10px] font-semibold text-slate-300">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5"
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors duration-300",
          checked ? "bg-teal-500" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300",
            checked ? "start-[1.375rem]" : "start-0.5",
          )}
        />
      </span>
      <span className="text-sm font-bold text-slate-600">{label}</span>
    </button>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-slate-50 p-6 shadow-2xl sm:rounded-3xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-full bg-slate-900/5 p-2 text-slate-500 transition hover:bg-slate-900/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useNotifier() {
  const [note, setNote] = useState("");
  const notify = useCallback((msg: string) => {
    setNote(msg);
    window.setTimeout(() => setNote(""), 2200);
  }, []);
  const node = (
    <AnimatePresence>
      {note && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-2xl"
        >
          <CheckCircle2 className="h-4 w-4 text-lime-400" />
          {note}
        </motion.div>
      )}
    </AnimatePresence>
  );
  return { notify, node };
}
