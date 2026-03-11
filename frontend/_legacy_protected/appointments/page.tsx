"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/tables/data-table";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { appointmentsService } from "@/services/appointments.service";
import { useAuthStore } from "@/store/auth-store";
import type { AppointmentStatus } from "@/types/appointment";

export default function AppointmentsPage() {
  const { user } = useAuthStore();
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
      <PageHeader title="Appointment Management" description="Book appointments and manage status" />
      {user?.role === "patient" ? (
        <Card>
          <CardHeader>
            <CardTitle>Book Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/patient/appointments/book">
              <Button className="w-full sm:w-auto">Open booking page</Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Appointment List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patient/doctor/reason" />
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
                { key: "patientName", header: "Patient" },
                { key: "doctorName", header: "Doctor" },
                { key: "dateTime", header: "Date & Time", render: (value) => formatDateTime(String(value)) },
                {
                  key: "status",
                  header: "Status",
                  render: (value) => (
                    <Badge
                      tone={
                        value === "CONFIRMED" ? "success" : value === "CANCELLED" ? "danger" : "warning"
                      }
                    >
                      {String(value)}
                    </Badge>
                  ),
                },
                { key: "reason", header: "Reason" },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
