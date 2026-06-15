"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { updateStory } from "@/app/actions/content";

function toParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export default function StoryEditor({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  const [state, action, pending] = useActionState(
    updateStory,
    null as { ok?: boolean; error?: string; message?: string } | null
  );
  const [draftHeading, setDraftHeading] = useState(heading);
  const [draftBody, setDraftBody] = useState(body);
  const paragraphs = toParagraphs(draftBody);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border bg-surface p-6 shadow-sm">
        <label className="block text-sm font-medium">Heading</label>
        <input
          name="heading"
          value={draftHeading}
          onChange={(e) => setDraftHeading(e.target.value)}
          className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
        />

        <label className="mt-4 block text-sm font-medium">Story</label>
        <textarea
          name="body"
          value={draftBody}
          onChange={(e) => setDraftBody(e.target.value)}
          rows={16}
          className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 leading-relaxed outline-none focus:border-primary"
        />
        <p className="mt-2 text-xs text-muted">
          Write naturally. Leave a <strong>blank line between paragraphs</strong> — the site
          formats them into clean, evenly-spaced text automatically. No HTML needed.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-deep disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save story"}
          </button>
          {state?.ok && (
            <span className="inline-flex items-center gap-1.5 text-sm text-teal">
              <CheckCircle2 className="h-4 w-4" /> {state.message}
            </span>
          )}
          {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
        </div>
      </div>

      {/* Live preview — mirrors how the section renders on the site */}
      <div className="rounded-3xl border bg-surface p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal">Live preview</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight">
          {draftHeading || "Your heading"}
        </h3>
        <div className="mt-4 space-y-4">
          {paragraphs.length === 0 ? (
            <p className="text-sm italic text-muted">Start typing to see the preview…</p>
          ) : (
            paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed text-muted">
                {p}
              </p>
            ))
          )}
        </div>
      </div>
    </form>
  );
}
