"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Clock,
  ClipboardList,
  FileHeart,
  HeartPulse,
  Pill,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { AppointmentStatusBadge } from "@/components/shared/appointment-status-badge";
import { DashboardSkeleton } from "@/features/dashboard/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { cn, formatDateTime } from "@/lib/utils";
import { dashboardService } from "@/services/dashboard.service";
import { useAuthStore } from "@/store/auth-store";

function VitalValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:shadow-md transition-shadow duration-300">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number;
  color: 'blue' | 'green' | 'purple' | 'amber';
}) {
  const colorMap = {
    blue: { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600', accent: 'bg-blue-500' },
    green: { bg: 'from-green-50 to-emerald-50', border: 'border-green-200', icon: 'bg-green-100 text-green-600', accent: 'bg-green-500' },
    purple: { bg: 'from-purple-50 to-violet-50', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-600', accent: 'bg-purple-500' },
    amber: { bg: 'from-amber-50 to-orange-50', border: 'border-amber-200', icon: 'bg-amber-100 text-amber-600', accent: 'bg-amber-500' },
  };

  const colors = colorMap[color];

  return (
    <Card className={cn(
      "rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 cursor-default group",
      `bg-gradient-to-br ${colors.bg}`,
      colors.border
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("rounded-lg p-3 group-hover:scale-110 transition-transform duration-300", colors.icon)}>
            {icon}
          </div>
          <div className={cn("h-1 w-12 rounded-full group-hover:w-16 transition-all duration-300", colors.accent)}></div>
        </div>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="mt-2 text-4xl font-bold text-slate-900">{value}</p>
      </CardContent>
    </Card>
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
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50 shadow-md">
        <div className="grid gap-8 px-6 py-10 lg:grid-cols-[1.3fr_1fr] lg:px-10">
          <div className="space-y-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 px-4 py-2 w-fit text-sm font-semibold text-blue-700">
              <HeartPulse size={16} className="text-blue-600" />
              Welcome back
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                Health overview for {user?.name || "your account"}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-600">
                Track your appointments, monitor vitals, manage prescriptions, and access medical reports in one secure workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/patient/appointments/book">
                <Button className="h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold shadow-sm hover:shadow-lg transition-all">
                  Book appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/patient/reports">
                <Button variant="outline" className="h-11 px-6 rounded-lg font-semibold border-slate-300 hover:bg-slate-50 transition-colors">
                  View reports
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <Card className="rounded-lg border border-slate-200 bg-white shadow-lg">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                Next appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              {nextAppointment ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-bold">
                        {nextAppointment.doctor?.name?.charAt(0).toUpperCase() || 'D'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-slate-900">
                        Dr. {nextAppointment.doctor?.name?.replace(/^Dr\.\s+/i, '') || "Assigned doctor"}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        {nextAppointment.doctor?.specialization || "Consultation"} {nextAppointment.doctor?.department && `· ${nextAppointment.doctor.department}`}
                      </p>
                    </div>
                    <AppointmentStatusBadge status={nextAppointment.status} />
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-slate-700">
                      <CalendarDays className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{formatDateTime(nextAppointment.date)}</p>
                      </div>
                    </div>
                    {nextAppointment.reason && (
                      <div className="flex gap-3 text-slate-700">
                        <span className="text-xs font-medium text-slate-500 flex-shrink-0 pt-1">Reason:</span>
                        <p className="font-semibold">{nextAppointment.reason || "General consultation"}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-slate-700">
                      <span className="text-xs font-medium text-slate-500 flex-shrink-0">Contact:</span>
                      <p className="font-semibold">{nextAppointment.doctor?.phone || "Reception desk"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600">No upcoming appointment scheduled yet.</p>
                  <Link href="/patient/appointments/book" className="block mt-4">
                    <Button variant="outline" size="sm" className="mx-auto rounded-lg font-semibold">
                      Schedule one now
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          icon={<CalendarDays className="h-6 w-6" />}
          label="Upcoming appointments"
          value={data.upcomingAppointments}
          color="blue"
        />
        <StatCard 
          icon={<Pill className="h-6 w-6" />}
          label="Active prescriptions"
          value={data.activePrescriptions}
          color="green"
        />
        <StatCard 
          icon={<Activity className="h-6 w-6" />}
          label="Completed visits"
          value={data.totalVisits}
          color="purple"
        />
        <StatCard 
          icon={<FileHeart className="h-6 w-6" />}
          label="Reports uploaded"
          value={data.reportCount}
          color="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="rounded-lg border border-slate-200 shadow-md">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-red-500" />
              Latest vitals
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid gap-4 md:grid-cols-2">
            <VitalValue label="Weight" value={latestVitals?.weightKg ? `${latestVitals.weightKg} kg` : "-"} />
            <VitalValue label="Blood Pressure" value={latestVitals?.bloodPressure || "-"} />
            <VitalValue label="Heart Rate" value={latestVitals?.pulseRate ? `${latestVitals.pulseRate} bpm` : "-"} />
            <VitalValue label="Temperature" value={latestVitals?.temperatureC ? `${latestVitals.temperatureC} °C` : "-"} />
            <div className="md:col-span-2 rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 text-sm">
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                <Clock className="h-4 w-4 text-slate-500" />
                Last updated
              </div>
              <p className="text-slate-600">{latestVitals ? formatDateTime(latestVitals.recordedAt) : "No vitals recorded yet"}</p>
              {latestVitals?.notes && (
                <p className="mt-3 text-slate-600 bg-blue-50 p-3 rounded border border-blue-200 border-l-4 border-l-blue-500 italic">{latestVitals.notes}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-slate-200 shadow-md">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5 text-blue-600" />
              Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 grid gap-3">
            <Link href="/dashboard/patient/appointments">
              <Button variant="outline" className="h-11 w-full justify-between rounded-lg font-semibold border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all">
                Manage appointments
                <CalendarDays size={18} />
              </Button>
            </Link>
            <Link href="/dashboard/patient/prescriptions">
              <Button variant="outline" className="h-11 w-full justify-between rounded-lg font-semibold border-slate-200 hover:bg-green-50 hover:border-green-300 transition-all">
                View prescriptions
                <Pill size={18} />
              </Button>
            </Link>
            <Link href="/dashboard/patient/history">
              <Button variant="outline" className="h-11 w-full justify-between rounded-lg font-semibold border-slate-200 hover:bg-purple-50 hover:border-purple-300 transition-all">
                Vitals & history
                <ClipboardList size={18} />
              </Button>
            </Link>
            <Link href="/dashboard/patient/profile">
              <Button variant="outline" className="h-11 w-full justify-between rounded-lg font-semibold border-slate-200 hover:bg-amber-50 hover:border-amber-300 transition-all">
                Update profile
                <Stethoscope size={18} />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-lg border border-slate-200 shadow-md">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-green-600" />
            Recent prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid gap-4 lg:grid-cols-3">
          {data.recentPrescriptions.length ? (
            data.recentPrescriptions.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 flex-shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{item.medication}</p>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md inline-block mb-3">{item.dosage}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{item.instructions}</p>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 border-t border-slate-200 pt-3">
                  Dr. {item.doctor?.name || "Hospital team"}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center lg:col-span-3">
              <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">No prescriptions added yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
