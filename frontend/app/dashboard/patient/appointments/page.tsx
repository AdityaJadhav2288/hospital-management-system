"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  return (
    <div className="space-y-6">
      <PageHeader title="Book Appointment" description="Schedule and track your appointments" />
      <Card>
        <CardHeader><CardTitle>New Appointment</CardTitle></CardHeader>
        <CardContent><AppointmentForm /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>My Appointments</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search doctor/reason" />
            <Select defaultValue="all" onValueChange={(value) => setStatus(value as AppointmentStatus | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading appointments...</p>
          ) : (
            <DataTable
              rows={data?.items ?? []}
              columns={[
                { key: "doctorName", header: "Doctor" },
                { key: "dateTime", header: "Date & Time", render: (value) => formatDateTime(String(value)) },
                { key: "reason", header: "Reason" },
                {
                  key: "status",
                  header: "Status",
                  render: (value) => (
                    <Badge tone={value === "CONFIRMED" ? "success" : value === "CANCELLED" ? "danger" : "warning"}>{String(value)}</Badge>
                  ),
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
