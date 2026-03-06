"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoctorForm } from "@/features/doctors/doctor-form";
import { useApi } from "@/hooks/use-api";
import { doctorsService } from "@/services/doctors.service";
import type { Doctor } from "@/types/doctor";

function formatDate(value?: string) {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export default function AdminDoctorsPage() {
  const storageKey = "admin-doctor-password-overrides";
  const [specialization, setSpecialization] = useState("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState<Doctor | null>(null);
  const [passwordOverrides, setPasswordOverrides] = useState<Record<string, string>>({});
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { data, execute } = useApi(doctorsService.list);

  useEffect(() => {
    void execute(specialization);
  }, [execute, specialization]);

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

  const specializations = useMemo(() => {
    const set = new Set((data || []).map((item) => item.specialization));
    return ["all", ...Array.from(set)];
  }, [data]);

  const removeDoctor = async () => {
    if (!selectedDoctor) return;
    await doctorsService.remove(selectedDoctor.id);
    toast.success("Doctor deleted");
    void execute(specialization);
  };

  const resetDoctorPassword = async () => {
    if (!passwordTarget) {
      return;
    }

    if (temporaryPassword.trim().length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setIsResettingPassword(true);
      await doctorsService.resetPassword(passwordTarget.id, temporaryPassword);
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
      <PageHeader title="Manage Doctors" description="Create, edit and remove doctor profiles" />
      <Card className="border-amber-200 bg-amber-50/80">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base">Doctor credentials</CardTitle>
          <CardDescription className="text-amber-900">
            User IDs, profile data, and current project passwords are visible here. Reset Password lets you type a new
            password and the admin table will remember it on this browser.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Doctors</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Doctor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Doctor</DialogTitle>
              </DialogHeader>
              <DoctorForm onComplete={() => void execute(specialization)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select defaultValue="all" onValueChange={setSpecialization}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Filter specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DataTable
            rows={rows}
            searchPlaceholder="Search doctors by id, name, email, phone or department"
            columns={[
              { key: "id", header: "User ID" },
              { key: "name", header: "Name" },
              { key: "email", header: "Email" },
              { key: "phone", header: "Phone" },
              { key: "specialization", header: "Specialization" },
              { key: "department", header: "Department" },
              {
                key: "experienceYears",
                header: "Experience",
                render: (value) => `${String(value)} years`,
              },
              {
                key: "bio",
                header: "Bio",
                render: (value) => (String(value || "").trim() ? String(value) : "-"),
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
                          onClick={() => setSelectedDoctor(value as Doctor)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Doctor</DialogTitle>
                        </DialogHeader>
                        <DoctorForm initial={selectedDoctor || undefined} onComplete={() => void execute(specialization)} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="whitespace-nowrap rounded-full px-4"
                      onClick={() => {
                        setPasswordTarget(value as Doctor);
                        setTemporaryPassword((value as Doctor).demoPassword || "");
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
                        setSelectedDoctor(value as Doctor);
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
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Delete this doctor?" onConfirm={removeDoctor} />
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset doctor password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
              <p className="font-medium">{passwordTarget?.name || "Selected doctor"}</p>
              <p className="text-muted-foreground">{passwordTarget?.email || "-"}</p>
              <p className="mt-1 text-xs text-muted-foreground">User ID: {passwordTarget?.id || "-"}</p>
              <p className="mt-2 text-sm font-semibold text-primary">
                Current password: {(passwordTarget && passwordOverrides[passwordTarget.id]) || passwordTarget?.demoPassword || "-"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-password-reset">New Password</Label>
              <Input
                id="doctor-password-reset"
                type="text"
                value={temporaryPassword}
                onChange={(event) => setTemporaryPassword(event.target.value)}
                placeholder="Enter new doctor password"
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
              <Button loading={isResettingPassword} onClick={() => void resetDoctorPassword()}>
                Save Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
