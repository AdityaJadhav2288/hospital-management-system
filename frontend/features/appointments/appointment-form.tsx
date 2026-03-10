"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Building2, CheckCircle2, Mail, Phone, Search, Stethoscope } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { zodResolverV4 } from "@/lib/zod-resolver";
import { appointmentSchema, type AppointmentSchema } from "@/lib/validators/appointment";
import { appointmentsService } from "@/services/appointments.service";

interface AppointmentFormProps {
  onBooked?: () => void;
}

function getInitials(name?: string | null) {
  const safeName = name?.trim() || "Doctor";

  return safeName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "DR";
}

export function AppointmentForm({ onBooked }: AppointmentFormProps) {
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get("doctorId");

  const [doctorSearch, setDoctorSearch] = useState("");

  const appointmentDetailsRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AppointmentSchema>({
    resolver: zodResolverV4(appointmentSchema),
  });

  const { data: doctors, execute: loadDoctors, loading: doctorsLoading } =
    useApi(appointmentsService.listDoctors);

  const selectedDoctorId = watch("doctorId");

  useEffect(() => {
    void loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    if (preselectedDoctorId) {
      setValue("doctorId", preselectedDoctorId, { shouldValidate: true });
    }
  }, [preselectedDoctorId, setValue]);

  const scrollToAppointment = () => {
    appointmentDetailsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const filteredDoctors = useMemo(() => {
    const rows = Array.isArray(doctors) ? doctors.filter(Boolean) : [];
    if (!doctorSearch.trim()) return rows;

    const term = doctorSearch.toLowerCase();

    return rows.filter((doctor) =>
      [doctor?.name, doctor?.specialization, doctor?.department, doctor?.phone, doctor?.email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [doctorSearch, doctors]);

  const selectedDoctor = useMemo(
    () => (Array.isArray(doctors) ? doctors.filter(Boolean) : []).find((doctor) => doctor?.id === selectedDoctorId),
    [doctors, selectedDoctorId],
  );

  const submit = async (values: AppointmentSchema) => {
    await appointmentsService.book(values);
    toast.success("Appointment request submitted");
    reset();
    setDoctorSearch("");
    onBooked?.();
  };

  return (
    <form
      className="w-full grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]"
      onSubmit={handleSubmit(submit)}
    >
      <input type="hidden" {...register("doctorId")} />

      {/* Doctor Selection */}
      <div className="rounded-lg md:rounded-[1.75rem] border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
        <div className="space-y-4">

          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">Choose your doctor</h3>
              <p className="text-sm text-slate-500">Select from hospital specialists</p>
            </div>

            <div className="relative w-full sm:min-w-64">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <Input
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                placeholder="Search doctor..."
                className="pl-8"
              />
            </div>
          </div>

          {/* Doctors List */}
          {doctorsLoading ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="max-h-[45vh] overflow-y-auto pr-2">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {filteredDoctors.map((doctor) => {
                  const isSelected = selectedDoctorId === doctor?.id;

                  return (
                    <div
                      key={doctor.id}
                      className={cn(
                        "rounded-xl border p-4 cursor-pointer transition",
                        isSelected
                          ? "border-sky-500 ring-2 ring-sky-200"
                          : "border-slate-200 hover:border-sky-300",
                      )}
                      onClick={() => {
                        setValue("doctorId", doctor.id, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });

                        scrollToAppointment();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-sky-600 text-white font-semibold">
                          {getInitials(doctor.name)}
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold">{doctor.name}</p>
                          <p className="text-sm text-sky-700">{doctor.specialization}</p>
                        </div>

                        {isSelected && <CheckCircle2 className="text-green-500" size={18} />}
                      </div>

                      <div className="mt-3 space-y-1 text-sm text-slate-600">
                        <p>{doctor.experienceYears} years experience</p>
                        <p>{doctor.department}</p>
                        <p>{doctor.phone}</p>
                        <p className="text-xs">{doctor.email}</p>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <Button
                          type="button"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();

                            setValue("doctorId", doctor.id, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });

                            scrollToAppointment();
                          }}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errors.doctorId && (
            <p className="text-xs text-red-500 font-medium">{errors.doctorId.message}</p>
          )}
        </div>
      </div>

      {/* Appointment Details */}
      <div ref={appointmentDetailsRef} className="space-y-4">

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Appointment details</h3>

          <div className="mt-4 space-y-4">

            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Input type="datetime-local" {...register("dateTime")} />
              {errors.dateTime && (
                <p className="text-xs text-red-500">{errors.dateTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Reason</Label>
              <Input {...register("reason")} placeholder="Describe symptoms" />
              {errors.reason && (
                <p className="text-xs text-red-500">{errors.reason.message}</p>
              )}
            </div>

          </div>
        </div>

        {/* Selected Doctor Preview */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Selected Doctor</p>

          {selectedDoctor ? (
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{selectedDoctor.name}</p>
              <p>{selectedDoctor.specialization}</p>
              <p>{selectedDoctor.department}</p>
              <p>{selectedDoctor.phone}</p>
              <p className="text-xs">{selectedDoctor.email}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Choose a doctor from the list to proceed.
            </p>
          )}
        </div>

        <Button
          className="h-11 w-full rounded-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Confirm Appointment"}
        </Button>

      </div>
    </form>
  );
}