"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardSkeleton } from "@/features/dashboard/loading-skeleton";
import { useApi } from "@/hooks/use-api";
import { dashboardService } from "@/services/dashboard.service";

export default function DoctorDashboardPage() {
  const { data, loading, execute } = useApi(dashboardService.getDoctorMetrics);

  useEffect(() => {
    void execute();
  }, [execute]);

  if (loading || !data) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Dashboard" description="Appointments, patients and prescription tasks" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Today's Appointments" value={String(data.todaysAppointments)} />
        <StatCard title="Patient List" value={String(data.totalPatients)} />
        <StatCard title="Pending Prescriptions" value={String(data.pendingPrescriptions)} />
      </div>
    </div>
  );
}
