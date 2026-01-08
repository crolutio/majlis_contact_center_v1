"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Search,
  FileText,
  Lightbulb,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Star,
  Send,
  ChevronRight,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  Package,
  Calendar,
  AlertTriangle,
  Wifi,
  Tv,
  MessageCircle,
  Headphones,
  XCircle,
  PhoneCall,
  Video,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const historicalCustomers = [
  {
    id: 1,
    name: "Maria Gonzalez",
    dni: "45.678.912",
    phone: "+54 11 4567-8912",
    lastContact: "2024-12-20",
    totalInteractions: 8,
    status: "resolved",
    aiInsights: [
      "High-value customer - 3 years tenure",
      "Recently upgraded to premium plan",
      "Prefers email communication",
    ],
    timeline: [
      {
        id: 1,
        date: "2024-12-20",
        channel: "phone",
        reason: "Billing inquiry",
        duration: "5m 23s",
        sentiment: "positive",
        summary:
          "Customer called regarding December invoice discount. Agent confirmed promotional rate was applied correctly.",
      },
      {
        id: 2,
        date: "2024-12-15",
        channel: "chat",
        reason: "Plan upgrade",
        duration: "8m 12s",
        sentiment: "positive",
        summary: "Customer requested upgrade to Premium plan with HBO Max bundle. Successfully processed.",
      },
      {
        id: 3,
        date: "2024-11-28",
        channel: "phone",
        reason: "Technical support",
        duration: "12m 45s",
        sentiment: "neutral",
        summary:
          "Router configuration issue. Guided customer through setup. Escalated to Level 2 for additional diagnostics.",
      },
    ],
    products: [
      { name: "Internet 300 Mbps", status: "active", price: "$2,499/mo", icon: "wifi" },
      { name: "Cable TV Premium", status: "active", price: "$1,899/mo", icon: "tv" },
      { name: "HBO Max Bundle", status: "active", price: "$599/mo", icon: "video" },
      { name: "Phone Line", status: "expiring", price: "$399/mo", icon: "phone" },
    ],
  },
  {
    id: 2,
    name: "Carlos Rodriguez",
    dni: "38.456.789",
    phone: "+54 11 3845-6789",
    lastContact: "2024-12-18",
    totalInteractions: 3,
    status: "pending",
    aiInsights: ["New customer - onboarded 2 months ago", "Multiple technical issues reported", "At risk of churn"],
    timeline: [
      {
        id: 1,
        date: "2024-12-18",
        channel: "phone",
        reason: "Service outage",
        duration: "15m 31s",
        sentiment: "negative",
        summary: "Customer reported complete internet outage for 3 days. Technician visit scheduled for Dec 22.",
      },
      {
        id: 2,
        date: "2024-11-05",
        channel: "chat",
        reason: "Slow speeds",
        duration: "6m 22s",
        sentiment: "neutral",
        summary: "Customer complained about slow internet speeds. Performed remote diagnostics and reset modem.",
      },
    ],
    products: [
      { name: "Internet 100 Mbps", status: "active", price: "$1,799/mo", icon: "wifi" },
      { name: "Basic TV", status: "active", price: "$999/mo", icon: "tv" },
    ],
  },
  {
    id: 3,
    name: "Ana Torres",
    dni: "42.123.456",
    phone: "+54 11 4212-3456",
    lastContact: "2024-12-15",
    totalInteractions: 12,
    status: "resolved",
    aiInsights: [
      "Loyal customer - 5 years tenure",
      "Very satisfied with service quality",
      "Frequent feature inquiries",
    ],
    timeline: [
      {
        id: 1,
        date: "2024-12-15",
        channel: "phone",
        reason: "Feature inquiry",
        duration: "3m 45s",
        sentiment: "positive",
        summary: "Asked about new streaming packages. Provided information on Disney+ bundle promotion.",
      },
      {
        id: 2,
        date: "2024-12-01",
        channel: "email",
        reason: "Billing question",
        duration: "N/A",
        sentiment: "neutral",
        summary: "Email inquiry about annual discount eligibility. Confirmed 15% loyalty discount applied.",
      },
      {
        id: 3,
        date: "2024-11-20",
        channel: "chat",
        reason: "Equipment upgrade",
        duration: "7m 18s",
        sentiment: "positive",
        summary: "Requested new WiFi 6 router. Scheduled delivery for Nov 25.",
      },
    ],
    products: [
      { name: "Internet 500 Mbps", status: "active", price: "$3,299/mo", icon: "wifi" },
      { name: "Premium TV + Sports", status: "active", price: "$2,499/mo", icon: "tv" },
      { name: "Disney+ Bundle", status: "active", price: "$799/mo", icon: "video" },
      { name: "Premium Support", status: "active", price: "$299/mo", icon: "headphones" },
    ],
  },
]

