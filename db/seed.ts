import { getDb, schema } from "./index";

/**
 * Seed the database with researched starting values. Idempotent: it only
 * inserts when a table is empty, so re-running won't duplicate data.
 *
 * Run with:  npm run db:seed
 */
async function seed() {
  const db = await getDb();

  const existingBodies = await db.select().from(schema.waterBodies);
  if (existingBodies.length === 0) {
    console.log("Seeding water bodies + baseline hauls…");
    const bodies = await db
      .insert(schema.waterBodies)
      .values([
        {
          slug: "ohio-river",
          name: "Ohio River",
          location: "Pittsburgh, PA",
          blurb:
            "A 2.5-mile stretch near the Chateau neighborhood, worked by kayak about three times a week since the summer of 2022.",
          lbsPerBag: 20,
          startDate: "2022-06-01",
          bottlesEstimate: 18000,
          kayakTrips: 320,
          accentColor: "#0284c7",
          sortOrder: 0,
        },
        {
          slug: "stevenson-creek",
          name: "Stevenson Creek",
          location: "Clearwater, FL",
          blurb:
            "Cleaned by kayak since May 2022, now with trash barriers installed alongside local partners. Home to manatees, dolphins, and otters.",
          lbsPerBag: 20,
          startDate: "2022-05-01",
          bottlesEstimate: 12000,
          kayakTrips: 110,
          accentColor: "#0d9488",
          sortOrder: 1,
        },
      ])
      .returning();

    const bySlug = Object.fromEntries(bodies.map((b) => [b.slug, b.id]));

    // Baseline rows capture the historical total to date. New hauls add to it.
    await db.insert(schema.cleanups).values([
      {
        waterBodyId: bySlug["ohio-river"],
        date: "2025-09-01",
        bags: 800,
        bottles: 18000,
        pounds: null, // estimated via lbsPerBag
        source: "baseline",
        notes: "Historical total to date — confirm/adjust in admin.",
      },
      {
        waterBodyId: bySlug["stevenson-creek"],
        date: "2025-02-01",
        bags: 600,
        bottles: 12000,
        pounds: null,
        source: "baseline",
        notes: "Historical total to date — confirm/adjust in admin.",
      },
    ]);
  } else {
    console.log("Water bodies already present — skipping.");
  }

  const existingPress = await db.select().from(schema.pressItems);
  if (existingPress.length === 0) {
    console.log("Seeding press items…");
    await db.insert(schema.pressItems).values([
      {
        title: "KDKA NewsRadio Interview",
        outlet: "KDKA NewsRadio (Pittsburgh)",
        type: "radio",
        url: "https://www.audacy.com/kdkaradio",
        publishedDate: "2026-06-11",
        excerpt:
          "Tommy joined KDKA NewsRadio to talk about his Ohio River and Stevenson Creek cleanups. Audio and transcript coming soon.",
        audioEmbedUrl: null,
        transcript: null,
        sortOrder: 0,
      },
      {
        title: "Meet the kayaker who's removing Pittsburghers' litter from the Ohio River",
        outlet: "CBS Pittsburgh / KDKA-TV",
        type: "tv",
        url: "https://www.cbsnews.com/pittsburgh/news/kayaker-removing-trash-ohio-river-pittsburgh/",
        publishedDate: "2025-07-01",
        excerpt:
          "“I fill up my kayak as much as I can, and sadly, it's not even very difficult.” An estimated 18,000+ bottles pulled from the river.",
        sortOrder: 1,
      },
      {
        title: "Why Tom Ross is Cleaning Up Pittsburgh — One Bag at a Time",
        outlet: "Pittsburgh Magazine",
        type: "article",
        url: "https://www.pittsburghmagazine.com/why-tom-ross-is-cleaning-up-pittsburgh-one-bag-at-a-time/",
        publishedDate: "2023-01-01",
        excerpt:
          "The retired banker who set a 500-bag goal — and beat it before winter.",
        sortOrder: 2,
      },
      {
        title: "Ross man does his part to remove litter from Ohio River",
        outlet: "TribLive",
        type: "article",
        url: "https://triblive.com/community/north-hills/ross-man-does-his-part-to-remove-litter-from-ohio-river/ede270feb46e0fc75c0e0b052b0219c8/",
        publishedDate: "2023-01-01",
        excerpt: "A North Hills native makes the river his cause.",
        sortOrder: 3,
      },
      {
        title: "Allegheny County man spends hours in kayak cleaning litter from Ohio River",
        outlet: "WPXI",
        type: "tv",
        url: "https://www.wpxi.com/news/local/allegheny-county-man-spends-hours-kayak-cleaning-litter-ohio-river/AROH2A6JVZF7XHUQ2IH5TEXT5U/",
        publishedDate: "2023-01-01",
        excerpt: "Hours on the water, week after week.",
        sortOrder: 4,
      },
      {
        title: "Tommy Picks Up Trash — Stevenson Creek",
        outlet: "Stevenson Creek Advocacy Group",
        type: "article",
        url: "https://stevensoncreek.org/tommy-picks-up-trash/",
        publishedDate: "2025-02-01",
        excerpt:
          "500+ bags, 12,000+ bottles, and 10,000+ pounds removed from one Clearwater creek.",
        sortOrder: 5,
      },
    ]);
  } else {
    console.log("Press items already present — skipping.");
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
