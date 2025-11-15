import type {
  BudgetAnalysisResponse,
  BudgetHealth,
  BudgetRisk,
  DepartmentSummary,
  ScenarioSummary,
} from "@/types/budget";

export function buildMeadowbrookDemoResponse(): BudgetAnalysisResponse {
  const health: BudgetHealth = {
    score: 87,
    label: "balanced",
    keyDrivers: [
      "Moderate revenue diversification",
      "Fleet maintenance overspend vs. history",
      "Exposure to a 5% sales tax decline",
    ],
  };

  const risks: BudgetRisk[] = [
    {
      id: "fleet-overspend",
      label: "Fleet maintenance overspend",
      category: "Efficiency",
      department: "Public Works",
      impact: "$412,000 above historical trend in FY25",
      estimatedAmount: 412000,
      riskLevel: "medium",
      fund: "General Fund",
    },
    {
      id: "duplicate-line-items",
      label: "Duplicate line items detected",
      category: "Data quality",
      department: "IT Services",
      impact:
        "7 software subscription line items appear to represent overlapping or duplicate services.",
      estimatedAmount: 98000,
      riskLevel: "medium",
      fund: "General Fund",
    },
    {
      id: "revenue-sensitivity",
      label: "Revenue sensitivity at −5%",
      category: "Revenue",
      department: undefined,
      impact:
        "At a 5% decline in major tax revenues, non-essential services would require targeted reductions to maintain balance.",
      estimatedAmount: 650000,
      riskLevel: "high",
      fund: "All governmental funds",
    },
  ];

  const departments: DepartmentSummary[] = [
    {
      name: "Public Works",
      totalAmount: 8450000,
      yoyChangePct: 6.8,
      threeYearTrend: "increasing",
      notes: "Fleet and street maintenance drive most of the increase.",
    },
    {
      name: "Police",
      totalAmount: 12750000,
      yoyChangePct: 3.2,
      threeYearTrend: "increasing",
    },
    {
      name: "Fire",
      totalAmount: 9100000,
      yoyChangePct: 2.9,
      threeYearTrend: "increasing",
    },
    {
      name: "Parks & Recreation",
      totalAmount: 3550000,
      yoyChangePct: 1.1,
      threeYearTrend: "stable",
    },
    {
      name: "IT Services",
      totalAmount: 2150000,
      yoyChangePct: 9.4,
      threeYearTrend: "increasing",
      notes: "Growth concentrated in software and cloud services.",
    },
  ];

  const scenarios: ScenarioSummary[] = [
    {
      name: "Revenue -5%",
      description:
        "Models a 5% decline in major tax revenues with targeted reductions in non-essential services.",
      netImpactAmount: -650000,
      notes:
        "Balanced primarily through delays in non-critical capital projects and reductions in discretionary spending.",
    },
    {
      name: "Reallocate 2% from under-utilized line items",
      description:
        "Redirects funding from low-utilization accounts to core infrastructure and public safety.",
      netImpactAmount: 380000,
      notes:
        "Fully funds the prioritized street resurfacing program while maintaining structural balance.",
    },
  ];

  const councilSummary =
    "The FY25 draft budget for the City of Meadowbrook is structurally balanced but moderately exposed to revenue volatility. A small number of line items—primarily in fleet maintenance and IT subscriptions—are driving outsized growth compared to history. Redirecting approximately 1.8–2.0% of spending from under-utilized or duplicative accounts is sufficient to fully fund the proposed infrastructure priorities while preserving services. Under a 5% revenue decline scenario, targeted reductions in non-essential spending maintain balance without impacting core public safety.";

  return {
    meta: {
      cityName: "Meadowbrook",
      fiscalYear: "FY25",
      currency: "USD",
      rowsAnalyzed: 250,
      generatedAt: new Date().toISOString(),
      demo: true,
    },
    health,
    risks,
    departments,
    scenarios,
    councilSummary,
  };
}

