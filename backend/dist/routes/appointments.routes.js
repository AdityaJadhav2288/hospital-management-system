"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const admin_controller_1 = require("../controllers/admin.controller");
const doctor_controller_1 = require("../controllers/doctor.controller");
const patient_controller_1 = require("../controllers/patient.controller");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const validate_1 = require("../middleware/validate");
const async_handler_1 = require("../utils/async-handler");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.get("/", (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (req.user?.role === client_1.Role.ADMIN) {
        await admin_controller_1.AdminController.getAppointments(req, res);
        return;
    }
    if (req.user?.role === client_1.Role.DOCTOR) {
        await doctor_controller_1.DoctorController.getOwnAppointments(req, res);
        return;
    }
    if (req.user?.role === client_1.Role.PATIENT) {
        await patient_controller_1.PatientController.getOwnAppointments(req, res);
        return;
    }
    res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ success: false, message: "Forbidden" });
}));
router.post("/", (0, authorize_1.authorize)(client_1.Role.PATIENT), (0, validate_1.validateBody)(validation_1.bookAppointmentSchema), (0, async_handler_1.asyncHandler)(patient_controller_1.PatientController.bookAppointment));
router.patch("/:id/status", (0, authorize_1.authorize)(client_1.Role.DOCTOR), (0, validate_1.validateBody)(validation_1.updateAppointmentStatusSchema), (0, async_handler_1.asyncHandler)(doctor_controller_1.DoctorController.updateAppointmentStatus));
exports.default = router;
