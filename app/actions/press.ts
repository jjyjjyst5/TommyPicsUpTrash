"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/press");
}

export async function updatePressItem(_prev: unknown, formData: FormData) {
  if (!(await getSession())) return { error: "Not authorized." };
  const id = Number(formData.get("id"));
  if (!id) return { error: "Missing item." };

  const db = await getDb();
  await db
    .update(schema.pressItems)
    .set({
      title: String(formData.get("title") || ""),
      outlet: String(formData.get("outlet") || ""),
      type: String(formData.get("type") || "article"),
      url: String(formData.get("url") || "").trim() || null,
      excerpt: String(formData.get("excerpt") || ""),
      audioEmbedUrl: String(formData.get("audioEmbedUrl") || "").trim() || null,
      transcript: String(formData.get("transcript") || "").trim() || null,
    })
    .where(eq(schema.pressItems.id, id));

  refresh();
  return { ok: true, message: "Saved." };
}

export async function addPressItem(_prev: unknown, formData: FormData) {
  if (!(await getSession())) return { error: "Not authorized." };
  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Give it a title." };

  const db = await getDb();
  const max = await db.select().from(schema.pressItems);
  const sortOrder = max.reduce((m, p) => Math.max(m, p.sortOrder), 0) + 1;

  await db.insert(schema.pressItems).values({
    title,
    outlet: String(formData.get("outlet") || ""),
    type: String(formData.get("type") || "article"),
    url: String(formData.get("url") || "").trim() || null,
    excerpt: String(formData.get("excerpt") || ""),
    sortOrder,
  });
  refresh();
  return { ok: true, message: "Added." };
}

export async function deletePressItem(id: number) {
  if (!(await getSession())) return;
  const db = await getDb();
  await db.delete(schema.pressItems).where(eq(schema.pressItems.id, id));
  refresh();
}
