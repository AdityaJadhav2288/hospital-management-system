import { Role } from "@prisma/client";
import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authorize } from "../middleware/authorize";
import { protect } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import {
  createDepartmentSchema,
  createHealthPackageSchema,
  createUserByAdminSchema,
  listAppointmentsQuerySchema,
  updateDepartmentSchema,
  updateHealthPackageSchema,
  updateUserByAdminSchema,
  upsertBloodStockSchema,
} from "../utils/validation";

const router = Router();

router.use(protect, authorize(Role.ADMIN));

router.get("/users", asyncHandler(AdminController.getUsers));
router.get("/users/:id", asyncHandler(AdminController.getUserById));
router.post("/users", validateBody(createUserByAdminSchema), asyncHandler(AdminController.createUser));
router.patch("/users/:id", validateBody(updateUserByAdminSchema), asyncHandler(AdminController.updateUser));
router.delete("/users/:id", asyncHandler(AdminController.deleteUser));

router.get("/appointments", validateQuery(listAppointmentsQuerySchema), asyncHandler(AdminController.getAppointments));
router.get("/dashboard", asyncHandler(AdminController.getDashboard));

router.get("/departments", asyncHandler(AdminController.getDepartments));
router.post("/departments", validateBody(createDepartmentSchema), asyncHandler(AdminController.createDepartment));
router.patch("/departments/:id", validateBody(updateDepartmentSchema), asyncHandler(AdminController.updateDepartment));
router.delete("/departments/:id", asyncHandler(AdminController.deleteDepartment));

router.get("/packages", asyncHandler(AdminController.getHealthPackages));
router.post("/packages", validateBody(createHealthPackageSchema), asyncHandler(AdminController.createHealthPackage));
router.patch("/packages/:id", validateBody(updateHealthPackageSchema), asyncHandler(AdminController.updateHealthPackage));
router.delete("/packages/:id", asyncHandler(AdminController.deleteHealthPackage));

router.get("/blood-stock", asyncHandler(AdminController.getBloodStocks));
router.post("/blood-stock", validateBody(upsertBloodStockSchema), asyncHandler(AdminController.upsertBloodStock));
router.delete("/blood-stock/:id", asyncHandler(AdminController.deleteBloodStock));

export default router;
