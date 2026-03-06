import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { Role } from "../constants/role";
import { verifyToken } from "../utils/jwt";

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    const entity =
      decoded.role === Role.ADMIN
        ? await prisma.admin.findUnique({ where: { id: decoded.userId } })
        : decoded.role === Role.DOCTOR
          ? await prisma.doctor.findUnique({ where: { id: decoded.userId } })
          : await prisma.patient.findUnique({ where: { id: decoded.userId } });

    if (!entity) {
      res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid token user" });
      return;
    }

    req.user = {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      role: decoded.role,
    };

    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid or expired token" });
  }
};
