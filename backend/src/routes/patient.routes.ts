import { Router } from "express";
import { Role } from "../constants/role";
import { PatientController } from "../controllers/patient.controller";
import { authorize } from "../middleware/authorize";
import { protect } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import {
  bookAppointmentSchema,
  patientRegisterSchema,
  scopedLoginSchema,
  updatePatientProfileSchema,
} from "../utils/validation";

const router = Router();

router.post("/register", validateBody(patientRegisterSchema), asyncHandler(PatientController.register));
router.post("/login", validateBody(scopedLoginSchema), asyncHandler(PatientController.login));

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
