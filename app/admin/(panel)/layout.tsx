import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  ImagePlus,
  Sparkles,
  BookOpen,
  Newspaper,
  Settings,
  KeyRound,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hauls", label: "Log a haul", icon: PlusCircle },
  { href: "/admin/finds", label: "Wildest finds", icon: Sparkles },
  { href: "/admin/gallery", label: "Gallery", icon: ImagePlus },
  { href: "/admin/story", label: "His story", icon: BookOpen },
  { href: "/admin/press", label: "Press & interview", icon: Newspaper },
  { href: "/admin/settings", label: "Water bodies", icon: Settings },
  { href: "/admin/account", label: "Account", icon: KeyRound },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <aside className="border-b bg-surface px-4 py-5 md:w-64 md:border-b-0 md:border-r">
        <div className="px-2 text-lg font-bold tracking-tight text-primary">
          Tommy<span className="text-teal">Trash</span> Admin
        </div>
        <nav className="mt-5 flex flex-wrap gap-1 md:flex-col">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-surface-muted hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-5 space-y-1 border-t pt-4 md:mt-8">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-surface-muted"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <form action={logout}>
            <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-5 py-8 md:px-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
