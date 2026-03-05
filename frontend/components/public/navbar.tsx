"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ChevronDown } from "lucide-react";

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
  const [loginDropdown, setLoginDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-white"
        >
          🏥 CityCare
        </Link>

        {/* NAVIGATION RIGHT SIDE */}
        <div className="ml-auto hidden items-center gap-8 md:flex">

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-white hover:text-yellow-300 transition"
            >
              {link.label}
            </Link>
          ))}

          {/* LOGIN DROPDOWN */}
          <div className="relative">
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              onClick={() => setLoginDropdown(!loginDropdown)}
            >
              Login
              <ChevronDown size={16} className={`transition-transform ${loginDropdown ? 'rotate-180' : ''}`} />
            </Button>
            {loginDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 overflow-hidden z-50">
                <Link
                  href="/login/patient"
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  onClick={() => setLoginDropdown(false)}
                >
                  🏥 Login as Patient
                </Link>
                <Link
                  href="/login/doctor"
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition border-t border-gray-100"
                  onClick={() => setLoginDropdown(false)}
                >
                  👨‍⚕️ Login as Doctor
                </Link>
                <Link
                  href="/login/admin"
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition border-t border-gray-100"
                  onClick={() => setLoginDropdown(false)}
                >
                  👤 Login as Admin
                </Link>
              </div>
            )}
          </div>

          <AppointmentBookingModal />
        </div>

        {/* MOBILE MENU BUTTON */}
        <Button
          className="ml-auto md:hidden"
          variant="secondary"
          size="icon"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <Menu size={18} />
        </Button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="bg-white px-6 py-5 md:hidden shadow-lg">
          <div className="space-y-3">

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 px-3 py-2">LOGIN</p>
              <Link
                href="/login/patient"
                className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                🏥 Login as Patient
              </Link>
              <Link
                href="/login/doctor"
                className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                👨‍⚕️ Login as Doctor
              </Link>
              <Link
                href="/login/admin"
                className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                👤 Login as Admin
              </Link>
            </div>

            <div className="pt-2">
              <AppointmentBookingModal triggerClassName="w-full" />
            </div>

          </div>
        </div>
      )}
    </header>
  );
}