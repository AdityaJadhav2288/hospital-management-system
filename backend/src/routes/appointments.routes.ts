import { Role } from "@prisma/client";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AdminController } from "../controllers/admin.controller";
import { DoctorController } from "../controllers/doctor.controller";
import { PatientController } from "../controllers/patient.controller";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { bookAppointmentSchema, updateAppointmentStatusSchema } from "../utils/validation";

const router = Router();

router.use(protect);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    if (req.user?.role === Role.ADMIN) {
      await AdminController.getAppointments(req, res);
      return;
    }

    if (req.user?.role === Role.DOCTOR) {
      await DoctorController.getOwnAppointments(req, res);
      return;
    }

    if (req.user?.role === Role.PATIENT) {
      await PatientController.getOwnAppointments(req, res);
      return;
    }

    res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Forbidden" });
  }),
);

router.post("/", authorize(Role.PATIENT), validateBody(bookAppointmentSchema), asyncHandler(PatientController.bookAppointment));
router.patch(
  "/:id/status",
  authorize(Role.DOCTOR),
  validateBody(updateAppointmentStatusSchema),
  asyncHandler(DoctorController.updateAppointmentStatus),
);

export default router;
