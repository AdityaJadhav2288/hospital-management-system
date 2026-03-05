"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Ambulance } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        {/* BRAND */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-primary">
            🏥 CityCare Hospital
          </h3>

          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Advanced multi-specialty healthcare with 24×7 emergency services,
            modern diagnostics and patient-first digital care.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="font-semibold">Quick Links</h4>

          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <Link href="/services" className="block hover:text-foreground">
              Services
            </Link>

            <Link href="/doctors" className="block hover:text-foreground">
              Doctors
            </Link>

            <Link href="/about" className="block hover:text-foreground">
              About
            </Link>

            <Link href="/contact" className="block hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="font-semibold">Contact</h4>

          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>+91 1800-123-911</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>care@citycare.health</span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin size={14} className="mt-[2px]" />
              <span>123 Health Avenue, Bengaluru</span>
            </div>

            <div className="flex items-center gap-2 text-danger">
              <Ambulance size={14} />
              <span>Emergency: 102 / +91 1800-500-102</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CityCare Hospital. All rights reserved.
      </div>
    </footer>
  );
}