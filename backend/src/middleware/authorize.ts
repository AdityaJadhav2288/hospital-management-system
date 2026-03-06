import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Role } from "../constants/role";

export const authorize = (...roles: Role[]) => (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  if (!roles.includes(req.user.role)) {
    res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Forbidden" });
    return;
  }

  next();
};
