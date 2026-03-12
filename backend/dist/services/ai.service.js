"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("../config/env");
const SYSTEM_PROMPT = "You are a hospital assistant. Help patients with doctor availability, symptoms, appointments, and hospital information. Do not give critical medical diagnosis.";
const client = new generative_ai_1.GoogleGenerativeAI(env_1.env.GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
class AiService {
    static async chat(message) {
        const prompt = `${SYSTEM_PROMPT}\n\nPatient message: ${message}`;
        const result = await model.generateContent(prompt);
        const reply = result.response.text().trim();
        return reply || "I could not generate a response right now. Please try again.";
    }
}
exports.AiService = AiService;
