"use client";

import { useEffect, useMemo, useState } from "react";
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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppointmentForm({ onBooked }: AppointmentFormProps) {
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get("doctorId");
  const [doctorSearch, setDoctorSearch] = useState("");

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

  const { data: doctors, execute: loadDoctors, loading: doctorsLoading } = useApi(appointmentsService.listDoctors);
  const selectedDoctorId = watch("doctorId");

  useEffect(() => {
    void loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    if (preselectedDoctorId) {
      setValue("doctorId", preselectedDoctorId, { shouldValidate: true });
    }
  }, [preselectedDoctorId, setValue]);

  const filteredDoctors = useMemo(() => {
    const rows = doctors || [];
    if (!doctorSearch.trim()) return rows;
    const term = doctorSearch.toLowerCase();
    return rows.filter((doctor) =>
      [doctor.name, doctor.specialization, doctor.department, doctor.phone, doctor.email]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term)),
    );
  }, [doctorSearch, doctors]);

  const selectedDoctor = useMemo(
    () => (doctors || []).find((doctor) => doctor.id === selectedDoctorId),
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
    <form className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]" onSubmit={handleSubmit(submit)}>
      <input type="hidden" {...register("doctorId")} />

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Choose your doctor</h3>
              <p className="text-sm text-slate-500">
                Select from the hospital’s predefined specialist roster.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <Input
                value={doctorSearch}
                onChange={(event) => setDoctorSearch(event.target.value)}
                placeholder="Search doctor, specialty..."
                className="pl-8"
              />
            </div>
          </div>

          {doctorsLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-48 rounded-[1.5rem]" />
              ))}
            </div>
          ) : (
            <div className="max-h-[52vh] overflow-y-auto pr-1">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredDoctors.map((doctor) => {
                  const isSelected = selectedDoctorId === doctor.id;

                  return (
                    <div
                      key={doctor.id}
                      className={cn(
                        "rounded-[1.5rem] border bg-white p-4 transition-all",
                        isSelected
                          ? "border-sky-500 ring-2 ring-sky-200 shadow-md"
                          : "border-slate-200 hover:border-sky-300 hover:shadow-sm",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-sm font-semibold text-white">
                            {getInitials(doctor.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{doctor.name}</p>
                            <p className="text-sm text-sky-700">{doctor.specialization}</p>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            <CheckCircle2 size={14} />
                            Selected
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Stethoscope size={15} className="text-slate-400" />
                          <span>{doctor.experienceYears} years experience</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 size={15} className="text-slate-400" />
                          <span>{doctor.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={15} className="text-slate-400" />
                          <span>{doctor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={15} className="text-slate-400" />
                          <span className="truncate">{doctor.email}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          size="sm"
                          variant={isSelected ? "outline" : "default"}
                          className="h-8 rounded-full px-4"
                          onClick={() => setValue("doctorId", doctor.id, { shouldValidate: true, shouldDirty: true })}
                        >
                          {isSelected ? "Selected" : "Book Appointment"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errors.doctorId ? <p className="text-xs text-red-500">{errors.doctorId.message}</p> : null}
          {!doctorsLoading && filteredDoctors.length === 0 ? (
            <p className="text-sm text-slate-500">
              No doctors matched your search.
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Appointment details</h3>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Date & Time</Label>
              <Input type="datetime-local" {...register("dateTime")} />
              {errors.dateTime ? <p className="text-xs text-red-500">{errors.dateTime.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Reason</Label>
              <Input {...register("reason")} placeholder="Describe symptoms or purpose" />
              {errors.reason ? <p className="text-xs text-red-500">{errors.reason.message}</p> : null}
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-700">Selected Doctor</p>
          {selectedDoctor ? (
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p className="text-base font-semibold text-slate-900">{selectedDoctor.name}</p>
              <p>{selectedDoctor.specialization}</p>
              <p>{selectedDoctor.department}</p>
              <p>{selectedDoctor.phone}</p>
              <p className="truncate">{selectedDoctor.email}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Choose a doctor using the small button on the left card.</p>
          )}
        </div>

        <Button className="h-11 w-full rounded-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Confirm Appointment"}
        </Button>
      </div>
    </form>
  );
}
