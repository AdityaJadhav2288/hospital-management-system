"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    setValue,
  } = useForm<RegisterSchema>({
    resolver: zodResolverV4(registerSchema),
    defaultValues: { role: "PATIENT" },
  });

  const onSubmit = async (values: RegisterSchema) => {
    try {
      await registerUser(values);
      toast.success("Registration successful. Please login.");
    } catch (error) {
      toast.error(resolveApiError(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      {/* Name */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Full Name</Label>

        <Input {...register("name")} placeholder="Enter your full name" />

        {errors.name ? (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        ) : null}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Email</Label>

        <Input {...register("email")} placeholder="name@email.com" />

        {errors.email ? (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        ) : null}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Password</Label>

        <Input type="password" {...register("password")} placeholder="Create a secure password" />

        {errors.password ? (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        ) : null}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">Role</Label>

        <Select
          onValueChange={(value) =>
            setValue("role", value as RegisterSchema["role"], {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            })
          }
          defaultValue="PATIENT"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="DOCTOR">Doctor</SelectItem>
            <SelectItem value="PATIENT">Patient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Register"}
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link className="font-medium text-blue-600 hover:underline" href="/login/patient">
          Login
        </Link>
      </p>
    </form>
  );
}