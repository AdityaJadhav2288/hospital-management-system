"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    void execute();
  }, [execute]);

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your personal details" />
      <Card>
        <CardHeader><CardTitle>Profile Details</CardTitle></CardHeader>
        <CardContent>
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              await patientPortalService.updateProfile({
                phone: String(form.get("phone") || ""),
                address: String(form.get("address") || ""),
                gender: String(form.get("gender") || ""),
              });
              toast.success("Profile updated");
              void execute();
            }}
          >
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={data?.name || ""} readOnly />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={data?.email || ""} readOnly />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input name="phone" defaultValue={data?.phone || ""} />
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <Input name="address" defaultValue={data?.address || ""} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Gender</Label>
              <Input name="gender" defaultValue={data?.gender || ""} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
