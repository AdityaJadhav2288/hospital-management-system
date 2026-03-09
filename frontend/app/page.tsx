"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import { DoctorCard } from "@/components/DoctorCard";
import { AppointmentBookingModal } from "@/components/public/appointment-booking-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicShell } from "@/components/public/public-shell";

import { useApi } from "@/hooks/use-api";
import { publicService } from "@/services/public.service";

const services = [
  {
    title: "Cardiology and Critical Care",
    description:
      "Heart screening, emergency response, ICU monitoring, and specialist consultation in one unit.",
  },
  {
    title: "Neurology and Diagnostics",
    description:
      "Advanced imaging, neuro consultation, and follow-up care with fast digital reporting.",
  },
  {
    title: "Women and Child Care",
    description:
      "Gynecology, pediatrics, vaccination support, and preventive checkups for families.",
  },
  {
    title: "Surgical and Day Care",
    description:
      "Planned procedures, pre-op coordination, and post-operative support with shorter wait times.",
  },
];

export default function HomePage() {
  const { data: doctors, execute: loadDoctors } = useApi(publicService.getDoctors);
  const { data: departments, execute: loadDepartments } = useApi(
    publicService.getDepartments
  );
  const { data: stats, execute: loadStats } = useApi(publicService.getStats);

  useEffect(() => {
    void loadDoctors();
    void loadDepartments();
    void loadStats();
  }, [loadDoctors, loadDepartments, loadStats]);

  /* SAFE DATA FILTERING */

  const featuredDoctors = Array.isArray(doctors)
    ? doctors.filter((d) => d && typeof d === "object").slice(0, 3)
    : [];

  const featuredDepartments = Array.isArray(departments)
    ? departments.filter((d) => d && d.name).slice(0, 6)
    : [];

  return (
    <PublicShell>
      {/* HERO SECTION */}

      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,#cffafe,transparent_32%),linear-gradient(135deg,#f8fafc,#ffffff_45%,#eff6ff)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[1.05fr,0.95fr] lg:pb-20 lg:pt-10">
          
          <div className="flex flex-col justify-center gap-7">
            <Badge className="w-fit rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-cyan-800">
              Pune hospital care, online booking, and expert doctors
            </Badge>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                A cleaner and faster way to book hospital care in Pune
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                MediCore connects patients with predefined specialists and responsive booking.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <AppointmentBookingModal
                triggerLabel="Book Patient Appointment"
                triggerClassName="rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
              />
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-slate-300 px-6 sm:w-auto"
                >
                  Contact Hospital
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* STATS */}

            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {stats?.doctors ?? 30}+ Doctors
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 text-cyan-700" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        24/7 Support
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <UsersRound className="h-5 w-5 text-blue-700" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {stats?.patientsServed ?? 0}+ Patients
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* HERO IMAGE */}

          <div className="relative">
            <Card className="overflow-hidden rounded-[2rem]">
              <div className="relative h-72 sm:h-96">
                <Image
                  src="/hospital.png"
                  alt="Hospital Pune"
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}

      <section className="bg-blue-200 py-14 text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-6 text-3xl font-semibold">Departments</h2>

          <div className="flex flex-wrap gap-3">
            {featuredDepartments.map((department) => (
              <div
                key={department?.id || crypto.randomUUID()}
                className="rounded-full border border-white/15 bg-white/90 px-4 py-2 text-sm"
              >
                {department?.name || "Department"}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DOCTORS */}

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          <h2 className="mb-8 text-3xl font-semibold text-slate-950">
            Choose a specialist
          </h2>

          <div className="grid gap-5 lg:grid-cols-3">
            {featuredDoctors.map((doctor) => {
              const safeDoctor = {
                id: doctor?.id || crypto.randomUUID(),
                name: doctor?.name || "Doctor",
                specialization: doctor?.specialization || "General Specialist",
                experienceYears: doctor?.experienceYears ?? 0,
                department: doctor?.department || "",
                email: doctor?.email || "",
                phone: doctor?.phone || "",
              };

              return (
                <DoctorCard
                  key={safeDoctor.id}
                  {...safeDoctor}
                  onBook={(doctorId) => {
                    window.location.href = `/patient/appointments/book?doctorId=${encodeURIComponent(
                      doctorId
                    )}`;
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}