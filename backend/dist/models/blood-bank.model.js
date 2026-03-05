"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodBankModel = void 0;
const prisma_1 = require("../config/prisma");
class BloodBankModel {
    static listAll() {
        return prisma_1.prisma.bloodStock.findMany({ orderBy: { bloodGroup: "asc" } });
    }
}
exports.BloodBankModel = BloodBankModel;
