"use client";

import { useEffect, useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, ClipboardList, HeartPulse, Thermometer } from "lucide-react";
import { AppointmentStatusBadge } from "@/components/shared/appointment-status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { patientPortalService } from "@/services/patient-portal.service";

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">{icon}</div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-xl font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function PatientHistoryPage() {
  const { data, execute } = useApi(patientPortalService.getHistory);

  useEffect(() => {
    void execute();
  }, [execute]);

  const vitalsSeries = useMemo(
    () =>
      (data?.vitals || [])
        .slice()
        .reverse()
        .map((item) => {
          const [systolic] = (item.bloodPressure || "").split("/");
          return {
            date: new Date(item.recordedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
            weight: item.weightKg ?? null,
            heartRate: item.pulseRate ?? null,
            temperature: item.temperatureC ?? null,
            systolic: Number(systolic) || null,
          };
        }),
    [data?.vitals],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Vitals & History" description="Weight, blood pressure, heart rate, temperature, and visit timeline" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile icon={<Activity size={20} />} label="Vitals records" value={String(data?.vitals.length || 0)} />
        <StatTile icon={<ClipboardList size={20} />} label="Visit notes" value={String(data?.visitNotes.length || 0)} />
        <StatTile icon={<HeartPulse size={20} />} label="Appointments" value={String(data?.appointments.length || 0)} />
        <StatTile icon={<Thermometer size={20} />} label="Reports" value={String(data?.reports.length || 0)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Weight trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitalsSeries}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="weight" stroke="#0f766e" strokeWidth={3} dot={false} name="Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Blood pressure</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitalsSeries}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="systolic" stroke="#2563eb" strokeWidth={3} dot={false} name="Systolic BP" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Heart rate</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitalsSeries}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="heartRate" stroke="#dc2626" strokeWidth={3} dot={false} name="Heart rate (bpm)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Temperature</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitalsSeries}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line dataKey="temperature" stroke="#f59e0b" strokeWidth={3} dot={false} name="Temperature (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Visit notes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data?.visitNotes.length ? (
              data.visitNotes.map((note) => (
                <div key={note.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{note.diagnosis}</p>
                      <p className="text-sm text-slate-500">
                        Dr. {note.doctor?.name || "Hospital team"} · {formatDateTime(note.createdAt)}
                      </p>
                    </div>
                    {note.appointment ? <AppointmentStatusBadge status={note.appointment.status} /> : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{note.notes || "No additional visit notes."}</p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                No doctor visit notes available yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Appointment history</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data?.appointments.length ? (
              data.appointments.map((appointment) => (
                <div key={appointment.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{appointment.reason || "Consultation"}</p>
                      <p className="text-sm text-slate-500">
                        {formatDateTime(appointment.date)} · Dr. {appointment.doctor?.name || "Hospital team"}
                      </p>
                    </div>
                    <AppointmentStatusBadge status={appointment.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                No appointment history found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