const followUps = [
  {
    id: 1,
    customer: "Roberto Silva",
    dni: "51.234.567",
    reason: "Callback requested - billing dispute",
    priority: "high",
    dueDate: "Today",
    notes:
      "Customer requested supervisor callback regarding incorrect charges on Nov invoice. Very upset. Needs immediate attention.",
  },
  {
    id: 2,
    customer: "Elena Martinez",
    dni: "47.890.123",
    reason: "Technical follow-up",
    priority: "medium",
    dueDate: "Tomorrow",
    notes:
      "Check if internet speed issues were resolved after technician visit. If not, escalate to Level 3 support team.",
  },
  {
    id: 3,
    customer: "Miguel Flores",
    dni: "39.567.890",
    reason: "Contract renewal discussion",
    priority: "low",
    dueDate: "Dec 26",
    notes: "Customer interested in upgrading to premium plan. Send comparison and pricing. Mention holiday promo.",
  },
]

const performanceMetrics = {
  callsHandled: 156,
  avgHandleTime: "4:32",
  csat: 4.6,
  fcr: 87,
  rank: 3,
  totalAgents: 47,
  trends: {
    callsHandled: "up",
    avgHandleTime: "down",
    csat: "up",
    fcr: "same",
  },
}

const aiTips = [
  {
    id: 1,
    type: "improvement",
    tip: "Your average hold time increased by 15% yesterday. Consider reviewing the knowledge base shortcuts.",
    impact: "medium",
  },
  {
    id: 2,
    type: "strength",
    tip: "Great job on empathy! Your sentiment scores are 20% above team average.",
    impact: "positive",
  },
  {
    id: 3,
    type: "suggestion",
    tip: "Try the new 'Quick Resolution' script for billing inquiries - it reduced AHT by 45 seconds in trials.",
    impact: "high",
  },
]

const emergencyContacts = [
  { team: "Tech Support L2", phone: "+54 11 5555-0001", extension: "2001" },
  { team: "Billing Escalations", phone: "+54 11 5555-0002", extension: "2002" },
  { team: "Logistics", phone: "+54 11 5555-0003", extension: "2003" },
  { team: "Network Operations", phone: "+54 11 5555-0004", extension: "2004" },
  { team: "Customer Retention", phone: "+54 11 5555-0005", extension: "2005" },
]

