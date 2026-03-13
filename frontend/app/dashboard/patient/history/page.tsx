"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { patientPortalService } from "@/services/patient-portal.service";

const VitalsAnalyticsDashboard = dynamic(
  () => import("@/components/patient/vitals-analytics-dashboard"),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <Card className="rounded-[2rem] border-border/80">
          <CardContent className="space-y-4 p-8">
            <div className="h-4 w-40 rounded-full bg-muted" />
            <div className="h-10 w-80 max-w-full rounded-2xl bg-muted" />
            <div className="h-5 w-[32rem] max-w-full rounded-full bg-muted" />
          </CardContent>
        </Card>
        <div className="grid gap-6 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="rounded-[1.9rem] border-border/80">
              <CardContent className="h-[360px] p-6">
                <div className="h-full rounded-[1.5rem] bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
);

export default function PatientHistoryPage() {
  const { data, error, loading, execute } = useApi(patientPortalService.getVitals);

  useEffect(() => {
    void execute();
  }, [execute]);

  if (error) {
    return (
      <Card className="rounded-[1.75rem] border-border/80">
        <CardContent className="p-8">
          <div className="flex flex-col items-start gap-4 rounded-[1.5rem] border border-dashed border-border bg-muted/20 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">Failed to load vitals analytics</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button type="button" variant="outline" onClick={() => void execute()} disabled={loading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="rounded-[1.75rem] border-border/80">
        <CardContent className="p-8 text-sm text-muted-foreground">
          Loading vitals analytics...
        </CardContent>
      </Card>
    );
  }

  return <VitalsAnalyticsDashboard records={data} />;
}
