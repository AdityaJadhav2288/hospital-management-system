"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Mail, MapPin, Phone, Save, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { patientPortalService } from "@/services/patient-portal.service";

export default function PatientProfilePage() {
  const { data, execute } = useApi(patientPortalService.getProfile);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void execute();
  }, [execute]);

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage contact details, demographics, and patient account information" />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15">
                  <UserRound size={28} />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{data?.name || "Patient"}</p>
                  <p className="text-sm text-white/75">{data?.email || "patient@email.com"}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} />
                  {data?.email || "-"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} />
                  {data?.phone || "-"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin size={16} />
                  {data?.address || "-"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CalendarDays size={16} />
                  Member since {data?.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString("en-IN") : "DOB not added"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Edit profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                try {
                  setSaving(true);
                  await patientPortalService.updateProfile({
                    phone: String(form.get("phone") || ""),
                    address: String(form.get("address") || ""),
                    gender: String(form.get("gender") || ""),
                    dateOfBirth: String(form.get("dateOfBirth") || "") || undefined,
                  });
                  toast.success("Profile updated");
                  await execute();
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={data?.name || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={data?.email || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" defaultValue={data?.phone || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" name="gender" defaultValue={data?.gender || ""} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" defaultValue={data?.address || ""} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  defaultValue={data?.dateOfBirth ? new Date(data.dateOfBirth).toISOString().slice(0, 10) : ""}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={saving}>
                  <Save className="mr-2" size={16} />
                  Save changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
