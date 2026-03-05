import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { StatusCodes } from "http-status-codes";

export const validateBody = (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  req.body = result.data;
  next();
};

export const validateQuery = (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  req.query = result.data as Request["query"];
  next();
};
