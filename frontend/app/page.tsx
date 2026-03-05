"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

import {
  Activity,
  Ambulance,
  HeartPulse,
  Microscope,
  Stethoscope,
  ArrowRight,
  Award,
  Clock,
  Users,
  Zap,
  BadgeCheck,
} from "lucide-react";

import { DoctorCard } from "@/components/DoctorCard";
import { ServiceCard } from "@/components/ServiceCard";
import { AppointmentBookingModal } from "@/components/public/appointment-booking-modal";
import { PublicShell } from "@/components/public/public-shell";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useApi } from "@/hooks/use-api";
import { publicService } from "@/services/public.service";

const services = [
  {
    name: "Cardiac Care",
    description: "24x7 cardiac emergency and preventive heart programs.",
    icon: HeartPulse,
  },
  {
    name: "Emergency & Trauma",
    description: "Rapid triage and trauma stabilization services.",
    icon: Ambulance,
  },
  {
    name: "Laboratory Diagnostics",
    description: "Fast pathology and digital lab reports.",
    icon: Microscope,
  },
  {
    name: "General Medicine",
    description: "Complete physician-led treatment for all age groups.",
    icon: Stethoscope,
  },
  {
    name: "Critical Care",
    description: "Advanced ICU with round-the-clock monitoring.",
    icon: Activity,
  },
];

const features = [
  { icon: BadgeCheck, label: "Certified Doctors", value: "27+" },
  { icon: Clock, label: "24/7 Available", value: "Always" },
  { icon: Users, label: "Expert Team", value: "150+" },
  { icon: Zap, label: "Quick Response", value: "< 5 min" },
];

export default function HomePage() {
  const { data: doctors, execute: loadDoctors } = useApi(publicService.getDoctors);
  const { data: departments, execute: loadDepartments } = useApi(publicService.getDepartments);
  const { data: stats, execute: loadStats } = useApi(publicService.getStats);

  useEffect(() => {
    void loadDoctors();
    void loadDepartments();
    void loadStats();
  }, [loadDoctors, loadDepartments, loadStats]);

  return (
    <PublicShell>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 -mt-2">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

        <div className="relative mx-auto max-w-7xl grid gap-8 px-4 pt-6 pb-12 md:grid-cols-2 md:pb-20">
          {/* LEFT CONTENT */}
          <div className="space-y-8 flex flex-col justify-center">
            <Badge className="w-fit rounded-full bg-gradient-to-r from-blue-500/10 to-blue-600/10 px-4 py-2 text-blue-700 border border-blue-200">
              ✨ Trusted Healthcare Excellence
            </Badge>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-extrabold leading-tight text-gray-900">
                World-Class Healthcare
                <br />
                at Your Fingertips
              </h1>

              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Experience compassionate care with cutting-edge technology. Our team of expert doctors is ready to serve you 24/7 with world-class treatment.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <AppointmentBookingModal
                triggerLabel="Book Appointment"
                triggerClassName="h-12 px-8 text-base rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              />

              <Link href="/doctors">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-2 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50">
                  Meet Our Doctors
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {features.map((feature) => (
                <div key={feature.label} className="flex items-center gap-3 p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">{feature.label}</p>
                    <p className="font-bold text-gray-900">{feature.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION - HOSPITAL SHOWCASE */}
          <div className="relative hidden md:block">
            <Card className="border border-blue-200 bg-white shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300">
              <div className="relative h-96 overflow-hidden">
                <Image
                  src="/hospital.png"
                  alt="CityCare Hospital"
                  width={1400}
                  height={900}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <CardHeader className="pb-4 pt-6">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Hospital Highlights
                </CardTitle>
              </CardHeader>

              {/* STATS */}
              <CardContent className="grid grid-cols-3 gap-4 pb-6">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <p className="text-4xl font-bold text-blue-600">{stats?.beds ?? 120}</p>
                  <p className="text-sm text-gray-700 font-medium mt-1">Modern Beds</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <p className="text-4xl font-bold text-green-600">30+</p>
                  <p className="text-sm text-gray-700 font-medium mt-1">Expert Doctors</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <p className="text-4xl font-bold text-purple-600">{stats?.patientsServed ?? 200}k+</p>
                  <p className="text-sm text-gray-700 font-medium mt-1">Patients</p>
                </div>
              </CardContent>

              {/* EMERGENCY HELPLINE */}
              <CardContent className="pt-0 pb-6 px-6">
                <div className="rounded-xl border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100 p-4 text-center">
                  <p className="text-sm text-gray-700 font-medium">🚨 Emergency Hotline</p>
                  <p className="text-2xl font-bold text-red-600 mt-2">
                    +91 1800-123-911
                  </p>
                  <p className="text-xs text-red-500 mt-1">Available 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-12 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 rounded-full bg-blue-100 px-4 py-2 text-blue-700 border border-blue-300">
              Our Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From emergency care to specialized treatments, we provide world-class medical services
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.name} className="group border border-gray-200 hover:border-blue-400 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className="mb-4 inline-flex p-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 group-hover:from-blue-200 group-hover:to-blue-100 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg mb-2">{service.name}</CardTitle>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-12 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <Badge className="mb-4 rounded-full bg-blue-100 px-4 py-2 text-blue-700 border border-blue-300 w-fit">
                Why Choose Us
              </Badge>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Excellence in Every Aspect
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                We combine state-of-the-art medical technology with compassionate care to deliver exceptional healthcare experiences. Our commitment to excellence sets us apart.
              </p>

              <div className="space-y-4">
                {[
                  "World-class medical infrastructure and technology",
                  "Expert team of specialists and consultants",
                  "Patient-centric approach to healthcare",
                  "Affordable and transparent pricing",
                  "Quick appointment booking and services",
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <BadgeCheck className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-gray-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/hospital.png"
                  alt="Why Choose Us"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-12 px-4 bg-gradient-to-r from-blue-600 to-blue-500 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10" />

        <div className="relative mx-auto max-w-7xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Take Care of Your Health?
          </h2>
          <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
            Book an appointment with our expert doctors today and experience world-class healthcare
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <AppointmentBookingModal
              triggerLabel="Book Appointment Now"
              triggerClassName="h-12 px-8 text-base rounded-lg bg-white hover:bg-gray-100 text-blue-600 font-semibold"
            />
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-2 border-white text-white hover:bg-white/10">
                Contact Us
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}