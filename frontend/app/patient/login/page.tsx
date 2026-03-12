import { redirect } from "next/navigation";

interface PatientLoginAliasPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function PatientLoginAliasPage({ searchParams }: PatientLoginAliasPageProps) {
  const { redirect: redirectTarget } = await searchParams;
  const query = redirectTarget ? `?redirect=${encodeURIComponent(redirectTarget)}` : "";

  redirect(`/login/patient${query}`);
}
