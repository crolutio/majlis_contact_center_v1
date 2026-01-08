"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, RefreshCw, AlertTriangle, Clock, CheckCircle2, Wrench, ShieldCheck } from "lucide-react"

type Assignment = {
  queue_name: string
  sla_due_at: string | null
  assigned_at: string | null
}

type CaseRow = {
  id: string
  type: string
  status: string
  priority: string
  case_number: string | null
  description: string | null
  amount: number | null
  currency: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  assignment: Assignment | null
}

function minutesUntil(ts: string | null): number | null {
  if (!ts) return null
  const ms = new Date(ts).getTime() - Date.now()
  if (Number.isNaN(ms)) return null
  return Math.floor(ms / 60000)
}

function formatDue(ts: string | null): string {
  if (!ts) return "—"
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString()
}

function defaultSlaMinutes(priority: string): number {
  switch (priority) {
    case "urgent":
      return 120
    case "high":
      return 8 * 60
    case "medium":
      return 24 * 60
    case "low":
      return 72 * 60
    default:
      return 24 * 60
  }
}

async function apiGet<T>(path: string, role: string | undefined): Promise<T> {
  const res = await fetch(path, {
    headers: { "x-user-role": role || "" },
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return (await res.json()) as T
}

async function apiPatch<T>(path: string, role: string | undefined, body: any): Promise<T> {
  const res = await fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-user-role": role || "" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return (await res.json()) as T
}

export function BackOfficeDashboard() {
  const { user } = useAuth()
  const role = user?.role

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cases, setCases] = useState<CaseRow[]>([])

  const [q, setQ] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [priority, setPriority] = useState<string>("all")
  const [queue, setQueue] = useState<string>("all")

  const [activeCase, setActiveCase] = useState<CaseRow | null>(null)
  const [actionStatus, setActionStatus] = useState<"triage" | "in_progress" | "waiting_customer" | "resolved" | "closed">(
    "triage",
  )
  const [actionQueue, setActionQueue] = useState<string>("BackOffice-General")
  const [actionNotes, setActionNotes] = useState<string>("")
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (status !== "all") params.set("status", status)
      if (priority !== "all") params.set("priority", priority)
      const res = await apiGet<{ success: boolean; cases: CaseRow[] }>(`/api/back-office/cases?${params.toString()}`, role)
      setCases(res.cases || [])
    } catch (e: any) {
      setError(e?.message || "Failed to load cases")
      setCases([])
    } finally {
      setLoading(false)
    }
  }, [priority, role, status])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return cases.filter((c) => {
      if (queue !== "all" && (c.assignment?.queue_name || "Unassigned") !== queue) return false
      if (!needle) return true
      const hay = [
        c.case_number || "",
        c.type || "",
        c.status || "",
        c.priority || "",
        c.description || "",
        c.assignment?.queue_name || "",
      ]
        .join(" ")
        .toLowerCase()
      return hay.includes(needle)
    })
  }, [cases, q, queue])

  const queues = useMemo(() => {
    const set = new Set<string>()
    for (const c of cases) set.add(c.assignment?.queue_name || "Unassigned")
    return Array.from(set).sort()
  }, [cases])

  const kpis = useMemo(() => {
    const open = filtered.filter((c) => !["resolved", "closed"].includes(c.status)).length
    const overdue = filtered.filter((c) => {
      const m = minutesUntil(c.assignment?.sla_due_at || null)
      return m != null && m < 0 && !["resolved", "closed"].includes(c.status)
    }).length
    const dueSoon = filtered.filter((c) => {
      const m = minutesUntil(c.assignment?.sla_due_at || null)
      return m != null && m >= 0 && m <= 120 && !["resolved", "closed"].includes(c.status)
    }).length
    return { open, overdue, dueSoon }
  }, [filtered])

  const openCase = (c: CaseRow) => {
    setActiveCase(c)
    setActionStatus((c.status as any) || "triage")
    setActionQueue(c.assignment?.queue_name || "BackOffice-General")
    setActionNotes("")
  }

  const applyAction = async () => {
    if (!activeCase) return
    setSaving(true)
    try {
      const slaDue = (() => {
        const mins = defaultSlaMinutes(activeCase.priority)
        return new Date(Date.now() + mins * 60_000).toISOString()
      })()

      // Case-driven: update status; and insert task assignment row with queue + SLA.
      await apiPatch<{ success: boolean }>(`/api/back-office/cases/${activeCase.id}`, role, {
        status: actionStatus,
        queue_name: actionQueue,
        sla_due_at: slaDue,
        // Optional: store notes in description append (minimal; replace with case_notes table later)
        description:
          actionNotes.trim().length > 0
            ? `${activeCase.description || ""}\n\n[BackOffice note @ ${new Date().toISOString()}]\n${actionNotes.trim()}`
            : undefined,
      })

      await load()
      setActiveCase(null)
    } catch (e: any) {
      setError(e?.message || "Failed to update case")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Back Office</h1>
          <p className="text-sm text-muted-foreground">
            Case-driven operational processing (refunds, verification, account changes). No live queues.
          </p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {error ? (
        <Card className="border-destructive/40">
          <CardContent className="py-4 text-sm text-destructive whitespace-pre-wrap">{error}</CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Open tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{kpis.open}</div>
            <div className="text-xs text-muted-foreground">Not resolved/closed</div>
          </CardContent>
        </Card>
        <Card className={kpis.dueSoon > 0 ? "border-amber-300" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              Due soon (≤ 2h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{kpis.dueSoon}</div>
            <div className="text-xs text-muted-foreground">Based on assignment SLA</div>
          </CardContent>
        </Card>
        <Card className={kpis.overdue > 0 ? "border-destructive/40" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{kpis.overdue}</div>
            <div className="text-xs text-muted-foreground">SLA passed</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Case queue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 md:grid-cols-[1fr_180px_180px_220px]">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search case #, type, status, notes..." />

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="triage">Triage</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="waiting_customer">Waiting customer</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={queue} onValueChange={setQueue}>
              <SelectTrigger>
                <SelectValue placeholder="Queue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All queues</SelectItem>
                {queues.map((qName) => (
                  <SelectItem key={qName} value={qName}>
                    {qName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <div className="grid grid-cols-[140px_140px_120px_140px_1fr_210px] gap-0 bg-muted/40 text-xs font-medium text-muted-foreground px-3 py-2">
              <div>Case</div>
              <div>Type</div>
              <div>Priority</div>
              <div>Status</div>
              <div>Queue</div>
              <div>SLA due</div>
            </div>
            {loading ? (
              <div className="p-4 text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No cases found.</div>
            ) : (
              <div>
                {filtered.map((c) => {
                  const mins = minutesUntil(c.assignment?.sla_due_at || null)
                  const overdue = mins != null && mins < 0 && !["resolved", "closed"].includes(c.status)
                  const dueSoon = mins != null && mins >= 0 && mins <= 120 && !["resolved", "closed"].includes(c.status)
                  return (
                    <button
                      key={c.id}
                      onClick={() => openCase(c)}
                      className="w-full text-left grid grid-cols-[140px_140px_120px_140px_1fr_210px] gap-0 px-3 py-2 border-t hover:bg-muted/20"
                    >
                      <div className="font-mono text-xs">{c.case_number || c.id.slice(0, 8)}</div>
                      <div className="text-sm">{c.type}</div>
                      <div>
                        <Badge
                          variant={c.priority === "urgent" ? "destructive" : c.priority === "high" ? "secondary" : "outline"}
                        >
                          {c.priority}
                        </Badge>
                      </div>
                      <div>
                        <Badge variant="outline">{c.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{c.assignment?.queue_name || "Unassigned"}</div>
                      <div className="text-sm">
                        <span className={overdue ? "text-destructive" : dueSoon ? "text-amber-700" : ""}>
                          {formatDue(c.assignment?.sla_due_at || null)}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!activeCase} onOpenChange={(o) => !o && setActiveCase(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Case actions</DialogTitle>
          </DialogHeader>
          {activeCase ? (
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{activeCase.type}</Badge>
                  <Badge variant="outline">{activeCase.status}</Badge>
                  <Badge
                    variant={
                      activeCase.priority === "urgent" ? "destructive" : activeCase.priority === "high" ? "secondary" : "outline"
                    }
                  >
                    {activeCase.priority}
                  </Badge>
                  <span className="text-sm font-semibold">{activeCase.case_number || activeCase.id}</span>
                </div>
                {activeCase.description ? (
                  <div className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{activeCase.description}</div>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={actionStatus} onValueChange={(v) => setActionStatus(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="triage">Triage</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="waiting_customer">Waiting customer</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-muted-foreground">This is case-driven, independent of live conversations.</div>
                </div>

                <div className="space-y-2">
                  <Label>Task queue</Label>
                  <Input value={actionQueue} onChange={(e) => setActionQueue(e.target.value)} placeholder="BackOffice-General" />
                  <div className="text-xs text-muted-foreground">
                    Saved into <span className="font-mono">cc_assignments.queue_name</span> for separate task queues + SLA.
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes (internal)</Label>
                <Textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="e.g., Verified documents, processed refund approval, pending customer confirmation..."
                  className="min-h-[110px]"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="text-xs text-muted-foreground">
                  Default SLA applied based on priority when you click “Apply changes”.
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-transparent" onClick={() => setActiveCase(null)} disabled={saving}>
                    Cancel
                  </Button>
                  <Button onClick={applyAction} disabled={saving || !actionQueue.trim()}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                    Apply changes
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}


