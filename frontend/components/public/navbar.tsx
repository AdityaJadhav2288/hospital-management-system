"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X, Heart, Stethoscope, Activity, Shield } from "lucide-react";
import { AppointmentBookingModal } from "@/components/public/appointment-booking-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: Activity },
  { href: "/services", label: "Services", icon: Shield },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/about", label: "About", icon: Heart },
  { href: "/contact", label: "Contact", icon: Shield },
];

const loginLinks = [
  { href: "/login/patient", label: "Patient Portal" },
  { href: "/login/doctor", label: "Doctor Portal" },
  { href: "/login/admin", label: "Admin Portal" },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Heart size={20} />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900">MediCore</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">
              Healthcare
            </p>
          </div>

        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden md:flex items-center gap-6">

          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition"
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}

        </nav>

        {/* Desktop Right Buttons */}

        <div className="hidden md:flex items-center gap-3">

          {/* Login Dropdown */}

          <div className="relative">

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setLoginDropdownOpen((v) => !v)}
            >
              Sign In
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition",
                  loginDropdownOpen && "rotate-180"
                )}
              />
            </Button>

            {loginDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-lg border bg-white shadow-lg">

                {loginLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setLoginDropdownOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

              </div>
            )}

          </div>

          {/* Book Appointment */}

          <AppointmentBookingModal
            triggerLabel="Book Appointment"
            triggerClassName="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg"
          />

        </div>

        {/* Mobile Menu Button */}

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>

      </div>

      {/* Mobile Menu */}

      {mobileOpen && (
        <div className="md:hidden border-t bg-white">

          <div className="px-4 py-4 space-y-3">

            {/* Mobile Links */}

            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50"
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t pt-3 space-y-2">

              {loginLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-sm text-slate-600 hover:text-blue-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

            </div>

            <AppointmentBookingModal
              triggerLabel="Book Appointment"
              triggerClassName="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg mt-3"
            />

          </div>

        </div>
      )}

    </header>
  );
}