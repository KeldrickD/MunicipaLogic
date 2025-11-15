import Papa from "papaparse";
import * as XLSX from "xlsx";
import path from "path";
import type {
  BudgetRisk,
  DepartmentSummary,
  ScenarioSummary,
  BudgetAnalysisMeta,
} from "@/types/budget";

export interface RawBudgetRow {
  fiscalYear: string;
  fund?: string | null;
  department: string;
  amount: number;
  accountName?: string | null;
}

/**
 * Parse CSV / XLSX budget files into a normalized row shape.
 * This is intentionally heuristic-based to handle different city exports.
 */
export async function parseBudget(
  buffer: Buffer,
  filename: string
): Promise<RawBudgetRow[]> {
  const ext = path.extname(filename).toLowerCase();

  if (ext === ".csv") {
    return parseCsvBuffer(buffer);
  }

  if (ext === ".xlsx" || ext === ".xls") {
    return parseXlsxBuffer(buffer);
  }

  // Fallback: try CSV parsing anyway (some cities export ".txt" that is actually CSV)
  return parseCsvBuffer(buffer);
}

/* ----------------- Helpers: header normalization ----------------- */
function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function pickField(
  record: Record<string, any>,
  candidates: string[]
): any | undefined {
  const normalizedCandidates = candidates.map(normalizeKey);
  for (const [rawKey, value] of Object.entries(record)) {
    const nk = normalizeKey(rawKey);
    if (normalizedCandidates.includes(nk)) {
      return value;
    }
  }
  return undefined;
}

function toNumber(value: any): number | null {
  if (value == null) return null;
  if (typeof value === "number") {
    if (Number.isNaN(value)) return null;
    return value;
  }
  const s = String(value).replace(/,/g, "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

/* ----------------- CSV parsing ----------------- */
function parseCsvBuffer(buffer: Buffer): RawBudgetRow[] {
  const csvText = buffer.toString("utf8");
  const parsed = Papa.parse<Record<string, any>>(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if (parsed.errors.length) {
    console.warn("[parseBudget] CSV parse errors:", parsed.errors.slice(0, 3));
  }

  const rows: RawBudgetRow[] = [];
  for (const record of parsed.data) {
    const row = normalizeRecord(record);
    if (row) rows.push(row);
  }
  return rows;
}

/* ----------------- XLS/XLSX parsing ----------------- */
function parseXlsxBuffer(buffer: Buffer): RawBudgetRow[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];

  const worksheet = workbook.Sheets[sheetName];
  const json: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
    defval: null,
  });

  const rows: RawBudgetRow[] = [];
  for (const record of json) {
    const row = normalizeRecord(record);
    if (row) rows.push(row);
  }
  return rows;
}

/* ----------------- Record → RawBudgetRow normalization ----------------- */
function normalizeRecord(
  record: Record<string, any>
): RawBudgetRow | null {
  const fiscalYearRaw =
    pickField(record, [
      "FiscalYear",
      "Fiscal Year",
      "FY",
      "Year",
      "Budget Year",
      "FY_Year",
    ]) ?? pickField(record, ["FY23", "FY24", "FY25"]);

  if (!fiscalYearRaw) {
    return null;
  }

  const fiscalYear = String(fiscalYearRaw).trim();
  if (!fiscalYear) return null;

  const departmentRaw =
    pickField(record, [
      "Department",
      "Department Name",
      "Dept",
      "Dept Name",
      "Division",
      "Cost Center",
    ]) ?? "Unspecified";

  const department = String(departmentRaw).trim() || "Unspecified";

  const fundRaw = pickField(record, [
    "Fund",
    "Fund Name",
    "Fund Description",
  ]);

  const fund = fundRaw != null ? String(fundRaw).trim() : null;

  const accountNameRaw =
    pickField(record, [
      "Account Name",
      "Account",
      "Account Description",
      "Line Item",
      "Description",
      "Object",
    ]) ?? null;

  const accountName =
    accountNameRaw != null ? String(accountNameRaw).trim() : null;

  const amountRaw =
    pickField(record, [
      "Amount",
      "Adopted",
      "Adopted Budget",
      "Budget",
      "Current Budget",
      "Original Budget",
      "Total",
      "FY Amount",
      "FY Total",
    ]) ?? null;

  const amount = toNumber(amountRaw);
  if (amount === null) {
    return null;
  }

  if (amount === 0) {
    return null;
  }

  return {
    fiscalYear,
    fund,
    department,
    amount,
    accountName,
  };
}

