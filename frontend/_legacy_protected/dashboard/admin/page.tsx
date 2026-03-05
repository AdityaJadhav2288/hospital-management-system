"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardSkeleton } from "@/features/dashboard/loading-skeleton";
import { AdminCharts } from "@/features/dashboard/admin-charts";
import { useApi } from "@/hooks/use-api";
import { currency } from "@/lib/utils";
import { dashboardService } from "@/services/dashboard.service";

export default function AdminDashboardPage() {
  const { data, loading, execute } = useApi(dashboardService.getAdminMetrics);

  useEffect(() => {
    void execute();
  }, [execute]);

  if (loading || !data) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Hospital analytics and operations overview" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Doctors" value={String(data.totalDoctors)} />
        <StatCard title="Total Patients" value={String(data.totalPatients)} />
        <StatCard title="Appointments" value={String(data.totalAppointments)} />
        <StatCard title="Revenue" value={currency(data.revenue)} />
      </div>
      <AdminCharts revenueSeries={data.revenueSeries} appointmentSeries={data.appointmentSeries} />
    </div>
  );
}
