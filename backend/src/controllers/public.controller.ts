import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PublicService } from "../services/public.service";

export class PublicController {
  public static async getDoctors(req: Request, res: Response): Promise<void> {
    const specialty = req.query.specialty as string | undefined;
    const doctors = await PublicService.listDoctors(specialty);
    res.status(StatusCodes.OK).json({ success: true, message: "Public doctors fetched", data: doctors });
  }

  public static async getDepartments(_req: Request, res: Response): Promise<void> {
    const departments = await PublicService.listDepartments();
    res.status(StatusCodes.OK).json({ success: true, message: "Departments fetched", data: departments });
  }

  public static async getPackages(req: Request, res: Response): Promise<void> {
    const category = req.query.category as string | undefined;
    const packages = await PublicService.listHealthPackages(category);
    res.status(StatusCodes.OK).json({ success: true, message: "Health packages fetched", data: packages });
  }

  public static async getBloodStock(_req: Request, res: Response): Promise<void> {
    const stock = await PublicService.listBloodStock();
    res.status(StatusCodes.OK).json({ success: true, message: "Blood stock fetched", data: stock });
  }

  public static async getStats(_req: Request, res: Response): Promise<void> {
    const stats = await PublicService.getHospitalStats();
    res.status(StatusCodes.OK).json({ success: true, message: "Hospital stats fetched", data: stats });
  }
}
