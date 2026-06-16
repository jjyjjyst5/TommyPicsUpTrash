/**
 * Browser-side image downscaling/compression. Runs before an upload is sent so
 * large phone photos (often 5–12 MB) are shrunk to web-friendly size and never
 * hit the server's upload limit. Non-images (e.g. video files) pass through
 * untouched, and anything that can't be decoded falls back to the original.
 */

const MAX_DIM = 2000; // longest edge, px
const QUALITY = 0.82;

export async function compressImage(file: File): Promise<File> {
  if (typeof document === "undefined") return file;
  if (!file.type.startsWith("image/")) return file;
  // GIFs would lose animation if re-encoded; leave them alone.
  if (file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const scale = Math.min(1, MAX_DIM / Math.max(width, height));
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY)
    );
    if (!blob) return file;
    // If re-encoding didn't help (already small & no downscale), keep original.
    if (scale === 1 && blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file; // unsupported format (e.g. HEIC on some browsers) — send as-is
  }
}

/** Replace an image file in a FormData with its compressed version, in place. */
export async function compressFormImage(formData: FormData, field = "file") {
  const f = formData.get(field);
  if (f instanceof File && f.size > 0 && f.type.startsWith("image/")) {
    formData.set(field, await compressImage(f));
  }
}
