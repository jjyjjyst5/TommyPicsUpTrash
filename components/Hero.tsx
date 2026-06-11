import { ArrowDown, Trash2, Scale } from "lucide-react";
import CountUp from "./CountUp";
import { HERO, SOCIAL } from "@/lib/content";
import type { Stats } from "@/lib/stats";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IGIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.07 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.38 5.86 5.86 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m7.85-10.41a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0" />
    </svg>
  );
}

export default function Hero({ stats }: { stats: Stats }) {
  return (
    <section id="top" className="bg-water relative overflow-hidden text-white">
      {/* Floating ambient bubbles */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="float-soft absolute left-[12%] top-[28%] h-3 w-3 rounded-full bg-white/40" />
        <div className="float-soft absolute left-[78%] top-[22%] h-2 w-2 rounded-full bg-white/30 [animation-delay:1.5s]" />
        <div className="float-soft absolute left-[60%] top-[60%] h-4 w-4 rounded-full bg-white/20 [animation-delay:.8s]" />
        <div className="float-soft absolute left-[30%] top-[68%] h-2 w-2 rounded-full bg-white/30 [animation-delay:2s]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-40 pt-36 md:pt-44">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent ring-1 ring-white/15">
          {HERO.eyebrow}
        </p>
        <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          {HERO.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
          {HERO.subtitle}
        </p>

        {/* Headline counters */}
        <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-accent">
              <Trash2 className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Bags hauled
              </span>
            </div>
            <CountUp
              value={stats.totals.bags}
              className="mt-2 block text-4xl font-bold tabular-nums md:text-5xl"
            />
          </div>
          <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-accent">
              <Scale className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Est. pounds removed
              </span>
            </div>
            <CountUp
              value={stats.totals.pounds}
              className="mt-2 block text-4xl font-bold tabular-nums md:text-5xl"
            />
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#impact"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-[#06304a] transition hover:brightness-110"
          >
            See the impact <ArrowDown className="h-4 w-4" />
          </a>
          <a
            href={SOCIAL.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 font-medium ring-1 ring-white/20 transition hover:bg-white/20"
          >
            <XIcon className="h-4 w-4" /> Follow on X
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 font-medium ring-1 ring-white/20 transition hover:bg-white/20"
          >
            <IGIcon className="h-4 w-4" /> Instagram
          </a>
        </div>
      </div>

      {/* Animated layered waves */}
      <div className="absolute bottom-0 left-0 right-0 leading-[0]">
        <svg
          className="wave-line h-[80px] w-[200%] md:h-[120px]"
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C300,90 600,0 900,40 C1200,80 1500,10 1800,45 C2100,80 2300,40 2400,40 L2400,120 L0,120 Z"
            fill="var(--background)"
            opacity="0.55"
          />
          <path
            d="M0,70 C300,30 600,100 900,70 C1200,40 1500,100 1800,65 C2100,35 2300,80 2400,70 L2400,120 L0,120 Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  );
}
