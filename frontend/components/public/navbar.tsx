"use client";

import Link from "next/link";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-primary">
          CityCare Hospital
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Button variant="outline" onClick={() => setLoginOpen((v) => !v)}>
              Login <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            {loginOpen ? (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card p-1 shadow-lg">
                <Link href="/login/admin" className="block rounded px-3 py-2 text-sm hover:bg-muted">
                  Login as Admin
                </Link>
                <Link href="/login/doctor" className="block rounded px-3 py-2 text-sm hover:bg-muted">
                  Login as Doctor
                </Link>
                <Link href="/login/patient" className="block rounded px-3 py-2 text-sm hover:bg-muted">
                  Login as Patient
                </Link>
              </div>
            ) : null}
          </div>
          <AppointmentBookingModal />
        </div>

        <Button className="md:hidden" variant="outline" size="icon" onClick={() => setOpen((v) => !v)}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {open ? (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          <div className="space-y-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded px-3 py-2 text-sm hover:bg-muted">
                {link.label}
              </Link>
            ))}
            <Link href="/login/admin" className="block rounded px-3 py-2 text-sm hover:bg-muted">
              Login as Admin
            </Link>
            <Link href="/login/doctor" className="block rounded px-3 py-2 text-sm hover:bg-muted">
              Login as Doctor
            </Link>
            <Link href="/login/patient" className="block rounded px-3 py-2 text-sm hover:bg-muted">
              Login as Patient
            </Link>
            <div className="pt-1">
              <AppointmentBookingModal triggerClassName="w-full" />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
