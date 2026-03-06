"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, Stethoscope, X } from "lucide-react";
import { AppointmentBookingModal } from "@/components/public/appointment-booking-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/doctors", label: "Doctors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const loginLinks = [
  { href: "/login/patient", label: "Patient Login" },
  { href: "/login/doctor", label: "Doctor Login" },
  { href: "/login/admin", label: "Admin Login" },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/96 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0891b2,#2563eb)] text-white shadow-lg shadow-cyan-900/20">
            <Stethoscope size={20} />
          </div>
          <div>
            <p className="text-[1.65rem] font-semibold leading-none tracking-tight text-slate-950">MediCore</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Multi-Specialty Care
            </p>
          </div>
        </Link>

        <nav className="hidden items-center rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative">
            <Button
              variant="outline"
              className="rounded-full border-slate-200 px-5 text-slate-700"
              onClick={() => setLoginDropdownOpen((value) => !value)}
            >
              Login
              <ChevronDown className={cn("h-4 w-4 transition-transform", loginDropdownOpen && "rotate-180")} />
            </Button>
            {loginDropdownOpen ? (
              <div className="absolute right-0 top-12 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                {loginLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                    onClick={() => setLoginDropdownOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <AppointmentBookingModal
            triggerLabel="Book Appointment"
            triggerClassName="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-slate-200 lg:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6">
            <nav className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Login Portals</p>
              <div className="space-y-2">
                {loginLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-950 hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <AppointmentBookingModal
              triggerClassName="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800"
              triggerLabel="Book Appointment"
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}
