import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AiService } from "../services/ai.service";
import type { AiChatInput } from "../utils/validation";

export class AiController {
  public static async chat(req: Request<unknown, unknown, AiChatInput>, res: Response): Promise<void> {
    const reply = await AiService.chat(req.body.message);
    res.status(StatusCodes.OK).json({ reply });
  }
}
