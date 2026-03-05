import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
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
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid token user" });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid or expired token" });
  }
};
