"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Users, User, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminDashboard } from "@/components/back-office/admin-dashboard"
import { SupervisorDashboard } from "@/components/back-office/supervisor-dashboard"
import { AgentBackOffice } from "@/components/back-office/agent-back-office"

interface BackOfficeModuleProps {
  selectedRole: "admin" | "supervisor" | "agent" | null
  onSelectRole: (role: "admin" | "supervisor" | "agent") => void
  onBackToLanding: () => void
}

export function BackOfficeModule({ selectedRole, onSelectRole, onBackToLanding }: BackOfficeModuleProps) {
  const [showDashboard, setShowDashboard] = useState(false)

  const handleSelectRole = (role: "admin" | "supervisor" | "agent") => {
    onSelectRole(role)
    setShowDashboard(true)
  }

  const handleBackToRoleSelection = () => {
    setShowDashboard(false)
  }

  if (showDashboard && selectedRole) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="flex items-center gap-4 px-6 py-3">
            <Button variant="ghost" size="sm" onClick={handleBackToRoleSelection}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change Role
            </Button>
            <div className="h-4 w-px bg-border" />
            <Button variant="ghost" size="sm" onClick={onBackToLanding}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Main Menu
            </Button>
            <div className="flex-1" />
            <span className="text-sm text-muted-foreground">
              Logged in as: <span className="font-medium text-foreground capitalize">{selectedRole}</span>
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedRole === "admin" && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminDashboard />
            </motion.div>
          )}
          {selectedRole === "supervisor" && (
            <motion.div key="supervisor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SupervisorDashboard />
            </motion.div>
          )}
          {selectedRole === "agent" && (
            <motion.div key="agent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AgentBackOffice />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="max-w-6xl w-full">
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={onBackToLanding}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Main Menu
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 text-foreground">Back Office</h1>
          <p className="text-lg text-muted-foreground">Select your role to access the appropriate dashboard</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer hover:border-primary transition-all duration-200 group hover:shadow-lg"
            onClick={() => handleSelectRole("admin")}
          >
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                <Shield className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-foreground">Admin</h2>
              <p className="text-muted-foreground">Strategic dashboards, ROI analysis, and capacity planning</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-all duration-200 group hover:shadow-lg"
            onClick={() => handleSelectRole("supervisor")}
          >
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                <Users className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-foreground">Supervisor</h2>
              <p className="text-muted-foreground">Real-time monitoring, agent oversight, and quality assurance</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-all duration-200 group hover:shadow-lg"
            onClick={() => handleSelectRole("agent")}
          >
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <User className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-foreground">Agent</h2>
              <p className="text-muted-foreground">Personal performance, customer search, and follow-ups</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
