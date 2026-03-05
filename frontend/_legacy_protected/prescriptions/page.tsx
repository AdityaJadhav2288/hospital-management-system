"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { prescriptionsService } from "@/services/prescriptions.service";

export default function PrescriptionsPage() {
  const { data, execute } = useApi(prescriptionsService.list);

  useEffect(() => {
    void execute();
  }, [execute]);

  return (
    <div className="space-y-6">
      <PageHeader title="Prescription Management" description="Doctor and patient prescription records" />
      <Card>
        <CardHeader>
          <CardTitle>Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            rows={data || []}
            columns={[
              { key: "patientName", header: "Patient" },
              { key: "doctorName", header: "Doctor" },
              { key: "medication", header: "Medication" },
              { key: "dosage", header: "Dosage" },
              { key: "instructions", header: "Instructions" },
              { key: "issuedAt", header: "Issued", render: (value) => formatDateTime(String(value)) },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
