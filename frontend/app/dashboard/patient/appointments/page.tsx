"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarCheck,
  Clock,
  Sparkles,
  Search,
  XCircle,
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

export default function PatientAppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldOpenBooking = searchParams.get("book") === "1";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");
  const [modalOpen, setModalOpen] = useState(shouldOpenBooking);

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
    if (shouldOpenBooking) {
      setModalOpen(true);
    }
  }, [shouldOpenBooking]);

  useEffect(() => {
    if (!modalOpen && shouldOpenBooking) {
      router.replace("/dashboard/patient/appointments");
    }
  }, [modalOpen, router, shouldOpenBooking]);

  const appointments = useMemo(() => data?.items ?? [], [data]);

  const stats = useMemo(
    () => ({
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "PENDING").length,
      confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
      cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
    }),
    [appointments],
  );

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_32%),linear-gradient(135deg,#ffffff_0%,#eff6ff_52%,#f8fafc_100%)] shadow-[0_24px_70px_-30px_rgba(2,132,199,0.35)]">
        <div className="flex flex-col gap-6 px-6 py-8 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
              <Sparkles size={16} />
              Appointment center
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Manage your appointments
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                Browse the full doctor directory, schedule your next visit, and track every booking from one patient-friendly workspace.
              </p>
            </div>
          </div>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 whitespace-nowrap px-5">
                + New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[88vh] max-w-6xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Book New Appointment
                </DialogTitle>
              </DialogHeader>
              <AppointmentForm onBooked={() => setModalOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-5">
            <CalendarCheck className="text-sky-600" size={28} />
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-5">
            <Clock className="text-amber-500" size={28} />
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-semibold text-slate-900">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-5">
            <CalendarCheck className="text-emerald-600" size={28} />
            <div>
              <p className="text-sm text-slate-500">Confirmed</p>
              <p className="text-2xl font-semibold text-slate-900">{stats.confirmed}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-5">
            <XCircle className="text-rose-500" size={28} />
            <div>
              <p className="text-sm text-slate-500">Cancelled</p>
              <p className="text-2xl font-semibold text-slate-900">{stats.cancelled}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardHeader className="space-y-3">
          <CardTitle>Filter Appointments</CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:max-w-xs">
              <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor or reason..."
                className="pl-8"
              />
            </div>
            <Select value={status} onValueChange={(value) => setStatus(value as AppointmentStatus | "all")}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <h2 className="text-xl font-semibold text-slate-900">No appointments yet</h2>
              <p className="mt-2 text-sm text-slate-500">
                Book your first consultation from the doctor directory and it will appear here.
              </p>
              <Button className="mt-5" onClick={() => setModalOpen(true)}>
                Book Appointment
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border">
              <DataTable
                rows={appointments}
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
                ]}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
