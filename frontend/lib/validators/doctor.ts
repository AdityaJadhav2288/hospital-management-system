import { z } from "zod";

export const doctorSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  specialization: z.string().min(2),
  experienceYears: z.coerce.number().min(0).max(60),
  password: z.string().min(8).optional(),
});

export type DoctorSchema = z.infer<typeof doctorSchema>;
