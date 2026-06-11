"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/hauls");
}

export async function addHaul(_prev: unknown, formData: FormData) {
  if (!(await getSession())) return { error: "Not authorized." };

  const waterBodyId = Number(formData.get("waterBodyId"));
  const date = String(formData.get("date") || "");
  const bags = Number(formData.get("bags") || 0);
  const bottles = Number(formData.get("bottles") || 0);
  const poundsRaw = String(formData.get("pounds") || "").trim();
  const pounds = poundsRaw === "" ? null : Number(poundsRaw);
  const source = String(formData.get("source") || "manual");
  const tweetUrl = String(formData.get("tweetUrl") || "").trim() || null;
  const notes = String(formData.get("notes") || "").trim() || null;

  if (!waterBodyId || !date) return { error: "Pick a water body and a date." };
  if (bags === 0 && bottles === 0 && !pounds)
    return { error: "Enter at least a bag, bottle, or pound count." };

  const db = await getDb();
  await db.insert(schema.cleanups).values({
    waterBodyId,
    date,
    bags: Number.isFinite(bags) ? bags : 0,
    bottles: Number.isFinite(bottles) ? bottles : 0,
    pounds: pounds !== null && Number.isFinite(pounds) ? pounds : null,
    source,
    tweetUrl,
    notes,
  });

  refresh();
  return { ok: true, message: `Logged ${bags} bag${bags === 1 ? "" : "s"}.` };
}

export async function deleteHaul(id: number) {
  if (!(await getSession())) return;
  const db = await getDb();
  await db.delete(schema.cleanups).where(eq(schema.cleanups.id, id));
  refresh();
}
