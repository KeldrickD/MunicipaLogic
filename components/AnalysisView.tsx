import type { BudgetAnalysisResponse } from "@/types/budget";
import { AdvancedReviewPanels } from "./AdvancedReviewPanels";

export function AnalysisView({ result }: { result: BudgetAnalysisResponse }) {
  return (
    <section className="space-y-6">
      {/* Health + key risks */}
      <div className="rounded-3xl border border-civic-teal/40 bg-charcoal/70 p-5 shadow-lg shadow-civic-teal/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-soft-slate/60">
              Budget health
            </p>
            <p className="mt-1 text-3xl font-semibold text-civic-teal">
              {result.health.score} / 100
            </p>
            <p className="mt-1 text-xs text-soft-slate/70">
              Status:{" "}
              <span className="font-semibold text-civic-teal">
                {result.health.label}
              </span>
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-civic-teal/60 bg-civic-teal/10">
            <span className="text-xl text-civic-teal">✓</span>
          </div>
        </div>
        {result.health.keyDrivers?.length > 0 && (
          <ul className="mt-4 grid gap-2 text-[11px] text-soft-slate/80 md:grid-cols-2">
            {result.health.keyDrivers.map((d) => (
              <li
                key={d}
                className="rounded-xl bg-charcoal/50 px-3 py-2 text-soft-slate/80"
              >
                • {d}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Risk cards */}
      {result.risks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-soft-slate">
            Key risks & opportunities
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {result.risks.map((risk) => (
              <div
                key={risk.id}
                className="flex flex-col justify-between rounded-2xl bg-charcoal/70 px-3 py-3 border border-charcoal/60"
              >
                <div>
                  <p className="text-[11px] font-semibold text-soft-slate">
                    {risk.label}
                  </p>
                  <p className="mt-1 text-[11px] text-soft-slate/60">
                    {risk.category}
                    {risk.department ? ` · ${risk.department}` : ""}
                  </p>
                </div>
                <p className="mt-2 text-[11px] text-civic-teal">
                  {risk.impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Department summaries */}
      {result.departments.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-soft-slate">
            Department overview
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {result.departments.map((dept) => (
              <div
                key={dept.name}
                className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-3"
              >
                <p className="text-[11px] font-semibold text-soft-slate">
                  {dept.name}
                </p>
                <p className="mt-1 text-[11px] text-soft-slate/70">
                  Total:{" "}
                  <span className="font-semibold">
                    {formatCurrency(dept.totalAmount)}
                  </span>
                </p>
                <p className="mt-1 text-[11px] text-soft-slate/70">
                  YoY change:{" "}
                  <span className="font-semibold">
                    {dept.yoyChangePct.toFixed(1)}%
                  </span>
                </p>
                {dept.notes && (
                  <p className="mt-1 text-[11px] text-soft-slate/60">
                    {dept.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scenarios */}
      {result.scenarios.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-soft-slate">
            Scenario snapshots
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {result.scenarios.map((s) => (
              <div
                key={s.name}
                className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-3"
              >
                <p className="text-[11px] font-semibold text-soft-slate">
                  {s.name}
                </p>
                <p className="mt-1 text-[11px] text-soft-slate/70">
                  {s.description}
                </p>
                <p className="mt-1 text-[11px] text-civic-teal">
                  Net impact: {formatCurrency(s.netImpactAmount)}
                </p>
                {s.notes && (
                  <p className="mt-1 text-[11px] text-soft-slate/60">{s.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Council summary */}
      <div className="rounded-2xl bg-charcoal/70 p-4 text-xs border border-charcoal/80">
        <p className="font-semibold text-soft-slate">Summary for council:</p>
        <p className="mt-1 text-soft-slate/70">{result.councilSummary}</p>
      </div>

      {/* Advanced AI review section */}
      {result.advancedReview && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-soft-slate">
              AI council prep
            </h2>
            <span className="rounded-full bg-civic-teal/10 px-3 py-1 text-[10px] font-semibold text-civic-teal">
              Powered by GPT-5.1
            </span>
          </div>
          <AdvancedReviewPanels review={result.advancedReview} />
        </div>
      )}
    </section>
  );
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

