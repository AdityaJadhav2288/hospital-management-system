"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const http_status_codes_1 = require("http-status-codes");
const ai_service_1 = require("../services/ai.service");
class AiController {
    static async chat(req, res) {
        const reply = await ai_service_1.AiService.chat(req.body.message);
        res.status(http_status_codes_1.StatusCodes.OK).json({ reply });
    }
}
exports.AiController = AiController;
