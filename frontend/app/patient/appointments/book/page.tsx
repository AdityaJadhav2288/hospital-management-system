import { Suspense } from "react";
import { PatientAppointmentBookPageClient } from "@/app/patient/appointments/book/patient-appointment-book-page-client";

export default function PatientAppointmentBookPage() {
  return (
    <Suspense fallback={null}>
      <PatientAppointmentBookPageClient />
    </Suspense>
  );
}
