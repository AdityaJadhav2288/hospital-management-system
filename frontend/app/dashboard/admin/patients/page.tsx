"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatientForm } from "@/features/patients/patient-form";
import { useApi } from "@/hooks/use-api";
import { patientsService } from "@/services/patients.service";
import type { Patient } from "@/types/patient";

function formatDate(value?: string) {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export default function AdminPatientsPage() {
  const storageKey = "admin-patient-password-overrides";
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState<Patient | null>(null);
  const [passwordOverrides, setPasswordOverrides] = useState<Record<string, string>>({});
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { data, execute } = useApi(patientsService.list);

  useEffect(() => {
    void execute();
  }, [execute]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Record<string, string>;
      setPasswordOverrides(parsed);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const removePatient = async () => {
    if (!selectedPatient) return;
    await patientsService.remove(selectedPatient.id);
    toast.success("Patient deleted");
    void execute();
  };

  const resetPatientPassword = async () => {
    if (!passwordTarget) {
      return;
    }

    if (temporaryPassword.trim().length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setIsResettingPassword(true);
      await patientsService.resetPassword(passwordTarget.id, temporaryPassword);
      const nextOverrides = {
        ...passwordOverrides,
        [passwordTarget.id]: temporaryPassword,
      };
      setPasswordOverrides(nextOverrides);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(nextOverrides));
      }
      toast.success(`Password updated for ${passwordTarget.name}`);
      setPasswordDialogOpen(false);
      setPasswordTarget(null);
      setTemporaryPassword("");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const rows = (data || []).map((item) => ({
    ...item,
    demoPassword: passwordOverrides[item.id] || item.demoPassword,
    action: item,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Patients" description="Create, edit, remove and review patient profiles" />
      <Card className="border-amber-200 bg-amber-50/80">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base">Patient credentials</CardTitle>
          <CardDescription className="text-amber-900">
            User IDs, profile data, and current project passwords are visible here. Reset Password lets you type a new
            password and the admin table will remember it on this browser.
          </CardDescription>
        </CardHeader>
      </Card>
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
            rows={rows}
            searchPlaceholder="Search patients by id, name, email, phone or address"
            columns={[
              { key: "id", header: "User ID" },
              { key: "name", header: "Name" },
              { key: "email", header: "Email" },
              { key: "phone", header: "Phone" },
              { key: "address", header: "Address" },
              {
                key: "gender",
                header: "Gender",
                render: (value) => (String(value || "").trim() ? String(value) : "-"),
              },
              {
                key: "dateOfBirth",
                header: "Date of Birth",
                render: (value) => formatDate(typeof value === "string" ? value : undefined),
              },
              {
                key: "createdAt",
                header: "Created",
                render: (value) => formatDate(typeof value === "string" ? value : undefined),
              },
              {
                key: "updatedAt",
                header: "Updated",
                render: (value) => formatDate(typeof value === "string" ? value : undefined),
              },
              { key: "demoPassword", header: "Password" },
              {
                key: "action",
                header: "Actions",
                render: (value) => (
                  <div className="flex flex-wrap gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="whitespace-nowrap rounded-full px-4"
                          onClick={() => setSelectedPatient(value as Patient)}
                        >
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
                      variant="secondary"
                      className="whitespace-nowrap rounded-full px-4"
                      onClick={() => {
                        setPasswordTarget(value as Patient);
                        setTemporaryPassword((value as Patient).demoPassword || "");
                        setPasswordDialogOpen(true);
                      }}
                    >
                      Reset Password
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="whitespace-nowrap rounded-full px-4"
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
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset patient password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
              <p className="font-medium">{passwordTarget?.name || "Selected patient"}</p>
              <p className="text-muted-foreground">{passwordTarget?.email || "-"}</p>
              <p className="mt-1 text-xs text-muted-foreground">User ID: {passwordTarget?.id || "-"}</p>
              <p className="mt-2 text-sm font-semibold text-primary">
                Current password: {(passwordTarget && passwordOverrides[passwordTarget.id]) || passwordTarget?.demoPassword || "-"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-password-reset">New Password</Label>
              <Input
                id="patient-password-reset"
                type="text"
                value={temporaryPassword}
                onChange={(event) => setTemporaryPassword(event.target.value)}
                placeholder="Enter new patient password"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setPasswordDialogOpen(false);
                  setPasswordTarget(null);
                  setTemporaryPassword("");
                }}
              >
                Cancel
              </Button>
              <Button loading={isResettingPassword} onClick={() => void resetPatientPassword()}>
                Save Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
