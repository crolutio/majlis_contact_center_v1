"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertTriangle,
  Search,
  Phone,
  MessageSquare,
  Clock,
  TrendingUp,
  TrendingDown,
  Play,
  ChevronRight,
  X,
  Users,
  ArrowRight,
  Mic,
  PhoneForwarded,
  Send,
  CheckCircle2,
  Plus,
  Edit,
  History,
  Filter,
  Calendar,
  Smile,
  Frown,
  Meh,
  Headphones,
  Eye,
  Pause,
  SkipBack,
  SkipForward,
  UserPlus,
  Trash2,
  LayoutDashboard,
  UsersRound,
  Activity,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"

type SupervisorView = "dashboard" | "team" | "hub"

const intradayData = [
  { status: "Available", count: 18, color: "#22c55e" },
  { status: "On Call", count: 12, color: "#ef4444" },
  { status: "On Chat", count: 8, color: "#3b82f6" },
  { status: "Break", count: 6, color: "#f59e0b" },
  { status: "ACW", count: 3, color: "#8b5cf6" },
]

const agentsByStatus: Record<string, { name: string; time: string }[]> = {
  Available: [
    { name: "Juan P.", time: "5:23" },
    { name: "Ana R.", time: "12:45" },
    { name: "Carlos M.", time: "3:10" },
    { name: "Elena V.", time: "8:02" },
  ],
  "On Call": [
    { name: "Maria S.", time: "12:45" },
    { name: "Pedro L.", time: "8:32" },
    { name: "Sofia G.", time: "15:20" },
  ],
  "On Chat": [
    { name: "Luis G.", time: "6:15" },
    { name: "Carmen D.", time: "9:48" },
  ],
  Break: [
    { name: "Roberto F.", time: "14:30" },
    { name: "Diana H.", time: "7:55" },
  ],
  ACW: [{ name: "Miguel T.", time: "2:10" }],
}

const liveTranscriptData = [
  { speaker: "customer", text: "I've been waiting for over 20 minutes and no one has helped me!", time: "10:32:15" },
  {
    speaker: "agent",
    text: "I sincerely apologize for the wait, Mr. Mendez. I understand your frustration.",
    time: "10:32:22",
  },
  { speaker: "customer", text: "This is the third time I'm calling about the same issue!", time: "10:32:35" },
  {
    speaker: "agent",
    text: "I can see your previous interactions. Let me review them to resolve this once and for all.",
    time: "10:32:48",
  },
  { speaker: "system", text: "Sentiment spike detected: -0.72", time: "10:32:50" },
  {
    speaker: "customer",
    text: "I just want my bill corrected. It's been showing the wrong amount for 2 months.",
    time: "10:33:05",
  },
  { speaker: "agent", text: "I completely understand. I'm pulling up your billing history now...", time: "10:33:18" },
]

const dailyPerformanceData = [
  { hour: "8AM", calls: 3, sentiment: 0.75 },
  { hour: "9AM", calls: 5, sentiment: 0.82 },
  { hour: "10AM", calls: 4, sentiment: 0.68 },
  { hour: "11AM", calls: 6, sentiment: 0.71 },
  { hour: "12PM", calls: 2, sentiment: 0.85 },
  { hour: "1PM", calls: 4, sentiment: 0.79 },
]

const priorityReviewCalls = [
  {
    id: 1,
    customer: "Carlos Mendez",
    agent: "Maria S.",
    sentiment: -0.72,
    duration: "8:45",
    reason: "Negative sentiment spike detected",
    timestamp: "10:32 AM",
  },
  {
    id: 2,
    customer: "Ana Torres",
    agent: "Juan P.",
    sentiment: -0.65,
    duration: "12:20",
    reason: "Long handle time + escalation",
    timestamp: "09:15 AM",
  },
  {
    id: 3,
    customer: "Roberto Silva",
    agent: "Luis G.",
    sentiment: -0.58,
    duration: "6:30",
    reason: "Customer requested supervisor",
    timestamp: "11:45 AM",
  },
  {
    id: 4,
    customer: "Elena Ruiz",
    agent: "Sofia M.",
    sentiment: -0.45,
    duration: "9:15",
    reason: "Multiple holds during call",
    timestamp: "08:50 AM",
  },
  {
    id: 5,
    customer: "Miguel Flores",
    agent: "Carmen D.",
    sentiment: -0.42,
    duration: "7:00",
    reason: "Complaint about service",
    timestamp: "10:05 AM",
  },
]

