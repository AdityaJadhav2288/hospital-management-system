import { Router } from "express";
import { Role } from "../constants/role";
import { PatientController } from "../controllers/patient.controller";
import { authorize } from "../middleware/authorize";
import { protect } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import {
  bookAppointmentSchema,
  createMedicalReportSchema,
  patientRegisterSchema,
  rescheduleAppointmentSchema,
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
router.patch("/appointments/:id/cancel", asyncHandler(PatientController.cancelAppointment));
router.patch(
  "/appointments/:id/reschedule",
  validateBody(rescheduleAppointmentSchema),
  asyncHandler(PatientController.rescheduleAppointment),
);
router.get("/prescriptions", asyncHandler(PatientController.getPrescriptions));
router.get("/vitals", asyncHandler(PatientController.getVitals));
router.get("/history", asyncHandler(PatientController.getHistory));
router.get("/reports", asyncHandler(PatientController.getReports));
router.post("/reports", validateBody(createMedicalReportSchema), asyncHandler(PatientController.createReport));
router.get("/reports/:id/download", asyncHandler(PatientController.downloadReport));

export default router;
