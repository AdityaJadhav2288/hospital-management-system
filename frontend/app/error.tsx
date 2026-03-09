"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    // Keep the error visible in logs without crashing the UI again.
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Application Error</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The page hit an unexpected error while loading hospital data. Try again, or return to the dashboard and retry
          the action.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => reset()}>Try Again</Button>
          <Button variant="outline" onClick={() => window.location.assign("/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
