"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardSkeleton } from "@/features/dashboard/loading-skeleton";
import { AdminCharts } from "@/features/dashboard/admin-charts";
import { useApi } from "@/hooks/use-api";
import { currency } from "@/lib/utils";
import { dashboardService } from "@/services/dashboard.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange, CircleDollarSign, Droplets, LayoutGrid, Stethoscope, Users } from "lucide-react";

export default function AdminDashboardPage() {
  const { data, loading, execute } = useApi(dashboardService.getAdminMetrics);

  useEffect(() => {
    void execute();
  }, [execute]);

  if (loading || !data) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Hospital operations, inventory and analytics" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Doctors" value={String(data.totalDoctors)} icon={<Stethoscope size={18} />} />
        <StatCard title="Patients" value={String(data.totalPatients)} icon={<Users size={18} />} />
        <StatCard title="Appointments" value={String(data.totalAppointments)} icon={<CalendarRange size={18} />} />
        <StatCard title="Departments" value={String(data.totalDepartments ?? 0)} icon={<LayoutGrid size={18} />} />
        <StatCard title="Blood Units" value={String(data.bloodUnits ?? 0)} icon={<Droplets size={18} />} />
        <StatCard title="Revenue" value={currency(data.revenue)} icon={<CircleDollarSign size={18} />} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Management Tables</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Link href="/dashboard/admin/doctors">
            <Button variant="outline" className="w-full justify-between">
              Doctors List
              <Stethoscope size={16} />
            </Button>
          </Link>
          <Link href="/dashboard/admin/patients">
            <Button variant="outline" className="w-full justify-between">
              Patients List
              <Users size={16} />
            </Button>
          </Link>
          <Link href="/dashboard/admin/appointments">
            <Button variant="outline" className="w-full justify-between">
              Appointments List
              <CalendarRange size={16} />
            </Button>
          </Link>
        </CardContent>
      </Card>
      <AdminCharts revenueSeries={data.revenueSeries} appointmentSeries={data.appointmentSeries} />
    </div>
  );
}
