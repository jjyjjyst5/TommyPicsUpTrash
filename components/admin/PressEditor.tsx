"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Trash2, Plus, Radio, ChevronDown } from "lucide-react";
import {
  updatePressItem,
  addPressItem,
  deletePressItem,
} from "@/app/actions/press";
import type { PressItem } from "@/db/schema";

const TYPES = [
  { value: "article", label: "Article" },
  { value: "tv", label: "TV" },
  { value: "radio", label: "Radio" },
];

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-primary"
      />
    </div>
  );
}

function ItemEditor({ item }: { item: PressItem }) {
  const [open, setOpen] = useState(item.type === "radio");
  const [state, action, pending] = useActionState(
    updatePressItem,
    null as { ok?: boolean; error?: string; message?: string } | null
  );
  const isRadio = item.type === "radio";

  return (
    <div className={`rounded-2xl border bg-surface ${isRadio ? "border-primary/40" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 font-semibold">
          {isRadio && <Radio className="h-4 w-4 text-primary" />}
          {item.title}
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-normal text-muted">
            {item.outlet}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <form action={action} className="space-y-4 border-t px-5 py-5">
          <input type="hidden" name="id" value={item.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" name="title" defaultValue={item.title} />
            <Field label="Outlet" name="outlet" defaultValue={item.outlet} />
            <div>
              <label className="block text-sm font-medium">Type</label>
              <select
                name="type"
                defaultValue={item.type}
                className="mt-1 w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-primary"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Link URL" name="url" defaultValue={item.url} placeholder="https://…" />
          </div>
          <Field label="Excerpt" name="excerpt" defaultValue={item.excerpt} />

          {isRadio && (
            <>
              <Field
                label="Audio embed URL"
                name="audioEmbedUrl"
                defaultValue={item.audioEmbedUrl}
                placeholder="e.g. an Audacy / Omny / SoundCloud embed src"
              />
              <div>
                <label className="block text-sm font-medium">Transcript</label>
                <textarea
                  name="transcript"
                  defaultValue={item.transcript ?? ""}
                  rows={10}
                  placeholder="Paste the KDKA interview transcript here…"
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-primary"
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-3">
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
            <form action={deletePressItem.bind(null, item.id)} className="ml-auto">
              <button className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </form>
          </div>
        </form>
      )}
    </div>
  );
}

function AddItem() {
  const [state, action, pending] = useActionState(
    addPressItem,
    null as { ok?: boolean; error?: string } | null
  );
  return (
    <form action={action} className="rounded-2xl border border-dashed bg-surface p-5">
      <h3 className="flex items-center gap-2 font-semibold">
        <Plus className="h-4 w-4 text-primary" /> Add coverage
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Title" name="title" placeholder="Headline" />
        <Field label="Outlet" name="outlet" placeholder="e.g. KDKA-TV" />
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select
            name="type"
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-primary"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <Field label="Link URL" name="url" placeholder="https://…" />
        <div className="sm:col-span-2">
          <Field label="Excerpt" name="excerpt" />
        </div>
      </div>
      <button
        disabled={pending}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add"}
      </button>
      {state?.error && <span className="ml-3 text-sm text-red-600">{state.error}</span>}
    </form>
  );
}

export default function PressEditor({ items }: { items: PressItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <ItemEditor key={item.id} item={item} />
      ))}
      <AddItem />
    </div>
  );
}
