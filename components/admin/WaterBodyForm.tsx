"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { updateWaterBody } from "@/app/actions/waterBodies";
import type { WaterBody } from "@/db/schema";

export default function WaterBodyForm({ body }: { body: WaterBody }) {
  const [state, action, pending] = useActionState(
    updateWaterBody,
    null as { ok?: boolean; error?: string; message?: string } | null
  );

  return (
    <form action={action} className="rounded-2xl border bg-surface p-6 shadow-sm">
      <input type="hidden" name="id" value={body.id} />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{body.name}</h2>
        <span className="text-xs text-muted">{body.location}</span>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">Blurb</label>
        <textarea
          name="blurb"
          defaultValue={body.blurb}
          rows={3}
          className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Pounds per bag</label>
          <input
            type="number"
            name="lbsPerBag"
            min={1}
            step="0.5"
            defaultValue={body.lbsPerBag}
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
          />
          <p className="mt-1 text-xs text-muted">Used to estimate pounds when a haul has no weighed amount.</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Kayak trips</label>
          <input
            type="number"
            name="kayakTrips"
            min={0}
            defaultValue={body.kayakTrips}
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        Bag &amp; bottle totals come from logged hauls — add or edit them under{" "}
        <strong>Log a haul</strong>.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <button
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-deep disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {state?.ok && (
          <span className="inline-flex items-center gap-1.5 text-sm text-teal">
            <CheckCircle2 className="h-4 w-4" /> {state.message}
          </span>
        )}
        {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
