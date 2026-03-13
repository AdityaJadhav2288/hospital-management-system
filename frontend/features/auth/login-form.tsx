"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { zodResolverV4 } from "@/lib/zod-resolver";
import { loginSchema, type LoginSchema } from "@/lib/validators/auth";

const roleCards: Array<{ role: LoginSchema["role"]; label: string; helper: string }> = [
  { role: "patient", label: "Patient", helper: "Book appointments and monitor health analytics" },
  { role: "doctor", label: "Doctor", helper: "Manage appointments and prescriptions" },
  { role: "admin", label: "Admin", helper: "Manage staff and hospital operations" },
];

interface LoginFormProps {
  initialRole?: LoginSchema["role"];
  lockRole?: boolean;
  redirectTo?: string | null;
}

export function LoginForm({ initialRole = "patient", lockRole = false, redirectTo = null }: LoginFormProps) {
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
      await login(values, redirectTo);
      toast.success("Login successful");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to login");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" {...register("role")} />

      {lockRole ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm">
          <p className="font-semibold capitalize text-blue-700">{selectedRole} Portal Login</p>
          <p className="text-xs text-gray-600">You are signing into the {selectedRole} account panel.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="font-semibold text-gray-700">Login As</Label>

          <div className="grid gap-3 sm:grid-cols-3">
            {roleCards.map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() =>
                  setValue("role", item.role, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
                }
                className={cn(
                  "touch-manipulation rounded-lg border p-3 text-left transition-all",
                  selectedRole === item.role
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300",
                )}
              >
                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">{item.helper}</p>
              </button>
            ))}
          </div>

          {errors.role ? <p className="text-xs text-red-500">{errors.role.message}</p> : null}
        </div>
      )}

      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Email</Label>
        <Input placeholder="name@email.com" {...register("email")} />
        {errors.email ? <p className="text-xs text-red-500">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Password</Label>
        <Input type="password" {...register("password")} />
        {errors.password ? <p className="text-xs text-red-500">{errors.password.message}</p> : null}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting} loading={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        New patient account?{" "}
        <Link className="font-medium text-blue-600 hover:underline" href="/auth/register">
          Register
        </Link>
      </p>
    </form>
  );
}
