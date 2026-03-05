import { Role } from "@prisma/client";
import { prisma } from "../config/prisma";

export class UserModel {
  public static findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  public static findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  public static listByRole(role?: Role) {
    return prisma.user.findMany({
      where: role ? { role } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }
}
