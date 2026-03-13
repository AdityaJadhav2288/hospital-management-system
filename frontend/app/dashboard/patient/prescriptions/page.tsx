"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Eye, Pill, Search, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { prescriptionsService } from "@/services/prescriptions.service";
import type { Prescription } from "@/types/prescription";

function createPrescriptionMarkup(prescription: Prescription) {
  const medicinesRows = prescription.medicines
    .map(
      (medicine) => `
        <tr>
          <td>${medicine.name}</td>
          <td>${medicine.dosage}</td>
          <td>${medicine.frequency}</td>
          <td>${medicine.duration}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <html>
      <head>
        <title>Prescription ${prescription.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; background: #f8fafc; }
          .sheet { max-width: 920px; margin: 0 auto; background: white; border: 1px solid #dbe4ee; border-radius: 24px; overflow: hidden; }
          .header { display: flex; justify-content: space-between; align-items: center; padding: 28px 32px; background: linear-gradient(135deg, #0f766e, #2563eb); color: white; }
          .logo { width: 56px; height: 56px; border-radius: 18px; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: bold; }
          .body { padding: 32px; }
          .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px; }
          .panel { border: 1px solid #e2e8f0; border-radius: 18px; padding: 16px; background: #f8fafc; }
          .label { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #64748b; margin-bottom: 8px; font-weight: 700; }
          .value { font-size: 15px; font-weight: 600; }
          .section-title { font-size: 18px; font-weight: 700; margin: 28px 0 12px; }
          table { width: 100%; border-collapse: collapse; overflow: hidden; border: 1px solid #e2e8f0; border-radius: 18px; }
          th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
          th { background: #eff6ff; color: #1e3a8a; font-weight: 700; }
          .diagnosis { border: 1px solid #dbeafe; background: #eff6ff; border-radius: 18px; padding: 16px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="header">
            <div>
              <div style="font-size: 24px; font-weight: 700;">${prescription.hospitalName}</div>
              <div style="font-size: 13px; opacity: 0.88;">Digital Prescription Sheet</div>
            </div>
            <div class="logo">M</div>
          </div>
          <div class="body">
            <div class="grid">
              <div class="panel">
                <div class="label">Doctor</div>
                <div class="value">Dr. ${prescription.doctorName}</div>
                <div style="margin-top: 8px; color: #475569;">${prescription.doctorSpecialization || "Consultant"}${prescription.doctorDepartment ? ` · ${prescription.doctorDepartment}` : ""}</div>
              </div>
              <div class="panel">
                <div class="label">Patient</div>
                <div class="value">${prescription.patientName}</div>
                <div style="margin-top: 8px; color: #475569;">Age: ${prescription.patientAge ?? "N/A"} · Date: ${new Date(prescription.issuedAt).toLocaleDateString()}</div>
              </div>
            </div>
            <div class="section-title">Diagnosis</div>
            <div class="diagnosis">${prescription.diagnosis}</div>
            <div class="section-title">Medicines</div>
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>${medicinesRows}</tbody>
            </table>
            <div class="section-title">Instructions</div>
            <div class="diagnosis">${prescription.instructions || "Follow clinician guidance."}</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function downloadPrescriptionPdf(prescription: Prescription) {
  const popup = window.open("", "_blank", "width=1100,height=900");
  if (!popup) {
    return;
  }

  popup.document.write(createPrescriptionMarkup(prescription));
  popup.document.close();
  popup.focus();
  popup.print();
}

function PrescriptionSheet({ prescription }: { prescription: Prescription }) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-border bg-card shadow-[0_18px_55px_-34px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-4 bg-[linear-gradient(135deg,#0f766e,#2563eb)] px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl font-semibold">
            M
          </div>
          <div>
            <p className="text-xl font-semibold">{prescription.hospitalName}</p>
            <p className="text-sm text-white/85">Professional digital prescription</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm">
          <p className="font-semibold">Issued</p>
          <p className="mt-1 text-white/85">{formatDateTime(prescription.issuedAt)}</p>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.4rem] border border-border bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Doctor</p>
            <p className="mt-3 text-lg font-semibold text-foreground">Dr. {prescription.doctorName}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {prescription.doctorSpecialization || "Consultant"}
              {prescription.doctorDepartment ? ` · ${prescription.doctorDepartment}` : ""}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-border bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Patient</p>
            <p className="mt-3 text-lg font-semibold text-foreground">{prescription.patientName}</p>
            <p className="mt-1 text-sm text-muted-foreground">Age: {prescription.patientAge ?? "N/A"}</p>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-sky-100 bg-sky-50/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Diagnosis</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{prescription.diagnosis}</p>
        </div>

        <div className="overflow-hidden rounded-[1.4rem] border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Medicine</th>
                <th className="px-4 py-3 font-semibold">Dosage</th>
                <th className="px-4 py-3 font-semibold">Frequency</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {prescription.medicines.map((medicine) => (
                <tr key={`${prescription.id}-${medicine.name}`} className="border-t border-border">
                  <td className="px-4 py-4 font-medium text-foreground">{medicine.name}</td>
                  <td className="px-4 py-4 text-muted-foreground">{medicine.dosage}</td>
                  <td className="px-4 py-4 text-muted-foreground">{medicine.frequency}</td>
                  <td className="px-4 py-4 text-muted-foreground">{medicine.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-[1.4rem] border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Instructions</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{prescription.instructions || "Follow clinician instructions."}</p>
        </div>
      </div>
    </div>
  );
}

export default function PatientPrescriptionsPage() {
  const { data, execute } = useApi(prescriptionsService.list);
  const [search, setSearch] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    void execute();
  }, [execute]);

  const prescriptions = useMemo(
    () =>
      (data || []).filter((item) => {
        const term = search.trim().toLowerCase();
        if (!term) {
          return true;
        }

        return [item.medication, item.doctorName, item.instructions, item.diagnosis, item.patientName]
          .join(" ")
          .toLowerCase()
          .includes(term);
      }),
    [data, search],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prescriptions"
        description="Review hospital-grade prescription sheets with medicines, diagnosis, and print-ready download actions"
      />

      <Card className="rounded-[1.8rem] border-border/80 bg-card/95 shadow-[0_18px_55px_-34px_rgba(15,23,42,0.28)]">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 rounded-xl pl-9"
              placeholder="Search by medicine, doctor, or diagnosis"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        {prescriptions.length ? (
          prescriptions.map((prescription) => (
            <Card
              key={prescription.id}
              className="overflow-hidden rounded-[1.8rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,0.95))] shadow-[0_18px_55px_-34px_rgba(15,23,42,0.28)]"
            >
              <CardContent className="p-0">
                <div className="flex items-center justify-between border-b border-border bg-[linear-gradient(135deg,rgba(15,118,110,0.08),rgba(37,99,235,0.08))] px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{prescription.medication}</p>
                      <p className="text-sm text-muted-foreground">
                        Dr. {prescription.doctorName}
                        {prescription.doctorSpecialization ? ` · ${prescription.doctorSpecialization}` : ""}
                      </p>
                    </div>
                  </div>
                  <Badge className="border border-border bg-card text-foreground">Active</Badge>
                </div>

                <div className="space-y-5 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.2rem] border border-border bg-muted/30 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Patient</p>
                      <p className="mt-2 text-sm font-semibold text-foreground">{prescription.patientName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Age: {prescription.patientAge ?? "N/A"}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-border bg-muted/30 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Issued</p>
                      <p className="mt-2 text-sm font-semibold text-foreground">{formatDateTime(prescription.issuedAt)}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{prescription.hospitalName}</p>
                    </div>
                  </div>

                  <div className="rounded-[1.2rem] border border-sky-100 bg-sky-50/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Diagnosis</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{prescription.diagnosis}</p>
                  </div>

                  <div className="overflow-hidden rounded-[1.2rem] border border-border">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-muted/60 text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Medicine</th>
                          <th className="px-4 py-3 font-semibold">Dosage</th>
                          <th className="px-4 py-3 font-semibold">Frequency</th>
                          <th className="px-4 py-3 font-semibold">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescription.medicines.map((medicine) => (
                          <tr key={`${prescription.id}-${medicine.name}`} className="border-t border-border">
                            <td className="px-4 py-4 font-medium text-foreground">{medicine.name}</td>
                            <td className="px-4 py-4 text-muted-foreground">{medicine.dosage}</td>
                            <td className="px-4 py-4 text-muted-foreground">{medicine.frequency}</td>
                            <td className="px-4 py-4 text-muted-foreground">{medicine.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-[1.2rem] border border-border bg-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Instructions</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{prescription.instructions || "Follow physician guidance."}</p>
                  </div>

                  <div className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={() => setSelectedPrescription(prescription)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Prescription
                    </Button>
                    <Button onClick={() => downloadPrescriptionPdf(prescription)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Prescription PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="rounded-[1.75rem] border-dashed border-border shadow-none xl:col-span-2">
            <CardContent className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Stethoscope className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">No prescriptions found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Prescriptions issued by your doctor will appear here in a print-ready hospital layout.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={Boolean(selectedPrescription)} onOpenChange={(open) => !open && setSelectedPrescription(null)}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto border-none bg-transparent p-0 shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Prescription preview</DialogTitle>
          </DialogHeader>
          {selectedPrescription ? <PrescriptionSheet prescription={selectedPrescription} /> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
