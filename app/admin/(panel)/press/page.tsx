import PressEditor from "@/components/admin/PressEditor";
import { getPress } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PressAdminPage() {
  const items = await getPress();
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Press &amp; interview</h1>
      <p className="mt-1 text-sm text-muted">
        Manage news coverage and the KDKA radio interview. Paste the transcript and audio
        embed link when they&apos;re available — they show on the public page instantly.
      </p>
      <div className="mt-6">
        <PressEditor items={items} />
      </div>
    </div>
  );
}
