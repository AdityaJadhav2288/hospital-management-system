import { AppointmentStatus } from "@prisma/client";
import { z } from "zod";
import { Role } from "../constants/role";

export const patientRegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(7),
  address: z.string().min(3).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
});

export const registerSchema = patientRegisterSchema;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role),
});

export const scopedLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const createUserByAdminSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum([Role.DOCTOR, Role.PATIENT]),
    specialization: z.string().min(2).optional(),
    experienceYears: z.coerce.number().int().min(0).max(60).optional(),
    phone: z.string().min(7),
    address: z.string().min(3).optional(),
    department: z.string().min(2).optional(),
    bio: z.string().max(2000).optional(),
    profileImage: z.string().url().optional(),
    dateOfBirth: z.coerce.date().optional(),
    gender: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === Role.DOCTOR) {
      if (!data.specialization) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["specialization"],
          message: "specialization is required for DOCTOR",
        });
      }
      if (data.experienceYears === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["experienceYears"],
          message: "experienceYears is required for DOCTOR",
        });
      }
      if (!data.department) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["department"],
          message: "department is required for DOCTOR",
        });
      }
      if (!data.profileImage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["profileImage"],
          message: "profileImage is required for DOCTOR",
        });
      }
    }

    if (data.role === Role.PATIENT && !data.address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "address is required for PATIENT",
      });
    }
  });

export const updateUserByAdminSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  specialization: z.string().min(2).optional(),
  experienceYears: z.coerce.number().int().min(0).max(60).optional(),
  phone: z.string().min(7).optional(),
  address: z.string().min(3).optional(),
  department: z.string().min(2).optional(),
  bio: z.string().max(2000).optional(),
  profileImage: z.string().url().optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
});

export const resetUserPasswordSchema = z.object({
  password: z.string().min(8),
});

export const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1),
  date: z.coerce.date().refine((value) => value.getTime() > Date.now(), {
    message: "Appointment date must be in the future",
  }),
  reason: z.string().min(3).max(500).optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum([AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED]),
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

const temperatureSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numericValue = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numericValue)) {
    return value;
  }

  if (numericValue > 45 && numericValue <= 115) {
    return Number((((numericValue - 32) * 5) / 9).toFixed(1));
  }

  return numericValue;
}, z.number().positive().max(45).optional());

export const createVitalsSchema = z.object({
  patientId: z.string().min(1),
  heightCm: z.coerce.number().positive().optional(),
  weightKg: z.coerce.number().positive().optional(),
  bloodPressure: z.string().optional(),
  pulseRate: z.coerce.number().int().positive().optional(),
  temperatureC: temperatureSchema,
  notes: z.string().max(2000).optional(),
});

export const createVisitNoteSchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().optional(),
  diagnosis: z.string().min(2).max(500),
  notes: z.string().max(4000).optional(),
});

export const createMedicalReportSchema = z.object({
  title: z.string().min(2).max(160),
  category: z.enum(["LAB_REPORT", "X_RAY", "MRI", "BLOOD_TEST", "OTHER"]),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(3).max(120),
  fileData: z.string().min(20),
  notes: z.string().max(2000).optional(),
});

export const rescheduleAppointmentSchema = z.object({
  date: z.coerce.date().refine((value) => value.getTime() > Date.now(), {
    message: "Appointment date must be in the future",
  }),
  reason: z.string().min(3).max(500).optional(),
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

export const createContactMessageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).optional(),
  subject: z.string().min(2).max(120).optional(),
  message: z.string().min(10).max(2000),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type PatientRegisterInput = z.infer<typeof patientRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ScopedLoginInput = z.infer<typeof scopedLoginSchema>;
export type CreateUserByAdminInput = z.infer<typeof createUserByAdminSchema>;
export type UpdateUserByAdminInput = z.infer<typeof updateUserByAdminSchema>;
export type ResetUserPasswordInput = z.infer<typeof resetUserPasswordSchema>;
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
export type CreateVisitNoteInput = z.infer<typeof createVisitNoteSchema>;
export type CreateMedicalReportInput = z.infer<typeof createMedicalReportSchema>;
export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>;
export type UpdatePatientProfileInput = z.infer<typeof updatePatientProfileSchema>;
export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