const agents = [
  {
    id: 1,
    name: "Maria Santos",
    email: "maria.santos@company.com",
    role: "Agent",
    skills: ["Voice", "Technical"],
    language: "Spanish",
    status: "on-call",
    occupancy: 87,
    avgSentiment: 0.72,
    callsToday: 24,
    avgHandleTime: "4:32",
    csat: 4.6,
    coachingNotes: ["Excellent rapport building", "Consider shorter hold times"],
    hireDate: "2023-03-15",
  },
  {
    id: 2,
    name: "Juan Perez",
    email: "juan.perez@company.com",
    role: "Agent",
    skills: ["Voice", "Chat", "Billing"],
    language: "Spanish",
    status: "available",
    occupancy: 78,
    avgSentiment: 0.65,
    callsToday: 21,
    avgHandleTime: "5:15",
    csat: 4.3,
    coachingNotes: ["Strong technical knowledge", "Work on call closing"],
    hireDate: "2022-08-20",
  },
  {
    id: 3,
    name: "Sofia Martinez",
    email: "sofia.martinez@company.com",
    role: "Agent",
    skills: ["Chat", "Technical"],
    language: "English",
    status: "break",
    occupancy: 92,
    avgSentiment: 0.81,
    callsToday: 28,
    avgHandleTime: "3:58",
    csat: 4.8,
    coachingNotes: ["Top performer this week", "Ready for tier 2 training"],
    hireDate: "2023-01-10",
  },
  {
    id: 4,
    name: "Luis Garcia",
    email: "luis.garcia@company.com",
    role: "Agent",
    skills: ["Voice", "Billing"],
    language: "Spanish",
    status: "on-chat",
    occupancy: 74,
    avgSentiment: 0.58,
    callsToday: 19,
    avgHandleTime: "6:02",
    csat: 4.1,
    coachingNotes: ["Needs empathy training", "Review call scripts"],
    hireDate: "2023-06-05",
  },
  {
    id: 5,
    name: "Carmen Diaz",
    email: "carmen.diaz@company.com",
    role: "Supervisor",
    skills: ["Voice", "Chat", "Technical", "Billing"],
    language: "Spanish",
    status: "available",
    occupancy: 85,
    avgSentiment: 0.69,
    callsToday: 22,
    avgHandleTime: "4:45",
    csat: 4.5,
    coachingNotes: ["Consistent performance", "Good upsell conversion"],
    hireDate: "2021-11-12",
  },
]

const interactions = [
  {
    id: 1,
    customer: "Carlos Mendez",
    customerId: "C-12345",
    agent: "Maria S.",
    channel: "voice",
    duration: "8:45",
    sentiment: "angry",
    date: "2024-01-15",
    time: "10:32 AM",
    topic: "Billing dispute",
    messages: liveTranscriptData,
  },
  {
    id: 2,
    customer: "Ana Lopez",
    customerId: "C-67890",
    agent: "Juan P.",
    channel: "whatsapp",
    duration: "15:20",
    sentiment: "happy",
    date: "2024-01-15",
    time: "09:15 AM",
    topic: "Product inquiry",
    messages: [
      { speaker: "customer", text: "Hi! I'm interested in upgrading my plan.", time: "09:15:00" },
      {
        speaker: "agent",
        text: "Hello Ana! I'd be happy to help you with that. What features are you looking for?",
        time: "09:15:30",
      },
      { speaker: "customer", text: "I need more data and international calls.", time: "09:16:15" },
      {
        speaker: "agent",
        text: "Our Premium plan would be perfect for you! It includes 50GB data and unlimited international calls.",
        time: "09:17:00",
      },
      { speaker: "customer", text: "That sounds great! How do I upgrade?", time: "09:18:00" },
      {
        speaker: "agent",
        text: "I can process the upgrade right now. You'll see the changes in your next billing cycle.",
        time: "09:18:45",
      },
      { speaker: "customer", text: "Perfect, thank you so much! You've been very helpful.", time: "09:20:00" },
    ],
  },
  {
    id: 3,
    customer: "Roberto Silva",
    customerId: "C-11223",
    agent: "Luis G.",
    channel: "voice",
    duration: "6:30",
    sentiment: "neutral",
    date: "2024-01-15",
    time: "11:45 AM",
    topic: "Technical support",
    messages: liveTranscriptData,
  },
  {
    id: 4,
    customer: "Elena Martinez",
    customerId: "C-44556",
    agent: "Sofia M.",
    channel: "instagram",
    duration: "12:10",
    sentiment: "happy",
    date: "2024-01-14",
    time: "14:30 PM",
    topic: "Order status",
    messages: [
      { speaker: "customer", text: "Hey, checking on my order #12345", time: "14:30:00" },
      { speaker: "agent", text: "Hi Elena! Let me look that up for you right away.", time: "14:30:45" },
      { speaker: "customer", text: "Thanks!", time: "14:31:00" },
      { speaker: "agent", text: "Your order shipped yesterday and should arrive tomorrow!", time: "14:32:00" },
      { speaker: "customer", text: "Awesome! Can't wait!", time: "14:32:30" },
    ],
  },
  {
    id: 5,
    customer: "Miguel Torres",
    customerId: "C-77889",
    agent: "Carmen D.",
    channel: "webchat",
    duration: "9:00",
    sentiment: "angry",
    date: "2024-01-14",
    time: "16:20 PM",
    topic: "Service complaint",
    messages: [
      { speaker: "customer", text: "This is unacceptable! My service has been down for 3 days!", time: "16:20:00" },
      {
        speaker: "agent",
        text: "I'm truly sorry for the inconvenience, Mr. Torres. Let me investigate immediately.",
        time: "16:20:30",
      },
      { speaker: "customer", text: "I've already called twice and nothing has been resolved!", time: "16:21:00" },
      {
        speaker: "agent",
        text: "I understand your frustration. I'm escalating this to our technical team right now.",
        time: "16:21:45",
      },
      { speaker: "system", text: "Priority escalation created", time: "16:22:00" },
    ],
  },
  {
    id: 6,
    customer: "Laura Sanchez",
    customerId: "C-99001",
    agent: "Maria S.",
    channel: "whatsapp",
    duration: "7:15",
    sentiment: "neutral",
    date: "2024-01-13",
    time: "10:00 AM",
    topic: "Account update",
    messages: [
      { speaker: "customer", text: "I need to update my billing address", time: "10:00:00" },
      { speaker: "agent", text: "Of course! I can help you with that. What's the new address?", time: "10:00:30" },
      { speaker: "customer", text: "123 New Street, City, 12345", time: "10:01:00" },
      { speaker: "agent", text: "Updated! Is there anything else I can help with?", time: "10:02:00" },
      { speaker: "customer", text: "No that's all, thanks", time: "10:02:30" },
    ],
  },
]

