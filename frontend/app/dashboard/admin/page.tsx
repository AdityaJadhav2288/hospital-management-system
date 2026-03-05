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
      <PageHeader title="Admin Dashboard" description="Hospital operations, inventory and analytics" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard title="Doctors" value={String(data.totalDoctors)} />
        <StatCard title="Patients" value={String(data.totalPatients)} />
        <StatCard title="Appointments" value={String(data.totalAppointments)} />
        <StatCard title="Departments" value={String(data.totalDepartments ?? 0)} />
        <StatCard title="Blood Units" value={String(data.bloodUnits ?? 0)} />
        <StatCard title="Revenue" value={currency(data.revenue)} />
      </div>
      <AdminCharts revenueSeries={data.revenueSeries} appointmentSeries={data.appointmentSeries} />
    </div>
  );
}
