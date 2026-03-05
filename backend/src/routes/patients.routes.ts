import { Role } from "@prisma/client";
import { Router } from "express";
import { DoctorController } from "../controllers/doctor.controller";
import { PatientController } from "../controllers/patient.controller";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { updatePatientProfileSchema } from "../utils/validation";

const router = Router();

router.get("/me/profile", protect, authorize(Role.PATIENT), asyncHandler(PatientController.getProfile));
router.patch(
  "/me/profile",
  protect,
  authorize(Role.PATIENT),
  validateBody(updatePatientProfileSchema),
  asyncHandler(PatientController.updateProfile),
);
router.get("/me/vitals", protect, authorize(Role.PATIENT), asyncHandler(PatientController.getVitals));

router.get("/linked", protect, authorize(Role.DOCTOR), asyncHandler(DoctorController.getPatients));
router.get("/:patientId/history", protect, authorize(Role.DOCTOR), asyncHandler(DoctorController.getPatientHistory));

export default router;
