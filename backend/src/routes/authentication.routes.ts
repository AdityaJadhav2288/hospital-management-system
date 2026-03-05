import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { protect } from "../middleware/auth";
import { authRateLimiter } from "../middleware/rate-limit";
import { asyncHandler } from "../utils/async-handler";
import { validateBody } from "../middleware/validate";
import { loginSchema, registerSchema } from "../utils/validation";

const router = Router();

router.post("/register", authRateLimiter, validateBody(registerSchema), asyncHandler(AuthController.register));
router.post("/login", authRateLimiter, validateBody(loginSchema), asyncHandler(AuthController.login));
router.get("/me", protect, asyncHandler(AuthController.me));

export default router;
