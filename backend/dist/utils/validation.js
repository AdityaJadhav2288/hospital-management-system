"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiChatSchema = exports.createContactMessageSchema = exports.publicPackageQuerySchema = exports.publicDoctorQuerySchema = exports.updatePatientProfileSchema = exports.rescheduleAppointmentSchema = exports.createMedicalReportSchema = exports.createVisitNoteSchema = exports.createVitalsSchema = exports.createPrescriptionSchema = exports.upsertBloodStockSchema = exports.updateHealthPackageSchema = exports.createHealthPackageSchema = exports.updateDepartmentSchema = exports.createDepartmentSchema = exports.listAppointmentsQuerySchema = exports.updateAppointmentStatusSchema = exports.bookAppointmentSchema = exports.resetUserPasswordSchema = exports.updateUserByAdminSchema = exports.createUserByAdminSchema = exports.scopedLoginSchema = exports.loginSchema = exports.registerSchema = exports.patientRegisterSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const role_1 = require("../constants/role");
exports.patientRegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    phone: zod_1.z.string().min(7),
    address: zod_1.z.string().min(3).optional(),
    dateOfBirth: zod_1.z.coerce.date().optional(),
    gender: zod_1.z.string().optional(),
});
exports.registerSchema = exports.patientRegisterSchema;
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.nativeEnum(role_1.Role),
});
exports.scopedLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.createUserByAdminSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum([role_1.Role.DOCTOR, role_1.Role.PATIENT]),
    specialization: zod_1.z.string().min(2).optional(),
    experienceYears: zod_1.z.coerce.number().int().min(0).max(60).optional(),
    phone: zod_1.z.string().min(7),
    address: zod_1.z.string().min(3).optional(),
    department: zod_1.z.string().min(2).optional(),
    bio: zod_1.z.string().max(2000).optional(),
    profileImage: zod_1.z.string().url().optional(),
    dateOfBirth: zod_1.z.coerce.date().optional(),
    gender: zod_1.z.string().optional(),
})
    .superRefine((data, ctx) => {
    if (data.role === role_1.Role.DOCTOR) {
        if (!data.specialization) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ["specialization"],
                message: "specialization is required for DOCTOR",
            });
        }
        if (data.experienceYears === undefined) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ["experienceYears"],
                message: "experienceYears is required for DOCTOR",
            });
        }
        if (!data.department) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ["department"],
                message: "department is required for DOCTOR",
            });
        }
        if (!data.profileImage) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ["profileImage"],
                message: "profileImage is required for DOCTOR",
            });
        }
    }
    if (data.role === role_1.Role.PATIENT && !data.address) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["address"],
            message: "address is required for PATIENT",
        });
    }
});
exports.updateUserByAdminSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    specialization: zod_1.z.string().min(2).optional(),
    experienceYears: zod_1.z.coerce.number().int().min(0).max(60).optional(),
    phone: zod_1.z.string().min(7).optional(),
    address: zod_1.z.string().min(3).optional(),
    department: zod_1.z.string().min(2).optional(),
    bio: zod_1.z.string().max(2000).optional(),
    profileImage: zod_1.z.string().url().optional(),
    dateOfBirth: zod_1.z.coerce.date().optional(),
    gender: zod_1.z.string().optional(),
});
exports.resetUserPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(8),
});
exports.bookAppointmentSchema = zod_1.z.object({
    doctorId: zod_1.z.string().min(1),
    date: zod_1.z.coerce.date().refine((value) => value.getTime() > Date.now(), {
        message: "Appointment date must be in the future",
    }),
    reason: zod_1.z.string().min(3).max(500).optional(),
});
exports.updateAppointmentStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([client_1.AppointmentStatus.CONFIRMED, client_1.AppointmentStatus.COMPLETED, client_1.AppointmentStatus.CANCELLED]),
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
const temperatureSchema = zod_1.z.preprocess((value) => {
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
}, zod_1.z.number().positive().max(45).optional());
exports.createVitalsSchema = zod_1.z.object({
    patientId: zod_1.z.string().min(1),
    heightCm: zod_1.z.coerce.number().positive().optional(),
    weightKg: zod_1.z.coerce.number().positive().optional(),
    bloodPressure: zod_1.z.string().optional(),
    pulseRate: zod_1.z.coerce.number().int().positive().optional(),
    temperatureC: temperatureSchema,
    notes: zod_1.z.string().max(2000).optional(),
});
exports.createVisitNoteSchema = zod_1.z.object({
    patientId: zod_1.z.string().min(1),
    appointmentId: zod_1.z.string().optional(),
    diagnosis: zod_1.z.string().min(2).max(500),
    notes: zod_1.z.string().max(4000).optional(),
});
exports.createMedicalReportSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(160),
    category: zod_1.z.enum(["LAB_REPORT", "X_RAY", "MRI", "BLOOD_TEST", "OTHER"]),
    fileName: zod_1.z.string().min(1).max(255),
    mimeType: zod_1.z.string().min(3).max(120),
    fileData: zod_1.z.string().min(20),
    notes: zod_1.z.string().max(2000).optional(),
});
exports.rescheduleAppointmentSchema = zod_1.z.object({
    date: zod_1.z.coerce.date().refine((value) => value.getTime() > Date.now(), {
        message: "Appointment date must be in the future",
    }),
    reason: zod_1.z.string().min(3).max(500).optional(),
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
exports.createContactMessageSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(7).optional(),
    subject: zod_1.z.string().min(2).max(120).optional(),
    message: zod_1.z.string().min(10).max(2000),
});
exports.aiChatSchema = zod_1.z.object({
    message: zod_1.z.string().trim().min(1).max(2000),
});
