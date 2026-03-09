"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, BadgeCheck, Clock3, HeartPulse, ShieldCheck, Stethoscope, UsersRound } from "lucide-react";
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
    description: "Heart screening, emergency response, ICU monitoring, and specialist consultation in one unit.",
  },
  {
    title: "Neurology and Diagnostics",
    description: "Advanced imaging, neuro consultation, and follow-up care with fast digital reporting.",
  },
  {
    title: "Women and Child Care",
    description: "Gynecology, pediatrics, vaccination support, and preventive checkups for families.",
  },
  {
    title: "Surgical and Day Care",
    description: "Planned procedures, pre-op coordination, and post-operative support with shorter wait times.",
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

  const featuredDoctors = (Array.isArray(doctors) ? doctors.filter(Boolean) : []).slice(0, 3);
  const featuredDepartments = (Array.isArray(departments) ? departments.filter(Boolean) : []).slice(0, 6);

  return (
    <PublicShell>
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
                MediCore connects patients with predefined specialists, responsive appointment booking, and a simple
                digital hospital portal designed for real-day use on mobile and desktop.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <AppointmentBookingModal
                triggerLabel="Book Patient Appointment"
                triggerClassName="rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
              />
              <Link href="/contact">
                <Button variant="outline" className="w-full rounded-full border-slate-300 px-6 sm:w-auto">
                  Contact Hospital
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-slate-200 bg-white/80 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{stats?.doctors ?? 30}+ Doctors</p>
                      <p className="text-xs text-slate-500">Predefined specialist roster</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200 bg-white/80 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">24/7 Support</p>
                      <p className="text-xs text-slate-500">Emergency and booking assistance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200 bg-white/80 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                      <UsersRound className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{stats?.patientsServed ?? 0}+ Patients</p>
                      <p className="text-xs text-slate-500">Managed in the HMS portal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 h-32 w-32 rounded-full bg-cyan-200/60 blur-3xl" />
            <div className="absolute -right-10 bottom-10 h-36 w-36 rounded-full bg-blue-200/60 blur-3xl" />
            <Card className="relative overflow-hidden rounded-[2rem] border-slate-200 bg-white shadow-2xl shadow-slate-200/80">
              <div className="relative h-72 sm:h-96">
                <Image src="/hospital.png" alt="MediCore Hospital Pune" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.68))]" />
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950 p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Hospital Snapshot</p>
                  <p className="mt-3 text-3xl font-semibold">{stats?.beds ?? 120}</p>
                  <p className="mt-1 text-sm text-slate-300">Operational beds with emergency-ready support teams</p>
                </div>
                <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm font-medium text-slate-700">Patient-first digital workflow</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <HeartPulse className="h-5 w-5 text-rose-500" />
                    <p className="text-sm font-medium text-slate-700">Appointments, history, and admin visibility</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-5 w-5 text-cyan-700" />
                    <p className="text-sm font-medium text-slate-700">30 predefined doctors across core departments</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Core Services</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">Hospital departments patients use most</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              The website now focuses on specialist booking, clean information, and faster admin visibility instead of
              oversized banner sections.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} className="rounded-[1.5rem] border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <p className="text-lg font-semibold text-slate-950">{service.title}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Departments</p>
              <h2 className="mt-2 text-3xl font-semibold">Pune-ready specialties with clear patient routing</h2>
            </div>
            <Link href="/doctors" className="text-sm font-medium text-cyan-300 transition hover:text-white">
              View all doctors
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {featuredDepartments.map((department) => (
              <div key={department.id} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                {department.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Featured Doctors</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">Choose a specialist and book faster</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              The appointment flow now leads patients into the patient login page directly before opening the booking
              experience.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {featuredDoctors?.filter(Boolean).map((doctor) => (
              <DoctorCard
                key={doctor?.id || `${doctor?.email || "doctor"}-${doctor?.name || "unknown"}`}
                id={doctor?.id}
                name={doctor?.name || "Doctor"}
                specialization={doctor?.specialization || "General Specialist"}
                experienceYears={doctor?.experienceYears ?? 0}
                department={doctor?.department || ""}
                email={doctor?.email || ""}
                phone={doctor?.phone || ""}
                onBook={(doctorId) => {
                  window.location.href = `/patient/appointments/book?doctorId=${encodeURIComponent(doctorId)}`;
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#0f172a,#0f766e_55%,#2563eb)] py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 text-center backdrop-blur sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Need assistance?</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Book, ask a question, or contact the Pune desk directly</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              The public site is now streamlined for appointments, hospital information, and admin-visible contact
              messages without the oversized banner style you flagged.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <AppointmentBookingModal
                triggerLabel="Book Appointment"
                triggerClassName="rounded-full bg-white px-6 text-slate-950 hover:bg-slate-100"
              />
              <Link href="/contact">
                <Button variant="outline" className="w-full rounded-full border-white/40 bg-transparent px-6 text-white hover:bg-white/10 sm:w-auto">
                  Contact Hospital
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
