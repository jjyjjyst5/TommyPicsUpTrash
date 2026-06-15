"use server";

import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";

async function setContent(key: string, value: string) {
  const db = await getDb();
  await db
    .insert(schema.siteContent)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.siteContent.key,
      set: { value, updatedAt: new Date() },
    });
}

export async function updateStory(
  _prev: unknown,
  formData: FormData
): Promise<{ ok?: boolean; error?: string; message?: string }> {
  if (!(await getSession())) return { error: "Not authorized." };

  const heading = String(formData.get("heading") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!heading) return { error: "Add a heading." };
  if (!body) return { error: "Add some story text." };

  await setContent("story_heading", heading);
  await setContent("story_body", body);

  revalidatePath("/");
  revalidatePath("/admin/story");
  return { ok: true, message: "Story saved." };
}
