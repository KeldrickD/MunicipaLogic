import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { BudgetAnalysisResponse, BudgetHealth } from "@/types/budget";
import { buildMeadowbrookDemoResponse } from "@/lib/demoMeadowbrook";
import { parseBudget, buildHeuristicAnalysis } from "@/lib/budgetHeuristics";
import { advancedBudgetReviewWithOpenAI } from "@/lib/budgetScoring";

export const runtime = "nodejs";

function json(data: any) {
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("budget");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing 'budget' file upload." },
        { status: 400 }
      );
    }

    const filename = file.name.toLowerCase();

    // 🔐 Supabase auth
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    // 🧪 DEMO path: Meadowbrook sample
    if (filename.includes("meadowbrook")) {
      const demo = buildMeadowbrookDemoResponse();

      await supabase.from("budget_analyses").insert({
        user_id: user.id,
        city_name: demo.meta.cityName,
        fiscal_year: demo.meta.fiscalYear,
        health_score: demo.health.score,
        health_label: demo.health.label,
        is_demo: true,
        file_name: file.name,
        rows_analyzed: demo.meta.rowsAnalyzed,
        currency: demo.meta.currency,
        raw_result: demo,
      });

      return json(demo);
    }

    // 🧮 REAL path: parse + heuristics + GPT-5.1
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const rows = await parseBudget(buffer, file.name);
    const { metaPatch, departments, risks, scenarios } =
      buildHeuristicAnalysis(rows);

    const totalLatest = departments.reduce(
      (sum, d) => sum + (d.totalAmount || 0),
      0
    );

    // Advanced GPT review (multi-scenario, council prep)
    const advancedReview = await advancedBudgetReviewWithOpenAI({
      cityName: undefined,
      fiscalYear: undefined,
      totalBudgetAmount: totalLatest || undefined,
      risks,
      departments,
      scenarios,
    });

    // Map GPT health into your core BudgetHealth
    const health: BudgetHealth = {
      score: advancedReview.overallHealth.score,
      label: advancedReview.overallHealth.label,
      keyDrivers: advancedReview.overallHealth.keyDrivers,
    };

    const now = new Date().toISOString();

    const result: BudgetAnalysisResponse = {
      meta: {
        cityName: undefined,
        fiscalYear: undefined,
        currency: "USD",
        rowsAnalyzed: metaPatch.rowsAnalyzed ?? rows.length,
        generatedAt: now,
        demo: false,
      },
      health,
      risks,
      departments,
      scenarios,
      councilSummary: advancedReview.councilSummary.narrative,
      advancedReview,
    };

    // Persist full analysis
    const { error: insertError } = await supabase
      .from("budget_analyses")
      .insert({
        user_id: user.id,
        city_name: result.meta.cityName,
        fiscal_year: result.meta.fiscalYear,
        health_score: result.health.score,
        health_label: result.health.label,
        is_demo: false,
        file_name: file.name,
        rows_analyzed: result.meta.rowsAnalyzed,
        currency: result.meta.currency,
        raw_result: result,
      });

    if (insertError) {
      console.error("Error inserting budget_analyses:", insertError);
    }

    return json(result);
  } catch (err) {
    console.error("Error in /api/analyze:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}

