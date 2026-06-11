import { getDb, schema } from "@/db";
import { desc, asc } from "drizzle-orm";

export async function getGallery() {
  const db = await getDb();
  return db
    .select()
    .from(schema.galleryImages)
    .orderBy(asc(schema.galleryImages.sortOrder), desc(schema.galleryImages.createdAt));
}

export async function getPress() {
  const db = await getDb();
  return db.select().from(schema.pressItems).orderBy(asc(schema.pressItems.sortOrder));
}

export async function getWaterBodies() {
  const db = await getDb();
  return db.select().from(schema.waterBodies).orderBy(asc(schema.waterBodies.sortOrder));
}

export async function getRecentCleanups(limit = 10) {
  const db = await getDb();
  return db
    .select()
    .from(schema.cleanups)
    .orderBy(desc(schema.cleanups.date), desc(schema.cleanups.id))
    .limit(limit);
}
