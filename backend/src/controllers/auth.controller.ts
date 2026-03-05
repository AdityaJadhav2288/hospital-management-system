import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/auth.service";

export class AuthController {
  public static async me(req: Request, res: Response): Promise<void> {
    const user = await AuthService.me(req.user!.userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Current user fetched",
      data: user,
    });
  }

  public static async register(req: Request, res: Response): Promise<void> {
    const result = await AuthService.register(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  }

  public static async login(req: Request, res: Response): Promise<void> {
    const result = await AuthService.login(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }
}
