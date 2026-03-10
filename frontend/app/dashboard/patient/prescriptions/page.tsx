"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Calendar,
  Pill,
  User,
  Beaker,
  AlertTriangle,
  Plus,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { prescriptionsService } from "@/services/prescriptions.service";

interface PrescriptionData {
  id: string;
  doctorName: string;
  medication: string;
  dosage: string;
  instructions: string;
  issuedAt: string;
  expiryDate?: string;
  status?: "active" | "expired" | "completed";
  refillsRemaining?: number;
  frequency?: string;
  sideEffects?: string[];
  warnings?: string[];
  pharmacy?: string;
}

export default function PatientPrescriptionsPage() {
  const { data, loading, error, execute } = useApi(prescriptionsService.list);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expired" | "completed">("all");
  const [sortBy, setSortBy] = useState<"date" | "medication">("date");
  const [viewPrescription, setViewPrescription] = useState<PrescriptionData | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    void execute();
  }, [execute]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const prescriptions = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const now = new Date();
    return data
      .filter((p) => p && typeof p === "object")
      .map((p) => {
        const issuedDate = new Date(p?.issuedAt || new Date());
        const expiryDate = new Date(issuedDate);
        expiryDate.setDate(expiryDate.getDate() + 365); // 1 year expiry
        
        const isExpired = now > expiryDate;
        
        return {
          id: p?.id || crypto.randomUUID(),
          doctorName: p?.doctorName || "Doctor",
          medication: p?.medication || "Medication",
          dosage: p?.dosage || "N/A",
          instructions: p?.instructions || "",
          issuedAt: p?.issuedAt || new Date().toISOString(),
          expiryDate: expiryDate.toISOString(),
          status: (isExpired ? "expired" : "active") as "active" | "expired" | "completed",
          refillsRemaining: 3,
          frequency: "Once daily",
          sideEffects: [],
          warnings: [],
          pharmacy: "Local Pharmacy",
        };
      });
  }, [data]);

  const stats = useMemo(() => {
    return {
      total: prescriptions.length,
      active: prescriptions.filter((p) => p.status === "active").length,
      expired: prescriptions.filter((p) => p.status === "expired").length,
      completed: prescriptions.filter((p) => p.status === "completed").length,
    };
  }, [prescriptions]);

  const filtered = useMemo(() => {
    let result = prescriptions;

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter((p) => p.status === filterStatus);
    }

    // Search filter
    if (search) {
      const term = search.toLowerCase();
      result = result.filter((p) =>
        (p.doctorName || "").toLowerCase().includes(term) ||
        (p.medication || "").toLowerCase().includes(term) ||
        (p.instructions || "").toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortBy === "medication") {
      result.sort((a, b) => a.medication.localeCompare(b.medication));
    } else {
      result.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
    }

    return result;
  }, [prescriptions, search, filterStatus, sortBy]);

  const handleDownload = (prescription: PrescriptionData) => {
    const content = `
PRESCRIPTION
============
Patient Prescription Record
Generated on: ${new Date().toLocaleDateString()}

MEDICATION: ${prescription.medication}
DOSAGE: ${prescription.dosage}
FREQUENCY: ${prescription.frequency}

INSTRUCTIONS:
${prescription.instructions}

PRESCRIBED BY: Dr. ${prescription.doctorName}
ISSUED: ${new Date(prescription.issuedAt).toLocaleDateString()}
EXPIRY: ${prescription.expiryDate ? new Date(prescription.expiryDate).toLocaleDateString() : 'N/A'}

Refills Remaining: ${prescription.refillsRemaining}
    `;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", `prescription-${prescription.medication}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Prescription downloaded");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge tone="success" className="flex items-center gap-1"><CheckCircle2 size={12} /> Active</Badge>;
      case "expired":
        return <Badge tone="danger" className="flex items-center gap-1"><AlertCircle size={12} /> Expired</Badge>;
      case "completed":
        return <Badge tone="default" className="flex items-center gap-1">Completed</Badge>;
      default:
        return <Badge tone="default">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="My Prescriptions"
          description="View, download, and manage your prescriptions"
        />
        <Button>
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard icon={Pill} label="Total" value={stats.total} color="blue" />
        <StatCard icon={CheckCircle2} label="Active" value={stats.active} color="green" />
        <StatCard icon={AlertCircle} label="Expired" value={stats.expired} color="red" />
        <StatCard icon={RefreshCw} label="Refillable" value={prescriptions.filter((p) => p.refillsRemaining > 0).length} color="purple" />
      </div>

      {/* Search & Filter */}
      <Card className="rounded-lg md:rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardHeader className="p-4 md:p-6">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <Input
                  className="pl-9"
                  placeholder="Search medication, doctor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="date">Latest</option>
                <option value="medication">Medication A-Z</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Prescriptions List */}
      <Card className="rounded-lg md:rounded-[1.75rem] border-slate-200 shadow-sm">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">
            Prescription Records
            <Badge tone="default" className="ml-2">
              {filtered.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
              <Pill className="mx-auto mb-4 text-slate-400" size={32} />
              <p className="text-slate-600 font-medium">No prescriptions found</p>
              <p className="text-sm text-slate-500 mt-1">You don&apos;t have any prescriptions matching your search</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {filtered.map((prescription) => (
                <div
                  key={prescription.id}
                  className="rounded-lg border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Main Row */}
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Pill size={18} className="text-blue-600" />
                        <h3 className="font-semibold text-slate-900 text-base md:text-lg">
                          {prescription.medication}
                        </h3>
                        {getStatusBadge(prescription.status)}
                      </div>
                      
                      <div className="grid gap-2 text-xs md:text-sm text-slate-600 md:grid-cols-3 mb-2">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>Dr. {prescription.doctorName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(prescription.issuedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle size={14} />
                          <span>{prescription.dosage}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 truncate">
                        {prescription.instructions}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {(prescription.refillsRemaining ?? 0) > 0 && (
                        <Badge tone="default" className="text-xs">
                          {prescription.refillsRemaining} refills
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedId(expandedId === prescription.id ? null : prescription.id)}
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            expandedId === prescription.id ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === prescription.id && (
                    <div className="border-t border-slate-200 p-4 md:p-5 bg-slate-50 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-1">DOSAGE</p>
                          <p className="text-sm text-slate-900 font-medium">{prescription.dosage}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-1">FREQUENCY</p>
                          <p className="text-sm text-slate-900 font-medium">{prescription.frequency}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-1">ISSUED DATE</p>
                          <p className="text-sm text-slate-900 font-medium">
                            {new Date(prescription.issuedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-1">EXPIRY DATE</p>
                          <p className="text-sm text-slate-900 font-medium">
                            {prescription.expiryDate ? new Date(prescription.expiryDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">INSTRUCTIONS</p>
                        <div className="bg-white rounded p-3 text-sm text-slate-700 border border-slate-200">
                          {prescription.instructions || "No specific instructions"}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">PREFERRED PHARMACY</p>
                        <p className="text-sm text-slate-900">{prescription.pharmacy}</p>
                      </div>

                      {(prescription.sideEffects ?? []).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                            <AlertTriangle size={14} className="text-amber-600" />
                            POSSIBLE SIDE EFFECTS
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(prescription.sideEffects ?? []).map((effect: string, i: number) => (
                              <Badge key={i} tone="warning">
                                {effect}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewPrescription(prescription)}
                        >
                          <Beaker size={14} className="mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(prescription)}
                        >
                          <Download size={14} className="mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.print()}
                        >
                          <Printer size={14} className="mr-2" />
                          Print
                        </Button>
                        {(prescription.refillsRemaining ?? 0) > 0 && (
                          <Button size="sm" className="ml-auto">
                            <Plus size={14} className="mr-2" />
                            Request Refill
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed View Dialog */}
      {viewPrescription && (
        <Dialog open={!!viewPrescription} onOpenChange={() => setViewPrescription(null)}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prescription Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 p-4 bg-white">
              {/* Prescription Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <p className="text-lg font-semibold text-slate-900">Rx</p>
              </div>

              {/* Doctor & Date Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600">PHYSICIAN</p>
                  <p className="text-sm font-semibold text-slate-900">Dr. {viewPrescription.doctorName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600">DATE ISSUED</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(viewPrescription.issuedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Medication Details */}
              <div className="border-y border-slate-200 py-4">
                <p className="text-xs font-semibold text-slate-600 mb-3">MEDICATION</p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <p className="text-lg font-semibold text-slate-900">{viewPrescription.medication}</p>
                  <p className="text-sm text-slate-600"><span className="font-semibold">Strength:</span> {viewPrescription.dosage}</p>
                  <p className="text-sm text-slate-600"><span className="font-semibold">Frequency:</span> {viewPrescription.frequency}</p>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Expiry:</span> {viewPrescription.expiryDate ? new Date(viewPrescription.expiryDate).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">INSTRUCTIONS</p>
                <p className="text-sm text-slate-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  {viewPrescription.instructions || "No specific instructions"}
                </p>
              </div>

              {/* Refills */}
              {(viewPrescription.refillsRemaining ?? 0) > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">REFILLS</p>
                  <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    {viewPrescription.refillsRemaining} refills remaining
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(viewPrescription)}
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer size={16} className="mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={() => setViewPrescription(null)}>
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

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: "blue" | "green" | "red" | "purple";
}) {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    red: "text-red-600",
    purple: "text-purple-600",
  };

  return (
    <Card className="rounded-lg border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col items-start gap-2 p-3 md:p-4">
        <Icon className={`${colorClasses[color]} size-5 md:size-6`} />
        <div className="w-full">
          <p className="text-xs md:text-sm text-slate-600 font-medium">{label}</p>
          <p className="text-xl md:text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}