import { PublicShell } from "@/components/public/public-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/register-form";

export default function AuthRegisterPage() {
  return (
    <PublicShell>
      <div className="mx-auto flex min-h-[calc(100vh-128px)] max-w-md items-center px-4 py-12">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}
