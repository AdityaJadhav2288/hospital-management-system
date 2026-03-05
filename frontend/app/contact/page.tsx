"use client";

import { useState } from "react";
import { PublicShell } from "@/components/public/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Ambulance } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-12">
        {/* header intro */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Get in Touch</h1>
          <p className="mt-2 text-gray-600">
            We'd love to hear from you. Fill out the form or reach us via the
            information below.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* info card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 text-blue-600" />
                <span>123 Health Avenue, Bengaluru, India</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={18} className="text-blue-600" />
                <span>+91 1800-123-911 (Emergency)</span>
              </div>

              <div className="flex items-center gap-2">
                <Ambulance size={18} className="text-red-600" />
                <span>+91 1800-500-102 (Ambulance)</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={18} className="text-blue-600" />
                <span>care@citycare.health</span>
              </div>

              <div className="mt-6 overflow-hidden rounded-lg">
                <iframe
                  title="CityCare Hospital Map"
                  src="https://maps.google.com/maps?q=Bangalore&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="h-64 w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* form card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div>
                  <Label>Name</Label>
                  <Input placeholder="Your name" required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@example.com" required />
                </div>
                <div>
                  <Label>Message</Label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                    rows={4}
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
                {submitted ? (
                  <p className="text-sm text-success">
                    Your message has been submitted.
                  </p>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicShell>
  );
}
