import { Router } from "express";
import { Role } from "../constants/role";
import { AdminController } from "../controllers/admin.controller";
import { DoctorController } from "../controllers/doctor.controller";
import { PublicController } from "../controllers/public.controller";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validateBody, validateQuery } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { publicDoctorQuerySchema, scopedLoginSchema, updateAppointmentStatusSchema } from "../utils/validation";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/login", validateBody(scopedLoginSchema), asyncHandler(AuthController.loginDoctor));
router.get("/", validateQuery(publicDoctorQuerySchema), asyncHandler(PublicController.getDoctors));
router.get("/admin", protect, authorize(Role.ADMIN), asyncHandler(AdminController.getDoctors));
router.get("/me/appointments", protect, authorize(Role.DOCTOR), asyncHandler(DoctorController.getOwnAppointments));
router.patch(
  "/appointments/:id/status",
  protect,
  authorize(Role.DOCTOR),
  validateBody(updateAppointmentStatusSchema),
  asyncHandler(DoctorController.updateAppointmentStatus),
);

export default router;
