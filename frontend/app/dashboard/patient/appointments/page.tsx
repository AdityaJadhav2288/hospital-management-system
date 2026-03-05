"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { CalendarCheck, Clock, XCircle, Search } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/tables/data-table";

import { AppointmentForm } from "@/features/appointments/appointment-form";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { appointmentsService } from "@/services/appointments.service";

import type { AppointmentStatus } from "@/types/appointment";

export default function PatientAppointmentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");

  const { data, loading, error, execute } = useApi(appointmentsService.list);

  useEffect(() => {
    void execute({ search, status, page: 1 });
  }, [execute, search, status]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const appointments = data?.items ?? [];

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "PENDING").length,
      confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
      cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
    };
  }, [appointments]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Appointments"
        description="Book new appointments and track your upcoming visits"
      />

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <CalendarCheck className="text-blue-500" size={28} />
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Clock className="text-yellow-500" size={28} />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-semibold">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <CalendarCheck className="text-green-500" size={28} />
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-xl font-semibold">{stats.confirmed}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <XCircle className="text-red-500" size={28} />
            <div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-xl font-semibold">{stats.cancelled}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BOOK APPOINTMENT */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Book New Appointment</CardTitle>
        </CardHeader>

        <CardContent>
          <AppointmentForm />
        </CardContent>
      </Card>

      {/* APPOINTMENT LIST */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-muted-foreground"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor or reason..."
                className="pl-8"
              />
            </div>

            <Select
              defaultValue="all"
              onValueChange={(value) =>
                setStatus(value as AppointmentStatus | "all")
              }
            >
              <SelectTrigger>
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

          {/* Table */}
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading appointments...
            </div>
          ) : (
            <div className="rounded-md border">
              <DataTable
                rows={appointments}
                columns={[
                  { key: "doctorName", header: "Doctor" },
                  {
                    key: "dateTime",
                    header: "Date & Time",
                    render: (value) =>
                      formatDateTime(String(value)),
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