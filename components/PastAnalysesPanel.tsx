"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import type { BudgetAnalysisResponse } from "@/types/budget";
import Link from "next/link";

type HistoryItem = {
  id: string;
  city_name: string | null;
  fiscal_year: string | null;
  created_at: string;
  health_score: number | null;
  health_label: string | null;
  is_demo: boolean;
  file_name: string | null;
  raw_result: BudgetAnalysisResponse;
};

export function PastAnalysesPanel({
  onSelect,
}: {
  onSelect: (data: BudgetAnalysisResponse) => void;
}) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [distinctCities, setDistinctCities] = useState<string[]>([]);
  const [distinctYears, setDistinctYears] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function loadHistory() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("budget_analyses")
        .select(
          "id, city_name, fiscal_year, created_at, health_score, health_label, is_demo, file_name, raw_result"
        )
        .order("created_at", { ascending: false })
        .limit(50);

      if (cityFilter !== "all") {
        query = query.eq("city_name", cityFilter);
      }

      if (yearFilter !== "all") {
        query = query.eq("fiscal_year", yearFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading budget_analyses:", error);
        setError("Could not load past analyses.");
        setLoading(false);
        return;
      }

      const rows = (data || []) as any as HistoryItem[];

      setItems(rows);
      setLoading(false);

      const cities = Array.from(
        new Set(
          rows
            .map((r) => r.city_name)
            .filter((x): x is string => Boolean(x && x.trim()))
        )
      ).sort();

      const years = Array.from(
        new Set(
          rows
            .map((r) => r.fiscal_year)
            .filter((x): x is string => Boolean(x && x.trim()))
        )
      ).sort();

      setDistinctCities(cities);
      setDistinctYears(years);
    }

    void loadHistory();
  }, [cityFilter, yearFilter]);

  return (
    <section className="space-y-3 rounded-2xl border border-charcoal/80 bg-charcoal/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-soft-slate">
          Past analyses
        </h2>
        {items.length > 0 && (
          <div className="flex gap-2">
            <select
              className="rounded-full border border-charcoal/80 bg-charcoal/50 px-3 py-1 text-[11px] text-soft-slate"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="all">All cities</option>
              {distinctCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className="rounded-full border border-charcoal/80 bg-charcoal/50 px-3 py-1 text-[11px] text-soft-slate"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="all">All years</option>
              {distinctYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading && (
        <p className="text-xs text-soft-slate/60">Loading recent runs…</p>
      )}

      {error && <p className="text-xs text-fiscal-gold">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-xs text-soft-slate/60">
          Once you run an analysis, it will show up here for quick access.
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {items.map((item) => {
            const created = new Date(item.created_at);
            const label =
              item.city_name || item.file_name || "Untitled analysis";

            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-charcoal/50 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-soft-slate">
                    {label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-soft-slate/60">
                    {item.fiscal_year || "FY —"} ·{" "}
                    {created.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    ·{" "}
                    {item.health_score !== null
                      ? `${item.health_score}/100`
                      : "Score —"}
                    {item.is_demo && (
                      <span className="ml-2 rounded-full bg-civic-teal/10 px-2 py-0.5 text-[10px] font-medium text-civic-teal">
                        Demo
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => onSelect(item.raw_result)}
                    className="rounded-full border border-charcoal/80 px-3 py-1 text-[11px] font-semibold text-civic-teal hover:border-civic-teal hover:bg-civic-teal/10"
                  >
                    View here
                  </button>
                  <Link
                    href={`/app/analyses/${item.id}`}
                    className="rounded-full border border-charcoal/80 px-2 py-1 text-[10px] font-semibold text-soft-slate/80 hover:border-charcoal/60 hover:bg-charcoal/50"
                  >
                    Open
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

