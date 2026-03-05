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

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://hospital-management-system.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(apiRateLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Hospital API is running",
  });
});

app.use("/api/v1", apiRoutes);

app.use(notFound);
app.use(errorHandler);