"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDemoPassword = buildDemoPassword;
const role_1 = require("../constants/role");
function buildDemoPassword(role, userId) {
    const suffix = userId.slice(-6).toUpperCase();
    return role === role_1.Role.DOCTOR ? `Doc@${suffix}` : `Pat@${suffix}`;
}
