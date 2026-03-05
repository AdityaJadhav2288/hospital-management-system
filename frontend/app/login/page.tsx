import Link from "next/link";
import { PublicShell } from "@/components/public/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <PublicShell>
      <div className="mx-auto grid min-h-[calc(100vh-128px)] max-w-5xl items-center gap-6 px-4 py-12 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Choose Your Login Portal</h1>
          <p className="text-sm text-muted-foreground">
            Select the correct role and access your secure dashboard.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Link href="/login/admin"><Button className="w-full" variant="outline">Admin Login</Button></Link>
            <Link href="/login/doctor"><Button className="w-full" variant="outline">Doctor Login</Button></Link>
            <Link href="/login/patient"><Button className="w-full" variant="outline">Patient Login</Button></Link>
          </div>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Secure Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}
