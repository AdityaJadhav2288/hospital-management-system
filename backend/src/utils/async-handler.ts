import { NextFunction, Request, Response } from "express";

export const asyncHandler =
  <T extends Request>(fn: (req: T, res: Response, next: NextFunction) => Promise<void>) =>
  (req: T, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
