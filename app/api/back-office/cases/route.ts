import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { requireBackOffice } from "@/lib/back-office/api-auth"

type CaseRow = {
  id: string
  type: string
  status: string
  priority: string
  case_number: string | null
  description: string | null
  amount: number | null
  currency: string | null
  bank_customer_id: string | null
  conversation_id: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
}

type AssignmentRow = {
  id: string
  case_id: string | null
  queue_name: string
  assigned_to: string | null
  assigned_at: string | null
  accepted_at: string | null
  resolved_at: string | null
  sla_due_at: string | null
  created_at: string
}

export async function GET(request: NextRequest) {
  const perm = requireBackOffice(request)
  if (!perm.ok) return perm.res

  const url = new URL(request.url)
  const status = url.searchParams.get("status")
  const priority = url.searchParams.get("priority")
  const type = url.searchParams.get("type")
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100", 10) || 100, 200)

  let q = supabaseServer
    .from("cc_cases")
    .select(
      "id,type,status,priority,bank_customer_id,conversation_id,case_number,description,amount,currency,created_at,updated_at,resolved_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit)

  if (status) q = q.eq("status", status)
  if (priority) q = q.eq("priority", priority)
  if (type) q = q.eq("type", type)

  const { data: cases, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const caseIds = (cases || []).map((c: any) => c.id).filter(Boolean)

  // Attach latest assignment (task queue + SLA) for each case.
  let assignmentByCaseId: Record<string, AssignmentRow> = {}
  if (caseIds.length > 0) {
    const { data: assignments, error: aErr } = await supabaseServer
      .from("cc_assignments")
      .select("id,case_id,queue_name,assigned_to,assigned_at,accepted_at,resolved_at,sla_due_at,created_at")
      .in("case_id", caseIds)
      .order("created_at", { ascending: false })
      .limit(500)

    if (!aErr && assignments) {
      for (const a of assignments as any[]) {
        const cid = a.case_id as string | null
        if (!cid) continue
        if (!assignmentByCaseId[cid]) assignmentByCaseId[cid] = a as AssignmentRow
      }
    }
  }

  return NextResponse.json({
    success: true,
    cases: (cases || []).map((c: any) => ({
      ...(c as CaseRow),
      assignment: assignmentByCaseId[c.id] || null,
    })),
  })
}


