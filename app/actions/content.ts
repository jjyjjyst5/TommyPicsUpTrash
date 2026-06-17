"use server";

import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { SITE_TEXT_FIELDS } from "@/lib/siteText";

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

export async function updateSiteText(
  _prev: unknown,
  formData: FormData
): Promise<{ ok?: boolean; error?: string; message?: string }> {
  if (!(await getSession())) return { error: "Not authorized." };

  // Persist every known field present in the form. A blank value is stored as
  // an empty string, which the resolver treats as "use the default."
  for (const field of SITE_TEXT_FIELDS) {
    const raw = formData.get(field.key);
    if (raw === null) continue; // not part of this submission
    await setContent(field.key, String(raw).trim());
  }

  revalidatePath("/");
  revalidatePath("/admin/text");
  return { ok: true, message: "Site text saved." };
}
