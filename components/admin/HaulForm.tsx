"use client";

import { useActionState, useMemo, useState } from "react";
import { ClipboardPaste, PenLine, Sparkles, CheckCircle2 } from "lucide-react";
import { addHaul } from "@/app/actions/hauls";
import { parseTweet } from "@/lib/parseTweet";

type Body = {
  id: number;
  name: string;
  slug: string;
  currentBags: number;
  currentBottles: number;
};

const TODAY = new Date().toISOString().slice(0, 10);

export default function HaulForm({ bodies }: { bodies: Body[] }) {
  const [mode, setMode] = useState<"manual" | "tweet">("manual");
  const [state, action, pending] = useActionState(
    addHaul,
    null as { ok?: boolean; error?: string; message?: string } | null
  );

  // Controlled fields so the tweet parser can populate them.
  const [waterBodyId, setWaterBodyId] = useState<string>(String(bodies[0]?.id ?? ""));
  const [date, setDate] = useState(TODAY);
  const [bags, setBags] = useState("");
  const [bottles, setBottles] = useState("");
  const [pounds, setPounds] = useState("");
  const [notes, setNotes] = useState("");
  const [tweetUrl, setTweetUrl] = useState("");
  const [source, setSource] = useState("manual");

  const [tweetText, setTweetText] = useState("");
  const parsed = useMemo(() => (tweetText.trim() ? parseTweet(tweetText) : null), [tweetText]);

  const matchedBody = useMemo(
    () => (parsed?.bodySlug ? bodies.find((b) => b.slug === parsed.bodySlug) : undefined),
    [parsed, bodies]
  );

  // Cumulative "Nth bag" → how many to add given what's already logged.
  const reconciliation = useMemo(() => {
    if (!parsed?.cumulativeBags || !matchedBody) return null;
    const delta = parsed.cumulativeBags - matchedBody.currentBags;
    return { delta, milestone: parsed.cumulativeBags, current: matchedBody.currentBags };
  }, [parsed, matchedBody]);

  function applyParsed() {
    if (!parsed) return;
    if (matchedBody) setWaterBodyId(String(matchedBody.id));
    if (reconciliation) {
      setBags(String(Math.max(0, reconciliation.delta)));
    } else if (parsed.bags != null) {
      setBags(String(parsed.bags));
    }
    if (parsed.bottles != null) setBottles(String(parsed.bottles));
    setSource("tweet");
    setMode("manual");
  }

  return (
    <div className="rounded-3xl border bg-surface p-6 shadow-sm">
      {/* Mode toggle */}
      <div className="mb-6 inline-flex rounded-xl bg-surface-muted p-1">
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
            mode === "manual" ? "bg-surface shadow-sm" : "text-muted"
          }`}
        >
          <PenLine className="h-4 w-4" /> Manual entry
        </button>
        <button
          type="button"
          onClick={() => setMode("tweet")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
            mode === "tweet" ? "bg-surface shadow-sm" : "text-muted"
          }`}
        >
          <ClipboardPaste className="h-4 w-4" /> Paste a tweet
        </button>
      </div>

      {/* Tweet parser panel */}
      {mode === "tweet" && (
        <div className="mb-6">
          <label className="block text-sm font-medium">Paste the tweet or caption</label>
          <textarea
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            rows={4}
            placeholder="e.g. Today, I removed my 700th bag of litter from Pittsburgh's Ohio River…"
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
          />
          <input
            value={tweetUrl}
            onChange={(e) => setTweetUrl(e.target.value)}
            placeholder="Optional: link to the tweet"
            className="mt-2 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />

          {parsed && (
            <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" /> What we found
              </div>
              <ul className="mt-2 space-y-1 text-sm text-foreground/80">
                {parsed.matched.map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
              {reconciliation && (
                <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-sm">
                  Milestone <strong>{reconciliation.milestone}</strong> vs{" "}
                  <strong>{reconciliation.current}</strong> already logged →{" "}
                  {reconciliation.delta > 0 ? (
                    <span>
                      adds <strong>{reconciliation.delta}</strong> bags.
                    </span>
                  ) : (
                    <span className="text-muted">
                      already at or past this milestone (adds 0). Edit below if needed.
                    </span>
                  )}
                </p>
              )}
              <button
                type="button"
                onClick={applyParsed}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-deep"
              >
                Apply to form ↓
              </button>
            </div>
          )}
        </div>
      )}

      {/* The form (shared by both modes) */}
      <form action={action} className="grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="source" value={source} />
        <input type="hidden" name="tweetUrl" value={tweetUrl} />

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Water body</label>
          <select
            name="waterBodyId"
            value={waterBodyId}
            onChange={(e) => setWaterBodyId(e.target.value)}
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
          >
            {bodies.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.currentBags} bags logged
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Bags</label>
          <input
            type="number"
            name="bags"
            min={0}
            value={bags}
            onChange={(e) => setBags(e.target.value)}
            placeholder="0"
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Bottles</label>
          <input
            type="number"
            name="bottles"
            min={0}
            value={bottles}
            onChange={(e) => setBottles(e.target.value)}
            placeholder="0"
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Pounds <span className="font-normal text-muted">(optional — else estimated)</span>
          </label>
          <input
            type="number"
            name="pounds"
            min={0}
            value={pounds}
            onChange={(e) => setPounds(e.target.value)}
            placeholder="auto"
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Notes</label>
          <input
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. + 2 boat bumpers, a milk crate"
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>

        <div className="sm:col-span-2 flex items-center gap-3">
          <button
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-deep disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save haul"}
          </button>
          {state?.ok && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal">
              <CheckCircle2 className="h-4 w-4" /> {state.message}
            </span>
          )}
          {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
        </div>
      </form>
    </div>
  );
}
