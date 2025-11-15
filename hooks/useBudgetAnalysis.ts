"use client";

import { useCallback, useState } from "react";
import type { BudgetAnalysisResponse } from "@/types/budget";

type Status = "idle" | "analyzing" | "success" | "error";

export function useBudgetAnalysis() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<BudgetAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (file: File) => {
    setStatus("analyzing");
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("budget", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Analyze failed (${res.status}). ${text || "Please try again."}`
        );
      }

      const data = (await res.json()) as BudgetAnalysisResponse;
      setResult(data);
      setStatus("success");
      return data;
    } catch (err: any) {
      console.error("useBudgetAnalysis error:", err);
      setStatus("error");
      setError(err?.message || "Something went wrong running the analysis.");
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  // Allow history panel to inject an existing saved result
  const setExistingResult = useCallback((data: BudgetAnalysisResponse) => {
    setResult(data);
    setStatus("success");
    setError(null);
  }, []);

  const isLoading = status === "analyzing";

  return {
    status,
    isLoading,
    result,
    error,
    analyze,
    reset,
    setExistingResult,
  };
}

