import { Role } from "@prisma/client";
import { Router } from "express";
import { DoctorController } from "../controllers/doctor.controller";
import { PublicController } from "../controllers/public.controller";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validateQuery } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { publicDoctorQuerySchema } from "../utils/validation";

const router = Router();

router.get("/", validateQuery(publicDoctorQuerySchema), asyncHandler(PublicController.getDoctors));
router.get("/me/appointments", protect, authorize(Role.DOCTOR), asyncHandler(DoctorController.getOwnAppointments));

export default router;
