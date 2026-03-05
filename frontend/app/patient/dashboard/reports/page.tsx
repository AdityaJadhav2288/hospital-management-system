"use client";

import { useEffect } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { patientPortalService } from "@/services/patient-portal.service";
import { prescriptionsService } from "@/services/prescriptions.service";

export default function PatientReportsPage() {
  const { data: vitals, execute: loadVitals } = useApi(patientPortalService.getVitals);
  const { data: prescriptions, execute: loadPrescriptions } = useApi(prescriptionsService.list);

  useEffect(() => {
    void loadVitals();
    void loadPrescriptions();
  }, [loadPrescriptions, loadVitals]);

  const reportSeries = (vitals || []).map((row) => ({
    date: new Date(row.recordedAt).toLocaleDateString(),
    weight: row.weightKg ?? 0,
    pulse: row.pulseRate ?? 0,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Reports" description="Summary charts and historical clinical reports" />
      <Card>
        <CardHeader>
          <CardTitle>Health Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={reportSeries}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="#2563eb" fill="url(#weightGradient)" />
              <Area type="monotone" dataKey="pulse" name="Pulse (bpm)" stroke="#0891b2" fill="url(#pulseGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prescription Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            rows={prescriptions || []}
            columns={[
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
