ALTER TABLE "vitals" RENAME TO "patient_vitals";

ALTER INDEX "vitals_pkey" RENAME TO "patient_vitals_pkey";
ALTER INDEX "vitals_patientId_recordedAt_idx" RENAME TO "patient_vitals_patientId_recordedAt_idx";

ALTER TABLE "patient_vitals" RENAME CONSTRAINT "vitals_patientId_fkey" TO "patient_vitals_patientId_fkey";
ALTER TABLE "patient_vitals" RENAME CONSTRAINT "vitals_recordedByDoctorId_fkey" TO "patient_vitals_recordedByDoctorId_fkey";

ALTER TABLE "patient_vitals" RENAME COLUMN "patientId" TO "patient_id";
ALTER TABLE "patient_vitals" RENAME COLUMN "recordedByDoctorId" TO "recorded_by_doctor_id";
ALTER TABLE "patient_vitals" RENAME COLUMN "weightKg" TO "weight";
ALTER TABLE "patient_vitals" RENAME COLUMN "heightCm" TO "height";
ALTER TABLE "patient_vitals" RENAME COLUMN "pulseRate" TO "heart_rate";
ALTER TABLE "patient_vitals" RENAME COLUMN "temperature_c" TO "temperature";
ALTER TABLE "patient_vitals" RENAME COLUMN "recordedAt" TO "recorded_at";

ALTER TABLE "patient_vitals"
ADD COLUMN "blood_sugar" INTEGER,
ADD COLUMN "cholesterol" INTEGER,
ADD COLUMN "bp_systolic" INTEGER,
ADD COLUMN "bp_diastolic" INTEGER,
ADD COLUMN "spo2" INTEGER;

UPDATE "patient_vitals"
SET
  "bp_systolic" = CASE
    WHEN "bloodPressure" IS NOT NULL AND split_part("bloodPressure", '/', 1) ~ '^[0-9]+$'
      THEN split_part("bloodPressure", '/', 1)::INTEGER
    ELSE NULL
  END,
  "bp_diastolic" = CASE
    WHEN "bloodPressure" IS NOT NULL AND split_part("bloodPressure", '/', 2) ~ '^[0-9]+$'
      THEN split_part("bloodPressure", '/', 2)::INTEGER
    ELSE NULL
  END;
