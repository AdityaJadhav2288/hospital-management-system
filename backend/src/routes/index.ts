import { Router } from "express";
import authRoutes from "./auth.routes";
import aiRoutes from "./ai.routes";
import adminRoutes from "./admin.routes";
import appointmentsRoutes from "./appointments.routes";
import authenticationRoutes from "./authentication.routes";
import bloodBankRoutes from "./blood-bank.routes";
import doctorRoutes from "./doctor.routes";
import doctorsRoutes from "./doctors.routes";
import patientRoutes from "./patient.routes";
import patientsRoutes from "./patients.routes";
import prescriptionsRoutes from "./prescriptions.routes";
import publicRoutes from "./public.routes";

const router = Router();

router.use("/public", publicRoutes);
router.use("/ai", aiRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/doctor", doctorRoutes);
router.use("/patient", patientRoutes);
router.use("/authentication", authenticationRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/patients", patientsRoutes);
router.use("/doctors", doctorsRoutes);
router.use("/prescriptions", prescriptionsRoutes);
router.use("/blood-bank", bloodBankRoutes);

export default router;
