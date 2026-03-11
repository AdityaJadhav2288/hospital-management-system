import { AppointmentStatus } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Role } from "../constants/role";
import { AuthService } from "../services/auth.service";
import { AdminService } from "../services/admin.service";

export class AdminController {
  public static async login(req: Request, res: Response): Promise<void> {
    const result = await AuthService.loginAdmin(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Admin login successful",
      data: result,
    });
  }

  public static async getUsers(req: Request, res: Response): Promise<void> {
    const role = req.query.role as Role | undefined;
    const users = await AdminService.getUsers(role);
    res.status(StatusCodes.OK).json({ success: true, message: "Users fetched", data: users });
  }

  public static async getUserById(req: Request, res: Response): Promise<void> {
    const user = await AdminService.getUserById(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, message: "User fetched", data: user });
  }

  public static async createUser(req: Request, res: Response): Promise<void> {
    const user = await AdminService.createUser(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, message: "User created", data: user });
  }

  public static async updateUser(req: Request, res: Response): Promise<void> {
    const user = await AdminService.updateUser(req.params.id, req.body);
    res.status(StatusCodes.OK).json({ success: true, message: "User updated", data: user });
  }

  public static async resetUserPassword(req: Request, res: Response): Promise<void> {
    await AdminService.resetUserPassword(req.params.id, req.body);
    res.status(StatusCodes.OK).json({ success: true, message: "Temporary password updated" });
  }

  public static async deleteUser(req: Request, res: Response): Promise<void> {
    await AdminService.deleteUser(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, message: "User deleted" });
  }

  public static async getDoctors(_req: Request, res: Response): Promise<void> {
    const doctors = await AdminService.listDoctors();
    res.status(StatusCodes.OK).json({ success: true, message: "Doctors fetched", data: doctors });
  }

  public static async getPatients(_req: Request, res: Response): Promise<void> {
    const patients = await AdminService.listPatients();
    res.status(StatusCodes.OK).json({ success: true, message: "Patients fetched", data: patients });
  }

  public static async getAppointments(req: Request, res: Response): Promise<void> {
    const status = req.query.status as AppointmentStatus | undefined;
    const appointments = await AdminService.listAppointments(status);
    res.status(StatusCodes.OK).json({ success: true, message: "Appointments fetched", data: appointments });
  }

  public static async updateAppointmentStatus(req: Request, res: Response): Promise<void> {
    const appointment = await AdminService.updateAppointmentStatus(req.params.id, req.body.status);
    res.status(StatusCodes.OK).json({ success: true, message: "Appointment updated", data: appointment });
  }

  public static async getContactMessages(_req: Request, res: Response): Promise<void> {
    const messages = await AdminService.listContactMessages();
    res.status(StatusCodes.OK).json({ success: true, message: "Contact messages fetched", data: messages });
  }

  public static async getDashboard(_req: Request, res: Response): Promise<void> {
    const metrics = await AdminService.getDashboardMetrics();
    res.status(StatusCodes.OK).json({ success: true, message: "Dashboard fetched", data: metrics });
  }

  public static async getDepartments(_req: Request, res: Response): Promise<void> {
    const departments = await AdminService.listDepartments();
    res.status(StatusCodes.OK).json({ success: true, message: "Departments fetched", data: departments });
  }

  public static async createDepartment(req: Request, res: Response): Promise<void> {
    const department = await AdminService.createDepartment(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, message: "Department created", data: department });
  }

  public static async updateDepartment(req: Request, res: Response): Promise<void> {
    const department = await AdminService.updateDepartment(req.params.id, req.body);
    res.status(StatusCodes.OK).json({ success: true, message: "Department updated", data: department });
  }

  public static async deleteDepartment(req: Request, res: Response): Promise<void> {
    await AdminService.deleteDepartment(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, message: "Department deleted" });
  }

  public static async getHealthPackages(_req: Request, res: Response): Promise<void> {
    const packages = await AdminService.listHealthPackages();
    res.status(StatusCodes.OK).json({ success: true, message: "Health packages fetched", data: packages });
  }

  public static async createHealthPackage(req: Request, res: Response): Promise<void> {
    const item = await AdminService.createHealthPackage(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, message: "Health package created", data: item });
  }

  public static async updateHealthPackage(req: Request, res: Response): Promise<void> {
    const item = await AdminService.updateHealthPackage(req.params.id, req.body);
    res.status(StatusCodes.OK).json({ success: true, message: "Health package updated", data: item });
  }

  public static async deleteHealthPackage(req: Request, res: Response): Promise<void> {
    await AdminService.deleteHealthPackage(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, message: "Health package deleted" });
  }

  public static async getBloodStocks(_req: Request, res: Response): Promise<void> {
    const stocks = await AdminService.listBloodStocks();
    res.status(StatusCodes.OK).json({ success: true, message: "Blood stock fetched", data: stocks });
  }

  public static async upsertBloodStock(req: Request, res: Response): Promise<void> {
    const stock = await AdminService.upsertBloodStock(req.body);
    res.status(StatusCodes.OK).json({ success: true, message: "Blood stock updated", data: stock });
  }

  public static async deleteBloodStock(req: Request, res: Response): Promise<void> {
    await AdminService.deleteBloodStock(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, message: "Blood stock deleted" });
  }
}
