"use client";

import { CalendarClock, CheckCircle2, CircleDashed, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus } from "@/types/appointment";

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  if (status === "COMPLETED") {
    return (
      <Badge tone="success" className="gap-1.5">
        <CheckCircle2 size={12} />
        Completed
      </Badge>
    );
  }

  if (status === "CANCELLED") {
    return (
      <Badge tone="danger" className="gap-1.5">
        <XCircle size={12} />
        Cancelled
      </Badge>
    );
  }

  if (status === "CONFIRMED") {
    return (
      <Badge className="gap-1.5 border border-sky-200 bg-sky-50 text-sky-700">
        <CalendarClock size={12} />
        Scheduled
      </Badge>
    );
  }

  return (
    <Badge tone="warning" className="gap-1.5">
      <CircleDashed size={12} />
      Pending
    </Badge>
  );
}
