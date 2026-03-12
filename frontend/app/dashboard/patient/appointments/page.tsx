"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, RefreshCw, Search, XCircle, CheckCircle, AlertCircle } from "lucide-react";
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
import { cn } from "@/lib/utils";
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

  const appointments = useMemo(() => data?.items || [], [data?.items]);
  const now = Date.now();
  const upcoming = useMemo(() => 
    appointments.filter((item) => new Date(item.dateTime).getTime() >= now && item.status !== "CANCELLED"), 
    [appointments, now]
  );
  const past = useMemo(() => 
    appointments.filter((item) => new Date(item.dateTime).getTime() < now || item.status === "COMPLETED" || item.status === "CANCELLED"),
    [appointments, now]
  );

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

      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="grid gap-4 p-6 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              value={search} 
              onChange={(event) => setSearch(event.target.value)} 
              className="pl-12 h-11 border-slate-200 rounded-lg focus:border-blue-400 focus:ring-blue-400" 
              placeholder="Search doctor, reason or status" 
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["all", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((item) => (
              <Button
                key={item}
                variant={status === item ? "default" : "outline"}
                size="sm"
                className="rounded-full whitespace-nowrap font-medium"
                onClick={() => setStatus(item as AppointmentStatus | "all")}
              >
                {item === "all" ? "All" : item}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <AppointmentSection
          title="Upcoming appointments"
          icon={<CalendarDays className="h-5 w-5 text-blue-600" />}
          items={upcoming}
          emptyMessage="No upcoming appointments scheduled."
          isUpcoming={true}
          actions={(appointment) => (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => openReschedule(appointment)}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reschedule
              </Button>
              {appointment.status !== "COMPLETED" && appointment.status !== "CANCELLED" ? (
                <Button
                  variant="danger"
                  size="sm"
                  disabled={busy === appointment.id}
                  className="rounded-lg"
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
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              ) : null}
            </div>
          )}
        />

        <AppointmentSection
          title="Past visits"
          icon={<Clock3 className="h-5 w-5 text-slate-600" />}
          items={past}
          emptyMessage="No past visits yet."
          isUpcoming={false}
        />
      </div>

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Reschedule appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
              <p className="font-bold text-slate-900 text-base">
                Dr. {selectedAppointment?.doctorName?.replace(/^Dr\.\s+/i, '') || "Selected doctor"}
              </p>
              <p className="text-slate-600 text-sm mt-2">{selectedAppointment?.reason || "Consultation"}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-date" className="font-semibold text-slate-900">New appointment date and time</Label>
              <Input 
                id="reschedule-date" 
                type="datetime-local" 
                value={rescheduleDate} 
                onChange={(event) => setRescheduleDate(event.target.value)}
                className="rounded-lg border-slate-200 h-11"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setRescheduleOpen(false)}
                className="rounded-lg"
              >
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
                className="rounded-lg"
              >
                Save Changes
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
    <Card className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="mt-3 text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{value}</p>
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
  isUpcoming = false,
}: {
  title: string;
  icon: React.ReactNode;
  items: Appointment[];
  emptyMessage: string;
  actions?: (appointment: Appointment) => React.ReactNode;
  isUpcoming?: boolean;
}) {
  return (
    <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
            {icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? (
          items.map((appointment) => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              actions={actions}
              isUpcoming={isUpcoming}
            />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AppointmentCard({ 
  appointment, 
  actions, 
  isUpcoming 
}: { 
  appointment: Appointment; 
  actions?: (appointment: Appointment) => React.ReactNode;
  isUpcoming?: boolean;
}) {
  const cleanDoctorName = appointment.doctorName?.replace(/^Dr\.\s+/i, '') || 'Doctor';
  const statusColorMap = {
    PENDING: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
    CONFIRMED: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
    COMPLETED: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
    CANCELLED: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
  };
  
  const statusColor = statusColorMap[appointment.status] || statusColorMap.PENDING;
  
  return (
    <div className={cn(
      "rounded-lg border-2 p-4 transition-all duration-300 hover:shadow-md hover:border-opacity-100",
      statusColor.bg,
      statusColor.border,
      isUpcoming && "hover:shadow-lg hover:scale-[1.01]"
    )}>
      <div className="flex gap-4">
        {/* Doctor Avatar */}
        <div className="flex-shrink-0">
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center font-bold text-white",
            appointment.status === 'COMPLETED' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
            appointment.status === 'CANCELLED' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
            appointment.status === 'CONFIRMED' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
            'bg-gradient-to-br from-yellow-500 to-amber-600'
          )}>
            {cleanDoctorName.charAt(0).toUpperCase()}
          </div>
        </div>
        
        {/* Appointment Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">
                Dr. {cleanDoctorName}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {appointment.doctorSpecialization || 'Consultation'} 
                {appointment.doctorDepartment && ` · ${appointment.doctorDepartment}`}
              </p>
            </div>
            <div className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap", statusColor.badge)}>
              {appointment.status}
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <CalendarDays className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="font-medium">{formatDateTime(appointment.dateTime)}</span>
            </div>
            {appointment.doctorPhone && (
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-xs font-medium text-slate-500">Contact:</span>
                <span className="font-medium">{appointment.doctorPhone}</span>
              </div>
            )}
            {appointment.reason && (
              <div className="sm:col-span-2 flex gap-2 text-slate-700">
                <span className="text-xs font-medium text-slate-500 flex-shrink-0">Reason:</span>
                <span className="font-medium">{appointment.reason}</span>
              </div>
            )}
          </div>
          
          {actions && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actions(appointment)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
