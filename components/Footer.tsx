import { Waves } from "lucide-react";
import { SOCIAL } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-[#06304a] py-12 text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 font-semibold text-white">
            <Waves className="h-5 w-5 text-accent" />
            TommyPicsUpTrash
          </div>
          <p className="mt-2 max-w-md text-sm">
            Raising awareness for cleaner waterways — one kayak, one bag at a time. Cleaning
            Pittsburgh&apos;s Ohio River and Clearwater&apos;s Stevenson Creek.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a href={SOCIAL.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            X / Twitter
          </a>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Instagram
          </a>
          <a href="/admin" className="hover:text-white">
            Admin
          </a>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl px-5 text-xs text-white/40">
        © {new Date().getFullYear()} Tommy Picks Up Trash. A volunteer awareness project.
      </div>
    </footer>
  );
}
