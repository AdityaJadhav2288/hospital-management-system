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
    <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(submit)}>
      <div className="space-y-1">
        <Label>Name</Label>
        <Input {...register("name")} />
        {errors.name ? <p className="text-xs text-danger">{errors.name.message}</p> : null}
      </div>
      <div className="space-y-1">
        <Label>Email</Label>
        <Input {...register("email")} />
      </div>
      <div className="space-y-1">
        <Label>Specialization</Label>
        <Input {...register("specialization")} />
      </div>
      <div className="space-y-1">
        <Label>Experience (Years)</Label>
        <Input type="number" {...register("experienceYears")} />
      </div>
      {!initial ? (
        <div className="space-y-1 md:col-span-2">
          <Label>Temporary Password</Label>
          <Input type="password" {...register("password")} placeholder="Minimum 8 characters" />
        </div>
      ) : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Doctor"}</Button>
      </div>
    </form>
  );
}
