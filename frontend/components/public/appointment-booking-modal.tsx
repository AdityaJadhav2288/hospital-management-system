"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, Phone, User, Stethoscope } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

    if (loading) return;

    setLoading(true);

    if (!user || user.role !== "patient") {
      toast.info("Please login as a patient to continue booking.");
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
          <DialogTitle className="text-lg font-semibold">
            Appointment Request
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Enter your details and continue in the patient portal to confirm
            your appointment.
          </p>
        </DialogHeader>

        {/* FORM */}

        <form
          className="mt-3 grid gap-4 md:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <div className="space-y-1">
            <Label>Name</Label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                name="name"
                placeholder="Your full name"
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Phone</Label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                name="phone"
                placeholder="Mobile number"
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Department</Label>
            <div className="relative">
              <Stethoscope size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                name="department"
                placeholder="Cardiology / Neurology"
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Preferred Date</Label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                name="preferredDate"
                type="date"
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-1">
            <Button type="submit" fullWidth loading={loading}>
              Continue
            </Button>
          </div>
        </form>

        <p className="text-xs text-muted-foreground text-center">
          Already have an account?{" "}
          <Link
            className="text-primary font-medium underline"
            href="/login/patient"
          >
            Patient login
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}