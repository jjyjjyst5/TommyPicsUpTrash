import Link from "next/link";
import { Trash2, Scale, Recycle, PlusCircle } from "lucide-react";
import { getStats } from "@/lib/stats";
import { getRecentCleanups, getWaterBodies } from "@/lib/data";
import { deleteHaul } from "@/app/actions/hauls";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, recent, bodies] = await Promise.all([
    getStats(),
    getRecentCleanups(12),
    getWaterBodies(),
  ]);
  const bodyName = (id: number) => bodies.find((b) => b.id === id)?.name ?? "—";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Live totals across every water body.</p>
        </div>
        <Link
          href="/admin/hauls"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-deep"
        >
          <PlusCircle className="h-4 w-4" /> Log a haul
        </Link>
      </div>

      {/* Grand totals */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Tile icon={<Trash2 />} label="Total bags" value={stats.totals.bags} />
        <Tile icon={<Scale />} label="Est. pounds" value={stats.totals.pounds} />
        <Tile icon={<Recycle />} label="Bottles" value={stats.totals.bottles} />
      </div>

      {/* Per body */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {stats.bodies.map((s) => (
          <div key={s.body.id} className="rounded-2xl border bg-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{s.body.name}</h2>
              <span className="text-xs text-muted">{s.body.location}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Mini label="Bags" value={s.bags} />
              <Mini label="Lbs" value={s.pounds} />
              <Mini label="Bottles" value={s.bottles} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent hauls */}
      <h2 className="mt-10 text-lg font-semibold">Recent hauls</h2>
      <div className="mt-3 overflow-hidden rounded-2xl border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Water body</th>
              <th className="px-4 py-3 text-right">Bags</th>
              <th className="px-4 py-3 text-right">Bottles</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {recent.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3">{c.date}</td>
                <td className="px-4 py-3">{bodyName(c.waterBodyId)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.bags}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.bottles}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs">
                    {c.source}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteHaul.bind(null, c.id)}>
                    <button
                      className="text-xs text-red-600 hover:underline"
                      aria-label="Delete haul"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No hauls logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-surface p-5">
      <div className="flex items-center gap-2 text-primary [&>svg]:h-5 [&>svg]:w-5">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
        </span>
      </div>
      <div className="mt-2 text-3xl font-bold tabular-nums">
        {value.toLocaleString("en-US")}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-surface-muted py-2">
      <div className="text-lg font-bold tabular-nums">{value.toLocaleString("en-US")}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}
