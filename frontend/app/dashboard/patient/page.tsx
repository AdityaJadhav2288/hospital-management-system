"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  Activity,
  ArrowRight,
  CalendarCheck2,
  ClipboardList,
  FileText,
  Sparkles,
} from "lucide-react";
import { DashboardSkeleton } from "@/features/dashboard/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { dashboardService } from "@/services/dashboard.service";
import { useAuthStore } from "@/store/auth-store";

export default function PatientDashboardPage() {
  const { data, loading, execute } = useApi(dashboardService.getPatientMetrics);
  const { user } = useAuthStore();

  useEffect(() => {
    void execute();
  }, [execute]);

  if (loading || !data) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_36%),linear-gradient(135deg,#ffffff_0%,#eff8ff_55%,#ecfeff_100%)] shadow-[0_24px_70px_-30px_rgba(2,132,199,0.45)]">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.3fr_0.9fr] lg:px-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
              <Sparkles size={16} />
              Patient portal
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                Manage appointments, track ongoing care, and keep your medical records in one place with a faster patient workflow.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/patient/appointments?book=1">
                <Button className="h-11 px-5">
                  Book Appointment
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
              <Link href="/dashboard/patient/profile">
                <Button variant="outline" className="h-11 px-5">
                  Update Profile
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
              <p className="text-sm text-slate-500">Upcoming appointments</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{data.upcomingAppointments}</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
              <p className="text-sm text-slate-500">Active prescriptions</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{data.activePrescriptions}</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
              <p className="text-sm text-slate-500">Completed visits</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{data.totalVisits}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
              <CalendarCheck2 size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Upcoming Appointments</p>
              <p className="text-2xl font-semibold text-slate-900">{data.upcomingAppointments}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Prescriptions</p>
              <p className="text-2xl font-semibold text-slate-900">{data.activePrescriptions}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Visits</p>
              <p className="text-2xl font-semibold text-slate-900">{data.totalVisits}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Link href="/dashboard/patient/appointments">
            <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
              Manage Appointments
              <CalendarCheck2 size={16} />
            </Button>
          </Link>
          <Link href="/dashboard/patient/prescriptions">
            <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
              View Prescriptions
              <FileText size={16} />
            </Button>
          </Link>
          <Link href="/dashboard/patient/history">
            <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
              Vitals & History
              <ClipboardList size={16} />
            </Button>
          </Link>
          <Link href="/dashboard/patient/reports">
            <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
              Reports
              <ArrowRight size={16} />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
