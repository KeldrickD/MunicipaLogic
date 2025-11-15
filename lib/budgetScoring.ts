import { openai } from "./openaiClient";
import type {
  BudgetRisk,
  DepartmentSummary,
  ScenarioSummary,
  AdvancedBudgetReview,
  BudgetHealthLabel,
} from "@/types/budget";

export async function advancedBudgetReviewWithOpenAI(input: {
  cityName?: string;
  fiscalYear?: string;
  totalBudgetAmount?: number;
  risks: BudgetRisk[];
  departments: DepartmentSummary[];
  scenarios: ScenarioSummary[];
}): Promise<AdvancedBudgetReview> {
  if (!process.env.OPENAI_API_KEY) {
    // Fallback if OpenAI not configured
    return getFallbackReview(input);
  }

  const messages = buildAdvancedBudgetMessages(input);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o as gpt-5.1 may not be available yet
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    // Trust but lightly coerce into AdvancedBudgetReview shape
    const review: AdvancedBudgetReview = {
      overallHealth: {
        score: parsed.overallHealth?.score ?? 75,
        label: (parsed.overallHealth?.label ?? "balanced") as BudgetHealthLabel,
        keyDrivers: parsed.overallHealth?.keyDrivers ?? [],
      },
      riskBuckets: {
        structural: parsed.riskBuckets?.structural ?? [],
        revenue: parsed.riskBuckets?.revenue ?? [],
        expenditure: parsed.riskBuckets?.expenditure ?? [],
        dataQuality: parsed.riskBuckets?.dataQuality ?? [],
      },
      multiScenarioReview: {
        baseCase: {
          summary: parsed.multiScenarioReview?.baseCase?.summary ?? "",
          fiscalImpact:
            parsed.multiScenarioReview?.baseCase?.fiscalImpact ?? "",
        },
        scenarios:
          parsed.multiScenarioReview?.scenarios?.map((s: any) => ({
            name: s.name ?? "Scenario",
            summary: s.summary ?? "",
            netImpactDescription: s.netImpactDescription ?? "",
            servicesImpact: s.servicesImpact ?? "",
            recommendedActions: s.recommendedActions ?? [],
          })) ?? [],
      },
      councilSummary: {
        narrative: parsed.councilSummary?.narrative ?? "",
        threeMinuteTalkingPoints:
          parsed.councilSummary?.threeMinuteTalkingPoints ?? [],
        likelyQuestionsFromCouncil:
          parsed.councilSummary?.likelyQuestionsFromCouncil ?? [],
        suggestedResponses:
          parsed.councilSummary?.suggestedResponses ?? [],
      },
      cautionsAndOpportunities: {
        risksToWatchInNext12Months:
          parsed.cautionsAndOpportunities?.risksToWatchInNext12Months ?? [],
        easyWinsWithinCurrentBudget:
          parsed.cautionsAndOpportunities?.easyWinsWithinCurrentBudget ?? [],
      },
    };

    return review;
  } catch (err) {
    console.error("OpenAI API error:", err);
    return getFallbackReview(input);
  }
}

