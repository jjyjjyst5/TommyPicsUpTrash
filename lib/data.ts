import { getDb, schema } from "@/db";
import { desc, asc, inArray } from "drizzle-orm";
import { STORY } from "@/lib/content";
import {
  SITE_TEXT_KEYS,
  resolveSiteText,
  resolveSiteTextFlat,
  type SiteText,
} from "@/lib/siteText";

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

/**
 * Resolved editable text blocks for the homepage (Hero + every section's
 * eyebrow/heading/intro). Reads saved overrides from site_content and falls
 * back to the lib/content.ts defaults for anything left blank.
 */
export async function getSiteText(): Promise<SiteText> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.siteContent)
    .where(inArray(schema.siteContent.key, SITE_TEXT_KEYS));
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return resolveSiteText(map);
}

/** Flat key → effective value map for the Admin → Site Text editor. */
export async function getSiteTextValues(): Promise<Record<string, string>> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.siteContent)
    .where(inArray(schema.siteContent.key, SITE_TEXT_KEYS));
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return resolveSiteTextFlat(map);
}

export async function getRecentCleanups(limit = 10) {
  const db = await getDb();
  return db
    .select()
    .from(schema.cleanups)
    .orderBy(desc(schema.cleanups.date), desc(schema.cleanups.id))
    .limit(limit);
}
