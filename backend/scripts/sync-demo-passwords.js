require("dotenv").config();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function buildDemoPassword(role, userId) {
  const suffix = userId.slice(-6).toUpperCase();
  return role === "DOCTOR" ? `Doc@${suffix}` : `Pat@${suffix}`;
}

async function syncPasswords() {
  const doctors = await prisma.doctor.findMany({ select: { id: true, email: true, name: true } });

  for (const doctor of doctors) {
    const password = buildDemoPassword("DOCTOR", doctor.id);
    await prisma.doctor.update({
      where: { id: doctor.id },
      data: { password: await bcrypt.hash(password, 10) },
    });
  }

  console.log(`Synced demo passwords for ${doctors.length} doctors.`);
  console.log("Password format:");
  console.log("Doctors: Doc@<last 6 chars of user id in uppercase>");
  console.log("Patients are excluded so registration-chosen passwords are preserved.");
}

syncPasswords()
  .catch((error) => {
    console.error("Failed to sync demo passwords:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
