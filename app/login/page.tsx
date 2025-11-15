"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const supabase = createSupabaseBrowserClient();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=/app`,
      },
    });

    if (error) {
      setStatus("error");
      setError(error.message);
      return;
    }

    setStatus("sent");
  };

  return (
    <div className="min-h-screen bg-charcoal text-soft-slate">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-soft-slate/80 hover:text-civic-teal"
          >
            ← Back to home
          </Link>
        </header>

        <div className="mx-auto w-full space-y-6 rounded-2xl border border-charcoal/80 bg-charcoal/70 p-6">
          <h1 className="text-xl font-semibold text-soft-slate">
            Log in to MunicipaLogic
          </h1>
          <p className="text-xs text-soft-slate/70">
            Enter your work email and we&apos;ll send you a secure sign-in link.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-xs font-medium text-soft-slate/80"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full rounded-lg border border-charcoal/80 bg-charcoal/50 px-3 py-2 text-sm text-soft-slate placeholder:text-soft-slate/50 focus:border-civic-teal focus:outline-none focus:ring-1 focus:ring-civic-teal"
                placeholder="finance.director@yourcity.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center rounded-full bg-gov-blue px-4 py-2.5 text-sm font-semibold text-soft-slate shadow-lg shadow-gov-blue/40 hover:bg-gov-blue/90 disabled:opacity-60"
            >
              {status === "loading" ? "Sending link…" : "Send magic link"}
            </button>
          </form>
          {status === "sent" && (
            <p className="text-[11px] text-civic-teal">
              Check your inbox for a login link. You can close this tab after you
              click it.
            </p>
          )}
          {status === "error" && error && (
            <p className="text-[11px] text-fiscal-gold">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

