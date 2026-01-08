import { NextRequest, NextResponse } from "next/server"

type UserRole = "agent" | "call_agent" | "supervisor" | "admin" | "analyst" | "back_office"

/**
 * Minimal authz guard for Back Office endpoints.
 *
 * - Allows internal calls when `x-internal-key` matches `BACKOFFICE_INTERNAL_KEY` (optional).
 * - Otherwise requires `x-user-role: back_office` (demo UI header).
 */
export function requireBackOffice(
  request: NextRequest,
): { ok: true; actorId: string } | { ok: false; res: NextResponse } {
  const internalKey = request.headers.get("x-internal-key")
  const expectedInternal = process.env.BACKOFFICE_INTERNAL_KEY

  if (expectedInternal && internalKey && internalKey === expectedInternal) {
    return { ok: true, actorId: "internal" }
  }

  const role = (request.headers.get("x-user-role") || "").toLowerCase() as UserRole
  if (!role) {
    return { ok: false, res: NextResponse.json({ error: "Missing x-user-role header" }, { status: 401 }) }
  }
  if (role !== "back_office" && role !== "admin") {
    return { ok: false, res: NextResponse.json({ error: "Insufficient permissions" }, { status: 403 }) }
  }

  return { ok: true, actorId: role }
}


