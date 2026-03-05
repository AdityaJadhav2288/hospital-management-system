"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { zodResolverV4 } from "@/lib/zod-resolver";
import { loginSchema, type LoginSchema } from "@/lib/validators/auth";

const roleCards: Array<{ role: LoginSchema["role"]; label: string; helper: string }> = [
  { role: "patient", label: "Patient", helper: "Book appointments and view reports" },
  { role: "doctor", label: "Doctor", helper: "Manage appointments and prescriptions" },
  { role: "admin", label: "Admin", helper: "Manage staff and hospital operations" },
];

interface LoginFormProps {
  initialRole?: LoginSchema["role"];
  lockRole?: boolean;
}

export function LoginForm({ initialRole = "patient", lockRole = false }: LoginFormProps) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<LoginSchema>({
    resolver: zodResolverV4(loginSchema),
    defaultValues: {
      role: initialRole,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (values: LoginSchema) => {
    try {
      await login(values);
      toast.success("Login successful");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("role")} />
      {lockRole ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
          <p className="font-semibold capitalize">{selectedRole} Portal Login</p>
          <p className="text-xs text-muted-foreground">You are signing into the {selectedRole} account panel.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Login As</Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {roleCards.map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => setValue("role", item.role, { shouldDirty: true, shouldTouch: true })}
                className={`rounded-lg border px-3 py-2 text-left transition ${
                  selectedRole === item.role
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.helper}</p>
              </button>
            ))}
          </div>
          {errors.role ? <p className="text-xs text-danger">{errors.role.message}</p> : null}
        </div>
      )}
      <div className="space-y-1">
        <Label>Email</Label>
        <Input placeholder="name@email.com" {...register("email")} />
        {errors.email ? <p className="text-xs text-danger">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-1">
        <Label>Password</Label>
        <Input type="password" {...register("password")} />
        {errors.password ? <p className="text-xs text-danger">{errors.password.message}</p> : null}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Login"}
      </Button>
      <p className="text-sm text-muted-foreground">
        New account? <Link className="text-primary underline" href="/auth/register">Register</Link>
      </p>
    </form>
  );
}
