import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";

export const metadata: Metadata = {
  title: "MunicipaLogic Dashboard - Budget Analysis",
  description: "Upload and analyze your municipal budget with AI-powered insights.",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-charcoal text-soft-slate">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <header className="flex items-center justify-between gap-4 border-b border-charcoal/80 pb-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-civic-teal/10 ring-1 ring-civic-teal/40">
              <div className="relative h-6 w-6">
                <span className="absolute inset-x-1 bottom-0 h-[3px] rounded-full bg-civic-teal" />
                <span className="absolute inset-x-0 bottom-1 h-[10px] rounded-t-md border border-civic-teal/50 bg-civic-teal/10" />
                <span className="absolute left-1 bottom-1 h-4 w-[6px] rounded-sm bg-civic-teal/80" />
                <span className="absolute left-3 bottom-1 h-6 w-[6px] rounded-sm bg-civic-teal/60" />
                <span className="absolute right-1 bottom-1 h-3 w-[6px] rounded-sm bg-civic-teal/80" />
              </div>
            </div>
            <span className="text-lg font-semibold tracking-tight text-soft-slate">
              MunicipaLogic
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-soft-slate/80 hover:text-civic-teal"
          >
            ← Back to home
          </Link>
        </header>
        <main className="mt-8">{children}</main>
      </div>
    </div>
  );
}

