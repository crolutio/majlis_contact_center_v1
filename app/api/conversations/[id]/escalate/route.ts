import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

/**
 * POST /api/conversations/[id]/escalate
 * Escalate a conversation using server credentials (bypasses RLS)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const id = resolvedParams?.id
    if (!id) {
      return NextResponse.json({ error: "Conversation ID required" }, { status: 400 })
    }

    // Update conversations table
    const { error: convError } = await supabaseServer
      .from("conversations")
      .update({
        status: "escalated",
        escalation_risk: true,
        priority: "high",
        handling_mode: "human",
        handover_required: true,
      })
      .eq("id", id)

    if (convError) {
      return NextResponse.json({ error: convError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to escalate" }, { status: 500 })
  }
}
