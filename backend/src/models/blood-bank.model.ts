import { prisma } from "../config/prisma";

export class BloodBankModel {
  public static listAll() {
    return prisma.bloodStock.findMany({ orderBy: { bloodGroup: "asc" } });
  }
}
