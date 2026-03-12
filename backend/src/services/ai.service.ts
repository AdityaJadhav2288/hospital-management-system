import { GoogleGenerativeAI } from "@google/generative-ai";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";

const SYSTEM_PROMPT =
  "You are a hospital assistant. Help patients with doctor availability, symptoms, appointments, and hospital information. Do not give critical medical diagnosis.";

const client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const MODEL_CANDIDATES = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

export class AiService {
  public static async chat(message: string): Promise<string> {
    const prompt = `${SYSTEM_PROMPT}\n\nPatient message: ${message}`;
    let lastError: unknown = null;

    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = client.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const reply = result.response.text().trim();
        return reply || "I could not generate a response right now. Please try again.";
      } catch (error) {
        const status = typeof error === "object" && error && "status" in error ? (error as { status?: number }).status : undefined;
        const messageText = error instanceof Error ? error.message : String(error);
        lastError = error;

        if (status === StatusCodes.NOT_FOUND && modelName !== MODEL_CANDIDATES[MODEL_CANDIDATES.length - 1]) {
          continue;
        }

        if (messageText.toLowerCase().includes("api key not valid")) {
          throw new AppError(StatusCodes.BAD_GATEWAY, "Gemini API key is invalid. Update GEMINI_API_KEY in backend/.env.");
        }

        if (status === StatusCodes.TOO_MANY_REQUESTS || messageText.toLowerCase().includes("quota")) {
          throw new AppError(
            StatusCodes.TOO_MANY_REQUESTS,
            "Gemini quota exceeded. Check your Gemini API quota/billing and try again.",
          );
        }
      }
    }

    const details = lastError instanceof Error ? lastError.message : String(lastError);
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      "Gemini chat is temporarily unavailable for configured models.",
      details,
    );
  }
}
