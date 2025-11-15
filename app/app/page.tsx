"use client";

import { useState } from "react";
import { useBudgetAnalysis } from "@/hooks/useBudgetAnalysis";
import { PastAnalysesPanel } from "@/components/PastAnalysesPanel";
import { AnalysisView } from "@/components/AnalysisView";
import type { BudgetAnalysisResponse } from "@/types/budget";

export default function AppDashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const { status, isLoading, result, error, analyze, reset, setExistingResult } =
    useBudgetAnalysis();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (result || error) reset();
  };

  const handleAnalyzeClick = async () => {
    if (!file) return alert("Upload a budget file first.");
    await analyze(file);
  };

  const handleSelectHistory = (data: BudgetAnalysisResponse) => {
    setExistingResult(data);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-soft-slate sm:text-3xl">
          Budget workspace
        </h1>
        <p className="text-sm text-soft-slate/70 sm:text-base">
          Upload a city budget file, run an AI-powered analysis, and review key
          risks, department trends, and scenarios. For now, uploading the sample
          Meadowbrook budget returns a curated demo analysis.
        </p>
      </header>

      {/* Upload + status */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] lg:items-start">
        <div className="space-y-4 rounded-2xl border border-charcoal/80 bg-charcoal/70 p-5">
          <h2 className="text-sm font-semibold text-soft-slate">
            1. Upload your budget file
          </h2>
          <p className="text-xs text-soft-slate/70">
            Drag-and-drop or select a spreadsheet or PDF exported from your
            existing financial system. For a guided demo, start with the sample
            Meadowbrook file below.
          </p>
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-charcoal/80 bg-charcoal/50 px-4 py-10 text-center text-xs text-soft-slate/60 hover:border-civic-teal/60 hover:text-civic-teal">
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".xls,.xlsx,.csv,.pdf"
            />
            <span className="text-sm font-medium text-soft-slate">
              Click to choose a file
            </span>
            <span className="mt-1 text-[11px] text-soft-slate/50">
              .xlsx, .csv, or .pdf
            </span>
            {file && (
              <span className="mt-3 rounded-full bg-charcoal/80 px-3 py-1 text-[11px] text-civic-teal">
                Selected: {file.name}
              </span>
            )}
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAnalyzeClick}
              disabled={isLoading || !file}
              className="inline-flex items-center justify-center rounded-full bg-gov-blue px-5 py-2 text-xs font-semibold text-soft-slate shadow-lg shadow-gov-blue/40 hover:bg-gov-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Analyzing…" : "Run Analysis"}
            </button>
            <a
              href="/samples/Meadowbrook_FY25_Budget.csv"
              download
              className="text-[11px] font-medium text-civic-teal hover:underline"
            >
              Download sample Meadowbrook budget →
            </a>
          </div>
          {error && (
            <p className="text-[11px] text-fiscal-gold">
              {error}
            </p>
          )}
        </div>

        {/* Status panel + Past analyses */}
        <div className="space-y-3">
          {/* Status panel */}
          <div className="space-y-3 rounded-2xl border border-charcoal/80 bg-charcoal/70 p-5">
            <h2 className="text-sm font-semibold text-soft-slate">
              Analysis status
            </h2>
            <p className="text-xs text-soft-slate/70">
              {status === "idle" && "Upload a file and run an analysis to begin."}
              {status === "analyzing" &&
                "Running analysis… this may take a few moments for larger files."}
              {status === "success" &&
                "Analysis complete. Review the budget health, key risks, and department trends below."}
              {status === "error" &&
                "We couldn't complete the analysis. Check the file format or try again."}
            </p>
            {result && (
              <dl className="mt-3 grid grid-cols-2 gap-3 text-[11px] text-soft-slate/70">
                <div>
                  <dt className="text-soft-slate/50">City</dt>
                  <dd className="font-semibold text-soft-slate">
                    {result.meta.cityName || "Unknown"}
                  </dd>
                </div>
                <div>
                  <dt className="text-soft-slate/50">Fiscal year</dt>
                  <dd className="font-semibold text-soft-slate">
                    {result.meta.fiscalYear || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-soft-slate/50">Rows analyzed</dt>
                  <dd className="font-semibold text-soft-slate">
                    {result.meta.rowsAnalyzed}
                  </dd>
                </div>
                <div>
                  <dt className="text-soft-slate/50">Mode</dt>
                  <dd className="font-semibold text-soft-slate">
                    {result.meta.demo ? "Demo (Meadowbrook)" : "Live"}
                  </dd>
                </div>
              </dl>
            )}
          </div>

          {/* Past analyses panel */}
          <PastAnalysesPanel onSelect={handleSelectHistory} />
        </div>
      </section>

      {/* Analysis result */}
      {result && <AnalysisView result={result} />}
    </div>
  );
}

