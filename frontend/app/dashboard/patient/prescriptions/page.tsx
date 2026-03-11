"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Pill, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { prescriptionsService } from "@/services/prescriptions.service";
import type { Prescription } from "@/types/prescription";

function printPrescription(prescription: Prescription) {
  const popup = window.open("", "_blank", "width=900,height=700");
  if (!popup) return;

  popup.document.write(`
    <html>
      <head>
        <title>Prescription ${prescription.medication}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
          .card { border: 1px solid #cbd5e1; border-radius: 16px; padding: 24px; }
          h1 { margin: 0 0 8px; }
          p { line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="card">
          <p><strong>Doctor:</strong> Dr. ${prescription.doctorName}</p>
          <p><strong>Issued:</strong> ${new Date(prescription.issuedAt).toLocaleString()}</p>
          <h1>${prescription.medication}</h1>
          <p><strong>Dosage:</strong> ${prescription.dosage}</p>
          <p><strong>Instructions:</strong> ${prescription.instructions}</p>
        </div>
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
  popup.print();
}

export default function PatientPrescriptionsPage() {
  const { data, execute } = useApi(prescriptionsService.list);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void execute();
  }, [execute]);

  const prescriptions = useMemo(
    () =>
      (data || []).filter((item) => {
        const term = search.toLowerCase();
        if (!term) return true;
        return (
          item.medication.toLowerCase().includes(term) ||
          item.doctorName.toLowerCase().includes(term) ||
          item.instructions.toLowerCase().includes(term)
        );
      }),
    [data, search],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" description="Review medicines, dosage instructions, and save printable prescription sheets" />

      <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search medication or doctor" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {prescriptions.length ? (
          prescriptions.map((prescription) => (
            <Card key={prescription.id} className="rounded-[1.75rem] border-slate-200 shadow-sm">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                      <Pill size={18} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{prescription.medication}</CardTitle>
                      <p className="text-sm text-slate-500">Dr. {prescription.doctorName}</p>
                    </div>
                  </div>
                  <Badge className="border border-slate-200 bg-slate-50 text-slate-700">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-2">
                  <p><span className="font-medium text-slate-900">Dosage:</span> {prescription.dosage}</p>
                  <p><span className="font-medium text-slate-900">Issued:</span> {formatDateTime(prescription.issuedAt)}</p>
                  <p className="md:col-span-2"><span className="font-medium text-slate-900">Instructions:</span> {prescription.instructions}</p>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => printPrescription(prescription)}>
                    <Download className="mr-2" size={16} />
                    Save / Print PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="rounded-[1.75rem] border-dashed border-slate-300 shadow-none xl:col-span-2">
            <CardContent className="p-10 text-center text-sm text-slate-500">
              No prescriptions found.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
