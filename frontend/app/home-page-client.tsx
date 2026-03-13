"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  HeartPulse,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";

import { DoctorCard } from "@/components/DoctorCard";
import { AppointmentBookingModal } from "@/components/public/appointment-booking-modal";
import { PublicShell } from "@/components/public/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { defaultDashboardByRole } from "@/lib/routes";
import { publicService } from "@/services/public.service";
import { useAuthStore } from "@/store/auth-store";

const services = [
  {
    title: "Cardiology and Critical Care",
    description:
      "Heart screening, emergency response, ICU monitoring, and specialist consultation.",
  },
  {
    title: "Neurology and Diagnostics",
    description:
      "Advanced imaging and neurological consultation with digital reports.",
  },
  {
    title: "Women and Child Care",
    description:
      "Gynecology, pediatrics, vaccination support and preventive care.",
  },
  {
    title: "Surgical and Day Care",
    description:
      "Planned surgeries, pre-op coordination and post-operative support.",
  },
];

export function HomePageClient() {
  const router = useRouter();
  const { user } = useAuthStore();

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

  const featuredDoctors = Array.isArray(doctors)
    ? doctors.filter((d) => d && typeof d === "object").slice(0, 3)
    : [];

  const featuredDepartments = Array.isArray(departments)
    ? departments.filter((d) => d && d.name).slice(0, 6)
    : [];

  const handleBookAppointment = (doctorId: string) => {
    const bookingPath = `/patient/appointments/book?doctorId=${encodeURIComponent(
      doctorId
    )}`;

    if (!user) {
      router.push(`/login/patient?redirect=${encodeURIComponent(bookingPath)}`);
      return;
    }

    if (user.role !== "patient") {
      toast.info("Booking is available from a patient account.");
      router.push(defaultDashboardByRole[user.role]);
      return;
    }

    router.push(bookingPath);
  };

  return (
    <PublicShell>

      {/* HERO */}

      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,#cffafe,transparent_32%),linear-gradient(135deg,#f8fafc,#ffffff_45%,#eff6ff)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-6 pb-6 sm:px-6 lg:grid-cols-[1.05fr,0.95fr]">

          <div className="flex flex-col justify-center gap-6">

            <Badge className="w-fit rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-cyan-800">
              Pune hospital care, online booking, and expert doctors
            </Badge>

            <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Trusted Healthcare and Advanced Medical Services in Pune
            </h1>

            <p className="max-w-xl text-slate-600">
              MediCore Hospital provides expert doctors, modern facilities,
              and compassionate care for every patient.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">

              <AppointmentBookingModal
                triggerLabel="Book Patient Appointment"
                triggerClassName="rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
              />

              <Link href="/contact">
                <Button
                  variant="outline"
                  className="rounded-full border-slate-300 px-6"
                >
                  Contact Hospital
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

            </div>

            {/* STATS */}

            <div className="grid gap-4 sm:grid-cols-3">

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <BadgeCheck className="h-5 w-5 text-green-600" />
                  <p className="font-semibold">
                    {stats?.doctors ?? 30}+ Doctors
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-blue-600" />
                  <p className="font-semibold">24/7 Support</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <UsersRound className="h-5 w-5 text-indigo-600" />
                  <p className="font-semibold">
                    {stats?.patientsServed ?? 0}+ Patients
                  </p>
                </CardContent>
              </Card>

            </div>

          </div>

          {/* HERO IMAGE */}

          <div className="relative">
            <Card className="overflow-hidden rounded-2xl">
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

      <section className="bg-gradient-to-b from-slate-50 to-white py-12">

        <div className="mx-auto max-w-7xl px-4">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Medical Departments
            </h2>

            <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
              Specialized care across multiple disciplines with experienced doctors
              and state-of-the-art medical technology
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {featuredDepartments.map((department) => (
              <Card
                key={department?.id || department?.name}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                
                <CardContent className="p-6 space-y-5">

                  <div className="flex justify-between items-start">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors">
                      <Stethoscope className="h-7 w-7 text-blue-600" />
                    </div>

                    {department?._count?.doctors && (
                      <Badge className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200 font-semibold">
                        {department._count.doctors} {department._count.doctors === 1 ? 'Doctor' : 'Doctors'}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {department?.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {department?.description || 'Expert doctors and modern diagnostic support for specialized treatment.'}
                    </p>
                  </div>

                  <Link
                    href={`/doctors?department=${encodeURIComponent(
                      department?.name || ""
                    )}`}
                    className="block"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-semibold transition-all"
                    >
                      View Doctors
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                </CardContent>
              </Card>
            ))}

          </div>

        </div>
      </section>

      {/* SERVICES */}

      <section className="bg-gradient-to-b from-white via-slate-50 to-white py-12">

        <div className="mx-auto max-w-7xl px-4">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Healthcare Services
            </h2>

            <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
              Comprehensive medical services with cutting-edge technology
              and highly skilled specialists dedicated to your wellbeing
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {services.map((service, index) => (
              <Card 
                key={service.title} 
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-cyan-200 hover:shadow-xl"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>

                <CardContent className="p-6 space-y-4">

                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-100 w-fit group-hover:from-cyan-100 group-hover:to-blue-100 transition-colors">
                    <HeartPulse className="h-7 w-7 text-cyan-600 group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-cyan-600 transition-colors leading-tight">
                      {service.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <div className="h-1 w-1 rounded-full bg-cyan-400"></div>
                    <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wide">Expert Care</span>
                  </div>

                </CardContent>

              </Card>
            ))}

          </div>

        </div>
      </section>

      {/* DOCTORS */}

      <section className="bg-slate-50 py-10">

        <div className="mx-auto max-w-7xl px-4">

          <h2 className="mb-6 text-3xl font-semibold text-slate-900">
            Choose a Specialist
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">

            {featuredDoctors.map((doctor) => {
              const safeDoctor = {
                id: doctor?.id || "doctor",
                name: doctor?.name || "Doctor",
                specialization: doctor?.specialization || "General",
                experienceYears: doctor?.experienceYears ?? 0,
                department: doctor?.department || "",
                email: doctor?.email || "",
                phone: doctor?.phone || "",
              };

              return (
                <DoctorCard
                  key={safeDoctor.id}
                  {...safeDoctor}
                  onBook={handleBookAppointment}
                />
              );
            })}

          </div>

        </div>
      </section>

    </PublicShell>
  );
}
