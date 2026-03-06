"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ActivitySquare,
  BarChart3,
  Building2,
  Calendar,
  ClipboardList,
  Droplets,
  HeartPulse,
  Home,
  LayoutDashboard,
  Mail,
  ShieldPlus,
  Stethoscope,
  type LucideIcon,
  UserCog,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { sidebarRoutesByRole } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

function getIcon(href: string, label: string): LucideIcon {
  const key = `${href} ${label}`.toLowerCase();

  if (key.includes("overview") || key.endsWith("admin") || key.endsWith("doctor") || key.endsWith("patient")) {
    return Home;
  }
  if (key.includes("appointments")) return Calendar;
  if (key.includes("message")) return Mail;
  if (key.includes("patients")) return Users;
  if (key.includes("doctors")) return UserCog;
  if (key.includes("prescriptions")) return ClipboardList;
  if (key.includes("history")) return HeartPulse;
  if (key.includes("reports")) return BarChart3;
  if (key.includes("profile")) return UserRound;
  if (key.includes("department")) return Building2;
  if (key.includes("blood") || key.includes("inventory")) return Droplets;
  if (key.includes("admin")) return ShieldPlus;
  if (key.includes("doctor")) return Stethoscope;
  if (key.includes("patient")) return ActivitySquare;

  return LayoutDashboard;
}

export function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  const routes = sidebarRoutesByRole[user.role];

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Stethoscope size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold">MediCore</p>
              <p className="text-xs capitalize text-muted-foreground">{user.role} portal</p>
            </div>
          </div>
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {routes.map((item) => {
            const Icon = getIcon(item.href, item.label);
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
