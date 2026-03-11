"use client";

import Link from "next/link";
import {
  Ambulance,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  HeartPulse,
  Baby,
  Brain,
  Facebook,
  Twitter,
  Instagram
} from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

        {/* Hospital Info */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
              <Stethoscope size={20} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                MediCore Hospital
              </h3>
              <p className="text-xs text-slate-400 tracking-widest uppercase">
                Pune Healthcare Network
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-400 leading-6">
            MediCore Hospital delivers advanced medical care, experienced
            specialists, and modern diagnostics to provide trusted healthcare
            services for families across Pune.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-5">
            <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            Quick Links
          </h4>

          <div className="mt-4 space-y-3 text-sm">
            <Link href="/" className="block hover:text-white">Home</Link>
            <Link href="/services" className="block hover:text-white">Services</Link>
            <Link href="/doctors" className="block hover:text-white">Doctors</Link>
            <Link href="/about" className="block hover:text-white">About Us</Link>
            <Link href="/contact" className="block hover:text-white">Contact</Link>
          </div>
        </div>

        {/* Departments */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            Departments
          </h4>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <HeartPulse size={16} /> Cardiology
            </div>

            <div className="flex items-center gap-2">
              <Brain size={16} /> Neurology
            </div>

            <div className="flex items-center gap-2">
              <Baby size={16} /> Pediatrics
            </div>

            <div className="flex items-center gap-2">
              <Stethoscope size={16} /> General Medicine
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            Contact
          </h4>

          <div className="mt-4 space-y-4 text-sm">

            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-cyan-400 mt-1" />
              <span>
                MediCore Hospital, Baner Road, Pune, Maharashtra 411045
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={16} className="text-cyan-400" />
              <span>+91 20 6767 9000</span>
            </div>

            <div className="flex items-center gap-3 text-rose-400 font-semibold">
              <Ambulance size={16} />
              Emergency: +91 20 6767 9111
            </div>

            <div className="flex items-center gap-3">
              <Mail size={16} className="text-cyan-400" />
              <span>care@medicorepune.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock3 size={16} className="text-cyan-400" />
              <span>24/7 Emergency Services</span>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-800 text-center text-xs text-slate-500 py-5">
        (c) {new Date().getFullYear()} MediCore Hospital Pune. All Rights Reserved.
      </div>
    </footer>
  );
}
