"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicPackageQuerySchema = exports.publicDoctorQuerySchema = exports.updatePatientProfileSchema = exports.createVitalsSchema = exports.createPrescriptionSchema = exports.upsertBloodStockSchema = exports.updateHealthPackageSchema = exports.createHealthPackageSchema = exports.updateDepartmentSchema = exports.createDepartmentSchema = exports.listAppointmentsQuerySchema = exports.updateAppointmentStatusSchema = exports.bookAppointmentSchema = exports.updateUserByAdminSchema = exports.createUserByAdminSchema = exports.loginSchema = exports.registerSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const baseUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.nativeEnum(client_1.Role),
    specialty: zod_1.z.string().min(2).optional(),
    experienceYears: zod_1.z.coerce.number().int().min(0).max(60).optional(),
    departmentId: zod_1.z.string().optional(),
    bio: zod_1.z.string().max(2000).optional(),
    imageUrl: zod_1.z.string().url().optional(),
    phone: zod_1.z.string().min(7).optional(),
    address: zod_1.z.string().min(3).optional(),
    dateOfBirth: zod_1.z.coerce.date().optional(),
    gender: zod_1.z.string().optional(),
});
const roleProfileRefinement = (data, ctx) => {
    if (data.role === client_1.Role.DOCTOR) {
        if (!data.specialty) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ["specialty"], message: "specialty is required for DOCTOR" });
        }
        if (data.experienceYears === undefined) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ["experienceYears"],
                message: "experienceYears is required for DOCTOR",
            });
        }
    }
    if (data.role === client_1.Role.PATIENT) {
        if (!data.phone) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ["phone"], message: "phone is required for PATIENT" });
        }
        if (!data.address) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ["address"], message: "address is required for PATIENT" });
        }
    }
};
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.nativeEnum(client_1.Role),
    specialty: zod_1.z.string().min(2).optional(),
    experienceYears: zod_1.z.coerce.number().int().min(0).max(60).optional(),
    departmentId: zod_1.z.string().optional(),
    bio: zod_1.z.string().max(2000).optional(),
    imageUrl: zod_1.z.string().url().optional(),
    phone: zod_1.z.string().min(7).optional(),
    address: zod_1.z.string().min(3).optional(),
    dateOfBirth: zod_1.z.coerce.date().optional(),
    gender: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.createUserByAdminSchema = baseUserSchema.superRefine(roleProfileRefinement);
exports.updateUserByAdminSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
    specialty: zod_1.z.string().min(2).optional(),
    experienceYears: zod_1.z.coerce.number().int().min(0).max(60).optional(),
    departmentId: zod_1.z.string().optional(),
    bio: zod_1.z.string().max(2000).optional(),
    imageUrl: zod_1.z.string().url().optional(),
    phone: zod_1.z.string().min(7).optional(),
    address: zod_1.z.string().min(3).optional(),
    dateOfBirth: zod_1.z.coerce.date().optional(),
    gender: zod_1.z.string().optional(),
});
exports.bookAppointmentSchema = zod_1.z.object({
    doctorId: zod_1.z.string().min(1),
    date: zod_1.z.coerce.date().refine((value) => value.getTime() > Date.now(), {
        message: "Appointment date must be in the future",
    }),
    reason: zod_1.z.string().min(3).max(500).optional(),
});
exports.updateAppointmentStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([client_1.AppointmentStatus.CONFIRMED, client_1.AppointmentStatus.CANCELLED]),
});
exports.listAppointmentsQuerySchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.AppointmentStatus).optional(),
});
exports.createDepartmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().min(10),
    icon: zod_1.z.string().optional(),
});
exports.updateDepartmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    description: zod_1.z.string().min(10).optional(),
    icon: zod_1.z.string().optional(),
});
exports.createHealthPackageSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().min(10),
    price: zod_1.z.coerce.number().positive(),
    category: zod_1.z.string().min(2),
    features: zod_1.z.array(zod_1.z.string().min(1)).min(1),
});
exports.updateHealthPackageSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    description: zod_1.z.string().min(10).optional(),
    price: zod_1.z.coerce.number().positive().optional(),
    category: zod_1.z.string().min(2).optional(),
    features: zod_1.z.array(zod_1.z.string().min(1)).min(1).optional(),
});
exports.upsertBloodStockSchema = zod_1.z.object({
    bloodGroup: zod_1.z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
    units: zod_1.z.coerce.number().int().min(0),
});
exports.createPrescriptionSchema = zod_1.z.object({
    patientId: zod_1.z.string().min(1),
    appointmentId: zod_1.z.string().optional(),
    medication: zod_1.z.string().min(2),
    dosage: zod_1.z.string().min(1),
    instructions: zod_1.z.string().min(2),
});
exports.createVitalsSchema = zod_1.z.object({
    patientId: zod_1.z.string().min(1),
    heightCm: zod_1.z.coerce.number().positive().optional(),
    weightKg: zod_1.z.coerce.number().positive().optional(),
    bloodPressure: zod_1.z.string().optional(),
    pulseRate: zod_1.z.coerce.number().int().positive().optional(),
    notes: zod_1.z.string().max(2000).optional(),
});
exports.updatePatientProfileSchema = zod_1.z.object({
    phone: zod_1.z.string().min(7).optional(),
    address: zod_1.z.string().min(3).optional(),
    dateOfBirth: zod_1.z.coerce.date().optional(),
    gender: zod_1.z.string().optional(),
});
exports.publicDoctorQuerySchema = zod_1.z.object({
    specialty: zod_1.z.string().optional(),
});
exports.publicPackageQuerySchema = zod_1.z.object({
    category: zod_1.z.string().optional(),
});
