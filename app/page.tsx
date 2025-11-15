"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { name: "Why MunicipaLogic", href: "#why" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("loading");
    
    try {
      const res = await fetch("/api/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (res.ok) {
        setFormStatus("success");
        setEmail("");
        setRole("");
      } else {
        setFormStatus("error");
      }
    } catch (err) {
      setFormStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-charcoal text-soft-slate">
      {/* Top gradient glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 flex justify-center">
        <div className="h-64 w-[40rem] rounded-full bg-civic-teal/20 blur-3xl" />
      </div>

      {/* Shell */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-civic-teal/10 ring-1 ring-civic-teal/40">
              {/* Simple Civic Ledger icon */}
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
          </div>
          <nav className="hidden items-center gap-5 text-sm font-medium text-soft-slate/80 md:flex">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-civic-teal transition-colors"
              >
                {item.name}
              </a>
            ))}
            <Link
              href="/app"
              className="rounded-full border border-civic-teal/50 px-4 py-2 text-sm font-semibold text-soft-slate hover:bg-civic-teal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-teal"
            >
              Demo login
            </Link>
            <Link
              href="#pilot"
              className="rounded-full bg-gov-blue px-4 py-2 text-sm font-semibold text-soft-slate shadow-lg shadow-gov-blue/40 hover:bg-gov-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-teal"
            >
              Start a Pilot
            </Link>
          </nav>
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-soft-slate hover:bg-charcoal/50"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </header>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="mt-4 space-y-2 md:hidden">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-2 text-sm font-medium text-soft-slate/80 hover:bg-charcoal/50 hover:text-civic-teal"
              >
                {item.name}
              </a>
            ))}
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg border border-civic-teal/50 px-4 py-2 text-sm font-semibold text-soft-slate hover:bg-civic-teal/10"
            >
              Demo login
            </Link>
            <Link
              href="#pilot"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-full bg-gov-blue px-4 py-2 text-sm font-semibold text-soft-slate shadow-lg shadow-gov-blue/40 hover:bg-gov-blue/90 text-center"
            >
              Start a Pilot
            </Link>
          </nav>
        )}

        {/* Main content */}
        <main className="mt-10 flex flex-1 flex-col gap-20 lg:mt-16 lg:gap-28">
          {/* Hero */}
          <section
            aria-labelledby="hero-heading"
            className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] lg:items-center"
          >
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-civic-teal/40 bg-logic-mint/20 px-3 py-1 text-xs font-medium text-civic-teal">
                New · AI budget intelligence for municipalities
              </p>
              <h1
                id="hero-heading"
                className="mt-4 text-balance text-4xl font-semibold tracking-tight text-soft-slate sm:text-5xl lg:text-6xl"
              >
                Smarter budget decisions
                <span className="text-civic-teal"> for every city.</span>
              </h1>
              <p className="mt-4 max-w-xl text-balance text-sm text-soft-slate/80 sm:text-base">
                MunicipaLogic reads your entire city budget in seconds, surfaces
                risks and inefficiencies, and generates clear, council-ready
                insights—without new systems, staff, or training.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="#pilot"
                  className="inline-flex items-center justify-center rounded-full bg-gov-blue px-6 py-2.5 text-sm font-semibold text-soft-slate shadow-lg shadow-gov-blue/40 hover:bg-gov-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-teal"
                >
                  Start a 30-Day Pilot
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-full border border-civic-teal/50 px-5 py-2.5 text-sm font-semibold text-soft-slate hover:bg-civic-teal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-teal"
                >
                  Watch how it works
                  <span className="ml-1.5 text-lg leading-none">↳</span>
                </a>
              </div>
              <dl className="mt-8 grid gap-4 text-xs text-soft-slate/70 sm:grid-cols-3 sm:text-sm">
                <div>
                  <dt className="text-soft-slate/60">Time to first insight</dt>
                  <dd className="font-semibold text-soft-slate">
                    Under 60 seconds
                  </dd>
                </div>
                <div>
                  <dt className="text-soft-slate/60">Staff training required</dt>
                  <dd className="font-semibold text-soft-slate">None</dd>
                </div>
                <div>
                  <dt className="text-soft-slate/60">Works with</dt>
                  <dd className="font-semibold text-soft-slate">
                    Spreadsheets &amp; PDFs
                  </dd>
                </div>
              </dl>
            </div>

            {/* Hero "budget insight" panel */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-civic-teal/10 blur-2xl" />
              <div className="relative rounded-3xl border border-charcoal/80 bg-charcoal/60 p-5 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-soft-slate/50">
                      Budget Health
                    </p>
                    <p className="mt-1 text-4xl font-semibold text-civic-teal">
                      87 / 100
                    </p>
                    <p className="mt-1 text-xs text-soft-slate/70">
                      Solid but with <span className="text-fiscal-gold">3</span>{" "}
                      high-impact risks identified.
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-civic-teal/40 bg-civic-teal/10">
                    <span className="text-2xl text-civic-teal">✓</span>
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-xs">
                  <InsightRow
                    label="Fleet maintenance overspend"
                    value="$412,000"
                    badge="Efficiency opportunity"
                  />
                  <InsightRow
                    label="Duplicate line items detected"
                    value="7"
                    badge="Data quality"
                  />
                  <InsightRow
                    label="Revenue sensitivity at −5%"
                    value="Balanced with cuts in non-essential"
                    badge="Scenario ready"
                  />
                </div>
                <div className="mt-5 rounded-2xl bg-charcoal/70 p-4 text-xs">
                  <p className="font-semibold text-soft-slate">
                    Summary for council:
                  </p>
                  <p className="mt-1 text-soft-slate/70">
                    The FY26 draft budget is structurally balanced but vulnerable
                    to modest revenue shocks. Redirecting 1.8% from under-used
                    line items fully covers critical infrastructure priorities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Trusted by strip */}
          <section className="border-y border-charcoal/80 py-6">
            <p className="text-center text-xs font-medium text-soft-slate/60">
              Built for:{" "}
              <span className="text-soft-slate/80">
                City Managers · Finance Directors · Budget Analysts
              </span>
            </p>
          </section>

          {/* Why section */}
          <section
            id="why"
            aria-labelledby="why-heading"
            className="scroll-mt-28 space-y-6"
          >
            <div className="max-w-2xl">
              <h2
                id="why-heading"
                className="text-2xl font-semibold tracking-tight text-soft-slate sm:text-3xl"
              >
                Built for how cities actually build budgets.
              </h2>
              <p className="mt-3 text-sm text-soft-slate/70 sm:text-base">
                Finance teams are buried under spreadsheets, version history,
                and last-minute amendments. MunicipaLogic reads the full picture
                and highlights what matters—in time for the next workshop, not
                the next audit.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <WhyCard
                title="No new system to learn"
                body="Upload your existing spreadsheets or PDFs. MunicipaLogic wraps around your current workflow instead of replacing it."
              />
              <WhyCard
                title="Answers, not dashboards"
                body="We surface concrete risks, savings, and trade-offs so staff and council can move quickly and confidently."
              />
              <WhyCard
                title="Designed for public scrutiny"
                body="Every recommendation is explained in plain language so you can stand behind it in public meetings."
              />
            </div>
          </section>

          {/* Features */}
          <section
            id="features"
            aria-labelledby="features-heading"
            className="scroll-mt-28 space-y-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="features-heading"
                  className="text-2xl font-semibold tracking-tight text-soft-slate sm:text-3xl"
                >
                  Core capabilities out of the box.
                </h2>
                <p className="mt-2 max-w-xl text-sm text-soft-slate/70 sm:text-base">
                  Everything you need to analyze a full municipal budget—line by
                  line, department by department.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <FeatureCard
                title="Automated line-item analysis"
                body="Detect anomalies, outliers, and historical drift across every department in seconds."
              />
              <FeatureCard
                title="Scenario modeling"
                body="Test revenue changes, staffing adjustments, or capital shifts without rebuilding your spreadsheets."
              />
              <FeatureCard
                title="Council-ready reports"
                body="Export concise summaries with charts, trends, and plain-language explanations for decision-makers."
              />
              <FeatureCard
                title="Multi-year forecasting"
                body="Project the impact of today's decisions on the next 3–5 fiscal years with configurable assumptions."
              />
            </div>
          </section>

          {/* How it works */}
          <section
            id="how-it-works"
            aria-labelledby="how-heading"
            className="scroll-mt-28 space-y-8"
          >
            <div className="max-w-2xl">
              <h2
                id="how-heading"
                className="text-2xl font-semibold tracking-tight text-soft-slate sm:text-3xl"
              >
                From upload to insight in under a minute.
              </h2>
            </div>
            <ol className="grid gap-6 text-sm text-soft-slate/80 md:grid-cols-3">
              <StepCard
                step={1}
                title="Upload your budget"
                body="Drag-and-drop spreadsheets or PDFs—no special formatting needed."
              />
              <StepCard
                step={2}
                title="AI reads every line"
                body="MunicipaLogic structures the data, compares history, and scans for risk."
              />
              <StepCard
                step={3}
                title="Review the findings"
                body="Explore insights, adjust scenarios, and export a clean report for leadership."
              />
            </ol>
            <div className="mt-6 text-center">
              <a
                href="/samples/Meadowbrook_FY25_Budget.csv"
                download
                className="inline-flex items-center text-xs font-medium text-civic-teal hover:underline"
              >
                Try it with the sample Meadowbrook budget →
              </a>
            </div>
          </section>

          {/* Pricing */}
          <section
            id="pricing"
            aria-labelledby="pricing-heading"
            className="scroll-mt-28 space-y-8"
          >
            <div className="max-w-2xl">
              <h2
                id="pricing-heading"
                className="text-2xl font-semibold tracking-tight text-soft-slate sm:text-3xl"
              >
                Simple, municipal-friendly pricing.
              </h2>
              <p className="mt-2 text-sm text-soft-slate/70 sm:text-base">
                Start with a risk-free pilot, then scale to the rest of your
                organization.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <PricingCard
                label="Small Town"
                price="$399"
                cadence="/month"
                blurb="Population under 10,000."
                items={[
                  "Up to 3 budgets per year",
                  "3 staff accounts",
                  "Standard insights & reports",
                ]}
              />
              <PricingCard
                label="Mid-Size City"
                price="$1,500"
                cadence="/month"
                blurb="Population 10,000 – 75,000."
                highlighted
                items={[
                  "Unlimited budget uploads",
                  "Scenario modeling & forecasting",
                  "Priority onboarding & support",
                ]}
              />
              <PricingCard
                label="Large City / County"
                price="Let's talk"
                cadence=""
                blurb="Complex, multi-department environments."
                items={[
                  "Custom modeling & integrations",
                  "Single sign-on (SSO)",
                  "Dedicated account partner",
                ]}
              />
            </div>
          </section>

          {/* Pilot CTA */}
          <section
            id="pilot"
            className="scroll-mt-28 rounded-3xl border border-civic-teal/30 bg-gradient-to-r from-civic-teal/15 via-charcoal to-gov-blue/10 px-6 py-8 sm:px-10 sm:py-10"
          >
            <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)] md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-soft-slate sm:text-3xl">
                  Launch a 30-day pilot with your real budget.
                </h2>
                <p className="mt-3 text-sm text-soft-slate/90 sm:text-base">
                  We'll onboard your finance team, run your current fiscal year
                  through MunicipaLogic, and deliver a findings report you can
                  take straight into your next workshop.
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-soft-slate/90">
                  <li>• No IT project or RFP required</li>
                  <li>• Works alongside your existing ERP</li>
                  <li>• Cancel anytime—keep the insights</li>
                </ul>
              </div>
              <div className="space-y-3 rounded-2xl bg-charcoal/70 p-5 shadow-lg shadow-civic-teal/20">
                <p className="text-sm font-medium text-soft-slate">
                  Request a pilot briefing
                </p>
                <p className="text-xs text-soft-slate/70">
                  Share a work email and we'll follow up with a short agenda and
                  available times for a 25-minute intro call.
                </p>
                <form onSubmit={handleSubmit} className="mt-3 space-y-3">
                  {formStatus === "success" && (
                    <div className="rounded-lg bg-civic-teal/20 border border-civic-teal/40 px-3 py-2 text-xs text-civic-teal">
                      Thanks! We'll be in touch soon.
                    </div>
                  )}
                  {formStatus === "error" && (
                    <div className="rounded-lg bg-fiscal-gold/20 border border-fiscal-gold/40 px-3 py-2 text-xs text-fiscal-gold">
                      Something went wrong. Please try again.
                    </div>
                  )}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={formStatus === "loading"}
                      className="w-full rounded-lg border border-charcoal/80 bg-charcoal/50 px-3 py-2 text-sm text-soft-slate placeholder:text-soft-slate/50 focus:border-civic-teal focus:outline-none focus:ring-1 focus:ring-civic-teal disabled:opacity-50"
                      placeholder="finance.director@yourcity.gov"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="role"
                      className="text-xs font-medium text-soft-slate/80"
                    >
                      Role (optional)
                    </label>
                    <input
                      id="role"
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled={formStatus === "loading"}
                      className="w-full rounded-lg border border-charcoal/80 bg-charcoal/50 px-3 py-2 text-sm text-soft-slate placeholder:text-soft-slate/50 focus:border-civic-teal focus:outline-none focus:ring-1 focus:ring-civic-teal disabled:opacity-50"
                      placeholder="Finance Director, City Manager, Budget Analyst…"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === "loading"}
                    className="inline-flex w-full items-center justify-center rounded-full bg-gov-blue px-4 py-2.5 text-sm font-semibold text-soft-slate shadow-lg shadow-gov-blue/40 hover:bg-gov-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-teal disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === "loading" ? "Submitting..." : "Request pilot details"}
                  </button>
                  <p className="text-[11px] text-soft-slate/60">
                    We only use this information to follow up about MunicipaLogic.
                    No marketing lists. No spam.
                  </p>
                </form>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-28 space-y-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-soft-slate sm:text-3xl">
                Frequently asked questions.
              </h2>
              <p className="mt-2 text-sm text-soft-slate/70 sm:text-base">
                If you don't see your question here, we're happy to walk
                through details one-on-one.
              </p>
            </div>
            <div className="space-y-4 text-sm text-soft-slate/80">
              <FaqItem
                question="Do we need to replace our ERP or financial system?"
                answer="No. MunicipaLogic analyzes the files you already export from your ERP—spreadsheets, CSVs, or PDFs. It sits alongside your existing tools."
              />
              <FaqItem
                question="Is our budget data secure?"
                answer="Yes. All files are encrypted at rest and in transit. Access can be limited to named staff accounts, and we support additional controls for larger cities."
              />
              <FaqItem
                question="How long does it take to roll out?"
                answer="Most cities are live within a day. A typical pilot involves a 25-minute intro call, a test upload, and then working together on your next budget milestone."
              />
              <FaqItem
                question="Who is MunicipaLogic for?"
                answer="We primarily serve finance directors, budget analysts, and city or county managers who need faster, clearer insight into complex budgets."
              />
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-charcoal/80 pt-6 text-xs text-soft-slate/60 sm:flex sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MunicipaLogic. All rights reserved.</p>
          <div className="mt-2 flex flex-wrap gap-4 sm:mt-0">
            <Link href="/security" className="hover:text-civic-teal">
              Security
            </Link>
            <a href="#" className="hover:text-civic-teal">
              Privacy
            </a>
            <a href="#" className="hover:text-civic-teal">
              Contact
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Small presentational components
function InsightRow({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge: string;
}) {
  const getBadgeColor = (badge: string) => {
    if (badge.toLowerCase().includes("efficiency")) {
      return "bg-logic-mint/20 text-logic-mint border-logic-mint/40";
    }
    if (badge.toLowerCase().includes("data quality")) {
      return "bg-fiscal-gold/20 text-fiscal-gold border-fiscal-gold/40";
    }
    return "bg-civic-teal/20 text-civic-teal border-civic-teal/40";
  };

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-charcoal/60 px-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium text-soft-slate/70">{label}</p>
        <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${getBadgeColor(badge)}`}>
          {badge}
        </span>
      </div>
      <p className="shrink-0 text-xs font-semibold text-civic-teal ml-2">
        {value}
      </p>
    </div>
  );
}

function WhyCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-5">
      <h3 className="text-sm font-semibold text-soft-slate">{title}</h3>
      <p className="mt-2 text-xs text-soft-slate/70">{body}</p>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-5">
      <h3 className="text-sm font-semibold text-soft-slate">{title}</h3>
      <p className="mt-2 text-xs text-soft-slate/70">{body}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  body,
}: {
  step: number;
  title: string;
  body: string;
}) {
  return (
    <li className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-civic-teal/15 text-xs font-semibold text-civic-teal ring-1 ring-civic-teal/40">
          {step}
        </span>
        <p className="text-sm font-semibold text-soft-slate">{title}</p>
      </div>
      <p className="mt-2 text-xs text-soft-slate/70">{body}</p>
    </li>
  );
}

function PricingCard({
  label,
  price,
  cadence,
  blurb,
  items,
  highlighted,
}: {
  label: string;
  price: string;
  cadence: string;
  blurb: string;
  items: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border bg-charcoal/70 p-5 ${
        highlighted
          ? "border-civic-teal/70 shadow-lg shadow-civic-teal/30"
          : "border-charcoal/80"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-soft-slate/60">
        {label}
      </p>
      <div className="mt-3 flex items-baseline gap-1">
        <p className="text-2xl font-semibold text-soft-slate">{price}</p>
        {cadence && (
          <p className="text-xs text-soft-slate/60">{cadence}</p>
        )}
      </div>
      <p className="mt-1 text-xs text-soft-slate/70">{blurb}</p>
      <ul className="mt-4 space-y-1.5 text-xs text-soft-slate/80">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
      <div className="mt-4">
        <button
          type="button"
          suppressHydrationWarning
          className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-xs font-semibold ${
            highlighted
              ? "bg-gov-blue text-soft-slate hover:bg-gov-blue/90"
              : "bg-charcoal text-soft-slate hover:bg-charcoal/80"
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-teal`}
        >
          Talk to our team
        </button>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-4">
      <p className="text-sm font-semibold text-soft-slate">{question}</p>
      <p className="mt-1 text-xs text-soft-slate/70">{answer}</p>
    </div>
  );
}

