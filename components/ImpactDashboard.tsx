import { Trash2, Scale, Recycle, MapPin, CalendarDays, Ship } from "lucide-react";
import CountUp from "./CountUp";
import Reveal from "./Reveal";
import type { Stats, WaterBodyStats } from "@/lib/stats";
import type { SiteText } from "@/lib/siteText";

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

export default function ImpactDashboard({
  stats,
  text,
}: {
  stats: Stats;
  text: SiteText["impact"];
}) {
  return (
    <section id="impact" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {text.eyebrow}
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            {text.heading}
          </h2>
          <p className="mt-3 max-w-2xl text-muted">{text.intro}</p>
        </Reveal>

        {/* Per-water-body cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
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
