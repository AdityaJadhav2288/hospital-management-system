import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public/public-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/login-form";

interface RoleLoginPageProps {
  params: Promise<{ role: string }>;
  searchParams: Promise<{ redirect?: string }>;
}

const roleCopy = {
  admin: {
    title: "Admin Login",
    description: "Sign in with the fixed hospital admin account to manage doctors, patients, appointments, and analytics.",
  },
  doctor: {
    title: "Doctor Login",
    description: "Access your predefined doctor account to manage appointments, patient records, and prescriptions.",
  },
  patient: {
    title: "Patient Login",
    description: "Book appointments, review reports, and track your medical history.",
  },
} as const;

export default async function RoleLoginPage({ params, searchParams }: RoleLoginPageProps) {
  const { role } = await params;
  const { redirect } = await searchParams;

  if (role !== "admin" && role !== "doctor" && role !== "patient") {
    notFound();
  }

  return (
    <PublicShell>
      <div className="mx-auto grid min-h-[calc(100vh-128px)] max-w-5xl items-center gap-6 px-4 py-12 md:grid-cols-2">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">{roleCopy[role].title}</h1>
          <p className="text-sm text-muted-foreground">{roleCopy[role].description}</p>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Secure Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm initialRole={role} lockRole redirectTo={redirect ?? null} />
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}
