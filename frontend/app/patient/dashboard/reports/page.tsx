"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Download, FileUp, FileText, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { patientPortalService } from "@/services/patient-portal.service";
import type { MedicalReportCategory } from "@/types/report";

async function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function PatientReportsPage() {
  const { data: reports, execute: loadReports } = useApi(patientPortalService.getReports);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "LAB_REPORT" as MedicalReportCategory,
    notes: "",
  });

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Choose a report file first");
      return;
    }

    try {
      setUploading(true);
      const fileData = await toBase64(selectedFile);
      await patientPortalService.uploadReport({
        title: form.title || selectedFile.name,
        category: form.category,
        notes: form.notes || undefined,
        fileName: selectedFile.name,
        mimeType: selectedFile.type || "application/octet-stream",
        fileData,
      });
      toast.success("Report uploaded");
      setSelectedFile(null);
      setForm({ title: "", category: "LAB_REPORT", notes: "" });
      await loadReports();
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (reportId: string) => {
    const report = await patientPortalService.downloadReport(reportId);
    const binary = window.atob(report.fileData);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const blob = new Blob([bytes], { type: report.mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = report.fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Upload and download lab reports, X-ray, MRI, and blood-test records" />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Upload report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <UploadCloud className="mx-auto mb-3 text-slate-400" size={28} />
              <p className="font-medium text-slate-900">Add a new medical document</p>
              <p className="mt-1 text-sm text-slate-500">Supported for lab results, X-ray, MRI, and blood tests.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-title">Report Title</Label>
              <Input
                id="report-title"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="e.g. CBC Blood Test - March 2026"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(value) => setForm((current) => ({ ...current, category: value as MedicalReportCategory }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LAB_REPORT">Lab Report</SelectItem>
                  <SelectItem value="X_RAY">X-Ray</SelectItem>
                  <SelectItem value="MRI">MRI</SelectItem>
                  <SelectItem value="BLOOD_TEST">Blood Test</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-file">File</Label>
              <Input id="report-file" type="file" onChange={onFileChange} />
              <p className="text-xs text-slate-500">{selectedFile ? selectedFile.name : "No file selected"}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-notes">Notes</Label>
              <Textarea
                id="report-notes"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Optional summary, lab comments, or follow-up notes"
              />
            </div>

            <Button className="w-full" disabled={uploading} onClick={() => void handleUpload()}>
              {uploading ? <Loader2 className="mr-2 animate-spin" size={16} /> : <FileUp className="mr-2" size={16} />}
              Upload report
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Available reports</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {reports?.length ? (
              reports.map((report) => (
                <div key={report.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{report.title}</p>
                        <p className="text-sm text-slate-500">{report.fileName}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                          Uploaded {formatDateTime(report.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge className="border border-slate-200 bg-slate-50 text-slate-700">{report.category.replaceAll("_", " ")}</Badge>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">{report.notes || "No additional notes for this report."}</p>

                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" onClick={() => void handleDownload(report.id)}>
                      <Download className="mr-2" size={16} />
                      Download
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
                No reports uploaded yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
