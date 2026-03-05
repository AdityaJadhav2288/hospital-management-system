"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Bar, BarChart, XAxis } from "recharts";

interface AdminChartsProps {
  revenueSeries: Array<{ month: string; value: number }>;
  appointmentSeries: Array<{ name: string; value: number }>;
}

const colors = ["#0f766e", "#16a34a", "#dc2626"];

export function AdminCharts({ revenueSeries, appointmentSeries }: AdminChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="h-80 rounded-xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium">Revenue Trend</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueSeries}>
            <XAxis dataKey="month" />
            <Tooltip />
            <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-80 rounded-xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium">Appointment Status</p>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={appointmentSeries} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {appointmentSeries.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
