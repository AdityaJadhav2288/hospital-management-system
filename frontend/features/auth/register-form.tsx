"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { zodResolverV4 } from "@/lib/zod-resolver";
import { registerSchema, type RegisterSchema } from "@/lib/validators/auth";
import { resolveApiError } from "@/services/api-client";

export function RegisterForm() {
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolverV4(registerSchema),
  });

  const onSubmit = async (values: RegisterSchema) => {
    try {
      const response = await registerUser(values);
      toast.success(`Registration successful. Login password: ${response.demoPassword || "Check admin panel"}`);
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Full Name</Label>
        <Input {...register("name")} placeholder="Enter your full name" />
        {errors.name ? <p className="text-xs text-red-500">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Email</Label>
        <Input {...register("email")} placeholder="name@email.com" />
        {errors.email ? <p className="text-xs text-red-500">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Phone</Label>
        <Input {...register("phone")} placeholder="+91 9876543210" />
        {errors.phone ? <p className="text-xs text-red-500">{errors.phone.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Address</Label>
        <Input {...register("address")} placeholder="City, street address" />
        {errors.address ? <p className="text-xs text-red-500">{errors.address.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Password</Label>
        <Input type="password" {...register("password")} placeholder="Create a secure password" />
        {errors.password ? <p className="text-xs text-red-500">{errors.password.message}</p> : null}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Doctor and admin accounts are managed internally. Patient accounts use system-generated demo passwords so the
        admin can review credentials in the dashboard.
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Register as Patient"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link className="font-medium text-blue-600 hover:underline" href="/login/patient">
          Login
        </Link>
      </p>
    </form>
  );
}
