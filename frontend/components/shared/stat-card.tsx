import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <Card className="rounded-[1.5rem] border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {icon ? (
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            {icon}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
