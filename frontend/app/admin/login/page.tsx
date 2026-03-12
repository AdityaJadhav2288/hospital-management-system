import { redirect } from "next/navigation";

interface AdminLoginAliasPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function AdminLoginAliasPage({ searchParams }: AdminLoginAliasPageProps) {
  const { redirect: redirectTarget } = await searchParams;
  const query = redirectTarget ? `?redirect=${encodeURIComponent(redirectTarget)}` : "";

  redirect(`/login/admin${query}`);
}
