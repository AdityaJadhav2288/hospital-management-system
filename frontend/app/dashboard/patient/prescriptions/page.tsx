"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { prescriptionsService } from "@/services/prescriptions.service";

export default function PatientPrescriptionsPage() {
  const { data, loading, error, execute } = useApi(prescriptionsService.list);
  const [search, setSearch] = useState("");
  const [viewPrescription, setViewPrescription] = useState<null | {
    id: string;
    doctorName: string;
    medication: string;
    dosage: string;
    instructions: string;
    issuedAt: string;
  }>(null);

  useEffect(() => {
    void execute();
  }, [execute]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const prescriptions = useMemo(() => data || [], [data]);

  const filtered = useMemo(() => {
    if (!search) return prescriptions;
    const term = search.toLowerCase();
    return prescriptions.filter((p) =>
      p.doctorName.toLowerCase().includes(term) ||
      p.medication.toLowerCase().includes(term) ||
      p.instructions.toLowerCase().includes(term),
    );
  }, [prescriptions, search]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Prescription List" description="View all doctor-issued prescriptions" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prescriptions…"
            className="pl-4"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(p.issuedAt)}
                  </p>
                  <h3 className="font-semibold">{p.medication}</h3>
                  <p className="text-sm">Dosage: {p.dosage}</p>
                  <p className="text-sm truncate" title={p.instructions}>
                    {p.instructions}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dr. {p.doctorName}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" onClick={() => setViewPrescription(p)}>
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground col-span-full">
              No prescriptions found.
            </p>
          )}
        </div>
      )}

      <Dialog open={!!viewPrescription} onOpenChange={() => setViewPrescription(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Prescription</DialogTitle>
          </DialogHeader>

          {viewPrescription && (
            <div className="prose print:prose"> {/* use prose for nicer print styling */}
              <p className="text-xs text-muted-foreground">
                Issued: {formatDateTime(viewPrescription.issuedAt)}
              </p>
              <h2>{viewPrescription.medication}</h2>
              <p>
                <strong>Dosage:</strong> {viewPrescription.dosage}
              </p>
              <p>
                <strong>Instructions:</strong> {viewPrescription.instructions}
              </p>
              <p className="mt-4 text-sm">
                <em>Prescribed by Dr. {viewPrescription.doctorName}</em>
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={handlePrint}>
              Print
            </Button>
            <Button size="sm" onClick={() => setViewPrescription(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
