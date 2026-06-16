"use client";

import { useActionState } from "react";
import { Plus, Trash2, CheckCircle2, Film, ImageIcon, Link2 } from "lucide-react";
import { addFind, updateFind, deleteFind } from "@/app/actions/finds";
import { compressFormImage } from "@/lib/imageCompress";
import type { CrazyFind } from "@/db/schema";

type Result = { ok?: boolean; error?: string; message?: string } | null;

/** Wrap a finds action so any uploaded image is shrunk in-browser first. */
async function withCompression(
  fn: (prev: Result, fd: FormData) => Promise<Result>,
  prev: Result,
  fd: FormData
): Promise<Result> {
  await compressFormImage(fd);
  return fn(prev, fd);
}

function MediaInputs() {
  return (
    <>
      <div>
        <label className="block text-sm font-medium">Upload photo or short video</label>
        <input
          type="file"
          name="file"
          accept="image/*,video/*"
          className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-white"
        />
        <p className="mt-1 text-xs text-muted">
          Photos are optimized automatically. For videos, use a link below.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium">…or paste a media link</label>
        <input
          name="mediaUrl"
          placeholder="YouTube, Instagram, X, TikTok, Vimeo, or a direct image/.mp4 URL"
          className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
        />
        <p className="mt-1 text-xs text-muted">Best for videos — links embed automatically.</p>
      </div>
    </>
  );
}

function TypeChip({ type }: { type: string }) {
  const Icon = type === "video" ? Film : type === "image" ? ImageIcon : Link2;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted">
      <Icon className="h-3 w-3" /> {type}
    </span>
  );
}

function FindRow({ find }: { find: CrazyFind }) {
  const [state, action, pending] = useActionState(
    (prev: Result, fd: FormData) => withCompression(updateFind, prev, fd),
    null as Result
  );
  return (
    <div className="rounded-2xl border bg-surface p-5">
      <div className="flex items-start gap-4">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
          {find.mediaType === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={find.mediaUrl} alt={find.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <TypeChip type={find.mediaType} />
            </div>
          )}
        </div>
        <form action={action} className="flex-1">
          <input type="hidden" name="id" value={find.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="title"
              defaultValue={find.title}
              placeholder="Title"
              className="rounded-xl border bg-background px-3 py-2 outline-none focus:border-primary"
            />
            <input
              type="number"
              name="sortOrder"
              defaultValue={find.sortOrder}
              title="Sort order (lower shows first)"
              className="rounded-xl border bg-background px-3 py-2 outline-none focus:border-primary"
            />
          </div>
          <textarea
            name="description"
            defaultValue={find.description}
            rows={2}
            placeholder="Description"
            className="mt-3 w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-primary"
          />
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-muted">Replace media</summary>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <MediaInputs />
            </div>
          </details>
          <div className="mt-3 flex items-center gap-3">
            <button
              disabled={pending}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-deep disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            {state?.ok && (
              <span className="inline-flex items-center gap-1 text-sm text-teal">
                <CheckCircle2 className="h-4 w-4" /> {state.message}
              </span>
            )}
            {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
            <button
              formAction={deleteFind.bind(null, find.id)}
              className="ml-auto inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FindsManager({ finds }: { finds: CrazyFind[] }) {
  const [state, action, pending] = useActionState(
    (prev: Result, fd: FormData) => withCompression(addFind, prev, fd),
    null as Result
  );
  return (
    <div className="space-y-8">
      <form action={action} className="rounded-3xl border bg-surface p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-semibold">
          <Plus className="h-4 w-4 text-primary" /> Add a find
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Title</label>
            <input
              name="title"
              placeholder="e.g. A traffic cone, a Waylon Jennings CD, a whole tire…"
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows={2}
              placeholder="The story behind it"
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>
          <MediaInputs />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            disabled={pending}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-deep disabled:opacity-60"
          >
            {pending ? "Adding…" : "Add find"}
          </button>
          {state?.ok && (
            <span className="inline-flex items-center gap-1.5 text-sm text-teal">
              <CheckCircle2 className="h-4 w-4" /> {state.message}
            </span>
          )}
          {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
        </div>
      </form>

      <div>
        <h2 className="text-lg font-semibold">
          Finds <span className="text-muted">({finds.length})</span>
        </h2>
        {finds.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed bg-surface p-8 text-center text-muted">
            No finds yet. Add the first one above.
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {finds.map((f) => (
              <FindRow key={f.id} find={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
