"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  LogOut,
  Menu,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useAuth } from "@/components/providers/auth-provider";
import { useClinic } from "@/components/providers/clinic-provider";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/doctors", label: "Doctors", icon: UserRound },
  { href: "/patients", label: "Patients", icon: Users },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, user, logout } = useAuth();
  const clinic = useClinic();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const menuOpen = openPath === pathname;

  useEffect(() => {
    if (!ready || user) return;
    logout();
    router.replace("/");
  }, [ready, user, logout, router]);

  if (!ready || !clinic.ready || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas">
        <p className="flex items-center gap-3 text-sm text-muted">
          <span className="size-2.5 animate-pulse rounded-full bg-teal" />
          Opening workspace
        </p>
      </div>
    );
  }

  function signOut() {
    logout();
    router.replace("/");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-[#062421] text-white">
      <div className="px-5 pt-6">
        <Logo light />
      </div>
      <nav className="mt-8 space-y-1 px-3" aria-label="Primary">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/65 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="size-4" strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
          <p className="text-[11px] text-white/45">Signed in as</p>
          <p className="mt-1 text-sm break-all text-white/90">{user.email}</p>
          <button
            type="button"
            onClick={signOut}
            className="mt-3 flex items-center gap-2 text-sm text-white/75 transition hover:text-white"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[232px] lg:block">
        {sidebar}
      </aside>
      {menuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-[#10211e]/50 lg:hidden"
          onClick={() => setOpenPath(null)}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[232px] transition-transform lg:hidden",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebar}
      </aside>
      <div className="lg:pl-[232px]">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur lg:hidden">
          <Logo />
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() =>
            setOpenPath((current) => (current === pathname ? null : pathname))
          }
            className="grid size-10 place-items-center rounded-xl text-ink"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </header>
        <main className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto w-full max-w-[1120px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
