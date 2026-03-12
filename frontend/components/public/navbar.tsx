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
  { href: "/patient/login", label: "Patient Portal" },
  { href: "/doctor/login", label: "Doctor Portal" },
  { href: "/admin/login", label: "Admin Portal" },
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

        <div className="hidden md:flex items-center gap-4">

          {/* Login Dropdown */}

          <div className="relative">

            <Button
              variant="outline"
              className="flex items-center gap-2 px-5 py-2.5 h-11 border border-slate-300 bg-white hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 font-semibold text-sm rounded-lg shadow-sm hover:shadow-md"
              onClick={() => setLoginDropdownOpen((v) => !v)}
            >
              Sign In
              <ChevronDown
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  loginDropdownOpen && "rotate-180"
                )}
              />
            </Button>

            {loginDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">

                {loginLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600 transition-all duration-150",
                      index !== loginLinks.length - 1 && "border-b border-slate-100"
                    )}
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
            triggerClassName="h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-lg transition-all duration-200"
          />

        </div>

        {/* Mobile Menu Button */}

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-11 w-11 text-slate-600 hover:text-blue-600 hover:bg-slate-100"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

      </div>

      {/* Mobile Menu */}

      {mobileOpen && (
        <div className="md:hidden border-t bg-white">

          <div className="px-4 py-5 space-y-3">

            {/* Mobile Links */}

            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600 transition-all duration-150 border border-transparent hover:border-blue-200"
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t border-slate-200 pt-4 space-y-3">

              {loginLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600 rounded-lg transition-all duration-150 border border-slate-200 hover:border-blue-300"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

            </div>

            <AppointmentBookingModal
              triggerLabel="Book Appointment"
              triggerClassName="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg mt-4 font-semibold shadow-sm hover:shadow-lg transition-all duration-200"
            />

          </div>

        </div>
      )}

    </header>
  );
}
