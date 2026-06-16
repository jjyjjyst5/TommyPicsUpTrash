"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { saveImage } from "@/lib/blob";

export async function uploadGalleryImage(_prev: unknown, formData: FormData) {
  if (!(await getSession())) return { error: "Not authorized." };

  const file = formData.get("file");
  const caption = String(formData.get("caption") || "");
  const waterBodyRaw = String(formData.get("waterBodyId") || "");
  const waterBodyId = waterBodyRaw ? Number(waterBodyRaw) : null;

  if (!(file instanceof File) || file.size === 0)
    return { error: "Choose an image to upload." };
  if (!file.type.startsWith("image/")) return { error: "That file isn't an image." };
  if (file.size > 4 * 1024 * 1024) return { error: "Image must be under 4 MB." };

  try {
    const url = await saveImage(file);
    const db = await getDb();
    await db.insert(schema.galleryImages).values({ url, caption, waterBodyId });
    revalidatePath("/");
    revalidatePath("/admin/gallery");
    return { ok: true, message: "Photo added." };
  } catch (e) {
    return { error: `Upload failed: ${(e as Error).message}` };
  }
}

export async function deleteGalleryImage(id: number) {
  if (!(await getSession())) return;
  const db = await getDb();
  await db.delete(schema.galleryImages).where(eq(schema.galleryImages.id, id));
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}
