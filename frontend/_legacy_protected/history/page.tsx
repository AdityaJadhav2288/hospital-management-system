import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Medical History" description="Patient past consultations and records" />
      <Card>
        <CardHeader>
          <CardTitle>History Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>2026-02-14: Cardiology follow-up, medication adjusted.</li>
            <li>2026-01-05: Neurology consultation for migraine.</li>
            <li>2025-11-22: Annual checkup completed.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
