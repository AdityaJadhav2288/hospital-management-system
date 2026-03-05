"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { appointmentsService } from "@/services/appointments.service";

export default function DoctorAppointmentsPage() {
  const { data, execute } = useApi(appointmentsService.list);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    void execute({ page: 1, status: "all" });
  }, [execute]);

  return (
    <div className="space-y-6">
      <PageHeader title="Today's Appointments" description="Review and update patient appointment statuses" />
      <Card>
        <CardHeader><CardTitle>Appointment Queue</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            rows={(data?.items || []).map((item) => ({ ...item, action: item }))}
            columns={[
              { key: "patientName", header: "Patient" },
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
              {
                key: "action",
                header: "Actions",
                render: (value) => (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === (value as { id: string }).id}
                      onClick={async () => {
                        setUpdatingId((value as { id: string }).id);
                        await appointmentsService.updateStatus((value as { id: string }).id, "CONFIRMED");
                        toast.success("Appointment confirmed");
                        setUpdatingId(null);
                        void execute({ page: 1, status: "all" });
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={updatingId === (value as { id: string }).id}
                      onClick={async () => {
                        setUpdatingId((value as { id: string }).id);
                        await appointmentsService.updateStatus((value as { id: string }).id, "CANCELLED");
                        toast.success("Appointment cancelled");
                        setUpdatingId(null);
                        void execute({ page: 1, status: "all" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
