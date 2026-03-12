import { Suspense } from "react";
import { DashboardIndexPageClient } from "@/app/dashboard/dashboard-index-page-client";

export const dynamic = "force-dynamic";

export default function DashboardIndexPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Redirecting...</div>}>
      <DashboardIndexPageClient />
    </Suspense>
  );
}
