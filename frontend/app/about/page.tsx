import { PublicShell } from "@/components/public/public-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12">
        <h1 className="text-3xl font-bold">About CityCare Hospital</h1>
        <Card>
          <CardHeader><CardTitle>Our Story</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">CityCare began as a 30-bed emergency center and evolved into a multidisciplinary tertiary care hospital serving urban and rural communities.</CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Mission</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Deliver safe, ethical, evidence-driven healthcare with dignified patient experience.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Vision</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Become the most trusted digital-first hospital network in India.</CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader><CardTitle>Infrastructure & Certifications</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Modular OTs, 24x7 emergency, MRI/CT diagnostics, NABH-ready quality frameworks and infection control protocols.</CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}
