import FindsManager from "@/components/admin/FindsManager";
import { getCrazyFinds } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function FindsAdminPage() {
  const finds = await getCrazyFinds();
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Wildest finds</h1>
      <p className="mt-1 text-sm text-muted">
        Showcase the craziest things and trash scenes. Upload a photo/short clip, or paste a
        YouTube, Instagram, X, TikTok, or video link — they appear on the homepage right away.
      </p>
      <div className="mt-6">
        <FindsManager finds={finds} />
      </div>
    </div>
  );
}
