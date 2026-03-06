require("dotenv").config();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function buildDemoPassword(role, userId) {
  const suffix = userId.slice(-6).toUpperCase();
  return role === "DOCTOR" ? `Doc@${suffix}` : `Pat@${suffix}`;
}

async function syncPasswords() {
  const [doctors, patients] = await Promise.all([
    prisma.doctor.findMany({ select: { id: true, email: true, name: true } }),
    prisma.patient.findMany({ select: { id: true, email: true, name: true } }),
  ]);

  for (const doctor of doctors) {
    const password = buildDemoPassword("DOCTOR", doctor.id);
    await prisma.doctor.update({
      where: { id: doctor.id },
      data: { password: await bcrypt.hash(password, 10) },
    });
  }

  for (const patient of patients) {
    const password = buildDemoPassword("PATIENT", patient.id);
    await prisma.patient.update({
      where: { id: patient.id },
      data: { password: await bcrypt.hash(password, 10) },
    });
  }

  console.log(`Synced demo passwords for ${doctors.length} doctors and ${patients.length} patients.`);
  console.log("Password format:");
  console.log("Doctors: Doc@<last 6 chars of user id in uppercase>");
  console.log("Patients: Pat@<last 6 chars of user id in uppercase>");
}

syncPasswords()
  .catch((error) => {
    console.error("Failed to sync demo passwords:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
