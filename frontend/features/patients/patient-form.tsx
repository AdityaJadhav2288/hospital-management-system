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
    <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(submit)}>
      <div className="space-y-1">
        <Label>Name</Label>
        <Input {...register("name")} />
      </div>
      <div className="space-y-1">
        <Label>Email</Label>
        <Input {...register("email")} />
      </div>
      <div className="space-y-1">
        <Label>Phone</Label>
        <Input {...register("phone")} />
      </div>
      <div className="space-y-1">
        <Label>Address</Label>
        <Input {...register("address")} />
      </div>
      {!initial ? (
        <div className="space-y-1 md:col-span-2">
          <Label>Temporary Password</Label>
          <Input type="password" {...register("password")} placeholder="Minimum 8 characters" />
        </div>
      ) : null}
      {Object.values(errors).length ? <p className="text-xs text-danger md:col-span-2">Please correct validation errors.</p> : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Patient"}</Button>
      </div>
    </form>
  );
}
