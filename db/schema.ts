import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  date,
  doublePrecision,
} from "drizzle-orm/pg-core";

/**
 * A body of water Tommy cleans (e.g. the Ohio River, Stevenson Creek).
 * Counts are derived by summing the `cleanups` rows that belong to it; the
 * values here are descriptive metadata + the weight estimator.
 */
export const waterBodies = pgTable("water_bodies", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  blurb: text("blurb").notNull().default(""),
  // Default pounds-of-trash per bag, grounded in Tommy's own figures
  // (~10,000 lbs ÷ ~500 bags ≈ 20 lbs/bag). Editable per water body.
  lbsPerBag: doublePrecision("lbs_per_bag").notNull().default(20),
  startDate: date("start_date"),
  bottlesEstimate: integer("bottles_estimate").notNull().default(0),
  kayakTrips: integer("kayak_trips").notNull().default(0),
  accentColor: text("accent_color").notNull().default("#0ea5e9"),
  sortOrder: integer("sort_order").notNull().default(0),
});

/**
 * A single logged haul. Totals are SUMmed across these rows and never
 * overwritten — historical baselines are themselves rows.
 */
export const cleanups = pgTable("cleanups", {
  id: serial("id").primaryKey(),
  waterBodyId: integer("water_body_id")
    .notNull()
    .references(() => waterBodies.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  bags: integer("bags").notNull().default(0),
  bottles: integer("bottles").notNull().default(0),
  // If null, weight is estimated as bags * waterBody.lbsPerBag.
  pounds: doublePrecision("pounds"),
  source: text("source").notNull().default("manual"), // 'manual' | 'tweet' | 'baseline'
  tweetUrl: text("tweet_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  caption: text("caption").notNull().default(""),
  waterBodyId: integer("water_body_id").references(() => waterBodies.id, {
    onDelete: "set null",
  }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pressItems = pgTable("press_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  outlet: text("outlet").notNull(),
  type: text("type").notNull().default("article"), // 'article' | 'radio' | 'tv'
  url: text("url"),
  publishedDate: date("published_date"),
  excerpt: text("excerpt").notNull().default(""),
  audioEmbedUrl: text("audio_embed_url"),
  transcript: text("transcript"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type WaterBody = typeof waterBodies.$inferSelect;
export type Cleanup = typeof cleanups.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type PressItem = typeof pressItems.$inferSelect;
