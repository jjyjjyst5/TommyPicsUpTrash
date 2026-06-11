import { Camera, ImageIcon } from "lucide-react";
import Reveal from "./Reveal";
import { SOCIAL } from "@/lib/content";
import type { GalleryImage } from "@/db/schema";

const PLACEHOLDERS = [
  "On the water at first light",
  "Another bag, another bottle",
  "The haul, hauled out",
  "Wildlife worth fighting for",
  "Barriers catching the flow",
  "What a clean bank looks like",
];

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const hasImages = images.length > 0;

  return (
    <section id="gallery" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            From the water
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            The view from the kayak
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            {hasImages
              ? "Real photos from Tommy's cleanups — the hauls, the river, and the wildlife that depends on it."
              : "Tommy's real cleanup photos will live here. Until they're uploaded, follow along on social for the daily view from the water."}
          </p>
        </Reveal>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {hasImages
            ? images.map((img) => (
                <figure
                  key={img.id}
                  className="break-inside-avoid overflow-hidden rounded-2xl border bg-surface shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.caption || "Cleanup photo"}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                  {img.caption && (
                    <figcaption className="px-4 py-3 text-sm text-muted">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))
            : PLACEHOLDERS.map((caption, i) => (
                <div
                  key={i}
                  className="bg-water flex break-inside-avoid flex-col items-center justify-center rounded-2xl p-8 text-center text-white/80"
                  style={{ height: `${180 + (i % 3) * 60}px` }}
                >
                  <ImageIcon className="h-8 w-8 text-accent" />
                  <p className="mt-3 text-sm font-medium">{caption}</p>
                </div>
              ))}
        </div>

        <div className="mt-10">
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-deep"
          >
            <Camera className="h-4 w-4" /> See more on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
