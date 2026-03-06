"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/utils";
import { contactMessagesService } from "@/services/contact-messages.service";

export default function AdminMessagesPage() {
  const { data, error, loading, execute } = useApi(contactMessagesService.list);

  useEffect(() => {
    void execute();
  }, [execute]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <PageHeader title="Contact Messages" description="Review enquiries submitted from the public contact page" />
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          ) : (
            <DataTable
              rows={data || []}
              searchPlaceholder="Search by name, email, phone, subject or message"
              columns={[
                { key: "name", header: "Name" },
                { key: "email", header: "Email" },
                {
                  key: "phone",
                  header: "Phone",
                  render: (value) => (String(value || "").trim() ? String(value) : "-"),
                },
                {
                  key: "subject",
                  header: "Subject",
                  render: (value) => (String(value || "").trim() ? String(value) : "-"),
                },
                { key: "message", header: "Message" },
                {
                  key: "createdAt",
                  header: "Received",
                  render: (value) => formatDateTime(String(value)),
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
