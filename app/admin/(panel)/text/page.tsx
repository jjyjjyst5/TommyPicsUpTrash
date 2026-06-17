import SiteTextEditor from "@/components/admin/SiteTextEditor";
import { getSiteTextValues } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SiteTextAdminPage() {
  const values = await getSiteTextValues();
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Site Text</h1>
      <p className="mt-1 text-sm text-muted">
        Edit the headings and blurbs across the homepage — the hero at the top and every
        section&apos;s wording. Changes go live immediately. Clear a field to fall back to the
        original text. (The story itself lives under <strong>My Trash Story</strong>.)
      </p>
      <div className="mt-6">
        <SiteTextEditor values={values} />
      </div>
    </div>
  );
}
