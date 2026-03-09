"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/tables/data-table";
import { useApi } from "@/hooks/use-api";
import { doctorPortalService } from "@/services/doctor-portal.service";
import { prescriptionsService } from "@/services/prescriptions.service";

export default function DoctorPrescriptionsPage() {
  const { data: patients, execute: loadPatients } = useApi(doctorPortalService.getPatients);
  const { data: prescriptions, execute: loadPrescriptions } = useApi(prescriptionsService.list);
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  useEffect(() => {
    void loadPatients();
    void loadPrescriptions();
  }, [loadPatients, loadPrescriptions]);

  return (
    <div className="space-y-6">
      <PageHeader title="Prescription Management" description="Create prescriptions and review issued records" />
      <Card>
        <CardHeader><CardTitle>Write Prescription</CardTitle></CardHeader>
        <CardContent>
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              await doctorPortalService.createPrescription({
                patientId: selectedPatient,
                medication: String(form.get("medication") || ""),
                dosage: String(form.get("dosage") || ""),
                instructions: String(form.get("instructions") || ""),
              });
              toast.success("Prescription created");
              (event.target as HTMLFormElement).reset();
              void loadPrescriptions();
            }}
          >
            <div className="space-y-1">
              <Label>Patient</Label>
              <select
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                value={selectedPatient}
                onChange={(event) => setSelectedPatient(event.target.value)}
                required
              >
                <option value="">Select patient</option>
                {(patients || []).filter(Boolean).map((patient) => (
                  <option key={patient.id} value={patient.id}>{patient?.name || "Patient"}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Medication</Label>
              <Input name="medication" required />
            </div>
            <div className="space-y-1">
              <Label>Dosage</Label>
              <Input name="dosage" required />
            </div>
            <div className="space-y-1">
              <Label>Instructions</Label>
              <Input name="instructions" required />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Save Prescription</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Issued Prescriptions</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            rows={(prescriptions || []).filter(Boolean)}
            columns={[
              { key: "patientName", header: "Patient" },
              { key: "medication", header: "Medication" },
              { key: "dosage", header: "Dosage" },
              { key: "instructions", header: "Instructions" },
              { key: "issuedAt", header: "Issued" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
