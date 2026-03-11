"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CalendarRange, ClipboardCheck, Stethoscope, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardSkeleton } from "@/features/dashboard/loading-skeleton";
import { AdminCharts } from "@/features/dashboard/admin-charts";
import { useApi } from "@/hooks/use-api";
import { dashboardService } from "@/services/dashboard.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { data, loading, execute } = useApi(dashboardService.getAdminMetrics);

  useEffect(() => {
    void execute();
  }, [execute]);

  if (loading || !data) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Patients, doctors, appointments, and visit-completion analytics" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Patients" value={String(data.totalPatients)} icon={<Users size={18} />} />
        <StatCard title="Total Doctors" value={String(data.totalDoctors)} icon={<Stethoscope size={18} />} />
        <StatCard title="Total Appointments" value={String(data.totalAppointments)} icon={<CalendarRange size={18} />} />
        <StatCard title="Completed Visits" value={String(data.completedVisits)} icon={<ClipboardCheck size={18} />} />
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Management</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Link href="/dashboard/admin/patients">
            <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
              Patients list
              <Users size={16} />
            </Button>
          </Link>
          <Link href="/dashboard/admin/doctors">
            <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
              Doctors list
              <Stethoscope size={16} />
            </Button>
          </Link>
          <Link href="/dashboard/admin/appointments">
            <Button variant="outline" className="h-12 w-full justify-between rounded-2xl">
              Appointments management
              <CalendarRange size={16} />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <AdminCharts revenueSeries={data.revenueSeries} appointmentSeries={data.appointmentSeries} />
    </div>
  );
}
