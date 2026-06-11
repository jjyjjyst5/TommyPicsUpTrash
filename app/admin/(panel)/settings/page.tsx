import WaterBodyForm from "@/components/admin/WaterBodyForm";
import { getWaterBodies } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const bodies = await getWaterBodies();
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Water bodies</h1>
      <p className="mt-1 text-sm text-muted">
        Tune the description, the weight estimate (pounds per bag), kayak trips, and bottle
        estimate shown on each card.
      </p>
      <div className="mt-6 space-y-5">
        {bodies.map((b) => (
          <WaterBodyForm key={b.id} body={b} />
        ))}
      </div>
    </div>
  );
}
