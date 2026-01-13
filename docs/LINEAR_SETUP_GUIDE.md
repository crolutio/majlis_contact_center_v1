# Linear Setup Guide - Majlis Contact Center

This guide provides step-by-step instructions for setting up your Linear workspace for the Majlis Contact Center project.

## Table of Contents
1. [Initial Workspace Setup](#initial-workspace-setup)
2. [Team Configuration](#team-configuration)
3. [Labels Setup](#labels-setup)
4. [Projects Creation](#projects-creation)
5. [Custom Views](#custom-views)
6. [Workflow States](#workflow-states)
7. [Issue Templates](#issue-templates)
8. [Integrations](#integrations)

---

## Initial Workspace Setup

### Step 1: Create the Team

1. Go to Linear → **Settings** → **Teams**
2. Click **"New Team"**
3. Enter team details:
   - **Name:** `Majlis Contact Center`
   - **Identifier:** `MCC` (will be used in issue IDs like MCC-123)
   - **Icon:** Choose an appropriate emoji (💬 or 📞)
4. Click **Create**

### Step 2: Invite Team Members

1. Go to **Settings** → **Members**
2. Click **"Invite Members"**
3. Add team members with their email addresses:
   - Agus (Connectivity Engineer)
   - Alex (UX Designer / QA)
   - Judith (UX Designer / QA)
   - Brian (Data/AI Engineer)
4. Select their role: **Member** (you're the Admin)
5. Send invitations

### Step 3: Configure Team Settings

1. Go to **Team Settings** → **General**
2. Configure the following:
   - **Workflow Type:** Custom
   - **Default issue status:** Triage
   - **Auto-close completed issues:** After 14 days
   - **Auto-archive canceled issues:** After 7 days

3. Go to **Team Settings** → **Cycles**
   - **Enable cycles:** ✅ Yes
   - **Cycle duration:** 2 weeks
   - **Cycle start day:** Monday
   - **First cycle start date:** [Choose your preferred start date]
   - **Auto-add new issues to current cycle:** ❌ No (we'll add manually during sprint planning)

---

## Labels Setup

Labels are crucial for organizing work. Create all labels in: **Team Settings** → **Labels** → **New Label**

### 1. Specialty Labels (Team Focus)

These indicate which team member primarily works on the issue:

| Name | Color | Description |
|------|-------|-------------|
| 🔌 Connectivity | Blue (#0091FF) | Agus's work: Twilio, WhatsApp, Voice, SMS integrations |
| 🎨 Frontend/UX | Purple (#8B5CF6) | Alex & Judith's work: UI components, pages, design |
| 🤖 AI/Data | Green (#10B981) | Brian's work: LangGraph agents, banking integration |
| 📋 Product/PM | Orange (#F59E0B) | PM work: planning, coordination, documentation |

**Setup Instructions:**
1. Click **"New Label"**
2. Enter name (include emoji)
3. Choose color
4. Add description
5. Click **Create**

### 2. Type Labels

| Name | Color | Description |
|------|-------|-------------|
| 🐛 Bug | Red (#EF4444) | Something broken that needs fixing |
| ✨ Feature | Blue (#3B82F6) | New functionality or enhancement |
| 🔧 Maintenance | Gray (#6B7280) | Tech debt, refactoring, upgrades |
| 📚 Documentation | Teal (#14B8A6) | Docs, guides, README updates |
| 🧪 Testing | Pink (#EC4899) | QA, test coverage, integration tests |

### 3. Priority Labels

| Name | Color | Description |
|------|-------|-------------|
| 🔴 Critical | Red (#DC2626) | Production blockers, security issues |
| 🟠 High | Orange (#EA580C) | Important features, significant bugs |
| 🟡 Medium | Yellow (#EAB308) | Standard features and improvements |
| 🟢 Low | Green (#22C55E) | Nice-to-haves, future considerations |

### 4. Channel Labels (for Connectivity work)

| Name | Color | Description |
|------|-------|-------------|
| 📞 Voice | Blue (#2563EB) | Twilio/Vapi voice calls |
| 💬 WhatsApp | Green (#16A34A) | WhatsApp integration |
| 📧 Email | Red (#DC2626) | Email channel |
| 📱 SMS | Purple (#9333EA) | SMS messaging |

### 5. Component Labels (for Frontend/UX work)

| Name | Color | Description |
|------|-------|-------------|
| Agent Desktop | Blue (#0EA5E9) | Agent-facing interfaces |
| Analytics Dashboard | Purple (#A855F7) | Reports, charts, metrics |
| Inbox/Conversations | Green (#10B981) | Message handling UI |
| Quality Management | Orange (#F97316) | QA evaluation interfaces |
| Settings/Config | Gray (#64748B) | Configuration pages |

### 6. Special Labels

| Name | Color | Description |
|------|-------|-------------|
| 🚫 Blocked | Red (#DC2626) | Work is blocked by dependencies |
| 🎯 Sprint Goal | Gold (#F59E0B) | Critical for current sprint |

---

## Projects Creation

Projects group related issues together. Create projects in: **Team Settings** → **Projects**

### Project 1: 🔌 Channel Connectivity

1. Click **"New Project"**
2. Fill in details:
   - **Name:** Channel Connectivity
   - **Icon:** 🔌
   - **Lead:** Agus
   - **Status:** In Progress
   - **Target date:** [Leave blank or set based on roadmap]
3. **Description:**
```
Voice, WhatsApp, SMS, and Email channel integrations.

Key Areas:
- Twilio Voice integration
- WhatsApp Business API
- SMS gateway
- Email connectivity (SendGrid)
- Webhook handling
- Message delivery tracking
- Call routing
```

### Project 2: 🤖 AI Agents & Intelligence

- **Name:** AI Agents & Intelligence
- **Icon:** 🤖
- **Lead:** Brian
- **Status:** In Progress
- **Description:**
```
LangGraph workflows, agent processing, and banking integration.

Key Areas:
- LangGraph workflow development
- Agent intent analysis
- Sentiment detection
- Banking data connectivity
- Knowledge base integration
- AI response generation
```

### Project 3: 🎨 User Experience & Interface

- **Name:** User Experience & Interface
- **Icon:** 🎨
- **Lead:** Alex (co-lead: Judith)
- **Status:** In Progress
- **Description:**
```
Frontend components, pages, and user experience improvements.

Key Areas:
- UI component development
- Agent desktop interface
- Analytics dashboards
- Responsive design
- Accessibility improvements
- User testing and feedback
```

### Project 4: 🏗️ Platform Infrastructure

- **Name:** Platform Infrastructure
- **Icon:** 🏗️
- **Lead:** Project Manager (shared responsibility)
- **Status:** Ongoing
- **Description:**
```
Database, deployment, security, and monitoring.

Key Areas:
- Supabase database management
- Vercel deployment
- Error handling and logging
- Performance optimization
- Security and compliance
- Monitoring and alerting
```

### Project 5: 🧪 Testing & Quality

- **Name:** Testing & Quality
- **Icon:** 🧪
- **Lead:** Alex and Judith
- **Status:** Ongoing
- **Description:**
```
Testing processes, QA workflows, and bug management.

Key Areas:
- Integration testing
- UI/UX testing
- Bug triage and fixing
- Regression testing
- Test automation
- Quality metrics
```

### Project 6: 📖 Documentation & Demos

- **Name:** Documentation & Demos
- **Icon:** 📖
- **Lead:** Project Manager
- **Status:** Ongoing
- **Description:**
```
Documentation, demo setup, and client-facing materials.

Key Areas:
- Setup guides
- API documentation
- Demo configuration
- User manuals
- Technical architecture docs
- Deployment guides
```

---

## Workflow States

Configure your workflow: **Team Settings** → **Workflow**

### Required States

Create the following states in order:

1. **Triage**
   - Type: Unstarted
   - Description: New issues awaiting PM review
   - Color: Gray

2. **Backlog**
   - Type: Unstarted
   - Description: Accepted but not scheduled
   - Color: Light Gray

3. **Todo**
   - Type: Unstarted
   - Description: Ready to work on (in current sprint or high priority)
   - Color: Blue

4. **In Progress**
   - Type: Started
   - Description: Actively being worked on
   - Color: Yellow

5. **In Review**
   - Type: Started
   - Description: Code review or design review needed
   - Color: Orange

6. **Testing/QA**
   - Type: Started
   - Description: Ready for Alex & Judith to validate
   - Color: Purple

7. **Done**
   - Type: Completed
   - Description: Completed and verified
   - Color: Green

8. **Canceled**
   - Type: Canceled
   - Description: Decided not to implement
   - Color: Red

### Workflow Settings

- **Default status for new issues:** Triage
- **Auto-archive completed issues:** After 14 days
- **Auto-archive canceled issues:** After 7 days

---

## Custom Views

Views help team members focus on their relevant work. Create views in: **Team** → **Views** → **New View**

### For Project Manager

#### View 1: PM Dashboard
- **Name:** PM Dashboard
- **Type:** All Issues
- **Filters:** None (show all)
- **Group by:** Project
- **Sort by:** Priority (descending), then Updated (newest)
- **Display:** List
- **Purpose:** High-level overview of all workstreams

#### View 2: Triage Queue
- **Name:** Triage Queue
- **Filters:**
  - Status is `Triage`
- **Group by:** None
- **Sort by:** Created date (oldest first)
- **Display:** List
- **Purpose:** Daily triage review

#### View 3: Sprint Planning
- **Name:** Sprint Planning
- **Filters:**
  - Status is `Backlog` OR `Todo`
  - Priority is `Critical` OR `High`
- **Group by:** Label contains Specialty (Connectivity, Frontend/UX, AI/Data, Product/PM)
- **Sort by:** Priority
- **Display:** List
- **Purpose:** Plan upcoming sprint work

### For Agus (Connectivity)

#### View 1: My Connectivity Work
- **Name:** My Connectivity Work
- **Filters:**
  - Assignee is `Agus` OR Label is `🔌 Connectivity`
- **Group by:** Status
- **Sort by:** Priority (descending), then Status
- **Display:** Board
- **Purpose:** Focus on channel integration tasks

#### View 2: Channel Status Board
- **Name:** Channel Status Board
- **Filters:**
  - Label is `📞 Voice` OR `💬 WhatsApp` OR `📧 Email` OR `📱 SMS`
- **Group by:** Channel label
- **Sort by:** Priority
- **Display:** Board
- **Purpose:** See status across all channels

### For Alex & Judith (Frontend/UX)

#### View 1: Frontend Tasks
- **Name:** Frontend Tasks
- **Filters:**
  - Label is `🎨 Frontend/UX`
- **Group by:** Status
- **Sort by:** Priority
- **Display:** Board
- **Purpose:** Track UI/UX work

#### View 2: QA & Testing Queue
- **Name:** QA & Testing Queue
- **Filters:**
  - Status is `Testing/QA` OR Label is `🧪 Testing`
- **Group by:** None
- **Sort by:** Priority (descending)
- **Display:** List
- **Purpose:** Items ready for QA validation

#### View 3: Component Tracker
- **Name:** Component Tracker
- **Filters:**
  - Label is `🎨 Frontend/UX`
- **Group by:** Component label
- **Sort by:** Priority
- **Display:** Board
- **Purpose:** Track work by UI component area

### For Brian (AI/Data)

#### View 1: AI Development
- **Name:** AI Development
- **Filters:**
  - Label is `🤖 AI/Data`
- **Group by:** Status
- **Sort by:** Priority
- **Display:** Board
- **Purpose:** Focus on agent and data work

#### View 2: Agent & Banking Integration
- **Name:** Agent & Banking Integration
- **Filters:**
  - Label is `🤖 AI/Data`
  - Project is `AI Agents & Intelligence`
- **Group by:** Priority
- **Sort by:** Updated (newest)
- **Display:** List
- **Purpose:** Track AI agent and banking connectivity

### Shared Views (All Team Members)

#### View 1: Current Sprint
- **Name:** Current Sprint
- **Filters:**
  - Cycle is `Current`
- **Group by:** Assignee
- **Sort by:** Status
- **Display:** Board
- **Purpose:** Team standup view

#### View 2: Blocked Items
- **Name:** Blocked Items
- **Filters:**
  - Label is `🚫 Blocked`
- **Group by:** None
- **Sort by:** Priority (descending)
- **Display:** List
- **Purpose:** Identify and resolve blockers

#### View 3: This Week
- **Name:** This Week
- **Filters:**
  - Due date is `This week` OR Updated is `Last 7 days`
- **Group by:** Assignee
- **Sort by:** Priority
- **Display:** List
- **Purpose:** Weekly team sync

---

## Issue Templates

Create templates in: **Team Settings** → **Templates**

### Template 1: Bug Report

**Name:** Bug Report  
**Emoji:** 🐛  
**Default Labels:** Bug  
**Default Project:** (none - assign during triage)  
**Template Content:**

```markdown
## Description
A clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen?

## Actual Behavior
What actually happened?

## Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Deployment: [Production/Staging/Local]

## Screenshots/Logs
Add screenshots or error logs if applicable.

## Severity
- [ ] Critical - Production down
- [ ] High - Major functionality broken
- [ ] Medium - Feature partially broken
- [ ] Low - Minor issue

## Additional Context
Any other relevant information.
```

### Template 2: Feature Request

**Name:** Feature Request  
**Emoji:** ✨  
**Default Labels:** Feature  
**Template Content:**

```markdown
## User Story
As a [type of user], I want [goal] so that [benefit].

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Design/Mockups
Add links to Figma, screenshots, or sketches if applicable.

## Technical Considerations
Any technical requirements or constraints?

## Dependencies
Does this depend on other features or issues?

## Success Metrics
How will we measure success?
```

### Template 3: Connectivity Issue

**Name:** Connectivity Issue  
**Emoji:** 🔌  
**Default Labels:** Connectivity, Bug  
**Template Content:**

```markdown
## Channel Affected
- [ ] Voice (Twilio/Vapi)
- [ ] WhatsApp
- [ ] Email (SendGrid)
- [ ] SMS

## Description
What's not working?

## Error Logs
```
Paste error logs here
```

## Webhook Details
- Endpoint: 
- Status Code: 
- Response: 

## Environment Variables
Have all required env vars been set? (Don't paste actual values)

## Test Account
Account used for testing:

## Expected Behavior
What should happen?

## Actual Behavior
What's actually happening?
```

### Template 4: Agent/AI Issue

**Name:** Agent/AI Issue  
**Emoji:** 🤖  
**Default Labels:** AI/Data  
**Template Content:**

```markdown
## Workflow/Component Affected
Which agent workflow or AI component?

## Description
What's the issue?

## Expected AI Behavior
What should the AI do?

## Actual AI Behavior
What is the AI doing?

## Test Case
```
Input: [What was sent to the AI]
Expected Output: [What should be returned]
Actual Output: [What was actually returned]
```

## Context/History
Conversation history or relevant context:

## LangGraph Logs
Any relevant logs from the agent workflow:

## Model Used
- [ ] GPT-4
- [ ] GPT-4 Turbo
- [ ] GPT-3.5
- [ ] Other: 

## Prompt Used
(If relevant, include the prompt or link to prompt file)
```

---

## Integrations

### GitHub Integration (Optional but Recommended)

1. Go to **Settings** → **Integrations**
2. Find **GitHub** and click **Add**
3. Authorize Linear to access your GitHub repo
4. Configure:
   - **Auto-link PRs:** When PR titles include issue ID (e.g., "MCC-123: Fix WhatsApp webhook")
   - **Auto-update status:** Move issue to "In Review" when PR is opened
   - **Auto-close issues:** Move to "Done" when PR is merged

### Slack/Discord Integration (Optional)

1. Go to **Settings** → **Integrations**
2. Find **Slack** or **Discord**
3. Configure notifications for:
   - New issues assigned to you
   - Issues moved to "Testing/QA"
   - Sprint completed
   - Blocked issues

---

## Next Steps

After completing this setup:

1. ✅ Verify all labels are created
2. ✅ Verify all projects are set up
3. ✅ Share views with each team member
4. ✅ Schedule first sprint planning meeting
5. ✅ Import or create initial issues from roadmap
6. ✅ Run through a test workflow (create → assign → move → complete)

## Daily Workflow

### For PM (You)
- **Morning:** Review Triage Queue, assign labels and owners
- **Daily standup:** Use "Current Sprint" view
- **Weekly:** Review "Sprint Planning" view for next cycle

### For Developers (Agus, Brian)
- Check personal views daily
- Update issue status as work progresses
- Add comments for blockers or questions

### For Designers/QA (Alex, Judith)
- Check "QA & Testing Queue" multiple times daily
- Test features and provide feedback
- Move to Done or back to In Progress based on results

---

## Support

If you need help with Linear:
- **Linear Docs:** https://linear.app/docs
- **Keyboard Shortcuts:** Press `?` in Linear
- **Team Questions:** Ask in your team channel

Happy tracking! 🚀

