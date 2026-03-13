"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Clock3,
  HeartPulse,
  Pill,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { AppointmentStatusBadge } from "@/components/shared/appointment-status-badge";
import { DashboardSkeleton } from "@/features/dashboard/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { dashboardService } from "@/services/dashboard.service";
import { patientPortalService } from "@/services/patient-portal.service";
import { useAuthStore } from "@/store/auth-store";

const VitalsAnalyticsDashboard = dynamic(
  () => import("@/components/patient/vitals-analytics-dashboard"),
  { ssr: false },
);

function formatValue(value?: number | null, suffix = "") {
  return typeof value === "number" ? `${value}${suffix}` : "No reading";
}

function MetricCard({
  label,
  value,
  helper,
  icon,
  accent,
}: {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Card className="rounded-[1.7rem] border-border/80 bg-card/95 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.3)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className={`rounded-2xl p-3 ${accent}`}>{icon}</div>
          <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Live
          </span>
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}

function QuickLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <div className="group rounded-[1.5rem] border border-border bg-card/90 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="rounded-2xl border border-border bg-muted/50 p-3 text-foreground">{icon}</div>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
        </div>
        <p className="mt-4 text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

export default function PatientDashboardPage() {
  const dashboardQuery = useApi(dashboardService.getPatientMetrics);
  const vitalsQuery = useApi(patientPortalService.getVitals);
  const { user } = useAuthStore();

  useEffect(() => {
    void dashboardQuery.execute();
    void vitalsQuery.execute();
  }, [dashboardQuery.execute, vitalsQuery.execute]);

  const latestSugar = useMemo(
    () => vitalsQuery.data?.find((item) => typeof item.bloodSugar === "number")?.bloodSugar ?? null,
    [vitalsQuery.data],
  );
  const latestCholesterol = useMemo(
    () => vitalsQuery.data?.find((item) => typeof item.cholesterol === "number")?.cholesterol ?? null,
    [vitalsQuery.data],
  );
  const latestSpo2 = useMemo(
    () => vitalsQuery.data?.find((item) => typeof item.spo2 === "number")?.spo2 ?? null,
    [vitalsQuery.data],
  );

  if (dashboardQuery.loading || !dashboardQuery.data) {
    return <DashboardSkeleton />;
  }

  const data = dashboardQuery.data;
  const latestVitals = data.latestVitals;
  const nextAppointment = data.nextAppointment;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-border/80 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),linear-gradient(135deg,rgba(248,250,252,0.96),rgba(255,255,255,1),rgba(239,246,255,0.96))] shadow-[0_28px_80px_-42px_rgba(15,23,42,0.35)]">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Patient Analytics Hub
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Welcome back, {user?.name || "Patient"}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Monitor your clinical trends, manage appointments, and review prescriptions from a healthcare
                workspace designed like a modern hospital intelligence portal.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/patient/appointments/book">
                <Button className="h-11 rounded-xl px-6 font-semibold">
                  Book appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/patient/history">
                <Button variant="outline" className="h-11 rounded-xl px-6 font-semibold">
                  Open vitals analytics
                  <HeartPulse className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Upcoming appointments"
                value={String(data.upcomingAppointments)}
                helper="Confirmed and pending future visits"
                icon={<CalendarDays className="h-5 w-5 text-blue-700" />}
                accent="bg-blue-50 text-blue-700"
              />
              <MetricCard
                label="Active prescriptions"
                value={String(data.activePrescriptions)}
                helper="Current medications on your profile"
                icon={<Pill className="h-5 w-5 text-emerald-700" />}
                accent="bg-emerald-50 text-emerald-700"
              />
              <MetricCard
                label="Latest sugar"
                value={latestSugar !== null ? `${latestSugar} mg/dL` : "Awaiting data"}
                helper={latestVitals ? `Synced ${new Date(latestVitals.recordedAt).toLocaleDateString("en-IN")}` : "No sugar reading yet"}
                icon={<Sparkles className="h-5 w-5 text-violet-700" />}
                accent="bg-violet-50 text-violet-700"
              />
            </div>
          </div>

          <Card className="rounded-[1.8rem] border-border/80 bg-card/95 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.3)]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock3 className="h-5 w-5 text-primary" />
                Care command center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-[1.4rem] border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Next appointment</p>
                {nextAppointment ? (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          Dr. {nextAppointment.doctor?.name?.replace(/^Dr\.\s+/i, "") || "Assigned doctor"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {nextAppointment.doctor?.specialization || "Consultation"}
                          {nextAppointment.doctor?.department ? ` | ${nextAppointment.doctor.department}` : ""}
                        </p>
                      </div>
                      <AppointmentStatusBadge status={nextAppointment.status} />
                    </div>
                    <p className="text-sm font-medium text-foreground">{formatDateTime(nextAppointment.date)}</p>
                    <p className="text-sm text-muted-foreground">{nextAppointment.reason || "General consultation"}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">No appointment is scheduled yet.</p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Blood pressure</p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">{latestVitals?.bloodPressure || "No reading"}</p>
                </div>
                <div className="rounded-[1.4rem] border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Heart rate</p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">{formatValue(latestVitals?.heartRate, " bpm")}</p>
                </div>
                <div className="rounded-[1.4rem] border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Temperature</p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">{formatValue(latestVitals?.temperatureC, " C")}</p>
                </div>
                <div className="rounded-[1.4rem] border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">SpO2</p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">
                    {typeof latestVitals?.spo2 === "number"
                      ? `${latestVitals.spo2}%`
                      : latestSpo2 !== null
                        ? `${latestSpo2}%`
                        : "No reading"}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-border bg-card p-4 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Cholesterol</p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">
                    {typeof latestVitals?.cholesterol === "number"
                      ? `${latestVitals.cholesterol} mg/dL`
                      : latestCholesterol !== null
                        ? `${latestCholesterol} mg/dL`
                        : "No reading"}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-border bg-[linear-gradient(135deg,rgba(15,23,42,0.03),rgba(59,130,246,0.05))] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Clinical sync</p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {latestVitals ? formatDateTime(latestVitals.recordedAt) : "No vitals uploaded yet by your care team."}
                </p>
                {latestVitals?.notes ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{latestVitals.notes}</p> : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <QuickLink
          href="/dashboard/patient/appointments"
          title="Appointments"
          description="Track bookings, confirmations, and visit schedules."
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <QuickLink
          href="/dashboard/patient/prescriptions"
          title="Prescriptions"
          description="View premium prescription cards and download printable sheets."
          icon={<Pill className="h-5 w-5" />}
        />
        <QuickLink
          href="/dashboard/patient/history"
          title="Vitals Analytics"
          description="Open advanced medical indicator graphs with risk zones."
          icon={<HeartPulse className="h-5 w-5" />}
        />
        <QuickLink
          href="/dashboard/patient/profile"
          title="Profile"
          description="Update personal details and maintain your care profile."
          icon={<UserRound className="h-5 w-5" />}
        />
      </section>

      {vitalsQuery.data ? (
        <VitalsAnalyticsDashboard records={vitalsQuery.data} compact />
      ) : vitalsQuery.error ? (
        <Card className="rounded-[1.75rem] border-border/80">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Vitals analytics unavailable</p>
              <p className="text-sm text-muted-foreground">{vitalsQuery.error}</p>
              <Button type="button" variant="outline" onClick={() => void vitalsQuery.execute()}>
                Retry vitals load
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-[1.9rem] border-border/80 bg-card/95 shadow-[0_18px_55px_-32px_rgba(15,23,42,0.28)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-foreground">Recent prescriptions</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Hospital-styled medication cards with doctor context and medicine tables.
            </p>
          </div>
          <Link href="/dashboard/patient/prescriptions">
            <Button variant="outline" className="rounded-xl font-semibold">
              Open all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {data.recentPrescriptions.length ? (
            data.recentPrescriptions.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.6rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,0.9))] p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <Pill className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Active
                  </span>
                </div>
                <p className="mt-4 text-lg font-semibold text-foreground">{item.medication}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Dr. {item.doctor?.name || "Hospital team"}
                  {item.doctor?.specialization ? ` | ${item.doctor.specialization}` : ""}
                </p>
                <div className="mt-4 rounded-[1.2rem] border border-border bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Dosage</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{item.dosage}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Instructions</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.instructions}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-border bg-muted/20 p-8 text-sm text-muted-foreground lg:col-span-3">
              No prescriptions have been issued yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
