-- AddIndex
CREATE INDEX IF NOT EXISTS "appointments_doctorId_idx" ON "appointments"("doctorId");

-- AddIndex
CREATE INDEX IF NOT EXISTS "appointments_patientId_idx" ON "appointments"("patientId");

-- AddIndex
CREATE INDEX IF NOT EXISTS "appointments_date_idx" ON "appointments"("date");
