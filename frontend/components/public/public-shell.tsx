import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
