"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Scissors,
  CalendarDays,
  LogOut,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clientes", icon: Users },
  {
    href: "/dashboard/appointments",
    label: "Agendamentos",
    icon: CalendarDays,
  },
  { href: "/dashboard/services", label: "Serviços", icon: Scissors },
  { href: "/dashboard/debtors", label: "Em haver", icon: Wallet },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <>
      {/* ── Desktop sidebar ────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-sidebar h-full">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-border">
          <span className="text-lg font-bold tracking-tight gradient-text">
            BeautyPro
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive(href)
                  ? "gradient-primary text-white shadow-sm"
                  : "text-foreground/60 hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/60 hover:bg-secondary hover:text-foreground transition-all"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sair
          </button>
        </div>
      </aside>

      {/* ── Mobile top header ───────────────────────────────────── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b border-border bg-sidebar">
        <span className="text-base font-bold tracking-tight gradient-text">
          BeautyPro
        </span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs font-medium text-foreground/60 hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </header>

      {/* ── Mobile bottom nav ───────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-sidebar">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
              isActive(href)
                ? "text-primary"
                : "text-foreground/50 hover:text-foreground",
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="leading-tight">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
