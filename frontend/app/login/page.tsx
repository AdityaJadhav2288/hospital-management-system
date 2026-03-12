import { redirect as navigateTo } from "next/navigation";
import { RoleLoginButtons } from "@/components/auth/role-login-buttons";
import { PublicShell } from "@/components/public/public-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/login-form";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;

  if (redirect?.startsWith("/patient/")) {
    navigateTo(`/patient/login?redirect=${encodeURIComponent(redirect)}`);
  }

  if (redirect?.startsWith("/doctor/")) {
    navigateTo(`/doctor/login?redirect=${encodeURIComponent(redirect)}`);
  }

  if (redirect?.startsWith("/admin/")) {
    navigateTo(`/admin/login?redirect=${encodeURIComponent(redirect)}`);
  }

  return (
    <PublicShell>
      <div className="mx-auto grid min-h-[calc(100vh-128px)] max-w-5xl items-center gap-6 px-4 py-12 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Choose Your Login Portal</h1>
          <p className="text-sm text-muted-foreground">
            Select the correct role and access your secure dashboard.
          </p>
          <RoleLoginButtons />
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Secure Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm redirectTo={redirect ?? null} />
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}
