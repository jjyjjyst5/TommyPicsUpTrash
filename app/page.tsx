import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ImpactDashboard from "@/components/ImpactDashboard";
import Story from "@/components/Story";
import Quotes from "@/components/Quotes";
import Gallery from "@/components/Gallery";
import Press from "@/components/Press";
import GetInvolved from "@/components/GetInvolved";
import Footer from "@/components/Footer";
import { getStats } from "@/lib/stats";
import { getGallery, getPress } from "@/lib/data";

// Always read fresh counts so admin updates show immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [stats, images, press] = await Promise.all([getStats(), getGallery(), getPress()]);

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero stats={stats} />
        <ImpactDashboard stats={stats} />
        <Story />
        <Quotes />
        <Gallery images={images} />
        <Press items={press} />
        <GetInvolved />
      </main>
      <Footer />
    </>
  );
}
