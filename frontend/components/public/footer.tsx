"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Ambulance } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="mt-0 bg-gray-800 text-gray-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-4">
        {/* BRAND */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-white">
            🏥 CityCare Hospital
          </h3>

          <p className="mt-4 max-w-md text-sm text-gray-300">
            Advanced multi-specialty healthcare with 24×7 emergency services, modern diagnostics and patient-first digital care.
          </p>

          <div className="mt-6 flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M22.162 5.656a9.207 9.207 0 01-2.662.732 4.644 4.644 0 002.036-2.561 9.314 9.314 0 01-2.95 1.127 4.62 4.62 0 00-7.88 4.214A13.115 13.115 0 011.64 4.15a4.62 4.62 0 001.429 6.166 4.571 4.571 0 01-2.094-.578v.058a4.62 4.62 0 003.707 4.53 4.595 4.595 0 01-2.088.08 4.626 4.626 0 004.317 3.208A9.27 9.27 0 010 19.54a13.118 13.118 0 007.093 2.078c8.502 0 13.157-7.05 13.157-13.157 0-.2-.004-.399-.013-.597a9.4 9.4 0 002.307-2.399z" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M22.225 0H1.771C.792 0 0 .774 0 1.732v20.535C0 23.225.792 24 1.771 24h20.451C23.208 24 24 23.225 24 22.267V1.732C24 .774 23.208 0 22.225 0zM7.078 20.452H3.556V9h3.522v11.452zm-1.761-13.1c-1.128 0-2.044-.918-2.044-2.046 0-1.127.916-2.045 2.044-2.045s2.045.918 2.045 2.045c0 1.128-.917 2.046-2.045 2.046zM20.452 20.452h-3.522v-5.603c0-1.335-.025-3.053-1.861-3.053-1.863 0-2.148 1.45-2.148 2.947v5.709h-3.522V9h3.382v1.561h.047c.471-.893 1.623-1.832 3.342-1.832 3.574 0 4.236 2.35 4.236 5.407v6.316z" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.349 3.608 1.324.975.975 1.262 2.242 1.324 3.608.058 1.266.069 1.645.069 4.849s-.012 3.584-.07 4.85c-.062 1.366-.349 2.633-1.324 3.608-.975.975-2.242 1.262-3.608 1.324-1.266.058-1.645.069-4.849.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.349-3.608-1.324-.975-.975-1.262-2.242-1.324-3.608C2.175 15.748 2.163 15.369 2.163 12s.012-3.584.07-4.85c.062-1.366.349-2.633 1.324-3.608.975-.975 2.242-1.262 3.608-1.324C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.127 4.59.44 3.608 1.422 2.626 2.404 2.313 3.585 2.256 4.866.012 8.332 0 8.741 0 12s.012 3.668.07 4.948c.057 1.282.37 2.463 1.352 3.445.982.982 2.163 1.295 3.444 1.352C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.282-.057 2.463-.37 3.445-1.352.982-.982 1.295-2.163 1.352-3.444C23.988 15.668 24 15.259 24 12s-.012-3.668-.07-4.948c-.057-1.282-.37-2.463-1.352-3.445-.982-.982-2.163-1.295-3.444-1.352C15.668.012 15.259 0 12 0z" />
                <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998z" />
                <circle cx="18.406" cy="5.594" r="1.44" />
              </svg>
            </Link>
          </div>
        </div>
        {/* QUICK LINKS */}
        <div>
          <h4 className="font-semibold text-white">Quick Links</h4>

          <div className="mt-3 space-y-2 text-sm text-gray-300">
            <Link href="/services" className="block hover:text-white">
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
          <h4 className="font-semibold text-white">Contact</h4>

          <div className="mt-3 space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-300" />
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
      <div className="border-t border-gray-700 px-4 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} CityCare Hospital. All rights reserved.
      </div>
    </footer>
  );
}