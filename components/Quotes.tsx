import { Quote } from "lucide-react";
import Reveal from "./Reveal";
import { QUOTES } from "@/lib/content";

export default function Quotes() {
  const [featured, ...rest] = QUOTES;
  return (
    <section className="bg-water py-20 text-white md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <Quote className="h-10 w-10 text-accent" />
          <blockquote className="mt-4 max-w-4xl text-3xl font-semibold leading-snug tracking-tight md:text-5xl">
            “{featured.text}”
          </blockquote>
          {featured.context && (
            <p className="mt-4 text-white/70">— Tom Ross, {featured.context}</p>
          )}
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {rest.map((q, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <figure className="h-full rounded-2xl bg-white/10 p-6 ring-1 ring-white/15">
                <blockquote className="text-lg font-medium leading-relaxed">
                  “{q.text}”
                </blockquote>
                {q.context && (
                  <figcaption className="mt-3 text-sm text-white/60">{q.context}</figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
