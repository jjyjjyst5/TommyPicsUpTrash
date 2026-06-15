import { getDb, schema } from "@/db";
import { desc, asc, inArray } from "drizzle-orm";
import { STORY } from "@/lib/content";

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

export async function getCrazyFinds() {
  const db = await getDb();
  return db
    .select()
    .from(schema.crazyFinds)
    .orderBy(asc(schema.crazyFinds.sortOrder), desc(schema.crazyFinds.createdAt));
}

/**
 * The editable "His Story" copy, falling back to the static defaults in
 * lib/content.ts when nothing has been saved yet. Body is a single text blob;
 * blank lines separate paragraphs (auto-formatted at render).
 */
export async function getStoryContent(): Promise<{ heading: string; body: string }> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.siteContent)
    .where(inArray(schema.siteContent.key, ["story_heading", "story_body"]));
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    heading: map["story_heading"]?.trim() || STORY.heading,
    body: map["story_body"]?.trim() || STORY.paragraphs.join("\n\n"),
  };
}

export async function getRecentCleanups(limit = 10) {
  const db = await getDb();
  return db
    .select()
    .from(schema.cleanups)
    .orderBy(desc(schema.cleanups.date), desc(schema.cleanups.id))
    .limit(limit);
}
