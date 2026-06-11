import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Save an uploaded image and return its public URL.
 *
 * Production -> Vercel Blob (set BLOB_READ_WRITE_TOKEN).
 * Local dev  -> writes to /public/uploads and serves from there.
 */
export async function saveImage(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeBase = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9-_]/gi, "-")
    .slice(0, 40);
  const filename = `${Date.now()}-${safeBase || "image"}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`gallery/${filename}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}
