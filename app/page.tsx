import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ImpactDashboard from "@/components/ImpactDashboard";
import Story from "@/components/Story";
import Quotes from "@/components/Quotes";
import CrazyFinds from "@/components/CrazyFinds";
import Gallery from "@/components/Gallery";
import Press from "@/components/Press";
import GetInvolved from "@/components/GetInvolved";
import Footer from "@/components/Footer";
import { getStats } from "@/lib/stats";
import { getGallery, getPress, getCrazyFinds, getStoryContent, getSiteText } from "@/lib/data";

// Always read fresh counts so admin updates show immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [stats, images, press, finds, story, text] = await Promise.all([
    getStats(),
    getGallery(),
    getPress(),
    getCrazyFinds(),
    getStoryContent(),
    getSiteText(),
  ]);

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero stats={stats} text={text.hero} />
        <Story heading={story.heading} body={story.body} />
        <ImpactDashboard stats={stats} text={text.impact} />
        <Quotes />
        <CrazyFinds finds={finds} text={text.finds} />
        <Gallery images={images} text={text.gallery} />
        <Press items={press} text={text.press} />
        <GetInvolved text={text.involved} />
      </main>
      <Footer />
    </>
  );
}
