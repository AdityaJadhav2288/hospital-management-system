import { Router } from "express";
import { PublicController } from "../controllers/public.controller";
import { validateBody, validateQuery } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { createContactMessageSchema, publicDoctorQuerySchema, publicPackageQuerySchema } from "../utils/validation";

const router = Router();

router.get("/doctors", validateQuery(publicDoctorQuerySchema), asyncHandler(PublicController.getDoctors));
router.get("/departments", asyncHandler(PublicController.getDepartments));
router.get("/packages", validateQuery(publicPackageQuerySchema), asyncHandler(PublicController.getPackages));
router.get("/blood-stock", asyncHandler(PublicController.getBloodStock));
router.get("/stats", asyncHandler(PublicController.getStats));
router.post("/contact-messages", validateBody(createContactMessageSchema), asyncHandler(PublicController.createContactMessage));

export default router;
