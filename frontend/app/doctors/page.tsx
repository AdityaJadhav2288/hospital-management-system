"use client";

import { useEffect, useState } from "react";
import { DoctorCard } from "@/components/DoctorCard";
import { PublicShell } from "@/components/public/public-shell";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { publicService } from "@/services/public.service";

export default function DoctorsPage() {
  const [specialty, setSpecialty] = useState("");
  const { data, execute } = useApi(publicService.getDoctors);

  useEffect(() => {
    void execute(specialty || undefined);
  }, [execute, specialty]);

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Doctors</h1>
          <Input value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="max-w-sm" placeholder="Filter by specialty" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {(data || []).map((doctor) => (
            <DoctorCard
              key={doctor.id}
              name={doctor.name}
              specialization={doctor.specialization}
              experienceYears={doctor.experienceYears}
              email={doctor.email}
            />
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
