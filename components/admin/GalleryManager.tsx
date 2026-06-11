"use client";

import { useActionState } from "react";
import { Upload, Trash2, CheckCircle2 } from "lucide-react";
import { uploadGalleryImage, deleteGalleryImage } from "@/app/actions/gallery";
import type { GalleryImage } from "@/db/schema";

export default function GalleryManager({
  images,
  bodies,
}: {
  images: GalleryImage[];
  bodies: { id: number; name: string }[];
}) {
  const [state, action, pending] = useActionState(
    uploadGalleryImage,
    null as { ok?: boolean; error?: string; message?: string } | null
  );

  return (
    <div className="space-y-8">
      <form
        action={action}
        className="grid gap-4 rounded-3xl border bg-surface p-6 shadow-sm sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Image file</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-white"
          />
          <p className="mt-1 text-xs text-muted">JPG, PNG, or WebP up to 8&nbsp;MB.</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Caption</label>
          <input
            name="caption"
            placeholder="What's happening in the photo"
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Water body (optional)</label>
          <select
            name="waterBodyId"
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
          >
            <option value="">— None —</option>
            {bodies.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 flex items-center gap-3">
          <button
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-deep disabled:opacity-60"
          >
            <Upload className="h-4 w-4" /> {pending ? "Uploading…" : "Upload photo"}
          </button>
          {state?.ok && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal">
              <CheckCircle2 className="h-4 w-4" /> {state.message}
            </span>
          )}
          {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
        </div>
      </form>

      <div>
        <h2 className="text-lg font-semibold">
          Photos <span className="text-muted">({images.length})</span>
        </h2>
        {images.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed bg-surface p-8 text-center text-muted">
            No photos yet. Upload the first one above.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-2xl border bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.caption} className="aspect-square w-full object-cover" />
                <div className="flex items-center justify-between gap-2 p-3">
                  <span className="truncate text-xs text-muted">{img.caption || "—"}</span>
                  <form action={deleteGalleryImage.bind(null, img.id)}>
                    <button className="text-red-600 hover:text-red-700" aria-label="Delete photo">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
