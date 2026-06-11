"use client";

import { useState } from "react";
import { Radio, ChevronDown, ExternalLink } from "lucide-react";
import type { PressItem } from "@/db/schema";

/** Featured interview card with audio embed + expandable transcript. */
export default function PressFeature({ item }: { item: PressItem }) {
  const [open, setOpen] = useState(false);
  const hasTranscript = !!item.transcript && item.transcript.trim().length > 0;

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-primary/30 bg-surface shadow-sm">
      <div className="flex flex-col gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <Radio className="h-3.5 w-3.5" /> Radio interview
          </span>
          <h3 className="mt-3 text-2xl font-bold tracking-tight">{item.title}</h3>
          <p className="mt-1 text-sm text-muted">{item.outlet}</p>
          {item.excerpt && <p className="mt-3 max-w-2xl text-muted">{item.excerpt}</p>}
        </div>
      </div>

      {item.audioEmbedUrl && (
        <div className="px-7">
          <iframe
            src={item.audioEmbedUrl}
            title={item.title}
            className="h-32 w-full rounded-xl border"
            allow="autoplay; clipboard-write; encrypted-media"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 px-7 pb-7 pt-4">
        {hasTranscript && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-deep"
          >
            {open ? "Hide transcript" : "Read transcript"}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
          >
            Listen at {item.outlet.split("(")[0].trim()} <ExternalLink className="h-4 w-4" />
          </a>
        )}
        {!hasTranscript && !item.audioEmbedUrl && (
          <p className="text-sm italic text-muted">
            Audio &amp; transcript coming soon — check back shortly.
          </p>
        )}
      </div>

      {hasTranscript && open && (
        <div className="border-t bg-surface-muted px-7 py-6">
          <div className="prose-sm max-h-[480px] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {item.transcript}
          </div>
        </div>
      )}
    </div>
  );
}
