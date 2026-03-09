"use client";

import { useEffect, useMemo, useState } from "react";
import { DoctorCard } from "@/components/DoctorCard";
import { AppointmentBookingModal } from "@/components/public/appointment-booking-modal";
import { PublicShell } from "@/components/public/public-shell";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { publicService } from "@/services/public.service";

export default function DoctorsPage() {
  const [specialty, setSpecialty] = useState("");
  const { data, execute, loading } = useApi(publicService.getDoctors);

  useEffect(() => {
    void execute(specialty || undefined);
  }, [execute, specialty]);

  const doctors = useMemo(() => (Array.isArray(data) ? data.filter(Boolean) : []), [data]);

  return (
    <PublicShell>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_42%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.18)] backdrop-blur md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
                Doctor Directory
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Meet our predefined specialist panel
              </h1>
              <p className="text-base text-slate-600">
                Browse the hospital's seeded doctors, compare specializations and experience, and book directly from the patient portal.
              </p>
            </div>

            <div className="w-full max-w-sm space-y-3">
              <Input
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                className="h-12 border-slate-200 bg-white"
                placeholder="Search specialization or department..."
                autoComplete="off"
              />
              <AppointmentBookingModal triggerLabel="Open Booking Portal" triggerClassName="h-12 w-full" />
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {loading ? "Loading doctors..." : `${doctors.length} doctors available`}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {doctors?.filter(Boolean).map((doctor) => (
              <DoctorCard
                key={doctor?.id || `${doctor?.email || "doctor"}-${doctor?.name || "unknown"}`}
                id={doctor?.id}
                name={doctor?.name || "Doctor"}
                specialization={doctor?.specialization || "General Specialist"}
                experienceYears={doctor?.experienceYears ?? 0}
                department={doctor?.department || ""}
                phone={doctor?.phone || ""}
                email={doctor?.email || ""}
                onBook={(doctorId) => {
                  window.location.href = `/patient/appointments/book?doctorId=${encodeURIComponent(doctorId)}`;
                }}
              />
            ))}
          </div>

          {!loading && doctors.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white/70 p-12 text-center">
              <h2 className="text-xl font-semibold text-slate-900">No doctors found</h2>
              <p className="mt-2 text-sm text-slate-500">
                Try another search term or run the doctor seed script to populate the hospital directory.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </PublicShell>
  );
}
