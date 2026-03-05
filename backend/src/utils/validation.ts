import { AppointmentStatus, Role } from "@prisma/client";
import { z } from "zod";

const baseUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role),
  specialty: z.string().min(2).optional(),
  experienceYears: z.coerce.number().int().min(0).max(60).optional(),
  departmentId: z.string().optional(),
  bio: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional(),
  phone: z.string().min(7).optional(),
  address: z.string().min(3).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
});

const roleProfileRefinement = (data: z.infer<typeof baseUserSchema>, ctx: z.RefinementCtx): void => {
  if (data.role === Role.DOCTOR) {
    if (!data.specialty) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["specialty"], message: "specialty is required for DOCTOR" });
    }
    if (data.experienceYears === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["experienceYears"],
        message: "experienceYears is required for DOCTOR",
      });
    }
  }

  if (data.role === Role.PATIENT) {
    if (!data.phone) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["phone"], message: "phone is required for PATIENT" });
    }
    if (!data.address) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["address"], message: "address is required for PATIENT" });
    }
  }
};

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role),
  specialty: z.string().min(2).optional(),
  experienceYears: z.coerce.number().int().min(0).max(60).optional(),
  departmentId: z.string().optional(),
  bio: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional(),
  phone: z.string().min(7).optional(),
  address: z.string().min(3).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const createUserByAdminSchema = baseUserSchema.superRefine(roleProfileRefinement);

export const updateUserByAdminSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(Role).optional(),
  specialty: z.string().min(2).optional(),
  experienceYears: z.coerce.number().int().min(0).max(60).optional(),
  departmentId: z.string().optional(),
  bio: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional(),
  phone: z.string().min(7).optional(),
  address: z.string().min(3).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
});

export const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1),
  date: z.coerce.date().refine((value) => value.getTime() > Date.now(), {
    message: "Appointment date must be in the future",
  }),
  reason: z.string().min(3).max(500).optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum([AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED]),
});

export const listAppointmentsQuerySchema = z.object({
  status: z.nativeEnum(AppointmentStatus).optional(),
});

export const createDepartmentSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  icon: z.string().optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  icon: z.string().optional(),
});

export const createHealthPackageSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  category: z.string().min(2),
  features: z.array(z.string().min(1)).min(1),
});

export const updateHealthPackageSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.coerce.number().positive().optional(),
  category: z.string().min(2).optional(),
  features: z.array(z.string().min(1)).min(1).optional(),
});

export const upsertBloodStockSchema = z.object({
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  units: z.coerce.number().int().min(0),
});

export const createPrescriptionSchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().optional(),
  medication: z.string().min(2),
  dosage: z.string().min(1),
  instructions: z.string().min(2),
});

export const createVitalsSchema = z.object({
  patientId: z.string().min(1),
  heightCm: z.coerce.number().positive().optional(),
  weightKg: z.coerce.number().positive().optional(),
  bloodPressure: z.string().optional(),
  pulseRate: z.coerce.number().int().positive().optional(),
  notes: z.string().max(2000).optional(),
});

export const updatePatientProfileSchema = z.object({
  phone: z.string().min(7).optional(),
  address: z.string().min(3).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
});

export const publicDoctorQuerySchema = z.object({
  specialty: z.string().optional(),
});

export const publicPackageQuerySchema = z.object({
  category: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserByAdminInput = z.infer<typeof createUserByAdminSchema>;
export type UpdateUserByAdminInput = z.infer<typeof updateUserByAdminSchema>;
export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
export type ListAppointmentsQueryInput = z.infer<typeof listAppointmentsQuerySchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type CreateHealthPackageInput = z.infer<typeof createHealthPackageSchema>;
export type UpdateHealthPackageInput = z.infer<typeof updateHealthPackageSchema>;
export type UpsertBloodStockInput = z.infer<typeof upsertBloodStockSchema>;
export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>;
export type CreateVitalsInput = z.infer<typeof createVitalsSchema>;
export type UpdatePatientProfileInput = z.infer<typeof updatePatientProfileSchema>;
