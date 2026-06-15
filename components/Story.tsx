import Reveal from "./Reveal";
import { TIMELINE } from "@/lib/content";

/** Split editable copy into clean paragraphs: blank line = new paragraph. */
function toParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export default function Story({ heading, body }: { heading: string; body: string }) {
  const paragraphs = toParagraphs(body);
  return (
    <section id="story" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-widest text-teal">
                His story
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                {heading}
              </h2>
            </Reveal>
            <div className="mt-6 space-y-5">
              {paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p className="leading-relaxed text-muted">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <Reveal>
              <ol className="relative border-l-2 border-border pl-6">
                {TIMELINE.map((t, i) => (
                  <li key={i} className="mb-8 last:mb-0">
                    <span className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full bg-primary ring-4 ring-surface" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {t.date}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold">{t.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{t.body}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
