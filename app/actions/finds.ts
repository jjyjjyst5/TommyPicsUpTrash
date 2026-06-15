"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { saveImage } from "@/lib/blob";
import { detectMediaTypeFromUrl, mediaTypeFromMime } from "@/lib/media";

export type FindResult = { ok?: boolean; error?: string; message?: string };

const MAX_UPLOAD = 4.5 * 1024 * 1024; // serverless body limit — videos should use a link

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/finds");
}

/** Resolve media from either an uploaded file or a pasted URL. */
async function resolveMedia(formData: FormData): Promise<
  { url: string; type: string } | { error: string } | null
> {
  const file = formData.get("file");
  const url = String(formData.get("mediaUrl") || "").trim();

  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/"))
      return { error: "Upload an image or video file." };
    if (file.size > MAX_UPLOAD)
      return { error: "File is over 4.5 MB. For videos, paste a YouTube/Instagram/X link instead." };
    const saved = await saveImage(file);
    return { url: saved, type: mediaTypeFromMime(file.type) };
  }
  if (url) return { url, type: detectMediaTypeFromUrl(url) };
  return null; // no new media provided
}

export async function addFind(_prev: unknown, formData: FormData): Promise<FindResult> {
  if (!(await getSession())) return { error: "Not authorized." };
  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Give the find a title." };

  const media = await resolveMedia(formData);
  if (media && "error" in media) return media;
  if (!media) return { error: "Add a photo/video file or paste a media link." };

  const db = await getDb();
  const all = await db.select().from(schema.crazyFinds);
  const sortOrder = all.reduce((m, f) => Math.max(m, f.sortOrder), 0) + 1;

  await db.insert(schema.crazyFinds).values({
    title,
    description: String(formData.get("description") || ""),
    mediaUrl: media.url,
    mediaType: media.type,
    sortOrder,
  });
  refresh();
  return { ok: true, message: "Find added." };
}

export async function updateFind(_prev: unknown, formData: FormData): Promise<FindResult> {
  if (!(await getSession())) return { error: "Not authorized." };
  const id = Number(formData.get("id"));
  if (!id) return { error: "Missing find." };

  const set: Record<string, unknown> = {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || ""),
    sortOrder: Number(formData.get("sortOrder")) || 0,
  };
  // Optional media replacement (new file or changed URL).
  const media = await resolveMedia(formData);
  if (media && "error" in media) return media;
  if (media) {
    set.mediaUrl = media.url;
    set.mediaType = media.type;
  }

  const db = await getDb();
  await db.update(schema.crazyFinds).set(set).where(eq(schema.crazyFinds.id, id));
  refresh();
  return { ok: true, message: "Saved." };
}

export async function deleteFind(id: number) {
  if (!(await getSession())) return;
  const db = await getDb();
  await db.delete(schema.crazyFinds).where(eq(schema.crazyFinds.id, id));
  refresh();
}
