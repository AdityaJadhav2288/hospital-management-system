"use client";

import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">

          {/* Hospital Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
                <Stethoscope size={20} />
              </div>
              <h2 className="text-base font-bold text-white">
                MediCore Hospital
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-5 mb-3">
              JCI Accredited • NABH Certified • ISO 9001:2015
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="text-slate-400 hover:text-cyan-500 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/doctors" className="text-slate-400 hover:text-white transition-colors">Doctors</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Emergency</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Cardiology</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Neurology</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Pediatrics</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">All Services</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Contact
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex gap-2">
                <MapPin size={14} className="text-cyan-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400">Baner Road, Pune, MH 411045</span>
              </div>
              <div className="flex gap-2">
                <Phone size={14} className="text-cyan-500 flex-shrink-0" />
                <span className="text-slate-400">+91 20 6767 9000</span>
              </div>
              <div className="flex gap-2">
                <Phone size={14} className="text-red-500 flex-shrink-0" />
                <span className="text-red-400 font-semibold">Emergency: +91 20 6767 9111</span>
              </div>
              <div className="flex gap-2">
                <Mail size={14} className="text-cyan-500 flex-shrink-0" />
                <span className="text-slate-400">care@medicorepune.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <div>
            &copy; {currentYear} <span className="text-slate-400 font-semibold">MediCore Hospital Pune</span>. All rights reserved.
          </div>
          <div className="text-right">
            24/7 Emergency Services Available | Reg. No: MH-DHS-000XXX
          </div>
        </div>
      </div>
    </footer>
  );
}