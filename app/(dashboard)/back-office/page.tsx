"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { BackOfficeDashboard } from "@/components/back-office/back-office-dashboard"

export default function BackOfficePage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])

  if (!user) return null

  if (user.role === "back_office") {
    return <BackOfficeDashboard />
  }

  return (
    <div className="h-full p-6">
      <Card className="p-4">
        <div className="font-medium">Back Office</div>
        <div className="text-sm text-muted-foreground mt-1">
          Your role (<span className="font-mono">{user.role}</span>) does not have access to Back Office.
        </div>
      </Card>
    </div>
  )
}


