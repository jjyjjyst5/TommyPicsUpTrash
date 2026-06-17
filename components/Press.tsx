import { ExternalLink, Newspaper, Tv, Radio } from "lucide-react";
import Reveal from "./Reveal";
import PressFeature from "./PressFeature";
import type { PressItem } from "@/db/schema";
import type { SiteText } from "@/lib/siteText";

const TYPE_ICON: Record<string, React.ReactNode> = {
  article: <Newspaper className="h-4 w-4" />,
  tv: <Tv className="h-4 w-4" />,
  radio: <Radio className="h-4 w-4" />,
};

export default function Press({
  items,
  text,
}: {
  items: PressItem[];
  text: SiteText["press"];
}) {
  const featured = items.find((i) => i.type === "radio");
  const rest = items.filter((i) => i.id !== featured?.id);

  return (
    <section id="press" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            {text.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{text.heading}</h2>
          <p className="mt-3 max-w-2xl text-muted">{text.intro}</p>
        </Reveal>

        {featured && (
          <Reveal delay={0.05}>
            <div className="mt-10">
              <PressFeature item={featured} />
            </div>
          </Reveal>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((item, i) => (
            <Reveal key={item.id} delay={0.05 * (i % 3)}>
              <a
                href={item.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border bg-surface p-6 transition hover:border-primary/40 hover:shadow-md"
              >
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
                  {TYPE_ICON[item.type] ?? TYPE_ICON.article} {item.outlet}
                </span>
                <h3 className="mt-3 flex-1 font-semibold leading-snug group-hover:text-primary">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.excerpt}</p>
                )}
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Read more <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
