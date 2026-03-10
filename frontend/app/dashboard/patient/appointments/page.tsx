"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarCheck,
  Clock,
  Sparkles,
  Search,
  XCircle,
  MapPin,
  Phone,
  Edit3,
  Trash2,
  ChevronRight,
  Filter,
  ArrowUp,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/tables/data-table";
import { AppointmentForm } from "@/features/appointments/appointment-form";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { appointmentsService } from "@/services/appointments.service";
import type { AppointmentStatus } from "@/types/appointment";
import type { Appointment } from "@/types/appointment";

export default function PatientAppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldOpenBooking = searchParams.get("book") === "1";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "doctor" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [modalOpen, setModalOpen] = useState(shouldOpenBooking);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"auto" | "table" | "cards">("auto");

  const { data, loading, error, execute } = useApi(appointmentsService.list);

  useEffect(() => {
    void execute({ search, status, page: 1 });
  }, [execute, search, status]);

  useEffect(() => {
    if (!modalOpen) {
      void execute({ search, status, page: 1 });
    }
  }, [modalOpen, execute, search, status]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (shouldOpenBooking && !modalOpen) {
      // Trigger modal open on next render to avoid cascading renders
      const timeoutId = setTimeout(() => setModalOpen(true), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldOpenBooking, modalOpen]);

  useEffect(() => {
    if (!modalOpen && shouldOpenBooking) {
      router.replace("/dashboard/patient/appointments");
    }
  }, [modalOpen, router, shouldOpenBooking]);

  const appointments = useMemo(() => data?.items ?? [], [data]);

  const sortedAppointments = useMemo(() => {
    const sorted = [...appointments].sort((a, b) => {
      let compareValue = 0;
      if (sortBy === "date") {
        const dateA = new Date(a.dateTime).getTime();
        const dateB = new Date(b.dateTime).getTime();
        compareValue = dateA - dateB;
      } else if (sortBy === "doctor") {
        compareValue = (a.doctorName || "").localeCompare(b.doctorName || "");
      } else if (sortBy === "status") {
        compareValue = (a.status || "").localeCompare(b.status || "");
      }
      return sortOrder === "asc" ? compareValue : -compareValue;
    });
    return sorted;
  }, [appointments, sortBy, sortOrder]);

  const stats = useMemo(
    () => ({
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "PENDING").length,
      confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
      cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
      upcoming: appointments.filter((a) => {
        const apptDate = new Date(a.dateTime);
        return a.status === "CONFIRMED" && apptDate > new Date();
      }).length,
    }),
    [appointments],
  );

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      // TODO: Call cancel API when available
      toast.success("Appointment cancelled successfully");
      setDetailsOpen(false);
      void execute({ search, status, page: 1 });
    } catch (err) {
      toast.error("Failed to cancel appointment");
    }
  };

  const handleRescheduleAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsOpen(false);
    // Open booking modal with pre-filled doctor
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-xl md:rounded-[2rem] border border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_32%),linear-gradient(135deg,#ffffff_0%,#eff6ff_52%,#f8fafc_100%)] shadow-[0_24px_70px_-30px_rgba(2,132,199,0.35)] transition-all duration-300">
        <div className="flex flex-col gap-4 px-4 py-6 md:gap-6 md:px-8 md:py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-xs md:text-sm font-medium text-sky-700 shadow-sm">
              <Sparkles size={14} className="md:size-4" />
              Appointment center
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
                Manage your appointments
              </h1>
              <p className="max-w-2xl text-sm md:text-base leading-6 md:leading-7 text-slate-600">
                Browse the full doctor directory, schedule your next visit, and track every booking.
              </p>
            </div>
          </div>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto h-10 md:h-12 whitespace-nowrap px-4 md:px-5">
                <span className="hidden md:inline">+</span> New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] md:max-h-[88vh] max-w-2xl md:max-w-6xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  {selectedAppointment ? "Reschedule Appointment" : "Book New Appointment"}
                </DialogTitle>
              </DialogHeader>
              <AppointmentForm 
                onBooked={() => {
                  setModalOpen(false);
                  setSelectedAppointment(null);
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Stats Grid - Fully Responsive */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={CalendarCheck}
          label="Total"
          value={stats.total}
          color="sky"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats.pending}
          color="amber"
        />
        <StatCard
          icon={CalendarCheck}
          label="Confirmed"
          value={stats.confirmed}
          color="emerald"
        />
        <StatCard
          icon={XCircle}
          label="Cancelled"
          value={stats.cancelled}
          color="rose"
        />
        <StatCard
          icon={ArrowUp}
          label="Upcoming"
          value={stats.upcoming}
          color="purple"
        />
      </div>

      {/* Enhanced Filter Section - Mobile Optimized */}
      <Card className="rounded-lg md:rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardHeader className="space-y-3 p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-600" />
            <CardTitle className="text-base md:text-lg">Filter & Sort</CardTitle>
          </div>
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor or reason..."
                className="pl-9 h-9 md:h-10 text-sm"
              />
            </div>
            
            {/* Filters Grid - Responsive */}
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              <Select 
                value={status} 
                onValueChange={(value) => setStatus(value as AppointmentStatus | "all")}
              >
                <SelectTrigger className="h-9 md:h-10 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={sortBy} 
                onValueChange={(value) => setSortBy(value as "date" | "doctor" | "status")}
              >
                <SelectTrigger className="h-9 md:h-10 text-sm">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">By Date</SelectItem>
                  <SelectItem value="doctor">By Doctor</SelectItem>
                  <SelectItem value="status">By Status</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={sortOrder} 
                onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
              >
                <SelectTrigger className="h-9 md:h-10 text-sm">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatus("all");
                  setSortBy("date");
                  setSortOrder("asc");
                }}
                className="h-9 md:h-10 text-sm"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Appointments List - Responsive Card/Table View */}
      <Card className="rounded-lg md:rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">
            {sortedAppointments.length > 0 
              ? `My Appointments (${sortedAppointments.length})`
              : "My Appointments"
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          {loading ? (
            <AppointmentSkeletons />
          ) : sortedAppointments.length === 0 ? (
            <EmptyState onBookClick={() => setModalOpen(true)} />
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto rounded-2xl border">
                <DataTable
                  rows={sortedAppointments}
                  pageSize={10}
                  searchPlaceholder="Filter within results"
                  columns={[
                    { key: "doctorName", header: "Doctor" },
                    {
                      key: "dateTime",
                      header: "Date & Time",
                      render: (value) => formatDateTime(String(value)),
                    },
                    { key: "reason", header: "Reason" },
                    {
                      key: "status",
                      header: "Status",
                      render: (value) => (
                        <Badge
                          tone={
                            value === "CONFIRMED"
                              ? "success"
                              : value === "CANCELLED"
                                ? "danger"
                                : "warning"
                          }
                        >
                          {String(value)}
                        </Badge>
                      ),
                    },
                    {
                      key: "id",
                      header: "Actions",
                      render: (value, row) => (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(row as Appointment);
                            setDetailsOpen(true);
                          }}
                          className="h-8"
                        >
                          View
                        </Button>
                      ),
                    },
                  ]}
                />
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden space-y-3">
                {sortedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onViewDetails={() => {
                      setSelectedAppointment(appointment);
                      setDetailsOpen(true);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Drawer/Dialog */}
      <AppointmentDetailsDrawer
        appointment={selectedAppointment}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onCancel={handleCancelAppointment}
        onReschedule={handleRescheduleAppointment}
      />
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: "sky" | "amber" | "emerald" | "rose" | "purple";
}) {
  const colorClasses = {
    sky: "text-sky-600",
    amber: "text-amber-500",
    emerald: "text-emerald-600",
    rose: "text-rose-500",
    purple: "text-purple-600",
  };

  return (
    <Card className="rounded-lg md:rounded-[1.5rem] border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex flex-col items-start gap-2 p-3 md:p-5">
        <Icon className={`${colorClasses[color]} size-6 md:size-7`} />
        <div className="w-full">
          <p className="text-xs md:text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Appointment Card Component for Mobile
function AppointmentCard({
  appointment,
  onViewDetails,
}: {
  appointment: Appointment;
  onViewDetails: () => void;
}) {
  const statusConfig = {
    CONFIRMED: { bg: "bg-emerald-50", badge: "success", icon: "✓" },
    PENDING: { bg: "bg-amber-50", badge: "warning", icon: "⏳" },
    CANCELLED: { bg: "bg-rose-50", badge: "danger", icon: "✕" },
  };

  const config = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <div
      onClick={onViewDetails}
      className={`${config.bg} rounded-lg border border-slate-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md active:scale-98`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 truncate text-sm md:text-base">
            Dr. {appointment.doctorName}
          </p>
          <p className="text-xs text-slate-600 mt-1 line-clamp-1">
            {appointment.reason}
          </p>
        </div>
        <Badge tone={config.badge as any} className="whitespace-nowrap text-xs">
          {appointment.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar size={14} />
          {formatDateTime(appointment.dateTime)}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <span className="text-xs font-medium text-slate-600">View Details</span>
        <ChevronRight size={16} className="text-slate-400" />
      </div>
    </div>
  );
}

// Loading Skeletons
function AppointmentSkeletons() {
  return (
    <div className="space-y-3 lg:space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="block lg:hidden">
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ))}
      <div className="hidden lg:block">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full mb-2" />
        ))}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ onBookClick }: { onBookClick: () => void }) {
  return (
    <div className="rounded-xl md:rounded-3xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-200 mb-4">
        <CalendarCheck className="text-slate-600 size-6 md:size-8" />
      </div>
      <h2 className="text-lg md:text-xl font-semibold text-slate-900">
        No appointments yet
      </h2>
      <p className="mt-2 text-xs md:text-sm text-slate-600 max-w-sm mx-auto">
        Book your first consultation from the doctor directory and it will appear here.
      </p>
      <Button className="mt-6 md:size-md" onClick={onBookClick} size="sm">
        + Book Appointment
      </Button>
    </div>
  );
}

