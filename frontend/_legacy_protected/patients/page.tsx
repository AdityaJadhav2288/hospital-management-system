"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PatientForm } from "@/features/patients/patient-form";
import { useApi } from "@/hooks/use-api";
import { patientsService } from "@/services/patients.service";
import type { Patient } from "@/types/patient";

export default function PatientsPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { data, execute } = useApi(patientsService.list);

  useEffect(() => {
    void execute();
  }, [execute]);

  const removePatient = async () => {
    if (!selectedPatient) return;
    await patientsService.remove(selectedPatient.id);
    toast.success("Patient deleted");
    void execute();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Management" description="Create, edit, remove and review patient profiles" />
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Patients</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Patient</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Patient</DialogTitle>
              </DialogHeader>
              <PatientForm onComplete={() => void execute()} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <DataTable
            rows={(data || []).map((item) => ({ ...item, action: item }))}
            columns={[
              { key: "name", header: "Name" },
              { key: "email", header: "Email" },
              { key: "phone", header: "Phone" },
              { key: "address", header: "Address" },
              {
                key: "action",
                header: "Actions",
                render: (value) => (
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setSelectedPatient(value as Patient)}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Patient</DialogTitle>
                        </DialogHeader>
                        <PatientForm initial={selectedPatient || undefined} onComplete={() => void execute()} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setSelectedPatient(value as Patient);
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
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Delete this patient?" onConfirm={removePatient} />
    </div>
  );
}
