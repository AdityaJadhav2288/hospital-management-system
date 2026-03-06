import { Router } from "express";
import { Role } from "../constants/role";
import { AdminController } from "../controllers/admin.controller";
import { authorize } from "../middleware/authorize";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

router.get("/", protect, authorize(Role.ADMIN), asyncHandler(AdminController.getPatients));

export default router;
