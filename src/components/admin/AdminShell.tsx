"use client";

import {
  ExternalLink,
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";
import { ToothLogo } from "@/components/home/ToothLogo";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/departments", label: "Departments", icon: FolderTree },
  { href: "/admin/bundles", label: "Bundles", icon: Package },
  { href: "/admin/featured", label: "Featured Offer", icon: Star },
  { href: "/admin/content", label: "Site Content", icon: FileText },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-slate-100">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <ToothLogo size={34} />
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-slate-900">ASU Case Packages</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">
                Admin Panel
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full bg-slate-900/5 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-900/10 sm:flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View site
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-4 py-2 text-xs font-bold text-red-600 ring-1 ring-red-500/20 transition hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* nav */}
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 pb-2 sm:px-6">
          {LINKS.map((l) => {
            const active =
              l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition",
                  active
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-500 hover:bg-slate-900/5 hover:text-slate-900",
                )}
              >
                <l.icon className="h-3.5 w-3.5" />
                {l.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
