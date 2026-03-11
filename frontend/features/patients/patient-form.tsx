"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolverV4 } from "@/lib/zod-resolver";
import { patientSchema, type PatientSchema } from "@/lib/validators/patient";
import { patientsService } from "@/services/patients.service";
import type { Patient } from "@/types/patient";

interface PatientFormProps {
  initial?: Patient;
  onComplete?: () => void;
}

export function PatientForm({ initial, onComplete }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientSchema>({
    resolver: zodResolverV4(patientSchema),
    defaultValues: initial,
  });

  const submit = async (values: PatientSchema) => {
    if (initial) {
      await patientsService.update(initial.id, values);
      toast.success("Patient updated");
    } else {
      await patientsService.create(values);
      toast.success("Patient created");
    }
    onComplete?.();
  };

  return (
    <form
      className="grid gap-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2"
      onSubmit={handleSubmit(submit)}
    >
      {/* Name */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Name</Label>
        <Input {...register("name")} placeholder="Patient full name" />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Email</Label>
        <Input {...register("email")} placeholder="patient@email.com" />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Phone</Label>
        <Input {...register("phone")} placeholder="+91 9876543210" />
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Address</Label>
        <Input {...register("address")} placeholder="City, Street address" />
      </div>

      {/* Password (only when creating) */}
      {!initial ? (
        <div className="space-y-2 md:col-span-2">
          <Label className="font-semibold text-gray-700">Password</Label>
          <Input
            type="password"
            {...register("password")}
            required={!initial}
            placeholder="Minimum 8 characters"
          />
        </div>
      ) : null}

      {/* Validation message */}
      {Object.values(errors).length ? (
        <p className="text-xs text-red-500 md:col-span-2">
          Please correct validation errors.
        </p>
      ) : null}

      {/* Submit */}
      <div className="md:col-span-2">
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Saving..." : "Save Patient"}
        </Button>
      </div>
    </form>
  );
}
