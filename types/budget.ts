export type RiskLevel = "low" | "medium" | "high";

export type BudgetHealthLabel = "strong" | "balanced" | "vulnerable" | "critical";

export interface BudgetRisk {
  id: string;
  label: string;
  category: string;        // "Efficiency", "Data quality", "Revenue", etc.
  department?: string;
  fund?: string;
  impact: string;          // human description
  estimatedAmount?: number;
  riskLevel: RiskLevel;
}

export interface DepartmentSummary {
  name: string;
  totalAmount: number;
  yoyChangePct: number;        // vs last year
  threeYearTrend?: "increasing" | "decreasing" | "stable";
  notes?: string;
}

export interface ScenarioSummary {
  name: string;                // e.g. "Revenue -5%"
  description: string;
  netImpactAmount: number;     // + / - total
  notes?: string;
}

export interface BudgetHealth {
  score: number;               // 0–100
  label: BudgetHealthLabel;
  keyDrivers: string[];        // ["High reliance on sales tax", ...]
}

export interface BudgetAnalysisMeta {
  cityName?: string;
  fiscalYear?: string;
  currency?: string;
  rowsAnalyzed: number;
  generatedAt: string;         // ISO
  demo: boolean;               // true for Meadowbrook
}

export interface AdvancedBudgetReview {
  overallHealth: {
    score: number;
    label: BudgetHealthLabel;
    keyDrivers: string[];
  };
  riskBuckets: {
    structural: string[];
    revenue: string[];
    expenditure: string[];
    dataQuality: string[];
  };
  multiScenarioReview: {
    baseCase: {
      summary: string;
      fiscalImpact: string;
    };
    scenarios: {
      name: string;
      summary: string;
      netImpactDescription: string;
      servicesImpact: string;
      recommendedActions: string[];
    }[];
  };
  councilSummary: {
    narrative: string;
    threeMinuteTalkingPoints: string[];
    likelyQuestionsFromCouncil: string[];
    suggestedResponses: string[];
  };
  cautionsAndOpportunities: {
    risksToWatchInNext12Months: string[];
    easyWinsWithinCurrentBudget: string[];
  };
}

export interface BudgetAnalysisResponse {
  meta: BudgetAnalysisMeta;
  health: BudgetHealth;
  risks: BudgetRisk[];
  departments: DepartmentSummary[];
  scenarios: ScenarioSummary[];
  councilSummary: string;
  // Optional enriched review from advanced GPT-5.1 call
  advancedReview?: AdvancedBudgetReview;
}

