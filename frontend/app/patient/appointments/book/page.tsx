"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { appointmentsService } from "@/services/appointments.service";
import { useAuthStore } from "@/store/auth-store";
import type { Doctor } from "@/types/doctor";

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

function DoctorCard({
  doctor,
  actionLabel,
  onAction,
}: {
  doctor: Doctor;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base text-slate-900 truncate">{doctor.name}</CardTitle>
            <CardDescription className="mt-1 text-sm text-slate-600">
              {doctor.specialization}
            </CardDescription>
          </div>
          <Badge className="shrink-0" tone="default">
            {doctor.department || "Department"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs text-slate-500">Experience</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {doctor.experienceYears} yrs
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs text-slate-500">Department</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 truncate">
              {doctor.department || "—"}
            </p>
          </div>
        </div>

        <Button className="w-full h-10" onClick={onAction}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function PatientAppointmentBookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId") || "";

  const { user } = useAuthStore();

  const { data: doctors, loading: doctorsLoading, error: doctorsError, execute: loadDoctors } = useApi(
    appointmentsService.listDoctors,
  );

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    if (doctorsError) toast.error(doctorsError);
  }, [doctorsError]);

  const normalizedDoctors = useMemo(() => (Array.isArray(doctors) ? doctors : []), [doctors]);

  const filteredDoctors = useMemo(() => {
    if (!search.trim()) return normalizedDoctors;
    const term = search.toLowerCase();
    return normalizedDoctors.filter((d) =>
      [d.name, d.specialization, d.department].filter(Boolean).some((v) => String(v).toLowerCase().includes(term)),
    );
  }, [normalizedDoctors, search]);

  const selectedDoctor = useMemo(
    () => normalizedDoctors.find((d) => d.id === doctorId),
    [doctorId, normalizedDoctors],
  );

  useEffect(() => {
    if (doctorId && !doctorsLoading && normalizedDoctors.length > 0 && !selectedDoctor) {
      toast.error("Selected doctor not found. Please choose another doctor.");
      router.replace("/patient/appointments/book");
    }
  }, [doctorId, doctorsLoading, normalizedDoctors.length, router, selectedDoctor]);

  const submitDisabled = !selectedDoctor || !date || !time || reason.trim().length < 4 || submitting;

  const handleConfirm = async () => {
    if (!selectedDoctor) return;
    if (!user?.id) {
      toast.error("Please sign in to book an appointment.");
      router.push(`/login/patient?redirect=${encodeURIComponent(`/patient/appointments/book?doctorId=${selectedDoctor.id}`)}`);
      return;
    }

    setSubmitting(true);
    try {
      const dateTime = `${date}T${time}`;
      await appointmentsService.book({
        doctorId: selectedDoctor.id,
        patientId: user.id,
        dateTime,
        time,
        reason: reason.trim(),
      });
      toast.success("Appointment booked successfully");
      router.push("/dashboard/patient/appointments");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_42%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="mb-6 md:mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Appointments</p>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">Book an appointment</h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl">
            Choose a specialist, select a time slot, and confirm your visit in under a minute.
          </p>
        </div>

        {!doctorId ? (
          <Card className="rounded-[1.75rem] border-white/70 bg-white/80 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.16)] backdrop-blur">
            <CardHeader className="p-5 md:p-7 space-y-3">
              <CardTitle className="text-lg md:text-xl">Step 1: Select a doctor</CardTitle>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <CardDescription className="text-sm md:text-base">
                  Pick a specialist to continue to booking details.
                </CardDescription>
                <div className="w-full md:max-w-sm">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, specialty, or department..."
                    className="h-11 bg-white"
                    autoComplete="off"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 md:p-7 pt-0">
              {doctorsLoading ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-56 rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      actionLabel="Book Appointment"
                      onAction={() => {
                        router.push(`/patient/appointments/book?doctorId=${encodeURIComponent(doctor.id)}`);
                      }}
                    />
                  ))}
                </div>
              )}

              {!doctorsLoading && filteredDoctors.length === 0 && (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
                  <h2 className="text-lg font-semibold text-slate-900">No doctors found</h2>
                  <p className="mt-2 text-sm text-slate-600">Try a different search term.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
            <div className="lg:sticky lg:top-6">
              {selectedDoctor ? (
                <DoctorCard
                  doctor={selectedDoctor}
                  actionLabel="Change doctor"
                  onAction={() => router.push("/patient/appointments/book")}
                />
              ) : (
                <Skeleton className="h-56 rounded-2xl" />
              )}
            </div>

            <Card className="rounded-[1.75rem] border-white/70 bg-white/80 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.16)] backdrop-blur">
              <CardHeader className="p-5 md:p-7 space-y-2">
                <CardTitle className="text-lg md:text-xl">Step 2: Appointment details</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Choose a date, pick a slot, and tell us the reason for your visit.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 md:p-7 pt-0 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-11 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time slot</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger className="h-11 bg-white">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe symptoms or purpose of visit..."
                    className="bg-white"
                  />
                  {reason.trim().length > 0 && reason.trim().length < 4 && (
                    <p className="text-xs font-medium text-red-500">Please enter at least 4 characters.</p>
                  )}
                </div>

                <div className="hidden sm:block">
                  <Button
                    className="h-11 w-full sm:w-auto px-6"
                    onClick={handleConfirm}
                    disabled={submitDisabled}
                    loading={submitting}
                  >
                    Confirm Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {doctorId && (
        <div className="sm:hidden fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <Button className="h-12 w-full" onClick={handleConfirm} disabled={submitDisabled} loading={submitting}>
              Confirm Appointment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
