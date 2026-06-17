import { Sparkles, ExternalLink } from "lucide-react";
import Reveal from "./Reveal";
import { buildEmbedUrl, isPortraitEmbed } from "@/lib/media";
import type { CrazyFind } from "@/db/schema";
import type { SiteText } from "@/lib/siteText";

function FindMedia({ find }: { find: CrazyFind }) {
  const portrait = find.mediaType === "embed" && isPortraitEmbed(find.mediaUrl);
  const aspect = portrait ? "aspect-[9/16]" : "aspect-video";

  if (find.mediaType === "image") {
    return (
      <div className="overflow-hidden bg-surface-muted">
        {/* No fixed aspect ratio — show the full photo (portrait or landscape) uncropped, like the Gallery. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={find.mediaUrl} alt={find.title} className="w-full object-cover" loading="lazy" />
      </div>
    );
  }
  if (find.mediaType === "video") {
    return (
      <div className="aspect-video overflow-hidden bg-black">
        <video controls preload="metadata" className="h-full w-full object-contain">
          <source src={find.mediaUrl} />
        </video>
      </div>
    );
  }
  if (find.mediaType === "embed") {
    const src = buildEmbedUrl(find.mediaUrl) ?? find.mediaUrl;
    return (
      <div className={`${aspect} overflow-hidden bg-black`}>
        <iframe
          src={src}
          title={find.title}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  // link fallback
  return (
    <a
      href={find.mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-water flex aspect-video items-center justify-center text-white/90 transition hover:brightness-110"
    >
      <span className="inline-flex items-center gap-2 font-semibold">
        View media <ExternalLink className="h-4 w-4" />
      </span>
    </a>
  );
}

export default function CrazyFinds({
  finds,
  text,
}: {
  finds: CrazyFind[];
  text: SiteText["finds"];
}) {
  if (finds.length === 0) return null; // hide section until Tommy adds finds

  return (
    <section id="finds" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-teal">
            <Sparkles className="h-4 w-4" /> {text.eyebrow}
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            {text.heading}
          </h2>
          <p className="mt-3 max-w-2xl text-muted">{text.intro}</p>
        </Reveal>

        <div className="mt-10 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {finds.map((find, i) => (
            <Reveal key={find.id} delay={0.05 * (i % 3)}>
              <figure className="overflow-hidden rounded-2xl border bg-surface shadow-sm">
                <FindMedia find={find} />
                <figcaption className="p-5">
                  <h3 className="font-semibold">{find.title}</h3>
                  {find.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{find.description}</p>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
