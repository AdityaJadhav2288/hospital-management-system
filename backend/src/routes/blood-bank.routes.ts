import { Router } from "express";
import { Role } from "../constants/role";
import { AdminController } from "../controllers/admin.controller";
import { PublicController } from "../controllers/public.controller";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { upsertBloodStockSchema } from "../utils/validation";

const router = Router();

router.get("/", asyncHandler(PublicController.getBloodStock));
router.post("/", protect, authorize(Role.ADMIN), validateBody(upsertBloodStockSchema), asyncHandler(AdminController.upsertBloodStock));
router.delete("/:id", protect, authorize(Role.ADMIN), asyncHandler(AdminController.deleteBloodStock));

export default router;
