"use client";

import { useEffect, useState } from "react";
import { Eye, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AppointmentStatusBadge } from "@/components/shared/appointment-status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { appointmentsService } from "@/services/appointments.service";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

export default function AdminAppointmentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { data, execute } = useApi(appointmentsService.list);

  useEffect(() => {
    void execute({ search, status, page: 1, pageSize: 100 });
  }, [execute, search, status]);

  const appointments = data?.items || [];

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments Management" description="Search, filter, review details, and cancel appointment records" />

      <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search patient, doctor, or reason" />
          </div>
          <div className="flex flex-wrap gap-2">
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
                    <p className="text-lg font-semibold text-slate-900">
                      {appointment.patientName} · Dr. {appointment.doctorName}
                    </p>
                    <p className="text-sm text-slate-500">{formatDateTime(appointment.dateTime)}</p>
                  </div>
                  <AppointmentStatusBadge status={appointment.status} />
                </div>
                <p className="mt-3 text-sm text-slate-600">{appointment.reason}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setDetailsOpen(true);
                    }}
                  >
                    <Eye className="mr-2" size={15} />
                    View details
                  </Button>
                  {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" ? (
                    <Button
                      variant="danger"
                      onClick={async () => {
                        await appointmentsService.updateStatus(appointment.id, "CANCELLED");
                        toast.success("Appointment cancelled");
                        await execute({ search, status, page: 1, pageSize: 100 });
                      }}
                    >
                      <XCircle className="mr-2" size={15} />
                      Cancel appointment
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
              No appointments match the current filters.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment details</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm">
            <p><span className="font-medium text-slate-900">Patient:</span> {selectedAppointment?.patientName || "-"}</p>
            <p><span className="font-medium text-slate-900">Doctor:</span> {selectedAppointment?.doctorName || "-"}</p>
            <p><span className="font-medium text-slate-900">Time:</span> {selectedAppointment ? formatDateTime(selectedAppointment.dateTime) : "-"}</p>
            <p><span className="font-medium text-slate-900">Status:</span> {selectedAppointment ? <AppointmentStatusBadge status={selectedAppointment.status} /> : "-"}</p>
            <p><span className="font-medium text-slate-900">Reason:</span> {selectedAppointment?.reason || "-"}</p>
            <p><span className="font-medium text-slate-900">Doctor contact:</span> {selectedAppointment?.doctorPhone || "-"}</p>
            <p><span className="font-medium text-slate-900">Patient contact:</span> {selectedAppointment?.patientPhone || "-"}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
