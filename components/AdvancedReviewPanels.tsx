import type { AdvancedBudgetReview } from "@/types/budget";

export function AdvancedReviewPanels({
  review,
}: {
  review: AdvancedBudgetReview;
}) {
  const { councilSummary, multiScenarioReview, riskBuckets, cautionsAndOpportunities } =
    review;

  return (
    <section className="space-y-6">
      <TalkingPointsPanel
        narrative={councilSummary.narrative}
        bullets={councilSummary.threeMinuteTalkingPoints}
      />

      <CouncilQAPanel
        questions={councilSummary.likelyQuestionsFromCouncil}
        responses={councilSummary.suggestedResponses}
      />

      <RiskBucketsPanel riskBuckets={riskBuckets} />

      <MultiScenarioPanel multi={multiScenarioReview} />

      <CautionsPanel data={cautionsAndOpportunities} />
    </section>
  );
}

function TalkingPointsPanel({
  narrative,
  bullets,
}: {
  narrative: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-3xl border border-charcoal/80 bg-charcoal/70 p-5">
      <h2 className="text-sm font-semibold text-soft-slate">
        Council briefing & talking points
      </h2>
      <div className="mt-2 space-y-2 text-xs text-soft-slate/70">
        {narrative.split("\n").map((para, idx) =>
          para.trim() ? (
            <p key={idx} className="leading-relaxed">
              {para}
            </p>
          ) : null
        )}
      </div>
      {bullets?.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-soft-slate/60">
            3-minute talking points
          </p>
          <ul className="mt-2 space-y-1.5 text-[11px] text-soft-slate/80">
            {bullets.map((b, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-xl bg-charcoal/50 px-3 py-2"
              >
                <span className="mt-[2px] text-soft-slate/50">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CouncilQAPanel({
  questions,
  responses,
}: {
  questions: string[];
  responses: string[];
}) {
  if (!questions?.length) return null;

  return (
    <div className="rounded-3xl border border-charcoal/80 bg-charcoal/70 p-5">
      <h2 className="text-sm font-semibold text-soft-slate">
        Likely questions from council
      </h2>
      <p className="mt-1 text-[11px] text-soft-slate/60">
        Use these as a prep sheet for briefings and public meetings.
      </p>
      <div className="mt-3 space-y-2">
        {questions.map((q, idx) => (
          <div
            key={`${idx}-${q}`}
            className="rounded-2xl bg-charcoal/50 px-3 py-2 text-[11px]"
          >
            <p className="font-semibold text-soft-slate">
              Q: {q}
            </p>
            {responses[idx] && (
              <p className="mt-1 text-soft-slate/70">
                <span className="font-semibold text-soft-slate/50">Suggested: </span>
                {responses[idx]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskBucketsPanel({
  riskBuckets,
}: {
  riskBuckets: AdvancedBudgetReview["riskBuckets"];
}) {
  const entries: { key: keyof typeof riskBuckets; label: string }[] = [
    { key: "structural", label: "Structural" },
    { key: "revenue", label: "Revenue" },
    { key: "expenditure", label: "Expenditure" },
    { key: "dataQuality", label: "Data quality" },
  ];

  return (
    <div className="rounded-3xl border border-charcoal/80 bg-charcoal/70 p-5">
      <h2 className="text-sm font-semibold text-soft-slate">
        Risk buckets
      </h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {entries.map(({ key, label }) => {
          const items = riskBuckets[key] || [];
          if (!items.length) return null;

          return (
            <div key={key} className="rounded-2xl bg-charcoal/50 px-3 py-3">
              <p className="text-[11px] font-semibold text-soft-slate">
                {label}
              </p>
              <ul className="mt-2 space-y-1.5 text-[11px] text-soft-slate/70">
                {items.map((item, idx) => (
                  <li key={`${key}-${idx}`}>• {item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MultiScenarioPanel({
  multi,
}: {
  multi: AdvancedBudgetReview["multiScenarioReview"];
}) {
  return (
    <div className="rounded-3xl border border-charcoal/80 bg-charcoal/70 p-5">
      <h2 className="text-sm font-semibold text-soft-slate">
        Multi-scenario review
      </h2>
      <div className="mt-3 rounded-2xl bg-charcoal/50 px-3 py-3 text-[11px] text-soft-slate/70">
        <p className="font-semibold text-soft-slate">Base case</p>
        <p className="mt-1">{multi.baseCase.summary}</p>
        <p className="mt-1 text-soft-slate/60">{multi.baseCase.fiscalImpact}</p>
      </div>
      {multi.scenarios?.length > 0 && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {multi.scenarios.map((s, idx) => (
            <div
              key={`${idx}-${s.name}`}
              className="rounded-2xl bg-charcoal/50 px-3 py-3 text-[11px] text-soft-slate/70"
            >
              <p className="font-semibold text-soft-slate">{s.name}</p>
              <p className="mt-1">{s.summary}</p>
              <p className="mt-1 text-soft-slate/60">
                {s.netImpactDescription}
              </p>
              <p className="mt-1 text-soft-slate/60">
                Services impact: {s.servicesImpact}
              </p>
              {s.recommendedActions?.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {s.recommendedActions.map((a, i) => (
                    <li key={`${idx}-${i}`}>• {a}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CautionsPanel({
  data,
}: {
  data: AdvancedBudgetReview["cautionsAndOpportunities"];
}) {
  const { risksToWatchInNext12Months, easyWinsWithinCurrentBudget } = data;
  if (!risksToWatchInNext12Months?.length && !easyWinsWithinCurrentBudget?.length)
    return null;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {risksToWatchInNext12Months?.length > 0 && (
        <div className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-4 text-[11px]">
          <p className="font-semibold text-soft-slate">
            Risks to watch in the next 12 months
          </p>
          <ul className="mt-2 space-y-1.5 text-soft-slate/70">
            {risksToWatchInNext12Months.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </div>
      )}

      {easyWinsWithinCurrentBudget?.length > 0 && (
        <div className="rounded-2xl border border-charcoal/80 bg-charcoal/70 p-4 text-[11px]">
          <p className="font-semibold text-soft-slate">
            Easy wins within the current budget
          </p>
          <ul className="mt-2 space-y-1.5 text-soft-slate/70">
            {easyWinsWithinCurrentBudget.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

