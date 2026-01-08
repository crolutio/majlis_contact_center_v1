"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Bot, Users, DollarSign, Target } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"

const roiData = [
  { month: "Jan", aiCost: 12000, humanCost: 45000 },
  { month: "Feb", aiCost: 11500, humanCost: 44000 },
  { month: "Mar", aiCost: 10800, humanCost: 42000 },
  { month: "Apr", aiCost: 10200, humanCost: 40000 },
  { month: "May", aiCost: 9800, humanCost: 38500 },
  { month: "Jun", aiCost: 9500, humanCost: 37000 },
]

const csatData = [
  { month: "Jan", csat: 78, nps: 32 },
  { month: "Feb", csat: 80, nps: 35 },
  { month: "Mar", csat: 82, nps: 38 },
  { month: "Apr", csat: 81, nps: 40 },
  { month: "May", csat: 85, nps: 44 },
  { month: "Jun", csat: 87, nps: 48 },
]

const handoffData = [
  { name: "Resolved by AI", value: 68, color: "#22c55e" },
  { name: "Escalated to Human", value: 32, color: "#f59e0b" },
]

const handoffReasons = [
  { reason: "Complex Billing", count: 245 },
  { reason: "Technical Issue", count: 189 },
  { reason: "Account Security", count: 156 },
  { reason: "Complaints", count: 134 },
  { reason: "Other", count: 98 },
]

const capacityData = [
  { hour: "08:00", forecast: 120, actual: 115 },
  { hour: "09:00", forecast: 180, actual: 175 },
  { hour: "10:00", forecast: 220, actual: 235 },
  { hour: "11:00", forecast: 200, actual: 195 },
  { hour: "12:00", forecast: 150, actual: 160 },
  { hour: "13:00", forecast: 140, actual: 145 },
  { hour: "14:00", forecast: 190, actual: 185 },
  { hour: "15:00", forecast: 210, actual: 220 },
  { hour: "16:00", forecast: 180, actual: 170 },
  { hour: "17:00", forecast: 140, actual: 135 },
]

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Strategic Dashboard</h1>
        <p className="text-sm text-muted-foreground">Head of Contact Center - ROI & Performance Overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">AI Cost Savings</p>
                <p className="text-2xl font-bold text-foreground">$127K</p>
                <div className="flex items-center gap-1 text-emerald-600 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  +18.5% vs last quarter
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Bot className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Cost per Contact</p>
                <p className="text-2xl font-bold text-foreground">$3.42</p>
                <div className="flex items-center gap-1 text-emerald-600 text-xs">
                  <TrendingDown className="h-3 w-3" />
                  -12.3% vs last month
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">SLA Compliance</p>
                <p className="text-2xl font-bold text-foreground">94.2%</p>
                <div className="flex items-center gap-1 text-emerald-600 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  +2.1% vs target
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold text-foreground">47</p>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Users className="h-3 w-3" />
                  12 on break
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        {/* ROI Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Hybrid ROI: AI vs Human Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="aiCost"
                    stackId="1"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.6}
                    name="AI Automation Cost"
                  />
                  <Area
                    type="monotone"
                    dataKey="humanCost"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Human Agent Cost"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* CSAT/NPS Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">CSAT & NPS Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={csatData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="csat"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6" }}
                    name="CSAT Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="nps"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b" }}
                    name="NPS Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Handoff Analytics Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">AI Handoff Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={handoffData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {handoffData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {handoffData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Handoff Reasons */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Top Escalation Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={handoffReasons} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis dataKey="reason" type="category" tick={{ fontSize: 11 }} stroke="#9ca3af" width={100} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Capacity Planning */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Capacity: Forecast vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={capacityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#94a3b8"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Forecast"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 3 }}
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
