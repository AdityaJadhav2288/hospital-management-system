import { Role } from "@prisma/client";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { DoctorController } from "../controllers/doctor.controller";
import { PatientController } from "../controllers/patient.controller";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { createPrescriptionSchema } from "../utils/validation";

const router = Router();

router.use(protect);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    if (req.user?.role === Role.DOCTOR) {
      await DoctorController.getPrescriptions(req, res);
      return;
    }

    if (req.user?.role === Role.PATIENT) {
      await PatientController.getPrescriptions(req, res);
      return;
    }

    res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Forbidden" });
  }),
);

router.post("/", authorize(Role.DOCTOR), validateBody(createPrescriptionSchema), asyncHandler(DoctorController.createPrescription));

export default router;
