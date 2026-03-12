"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const roleLoginTargets = [
  { label: "Admin Login", href: "/admin/login" },
  { label: "Doctor Login", href: "/doctor/login" },
  { label: "Patient Login", href: "/patient/login" },
] as const;

export function RoleLoginButtons() {
  const router = useRouter();

  const navigateToRoleLogin = (href: string, label: string) => {
    // Debug trace for production issue diagnosis on click/navigation.
    console.info("[RoleLoginButtons] navigating", { label, href });
    router.push(href);
  };

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {roleLoginTargets.map((item) => (
        <Button
          key={item.href}
          type="button"
          className="w-full"
          variant="outline"
          onClick={() => navigateToRoleLogin(item.href, item.label)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
