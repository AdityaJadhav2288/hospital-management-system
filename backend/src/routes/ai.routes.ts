import { Router } from "express";
import { AiController } from "../controllers/ai.controller";
import { validateBody } from "../middleware/validate";
import { aiChatSchema } from "../utils/validation";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

router.post("/chat", validateBody(aiChatSchema), asyncHandler(AiController.chat));

export default router;
