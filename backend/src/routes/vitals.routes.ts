import { Router } from "express";
import { Role } from "../constants/role";
import { VitalsController } from "../controllers/vitals.controller";
import { authorize } from "../middleware/authorize";
import { protect } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { createVitalsSchema } from "../utils/validation";

const router = Router();

router.use(protect);

router.post("/add", authorize(Role.DOCTOR), validateBody(createVitalsSchema), asyncHandler(VitalsController.add));
router.get("/:patientId", asyncHandler(VitalsController.getByPatient));

export default router;
