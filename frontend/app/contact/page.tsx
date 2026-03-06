"use client";

import { FormEvent, useState } from "react";
import { Ambulance, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { PublicShell } from "@/components/public/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contactMessagesService } from "@/services/contact-messages.service";
import { resolveApiError } from "@/services/api-client";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      setSubmitting(true);
      await contactMessagesService.submit({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        subject: String(formData.get("subject") || ""),
        message: String(formData.get("message") || ""),
      });
      setSubmitted(true);
      form.reset();
      toast.success("Your message has been sent to the hospital admin.");
    } catch (error) {
      toast.error(resolveApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicShell>
      <section className="bg-[linear-gradient(135deg,#e0f2fe,#ffffff_45%,#dcfce7)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-8 xl:grid-cols-[0.95fr,1.05fr]">
            <Card className="overflow-hidden border-0 shadow-xl shadow-slate-200/80">
              <CardHeader className="border-b border-slate-100 bg-slate-950 text-white">
                <CardTitle className="text-2xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-cyan-600" />
                    <span>MediCore Hospital, Baner Road, Pune, Maharashtra 411045</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-cyan-600" />
                    <span>Reception: +91 20 6767 9000</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Ambulance className="h-5 w-5 text-rose-500" />
                    <span>Emergency: +91 20 6767 9111</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-cyan-600" />
                    <span>care@medicorepune.com</span>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200">
                  <iframe
                    title="MediCore Hospital Pune Map"
                    src="https://maps.google.com/maps?q=Baner%20Road%20Pune%20Hospital&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    className="h-72 w-full"
                    loading="lazy"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl shadow-slate-200/80">
              <CardHeader className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Contact Us</p>
                <CardTitle className="text-3xl text-slate-950 sm:text-4xl">
                  Send a message to the MediCore Pune team
                </CardTitle>
                <p className="text-sm leading-6 text-slate-600">
                  Every enquiry submitted here is saved and visible in the admin dashboard so your team can respond
                  directly.
                </p>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" placeholder="+91 9876543210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" placeholder="Appointment, enquiry, support" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      placeholder="Tell us how we can help you."
                      className="min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                    />
                  </div>
                  <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                      {submitted ? "Message received. The admin can now view it in the dashboard." : "Usually replied within one business day."}
                    </p>
                    <Button
                      type="submit"
                      loading={submitting}
                      className="rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
                    >
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
