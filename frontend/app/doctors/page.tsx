import { Suspense } from "react";
import { DoctorsPageClient } from "@/app/doctors/doctors-page-client";

export default function DoctorsPage() {
  return (
    <Suspense fallback={null}>
      <DoctorsPageClient />
    </Suspense>
  );
}
