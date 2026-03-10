"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Eye,
  Download,
  Printer,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Pill,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { doctorPortalService } from "@/services/doctor-portal.service";
import { prescriptionsService } from "@/services/prescriptions.service";

interface MedicationItem {
  id: string;
  medication: string;
  strength: string;
  frequency: string;
  duration: string;
  quantity: number;
  refills: number;
  notes: string;
}

interface PrescriptionDraft {
  patientId: string;
  diagnosis: string;
  medications: MedicationItem[];
  notes: string;
  followUp: string;
}

const FREQUENCIES = [
  { value: "once_daily", label: "Once daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "three_times", label: "Three times daily" },
  { value: "four_times", label: "Four times daily" },
  { value: "every_6_hours", label: "Every 6 hours" },
  { value: "every_8_hours", label: "Every 8 hours" },
  { value: "every_12_hours", label: "Every 12 hours" },
  { value: "as_needed", label: "As needed" },
];

const DURATIONS = [
  { value: "3_days", label: "3 days" },
  { value: "7_days", label: "7 days" },
  { value: "14_days", label: "14 days" },
  { value: "30_days", label: "30 days" },
  { value: "60_days", label: "60 days" },
  { value: "90_days", label: "90 days" },
  { value: "ongoing", label: "Ongoing" },
];

export default function DoctorPrescriptionsPage() {
  const { data: patients, execute: loadPatients, loading: patientsLoading } = useApi(doctorPortalService.getPatients);
  const { data: prescriptions, execute: loadPrescriptions, loading: prescriptionsLoading } = useApi(prescriptionsService.list);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");
  const [showNewPrescription, setShowNewPrescription] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [draft, setDraft] = useState<PrescriptionDraft>({
    patientId: "",
    diagnosis: "",
    medications: [],
    notes: "",
    followUp: "",
  });

  useEffect(() => {
    void loadPatients();
    void loadPrescriptions();
  }, [loadPatients, loadPrescriptions]);

  const filteredPrescriptions = useMemo(() => {
    const items = prescriptions || [];
    return items.filter((p: any) => {
      const matchesSearch = !searchTerm || 
        p?.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p?.medication?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === "active") return matchesSearch && p?.status !== "completed";
      if (filterStatus === "completed") return matchesSearch && p?.status === "completed";
      return matchesSearch;
    });
  }, [prescriptions, searchTerm, filterStatus]);

  const selectedPatient = useMemo(
    () => (patients || []).find((p: any) => p?.id === draft.patientId),
    [patients, draft.patientId]
  );

  const handleAddMedication = () => {
    const newMed: MedicationItem = {
      id: Date.now().toString(),
      medication: "",
      strength: "",
      frequency: "once_daily",
      duration: "7_days",
      quantity: 1,
      refills: 0,
      notes: "",
    };
    setDraft({
      ...draft,
      medications: [...draft.medications, newMed],
    });
  };

  const handleUpdateMedication = (id: string, updates: Partial<MedicationItem>) => {
    setDraft({
      ...draft,
      medications: draft.medications.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    });
  };

  const handleRemoveMedication = (id: string) => {
    setDraft({
      ...draft,
      medications: draft.medications.filter((m) => m.id !== id),
    });
  };

  const handleSubmitPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!draft.patientId) {
      toast.error("Please select a patient");
      return;
    }
    
    if (draft.medications.length === 0) {
      toast.error("Please add at least one medication");
      return;
    }

    try {
      for (const med of draft.medications) {
        await doctorPortalService.createPrescription({
          patientId: draft.patientId,
          medication: med.medication,
          dosage: `${med.strength} - ${med.frequency}`,
          instructions: med.notes || `Take ${med.frequency} for ${med.duration}`,
        });
      }
      
      toast.success("Prescription created successfully");
      setDraft({
        patientId: "",
        diagnosis: "",
        medications: [],
        notes: "",
        followUp: "",
      });
      setShowNewPrescription(false);
      void loadPrescriptions();
    } catch (error) {
      toast.error("Failed to create prescription");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader title="Prescription Management" description="Create and manage patient prescriptions" />
        <Dialog open={showNewPrescription} onOpenChange={setShowNewPrescription}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus size={16} className="mr-2" />
              New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Prescription</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitPrescription} className="space-y-6">
              {/* Patient Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">Patient Information</h3>
                <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
                  <div>
                    <Label className="font-semibold text-gray-700">Select Patient</Label>
                    <select
                      className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                      value={draft.patientId}
                      onChange={(e) => setDraft({ ...draft, patientId: e.target.value })}
                      required
                    >
                      <option value="">Choose a patient...</option>
                      {(patients || []).filter(Boolean).map((patient: any) => (
                        <option key={patient?.id} value={patient?.id}>
                          {patient?.name} (ID: {patient?.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPatient && (
                    <div className="grid grid-cols-2 gap-3 rounded-lg bg-blue-50 p-3">
                      <div className="text-xs md:text-sm">
                        <p className="text-slate-600">Patient Name</p>
                        <p className="font-semibold text-slate-900">{selectedPatient?.name}</p>
                      </div>
                      <div className="text-xs md:text-sm">
                        <p className="text-slate-600">Email</p>
                        <p className="font-semibold text-slate-900 truncate">{selectedPatient?.email || "—"}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="font-semibold text-gray-700">Diagnosis</Label>
                    <Input
                      className="mt-2"
                      placeholder="Enter diagnosis or chief complaint"
                      value={draft.diagnosis}
                      onChange={(e) => setDraft({ ...draft, diagnosis: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Medications</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddMedication}
                  >
                    <Plus size={14} className="mr-2" />
                    Add Medication
                  </Button>
                </div>

                <div className="space-y-3">
                  {draft.medications.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
                      <Pill className="mx-auto mb-2 text-slate-400" size={24} />
                      <p className="text-sm text-slate-500">No medications added yet</p>
                    </div>
                  ) : (
                    draft.medications.map((med, idx) => (
                      <div
                        key={med.id}
                        className="rounded-lg border border-slate-200 bg-white p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-600">
                            Medication {idx + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMedication(med.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label className="text-xs font-semibold">Medication Name</Label>
                            <Input
                              className="mt-1.5"
                              placeholder="e.g., Paracetamol"
                              value={med.medication}
                              onChange={(e) =>
                                handleUpdateMedication(med.id, { medication: e.target.value })
                              }
                              required
                            />
                          </div>

                          <div>
                            <Label className="text-xs font-semibold">Strength/Dosage</Label>
                            <Input
                              className="mt-1.5"
                              placeholder="e.g., 500mg"
                              value={med.strength}
                              onChange={(e) =>
                                handleUpdateMedication(med.id, { strength: e.target.value })
                              }
                              required
                            />
                          </div>

                          <div>
                            <Label className="text-xs font-semibold">Frequency</Label>
                            <select
                              className="mt-1.5 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                              value={med.frequency}
                              onChange={(e) =>
                                handleUpdateMedication(med.id, { frequency: e.target.value })
                              }
                            >
                              {FREQUENCIES.map((f) => (
                                <option key={f.value} value={f.value}>
                                  {f.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <Label className="text-xs font-semibold">Duration</Label>
                            <select
                              className="mt-1.5 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                              value={med.duration}
                              onChange={(e) =>
                                handleUpdateMedication(med.id, { duration: e.target.value })
                              }
                            >
                              {DURATIONS.map((d) => (
                                <option key={d.value} value={d.value}>
                                  {d.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <Label className="text-xs font-semibold">Quantity</Label>
                            <Input
                              className="mt-1.5"
                              type="number"
                              min="1"
                              placeholder="30"
                              value={med.quantity}
                              onChange={(e) =>
                                handleUpdateMedication(med.id, { quantity: parseInt(e.target.value) || 1 })
                              }
                            />
                          </div>

                          <div>
                            <Label className="text-xs font-semibold">Refills</Label>
                            <Input
                              className="mt-1.5"
                              type="number"
                              min="0"
                              placeholder="0"
                              value={med.refills}
                              onChange={(e) =>
                                handleUpdateMedication(med.id, { refills: parseInt(e.target.value) || 0 })
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs font-semibold">Additional Notes</Label>
                          <Input
                            className="mt-1.5"
                            placeholder="e.g., Take with food, avoid dairy"
                            value={med.notes}
                            onChange={(e) =>
                              handleUpdateMedication(med.id, { notes: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">Additional Information</h3>
                <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
                  <div>
                    <Label className="font-semibold text-gray-700">Clinical Notes</Label>
                    <textarea
                      className="mt-2 h-24 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                      placeholder="Any additional clinical notes or warnings..."
                      value={draft.notes}
                      onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label className="font-semibold text-gray-700">Follow-up Instructions</Label>
                    <Input
                      placeholder="e.g., Return in 2 weeks, monitor for side effects"
                      value={draft.followUp}
                      onChange={(e) => setDraft({ ...draft, followUp: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewPrescription(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!draft.patientId || draft.medications.length === 0}>
                  <CheckCircle2 size={16} className="mr-2" />
                  Issue Prescription
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter */}
      <Card className="rounded-lg md:rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Search patient or medication..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Prescriptions</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </CardHeader>
      </Card>

      {/* Prescriptions List */}
      <Card className="rounded-lg md:rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">
            Prescription Records
            <Badge className="ml-2">
              {filteredPrescriptions.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          {prescriptionsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredPrescriptions.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
              <Pill className="mx-auto mb-4 text-slate-400" size={32} />
              <p className="text-slate-600 font-medium">No prescriptions found</p>
              <p className="text-sm text-slate-500 mt-1">Create a new prescription to get started</p>
            </div>
          ) : (
            <div className="grid gap-3 md:gap-4">
              {filteredPrescriptions.map((prescription: any) => (
                <div
                  key={prescription?.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User size={16} className="text-slate-400" />
                        <p className="font-semibold text-slate-900">
                          {prescription?.patientName || "Unknown Patient"}
                        </p>
                        <Badge
                          tone={prescription?.status === "active" ? "success" : "warning"}
                        >
                          {prescription?.status || "Pending"}
                        </Badge>
                      </div>
                      <div className="grid gap-2 text-xs md:text-sm text-slate-600 md:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <Pill size={14} />
                          <span className="truncate">{prescription?.medication}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle size={14} />
                          <span>{prescription?.dosage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>
                            {prescription?.issuedAt
                              ? new Date(prescription.issuedAt).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPrescription(prescription);
                          setShowPreview(true);
                        }}
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Printer size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prescription Preview Dialog */}
      {selectedPrescription && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prescription Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-4 bg-white">
              {/* Prescription Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <p className="text-sm font-semibold text-slate-600">Rx</p>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-600">Patient Name</p>
                  <p className="font-semibold">{selectedPrescription?.patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Date</p>
                  <p className="font-semibold">
                    {new Date(selectedPrescription?.issuedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Medication Details */}
              <div className="space-y-3 border-y border-slate-200 py-4">
                <p className="text-xs font-semibold text-slate-600">MEDICATION</p>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{selectedPrescription?.medication}</p>
                  <p className="text-sm text-slate-600 mt-1">{selectedPrescription?.dosage}</p>
                  <p className="text-sm text-slate-600 mt-2">{selectedPrescription?.instructions}</p>
                </div>
              </div>

              {/* Doctor Signature Area */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600">AUTHORIZED BY</p>
                <div className="h-20 border-b border-slate-900 mb-2" />
                <p className="text-xs text-slate-600">Doctor&apos;s Signature</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer size={16} className="mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
