"use client";

import { Activity, Ambulance, Brain, HeartPulse, Microscope, Stethoscope } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { ServiceCard } from "@/components/ServiceCard";

const services = [
  {
    name: "Cardiology",
    description: "Comprehensive cardiac diagnostics, interventions, and rehabilitation programs.",
    icon: HeartPulse,
  },
  {
    name: "Neurology",
    description: "Advanced neurological evaluation and treatment for stroke and neuro disorders.",
    icon: Brain,
  },
  {
    name: "Emergency Care",
    description: "24x7 rapid-response emergency, trauma support, and critical stabilization.",
    icon: Ambulance,
  },
  {
    name: "General Medicine",
    description: "Preventive and curative care for acute and chronic health conditions.",
    icon: Stethoscope,
  },
  {
    name: "Diagnostics",
    description: "High-accuracy pathology, imaging, and preventive screening services.",
    icon: Microscope,
  },
  {
    name: "ICU & Critical Care",
    description: "Continuous specialist monitoring for high-dependency and critical patients.",
    icon: Activity,
  },
];

export default function ServicesPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 max-w-2xl space-y-2">
          <h1 className="text-3xl font-bold">Hospital Services</h1>
          <p className="text-sm text-muted-foreground">
            CityCare provides multidisciplinary care with modern diagnostics and specialist-led treatment pathways.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.name} name={service.name} description={service.description} icon={service.icon} />
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
