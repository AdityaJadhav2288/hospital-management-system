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
          "fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f766e,#2563eb)] text-white shadow-md">
              <Stethoscope size={16} />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">MediCore</p>
              <p className="text-xs capitalize text-slate-500">{user.role} portal</p>
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

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {routes.map((item) => {
            const Icon = getIcon(item.href, item.label);
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                  active
                    ? "bg-[linear-gradient(135deg,#0f766e,#2563eb)] text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
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
