"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4">
      <div>
        <p className="text-sm text-muted-foreground">Welcome</p>
        <p className="text-sm font-medium">{user?.name || "User"}</p>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="outline">Website</Button>
        </Link>
        <ThemeToggle />
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
