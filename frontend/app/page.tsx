"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { Activity, Ambulance, HeartPulse, Microscope, Stethoscope } from "lucide-react";
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
    description: "24x7 cardiac emergency, cath lab and preventive heart programs.",
    icon: HeartPulse,
  },
  {
    name: "Emergency & Trauma",
    description: "Rapid triage, trauma stabilization and critical care transport.",
    icon: Ambulance,
  },
  {
    name: "Laboratory Diagnostics",
    description: "Fast pathology and imaging with digital report delivery.",
    icon: Microscope,
  },
  {
    name: "General Medicine",
    description: "Comprehensive physician-led care for chronic and acute concerns.",
    icon: Stethoscope,
  },
  {
    name: "Critical Care",
    description: "Advanced ICU support monitored by multidisciplinary teams.",
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
  }, [loadDepartments, loadDoctors, loadStats]);

  return (
    <PublicShell>
      <section id="home" className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-14 md:grid-cols-2 md:pt-20">
        <div className="space-y-6">
          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary">
            Trusted Multi-Specialty Hospital
          </Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">CityCare Hospital</h1>
            <p className="text-xl font-semibold text-primary">Advanced Care. Human Touch.</p>
            <p className="max-w-xl text-muted-foreground">
              Seamless care journey from emergency response to long-term treatment with dedicated doctors and modern
              diagnostics.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AppointmentBookingModal triggerLabel="Book Appointment" triggerClassName="h-11 px-6" />
            <Link href="/doctors">
              <Button size="lg" variant="outline">
                Meet Our Doctors
              </Button>
            </Link>
          </div>
        </div>
        <Card className="border-primary/20 bg-gradient-to-br from-blue-50 via-white to-cyan-50 shadow-lg">
          <CardHeader>
            <CardTitle>Hospital Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{stats?.beds ?? 0}</p>
              <p className="text-xs text-muted-foreground">Beds</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{stats?.doctors ?? 0}</p>
              <p className="text-xs text-muted-foreground">Doctors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{stats?.patientsServed ?? 0}</p>
              <p className="text-xs text-muted-foreground">Patients Treated</p>
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <div className="mb-4 overflow-hidden rounded-xl border border-border">
              <Image src="/hospital-hero.svg" alt="Hospital hero banner" width={1200} height={800} className="h-52 w-full object-cover" priority />
            </div>
            <div className="rounded-lg border border-border bg-white px-4 py-3 text-sm text-muted-foreground">
              Emergency helpline: <span className="font-semibold text-foreground">+91 1800-123-911</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-white px-6 py-8 shadow-sm md:px-10">
          <h2 className="text-2xl font-bold">About Hospital</h2>
          <p className="mt-3 max-w-4xl text-muted-foreground">
            CityCare Hospital delivers integrated patient-first care with specialists across key departments. Our
            teams combine evidence-based treatment, compassionate communication, and digital coordination to improve
            outcomes.
          </p>
          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            {(departments || []).slice(0, 3).map((department) => (
              <div key={department.id} className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="font-semibold text-foreground">{department.name}</p>
                <p className="mt-1 text-muted-foreground">{department.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-4 text-2xl font-bold">Our Services</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.name} name={service.name} description={service.description} icon={service.icon} />
          ))}
        </div>
      </section>

      <section id="doctors" className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-4 text-2xl font-bold">Doctors</h2>
        <div className="grid gap-4 md:grid-cols-3">
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

      <section className="mx-auto max-w-7xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-muted-foreground">Emergency Desk</p>
              <p className="text-lg font-semibold text-danger">+91 1800-123-911</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-muted-foreground">Ambulance</p>
              <p className="text-lg font-semibold">+91 1800-500-102</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-muted-foreground">General Enquiries</p>
              <p className="text-lg font-semibold">+91 1800-500-110</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <Card className="border-primary/20 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Need a quick consultation?</h3>
              <p className="text-sm text-muted-foreground">Start your appointment request now.</p>
            </div>
            <AppointmentBookingModal triggerLabel="Book Appointment" />
          </CardContent>
        </Card>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-4 text-2xl font-bold">Contact</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-sm">
              <p className="font-semibold">Address</p>
              <p className="text-muted-foreground">123 Health Avenue, Bengaluru</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-sm">
              <p className="font-semibold">Email</p>
              <p className="text-muted-foreground">care@citycare.health</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-sm">
              <p className="font-semibold">Phone</p>
              <p className="text-muted-foreground">+91 1800-123-911</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-4 text-2xl font-bold">Testimonials</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Emergency team responded within minutes and explained every step clearly.",
            "My doctor was thorough, patient, and the digital reports were easy to access.",
            "Appointment booking and diagnostics were efficient and professional.",
          ].map((item) => (
            <Card key={item}>
              <CardContent className="pt-6 text-sm">"{item}"</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
