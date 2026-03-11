"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Activity, CalendarCheck2, ClipboardPlus, Database, Stethoscope, Users } from "lucide-react";
import { AppointmentStatusBadge } from "@/components/shared/appointment-status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardSkeleton } from "@/features/dashboard/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { appointmentsService } from "@/services/appointments.service";
import { dashboardService } from "@/services/dashboard.service";

export default function DoctorDashboardPage() {
  const metricsQuery = useApi(dashboardService.getDoctorMetrics);
  const appointmentsQuery = useApi(appointmentsService.list);

  useEffect(() => {
    void metricsQuery.execute();
    void appointmentsQuery.execute({ page: 1, pageSize: 100, status: "all" });
  }, [metricsQuery.execute, appointmentsQuery.execute]);

  const metrics = metricsQuery.data;
  const appointments = appointmentsQuery.data?.items || [];

  const summary = useMemo(() => {
    const now = Date.now();
    return {
      upcoming: appointments.filter((item) => new Date(item.dateTime).getTime() >= now && item.status !== "CANCELLED").length,
      completed: appointments.filter((item) => item.status === "COMPLETED").length,
      latest: appointments
        .slice()
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
        .slice(0, 5),
    };
  }, [appointments]);

  if (metricsQuery.loading || !metrics) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Dashboard" description="Full consultation queue, upcoming visits, and live patient workflow" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Today's Appointments" value={String(metrics.todaysAppointments)} icon={<CalendarCheck2 size={18} />} />
        <StatCard title="Pending Queue" value={String(metrics.pendingQueue)} icon={<ClipboardPlus size={18} />} />
        <StatCard title="Upcoming Appointments" value={String(summary.upcoming)} icon={<Activity size={18} />} />
        <StatCard title="Unique Patients" value={String(metrics.totalPatients)} icon={<Users size={18} />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Doctor queue</CardTitle>
            <Link href="/dashboard/doctor/appointments">
              <Button variant="outline">Open appointments</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.latest.length ? (
              summary.latest.map((appointment) => (
                <div key={appointment.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{appointment.patientName}</p>
                      <p className="text-sm text-slate-500">
                        {formatDateTime(appointment.dateTime)} · {appointment.patientPhone || "No phone"}
                      </p>
                    </div>
                    <AppointmentStatusBadge status={appointment.status} />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{appointment.reason}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                    Dr. workflow live from database
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
                No appointments found for this doctor.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>System status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <Database size={18} />
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">Database connected</p>
                  <p className="text-sm text-emerald-700">Doctor metrics and appointments are loading from live API data.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              <Link href="/dashboard/doctor/appointments">
                <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
                  Consultation queue
                  <Stethoscope size={16} />
                </Button>
              </Link>
              <Link href="/dashboard/doctor/patients">
                <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
                  Patient history
                  <Users size={16} />
                </Button>
              </Link>
              <Link href="/dashboard/doctor/prescriptions">
                <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
                  Prescription management
                  <ClipboardPlus size={16} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
