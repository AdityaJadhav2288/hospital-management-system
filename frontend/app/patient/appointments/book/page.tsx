import { redirect } from "next/navigation";

interface PatientAppointmentBookRedirectPageProps {
  searchParams: Promise<{ doctorId?: string }>;
}

export default async function PatientAppointmentBookRedirectPage({
  searchParams,
}: PatientAppointmentBookRedirectPageProps) {
  const { doctorId } = await searchParams;
  const query = doctorId ? `?book=1&doctorId=${encodeURIComponent(doctorId)}` : "?book=1";
  redirect(`/dashboard/patient/appointments${query}`);
}
