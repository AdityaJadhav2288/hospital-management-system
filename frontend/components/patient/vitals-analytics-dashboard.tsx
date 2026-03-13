"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  Droplets,
  HeartPulse,
  ShieldCheck,
  Thermometer,
  Wind,
} from "lucide-react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  type TooltipItem,
  Tooltip,
} from "chart.js";
import annotationPlugin, { type AnnotationOptions } from "chartjs-plugin-annotation";
import { Bar, Line } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PatientVitalRecord, VitalsRange } from "@/types/vitals";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin,
);

interface VitalsAnalyticsDashboardProps {
  records: PatientVitalRecord[];
  compact?: boolean;
}

type MetricPoint = {
  label: string;
  isoDate: string;
  value: number;
};

type RangeBand = {
  id: string;
  label: string;
  min: number;
  max: number;
  tone: "green" | "yellow" | "red";
};

const rangeOptions: Array<{ value: VitalsRange; label: string }> = [
  { value: "today", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const toneStyles = {
  green: {
    bar: "rgba(34, 197, 94, 0.75)",
    line: "#22c55e",
    bg: "rgba(34, 197, 94, 0.10)",
    pill: "bg-emerald-50 text-emerald-700",
  },
  yellow: {
    bar: "rgba(245, 158, 11, 0.78)",
    line: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.10)",
    pill: "bg-amber-50 text-amber-700",
  },
  red: {
    bar: "rgba(239, 68, 68, 0.8)",
    line: "#ef4444",
    bg: "rgba(239, 68, 68, 0.10)",
    pill: "bg-rose-50 text-rose-700",
  },
};

const bloodSugarBands: RangeBand[] = [
  { id: "sugar-normal", label: "Normal", min: 70, max: 140, tone: "green" },
  { id: "sugar-warning", label: "Warning", min: 140, max: 200, tone: "yellow" },
  { id: "sugar-critical", label: "Critical", min: 200, max: 320, tone: "red" },
];

const heartRateBands: RangeBand[] = [
  { id: "heart-normal", label: "Normal", min: 60, max: 100, tone: "green" },
  { id: "heart-warning", label: "Warning", min: 100, max: 120, tone: "yellow" },
  { id: "heart-critical", label: "Critical", min: 120, max: 180, tone: "red" },
];

const cholesterolBands: RangeBand[] = [
  { id: "chol-normal", label: "Normal", min: 0, max: 200, tone: "green" },
  { id: "chol-warning", label: "Warning", min: 200, max: 240, tone: "yellow" },
  { id: "chol-critical", label: "Critical", min: 240, max: 320, tone: "red" },
];

const temperatureBands: RangeBand[] = [
  { id: "temp-normal", label: "Normal", min: 36.1, max: 37.2, tone: "green" },
  { id: "temp-warning", label: "Warning", min: 37.2, max: 38, tone: "yellow" },
  { id: "temp-critical", label: "Critical", min: 38, max: 40.5, tone: "red" },
];

const bloodPressureBands: RangeBand[] = [
  { id: "bp-normal", label: "Normal", min: 90, max: 120, tone: "green" },
  { id: "bp-warning", label: "Warning", min: 120, max: 140, tone: "yellow" },
  { id: "bp-critical", label: "Critical", min: 140, max: 200, tone: "red" },
];

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function formatLongDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function filterRange(records: PatientVitalRecord[], range: VitalsRange) {
  if (!records.length) return [];

  const sorted = records
    .slice()
    .sort((left, right) => new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime());

  const latest = new Date(sorted[sorted.length - 1].recordedAt);
  const start = new Date(latest);

  if (range === "today") {
    start.setDate(start.getDate() - 1);
  } else if (range === "week") {
    start.setDate(start.getDate() - 6);
  } else {
    start.setDate(start.getDate() - 29);
  }

  return sorted.filter((row) => new Date(row.recordedAt).getTime() >= start.getTime());
}

function getMetricPoints(records: PatientVitalRecord[], key: keyof PatientVitalRecord): MetricPoint[] {
  return records
    .filter((row) => typeof row[key] === "number")
    .map((row) => ({
      label: formatShortDate(row.recordedAt),
      isoDate: row.recordedAt,
      value: Number(row[key]),
    }));
}

function getBloodPressurePoints(records: PatientVitalRecord[]) {
  return records
    .filter((row) => typeof row.bpSystolic === "number" || typeof row.bpDiastolic === "number")
    .map((row) => ({
      label: formatShortDate(row.recordedAt),
      isoDate: row.recordedAt,
      systolic: row.bpSystolic ?? null,
      diastolic: row.bpDiastolic ?? null,
    }));
}

function resolveTone(value: number, bands: RangeBand[]) {
  const match = bands.find((band) => value >= band.min && value < band.max);
  return match?.tone || "red";
}

function createBandAnnotations(bands: RangeBand[], maxValue: number) {
  const upper = Math.max(maxValue, bands[bands.length - 1]?.max ?? maxValue);

  return Object.fromEntries(
    bands.map((band) => [
      band.id,
      {
        type: "box",
        yMin: band.min,
        yMax: band.max >= upper ? upper : band.max,
        backgroundColor: toneStyles[band.tone].bg,
        borderWidth: 0,
      },
    ]),
  ) as Record<string, AnnotationOptions<"box">>;
}

function emptyBarOptions(maxValue: number, bands: RangeBand[], unit: string): ChartOptions<"bar"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 650 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title(items: TooltipItem<"bar">[]) {
            const labels = items[0]?.chart.data.labels;
            const dataIndex = items[0]?.dataIndex ?? 0;
            const rawLabel = Array.isArray(labels) ? labels[dataIndex] : "";
            return typeof rawLabel === "string" ? rawLabel : "";
          },
          label(context: TooltipItem<"bar">) {
            return `${context.parsed.y}${unit}`;
          },
        },
      },
      annotation: {
        annotations: createBandAnnotations(bands, maxValue * 1.15),
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgba(100,116,139,0.95)" },
      },
      y: {
        suggestedMax: maxValue * 1.15,
        ticks: { color: "rgba(100,116,139,0.95)" },
        grid: { color: "rgba(148,163,184,0.15)" },
      },
    },
  };
}