export function AgentBackOffice() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof historicalCustomers)[0] | null>(null)
  const [selectedTimeline, setSelectedTimeline] = useState<any>(null)
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [aiChatTab, setAiChatTab] = useState<"chat" | "emergency">("chat")
  const [aiQuery, setAiQuery] = useState("")
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([])

  const [reviewingIncident, setReviewingIncident] = useState<(typeof followUps)[0] | null>(null)
  const [routeDepartment, setRouteDepartment] = useState("")
  const [professionalSummary, setProfessionalSummary] = useState("")

  const [showPlatformIssue, setShowPlatformIssue] = useState(false)
  const [platformIssue, setPlatformIssue] = useState("")

  const filteredCustomers = historicalCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dni.includes(searchQuery) ||
      c.phone.includes(searchQuery),
  )

  const handleCustomerSelect = (customer: (typeof historicalCustomers)[0]) => {
    setIsLoading(true)
    setTimeout(() => {
      setSelectedCustomer(customer)
      setIsLoading(false)
    }, 800)
  }

  const handleAiQuery = () => {
    if (!aiQuery.trim()) return

    const userMessage = { role: "user" as const, content: aiQuery }
    setAiMessages([...aiMessages, userMessage])

    // Mock AI response based on query
    setTimeout(() => {
      let aiResponse = ""
      if (aiQuery.toLowerCase().includes("refund")) {
        aiResponse =
          "For Tier 2 refunds: 1) Verify customer account standing 2) Check refund eligibility (within 30 days) 3) Process through Finance Portal 4) Estimated processing time: 5-7 business days. Requires supervisor approval for amounts over $5,000."
      } else if (aiQuery.toLowerCase().includes("technical") || aiQuery.toLowerCase().includes("router")) {
        aiResponse =
          "Standard router troubleshooting: 1) Power cycle (30 sec) 2) Check cable connections 3) Verify LED status 4) Run remote diagnostics 5) If unresolved, schedule technician visit. Average resolution time: 15 minutes."
      } else {
        aiResponse =
          "I can help you with procedures, policies, and troubleshooting steps. Try asking about refunds, technical issues, billing disputes, or escalation procedures."
      }

      setAiMessages((prev) => [...prev, { role: "ai", content: aiResponse }])
    }, 500)

    setAiQuery("")
  }

  const handleReviewIncident = (incident: (typeof followUps)[0]) => {
    setReviewingIncident(incident)
    // AI generates professional summary
    setProfessionalSummary(
      `Professional summary: Customer ${incident.customer} requires follow-up regarding ${incident.reason.toLowerCase()}. Priority level: ${incident.priority.toUpperCase()}. Recommended action: immediate callback within business hours. Case notes indicate ${incident.notes}`,
    )
    setRouteDepartment("")
  }

  const handleRouteIncident = () => {
    if (!routeDepartment) return
    alert(`Incident routed to ${routeDepartment} successfully!`)
    setReviewingIncident(null)
  }

  const handleSubmitPlatformIssue = () => {
    if (!platformIssue.trim()) return
    alert("Platform issue reported successfully! IT team will investigate.")
    setPlatformIssue("")
    setShowPlatformIssue(false)
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      wifi: Wifi,
      tv: Tv,
      video: Video,
      phone: PhoneCall,
      headphones: Headphones,
    }
    return icons[iconName] || Package
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUp className="h-3 w-3 text-emerald-600" />
    if (trend === "down") return <ArrowDown className="h-3 w-3 text-red-600" />
    return <Minus className="h-3 w-3 text-slate-400" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Agent Back Office</h1>
        <p className="text-sm text-muted-foreground">
          High-resolution workspace for customer insights & self-improvement
        </p>
      </div>

      {selectedCustomer ? (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          {/* Back Button */}
          <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)} className="gap-2">
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Dashboard
          </Button>

          {/* Customer Header */}
          <Card className="border-2 border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-700">
                  {selectedCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-foreground">{selectedCustomer.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    DNI: {selectedCustomer.dni} • {selectedCustomer.phone}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {selectedCustomer.totalInteractions} interactions
                    </Badge>
                    <Badge
                      className={
                        selectedCustomer.status === "resolved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-6">
            {/* AI Summary Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedCustomer.aiInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg bg-purple-50 border border-purple-100"
                  >
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-purple-900">{insight}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Interactive Timeline */}
            <Card className="col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Interaction Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedCustomer.timeline.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => {
                      setSelectedTimeline(item)
                      setIsTranscriptOpen(true)
                    }}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-slate-300 hover:bg-muted/30 cursor-pointer transition-all"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.channel === "phone"
                          ? "bg-blue-100"
                          : item.channel === "chat"
                            ? "bg-green-100"
                            : "bg-purple-100"
                      }`}
                    >
                      {item.channel === "phone" ? (
                        <Phone className="h-5 w-5 text-blue-600" />
                      ) : item.channel === "chat" ? (
                        <MessageCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground">{item.reason}</p>
                        <Badge
                          variant="outline"
                          className={
                            item.sentiment === "positive"
                              ? "border-emerald-200 text-emerald-700"
                              : item.sentiment === "negative"
                                ? "border-red-200 text-red-700"
                                : "border-slate-200 text-slate-700"
                          }
                        >
                          {item.sentiment}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.date} • {item.duration}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{item.summary}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Product Grid */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Current Products & Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {selectedCustomer.products.map((product, idx) => {
                  const IconComponent = getIconComponent(product.icon)
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-border bg-card hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            product.status === "active" ? "bg-emerald-100" : "bg-amber-100"
                          }`}
                        >
                          <IconComponent
                            className={`h-5 w-5 ${product.status === "active" ? "text-emerald-600" : "text-amber-600"}`}
                          />
                        </div>
                        <Badge
                          className={
                            product.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }
                        >
                          {product.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.price}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-48 bg-muted rounded-lg"></div>
            <div className="col-span-2 h-48 bg-muted rounded-lg"></div>
          </div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      ) : (
        // Main Dashboard
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Search & Follow-ups */}
          <div className="col-span-2 space-y-6">
            {/* Universal Search */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Universal Customer Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, DNI, or phone number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {searchQuery && (
                  <div className="space-y-2">
                    {filteredCustomers.map((customer) => (
                      <motion.div
                        key={customer.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleCustomerSelect(customer)}
                        className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              DNI: {customer.dni} • {customer.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Last contact</p>
                            <p className="text-sm font-medium text-foreground">{customer.lastContact}</p>
                          </div>
                          <Badge
                            variant={customer.status === "resolved" ? "default" : "secondary"}
                            className={customer.status === "resolved" ? "bg-emerald-100 text-emerald-700" : ""}
                          >
                            {customer.totalInteractions} interactions
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </motion.div>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-4">No customers found</p>
                    )}
                  </div>
                )}

                {!searchQuery && (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    Enter a name, DNI, or phone number to search
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Incident Inbox - Follow-ups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {followUps.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border bg-card p-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-700">
                            {item.customer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.customer}</p>
                            <p className="text-xs text-muted-foreground">DNI: {item.dni}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              item.priority === "high"
                                ? "border-red-200 text-red-600"
                                : item.priority === "medium"
                                  ? "border-amber-200 text-amber-600"
                                  : "border-slate-200 text-slate-600"
                            }
                          >
                            {item.priority}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {item.dueDate}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-foreground mb-2">{item.reason}</p>
                      <p className="text-xs text-muted-foreground bg-muted rounded px-2 py-1">{item.notes}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 bg-transparent">
                          <Phone className="h-3 w-3" /> Call
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 bg-transparent">
                          <MessageSquare className="h-3 w-3" /> Message
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                          onClick={() => handleReviewIncident(item)}
                        >
                          <Send className="h-3 w-3" /> Review & Route
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 ml-auto">
                          <CheckCircle2 className="h-3 w-3" /> Mark Complete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Self Coaching & KB */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  My Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Star className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Rank #{performanceMetrics.rank}</p>
                      <p className="text-xs text-muted-foreground">of {performanceMetrics.totalAgents} agents</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">Top 10%</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xl font-bold text-foreground">{performanceMetrics.callsHandled}</p>
                      {getTrendIcon(performanceMetrics.trends.callsHandled)}
                    </div>
                    <p className="text-xs text-muted-foreground">Calls This Week</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xl font-bold text-foreground">{performanceMetrics.avgHandleTime}</p>
                      {getTrendIcon(performanceMetrics.trends.avgHandleTime)}
                    </div>
                    <p className="text-xs text-muted-foreground">Avg Handle Time</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xl font-bold text-foreground">{performanceMetrics.csat}</p>
                      {getTrendIcon(performanceMetrics.trends.csat)}
                    </div>
                    <p className="text-xs text-muted-foreground">CSAT Score</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xl font-bold text-foreground">{performanceMetrics.fcr}%</p>
                      {getTrendIcon(performanceMetrics.trends.fcr)}
                    </div>
                    <p className="text-xs text-muted-foreground">First Contact</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  AI Coaching Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiTips.map((tip) => (
                    <div
                      key={tip.id}
                      className={`rounded-lg p-3 ${
                        tip.type === "strength"
                          ? "bg-emerald-50 border border-emerald-200"
                          : tip.type === "improvement"
                            ? "bg-amber-50 border border-amber-200"
                            : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {tip.type === "strength" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                        ) : tip.type === "improvement" ? (
                          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        ) : (
                          <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                        )}
                        <p
                          className={`text-sm ${
                            tip.type === "strength"
                              ? "text-emerald-800"
                              : tip.type === "improvement"
                                ? "text-amber-800"
                                : "text-blue-800"
                          }`}
                        >
                          {tip.tip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    AI Knowledge Assistant
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={aiChatTab === "chat" ? "default" : "ghost"}
                      className="h-7 text-xs px-2"
                      onClick={() => setAiChatTab("chat")}
                    >
                      Chat
                    </Button>
                    <Button
                      size="sm"
                      variant={aiChatTab === "emergency" ? "default" : "ghost"}
                      className="h-7 text-xs px-2"
                      onClick={() => setAiChatTab("emergency")}
                    >
                      Contacts
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {aiChatTab === "chat" ? (
                  <div className="space-y-3">
                    <div className="h-48 overflow-y-auto space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                      {aiMessages.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-8">
                          Ask me about procedures, policies, or troubleshooting steps...
                        </p>
                      )}
                      {aiMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg text-sm ${
                            msg.role === "user"
                              ? "bg-blue-100 text-blue-900 ml-auto max-w-[85%]"
                              : "bg-white border border-slate-200 text-slate-900 mr-auto max-w-[85%]"
                          }`}
                        >
                          {msg.content}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="How to handle a Tier 2 refund?"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAiQuery()}
                        className="text-sm"
                      />
                      <Button size="sm" onClick={handleAiQuery} className="gap-1 flex-shrink-0">
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground mb-3">Quick-dial emergency contacts</p>
                    {emergencyContacts.map((contact, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{contact.team}</p>
                          <p className="text-xs text-muted-foreground">Ext: {contact.extension}</p>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 gap-1 bg-transparent">
                          <Phone className="h-3 w-3" />
                          Call
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Sheet open={isTranscriptOpen} onOpenChange={setIsTranscriptOpen}>
        <SheetContent side="right" className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Interaction Transcript</SheetTitle>
          </SheetHeader>
          {selectedTimeline && (
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{selectedTimeline.channel}</Badge>
                  <span className="text-xs text-muted-foreground">{selectedTimeline.date}</span>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{selectedTimeline.reason}</p>
                <p className="text-xs text-muted-foreground">Duration: {selectedTimeline.duration}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Full Summary:</p>
                <p className="text-sm text-muted-foreground">{selectedTimeline.summary}</p>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-2">Sentiment Analysis:</p>
                  <Badge
                    className={
                      selectedTimeline.sentiment === "positive"
                        ? "bg-emerald-100 text-emerald-700"
                        : selectedTimeline.sentiment === "negative"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-700"
                    }
                  >
                    {selectedTimeline.sentiment}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AnimatePresence>
        {reviewingIncident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setReviewingIncident(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Review & Route Incident</h3>
                <Button variant="ghost" size="sm" onClick={() => setReviewingIncident(null)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-sm font-medium text-foreground mb-1">{reviewingIncident.customer}</p>
                <p className="text-xs text-muted-foreground mb-2">DNI: {reviewingIncident.dni}</p>
                <p className="text-sm text-foreground">{reviewingIncident.reason}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  AI-Generated Professional Summary
                </label>
                <Textarea
                  value={professionalSummary}
                  onChange={(e) => setProfessionalSummary(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Route to Department</label>
                <Select value={routeDepartment} onValueChange={setRouteDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="tech-support">Tech Support</SelectItem>
                    <SelectItem value="retention">Customer Retention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setReviewingIncident(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleRouteIncident} disabled={!routeDepartment} className="flex-1 gap-2">
                  <Send className="h-4 w-4" />
                  Send to {routeDepartment || "Department"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="sm"
          variant="outline"
          className="h-10 gap-2 shadow-lg bg-white hover:bg-slate-50"
          onClick={() => setShowPlatformIssue(true)}
        >
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          Report Platform Issue
        </Button>
      </div>

      {/* Platform Issue Modal */}
      <AnimatePresence>
        {showPlatformIssue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPlatformIssue(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-foreground">Report Platform Issue</h3>
              </div>

              <p className="text-sm text-muted-foreground">
                Describe the technical issue you're experiencing with the platform
              </p>

              <Textarea
                value={platformIssue}
                onChange={(e) => setPlatformIssue(e.target.value)}
                placeholder="e.g., Customer search is timing out, transcript not loading..."
                className="min-h-[120px]"
              />

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPlatformIssue(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmitPlatformIssue} disabled={!platformIssue.trim()} className="flex-1 gap-2">
                  <Send className="h-4 w-4" />
                  Submit Report
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
