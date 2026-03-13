import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { VitalsService } from "../services/vitals.service";

export class VitalsController {
  public static async add(req: Request, res: Response): Promise<void> {
    const vitals = await VitalsService.recordVitals(req.user!.id, req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Patient vitals recorded",
      data: vitals,
    });
  }

  public static async getByPatient(req: Request, res: Response): Promise<void> {
    const vitals = await VitalsService.getVitalsForViewer(req.user!.id, req.user!.role, req.params.patientId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Patient vitals fetched",
      data: vitals,
    });
  }
}
