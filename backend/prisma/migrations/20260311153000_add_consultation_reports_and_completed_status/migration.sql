ALTER TYPE "AppointmentStatus" ADD VALUE 'COMPLETED';

ALTER TABLE "vitals"
ADD COLUMN "temperature_c" DOUBLE PRECISION;

CREATE TABLE "visit_notes" (
  "id" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "doctorId" TEXT NOT NULL,
  "appointmentId" TEXT,
  "diagnosis" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "visit_notes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "medical_reports" (
  "id" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "uploadedByDoctorId" TEXT,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileData" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "medical_reports_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "visit_notes_patientId_createdAt_idx" ON "visit_notes"("patientId", "createdAt");
CREATE INDEX "visit_notes_doctorId_createdAt_idx" ON "visit_notes"("doctorId", "createdAt");
CREATE INDEX "medical_reports_patientId_createdAt_idx" ON "medical_reports"("patientId", "createdAt");

ALTER TABLE "visit_notes"
ADD CONSTRAINT "visit_notes_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "visit_notes"
ADD CONSTRAINT "visit_notes_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "visit_notes"
ADD CONSTRAINT "visit_notes_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "medical_reports"
ADD CONSTRAINT "medical_reports_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "medical_reports"
ADD CONSTRAINT "medical_reports_uploadedByDoctorId_fkey" FOREIGN KEY ("uploadedByDoctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
