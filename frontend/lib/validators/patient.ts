import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(3),
  password: z.string().min(8).optional(),
});

export type PatientSchema = z.infer<typeof patientSchema>;
