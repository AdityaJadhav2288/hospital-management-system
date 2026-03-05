"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { sidebarRoutesByRole } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <aside className="hidden w-64 border-r border-border bg-card p-4 md:block">
      <div className="mb-6 text-xl font-semibold">MediCore</div>
      <nav className="space-y-1">
        {sidebarRoutesByRole[user.role].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm",
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
