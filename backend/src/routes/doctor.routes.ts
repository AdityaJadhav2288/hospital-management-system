import { Router } from "express";
import { Role } from "../constants/role";
import { DoctorController } from "../controllers/doctor.controller";
import { AuthController } from "../controllers/auth.controller";
import { authorize } from "../middleware/authorize";
import { protect } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { createPrescriptionSchema, createVitalsSchema, scopedLoginSchema, updateAppointmentStatusSchema } from "../utils/validation";

const router = Router();

router.post("/login", validateBody(scopedLoginSchema), asyncHandler(AuthController.loginDoctor));

router.use(protect, authorize(Role.DOCTOR));

router.get("/dashboard", asyncHandler(DoctorController.getDashboard));
router.get("/appointments", asyncHandler(DoctorController.getOwnAppointments));
router.patch(
  "/appointments/:id/status",
  validateBody(updateAppointmentStatusSchema),
  asyncHandler(DoctorController.updateAppointmentStatus),
);
router.get("/patients", asyncHandler(DoctorController.getPatients));
router.get("/patients/:patientId/history", asyncHandler(DoctorController.getPatientHistory));
router.get("/prescriptions", asyncHandler(DoctorController.getPrescriptions));
router.post("/prescriptions", validateBody(createPrescriptionSchema), asyncHandler(DoctorController.createPrescription));
router.post("/vitals", validateBody(createVitalsSchema), asyncHandler(DoctorController.createVitals));

export default router;
