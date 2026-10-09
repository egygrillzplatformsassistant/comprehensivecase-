"use client";

import { motion } from "framer-motion";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToothLogo } from "@/components/home/ToothLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(
          res.status === 429
            ? "Too many attempts — wait a few minutes."
            : "Wrong password. Try again.",
        );
        return;
      }
      router.replace("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-100 p-5">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="blob absolute -top-20 start-[10%] h-72 w-72 rounded-full bg-teal-300/40" />
        <div className="blob absolute bottom-0 end-[8%] h-80 w-80 rounded-full bg-cyan-300/40 [animation-delay:6s]" />
      </div>

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl shadow-teal-900/10 ring-1 ring-slate-200"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <ToothLogo size={52} />
          <h1 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900">
            Admin Panel
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />
            ASU Dentistry • Case Packages
          </p>
        </div>

        <label className="mb-3 block">
          <span className="mb-1.5 block text-xs font-bold text-slate-500">Password</span>
          <div className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 ring-1 ring-slate-200 transition focus-within:ring-2 focus-within:ring-teal-500">
            <Lock className="h-4 w-4 shrink-0 text-slate-300" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full bg-transparent py-3 text-sm font-bold text-slate-900 outline-none"
            />
          </div>
        </label>

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-3 rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-600 ring-1 ring-red-500/20"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={loading || password.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Enter dashboard
        </button>
      </motion.form>
    </main>
  );
}
