"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { sidebarRoutesByRole } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

function getIcon(href: string) {
  if (href.includes("dashboard")) return LayoutDashboard;
  if (href.includes("appointments")) return Calendar;
  if (href.includes("patients")) return Users;
  if (href.includes("doctors")) return Stethoscope;
  if (href.includes("settings")) return Settings;

  return LayoutDashboard;
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  const routes = sidebarRoutesByRole[user.role];

  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
      
      {/* BRAND */}
      <div className="flex h-16 items-center border-b border-border px-5 text-lg font-semibold">
        🏥 MediCore
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {routes.map((item) => {
          const Icon = getIcon(item.href);

          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}