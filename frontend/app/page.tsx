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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicShell } from "@/components/public/public-shell";

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

export default function HomePage() {
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
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-8 pb-8 sm:px-6 lg:grid-cols-[1.05fr,0.95fr]">

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

      <section className="bg-blue-50 py-12">

        <div className="mx-auto max-w-7xl px-4">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Our Medical Departments
            </h2>

            <p className="text-slate-600">
              Our hospital offers specialized departments with experienced doctors
              and modern technology.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {featuredDepartments.map((department) => (
              <Card
                key={department?.id || department?.name}
                className="rounded-xl border bg-white shadow-sm hover:shadow-lg transition"
              >
                <CardContent className="p-6 space-y-4">

                  <div className="flex justify-between items-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Stethoscope className="h-6 w-6 text-blue-700" />
                    </div>

                    <Badge className="bg-blue-50 text-blue-700">
                      Department
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold">
                    {department?.name}
                  </h3>

                  <p className="text-sm text-slate-600">
                    Expert doctors and modern diagnostic support for treatment.
                  </p>

                  <Link
                    href={`/doctors?department=${encodeURIComponent(
                      department?.name || ""
                    )}`}
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-full"
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

      <section className="bg-white py-12">

        <div className="mx-auto max-w-7xl px-4">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Our Healthcare Services
            </h2>

            <p className="text-slate-600">
              Comprehensive healthcare services with modern equipment
              and experienced specialists.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {services.map((service) => (
              <Card key={service.title} className="shadow-sm hover:shadow-lg">

                <CardContent className="p-6 space-y-3">

                  <div className="bg-cyan-100 p-3 rounded-lg w-fit">
                    <HeartPulse className="h-6 w-6 text-cyan-700" />
                  </div>

                  <h3 className="font-semibold">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600">
                    {service.description}
                  </p>

                </CardContent>

              </Card>
            ))}

          </div>

        </div>
      </section>

      {/* DOCTORS */}

      <section className="bg-slate-50 py-12">

        <div className="mx-auto max-w-7xl px-4">

          <h2 className="mb-8 text-3xl font-semibold text-slate-900">
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