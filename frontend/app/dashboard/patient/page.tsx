"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  ClipboardList,
  FileHeart,
  HeartPulse,
  Pill,
  Stethoscope,
} from "lucide-react";
import { AppointmentStatusBadge } from "@/components/shared/appointment-status-badge";
import { DashboardSkeleton } from "@/features/dashboard/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { dashboardService } from "@/services/dashboard.service";
import { useAuthStore } from "@/store/auth-store";

function VitalValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function PatientDashboardPage() {
  const { data, loading, execute } = useApi(dashboardService.getPatientMetrics);
  const { user } = useAuthStore();

  useEffect(() => {
    void execute();
  }, [execute]);

  if (loading || !data) return <DashboardSkeleton />;

  const latestVitals = data.latestVitals;
  const nextAppointment = data.nextAppointment;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_32%),linear-gradient(135deg,#ffffff_0%,#effdf5_52%,#f0fdfa_100%)] shadow-[0_24px_70px_-30px_rgba(5,150,105,0.35)]">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.25fr_0.95fr] lg:px-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
              <HeartPulse size={16} />
              Patient care hub
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Health overview for {user?.name || "your account"}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                Stay on top of appointments, latest vitals, prescriptions, and reports from one patient workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/patient/appointments/book">
                <Button className="h-11 px-5">
                  Book appointment
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
              <Link href="/dashboard/patient/reports">
                <Button variant="outline" className="h-11 px-5">
                  View reports
                </Button>
              </Link>
            </div>
          </div>

          <Card className="rounded-[1.75rem] border-white/70 bg-white/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Next appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextAppointment ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        Dr. {nextAppointment.doctor?.name || "Assigned doctor"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {nextAppointment.doctor?.specialization || "Consultation"} · {nextAppointment.doctor?.department || "Hospital care"}
                      </p>
                    </div>
                    <AppointmentStatusBadge status={nextAppointment.status} />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                    <p className="font-medium text-slate-900">{formatDateTime(nextAppointment.date)}</p>
                    <p className="mt-1 text-slate-600">{nextAppointment.reason || "General consultation"}</p>
                    <p className="mt-2 text-slate-500">Contact: {nextAppointment.doctor?.phone || "Reception desk"}</p>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  No upcoming appointment scheduled yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
              <CalendarDays size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Upcoming appointments</p>
              <p className="text-2xl font-semibold text-slate-900">{data.upcomingAppointments}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <Pill size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Prescription summary</p>
              <p className="text-2xl font-semibold text-slate-900">{data.activePrescriptions}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
              <Activity size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Completed visits</p>
              <p className="text-2xl font-semibold text-slate-900">{data.totalVisits}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
              <FileHeart size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Reports uploaded</p>
              <p className="text-2xl font-semibold text-slate-900">{data.reportCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Latest vitals</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <VitalValue label="Weight" value={latestVitals?.weightKg ? `${latestVitals.weightKg} kg` : "-"} />
            <VitalValue label="Blood Pressure" value={latestVitals?.bloodPressure || "-"} />
            <VitalValue label="Heart Rate" value={latestVitals?.pulseRate ? `${latestVitals.pulseRate} bpm` : "-"} />
            <VitalValue label="Temperature" value={latestVitals?.temperatureC ? `${latestVitals.temperatureC} °C` : "-"} />
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Last updated</p>
              <p className="mt-1">{latestVitals ? formatDateTime(latestVitals.recordedAt) : "No vitals recorded yet"}</p>
              <p className="mt-2">{latestVitals?.notes || "Your latest doctor-recorded notes will appear here."}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/dashboard/patient/appointments">
              <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
                Manage appointments
                <CalendarDays size={16} />
              </Button>
            </Link>
            <Link href="/dashboard/patient/prescriptions">
              <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
                View prescriptions
                <Pill size={16} />
              </Button>
            </Link>
            <Link href="/dashboard/patient/history">
              <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
                Vitals & history
                <ClipboardList size={16} />
              </Button>
            </Link>
            <Link href="/dashboard/patient/profile">
              <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
                Update profile
                <Stethoscope size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Recent prescriptions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {data.recentPrescriptions.length ? (
            data.recentPrescriptions.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">{item.medication}</p>
                <p className="mt-1 text-sm text-slate-500">{item.dosage}</p>
                <p className="mt-3 text-sm text-slate-600">{item.instructions}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Dr. {item.doctor?.name || "Hospital team"}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 lg:col-span-3">
              No prescriptions added yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
