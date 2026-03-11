import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/auth.service";
import { PatientService } from "../services/patient.service";

export class PatientController {
  public static async register(req: Request, res: Response): Promise<void> {
    const result = await AuthService.registerPatient(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Patient registered successfully",
      data: result,
    });
  }

  public static async login(req: Request, res: Response): Promise<void> {
    const result = await AuthService.loginPatient(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Patient login successful",
      data: result,
    });
  }

  public static async getDashboard(req: Request, res: Response): Promise<void> {
    const metrics = await PatientService.getDashboardMetrics(req.user!.id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Patient dashboard fetched",
      data: metrics,
    });
  }

  public static async getDoctors(_req: Request, res: Response): Promise<void> {
    const doctors = await PatientService.getDoctors();
    res.status(StatusCodes.OK).json({ success: true, message: "Doctors fetched", data: doctors });
  }

  public static async bookAppointment(req: Request, res: Response): Promise<void> {
    const appointment = await PatientService.bookAppointment(req.user!.id, req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Appointment booked",
      data: appointment,
    });
  }

  public static async getOwnAppointments(req: Request, res: Response): Promise<void> {
    const appointments = await PatientService.getOwnAppointments(req.user!.id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Appointments fetched",
      data: appointments,
    });
  }

  public static async cancelAppointment(req: Request, res: Response): Promise<void> {
    const appointment = await PatientService.cancelAppointment(req.user!.id, req.params.id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Appointment cancelled",
      data: appointment,
    });
  }

  public static async rescheduleAppointment(req: Request, res: Response): Promise<void> {
    const appointment = await PatientService.rescheduleAppointment(req.user!.id, req.params.id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Appointment rescheduled",
      data: appointment,
    });
  }

  public static async getProfile(req: Request, res: Response): Promise<void> {
    const profile = await PatientService.getOwnProfile(req.user!.id);
    res.status(StatusCodes.OK).json({ success: true, message: "Profile fetched", data: profile });
  }

  public static async updateProfile(req: Request, res: Response): Promise<void> {
    const profile = await PatientService.updateOwnProfile(req.user!.id, req.body);
    res.status(StatusCodes.OK).json({ success: true, message: "Profile updated", data: profile });
  }

  public static async getPrescriptions(req: Request, res: Response): Promise<void> {
    const prescriptions = await PatientService.listOwnPrescriptions(req.user!.id);
    res.status(StatusCodes.OK).json({ success: true, message: "Prescriptions fetched", data: prescriptions });
  }

  public static async getVitals(req: Request, res: Response): Promise<void> {
    const vitals = await PatientService.listOwnVitals(req.user!.id);
    res.status(StatusCodes.OK).json({ success: true, message: "Vitals fetched", data: vitals });
  }

  public static async getHistory(req: Request, res: Response): Promise<void> {
    const history = await PatientService.getOwnHistory(req.user!.id);
    res.status(StatusCodes.OK).json({ success: true, message: "History fetched", data: history });
  }

  public static async getReports(req: Request, res: Response): Promise<void> {
    const reports = await PatientService.listOwnReports(req.user!.id);
    res.status(StatusCodes.OK).json({ success: true, message: "Reports fetched", data: reports });
  }

  public static async createReport(req: Request, res: Response): Promise<void> {
    const report = await PatientService.createReport(req.user!.id, req.body);
    res.status(StatusCodes.CREATED).json({ success: true, message: "Report uploaded", data: report });
  }

  public static async downloadReport(req: Request, res: Response): Promise<void> {
    const report = await PatientService.getReportDownload(req.user!.id, req.params.id);
    res.status(StatusCodes.OK).json({ success: true, message: "Report fetched", data: report });
  }
}
