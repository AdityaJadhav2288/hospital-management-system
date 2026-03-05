"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Bar, BarChart, XAxis } from "recharts";

interface AdminChartsProps {
  revenueSeries: Array<{ month: string; value: number }>;
  appointmentSeries: Array<{ name: string; value: number }>;
}

const colors = ["#0f766e", "#16a34a", "#dc2626"];

export function AdminCharts({ revenueSeries, appointmentSeries }: AdminChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      
      {/* Revenue Chart */}
      <div className="h-80 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-gray-700">
          Revenue Trend
        </p>

        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={revenueSeries}>
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Appointment Chart */}
      <div className="h-80 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-gray-700">
          Appointment Status
        </p>

        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={appointmentSeries}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
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