"use client";

import Link from "next/link";
import { Ambulance, Clock3, Mail, MapPin, Phone, Stethoscope } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr,0.8fr,1fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f766e,#2563eb)] text-white">
              <Stethoscope size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">MediCore Hospital</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Pune Patient Care Network</p>
            </div>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">
            MediCore brings specialist consultation, emergency support, diagnostics, and digital appointment booking
            into one responsive hospital experience for patients across Pune.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Quick Links</p>
          <div className="mt-4 space-y-3 text-sm">
            <Link href="/services" className="block transition hover:text-white">
              Services
            </Link>
            <Link href="/doctors" className="block transition hover:text-white">
              Doctors
            </Link>
            <Link href="/about" className="block transition hover:text-white">
              About
            </Link>
            <Link href="/contact" className="block transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Pune Contact</p>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-cyan-300" />
              <span>MediCore Hospital, Baner Road, Pune, Maharashtra 411045</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-cyan-300" />
              <span>+91 20 6767 9000</span>
            </div>
            <div className="flex items-center gap-3">
              <Ambulance className="h-4 w-4 text-rose-300" />
              <span>Emergency: +91 20 6767 9111</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-cyan-300" />
              <span>care@medicorepune.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock3 className="h-4 w-4 text-cyan-300" />
              <span>Open 24/7 for emergency and appointments</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
        © {new Date().getFullYear()} MediCore Hospital, Pune. All rights reserved.
      </div>
    </footer>
  );
}
