import GalleryManager from "@/components/admin/GalleryManager";
import { getGallery, getWaterBodies } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const [images, bodies] = await Promise.all([getGallery(), getWaterBodies()]);
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Gallery</h1>
      <p className="mt-1 text-sm text-muted">
        Upload Tommy&apos;s real cleanup photos. They appear in the public gallery right away.
      </p>
      <div className="mt-6">
        <GalleryManager
          images={images}
          bodies={bodies.map((b) => ({ id: b.id, name: b.name }))}
        />
      </div>
    </div>
  );
}
