import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { requireBackOffice } from "@/lib/back-office/api-auth"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const perm = requireBackOffice(request)
  if (!perm.ok) return perm.res

  const { id } = await context.params

  const { data, error } = await supabaseServer
    .from("cc_cases")
    .select("id,type,status,priority,bank_customer_id,conversation_id,case_number,description,amount,currency,created_at,updated_at,resolved_at,resolved_by")
    .eq("id", id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { data: assignments } = await supabaseServer
    .from("cc_assignments")
    .select("id,case_id,queue_name,assigned_to,assigned_at,accepted_at,resolved_at,sla_due_at,created_at")
    .eq("case_id", id)
    .order("created_at", { ascending: false })
    .limit(1)

  return NextResponse.json({ success: true, case: data, assignment: assignments?.[0] || null })
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const perm = requireBackOffice(request)
  if (!perm.ok) return perm.res

  const { id } = await context.params
  const body = await request.json().catch(() => ({}))

  const status = typeof body?.status === "string" ? body.status : undefined
  const priority = typeof body?.priority === "string" ? body.priority : undefined
  const description = typeof body?.description === "string" ? body.description : undefined

  const queue_name = typeof body?.queue_name === "string" ? body.queue_name.trim() : ""
  const sla_due_at = typeof body?.sla_due_at === "string" ? body.sla_due_at : undefined

  // Update core case fields (case-driven workflow)
  const patch: any = {}
  if (status) patch.status = status
  if (priority) patch.priority = priority
  if (description !== undefined) patch.description = description

  if (Object.keys(patch).length > 0) {
    const { error } = await supabaseServer.from("cc_cases").update(patch).eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Insert a new assignment record when queue/sla changes (preserves history)
  if (queue_name) {
    const { error: aErr } = await supabaseServer.from("cc_assignments").insert({
      case_id: id,
      queue_name,
      sla_due_at: sla_due_at || null,
    })
    if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}