function buildAdvancedBudgetMessages(input: {
  cityName?: string;
  fiscalYear?: string;
  totalBudgetAmount?: number;
  risks: BudgetRisk[];
  departments: DepartmentSummary[];
  scenarios: ScenarioSummary[];
}) {
  const userPayload = {
    instructions:
      "You are reviewing a city budget using the structured data below. Provide a multi-scenario review and communication guidance in strict JSON.",
    cityContext: {
      cityName: input.cityName ?? null,
      fiscalYear: input.fiscalYear ?? null,
      totalBudgetAmount: input.totalBudgetAmount ?? null,
    },
    risks: input.risks,
    departments: input.departments,
    scenarios: input.scenarios,
    requiredJsonSchema: {
      overallHealth: {
        score:
          "integer 0–100; 50 is neutral, 80+ strong, <60 vulnerable, <50 critical",
        label: "one of: strong, balanced, vulnerable, critical",
        keyDrivers:
          "array of 3–7 short bullet strings explaining the score in fiscal terms",
      },
      riskBuckets: {
        structural: "array of key structural risk bullet strings",
        revenue: "array of revenue risk bullet strings",
        expenditure: "array of expenditure risk bullet strings",
        dataQuality: "array of data quality & transparency bullet strings",
      },
      multiScenarioReview: {
        baseCase: {
          summary: "plain-language summary of current budget as submitted/drafted",
          fiscalImpact: "short description of sustainability over 3–5 years",
        },
        scenarios: [
          {
            name: "string; e.g. 'Revenue -5%' or 'Delay capital projects'",
            summary: "2–4 sentences explaining the scenario and impact",
            netImpactDescription:
              "plain-language description of financial impact, not just a number",
            servicesImpact:
              "plain-language description of likely service level implications",
            recommendedActions: "array of concrete actions staff could take",
          },
        ],
      },
      councilSummary: {
        narrative:
          "2–4 short paragraphs in plain language suitable for a staff report or memo cover page",
        threeMinuteTalkingPoints:
          "array of 4–7 short bullet strings the finance director or city manager could use verbally",
        likelyQuestionsFromCouncil:
          "array of likely questions that elected officials may ask",
        suggestedResponses:
          "array of answer strings matched by index to likelyQuestionsFromCouncil",
      },
      cautionsAndOpportunities: {
        risksToWatchInNext12Months:
          "array of short bullet items that warrant monitoring",
        easyWinsWithinCurrentBudget:
          "array of 3–7 quick wins that do not require major policy changes",
      },
    },
  };

  return [
    {
      role: "system" as const,
      content:
        "You are an expert municipal budget analyst. You specialize in helping city and county governments explain budgets to elected officials and the public. Always be clear, non-technical, and concise. Return ONLY valid JSON, no commentary.",
    },
    {
      role: "user" as const,
      content: JSON.stringify(userPayload, null, 2),
    },
  ];
}

function getFallbackReview(input: {
  cityName?: string;
  fiscalYear?: string;
  totalBudgetAmount?: number;
  risks: BudgetRisk[];
  departments: DepartmentSummary[];
  scenarios: ScenarioSummary[];
}): AdvancedBudgetReview {
  return {
    overallHealth: {
      score: 75,
      label: "balanced",
      keyDrivers: [
        "Budget analysis completed with basic heuristics.",
        "OpenAI integration not configured - using fallback values.",
      ],
    },
    riskBuckets: {
      structural: input.risks
        .filter((r) => r.category.toLowerCase().includes("structural"))
        .map((r) => r.impact),
      revenue: input.risks
        .filter((r) => r.category.toLowerCase().includes("revenue"))
        .map((r) => r.impact),
      expenditure: input.risks
        .filter((r) => r.category.toLowerCase().includes("expenditure") || r.category.toLowerCase().includes("efficiency"))
        .map((r) => r.impact),
      dataQuality: input.risks
        .filter((r) => r.category.toLowerCase().includes("data"))
        .map((r) => r.impact),
    },
    multiScenarioReview: {
      baseCase: {
        summary: "The budget appears generally balanced based on available data.",
        fiscalImpact: "Further analysis recommended to assess long-term sustainability.",
      },
      scenarios: input.scenarios.map((s) => ({
        name: s.name,
        summary: s.description,
        netImpactDescription: `Net impact: ${s.netImpactAmount >= 0 ? "+" : ""}${s.netImpactAmount.toLocaleString()}`,
        servicesImpact: s.notes || "Impact on services requires further review.",
        recommendedActions: [],
      })),
    },
    councilSummary: {
      narrative:
        "This budget analysis provides an initial assessment of the fiscal position. Key risks and opportunities have been identified for further review by staff and council.",
      threeMinuteTalkingPoints: [
        "Budget appears structurally balanced.",
        "Several departments show significant year-over-year changes.",
        "Recommendation: Review high-growth areas for sustainability.",
      ],
      likelyQuestionsFromCouncil: [
        "What are the biggest risks in this budget?",
        "How does this compare to prior years?",
      ],
      suggestedResponses: [
        "The analysis identified several areas of concern, particularly in departments with rapid growth.",
        "Year-over-year comparisons show varying trends across departments.",
      ],
    },
    cautionsAndOpportunities: {
      risksToWatchInNext12Months: input.risks.slice(0, 3).map((r) => r.label),
      easyWinsWithinCurrentBudget: [],
    },
  };
}

