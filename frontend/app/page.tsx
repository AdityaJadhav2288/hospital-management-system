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

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-16 md:grid-cols-2">
        <div className="space-y-6">
          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary">
            Trusted Multi-Specialty Hospital
          </Badge>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Advanced Healthcare With Compassion
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl">
            CityCare Hospital delivers world-class treatment, modern
            diagnostics and compassionate care for patients across multiple
            specialties.
          </p>

          <div className="flex flex-wrap gap-4">
            <AppointmentBookingModal
              triggerLabel="Book Appointment"
              triggerClassName="h-11 px-6"
            />

            <Link href="/doctors">
              <Button size="lg" variant="outline">
                Meet Doctors
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
        </div>

        {/* HERO CARD */}

        <Card className="border-primary/20 bg-gradient-to-br from-blue-50 via-white to-cyan-50 shadow-lg">
          <CardHeader>
            <CardTitle>Hospital Overview</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">
                {stats?.beds ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Beds</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-primary">
                {stats?.doctors ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Doctors</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-primary">
                {stats?.patientsServed ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Patients</p>
            </div>
          </CardContent>

          <CardContent className="pt-0">
            <div className="mb-4 overflow-hidden rounded-xl border">
              <Image
                src="/hospital-hero.svg"
                alt="Hospital"
                width={1200}
                height={800}
                className="h-52 w-full object-cover"
                priority
              />
            </div>

            <div className="rounded-lg border bg-white px-4 py-3 text-sm">
              Emergency Helpline:
              <span className="ml-1 font-semibold text-danger">
                +91 1800-123-911
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ABOUT */}

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-2xl border bg-white px-8 py-10 shadow-sm">
          <h2 className="text-2xl font-bold">About Our Hospital</h2>

          <p className="mt-3 max-w-4xl text-muted-foreground">
            CityCare Hospital provides integrated healthcare services with
            experienced doctors, modern infrastructure and patient-first care.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {(departments || []).slice(0, 3).map((department) => (
              <Card key={department.id}>
                <CardContent className="pt-6 text-sm">
                  <p className="font-semibold">{department.name}</p>
                  <p className="text-muted-foreground mt-1">
                    {department.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Our Medical Services</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.name}
              name={service.name}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </section>

      {/* DOCTORS */}

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Our Doctors</h2>

          <Link href="/doctors">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {(doctors || []).slice(0, 3).map((doctor) => (
            <DoctorCard
              key={doctor.id}
              name={doctor.name}
              specialization={doctor.specialization}
              experienceYears={doctor.experienceYears}
              email={doctor.email}
            />
          ))}
        </div>
      </section>

      {/* EMERGENCY */}

      <section className="mx-auto max-w-7xl px-4 py-10">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:justify-between md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-red-700">
                Emergency Medical Help
              </h3>
              <p className="text-sm text-muted-foreground">
                Call our emergency desk for immediate medical assistance.
              </p>
            </div>

            <p className="text-xl font-bold text-red-700">
              +91 1800-123-911
            </p>
          </CardContent>
        </Card>
      </section>

      {/* TESTIMONIALS */}

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Patient Testimonials</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            "Emergency team responded quickly and saved my father’s life.",
            "Doctors explained every step of treatment clearly.",
            "Online appointment booking was extremely convenient.",
          ].map((item) => (
            <Card key={item}>
              <CardContent className="pt-6 text-sm italic">
              &quot;{item}&quot;
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}