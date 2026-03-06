"use client";

import { Building2, Mail, Phone, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DoctorCardProps {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  department?: string;
  phone?: string;
  email?: string;
  onBook?: (doctorId: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DoctorCard({
  id,
  name,
  specialization,
  experienceYears,
  department,
  phone,
  email,
  onBook,
}: DoctorCardProps) {
  return (
    <Card className="rounded-[1.75rem] border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-lg font-semibold text-white shadow-sm">
              {getInitials(name)}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold leading-tight text-slate-900">{name}</h3>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                <Stethoscope size={13} />
                {specialization}
              </div>
            </div>
          </div>

          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {experienceYears} yrs
          </div>
        </div>

        <div className="grid gap-2 text-sm text-slate-600">
          {department ? (
            <div className="flex items-center gap-2">
              <Building2 size={15} className="text-slate-400" />
              <span>{department}</span>
            </div>
          ) : null}
          {phone ? (
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-slate-400" />
              <span>{phone}</span>
            </div>
          ) : null}
          {email ? (
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-slate-400" />
              <span className="truncate">{email}</span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">
            Hospital verified specialist
          </p>
          <Button size="sm" className="h-9 rounded-full px-4" onClick={() => onBook?.(id)}>
            Book Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
