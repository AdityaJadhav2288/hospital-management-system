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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label>Full Name</Label>
        <Input {...register("name")} />
        {errors.name ? <p className="text-xs text-danger">{errors.name.message}</p> : null}
      </div>
      <div className="space-y-1">
        <Label>Email</Label>
        <Input {...register("email")} />
        {errors.email ? <p className="text-xs text-danger">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-1">
        <Label>Password</Label>
        <Input type="password" {...register("password")} />
        {errors.password ? <p className="text-xs text-danger">{errors.password.message}</p> : null}
      </div>
      <div className="space-y-1">
        <Label>Role</Label>
        <Select
          onValueChange={(value) =>
            setValue("role", value as RegisterSchema["role"], { shouldDirty: true, shouldTouch: true, shouldValidate: true })
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Register"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Already have an account? <Link className="text-primary underline" href="/login/patient">Login</Link>
      </p>
    </form>
  );
}
