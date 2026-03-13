"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/tables/data-table";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { doctorPortalService } from "@/services/doctor-portal.service";

function toLocalDateTimeInputValue(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function numericOrUndefined(value: FormDataEntryValue | null) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return undefined;

  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export default function DoctorPatientsPage() {
  const { data, execute } = useApi(doctorPortalService.getPatients);
  const { data: history, execute: loadHistory } = useApi(doctorPortalService.getPatientHistory);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recordsOpen, setRecordsOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [recordedAt, setRecordedAt] = useState(() => toLocalDateTimeInputValue(new Date()));

  useEffect(() => {
    void execute();
  }, [execute]);

  return (
    <div className="space-y-6">
      <PageHeader title="Patient List" description="Patients linked with your appointments" />
      <Card>
        <CardHeader><CardTitle>Patients</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            rows={(data || []).filter(Boolean).map((item) => ({
              id: item.id,
              name: item?.name || "Patient",
              email: item?.email || "",
              phone: item?.phone || "",
              address: item?.address || "",
              action: item.id,
            }))}
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const patientId = String(value);
                        setSelectedPatientId(patientId);
                        await loadHistory(patientId);
                        setHistoryOpen(true);
                      }}
                    >
                      View History
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPatientId(String(value));
                        setRecordsOpen(true);
                      }}
                    >
                      Update Records
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Patient Medical History</DialogTitle>
          </DialogHeader>
          {history ? (
            <div className="space-y-4 text-sm">
              <div className="rounded-lg border border-border p-3">
                <p className="font-semibold">{history.patient.name}</p>
                <p className="text-muted-foreground">{history.patient.email}</p>
                <p className="text-muted-foreground">{history.patient.phone}</p>
              </div>
              <div>
                <p className="mb-2 font-semibold">Recent Vitals</p>
                <div className="space-y-2">
                  {history.vitals.slice(0, 5).map((row) => (
                    <div key={row.id} className="rounded border border-border px-3 py-2">
                      <p className="font-medium">{formatDateTime(row.recordedAt)}</p>
                      <p className="text-muted-foreground">
                        Sugar: {row.bloodSugar ?? "-"} | HR: {row.heartRate ?? "-"} | BP: {row.bloodPressure ?? "-"} |
                        SpO2: {row.spo2 ?? "-"}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold">Recent Prescriptions</p>
                <div className="space-y-2">
                  {history.prescriptions.slice(0, 5).map((row) => (
                    <div key={row.id} className="rounded border border-border px-3 py-2">
                      <p className="font-medium">
                        {row.medication} ({row.dosage})
                      </p>
                      <p className="text-muted-foreground">{row.instructions}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading history...</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={recordsOpen} onOpenChange={setRecordsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Patient Vitals</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              await doctorPortalService.createVitals({
                patientId: selectedPatientId,
                recordedAt,
                bloodSugar: numericOrUndefined(form.get("bloodSugar")),
                heartRate: numericOrUndefined(form.get("heartRate")),
                cholesterol: numericOrUndefined(form.get("cholesterol")),
                bpSystolic: numericOrUndefined(form.get("bpSystolic")),
                bpDiastolic: numericOrUndefined(form.get("bpDiastolic")),
                temperatureC: numericOrUndefined(form.get("temperatureC")),
                spo2: numericOrUndefined(form.get("spo2")),
                weightKg: numericOrUndefined(form.get("weightKg")),
                heightCm: numericOrUndefined(form.get("heightCm")),
                notes: String(form.get("notes") || ""),
              });
              toast.success("Patient vitals updated");
              setRecordsOpen(false);
              setRecordedAt(toLocalDateTimeInputValue(new Date()));
              if (selectedPatientId) {
                void loadHistory(selectedPatientId);
              }
            }}
          >
            <div className="space-y-1 md:col-span-2">
              <Label>Date</Label>
              <Input type="datetime-local" value={recordedAt} onChange={(event) => setRecordedAt(event.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Blood Sugar (mg/dL)</Label>
              <Input name="bloodSugar" type="number" min="1" />
            </div>
            <div className="space-y-1">
              <Label>Heart Rate (bpm)</Label>
              <Input name="heartRate" type="number" min="1" />
            </div>
            <div className="space-y-1">
              <Label>Cholesterol (mg/dL)</Label>
              <Input name="cholesterol" type="number" min="1" />
            </div>
            <div className="space-y-1">
              <Label>SpO2 (%)</Label>
              <Input name="spo2" type="number" min="1" max="100" />
            </div>
            <div className="space-y-1">
              <Label>BP Systolic</Label>
              <Input name="bpSystolic" type="number" min="1" />
            </div>
            <div className="space-y-1">
              <Label>BP Diastolic</Label>
              <Input name="bpDiastolic" type="number" min="1" />
            </div>
            <div className="space-y-1">
              <Label>Temperature (°C)</Label>
              <Input name="temperatureC" type="number" min="1" step="0.1" />
            </div>
            <div className="space-y-1">
              <Label>Height (cm)</Label>
              <Input name="heightCm" type="number" min="1" />
            </div>
            <div className="space-y-1">
              <Label>Weight (kg)</Label>
              <Input name="weightKg" type="number" min="1" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Clinical Notes</Label>
              <Input name="notes" />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full">
                Save Record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
