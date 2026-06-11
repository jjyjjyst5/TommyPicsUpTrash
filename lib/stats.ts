import { getDb, schema } from "@/db";
import type { WaterBody, Cleanup } from "@/db/schema";

export type WaterBodyStats = {
  body: WaterBody;
  bags: number;
  bottles: number;
  pounds: number;
};

export type Stats = {
  bodies: WaterBodyStats[];
  totals: { bags: number; bottles: number; pounds: number };
};

/** Weight for a single haul: explicit pounds if logged, else estimated. */
export function poundsFor(cleanup: Pick<Cleanup, "bags" | "pounds">, lbsPerBag: number): number {
  return cleanup.pounds ?? cleanup.bags * lbsPerBag;
}

/**
 * Derive all counters by summing cleanup rows per water body. Baselines are
 * just rows, so totals are always SUMs that grow as new hauls are logged.
 */
export async function getStats(): Promise<Stats> {
  const db = await getDb();
  const [bodies, cleanups] = await Promise.all([
    db.select().from(schema.waterBodies).orderBy(schema.waterBodies.sortOrder),
    db.select().from(schema.cleanups),
  ]);

  const byBody = new Map<number, Cleanup[]>();
  for (const c of cleanups) {
    const list = byBody.get(c.waterBodyId) ?? [];
    list.push(c);
    byBody.set(c.waterBodyId, list);
  }

  const bodyStats: WaterBodyStats[] = bodies.map((body) => {
    const rows = byBody.get(body.id) ?? [];
    const bags = rows.reduce((s, r) => s + r.bags, 0);
    const bottles = rows.reduce((s, r) => s + r.bottles, 0);
    const pounds = rows.reduce((s, r) => s + poundsFor(r, body.lbsPerBag), 0);
    return { body, bags, bottles, pounds: Math.round(pounds) };
  });

  return {
    bodies: bodyStats,
    totals: {
      bags: bodyStats.reduce((s, b) => s + b.bags, 0),
      bottles: bodyStats.reduce((s, b) => s + b.bottles, 0),
      pounds: bodyStats.reduce((s, b) => s + b.pounds, 0),
    },
  };
}
