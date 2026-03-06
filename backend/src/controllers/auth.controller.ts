import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/auth.service";

export class AuthController {
  public static async me(req: Request, res: Response): Promise<void> {
    const user = await AuthService.me(req.user!.id, req.user!.role);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Current user fetched",
      data: user,
    });
  }

  public static async registerPatient(req: Request, res: Response): Promise<void> {
    const result = await AuthService.registerPatient(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Patient registered successfully",
      data: result,
    });
  }

  public static async login(req: Request, res: Response): Promise<void> {
    const result = await AuthService.login(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      user: result.user,
      token: result.token,
      data: result,
    });
  }

  public static async loginAdmin(req: Request, res: Response): Promise<void> {
    const result = await AuthService.loginAdmin(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Admin login successful",
      user: result.user,
      token: result.token,
      data: result,
    });
  }

  public static async loginDoctor(req: Request, res: Response): Promise<void> {
    const result = await AuthService.loginDoctor(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Doctor login successful",
      user: result.user,
      token: result.token,
      data: result,
    });
  }

  public static async loginPatient(req: Request, res: Response): Promise<void> {
    const result = await AuthService.loginPatient(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Patient login successful",
      user: result.user,
      token: result.token,
      data: result,
    });
  }
}
