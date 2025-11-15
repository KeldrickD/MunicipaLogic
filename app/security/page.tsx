import Link from "next/link";

export default function SecurityPage() {
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
              Security & data protection
            </h1>
            <p className="text-sm text-soft-slate/70 sm:text-base">
              MunicipaLogic is built for municipal environments where public trust
              and data sensitivity are non-negotiable. This page summarizes how we
              handle security today and what&apos;s on our roadmap.
            </p>
          </header>

          {/* High-level pillars */}
          <section className="grid gap-6 md:grid-cols-3">
            <Pillar
              title="Secure by default"
              body="All connections are encrypted in transit and at rest, with strict access controls for both application and infrastructure."
            />
            <Pillar
              title="Least-privilege access"
              body="We limit access to production data to a small number of named team members, with least-privilege permissions."
            />
            <Pillar
              title="Transparent for cities"
              body="We document how data flows through MunicipaLogic so finance and IT teams can evaluate risk clearly."
            />
          </section>

          {/* Technical controls */}
          <section className="grid gap-6 md:grid-cols-2">
            <Card
              title="Data in transit & at rest"
              items={[
                "All web traffic is encrypted using HTTPS (TLS).",
                "Budget files and analysis results are stored encrypted at rest by our cloud provider.",
                "Access to storage buckets is restricted to the application and service accounts – not directly exposed to the public internet.",
              ]}
            />
            <Card
              title="Application & access controls"
              items={[
                "User authentication is handled by Supabase, with unique accounts per user.",
                "Role-based access can be configured, limiting which users can upload or view analyses.",
                "Admin access to production systems is limited to named members of the MunicipaLogic team.",
              ]}
            />
          </section>

          {/* Data lifecycle */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-soft-slate sm:text-2xl">
              Data lifecycle: from upload to deletion.
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Phase
                title="Upload"
                body="Budget files are uploaded over HTTPS, scanned, and stored in an access-controlled bucket. Metadata is recorded in the database so you can track when analyses were run and by whom."
              />
              <Phase
                title="Analysis"
                body="We structure and analyze the budget data, and – when enabled – share a compact, relevant subset with GPT-5.1 for scoring and narrative generation. We do not send raw PII or full documents to the model."
              />
              <Phase
                title="Retention & deletion"
                body="Retention schedules can be configured per city. Upon request, we can remove budget files and associated analyses from our systems, subject to any legal obligations."
              />
            </div>
          </section>

          {/* Roadmap */}
          <section className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-5">
            <h2 className="text-sm font-semibold text-soft-slate">
              Security roadmap
            </h2>
            <ul className="mt-3 space-y-1.5 text-xs text-soft-slate/70">
              <li>• SOC 2 readiness assessment and formal audit.</li>
              <li>• Expanded audit logging for user actions and data access.</li>
              <li>• Region-specific data residency options where required.</li>
              <li>• Single sign-on (SSO) integration for larger cities and counties.</li>
            </ul>
            <p className="mt-3 text-xs text-soft-slate/60">
              For a detailed security questionnaire or to schedule a call with our
              team, contact{" "}
              <a
                href="mailto:security@municipalogic.com"
                className="text-civic-teal hover:underline"
              >
                security@municipalogic.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-5">
      <h2 className="text-sm font-semibold text-soft-slate">{title}</h2>
      <p className="mt-2 text-xs text-soft-slate/70">{body}</p>
    </div>
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

function Phase({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-5">
      <h3 className="text-sm font-semibold text-soft-slate">{title}</h3>
      <p className="mt-2 text-xs text-soft-slate/70">{body}</p>
    </div>
  );
}

