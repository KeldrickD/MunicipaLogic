import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { BudgetAnalysisResponse } from "@/types/budget";
import { AnalysisView } from "@/components/AnalysisView";

type Params = {
  id: string;
};

export default async function AnalysisDetailPage({
  params,
}: {
  params: Params;
}) {
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

  const { data: session } = await supabase.auth.getUser();

  if (!session?.user) {
    notFound();
  }

  const { data, error } = await supabase
    .from("budget_analyses")
    .select("id, city_name, fiscal_year, created_at, file_name, raw_result")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const result = data.raw_result as BudgetAnalysisResponse;
  const createdAt = new Date(data.created_at);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs text-soft-slate/60">
          Budget analysis · {createdAt.toLocaleString()}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-soft-slate sm:text-3xl">
          {data.city_name || data.file_name || "Budget analysis"}
        </h1>
        <p className="text-xs text-soft-slate/60">
          {data.fiscal_year || "Fiscal year —"}
        </p>
      </header>

      <AnalysisView result={result} />
    </div>
  );
}

