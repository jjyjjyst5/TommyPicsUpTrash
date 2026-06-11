import HaulForm from "@/components/admin/HaulForm";
import { getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function HaulsPage() {
  const stats = await getStats();
  const bodies = stats.bodies.map((s) => ({
    id: s.body.id,
    name: s.body.name,
    slug: s.body.slug,
    currentBags: s.bags,
    currentBottles: s.bottles,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Log a haul</h1>
      <p className="mt-1 text-sm text-muted">
        Add a cleanup manually, or paste one of Tommy&apos;s tweets and let the parser pull
        the numbers. Every entry adds to the running totals.
      </p>
      <div className="mt-6">
        <HaulForm bodies={bodies} />
      </div>
    </div>
  );
}
