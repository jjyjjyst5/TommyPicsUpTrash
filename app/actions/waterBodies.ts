"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";

export async function updateWaterBody(_prev: unknown, formData: FormData) {
  if (!(await getSession())) return { error: "Not authorized." };

  const id = Number(formData.get("id"));
  if (!id) return { error: "Missing water body." };

  const lbsPerBag = Number(formData.get("lbsPerBag"));
  const kayakTrips = Number(formData.get("kayakTrips"));
  const blurb = String(formData.get("blurb") || "");

  const db = await getDb();
  await db
    .update(schema.waterBodies)
    .set({
      lbsPerBag: Number.isFinite(lbsPerBag) && lbsPerBag > 0 ? lbsPerBag : 20,
      kayakTrips: Number.isFinite(kayakTrips) ? kayakTrips : 0,
      blurb,
    })
    .where(eq(schema.waterBodies.id, id));

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Saved." };
}