function chartCardTone(value: number | null, bands: RangeBand[]) {
  if (value === null) return "bg-slate-50 text-slate-700";
  return toneStyles[resolveTone(value, bands)].pill;
}

function SummaryCard({
  title,
  value,
  helper,
  icon,
  tone,
}: {
  title: string;
  value: string;
  helper: string;
  icon: ReactNode;
  tone: string;
}) {
  return (
    <Card className="rounded-[1.65rem] border-border/80 bg-card/95 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.3)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className={cn("rounded-2xl p-3", tone)}>{icon}</div>
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
        <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}

function EmptyChart({ title }: { title: string }) {
  return (
    <div className="flex h-[320px] items-center justify-center rounded-[1.6rem] border border-dashed border-border bg-muted/20 text-center">
      <div className="space-y-2 px-6">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">No vitals captured for the selected time range yet.</p>
      </div>
    </div>
  );
}

function IndicatorBarChart({
  title,
  description,
  data,
  bands,
  unit,
  icon,
}: {
  title: string;
  description: string;
  data: MetricPoint[];
  bands: RangeBand[];
  unit: string;
  icon: ReactNode;
}) {
  if (!data.length) {
    return <EmptyChart title={title} />;
  }

  const latest = data[data.length - 1];
  const maxValue = Math.max(...data.map((item) => item.value), bands[bands.length - 1]?.max ?? 0);

  return (
    <Card className="rounded-[1.9rem] border-border/80 bg-card/95 shadow-[0_18px_55px_-34px_rgba(15,23,42,0.28)]">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base text-foreground">{title}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-2xl border border-border bg-muted/40 p-3 text-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Latest reading</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {latest.value}
              {unit}
            </p>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", chartCardTone(latest.value, bands))}>
            {resolveTone(latest.value, bands).toUpperCase()}
          </span>
        </div>
        <div className="h-[260px]">
          <Bar
            data={{
              labels: data.map((item) => item.label),
              datasets: [
                {
                  data: data.map((item) => item.value),
                  borderRadius: 10,
                  backgroundColor: data.map((item) => toneStyles[resolveTone(item.value, bands)].bar),
                },
              ],
            }}
            options={emptyBarOptions(maxValue, bands, unit)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function BloodPressureChart({
  data,
}: {
  data: Array<{ label: string; isoDate: string; systolic: number | null; diastolic: number | null }>;
}) {
  if (!data.length) {
    return <EmptyChart title="Blood Pressure Trend" />;
  }

  const latest = data[data.length - 1];
  const maxValue = Math.max(
    ...data.flatMap((item) => [item.systolic ?? 0, item.diastolic ?? 0]),
    bloodPressureBands[bloodPressureBands.length - 1]?.max ?? 0,
  );

  return (
    <Card className="rounded-[1.9rem] border-border/80 bg-card/95 shadow-[0_18px_55px_-34px_rgba(15,23,42,0.28)]">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base text-foreground">Blood Pressure Trend</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Systolic and diastolic movement with medical threshold bands.</p>
        </div>
        <div className="rounded-2xl border border-border bg-muted/40 p-3 text-foreground">
          <Activity className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Latest reading</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {latest.systolic ?? "-"} / {latest.diastolic ?? "-"} mmHg
            </p>
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              chartCardTone(latest.systolic ?? null, bloodPressureBands),
            )}
          >
            {latest.systolic ? resolveTone(latest.systolic, bloodPressureBands).toUpperCase() : "NO DATA"}
          </span>
        </div>
        <div className="h-[280px]">
          <Line
            data={{
              labels: data.map((item) => item.label),
              datasets: [
                {
                  label: "Systolic",
                  data: data.map((item) => item.systolic),
                  borderColor: "#2563eb",
                  backgroundColor: "rgba(37, 99, 235, 0.15)",
                  fill: true,
                  tension: 0.35,
                  pointRadius: 4,
                  pointBackgroundColor: data.map((item) =>
                    item.systolic ? toneStyles[resolveTone(item.systolic, bloodPressureBands)].line : "#94a3b8",
                  ),
                },
                {
                  label: "Diastolic",
                  data: data.map((item) => item.diastolic),
                  borderColor: "#0f766e",
                  backgroundColor: "rgba(15, 118, 110, 0.08)",
                  fill: false,
                  tension: 0.35,
                  pointRadius: 4,
                  pointBackgroundColor: "#0f766e",
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 700 },
              plugins: {
                legend: { position: "top" as const },
                tooltip: {
                  callbacks: {
                    title(items) {
                      return items[0]?.label || "";
                    },
                    label(context) {
                      return `${context.dataset.label}: ${context.parsed.y} mmHg`;
                    },
                  },
                },
                annotation: {
                  annotations: createBandAnnotations(bloodPressureBands, maxValue * 1.15),
                },
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: "rgba(100,116,139,0.95)" },
                },
                y: {
                  suggestedMax: maxValue * 1.15,
                  ticks: { color: "rgba(100,116,139,0.95)" },
                  grid: { color: "rgba(148,163,184,0.15)" },
                },
              },
            } satisfies ChartOptions<"line">}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function VitalsAnalyticsDashboard({ records, compact = false }: VitalsAnalyticsDashboardProps) {
  const [range, setRange] = useState<VitalsRange>("month");

  const filteredRecords = useMemo(() => filterRange(records, range), [records, range]);
  const bloodSugar = useMemo(() => getMetricPoints(filteredRecords, "bloodSugar"), [filteredRecords]);
  const heartRate = useMemo(() => getMetricPoints(filteredRecords, "heartRate"), [filteredRecords]);
  const cholesterol = useMemo(() => getMetricPoints(filteredRecords, "cholesterol"), [filteredRecords]);
  const temperature = useMemo(() => getMetricPoints(filteredRecords, "temperatureC"), [filteredRecords]);
  const bloodPressure = useMemo(() => getBloodPressurePoints(filteredRecords), [filteredRecords]);

  const latestRecord = useMemo(() => records[0] || null, [records]);
  const compactCharts = compact
    ? [
        <IndicatorBarChart
          key="compact-sugar"
          title="Blood Sugar Control"
          description="Colored readings for diabetes-style monitoring."
          data={bloodSugar}
          bands={bloodSugarBands}
          unit=" mg/dL"
          icon={<Droplets className="h-5 w-5" />}
        />,
        <BloodPressureChart key="compact-bp" data={bloodPressure} />,
      ]
    : [];

  return (
    <div className="space-y-6">
      {!compact ? (
        <section className="overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(135deg,rgba(15,23,42,0.03),rgba(59,130,246,0.05),rgba(14,165,233,0.06))] p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Vitals Dashboard
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Advanced patient vitals monitoring
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Medical-style indicator graphs with risk-colored ranges for diabetes control, heart rate, cholesterol,
                  blood pressure, and thermal monitoring.
                </p>
              </div>
            </div>

            <div className="inline-flex w-full rounded-2xl border border-border bg-card/90 p-1 sm:w-auto">
              {rangeOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="ghost"
                  onClick={() => setRange(option.value)}
                  className={cn(
                    "h-10 flex-1 rounded-xl px-4 text-sm font-semibold sm:flex-none",
                    range === option.value && "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Latest blood sugar"
          value={latestRecord?.bloodSugar ? `${latestRecord.bloodSugar} mg/dL` : "No reading"}
          helper={latestRecord ? `Updated ${formatLongDate(latestRecord.recordedAt)}` : "No readings yet"}
          icon={<Droplets className="h-5 w-5 text-violet-700" />}
          tone={chartCardTone(latestRecord?.bloodSugar ?? null, bloodSugarBands)}
        />
        <SummaryCard
          title="Latest heart rate"
          value={latestRecord?.heartRate ? `${latestRecord.heartRate} bpm` : "No reading"}
          helper="Cardiac rhythm from the most recent vitals check"
          icon={<HeartPulse className="h-5 w-5 text-rose-700" />}
          tone={chartCardTone(latestRecord?.heartRate ?? null, heartRateBands)}
        />
        <SummaryCard
          title="Latest cholesterol"
          value={latestRecord?.cholesterol ? `${latestRecord.cholesterol} mg/dL` : "No reading"}
          helper="Shows risk band for lipid monitoring"
          icon={<Activity className="h-5 w-5 text-cyan-700" />}
          tone={chartCardTone(latestRecord?.cholesterol ?? null, cholesterolBands)}
        />
        <SummaryCard
          title="Latest SpO2"
          value={latestRecord?.spo2 ? `${latestRecord.spo2}%` : "No reading"}
          helper={latestRecord?.bmi ? `BMI ${latestRecord.bmi}` : "BMI calculated when height and weight exist"}
          icon={<Wind className="h-5 w-5 text-emerald-700" />}
          tone="bg-emerald-50 text-emerald-700"
        />
      </div>

      {compact ? (
        <div className="grid gap-6 xl:grid-cols-2">{compactCharts}</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <IndicatorBarChart
              title="Blood Sugar Control Chart"
              description="Diabetes-style monitoring with green, yellow, and red control bands."
              data={bloodSugar}
              bands={bloodSugarBands}
              unit=" mg/dL"
              icon={<Droplets className="h-5 w-5" />}
            />
            <IndicatorBarChart
              title="Heart Rate Chart"
              description="Responsive pulse monitoring with medical indicator coloring."
              data={heartRate}
              bands={heartRateBands}
              unit=" bpm"
              icon={<HeartPulse className="h-5 w-5" />}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <IndicatorBarChart
              title="Cholesterol Chart"
              description="Lipid control chart with warning and critical ranges."
              data={cholesterol}
              bands={cholesterolBands}
              unit=" mg/dL"
              icon={<Activity className="h-5 w-5" />}
            />
            <BloodPressureChart data={bloodPressure} />
          </div>

          <IndicatorBarChart
            title="Temperature Trend"
            description="Body temperature graph with normal, warning, and critical fever ranges."
            data={temperature}
            bands={temperatureBands}
            unit=" °C"
            icon={<Thermometer className="h-5 w-5" />}
          />
        </div>
      )}
    </div>
  );
}
