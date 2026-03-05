"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AppointmentBookingModalProps {
  triggerClassName?: string;
  triggerLabel?: string;
}

export function AppointmentBookingModal({
  triggerClassName,
  triggerLabel = "Book Appointment",
}: AppointmentBookingModalProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!user || user.role !== "patient") {
      toast.info("Login as patient to complete booking.");
      setLoading(false);
      setOpen(false);
      router.push("/login/patient");
      return;
    }

    toast.success("Continue in patient dashboard to confirm appointment.");
    setLoading(false);
    setOpen(false);
    router.push("/patient/dashboard/appointments");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Appointment Request</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Share preferred details. We will guide you to the patient portal to confirm.
          </p>
        </DialogHeader>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label>Name</Label>
            <Input name="name" required />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input name="phone" required />
          </div>
          <div className="space-y-1">
            <Label>Department</Label>
            <Input name="department" placeholder="Cardiology" required />
          </div>
          <div className="space-y-1">
            <Label>Preferred Date</Label>
            <Input name="preferredDate" type="date" required />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Continue"}
            </Button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground">
          Already have account?{" "}
          <Link className="text-primary underline" href="/login/patient">
            Patient login
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
