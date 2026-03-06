require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const statements = [
  `
  CREATE TABLE IF NOT EXISTS "admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Hospital Administrator',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `CREATE UNIQUE INDEX IF NOT EXISTS "admins_email_key" ON "admins"("email")`,
  `
  CREATE TABLE IF NOT EXISTS "doctors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `CREATE UNIQUE INDEX IF NOT EXISTS "doctors_email_key" ON "doctors"("email")`,
  `CREATE INDEX IF NOT EXISTS "doctors_specialization_idx" ON "doctors"("specialization")`,
  `CREATE INDEX IF NOT EXISTS "doctors_department_idx" ON "doctors"("department")`,
  `
  CREATE TABLE IF NOT EXISTS "patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT 'Not provided',
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `CREATE UNIQUE INDEX IF NOT EXISTS "patients_email_key" ON "patients"("email")`,
  `ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  `
  INSERT INTO "admins" ("id", "name", "email", "password", "createdAt", "updatedAt")
  SELECT
    u."id",
    u."name",
    u."email",
    u."password",
    u."createdAt",
    CURRENT_TIMESTAMP
  FROM "users" u
  WHERE u."role" = 'ADMIN'
  ON CONFLICT ("id") DO UPDATE SET
    "name" = EXCLUDED."name",
    "email" = EXCLUDED."email",
    "password" = EXCLUDED."password"
  `,
  `
  INSERT INTO "doctors" (
    "id",
    "name",
    "specialization",
    "email",
    "password",
    "experience",
    "phone",
    "department",
    "profileImage",
    "bio",
    "createdAt",
    "updatedAt"
  )
  SELECT
    dp."id",
    u."name",
    dp."specialty",
    u."email",
    u."password",
    dp."experienceYears",
    'Not provided',
    COALESCE(d."name", dp."specialty", 'General'),
    COALESCE(
      dp."imageUrl",
      'https://ui-avatars.com/api/?background=0f766e&color=ffffff&name=' || REPLACE(u."name", ' ', '+')
    ),
    dp."bio",
    u."createdAt",
    CURRENT_TIMESTAMP
  FROM "doctor_profiles" dp
  INNER JOIN "users" u ON u."id" = dp."userId"
  LEFT JOIN "departments" d ON d."id" = dp."departmentId"
  WHERE u."role" = 'DOCTOR'
  ON CONFLICT ("id") DO UPDATE SET
    "name" = EXCLUDED."name",
    "specialization" = EXCLUDED."specialization",
    "email" = EXCLUDED."email",
    "password" = EXCLUDED."password",
    "experience" = EXCLUDED."experience",
    "department" = EXCLUDED."department",
    "profileImage" = EXCLUDED."profileImage",
    "bio" = EXCLUDED."bio"
  `,
  `
  INSERT INTO "patients" (
    "id",
    "name",
    "email",
    "password",
    "phone",
    "address",
    "dateOfBirth",
    "gender",
    "createdAt",
    "updatedAt"
  )
  SELECT
    pp."id",
    u."name",
    u."email",
    u."password",
    pp."phone",
    pp."address",
    pp."dateOfBirth",
    pp."gender",
    u."createdAt",
    CURRENT_TIMESTAMP
  FROM "patient_profiles" pp
  INNER JOIN "users" u ON u."id" = pp."userId"
  WHERE u."role" = 'PATIENT'
  ON CONFLICT ("id") DO UPDATE SET
    "name" = EXCLUDED."name",
    "email" = EXCLUDED."email",
    "password" = EXCLUDED."password",
    "phone" = EXCLUDED."phone",
    "address" = EXCLUDED."address",
    "dateOfBirth" = EXCLUDED."dateOfBirth",
    "gender" = EXCLUDED."gender"
  `,
  `ALTER TABLE "appointments" DROP CONSTRAINT IF EXISTS "appointments_doctorId_fkey"`,
  `ALTER TABLE "appointments" DROP CONSTRAINT IF EXISTS "appointments_patientId_fkey"`,
  `
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'appointments_doctorId_fkey'
    ) THEN
      ALTER TABLE "appointments"
      ADD CONSTRAINT "appointments_doctorId_fkey"
      FOREIGN KEY ("doctorId") REFERENCES "doctors"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
  END $$;
  `,
  `
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'appointments_patientId_fkey'
    ) THEN
      ALTER TABLE "appointments"
      ADD CONSTRAINT "appointments_patientId_fkey"
      FOREIGN KEY ("patientId") REFERENCES "patients"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
  END $$;
  `,
  `ALTER TABLE "prescriptions" DROP CONSTRAINT IF EXISTS "prescriptions_doctorId_fkey"`,
  `ALTER TABLE "prescriptions" DROP CONSTRAINT IF EXISTS "prescriptions_patientId_fkey"`,
  `
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'prescriptions_doctorId_fkey'
    ) THEN
      ALTER TABLE "prescriptions"
      ADD CONSTRAINT "prescriptions_doctorId_fkey"
      FOREIGN KEY ("doctorId") REFERENCES "doctors"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
  END $$;
  `,
  `
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'prescriptions_patientId_fkey'
    ) THEN
      ALTER TABLE "prescriptions"
      ADD CONSTRAINT "prescriptions_patientId_fkey"
      FOREIGN KEY ("patientId") REFERENCES "patients"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
  END $$;
  `,
  `ALTER TABLE "vitals" DROP CONSTRAINT IF EXISTS "vitals_patientId_fkey"`,
  `ALTER TABLE "vitals" DROP CONSTRAINT IF EXISTS "vitals_recordedByDoctorId_fkey"`,
  `
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'vitals_patientId_fkey'
    ) THEN
      ALTER TABLE "vitals"
      ADD CONSTRAINT "vitals_patientId_fkey"
      FOREIGN KEY ("patientId") REFERENCES "patients"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
  END $$;
  `,
  `
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'vitals_recordedByDoctorId_fkey'
    ) THEN
      ALTER TABLE "vitals"
      ADD CONSTRAINT "vitals_recordedByDoctorId_fkey"
      FOREIGN KEY ("recordedByDoctorId") REFERENCES "doctors"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
  END $$;
  `,
];

async function main() {
  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }

  const [admins, doctors, patients] = await Promise.all([
    prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS count FROM "admins"`),
    prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS count FROM "doctors"`),
    prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS count FROM "patients"`),
  ]);

  console.log("Legacy schema migration complete.");
  console.log({
    admins: admins[0].count,
    doctors: doctors[0].count,
    patients: patients[0].count,
  });
}

main()
  .catch((error) => {
    console.error("Legacy schema migration failed.");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
