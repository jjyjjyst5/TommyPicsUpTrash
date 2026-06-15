"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";

/**
 * Update a water body's settings AND its current totals.
 *
 * Totals are sums of `cleanups` rows, so to let an admin set an exact "total
 * bags / bottles" we reconcile the body's `baseline` row: baseline =
 * desiredTotal − (sum of all non-baseline, i.e. logged, hauls). That way the
 * displayed total equals what they typed, while future logged hauls still add
 * on top.
 */
export async function updateWaterBody(_prev: unknown, formData: FormData) {
  if (!(await getSession())) return { error: "Not authorized." };

  const id = Number(formData.get("id"));
  if (!id) return { error: "Missing water body." };

  const lbsPerBag = Number(formData.get("lbsPerBag"));
  const kayakTrips = Number(formData.get("kayakTrips"));
  const blurb = String(formData.get("blurb") || "");
  const totalBags = Number(formData.get("totalBags"));
  const totalBottles = Number(formData.get("totalBottles"));

  const db = await getDb();

  await db
    .update(schema.waterBodies)
    .set({
      lbsPerBag: Number.isFinite(lbsPerBag) && lbsPerBag > 0 ? lbsPerBag : 20,
      kayakTrips: Number.isFinite(kayakTrips) && kayakTrips >= 0 ? kayakTrips : 0,
      blurb,
    })
    .where(eq(schema.waterBodies.id, id));

  // Reconcile totals via the baseline row.
  let note = "";
  if (Number.isFinite(totalBags) && Number.isFinite(totalBottles)) {
    const rows = await db
      .select()
      .from(schema.cleanups)
      .where(eq(schema.cleanups.waterBodyId, id));

    const logged = rows.filter((r) => r.source !== "baseline");
    const loggedBags = logged.reduce((s, r) => s + r.bags, 0);
    const loggedBottles = logged.reduce((s, r) => s + r.bottles, 0);

    const baselineBags = Math.max(0, Math.round(totalBags) - loggedBags);
    const baselineBottles = Math.max(0, Math.round(totalBottles) - loggedBottles);
    if (totalBags < loggedBags || totalBottles < loggedBottles) {
      note =
        " Note: logged hauls already exceed the total you entered, so the total reflects those hauls. Delete hauls on the Dashboard to go lower.";
    }

    const existingBaseline = rows.find((r) => r.source === "baseline");
    if (existingBaseline) {
      await db
        .update(schema.cleanups)
        .set({ bags: baselineBags, bottles: baselineBottles, pounds: null })
        .where(eq(schema.cleanups.id, existingBaseline.id));
    } else {
      await db.insert(schema.cleanups).values({
        waterBodyId: id,
        date: new Date().toISOString().slice(0, 10),
        bags: baselineBags,
        bottles: baselineBottles,
        pounds: null,
        source: "baseline",
        notes: "Baseline total (set in admin).",
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Saved." + note };
}
