"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApi } from "@/hooks/use-api";
import { zodResolverV4 } from "@/lib/zod-resolver";
import { appointmentSchema, type AppointmentSchema } from "@/lib/validators/appointment";
import { appointmentsService } from "@/services/appointments.service";

export function AppointmentForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AppointmentSchema>({ resolver: zodResolverV4(appointmentSchema) });

  const { data: doctorOptions, execute: loadDoctors, loading: doctorsLoading } =
    useApi(appointmentsService.listDoctorOptions);

  useEffect(() => {
    void loadDoctors();
  }, [loadDoctors]);

  const submit = async (values: AppointmentSchema) => {
    await appointmentsService.book(values);
    toast.success("Appointment request submitted");
    reset();
  };

  return (
    <form
      className="grid gap-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2"
      onSubmit={handleSubmit(submit)}
    >
      {/* Doctor Select */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Doctor</Label>

        <Select onValueChange={(value) => setValue("doctorId", value)}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                doctorsLoading ? "Loading doctors..." : "Choose doctor"
              }
            />
          </SelectTrigger>

          <SelectContent>
            {(doctorOptions || []).map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.doctorId ? (
          <p className="text-xs text-red-500">{errors.doctorId.message}</p>
        ) : null}
      </div>

      {/* Date Time */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Date & Time</Label>

        <Input type="datetime-local" {...register("dateTime")} />

        {errors.dateTime ? (
          <p className="text-xs text-red-500">{errors.dateTime.message}</p>
        ) : null}
      </div>

      {/* Reason */}
      <div className="space-y-2 md:col-span-2">
        <Label className="font-semibold text-gray-700">Reason</Label>

        <Input
          {...register("reason")}
          placeholder="Describe symptoms or purpose"
        />

        {errors.reason ? (
          <p className="text-xs text-red-500">{errors.reason.message}</p>
        ) : null}
      </div>

      {/* Submit */}
      <div className="md:col-span-2">
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Book Appointment"}
        </Button>
      </div>
    </form>
  );
}