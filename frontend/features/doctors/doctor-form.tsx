"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolverV4 } from "@/lib/zod-resolver";
import { doctorSchema, type DoctorSchema } from "@/lib/validators/doctor";
import { doctorsService } from "@/services/doctors.service";
import type { Doctor } from "@/types/doctor";

interface DoctorFormProps {
  initial?: Doctor;
  onComplete?: () => void;
}

export function DoctorForm({ initial, onComplete }: DoctorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DoctorSchema>({
    resolver: zodResolverV4(doctorSchema),
    defaultValues: initial,
  });

  const submit = async (values: DoctorSchema) => {
    if (initial) {
      await doctorsService.update(initial.id, values);
      toast.success("Doctor updated");
    } else {
      await doctorsService.create(values);
      toast.success("Doctor created");
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
        <Input {...register("name")} placeholder="Doctor full name" />
        {errors.name ? (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        ) : null}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Email</Label>
        <Input {...register("email")} placeholder="doctor@email.com" />
      </div>

      {/* Specialization */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Specialization</Label>
        <Input {...register("specialization")} placeholder="e.g. Cardiologist" />
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">
          Experience (Years)
        </Label>
        <Input type="number" {...register("experienceYears")} />
      </div>

      {/* Password (create only) */}
      {!initial ? (
        <div className="space-y-2 md:col-span-2">
          <Label className="font-semibold text-gray-700">
            Temporary Password
          </Label>
          <Input
            type="password"
            {...register("password")}
            placeholder="Minimum 8 characters"
          />
        </div>
      ) : null}

      {/* Submit */}
      <div className="md:col-span-2">
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Saving..." : "Save Doctor"}
        </Button>
      </div>
    </form>
  );
}