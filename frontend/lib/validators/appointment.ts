import { z } from "zod";

export const appointmentSchema = z.object({
  patientId: z.string().optional(),
  doctorId: z.string().min(1),
  dateTime: z.string().min(1),
  reason: z.string().min(4),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;
