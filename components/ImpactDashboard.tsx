import { Trash2, Scale, Recycle, MapPin, CalendarDays, Ship } from "lucide-react";
import CountUp from "./CountUp";
import Reveal from "./Reveal";
import type { Stats, WaterBodyStats } from "@/lib/stats";

function sinceYear(date: string | null) {
  if (!date) return null;
  return date.slice(0, 4);
}

function BodyCard({ s }: { s: WaterBodyStats }) {
  const accent = s.body.accentColor;
  return (
    <div
      className="relative overflow-hidden rounded-3xl border bg-surface p-7 shadow-sm"
      style={{ borderColor: `${accent}33` }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">{s.body.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4" /> {s.body.location}
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: `${accent}1a`, color: accent }}
        >
          {sinceYear(s.body.startDate) ? `Since ${sinceYear(s.body.startDate)}` : "Active"}
        </span>
      </div>

      {s.body.blurb && (
        <p className="mt-4 text-sm leading-relaxed text-muted">{s.body.blurb}</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Stat
          icon={<Trash2 className="h-5 w-5" />}
          label="Bags"
          value={s.bags}
          accent={accent}
        />
        <Stat
          icon={<Scale className="h-5 w-5" />}
          label="Est. pounds"
          value={s.pounds}
          accent={accent}
        />
        <Stat
          icon={<Recycle className="h-5 w-5" />}
          label="Bottles"
          value={s.bottles}
          accent={accent}
        />
        <Stat
          icon={<Ship className="h-5 w-5" />}
          label="Kayak trips"
          value={s.body.kayakTrips}
          accent={accent}
        />
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl bg-surface-muted p-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
        <span style={{ color: accent }}>{icon}</span>
        {label}
      </div>
      <CountUp value={value} className="mt-1 block text-3xl font-bold tabular-nums" />
    </div>
  );
}

export default function ImpactDashboard({ stats }: { stats: Stats }) {
  return (
    <section id="impact" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            The running count
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Every bag, counted. Every pound, estimated from the haul.
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Totals update as Tommy logs each cleanup. Pounds are estimated at{" "}
            <strong>~20 lbs per bag</strong> — grounded in his own field numbers — unless a
            weighed amount is recorded.
          </p>
        </Reveal>

        {/* Grand totals band */}
        <Reveal delay={0.05}>
          <div className="mt-10 grid gap-4 rounded-3xl bg-water p-8 text-white sm:grid-cols-3">
            <GrandStat label="Total bags hauled" value={stats.totals.bags} />
            <GrandStat label="Est. pounds removed" value={stats.totals.pounds} />
            <GrandStat label="Plastic bottles" value={stats.totals.bottles} />
          </div>
        </Reveal>

        {/* Per-water-body cards */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {stats.bodies.map((s, i) => (
            <Reveal key={s.body.id} delay={0.08 * (i + 1)}>
              <BodyCard s={s} />
            </Reveal>
          ))}
        </div>

        <p className="mt-6 flex items-center gap-2 text-xs text-muted">
          <CalendarDays className="h-4 w-4" />
          Counts reflect logged hauls to date and grow with each new cleanup.
        </p>
      </div>
    </section>
  );
}

function GrandStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center sm:text-left">
      <CountUp
        value={value}
        className="block text-4xl font-bold tabular-nums md:text-5xl"
      />
      <div className="mt-1 text-sm font-medium uppercase tracking-wide text-white/70">
        {label}
      </div>
    </div>
  );
}
