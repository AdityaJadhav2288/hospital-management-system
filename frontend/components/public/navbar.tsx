"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppointmentBookingModal } from "@/components/public/appointment-booking-modal";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/doctors", label: "Doctors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setLoginOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-primary"
        >
          🏥 CityCare
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">
          {/* LOGIN DROPDOWN */}
          <div ref={dropdownRef} className="relative">
            <Button
              variant="outline"
              onClick={() => setLoginOpen((v) => !v)}
              rightIcon={<ChevronDown size={16} />}
            >
              Login
            </Button>

            {loginOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card p-1 shadow-lg">
                <Link
                  href="/login/admin"
                  className="block rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  Login as Admin
                </Link>

                <Link
                  href="/login/doctor"
                  className="block rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  Login as Doctor
                </Link>

                <Link
                  href="/login/patient"
                  className="block rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  Login as Patient
                </Link>
              </div>
            )}
          </div>

          {/* APPOINTMENT BUTTON */}
          <AppointmentBookingModal />
        </div>

        {/* MOBILE MENU BUTTON */}
        <Button
          className="md:hidden"
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <Menu size={18} />
        </Button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/login/admin"
              className="block rounded px-3 py-2 text-sm hover:bg-muted"
            >
              Login as Admin
            </Link>

            <Link
              href="/login/doctor"
              className="block rounded px-3 py-2 text-sm hover:bg-muted"
            >
              Login as Doctor
            </Link>

            <Link
              href="/login/patient"
              className="block rounded px-3 py-2 text-sm hover:bg-muted"
            >
              Login as Patient
            </Link>

            <div className="pt-2">
              <AppointmentBookingModal triggerClassName="w-full" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}