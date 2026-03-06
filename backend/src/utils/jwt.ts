import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "../constants/role";

interface JwtPayload {
  userId: string;
  role: Role;
}

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });

export const verifyToken = (token: string): JwtPayload => jwt.verify(token, env.JWT_SECRET) as JwtPayload;
