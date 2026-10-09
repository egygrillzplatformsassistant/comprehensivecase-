import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { isAdminAuthed } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
