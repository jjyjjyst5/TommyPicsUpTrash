"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { updateSiteText } from "@/app/actions/content";
import { SITE_TEXT_GROUPS } from "@/lib/siteText";

type Result = { ok?: boolean; error?: string; message?: string } | null;

export default function SiteTextEditor({ values }: { values: Record<string, string> }) {
  const [state, action, pending] = useActionState(updateSiteText, null as Result);

  return (
    <form action={action} className="space-y-6">
      {SITE_TEXT_GROUPS.map((group) => (
        <fieldset key={group.id} className="rounded-3xl border bg-surface p-6 shadow-sm">
          <legend className="px-1 text-sm font-semibold text-primary">{group.label}</legend>
          <div className="mt-2 space-y-4">
            {group.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium" htmlFor={field.key}>
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.key}
                    name={field.key}
                    defaultValue={values[field.key] ?? ""}
                    rows={3}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 leading-relaxed outline-none focus:border-primary"
                  />
                ) : (
                  <input
                    id={field.key}
                    name={field.key}
                    defaultValue={values[field.key] ?? ""}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
                  />
                )}
                {field.hint && <p className="mt-1 text-xs text-muted">{field.hint}</p>}
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      {/* Sticky save bar so the button is reachable from any section */}
      <div className="sticky bottom-4 flex items-center gap-3 rounded-2xl border bg-surface/95 px-4 py-3 shadow-lg backdrop-blur">
        <button
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-deep disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save all text"}
        </button>
        {state?.ok && (
          <span className="inline-flex items-center gap-1.5 text-sm text-teal">
            <CheckCircle2 className="h-4 w-4" /> {state.message}
          </span>
        )}
        {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
        <span className="ml-auto text-xs text-muted">Leave a field blank to use the original wording.</span>
      </div>
    </form>
  );
}
