"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const prisma_1 = require("../config/prisma");
class UserModel {
    static findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    static findById(id) {
        return prisma_1.prisma.user.findUnique({ where: { id } });
    }
    static listByRole(role) {
        return prisma_1.prisma.user.findMany({
            where: role ? { role } : undefined,
            orderBy: { createdAt: "desc" },
        });
    }
}
exports.UserModel = UserModel;
