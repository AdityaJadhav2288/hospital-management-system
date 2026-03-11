"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ClipboardPenLine, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AppointmentStatusBadge } from "@/components/shared/appointment-status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { appointmentsService } from "@/services/appointments.service";
import { doctorPortalService } from "@/services/doctor-portal.service";
import type { Appointment } from "@/types/appointment";

const emptyConsultation = {
  diagnosis: "",
  visitNotes: "",
  weightKg: "",
  heightCm: "",
  bloodPressure: "",
  pulseRate: "",
  temperatureC: "",
  vitalsNotes: "",
  medicationName: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

function normalizeTemperatureInput(value: string) {
  if (!value.trim()) {
    return undefined;
  }

  const parsedValue = Number(value);
  if (Number.isNaN(parsedValue)) {
    return undefined;
  }

  if (parsedValue > 45 && parsedValue <= 115) {
    return Number((((parsedValue - 32) * 5) / 9).toFixed(1));
  }

  return parsedValue;
}

function getTemperatureHint(value: string) {
  const normalizedValue = normalizeTemperatureInput(value);
  if (!value.trim() || normalizedValue === undefined) {
    return "Enter Celsius directly. Fahrenheit values like 98.6 are also accepted.";
  }

  const parsedValue = Number(value);
  if (parsedValue > 45 && parsedValue <= 115) {
    return `Fahrenheit detected. This will be stored as ${normalizedValue.toFixed(1)} C.`;
  }

  return "Temperature is stored in Celsius.";
}

export default function DoctorAppointmentsPage() {
  const { data, execute } = useApi(appointmentsService.list);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "completed">("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyConsultation);

  useEffect(() => {
    void execute({ page: 1, pageSize: 100, status: "all" });
  }, [execute]);

  const appointments = useMemo(() => {
    const rows = data?.items || [];
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    return rows.filter((item) => {
      const matchesSearch =
        !search ||
        item.patientName.toLowerCase().includes(search.toLowerCase()) ||
        item.reason.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      const appointmentTime = new Date(item.dateTime).getTime();
      if (filter === "today") return appointmentTime >= startOfDay.getTime() && appointmentTime <= endOfDay.getTime();
      if (filter === "upcoming") return appointmentTime > endOfDay.getTime() && item.status !== "COMPLETED" && item.status !== "CANCELLED";
      if (filter === "completed") return item.status === "COMPLETED" || item.status === "CANCELLED";
      return true;
    });
  }, [data?.items, filter, search]);

  const stats = useMemo(() => {
    const source = data?.items || [];
    return {
      total: source.length,
      pending: source.filter((item) => item.status === "PENDING").length,
      confirmed: source.filter((item) => item.status === "CONFIRMED").length,
      completed: source.filter((item) => item.status === "COMPLETED").length,
    };
  }, [data?.items]);

  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Appointments" description="All appointments for this doctor, with consultation workflow and clean queue filters" />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="All" value={stats.total} />
        <MetricCard title="Pending" value={stats.pending} />
        <MetricCard title="Confirmed" value={stats.confirmed} />
        <MetricCard title="Completed" value={stats.completed} />
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search patient or symptoms" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "today", label: "Today" },
              { key: "upcoming", label: "Upcoming" },
              { key: "completed", label: "Completed / Cancelled" },
            ].map((item) => (
              <Button
                key={item.key}
                variant={filter === item.key ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setFilter(item.key as typeof filter)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Appointment queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.length ? (
            appointments.map((appointment) => (
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

                <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p><span className="font-medium text-slate-900">Symptoms:</span> {appointment.reason || "General consultation"}</p>
                  <p><span className="font-medium text-slate-900">Email:</span> {appointment.patientEmail || "-"}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {appointment.status === "PENDING" ? (
                    <Button
                      variant="outline"
                      onClick={async () => {
                        await appointmentsService.updateStatus(appointment.id, "CONFIRMED");
                        toast.success("Appointment confirmed");
                        await execute({ page: 1, pageSize: 100, status: "all" });
                      }}
                    >
                      Confirm
                    </Button>
                  ) : null}

                  {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" ? (
                    <Button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setForm(emptyConsultation);
                        setConsultationOpen(true);
                      }}
                    >
                      <ClipboardPenLine className="mr-2" size={16} />
                      Consultation
                    </Button>
                  ) : null}

                  {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" ? (
                    <Button
                      variant="danger"
                      onClick={async () => {
                        await appointmentsService.updateStatus(appointment.id, "CANCELLED");
                        toast.success("Appointment cancelled");
                        await execute({ page: 1, pageSize: 100, status: "all" });
                      }}
                    >
                      <XCircle className="mr-2" size={16} />
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
              No appointments match the current filter.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={consultationOpen} onOpenChange={setConsultationOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient consultation</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-lg font-semibold text-slate-900">{selectedAppointment?.patientName || "Patient"}</p>
              <p className="text-sm text-slate-500">{selectedAppointment ? formatDateTime(selectedAppointment.dateTime) : "-"}</p>
              <p className="mt-2 text-sm text-slate-600">{selectedAppointment?.reason || "General consultation"}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-[1.5rem] border-slate-200 shadow-none">
                <CardHeader><CardTitle className="text-base">Visit notes</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Diagnosis</Label>
                    <Input value={form.diagnosis} onChange={(event) => setForm((current) => ({ ...current, diagnosis: event.target.value }))} placeholder="Enter diagnosis" />
                  </div>
                  <div className="space-y-2">
                    <Label>Visit Notes</Label>
                    <Textarea value={form.visitNotes} onChange={(event) => setForm((current) => ({ ...current, visitNotes: event.target.value }))} placeholder="Clinical findings and consultation notes" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[1.5rem] border-slate-200 shadow-none">
                <CardHeader><CardTitle className="text-base">Vitals</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <Field label="Weight (kg)" value={form.weightKg} onChange={(value) => setForm((current) => ({ ...current, weightKg: value }))} />
                  <Field label="Height (cm)" value={form.heightCm} onChange={(value) => setForm((current) => ({ ...current, heightCm: value }))} />
                  <Field label="Blood Pressure" value={form.bloodPressure} onChange={(value) => setForm((current) => ({ ...current, bloodPressure: value }))} />
                  <Field label="Heart Rate" value={form.pulseRate} onChange={(value) => setForm((current) => ({ ...current, pulseRate: value }))} />
                  <Field
                    label="Temperature"
                    value={form.temperatureC}
                    onChange={(value) => setForm((current) => ({ ...current, temperatureC: value }))}
                    placeholder="37 or 98.6"
                    hint={getTemperatureHint(form.temperatureC)}
                  />
                  <div className="md:col-span-2 space-y-2">
                    <Label>Vitals Notes</Label>
                    <Textarea value={form.vitalsNotes} onChange={(event) => setForm((current) => ({ ...current, vitalsNotes: event.target.value }))} placeholder="Additional vitals notes" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-[1.5rem] border-slate-200 shadow-none">
              <CardHeader><CardTitle className="text-base">Prescription</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field label="Medicine Name" value={form.medicationName} onChange={(value) => setForm((current) => ({ ...current, medicationName: value }))} />
                <Field label="Dosage" value={form.dosage} onChange={(value) => setForm((current) => ({ ...current, dosage: value }))} />
                <Field label="Frequency" value={form.frequency} onChange={(value) => setForm((current) => ({ ...current, frequency: value }))} />
                <Field label="Duration" value={form.duration} onChange={(value) => setForm((current) => ({ ...current, duration: value }))} />
                <div className="md:col-span-2 space-y-2">
                  <Label>Instructions</Label>
                  <Textarea value={form.instructions} onChange={(event) => setForm((current) => ({ ...current, instructions: event.target.value }))} placeholder="Instructions for the patient" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConsultationOpen(false)}>
                Close
              </Button>
              <Button
                disabled={saving || !selectedAppointment?.patientId || !form.diagnosis.trim()}
                onClick={async () => {
                  if (!selectedAppointment?.patientId) return;
                  try {
                    setSaving(true);
                    const normalizedTemperature = normalizeTemperatureInput(form.temperatureC);

                    await doctorPortalService.createVisitNote({
                      patientId: selectedAppointment.patientId,
                      appointmentId: selectedAppointment.id,
                      diagnosis: form.diagnosis,
                      notes: form.visitNotes || undefined,
                    });

                    if (
                      form.weightKg ||
                      form.heightCm ||
                      form.bloodPressure ||
                      form.pulseRate ||
                      form.temperatureC ||
                      form.vitalsNotes
                    ) {
                      await doctorPortalService.createVitals({
                        patientId: selectedAppointment.patientId,
                        weightKg: Number(form.weightKg) || undefined,
                        heightCm: Number(form.heightCm) || undefined,
                        bloodPressure: form.bloodPressure || undefined,
                        pulseRate: Number(form.pulseRate) || undefined,
                        temperatureC: normalizedTemperature,
                        notes: form.vitalsNotes || undefined,
                      });
                    }

                    if (form.medicationName && form.dosage && form.instructions) {
                      await doctorPortalService.createPrescription({
                        patientId: selectedAppointment.patientId,
                        appointmentId: selectedAppointment.id,
                        medication: form.medicationName,
                        dosage: [form.dosage, form.frequency, form.duration].filter(Boolean).join(" | "),
                        instructions: form.instructions,
                      });
                    }

                    await appointmentsService.updateStatus(selectedAppointment.id, "COMPLETED");
                    toast.success("Consultation saved and visit marked as completed");
                    setConsultationOpen(false);
                    setSelectedAppointment(null);
                    setForm(emptyConsultation);
                    await execute({ page: 1, pageSize: 100, status: "all" });
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                <CheckCircle2 className="mr-2" size={16} />
                Complete visit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
