import { Suspense } from "react";
import { HomePageClient } from "@/app/home-page-client";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageClient />
    </Suspense>
  );
}
