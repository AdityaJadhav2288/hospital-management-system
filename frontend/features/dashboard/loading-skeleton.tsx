import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <Skeleton className="mb-4 h-4 w-1/4" />
        <Skeleton className="h-72 w-full" />
      </div>

    </div>
  );
}