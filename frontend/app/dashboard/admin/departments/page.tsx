"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { adminPortalService } from "@/services/admin-portal.service";

export default function AdminDepartmentsPage() {
  const { data, execute } = useApi(adminPortalService.getDepartments);

  useEffect(() => {
    void execute();
  }, [execute]);

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Departments" description="Configure department catalog and website cards" />
      <Card>
        <CardHeader><CardTitle>Add Department</CardTitle></CardHeader>
        <CardContent>
          <form
            className="grid gap-3 md:grid-cols-3"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              await adminPortalService.createDepartment({
                name: String(form.get("name") || ""),
                description: String(form.get("description") || ""),
                icon: String(form.get("icon") || ""),
              });
              toast.success("Department added");
              (event.target as HTMLFormElement).reset();
              void execute();
            }}
          >
            <Input name="name" placeholder="Department name" required />
            <Input name="description" placeholder="Description" required />
            <div className="flex gap-2">
              <Input name="icon" placeholder="Icon key" />
              <Button type="submit">Add</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Departments</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {(data || []).map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded border border-border p-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={async () => {
                  await adminPortalService.deleteDepartment(item.id);
                  toast.success("Department removed");
                  void execute();
                }}
              >
                Delete
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
