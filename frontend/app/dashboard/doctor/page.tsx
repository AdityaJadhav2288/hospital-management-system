"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  CalendarCheck2,
  ClipboardPlus,
  Database,
  HeartPulse,
  ShieldPlus,
  Stethoscope,
  Users,
} from "lucide-react";
import { AppointmentStatusBadge } from "@/components/shared/appointment-status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardSkeleton } from "@/features/dashboard/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { appointmentsService } from "@/services/appointments.service";
import { dashboardService } from "@/services/dashboard.service";
import { doctorPortalService } from "@/services/doctor-portal.service";

function toLocalDateTimeInputValue(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function numericOrUndefined(value: FormDataEntryValue | null) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) {
    return undefined;
  }

  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export default function DoctorDashboardPage() {
  const metricsQuery = useApi(dashboardService.getDoctorMetrics);
  const appointmentsQuery = useApi(appointmentsService.list);
  const patientsQuery = useApi(doctorPortalService.getPatients);
  const patientVitalsQuery = useApi(doctorPortalService.getPatientVitals);

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [recordedAt, setRecordedAt] = useState(() => toLocalDateTimeInputValue(new Date()));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void metricsQuery.execute();
    void appointmentsQuery.execute({ page: 1, pageSize: 100, status: "all" });
    void patientsQuery.execute();
  }, [metricsQuery.execute, appointmentsQuery.execute, patientsQuery.execute]);

  useEffect(() => {
    const firstPatientId = patientsQuery.data?.[0]?.id;
    if (!selectedPatientId && firstPatientId) {
      setSelectedPatientId(firstPatientId);
    }
  }, [patientsQuery.data, selectedPatientId]);

  useEffect(() => {
    if (!selectedPatientId) {
      return;
    }

    void patientVitalsQuery.execute(selectedPatientId);
  }, [selectedPatientId, patientVitalsQuery.execute]);

  const metrics = metricsQuery.data;
  const appointments = appointmentsQuery.data?.items || [];
  const patients = patientsQuery.data || [];
  const vitals = patientVitalsQuery.data || [];

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

  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) || null;

  if (metricsQuery.loading || !metrics) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Dashboard" description="Full consultation queue, upcoming visits, and advanced patient vitals recording" />

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
                  <p className="text-sm text-emerald-700">Appointments, prescriptions, and patient vitals are loading from live API data.</p>
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

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[1.85rem] border-slate-200 shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-rose-600" />
              Record Patient Vitals
            </CardTitle>
            <p className="text-sm text-slate-500">
              Add advanced clinical vitals including sugar, cholesterol, blood pressure, temperature, SpO2, and body measurements.
            </p>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault();
                const formElement = event.currentTarget;
                const patientId = selectedPatientId;
                const submittedAt = recordedAt;
                const form = new FormData(formElement);

                if (!patientId) {
                  toast.error("Select a patient before recording vitals.");
                  return;
                }

                setSubmitting(true);
                try {
                  await doctorPortalService.createVitals({
                    patientId,
                    recordedAt: submittedAt,
                    bloodSugar: numericOrUndefined(form.get("bloodSugar")),
                    heartRate: numericOrUndefined(form.get("heartRate")),
                    cholesterol: numericOrUndefined(form.get("cholesterol")),
                    bpSystolic: numericOrUndefined(form.get("bpSystolic")),
                    bpDiastolic: numericOrUndefined(form.get("bpDiastolic")),
                    temperatureC: numericOrUndefined(form.get("temperatureC")),
                    spo2: numericOrUndefined(form.get("spo2")),
                    weightKg: numericOrUndefined(form.get("weightKg")),
                    heightCm: numericOrUndefined(form.get("heightCm")),
                    notes: String(form.get("notes") || "").trim() || undefined,
                  });

                  toast.success("Patient vitals recorded successfully.");
                  formElement.reset();
                  setRecordedAt(toLocalDateTimeInputValue(new Date()));
                  void patientVitalsQuery.execute(patientId);
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Unable to save patient vitals");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div className="space-y-2 md:col-span-2">
                <Label>Patient</Label>
                <select
                  value={selectedPatientId}
                  onChange={(event) => setSelectedPatientId(event.target.value)}
                  className="flex h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Date</Label>
                <Input type="datetime-local" value={recordedAt} onChange={(event) => setRecordedAt(event.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Blood Sugar (mg/dL)</Label>
                <Input name="bloodSugar" type="number" min="1" placeholder="110" />
              </div>
              <div className="space-y-2">
                <Label>Heart Rate (bpm)</Label>
                <Input name="heartRate" type="number" min="1" placeholder="78" />
              </div>
              <div className="space-y-2">
                <Label>Cholesterol (mg/dL)</Label>
                <Input name="cholesterol" type="number" min="1" placeholder="185" />
              </div>
              <div className="space-y-2">
                <Label>Oxygen Saturation (SpO2)</Label>
                <Input name="spo2" type="number" min="1" max="100" placeholder="98" />
              </div>
              <div className="space-y-2">
                <Label>Blood Pressure Systolic</Label>
                <Input name="bpSystolic" type="number" min="1" placeholder="120" />
              </div>
              <div className="space-y-2">
                <Label>Blood Pressure Diastolic</Label>
                <Input name="bpDiastolic" type="number" min="1" placeholder="80" />
              </div>
              <div className="space-y-2">
                <Label>Body Temperature (°C)</Label>
                <Input name="temperatureC" type="number" min="1" step="0.1" placeholder="36.8" />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input name="weightKg" type="number" min="1" step="0.1" placeholder="68.5" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Height (cm)</Label>
                <Input name="heightCm" type="number" min="1" step="0.1" placeholder="172" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Notes</Label>
                <Textarea name="notes" placeholder="Clinical observations, fasting state, symptoms, or medication context" />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full" loading={submitting} disabled={submitting || !selectedPatientId}>
                  Save patient vitals
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-[1.85rem] border-slate-200 shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <ShieldPlus className="h-5 w-5 text-blue-600" />
              Recent Clinical Vitals
            </CardTitle>
            <p className="text-sm text-slate-500">
              Latest measurements for {selectedPatient?.name || "the selected patient"} to confirm chart-ready monitoring data.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPatientId && vitals.length ? (
              vitals.slice(0, 5).map((vital) => (
                <div key={vital.id} className="rounded-[1.4rem] border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{formatDateTime(vital.recordedAt)}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Sugar {vital.bloodSugar ?? "-"} · HR {vital.heartRate ?? "-"} · Chol {vital.cholesterol ?? "-"}
                      </p>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {vital.bloodPressure || `${vital.bpSystolic ?? "-"} / ${vital.bpDiastolic ?? "-"}`}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p>Temperature: {vital.temperatureC ?? "-"} °C</p>
                    <p>SpO2: {vital.spo2 ?? "-"}%</p>
                    <p>Weight: {vital.weightKg ?? "-"} kg</p>
                    <p>Height: {vital.heightCm ?? "-"} cm</p>
                  </div>
                  {vital.notes ? <p className="mt-3 text-sm leading-6 text-slate-600">{vital.notes}</p> : null}
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                {selectedPatientId
                  ? "No vitals recorded yet for this patient."
                  : "Choose a patient to review recent vitals."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
