"use client";

import { useEffect } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { patientPortalService } from "@/services/patient-portal.service";

export default function PatientHistoryPage() {
  const { data, execute } = useApi(patientPortalService.getVitals);

  useEffect(() => {
    void execute();
  }, [execute]);

  return (
    <div className="space-y-6">
      <PageHeader title="Medical History" description="Vitals timeline and longitudinal trends" />
      <Card>
        <CardHeader><CardTitle>Height / Weight Trend</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={(data || []).map((item) => ({
                date: new Date(item.recordedAt).toLocaleDateString(),
                height: item.heightCm,
                weight: item.weightKg,
              }))}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="height" stroke="#1d4ed8" strokeWidth={2} name="Height (cm)" />
              <Line dataKey="weight" stroke="#0891b2" strokeWidth={2} name="Weight (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Vitals Records</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {(data || []).map((row) => (
            <div key={row.id} className="rounded border border-border p-3">
              <p className="font-medium">{new Date(row.recordedAt).toLocaleString()}</p>
              <p className="text-muted-foreground">Height: {row.heightCm ?? "-"} cm | Weight: {row.weightKg ?? "-"} kg | BP: {row.bloodPressure ?? "-"}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