const waveformData = Array.from({ length: 50 }, (_, i) => ({
  x: i,
  y: Math.sin(i * 0.3) * Math.random() * 30 + 30,
}))

export function SupervisorDashboard() {
  const [currentView, setCurrentView] = useState<SupervisorView>("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<(typeof agents)[0] | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [liveInterventionOpen, setLiveInterventionOpen] = useState(false)
  const [selectedCall, setSelectedCall] = useState<(typeof priorityReviewCalls)[0] | null>(null)
  const [resourceModalOpen, setResourceModalOpen] = useState(false)
  const [agentsToMove, setAgentsToMove] = useState(5)
  const [moveDirection, setMoveDirection] = useState<"chat-to-voice" | "voice-to-chat">("chat-to-voice")
  const [whisperMessage, setWhisperMessage] = useState("")
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [reallocationConfirmed, setReallocationConfirmed] = useState(false)

  const [createAgentOpen, setCreateAgentOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<(typeof agents)[0] | null>(null)
  const [agentHistoryOpen, setAgentHistoryOpen] = useState(false)
  const [historyAgent, setHistoryAgent] = useState<(typeof agents)[0] | null>(null)
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    role: "Agent",
    skills: [] as string[],
    language: "Spanish",
  })

  const [hubFilters, setHubFilters] = useState({
    agent: "",
    channel: "",
    sentiment: "",
    dateFrom: "",
    dateTo: "",
  })
  const [selectedInteraction, setSelectedInteraction] = useState<(typeof interactions)[0] | null>(null)
  const [deepDiveOpen, setDeepDiveOpen] = useState(false)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackPosition, setPlaybackPosition] = useState(0)
  const [supervisorJoined, setSupervisorJoined] = useState(false)

  const filteredAgents = agents.filter((agent) => agent.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredInteractions = interactions.filter((interaction) => {
    if (hubFilters.agent && !interaction.agent.toLowerCase().includes(hubFilters.agent.toLowerCase())) return false
    if (hubFilters.channel && interaction.channel !== hubFilters.channel) return false
    if (hubFilters.sentiment && interaction.sentiment !== hubFilters.sentiment) return false
    if (hubFilters.dateFrom && interaction.date < hubFilters.dateFrom) return false
    if (hubFilters.dateTo && interaction.date > hubFilters.dateTo) return false
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-500"
      case "on-call":
        return "bg-red-500"
      case "on-chat":
        return "bg-blue-500"
      case "break":
        return "bg-amber-500"
      case "acw":
        return "bg-purple-500"
      default:
        return "bg-slate-400"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Available"
      case "on-call":
        return "On Call"
      case "on-chat":
        return "On Chat"
      case "break":
        return "Break"
      case "acw":
        return "ACW"
      default:
        return status
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "voice":
        return <Phone className="h-4 w-4" />
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-emerald-600" />
      case "instagram":
        return <MessageSquare className="h-4 w-4 text-pink-600" />
      case "webchat":
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "happy":
        return <Smile className="h-4 w-4 text-emerald-600" />
      case "angry":
        return <Frown className="h-4 w-4 text-red-600" />
      case "neutral":
        return <Meh className="h-4 w-4 text-amber-600" />
      default:
        return <Meh className="h-4 w-4" />
    }
  }

  const handleBarClick = (data: { status: string }) => {
    setSelectedStatus(data.status)
  }

  const handleReviewClick = (call: (typeof priorityReviewCalls)[0]) => {
    setSelectedCall(call)
    setLiveInterventionOpen(true)
  }

  const handleSendFeedback = () => {
    setFeedbackSent(true)
    setTimeout(() => setFeedbackSent(false), 3000)
  }

  const handleConfirmReallocation = () => {
    setReallocationConfirmed(true)
    setTimeout(() => {
      setReallocationConfirmed(false)
      setResourceModalOpen(false)
    }, 2000)
  }

  const handleSkillToggle = (skill: string, isEditing = false) => {
    if (isEditing && editingAgent) {
      const currentSkills = editingAgent.skills
      if (currentSkills.includes(skill)) {
        setEditingAgent({ ...editingAgent, skills: currentSkills.filter((s) => s !== skill) })
      } else {
        setEditingAgent({ ...editingAgent, skills: [...currentSkills, skill] })
      }
    } else {
      if (newAgent.skills.includes(skill)) {
        setNewAgent({ ...newAgent, skills: newAgent.skills.filter((s) => s !== skill) })
      } else {
        setNewAgent({ ...newAgent, skills: [...newAgent.skills, skill] })
      }
    }
  }

  const handleInteractionClick = (interaction: (typeof interactions)[0]) => {
    setSelectedInteraction(interaction)
    setDeepDiveOpen(true)
    setIsMonitoring(false)
    setSupervisorJoined(false)
    setPlaybackPosition(0)
  }

  useEffect(() => {
    if (isPlaying && selectedInteraction?.channel === "voice") {
      const interval = setInterval(() => {
        setPlaybackPosition((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isPlaying, selectedInteraction])

  const NavigationTabs = () => (
    <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
      <Button
        variant={currentView === "dashboard" ? "default" : "ghost"}
        size="sm"
        onClick={() => setCurrentView("dashboard")}
        className="gap-2"
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Button>
      <Button
        variant={currentView === "team" ? "default" : "ghost"}
        size="sm"
        onClick={() => setCurrentView("team")}
        className="gap-2"
      >
        <UsersRound className="h-4 w-4" />
        Team Management
      </Button>
      <Button
        variant={currentView === "hub" ? "default" : "ghost"}
        size="sm"
        onClick={() => setCurrentView("hub")}
        className="gap-2"
      >
        <Activity className="h-4 w-4" />
        Interaction Hub
      </Button>
    </div>
  )

  const TeamManagementView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Team Management</h2>
          <p className="text-sm text-muted-foreground">Manage your team members and their profiles</p>
        </div>
        <Button onClick={() => setCreateAgentOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Agent
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">All Agents ({agents.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    CSAT
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAgents.map((agent) => (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-700">
                          {agent.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={agent.role === "Supervisor" ? "default" : "secondary"} className="text-xs">
                        {agent.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {agent.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{agent.language}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(agent.status)}`} />
                        <span className="text-sm text-foreground">{getStatusLabel(agent.status)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{agent.csat}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setEditingAgent(agent)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setHistoryAgent(agent)
                            setAgentHistoryOpen(true)
                          }}
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const InteractionHubView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Interaction Hub</h2>
        <p className="text-sm text-muted-foreground">Search and monitor all customer interactions</p>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Agent Name</Label>
              <Input
                placeholder="Search agent..."
                value={hubFilters.agent}
                onChange={(e) => setHubFilters({ ...hubFilters, agent: e.target.value })}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Channel</Label>
              <Select
                value={hubFilters.channel}
                onValueChange={(value) => setHubFilters({ ...hubFilters, channel: value })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All channels</SelectItem>
                  <SelectItem value="voice">Voice</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="webchat">Webchat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sentiment</Label>
              <Select
                value={hubFilters.sentiment}
                onValueChange={(value) => setHubFilters({ ...hubFilters, sentiment: value })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All sentiments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sentiments</SelectItem>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="angry">Angry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">From Date</Label>
              <Input
                type="date"
                value={hubFilters.dateFrom}
                onChange={(e) => setHubFilters({ ...hubFilters, dateFrom: e.target.value })}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">To Date</Label>
              <Input
                type="date"
                value={hubFilters.dateTo}
                onChange={(e) => setHubFilters({ ...hubFilters, dateTo: e.target.value })}
                className="h-9"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHubFilters({ agent: "", channel: "", sentiment: "", dateFrom: "", dateTo: "" })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Results ({filteredInteractions.length} interactions)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredInteractions.map((interaction) => (
              <motion.div
                key={interaction.id}
                whileHover={{ scale: 1.005 }}
                onClick={() => handleInteractionClick(interaction)}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    {getChannelIcon(interaction.channel)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{interaction.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      Agent: {interaction.agent} | {interaction.topic}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-foreground">{interaction.duration}</p>
                    <p className="text-xs text-muted-foreground">
                      {interaction.date} {interaction.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        interaction.channel === "voice"
                          ? "border-slate-300"
                          : interaction.channel === "whatsapp"
                            ? "border-emerald-300 text-emerald-700"
                            : interaction.channel === "instagram"
                              ? "border-pink-300 text-pink-700"
                              : "border-blue-300 text-blue-700"
                      }`}
                    >
                      {interaction.channel}
                    </Badge>
                    {getSentimentIcon(interaction.sentiment)}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header with Navigation */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Supervisor Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time team performance & quality monitoring</p>
        </div>
        <NavigationTabs />
      </div>

      <AnimatePresence mode="wait">
        {currentView === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Alert Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-red-400/20"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <AlertTriangle className="h-5 w-5 text-amber-600 relative z-10" />
              <div className="flex-1 relative z-10">
                <p className="text-sm font-medium text-amber-800">Traffic Spike Predicted</p>
                <p className="text-xs text-amber-700">
                  AI forecasts 35% increase in call volume at 15:00. Consider adjusting break schedules.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent relative z-10"
                onClick={() => setResourceModalOpen(true)}
              >
                Adjust Resources
              </Button>
            </motion.div>

            <div className="grid grid-cols-3 gap-6">
              {/* Intraday Monitor */}
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Intraday Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Queue Status</span>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="gap-1">
                          <Phone className="h-3 w-3" /> 5 calls
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <MessageSquare className="h-3 w-3" /> 3 chats
                        </Badge>
                      </div>
                    </div>

                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={intradayData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                          <YAxis dataKey="status" type="category" tick={{ fontSize: 11 }} stroke="#9ca3af" width={70} />
                          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                          <Bar
                            dataKey="count"
                            radius={[0, 4, 4, 0]}
                            className="cursor-pointer"
                            onClick={(data) => handleBarClick(data)}
                          >
                            {intradayData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                className="hover:opacity-80 transition-opacity"
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">47</p>
                        <p className="text-xs text-muted-foreground">Total Agents</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">82%</p>
                        <p className="text-xs text-muted-foreground">Occupancy</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Quality Assurance */}
              <Card className="col-span-2 bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    AI Quality Assurance - Priority Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {priorityReviewCalls.map((call) => (
                      <div
                        key={call.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-muted/50 hover:border-slate-300 transition-all cursor-pointer"
                        onClick={() => handleReviewClick(call)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-medium">
                            {Math.round(call.sentiment * -100)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{call.customer}</p>
                            <p className="text-xs text-muted-foreground">
                              Agent: {call.agent} | {call.duration} | {call.timestamp}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="text-xs text-amber-600 border-amber-200 hover:bg-amber-50 cursor-pointer"
                          >
                            {call.reason}
                          </Badge>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agent 360 Grid */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Agent 360 - Team Overview</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search agents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {filteredAgents.map((agent) => (
                    <motion.div
                      key={agent.id}
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      onClick={() => setSelectedAgent(agent)}
                      className="cursor-pointer rounded-lg border border-border bg-card p-3 hover:border-slate-400 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="relative">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-700">
                            {agent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{getStatusLabel(agent.status)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div>
                          <p className="text-lg font-semibold text-foreground">{agent.occupancy}%</p>
                          <p className="text-[10px] text-muted-foreground">Occupancy</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-foreground">{agent.csat}</p>
                          <p className="text-[10px] text-muted-foreground">CSAT</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentView === "team" && (
          <motion.div
            key="team"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <TeamManagementView />
          </motion.div>
        )}

        {currentView === "hub" && (
          <motion.div
            key="hub"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <InteractionHubView />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Modal */}
      <AnimatePresence>
        {selectedStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setSelectedStatus(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: intradayData.find((d) => d.status === selectedStatus)?.color }}
                  />
                  <h3 className="text-lg font-semibold text-foreground">Agents {selectedStatus}</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedStatus(null)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {agentsByStatus[selectedStatus]?.map((agent, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-700">
                        {agent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-sm font-medium text-foreground">{agent.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{agent.time} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Intervention Sheet */}
      <Sheet open={liveInterventionOpen} onOpenChange={setLiveInterventionOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Live Intervention - {selectedCall?.customer}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div>
                <p className="text-sm font-medium">Agent: {selectedCall?.agent}</p>
                <p className="text-xs text-muted-foreground">Duration: {selectedCall?.duration}</p>
              </div>
              <Badge variant="outline" className="text-red-600 border-red-200">
                Sentiment: {selectedCall?.sentiment}
              </Badge>
            </div>

            <div className="rounded-lg border border-border bg-slate-50 p-4 h-64 overflow-y-auto space-y-3">
              <p className="text-xs text-muted-foreground font-medium mb-2">LIVE TRANSCRIPT</p>
              {liveTranscriptData.map((line, idx) => (
                <div
                  key={idx}
                  className={`text-sm ${
                    line.speaker === "customer"
                      ? "text-slate-700"
                      : line.speaker === "agent"
                        ? "text-blue-700"
                        : "text-amber-600 italic"
                  }`}
                >
                  <span className="text-xs text-muted-foreground mr-2">[{line.time}]</span>
                  <span className="font-medium capitalize">{line.speaker}:</span> {line.text}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Whisper to Agent</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message only the agent will hear..."
                  value={whisperMessage}
                  onChange={(e) => setWhisperMessage(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" className="gap-1">
                  <Mic className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="flex-1 gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
              >
                <Mic className="h-4 w-4" />
                Whisper Mode
              </Button>
              <Button variant="default" className="flex-1 gap-2 bg-red-600 hover:bg-red-700">
                <PhoneForwarded className="h-4 w-4" />
                Barge-in (Take over)
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Resource Re-balancer Modal */}
      <Dialog open={resourceModalOpen} onOpenChange={setResourceModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Resource Re-balancer
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-700">12</p>
                <p className="text-sm text-blue-600">Chat Queue</p>
                <p className="text-xs text-muted-foreground mt-1">8 agents assigned</p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <Phone className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <p className="text-2xl font-bold text-red-700">18</p>
                <p className="text-sm text-red-600">Voice Queue</p>
                <p className="text-xs text-muted-foreground mt-1">15 agents assigned</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={moveDirection === "chat-to-voice" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMoveDirection("chat-to-voice")}
                  className="gap-2"
                >
                  Chat <ArrowRight className="h-4 w-4" /> Voice
                </Button>
                <Button
                  variant={moveDirection === "voice-to-chat" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMoveDirection("voice-to-chat")}
                  className="gap-2"
                >
                  Voice <ArrowRight className="h-4 w-4" /> Chat
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Agents to Move: {agentsToMove}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={agentsToMove}
                  onChange={(e) => setAgentsToMove(Number(e.target.value))}
                  className="w-full accent-slate-900"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="font-medium mb-1">Preview:</p>
                <p className="text-muted-foreground">
                  Move <span className="font-semibold text-foreground">{agentsToMove} agents</span> from{" "}
                  <span className="font-semibold text-foreground">
                    {moveDirection === "chat-to-voice" ? "Chat" : "Voice"}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-foreground">
                    {moveDirection === "chat-to-voice" ? "Voice" : "Chat"}
                  </span>{" "}
                  queue.
                </p>
              </div>
            </div>

            <Button className="w-full gap-2" onClick={handleConfirmReallocation} disabled={reallocationConfirmed}>
              {reallocationConfirmed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Re-routing Confirmed!
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  Confirm Re-routing
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Agent Detail Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-xl bg-card p-6 shadow-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-medium text-slate-700">
                      {selectedAgent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(selectedAgent.status)}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedAgent.name}</h3>
                    <p className="text-sm text-muted-foreground">{getStatusLabel(selectedAgent.status)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAgent(null)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedAgent.occupancy}%</p>
                  <p className="text-xs text-muted-foreground">Occupancy</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedAgent.callsToday}</p>
                  <p className="text-xs text-muted-foreground">Calls Today</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedAgent.avgHandleTime}</p>
                  <p className="text-xs text-muted-foreground">Avg Handle</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedAgent.csat}</p>
                  <p className="text-xs text-muted-foreground">CSAT</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-2">Daily Performance Trend</p>
                <div className="h-32 rounded-lg bg-muted p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Line
                        type="monotone"
                        dataKey="calls"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6", r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sentiment"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ fill: "#22c55e", r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">Calls</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">Sentiment</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Sentiment Score</p>
                  <p className="text-sm font-semibold text-emerald-600">
                    {selectedAgent.avgSentiment > 0.7 ? (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" /> Positive
                      </span>
                    ) : selectedAgent.avgSentiment > 0.5 ? (
                      "Neutral"
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <TrendingDown className="h-4 w-4" /> Needs Attention
                      </span>
                    )}
                  </p>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${selectedAgent.avgSentiment * 100}%` }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-2">AI Coaching Notes</p>
                <div className="space-y-2">
                  {selectedAgent.coachingNotes.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-slate-400" />
                      {note}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button className="flex-1 gap-2" onClick={handleSendFeedback} disabled={feedbackSent}>
                  {feedbackSent ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Feedback Sent!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Direct Feedback
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {createAgentOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setCreateAgentOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Create New Agent</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setCreateAgentOpen(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Full Name</Label>
                    <Input
                      placeholder="Enter full name"
                      value={newAgent.name}
                      onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Email</Label>
                    <Input
                      type="email"
                      placeholder="agent@company.com"
                      value={newAgent.email}
                      onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Role</Label>
                    <Select value={newAgent.role} onValueChange={(value) => setNewAgent({ ...newAgent, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Agent">Agent</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Language</Label>
                    <Select
                      value={newAgent.language}
                      onValueChange={(value) => setNewAgent({ ...newAgent, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Portuguese">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Voice", "Chat", "Technical", "Billing"].map((skill) => (
                      <label
                        key={skill}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                          newAgent.skills.includes(skill)
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white border-border hover:border-slate-400"
                        }`}
                      >
                        <Checkbox
                          checked={newAgent.skills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                          className="hidden"
                        />
                        <span className="text-sm">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setCreateAgentOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create Agent
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                    {editingAgent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Edit Profile</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditingAgent(null)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Full Name</Label>
                    <Input
                      value={editingAgent.name}
                      onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Email</Label>
                    <Input
                      type="email"
                      value={editingAgent.email}
                      onChange={(e) => setEditingAgent({ ...editingAgent, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Role</Label>
                    <Select
                      value={editingAgent.role}
                      onValueChange={(value) => setEditingAgent({ ...editingAgent, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Agent">Agent</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Language</Label>
                    <Select
                      value={editingAgent.language}
                      onValueChange={(value) => setEditingAgent({ ...editingAgent, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Portuguese">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Voice", "Chat", "Technical", "Billing"].map((skill) => (
                      <label
                        key={skill}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                          editingAgent.skills.includes(skill)
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white border-border hover:border-slate-400"
                        }`}
                      >
                        <Checkbox
                          checked={editingAgent.skills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill, true)}
                          className="hidden"
                        />
                        <span className="text-sm">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 text-red-600 hover:bg-red-50 border-red-200 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                  <Button className="flex-1 gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {agentHistoryOpen && historyAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setAgentHistoryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                    {historyAgent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{historyAgent.name}</h3>
                    <p className="text-sm text-muted-foreground">Performance History</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setAgentHistoryOpen(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{historyAgent.callsToday * 22}</p>
                  <p className="text-xs text-muted-foreground">Total Calls (Month)</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{historyAgent.avgHandleTime}</p>
                  <p className="text-xs text-muted-foreground">Avg Handle Time</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{historyAgent.csat}</p>
                  <p className="text-xs text-muted-foreground">Avg CSAT</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{historyAgent.occupancy}%</p>
                  <p className="text-xs text-muted-foreground">Avg Occupancy</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3">Monthly Performance Trend</p>
                <div className="h-48 rounded-lg bg-muted p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: "Aug", csat: 4.2, calls: 380 },
                        { month: "Sep", csat: 4.4, calls: 420 },
                        { month: "Oct", csat: 4.3, calls: 450 },
                        { month: "Nov", csat: 4.5, calls: 480 },
                        { month: "Dec", csat: 4.6, calls: 510 },
                        { month: "Jan", csat: historyAgent.csat, calls: historyAgent.callsToday * 22 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Area type="monotone" dataKey="csat" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-3">Recent Coaching Sessions</p>
                <div className="space-y-2">
                  {[
                    { date: "Jan 10, 2024", topic: "Call Opening Techniques", outcome: "Improved" },
                    { date: "Dec 15, 2023", topic: "Empathy Training", outcome: "Completed" },
                    { date: "Nov 20, 2023", topic: "Product Knowledge", outcome: "Excellent" },
                  ].map((session, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{session.topic}</p>
                          <p className="text-xs text-muted-foreground">{session.date}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                        {session.outcome}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deepDiveOpen && selectedInteraction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setDeepDiveOpen(false)
              setSupervisorJoined(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    {getChannelIcon(selectedInteraction.channel)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{selectedInteraction.customer}</h3>
                      {supervisorJoined && <Badge className="bg-amber-500 text-white">Supervisor Monitoring</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Agent: {selectedInteraction.agent} | {selectedInteraction.topic} | {selectedInteraction.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getSentimentIcon(selectedInteraction.sentiment)}
                  <Badge variant="outline" className="capitalize">
                    {selectedInteraction.sentiment}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDeepDiveOpen(false)
                      setSupervisorJoined(false)
                    }}
                    className="h-8 w-8 p-0 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content based on channel type */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedInteraction.channel === "voice" ? (
                  /* Voice Session Deep Dive */
                  <div className="space-y-6">
                    {/* Waveform Player */}
                    <div className="rounded-xl bg-slate-900 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-white">Voice Recording</p>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{selectedInteraction.duration}</span>
                        </div>
                      </div>

                      {/* Waveform Visualization */}
                      <div className="h-24 mb-4 flex items-center justify-center gap-0.5">
                        {waveformData.map((bar, idx) => (
                          <motion.div
                            key={idx}
                            className={`w-1 rounded-full ${
                              (idx / waveformData.length) * 100 < playbackPosition ? "bg-emerald-500" : "bg-slate-600"
                            }`}
                            style={{ height: `${bar.y}%` }}
                            animate={
                              isPlaying && (idx / waveformData.length) * 100 <= playbackPosition
                                ? {
                                    scaleY: [1, 1.2, 1],
                                  }
                                : {}
                            }
                            transition={{ duration: 0.3 }}
                          />
                        ))}
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1 bg-slate-700 rounded-full mb-4 overflow-hidden">
                        <motion.div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${playbackPosition}%` }}
                        />
                      </div>

                      {/* Playback Controls */}
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-slate-800"
                          onClick={() => setPlaybackPosition(Math.max(0, playbackPosition - 10))}
                        >
                          <SkipBack className="h-5 w-5" />
                        </Button>
                        <Button
                          size="lg"
                          className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-slate-800"
                          onClick={() => setPlaybackPosition(Math.min(100, playbackPosition + 10))}
                        >
                          <SkipForward className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Live Listen Button */}
                    <Button
                      variant={isMonitoring ? "default" : "outline"}
                      className={`w-full gap-2 ${isMonitoring ? "bg-red-600 hover:bg-red-700" : ""}`}
                      onClick={() => setIsMonitoring(!isMonitoring)}
                    >
                      <Headphones className="h-4 w-4" />
                      {isMonitoring ? "Stop Live Listen" : "Start Live Listen"}
                      {isMonitoring && <span className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                    </Button>

                    {/* Live Transcript */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-3">Live Transcript</p>
                      <div className="rounded-lg border border-border bg-slate-50 p-4 h-48 overflow-y-auto space-y-3">
                        {selectedInteraction.messages.map((line, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`text-sm ${
                              line.speaker === "customer"
                                ? "text-slate-700"
                                : line.speaker === "agent"
                                  ? "text-blue-700"
                                  : "text-amber-600 italic"
                            }`}
                          >
                            <span className="text-xs text-muted-foreground mr-2">[{line.time}]</span>
                            <span className="font-medium capitalize">{line.speaker}:</span> {line.text}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Chat Session Deep Dive */
                  <div className="space-y-4">
                    {/* Chat Messages */}
                    <div className="rounded-lg border border-border bg-slate-50 p-4 h-80 overflow-y-auto space-y-4">
                      {selectedInteraction.messages.map((message, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex ${message.speaker === "agent" ? "justify-end" : "justify-start"}`}
                        >
                          {message.speaker === "system" ? (
                            <div className="text-center w-full">
                              <Badge variant="outline" className="text-amber-600 border-amber-200">
                                {message.text}
                              </Badge>
                            </div>
                          ) : (
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                                message.speaker === "agent"
                                  ? "bg-slate-900 text-white rounded-br-md"
                                  : "bg-white border border-border text-foreground rounded-bl-md"
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.speaker === "agent" ? "text-slate-400" : "text-muted-foreground"
                                }`}
                              >
                                {message.time}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Whisper to Agent */}
                <div className="mt-6 space-y-3">
                  <Label className="text-sm font-medium">Whisper to Agent (Private)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message only the agent will see..."
                      value={whisperMessage}
                      onChange={(e) => setWhisperMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button className="gap-2">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 p-6 border-t border-border bg-slate-50/50">
                {selectedInteraction.channel !== "voice" && (
                  <Button
                    variant={supervisorJoined ? "default" : "outline"}
                    className={`flex-1 gap-2 ${supervisorJoined ? "bg-amber-500 hover:bg-amber-600" : ""}`}
                    onClick={() => setSupervisorJoined(!supervisorJoined)}
                  >
                    <Eye className="h-4 w-4" />
                    {supervisorJoined ? "Leave Chat" : "Join Chat"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                >
                  <Mic className="h-4 w-4" />
                  Whisper Mode
                </Button>
                <Button variant="default" className="flex-1 gap-2 bg-red-600 hover:bg-red-700">
                  <PhoneForwarded className="h-4 w-4" />
                  Barge-in (Take over)
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
