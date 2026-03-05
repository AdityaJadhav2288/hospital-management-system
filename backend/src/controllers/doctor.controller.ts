import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DoctorService } from "../services/doctor.service";

export class DoctorController {
  public static async getDashboard(req: Request, res: Response): Promise<void> {
    const metrics = await DoctorService.getDashboardMetrics(req.user!.userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Doctor dashboard fetched",
      data: metrics,
    });
  }

  public static async getOwnAppointments(req: Request, res: Response): Promise<void> {
    const appointments = await DoctorService.getOwnAppointments(req.user!.userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Appointments fetched",
      data: appointments,
    });
  }

  public static async updateAppointmentStatus(req: Request, res: Response): Promise<void> {
    const appointment = await DoctorService.updateAppointmentStatus(
      req.user!.userId,
      req.params.id,
      req.body.status,
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Appointment status updated",
      data: appointment,
    });
  }

  public static async getPatients(req: Request, res: Response): Promise<void> {
    const patients = await DoctorService.getPatientList(req.user!.userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Patient list fetched",
      data: patients,
    });
  }

  public static async getPatientHistory(req: Request, res: Response): Promise<void> {
    const history = await DoctorService.getPatientHistory(req.user!.userId, req.params.patientId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Patient history fetched",
      data: history,
    });
  }

  public static async createPrescription(req: Request, res: Response): Promise<void> {
    const prescription = await DoctorService.createPrescription(req.user!.userId, req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Prescription created",
      data: prescription,
    });
  }

  public static async getPrescriptions(req: Request, res: Response): Promise<void> {
    const prescriptions = await DoctorService.listPrescriptions(req.user!.userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Prescriptions fetched",
      data: prescriptions,
    });
  }

  public static async createVitals(req: Request, res: Response): Promise<void> {
    const vitals = await DoctorService.createVitals(req.user!.userId, req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Vitals recorded",
      data: vitals,
    });
  }
}
