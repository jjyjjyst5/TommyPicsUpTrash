import WaterBodyForm from "@/components/admin/WaterBodyForm";
import { getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const stats = await getStats();
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Water bodies</h1>
      <p className="mt-1 text-sm text-muted">
        Edit the totals shown on the site (bags, bottles, estimated pounds), the
        pounds-per-bag estimate, kayak trips, and the description for each water body.
      </p>
      <div className="mt-6 space-y-5">
        {stats.bodies.map((s) => (
          <WaterBodyForm
            key={s.body.id}
            body={s.body}
            currentBags={s.bags}
            currentBottles={s.bottles}
          />
        ))}
      </div>
    </div>
  );
}
