import { Droplets, ExternalLink, Heart } from "lucide-react";
import Reveal from "./Reveal";
import { HOW_TO_HELP, PARTNERS, SOCIAL } from "@/lib/content";

export default function GetInvolved() {
  return (
    <section id="help" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Get involved
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            One person made a dent. Imagine all of us.
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            You don&apos;t need a kayak to help. Small, repeated choices keep more litter out
            of the water than any single cleanup ever could.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_TO_HELP.map((h, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <div className="h-full rounded-2xl border bg-surface p-6">
                <Droplets className="h-6 w-6 text-teal" />
                <h3 className="mt-3 font-semibold">{h.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{h.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Partners */}
        <Reveal delay={0.1}>
          <div className="mt-12 rounded-3xl border bg-surface p-7">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Heart className="h-5 w-5 text-primary" /> Support the groups doing the work
            </h3>
            <p className="mt-1 text-sm text-muted">
              Tommy partners with these local organizations. Volunteer, donate, or just learn
              more.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PARTNERS.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl bg-surface-muted px-4 py-3 transition hover:bg-primary/10"
                >
                  <span>
                    <span className="block font-medium group-hover:text-primary">
                      {p.name}
                    </span>
                    <span className="text-xs text-muted">{p.region}</span>
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted group-hover:text-primary" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Follow CTA */}
        <Reveal delay={0.15}>
          <div className="bg-water mt-6 flex flex-col items-start justify-between gap-5 rounded-3xl p-8 text-white sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-bold">Follow the count. Spread the word.</h3>
              <p className="mt-1 text-white/80">
                Every share puts more eyes on the water. Follow @{SOCIAL.handle}.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={SOCIAL.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-6 py-3 font-semibold text-[#06304a] transition hover:brightness-110"
              >
                Follow on X
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 px-6 py-3 font-semibold ring-1 ring-white/20 transition hover:bg-white/20"
              >
                Instagram
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
