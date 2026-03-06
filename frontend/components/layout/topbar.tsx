"use client";

import Link from "next/link";
import { Menu, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface TopbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export function Topbar({ setSidebarOpen }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-muted lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <p className="text-sm font-semibold">{user?.name || "User"}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium capitalize text-muted-foreground sm:inline-flex">
          <ShieldCheck size={14} />
          {user?.role || "guest"}
        </span>
        <Link href="/">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            Website
          </Button>
        </Link>
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
