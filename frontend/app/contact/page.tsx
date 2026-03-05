"use client";

import { useState } from "react";
import { PublicShell } from "@/components/public/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <PublicShell>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Address: 123 Health Avenue, Bengaluru, India</p>
            <p>Emergency: +91 1800-123-911</p>
            <p>Ambulance: +91 1800-500-102</p>
            <p>Email: care@citycare.health</p>
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <iframe
                title="CityCare Hospital Map"
                src="https://maps.google.com/maps?q=Bangalore&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="h-64 w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Form</CardTitle></CardHeader>
          <CardContent>
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <div>
                <Label>Name</Label>
                <Input required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" required />
              </div>
              <div>
                <Label>Message</Label>
                <Input required />
              </div>
              <Button type="submit">Send Message</Button>
              {submitted ? <p className="text-sm text-success">Your message has been submitted.</p> : null}
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}
