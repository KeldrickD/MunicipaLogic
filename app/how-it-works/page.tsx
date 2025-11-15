import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-charcoal text-soft-slate">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-soft-slate/80 hover:text-civic-teal"
          >
            ← Back to home
          </Link>
        </header>

        <div className="space-y-10">
          <header className="max-w-3xl space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-soft-slate sm:text-4xl">
              How MunicipaLogic works
            </h1>
            <p className="text-sm text-soft-slate/70 sm:text-base">
              MunicipaLogic plugs into the way your city already builds budgets.
              Upload the files you're already using – spreadsheets or PDFs – and we
              turn them into clear, defensible insights for staff and council.
            </p>
          </header>

          {/* 3-step flow */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight text-soft-slate sm:text-2xl">
              From budget file to insight in three steps.
            </h2>
            <ol className="grid gap-6 md:grid-cols-3">
              <StepCard
                step={1}
                title="Ingest your budget"
                body="Upload your current-year and prior-year budgets as spreadsheets or PDFs exported from your ERP. No custom templates required."
              />
              <StepCard
                step={2}
                title="Structuring & checks"
                body="We structure line items, group departments, and run consistency checks to find anomalies, outliers, and trends."
              />
              <StepCard
                step={3}
                title="Scoring & briefing"
                body="Our models score the budget, highlight key risks, and produce a summary you can take directly into council or workshops."
              />
            </ol>
          </section>

          {/* Under the hood */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-soft-slate sm:text-2xl">
              What happens under the hood.
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card
                title="Data structuring"
                items={[
                  "Normalize fiscal years, funds, departments, and accounts.",
                  "Detect and group similar line items (e.g., subscriptions, maintenance).",
                  "Separate operating vs. capital and revenues vs. expenses.",
                ]}
              />
              <Card
                title="Baseline analysis"
                items={[
                  "Compute year-over-year changes by department and account.",
                  "Flag unusually fast growth or shrinkage versus history.",
                  "Summarize department-level totals and trends.",
                ]}
              />
              <Card
                title="Risk & anomaly detection"
                items={[
                  "Identify potential duplicate or overlapping line items.",
                  "Scan for heavy dependence on a small set of revenue sources.",
                  "Flag departments with accelerating cost growth.",
                ]}
              />
              <Card
                title="AI scoring & narrative"
                items={[
                  "GPT-5.1 scores overall budget health on a 0–100 scale.",
                  "Generates plain-language key drivers behind the score.",
                  "Produces a council-ready written summary and scenario notes.",
                ]}
              />
            </div>
          </section>

          {/* Outputs */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-soft-slate sm:text-2xl">
              What you get back.
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <OutputCard
                title="Budget health score"
                body='A 0–100 score with labels like "strong," "balanced," or "vulnerable," plus 2–4 key drivers explaining why.'
              />
              <OutputCard
                title="Risk & opportunity list"
                body="Concrete, high-impact items like overspending, duplicated subscriptions, or revenue exposure, each with dollar impact where possible."
              />
              <OutputCard
                title="Council-ready brief"
                body="A concise narrative you can drop into a packet or slide deck explaining where the budget is solid and where it needs attention."
              />
            </div>
          </section>

          {/* Pilot CTA */}
          <section className="rounded-3xl border border-civic-teal/30 bg-gradient-to-r from-civic-teal/15 via-charcoal to-gov-blue/10 px-6 py-8 sm:px-10 sm:py-10">
            <div className="max-w-3xl space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-soft-slate sm:text-3xl">
                See it on your own budget in 30 days.
              </h2>
              <p className="text-sm text-soft-slate/90 sm:text-base">
                We'll run your current fiscal year through MunicipaLogic,
                walk through the findings with your team, and leave you with a
                council-ready summary. No system replacement, no long IT project.
              </p>
              <Link
                href="/#pilot"
                className="mt-3 inline-flex items-center justify-center rounded-full bg-gov-blue px-5 py-2.5 text-sm font-semibold text-soft-slate shadow-lg shadow-gov-blue/40 hover:bg-gov-blue/90"
              >
                Start a 30-day pilot
              </Link>
            </div>
          </section>
        </div>
      </div>
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

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-5">
      <h3 className="text-sm font-semibold text-soft-slate">{title}</h3>
      <ul className="mt-2 space-y-1.5 text-xs text-soft-slate/70">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function OutputCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-5">
      <h3 className="text-sm font-semibold text-soft-slate">{title}</h3>
      <p className="mt-2 text-xs text-soft-slate/70">{body}</p>
    </div>
  );
}

