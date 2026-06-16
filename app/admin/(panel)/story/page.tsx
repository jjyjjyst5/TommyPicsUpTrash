import StoryEditor from "@/components/admin/StoryEditor";
import { getStoryContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function StoryAdminPage() {
  const story = await getStoryContent();
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">My Trash Story</h1>
      <p className="mt-1 text-sm text-muted">
        Edit the story shown on the homepage. It auto-formats into clean paragraphs, so it
        always looks good no matter how it&apos;s written.
      </p>
      <div className="mt-6">
        <StoryEditor heading={story.heading} body={story.body} />
      </div>
    </div>
  );
}
