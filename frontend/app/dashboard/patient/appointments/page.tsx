"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, RefreshCw, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AppointmentStatusBadge } from "@/components/shared/appointment-status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { appointmentsService } from "@/services/appointments.service";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

export default function PatientAppointmentsPage() {
  const { data, execute } = useApi(appointmentsService.list);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    void execute({ search, status, page: 1, pageSize: 100 });
  }, [execute, search, status]);

  const appointments = data?.items || [];
  const now = Date.now();
  const upcoming = appointments.filter((item) => new Date(item.dateTime).getTime() >= now && item.status !== "CANCELLED");
  const past = appointments.filter((item) => new Date(item.dateTime).getTime() < now || item.status === "COMPLETED" || item.status === "CANCELLED");

  const stats = useMemo(
    () => ({
      total: appointments.length,
      upcoming: upcoming.length,
      completed: appointments.filter((item) => item.status === "COMPLETED").length,
      cancelled: appointments.filter((item) => item.status === "CANCELLED").length,
    }),
    [appointments, upcoming.length],
  );

  const openReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleDate(new Date(appointment.dateTime).toISOString().slice(0, 16));
    setRescheduleOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" description="Track upcoming visits, past consultations, and schedule changes" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total bookings" value={stats.total} />
        <MetricCard title="Upcoming" value={stats.upcoming} />
        <MetricCard title="Completed" value={stats.completed} />
        <MetricCard title="Cancelled" value={stats.cancelled} />
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search doctor, reason or status" />
          </div>
          <div className="flex gap-2 overflow-auto">
            {["all", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((item) => (
              <Button
                key={item}
                variant={status === item ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setStatus(item as AppointmentStatus | "all")}
              >
                {item === "all" ? "All" : item}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <AppointmentSection
          title="Upcoming appointments"
          icon={<CalendarDays size={18} />}
          items={upcoming}
          emptyMessage="No upcoming appointments."
          actions={(appointment) => (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => openReschedule(appointment)}
              >
                <RefreshCw className="mr-2" size={15} />
                Reschedule
              </Button>
              {appointment.status !== "COMPLETED" && appointment.status !== "CANCELLED" ? (
                <Button
                  variant="danger"
                  disabled={busy === appointment.id}
                  onClick={async () => {
                    try {
                      setBusy(appointment.id);
                      await appointmentsService.cancelOwn(appointment.id);
                      toast.success("Appointment cancelled");
                      await execute({ search, status, page: 1, pageSize: 100 });
                    } finally {
                      setBusy(null);
                    }
                  }}
                >
                  <XCircle className="mr-2" size={15} />
                  Cancel
                </Button>
              ) : null}
            </div>
          )}
        />

        <AppointmentSection
          title="Past visits"
          icon={<Clock3 size={18} />}
          items={past}
          emptyMessage="No past visits yet."
        />
      </div>

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-900">{selectedAppointment?.doctorName || "Selected doctor"}</p>
              <p className="text-slate-500">{selectedAppointment?.reason || "Consultation"}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">New appointment date and time</Label>
              <Input id="reschedule-date" type="datetime-local" value={rescheduleDate} onChange={(event) => setRescheduleDate(event.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRescheduleOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedAppointment || !rescheduleDate) return;
                  await appointmentsService.rescheduleOwn(selectedAppointment.id, {
                    dateTime: new Date(rescheduleDate).toISOString(),
                    reason: selectedAppointment.reason,
                  });
                  toast.success("Appointment rescheduled and moved back to pending review");
                  setRescheduleOpen(false);
                  setSelectedAppointment(null);
                  await execute({ search, status, page: 1, pageSize: 100 });
                }}
              >
                Save schedule
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

function AppointmentSection({
  title,
  icon,
  items,
  emptyMessage,
  actions,
}: {
  title: string;
  icon: React.ReactNode;
  items: Appointment[];
  emptyMessage: string;
  actions?: (appointment: Appointment) => React.ReactNode;
}) {
  return (
    <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length ? (
          items.map((appointment) => (
            <div key={appointment.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-900">Dr. {appointment.doctorName}</p>
                  <p className="text-sm text-slate-500">
                    {appointment.doctorSpecialization || "Consultation"} · {appointment.doctorDepartment || "Hospital care"}
                  </p>
                </div>
                <AppointmentStatusBadge status={appointment.status} />
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p><span className="font-medium text-slate-900">Date:</span> {formatDateTime(appointment.dateTime)}</p>
                <p><span className="font-medium text-slate-900">Doctor contact:</span> {appointment.doctorPhone || "-"}</p>
                <p className="md:col-span-2"><span className="font-medium text-slate-900">Symptoms / reason:</span> {appointment.reason}</p>
              </div>
              {actions ? <div className="mt-4">{actions(appointment)}</div> : null}
            </div>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
