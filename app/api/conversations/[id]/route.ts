import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getConversation } from "@/lib/supabase-store"

/**
 * GET /api/conversations/[id]
 * Fetch conversation details with messages
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle Next.js 15+ async params (params can be Promise or object)
    const resolvedParams = params instanceof Promise ? await params : params
    const id = resolvedParams?.id
    if (!id) {
      return NextResponse.json({ error: "Conversation ID required" }, { status: 400 })
    }

    const conversation = await getConversation(id)

    if (!conversation) {
      // Debug: check if conversation exists in either table
      const { data: regCheck } = await supabaseServer
        .from("conversations")
        .select("id")
        .eq("id", id)
        .maybeSingle()

      console.error("[conversations/[id]] Conversation not found:", { 
        id, 
        exists_in_conversations: !!regCheck 
      })
      return NextResponse.json({ 
        error: "Conversation not found",
        debug: {
          id,
          exists_in_conversations: !!regCheck
        }
      }, { status: 404 })
    }

    return NextResponse.json({ conversation })
  } catch (e: any) {
    console.error("[conversations/[id]] Error:", e)
    return NextResponse.json({ error: e?.message || "Failed to fetch conversation" }, { status: 500 })
  }
}