// Appointment Details Drawer
function AppointmentDetailsDrawer({
  appointment,
  open,
  onOpenChange,
  onCancel,
  onReschedule,
}: {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: (id: string) => Promise<void>;
  onReschedule: (appointment: Appointment) => void;
}) {
  if (!appointment) return null;

  const isUpcoming = new Date(appointment.dateTime) > new Date();
  const canCancel = appointment.status !== "CANCELLED" && isUpcoming;

  const statusConfig = {
    CONFIRMED: { icon: "✓", color: "text-emerald-600", bg: "bg-emerald-50" },
    PENDING: { icon: "⏳", color: "text-amber-600", bg: "bg-amber-50" },
    CANCELLED: { icon: "✕", color: "text-rose-600", bg: "bg-rose-50" },
  };

  const config = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto max-w-2xl">
        <DialogHeader className="border-b">
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          {/* Status Banner */}
          <div className={`${config.bg} border border-current/10 rounded-lg p-4`}>
            <div className="flex items-center gap-3">
              <div className={`${config.color} text-lg font-bold`}>{config.icon}</div>
              <div>
                <p className="font-semibold text-slate-900">{appointment.status}</p>
                <p className="text-sm text-slate-600">
                  {appointment.status === "CONFIRMED"
                    ? "Your appointment is confirmed"
                    : appointment.status === "PENDING"
                      ? "Waiting for confirmation"
                      : "This appointment has been cancelled"}
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Doctor Information</h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <span className="text-slate-600">Name:</span>{" "}
                <span className="font-semibold">Dr. {appointment.doctorName}</span>
              </p>
              {appointment.doctor?.department && (
                <p className="text-sm">
                  <span className="text-slate-600">Department:</span>{" "}
                  <span className="font-semibold">{appointment.doctor.department}</span>
                </p>
              )}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Appointment Details</h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CalendarCheck size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-600">Date & Time</p>
                  <p className="font-semibold text-slate-900">
                    {formatDateTime(appointment.dateTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-600">Duration</p>
                  <p className="font-semibold text-slate-900">
                    30 minutes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t">
                <AlertCircle size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-600">Reason for Visit</p>
                  <p className="font-semibold text-slate-900">{appointment.reason}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t">
            {canCancel && (
              <Button
                variant="outline"
                onClick={() => {
                  onCancel(appointment.id).catch(() => {
                    // Error handled in function
                  });
                }}
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 size={16} className="mr-2" />
                Cancel Appointment
              </Button>
            )}

            {appointment.status === "CONFIRMED" && isUpcoming && (
              <Button
                variant="outline"
                onClick={() => {
                  onReschedule(appointment);
                  onOpenChange(false);
                }}
                className="w-full"
              >
                <Edit3 size={16} className="mr-2" />
                Reschedule Appointment
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
