"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApi } from "@/hooks/use-api";
import { adminPortalService } from "@/services/admin-portal.service";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export default function AdminBloodStockPage() {
  const { data, execute } = useApi(adminPortalService.getBloodStock);

  useEffect(() => {
    void execute();
  }, [execute]);

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Blood Inventory" description="Update blood units and keep public blood bank data current" />
      <Card>
        <CardHeader><CardTitle>Update Blood Units</CardTitle></CardHeader>
        <CardContent>
          <form
            className="grid gap-3 md:grid-cols-3"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              await adminPortalService.upsertBloodStock({
                bloodGroup: String(form.get("bloodGroup")) as (typeof bloodGroups)[number],
                units: Number(form.get("units") || 0),
              });
              toast.success("Blood stock updated");
              (event.target as HTMLFormElement).reset();
              void execute();
            }}
          >
            <Select name="bloodGroup" defaultValue="A+">
              <SelectTrigger>
                <SelectValue placeholder="Blood group" />
              </SelectTrigger>
              <SelectContent>
                {bloodGroups.map((group) => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input name="units" type="number" min={0} placeholder="Units" required />
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Current Stock</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {(data || []).map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded border border-border p-3">
              <div>
                <p className="font-medium">{item.bloodGroup}</p>
                <p className="text-sm text-muted-foreground">{item.units} units</p>
              </div>
              <Button
                size="sm"
                variant="danger"
                onClick={async () => {
                  await adminPortalService.deleteBloodStock(item.id);
                  toast.success("Row removed");
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
