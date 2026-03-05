"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoctorForm } from "@/features/doctors/doctor-form";
import { useApi } from "@/hooks/use-api";
import { doctorsService } from "@/services/doctors.service";
import type { Doctor } from "@/types/doctor";

export default function AdminDoctorsPage() {
  const [specialization, setSpecialization] = useState("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const { data, execute } = useApi(doctorsService.list);

  useEffect(() => {
    void execute(specialization);
  }, [execute, specialization]);

  const specializations = useMemo(() => {
    const set = new Set((data || []).map((item) => item.specialization));
    return ["all", ...Array.from(set)];
  }, [data]);

  const removeDoctor = async () => {
    if (!selectedDoctor) return;
    await doctorsService.remove(selectedDoctor.id);
    toast.success("Doctor deleted");
    void execute(specialization);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Doctors" description="Create, edit and remove doctor profiles" />
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Doctors</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Doctor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Doctor</DialogTitle>
              </DialogHeader>
              <DoctorForm onComplete={() => void execute(specialization)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select defaultValue="all" onValueChange={setSpecialization}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DataTable
            rows={(data || []).map((item) => ({ ...item, action: item }))}
            columns={[
              { key: "name", header: "Name" },
              { key: "email", header: "Email" },
              { key: "specialization", header: "Specialization" },
              { key: "experienceYears", header: "Experience" },
              {
                key: "action",
                header: "Actions",
                render: (value) => (
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setSelectedDoctor(value as Doctor)}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Doctor</DialogTitle>
                        </DialogHeader>
                        <DoctorForm initial={selectedDoctor || undefined} onComplete={() => void execute(specialization)} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setSelectedDoctor(value as Doctor);
                        setConfirmOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Delete this doctor?" onConfirm={removeDoctor} />
    </div>
  );
}
