"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardSkeleton } from "@/features/dashboard/loading-skeleton";
import { useApi } from "@/hooks/use-api";
import { dashboardService } from "@/services/dashboard.service";

export default function PatientDashboardPage() {
  const { data, loading, execute } = useApi(dashboardService.getPatientMetrics);

  useEffect(() => {
    void execute();
  }, [execute]);

  if (loading || !data) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Dashboard" description="Your appointments and medical summary" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Upcoming" value={String(data.upcomingAppointments)} />
        <StatCard title="Prescriptions" value={String(data.activePrescriptions)} />
        <StatCard title="Past Visits" value={String(data.totalVisits)} />
      </div>
    </div>
  );
}
