"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, Phone, User, Stethoscope } from "lucide-react";

// static list of departments
const departmentList = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Oncology",
  "Dermatology",
  "Orthopedics",
  "Radiology",
  "Psychiatry",
  "Gastroenterology",
  "Endocrinology",
  "Nephrology",
  "Pulmonology",
  "Urology",
  "Ophthalmology",
  "ENT",
  "Rheumatology",
  "Hematology",
  "Infectious Disease",
  "Plastic Surgery",
  "Allergy & Immunology",
];

// doctor list is intentionally left empty; real data should be fetched based on department
const doctorOptions: { id: number; name: string; specialty: string }[] = []; // no prefilled doctors

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
  const [department, setDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [reason, setReason] = useState("");

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
              <select
                name="department"
                className="pl-8 h-10 w-full rounded-md border bg-white py-2 pr-3 text-base focus:outline-none"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select...</option>
                {departmentList.map((sp) => (
                  <option key={sp} value={sp}>{sp}</option>
                ))}
              </select>
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

          <div className="md:col-span-2">
            <Label>Reason for Visit</Label>
            <Input
              name="reason"
              placeholder="Brief description of issue"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          {/* DOCTOR SELECTION TABLE */}
          {department && (
            <div className="md:col-span-2">
              <Label>Select Preferred Doctor</Label>
              {doctorOptions.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">
                  No doctors are pre-filled. Doctor list will be loaded after
                  department selection or from the server.
                </p>
              ) : (
                <div className="mt-2 overflow-x-auto max-h-60">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Pick</th>
                        <th className="p-2 text-left">Doctor</th>
                        <th className="p-2 text-left">Specialty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorOptions
                        .filter((doc) => doc.specialty === department)
                        .map((doc) => (
                          <tr
                            key={doc.id}
                            className={`border-t hover:bg-blue-50 ${
                              selectedDoctor === doc.id ? "bg-blue-100" : ""
                            }`}
                          >
                            <td className="p-2">
                              <input
                                type="radio"
                                name="doctor"
                                value={doc.id}
                                checked={selectedDoctor === doc.id}
                                onChange={() => setSelectedDoctor(doc.id)}
                                className="h-4 w-4"
                                required
                              />
                            </td>
                            <td className="p-2">{doc.name}</td>
                            <td className="p-2">{doc.specialty}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

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