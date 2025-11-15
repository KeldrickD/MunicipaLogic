import { NextRequest, NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const { email, role, city, state, notes } = body as {
      email: string;
      role?: string;
      city?: string;
      state?: string;
      notes?: string;
    };

    const userAgent = req.headers.get("user-agent") ?? null;
    const referer = req.headers.get("referer") ?? null;

    // If Supabase is not configured, just log and return success for development
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log("Pilot request (Supabase not configured):", {
        email,
        role,
        city,
        state,
        notes,
        userAgent,
        referer,
      });
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabaseAdmin.from("pilot_requests").insert({
      email,
      role: role || null,
      city: city || null,
      state: state || null,
      notes: notes || null,
      user_agent: userAgent,
      referer,
    });

    if (error) {
      console.error("Error inserting pilot_request:", error);
      return NextResponse.json(
        { error: "Failed to save pilot request." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Unexpected error in /api/pilot:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}

