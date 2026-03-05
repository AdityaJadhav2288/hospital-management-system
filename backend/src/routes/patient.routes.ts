import { Role } from "@prisma/client";
import { Router } from "express";
import { PatientController } from "../controllers/patient.controller";
import { authorize } from "../middleware/authorize";
import { protect } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { bookAppointmentSchema, updatePatientProfileSchema } from "../utils/validation";

const router = Router();

router.use(protect, authorize(Role.PATIENT));

router.get("/dashboard", asyncHandler(PatientController.getDashboard));
router.get("/profile", asyncHandler(PatientController.getProfile));
router.patch("/profile", validateBody(updatePatientProfileSchema), asyncHandler(PatientController.updateProfile));

router.get("/doctors", asyncHandler(PatientController.getDoctors));
router.get("/appointments", asyncHandler(PatientController.getOwnAppointments));
router.post("/appointments", validateBody(bookAppointmentSchema), asyncHandler(PatientController.bookAppointment));
router.get("/prescriptions", asyncHandler(PatientController.getPrescriptions));
router.get("/vitals", asyncHandler(PatientController.getVitals));

export default router;
