"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedCorsOrigins = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.coerce.number().default(5000),
    DATABASE_URL: zod_1.z.string().url().refine((value) => value.startsWith("postgres://") || value.startsWith("postgresql://"), {
        message: "DATABASE_URL must be a PostgreSQL connection string",
    }),
    JWT_SECRET: zod_1.z.string().min(16),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    CORS_ORIGIN: zod_1.z.string().default("http://localhost:3000"),
    GEMINI_API_KEY: zod_1.z.string().min(1),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
exports.allowedCorsOrigins = exports.env.CORS_ORIGIN.split(",")
    .map((item) => item.trim())
    .filter(Boolean);
