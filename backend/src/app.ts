import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import { apiRateLimiter } from "./middleware/rate-limit";
import apiRoutes from "./routes";

export const app = express();

/* Security headers */
app.use(helmet());

/* CORS configuration (important for Vercel frontend) */
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

/* Body parser */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* Logger */
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

/* Rate limiter */
app.use(apiRateLimiter);

/* Health check route */
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Hospital API is running",
  });
});

/* API routes */
app.use("/api/v1", apiRoutes);
app.use("/api", apiRoutes);

/* 404 handler */
app.use(notFound);

/* Global error handler */
app.use(errorHandler);