/**
 * Build numeric heuristics from parsed rows:
 * - Department totals (latest FY) and YoY change
 * - Simple high-level risks
 * - Basic scenarios
 */
export function buildHeuristicAnalysis(rows: RawBudgetRow[]): {
  metaPatch: Partial<BudgetAnalysisMeta>;
  departments: DepartmentSummary[];
  risks: BudgetRisk[];
  scenarios: ScenarioSummary[];
} {
  if (!rows.length) {
    return {
      metaPatch: {
        rowsAnalyzed: 0,
      },
      departments: [],
      risks: [],
      scenarios: [],
    };
  }

  // Determine latest fiscal year
  const years = Array.from(new Set(rows.map((r) => r.fiscalYear))).sort();
  const latestYear = years[years.length - 1];
  const previousYear = years.length > 1 ? years[years.length - 2] : undefined;

  // Aggregate department totals by year
  const byDeptYear = new Map<
    string,
    { [year: string]: number }
  >();

  for (const row of rows) {
    const dept = row.department || "Unspecified";
    if (!byDeptYear.has(dept)) byDeptYear.set(dept, {});
    const entry = byDeptYear.get(dept)!;
    entry[row.fiscalYear] = (entry[row.fiscalYear] || 0) + row.amount;
  }

  const departments: DepartmentSummary[] = [];
  let totalLatest = 0;

  for (const [dept, yearMap] of byDeptYear.entries()) {
    const latestTotal = yearMap[latestYear] || 0;
    totalLatest += latestTotal;

    let yoyChangePct = 0;
    let notes: string | undefined;

    if (previousYear && yearMap[previousYear] !== undefined) {
      const prev = yearMap[previousYear];
      if (prev !== 0) {
        yoyChangePct = ((latestTotal - prev) / Math.abs(prev)) * 100;
      } else if (latestTotal !== 0) {
        yoyChangePct = 100;
      }

      if (yoyChangePct > 10) {
        notes = "Spending is rising faster than the prior year.";
      } else if (yoyChangePct < -5) {
        notes = "Spending is declining versus the prior year.";
      }
    }

    departments.push({
      name: dept,
      totalAmount: latestTotal,
      yoyChangePct,
      notes,
    });
  }

  // Simple risks based on heuristics
  const risks: BudgetRisk[] = [];
  let riskId = 1;

  // 1) Departments with large YoY increases
  const highGrowth = departments.filter((d) => d.yoyChangePct > 10);
  for (const d of highGrowth) {
    risks.push({
      id: `risk-${riskId++}`,
      label: "Rapid spending growth",
      category: "Expenditure",
      department: d.name,
      impact: `Spending in ${d.name} is up ${d.yoyChangePct.toFixed(
        1
      )}% year-over-year. Consider whether this growth is intentional and sustainable.`,
      riskLevel: "medium",
    });
  }

  // 2) Departments with large YoY decreases
  const largeCuts = departments.filter((d) => d.yoyChangePct < -5);
  for (const d of largeCuts) {
    risks.push({
      id: `risk-${riskId++}`,
      label: "Significant spending reduction",
      category: "Expenditure",
      department: d.name,
      impact: `Spending in ${d.name} is down ${d.yoyChangePct.toFixed(
        1
      )}% year-over-year. Ensure service levels are not being unintentionally impacted.`,
      riskLevel: "medium",
    });
  }

  // Simple scenarios (placeholder – can be made more sophisticated)
  const scenarios: ScenarioSummary[] = [
    {
      name: "Maintain current plan",
      description:
        "Assumes the current budget is adopted without major changes. Focuses on monitoring high-growth departments and confirming intentional policy choices.",
      netImpactAmount: 0,
      notes:
        "Use this as a baseline for comparing any adjustments discussed with council.",
    },
  ];

  if (totalLatest > 0) {
    scenarios.push({
      name: "Hold non-safety departments flat",
      description:
        "Freeze year-over-year growth for non-safety departments while preserving planned increases for police, fire, and EMS.",
      netImpactAmount: Math.round(totalLatest * -0.02), // e.g., 2% savings
      notes:
        "This scenario can create modest savings without touching core public safety staffing, but may reduce capacity in support functions.",
    });
  }

  return {
    metaPatch: {
      rowsAnalyzed: rows.length,
    },
    departments,
    risks,
    scenarios,
  };
}

