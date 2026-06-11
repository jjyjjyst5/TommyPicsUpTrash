"use client";

import { useEffect, useState } from "react";
import { Waves, Menu, X } from "lucide-react";

const LINKS = [
  { href: "#impact", label: "The Count" },
  { href: "#story", label: "His Story" },
  { href: "#gallery", label: "Gallery" },
  { href: "#press", label: "In the News" },
  { href: "#help", label: "Get Involved" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#06304a]/90 backdrop-blur-md shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2 font-semibold text-white">
          <Waves className="h-6 w-6 text-accent" />
          <span className="tracking-tight">
            Tommy<span className="text-accent">Pics</span>UpTrash
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#help"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#06304a] transition hover:brightness-110"
          >
            Join the cause
          </a>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[#06304a]/95 px-5 py-4 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-white/85"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
