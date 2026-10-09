import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin, str } from "@/lib/api-guard";
import { ORDER_STATUSES } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

function parseId(id: string) {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await ctx.params;
  const orderId = parseId(id);
  if (!orderId) return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });

  let b: { status?: string };
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const status = str(b.status, 20);
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ ok: false, error: "bad_status" }, { status: 400 });
  }

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await ctx.params;
  const orderId = parseId(id);
  if (!orderId) return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });
  await db.delete(orders).where(eq(orders.id, orderId));
  return NextResponse.json({ ok: true });
}
