"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { defaultDashboardByRole } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

interface AppointmentBookingModalProps {
  triggerClassName?: string;
  triggerLabel?: string;
  doctorId?: string;
}

export function AppointmentBookingModal({
  triggerClassName,
  triggerLabel = "Book Appointment",
  doctorId,
}: AppointmentBookingModalProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const bookingRedirect = doctorId
    ? `/patient/appointments/book?doctorId=${encodeURIComponent(doctorId)}`
    : "/patient/appointments/book";

  const handleTriggerClick = () => {
    if (!user) {
      router.push(`/login/patient?redirect=${encodeURIComponent(bookingRedirect)}`);
      return;
    }

    if (user.role !== "patient") {
      toast.info("Booking is available from a patient account.");
      router.push(defaultDashboardByRole[user.role]);
      return;
    }

    router.push(bookingRedirect);
  };

  return (
    <Button className={triggerClassName} onClick={handleTriggerClick}>
      {triggerLabel}
    </Button>
  );
}
