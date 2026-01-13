# Linear Quick Start Guide

Get your Linear workspace up and running in 30-45 minutes.

## Prerequisites
- [ ] Linear account created (free or paid plan)
- [ ] Team members' email addresses
- [ ] This documentation open and ready

---

## Phase 1: Initial Setup (5 minutes)

### Step 1: Create Team
1. Log in to [Linear](https://linear.app)
2. Click **Settings** → **Teams**
3. Click **"New Team"**
4. Fill in:
   - Name: `Majlis Contact Center`
   - Identifier: `MCC`
   - Icon: 💬 or 📞
5. Click **Create**

### Step 2: Invite Team Members
1. Go to **Settings** → **Members**
2. Click **"Invite Members"**
3. Add emails:
   - Agus (Connectivity Engineer)
   - Alex (UX Designer / QA)
   - Judith (UX Designer / QA)
   - Brian (Data/AI Engineer)
4. Set role: **Member**
5. Send invitations

✅ **Checkpoint:** You should now have a team with 5 members (including you)

---

## Phase 2: Configure Workflow (5 minutes)

### Step 3: Set Up Workflow States
1. Go to **Team Settings** → **Workflow**
2. Create these states in order:

| State | Type | Color | Description |
|-------|------|-------|-------------|
| Triage | Unstarted | Gray | New issues awaiting review |
| Backlog | Unstarted | Light Gray | Accepted but not scheduled |
| Todo | Unstarted | Blue | Ready to work on |
| In Progress | Started | Yellow | Actively being worked on |
| In Review | Started | Orange | Code/design review needed |
| Testing/QA | Started | Purple | Ready for QA validation |
| Done | Completed | Green | Completed and verified |
| Canceled | Canceled | Red | Not implementing |

3. Set **default status** to `Triage`

### Step 4: Enable Cycles
1. Go to **Team Settings** → **Cycles**
2. Enable cycles: ✅ Yes
3. Set:
   - Duration: **2 weeks**
   - Start day: **Monday**
   - First cycle start: [Choose upcoming Monday]
4. Save

✅ **Checkpoint:** Your workflow should have 8 states, cycles enabled

---

## Phase 3: Create Labels (10 minutes)

### Step 5: Add Specialty Labels
Go to **Team Settings** → **Labels**, click **"New Label"** for each:

| Name | Color | Description |
|------|-------|-------------|
| 🔌 Connectivity | #0091FF | Agus's work: Twilio, WhatsApp, Voice, SMS |
| 🎨 Frontend/UX | #8B5CF6 | Alex & Judith's work: UI, design |
| 🤖 AI/Data | #10B981 | Brian's work: LangGraph, banking |
| 📋 Product/PM | #F59E0B | PM work: planning, coordination |

### Step 6: Add Type Labels

| Name | Color | Description |
|------|-------|-------------|
| 🐛 Bug | #EF4444 | Something broken |
| ✨ Feature | #3B82F6 | New functionality |
| 🔧 Maintenance | #6B7280 | Tech debt, refactoring |
| 📚 Documentation | #14B8A6 | Docs, guides |
| 🧪 Testing | #EC4899 | QA, test coverage |

### Step 7: Add Priority Labels

| Name | Color | Description |
|------|-------|-------------|
| 🔴 Critical | #DC2626 | Production blockers |
| 🟠 High | #EA580C | Important features |
| 🟡 Medium | #EAB308 | Standard work |
| 🟢 Low | #22C55E | Nice-to-haves |

### Step 8: Add Channel Labels

| Name | Color | Description |
|------|-------|-------------|
| 📞 Voice | #2563EB | Twilio/Vapi calls |
| 💬 WhatsApp | #16A34A | WhatsApp integration |
| 📧 Email | #DC2626 | Email channel |
| 📱 SMS | #9333EA | SMS messaging |

### Step 9: Add Component Labels

| Name | Color | Description |
|------|-------|-------------|
| Agent Desktop | #0EA5E9 | Agent interfaces |
| Analytics Dashboard | #A855F7 | Reports, charts |
| Inbox/Conversations | #10B981 | Message handling UI |
| Quality Management | #F97316 | QA evaluation |
| Settings/Config | #64748B | Configuration pages |

### Step 10: Add Special Labels

| Name | Color | Description |
|------|-------|-------------|
| 🚫 Blocked | #DC2626 | Blocked by dependencies |
| 🎯 Sprint Goal | #F59E0B | Critical for sprint |

**💡 Tip:** Open [`docs/linear-labels-config.json`](./linear-labels-config.json) and copy-paste values

✅ **Checkpoint:** You should have 21 labels total

---

## Phase 4: Create Projects (10 minutes)

Go to **Team Settings** → **Projects**, click **"New Project"** for each:

### Project 1: Channel Connectivity
- **Name:** Channel Connectivity
- **Icon:** 🔌
- **Lead:** Agus
- **Status:** In Progress
- **Description:** 
  ```
  Voice, WhatsApp, SMS, and Email channel integrations.
  Key Areas: Twilio integration, webhook handling, message delivery, call routing
  ```

### Project 2: AI Agents & Intelligence
- **Name:** AI Agents & Intelligence
- **Icon:** 🤖
- **Lead:** Brian
- **Status:** In Progress
- **Description:**
  ```
  LangGraph workflows, agent processing, banking integration.
  Key Areas: Agent workflows, intent analysis, sentiment detection, banking connectivity
  ```

### Project 3: User Experience & Interface
- **Name:** User Experience & Interface
- **Icon:** 🎨
- **Lead:** Alex
- **Status:** In Progress
- **Description:**
  ```
  Frontend components, pages, and UX improvements.
  Key Areas: UI components, agent desktop, analytics dashboards, responsive design
  ```

### Project 4: Platform Infrastructure
- **Name:** Platform Infrastructure
- **Icon:** 🏗️
- **Lead:** You (PM)
- **Status:** Ongoing
- **Description:**
  ```
  Database, deployment, security, monitoring.
  Key Areas: Supabase, Vercel, error handling, performance, monitoring
  ```

### Project 5: Testing & Quality
- **Name:** Testing & Quality
- **Icon:** 🧪
- **Lead:** Alex
- **Status:** Ongoing
- **Description:**
  ```
  Testing processes, QA workflows, bug management.
  Key Areas: Integration tests, UI testing, bug triage, regression testing
  ```

### Project 6: Documentation & Demos
- **Name:** Documentation & Demos
- **Icon:** 📖
- **Lead:** You (PM)
- **Status:** Ongoing
- **Description:**
  ```
  Documentation, demo setup, client-facing materials.
  Key Areas: Setup guides, API docs, demo configuration
  ```

**💡 Tip:** See [`docs/linear-projects-config.json`](./linear-projects-config.json) for full details

✅ **Checkpoint:** You should have 6 projects

---

## Phase 5: Create Custom Views (10-15 minutes)

### Views for You (Project Manager)

#### View 1: PM Dashboard
1. Click **Team** → **Views** → **New View**
2. Name: `PM Dashboard`
3. Filter: All issues (no filter)
4. Group by: **Project**
5. Sort by: **Priority** (descending), then **Updated** (newest)
6. Display: **List**
7. Save

#### View 2: Triage Queue
1. New View
2. Name: `Triage Queue`
3. Filter: Status is **Triage**
4. Group by: None
5. Sort by: **Created** (oldest first)
6. Display: **List**
7. Save

#### View 3: Sprint Planning
1. New View
2. Name: `Sprint Planning`
3. Filter: 
   - Status is **Backlog** OR **Todo**
   - Priority is **Critical** OR **High**
4. Group by: **Label** (specialty labels)
5. Sort by: **Priority**
6. Display: **List**
7. Save

### Views for Agus

#### View 1: My Connectivity Work
1. New View
2. Name: `My Connectivity Work`
3. Filter:
   - Assignee is **Agus** OR
   - Label is **🔌 Connectivity**
4. Group by: **Status**
5. Sort by: **Priority**, then **Status**
6. Display: **Board**
7. Save

#### View 2: Channel Status Board
1. New View
2. Name: `Channel Status Board`
3. Filter: Label is any of (Voice, WhatsApp, Email, SMS)
4. Group by: **Label** (channel labels)
5. Sort by: **Priority**
6. Display: **Board**
7. Save

### Views for Alex & Judith

#### View 1: Frontend Tasks
1. New View
2. Name: `Frontend Tasks`
3. Filter: Label is **🎨 Frontend/UX**
4. Group by: **Status**
5. Sort by: **Priority**
6. Display: **Board**
7. Save

#### View 2: QA & Testing Queue
1. New View
2. Name: `QA & Testing Queue`
3. Filter: 
   - Status is **Testing/QA** OR
   - Label is **🧪 Testing**
4. Group by: None
5. Sort by: **Priority**
6. Display: **List**
7. Save

#### View 3: Component Tracker
1. New View
2. Name: `Component Tracker`
3. Filter: Label is **🎨 Frontend/UX**
4. Group by: **Label** (component labels)
5. Sort by: **Priority**
6. Display: **Board**
7. Save

### Views for Brian

#### View 1: AI Development
1. New View
2. Name: `AI Development`
3. Filter: Label is **🤖 AI/Data**
4. Group by: **Status**
5. Sort by: **Priority**
6. Display: **Board**
7. Save

#### View 2: Agent & Banking Integration
1. New View
2. Name: `Agent & Banking Integration`
3. Filter:
   - Label is **🤖 AI/Data** AND
   - Project is **AI Agents & Intelligence**
4. Group by: **Priority**
5. Sort by: **Updated** (newest)
6. Display: **List**
7. Save

### Shared Views (All Team)

#### View 1: Current Sprint
1. New View
2. Name: `Current Sprint`
3. Filter: Cycle is **Current**
4. Group by: **Assignee**
5. Sort by: **Status**
6. Display: **Board**
7. Save

#### View 2: Blocked Items
1. New View
2. Name: `Blocked Items`
3. Filter: Label is **🚫 Blocked**
4. Group by: None
5. Sort by: **Priority**
6. Display: **List**
7. Save

#### View 3: This Week
1. New View
2. Name: `This Week`
3. Filter:
   - Due date is **This week** OR
   - Updated is **Last 7 days**
4. Group by: **Assignee**
5. Sort by: **Priority**
6. Display: **List**
7. Save

**💡 Tip:** See [`docs/linear-views-config.json`](./linear-views-config.json) for reference

✅ **Checkpoint:** You should have 13 views total

---

## Phase 6: Final Configuration (5 minutes)

### Step 11: Issue Templates
Linear doesn't support template imports, but you can:

1. Bookmark [`docs/linear-templates/`](./linear-templates/) folder
2. Share template links with team
3. Team copies templates when creating issues
4. (Optional) Set up saved replies in Linear for common sections

### Step 12: Set Team Preferences
1. Go to **Team Settings** → **General**
2. Configure:
   - Default issue status: **Triage** ✅
   - Auto-close completed: **After 14 days** ✅
   - Auto-archive canceled: **After 7 days** ✅

### Step 13: Set Your Personal Preferences
1. Go to **Personal Settings** → **Preferences**
2. Set:
   - Notifications: Enable for assignments and mentions
   - Email notifications: Daily digest or real-time (your choice)
   - Keyboard shortcuts: Learn them! (Press `?` to see list)

✅ **Checkpoint:** Basic configuration complete!

---

## Phase 7: Team Onboarding (Do this with the team)

### Step 14: Share Views with Team
1. Schedule 15-minute team meeting
2. Share screen and walk through:
   - How workflow states work
   - What labels to use
   - Which views each person should use
   - How to create issues
3. Share links to documentation:
   - [Linear Setup Guide](./LINEAR_SETUP_GUIDE.md)
   - [Team Roles](./TEAM_ROLES_AND_RESPONSIBILITIES.md)
   - [Issue Templates](./linear-templates/)

### Step 15: Create Test Issues
Have each team member create a test issue:

**Agus:** Create a test connectivity issue
**Alex:** Create a test UI issue
**Judith:** Create a test QA issue
**Brian:** Create a test AI issue

Walk through:
1. Creating issue
2. Adding labels
3. Moving through workflow
4. Adding comments
5. Closing issue

### Step 16: First Triage Session
1. Create 3-5 real issues from your backlog
2. Walk team through triage process:
   - Review issue in Triage Queue
   - Add labels (specialty, type, priority)
   - Assign to team member
   - Add to project
   - Move to Backlog or Todo

✅ **Checkpoint:** Team knows how to use Linear!

---

## Phase 8: First Sprint (Do within 1 week)

### Step 17: Plan First Sprint
1. Schedule sprint planning meeting (1 hour)
2. Use **"Sprint Planning"** view
3. Review prioritized backlog items
4. Each person picks 3-5 issues for the sprint
5. Mark selected issues with current cycle
6. Set sprint goal (e.g., "Stabilize WhatsApp connectivity")

### Step 18: Start Daily Standups
1. Schedule daily 15-minute standup
2. Use **"Current Sprint"** view
3. Each person shares:
   - What I did yesterday
   - What I'm doing today
   - Any blockers

### Step 19: Establish PM Triage Routine
As PM, commit to:
- Check **"Triage Queue"** every morning (10-15 mins)
- Check **"Blocked Items"** view daily
- Review **"PM Dashboard"** for overall status
- Update team on any priority changes

✅ **Checkpoint:** First sprint is running!

---

## Completion Checklist

Before considering setup complete, verify:

**Team Setup:**
- [ ] Team created with 5 members
- [ ] All team members have accepted invitations
- [ ] Team members can log in to Linear

**Workflow:**
- [ ] 8 workflow states configured
- [ ] Default state is "Triage"
- [ ] Cycles enabled (2-week duration)
- [ ] First cycle started or scheduled

**Labels:**
- [ ] 4 specialty labels (Connectivity, Frontend/UX, AI/Data, Product/PM)
- [ ] 5 type labels (Bug, Feature, Maintenance, Documentation, Testing)
- [ ] 4 priority labels (Critical, High, Medium, Low)
- [ ] 4 channel labels (Voice, WhatsApp, Email, SMS)
- [ ] 5 component labels (Agent Desktop, Analytics, etc.)
- [ ] 2 special labels (Blocked, Sprint Goal)
- [ ] Total: 21 labels ✅

**Projects:**
- [ ] 6 projects created with leads assigned
- [ ] Each project has description and key areas

**Views:**
- [ ] 3 PM views (Dashboard, Triage, Sprint Planning)
- [ ] 2 Agus views (Connectivity Work, Channel Board)
- [ ] 3 Alex/Judith views (Frontend, QA Queue, Component Tracker)
- [ ] 2 Brian views (AI Development, Agent & Banking)
- [ ] 3 Shared views (Current Sprint, Blocked, This Week)
- [ ] Total: 13 views ✅

**Team Readiness:**
- [ ] Team has been onboarded
- [ ] Test issues created and completed
- [ ] First triage session completed
- [ ] Issue templates bookmarked and shared
- [ ] Daily standup scheduled
- [ ] Sprint planning scheduled

**Documentation:**
- [ ] Team has access to this documentation
- [ ] Templates folder bookmarked
- [ ] Team roles document reviewed

---

## Next Steps

### Immediate (This Week)
1. Run first sprint planning
2. Start daily standups using "Current Sprint" view
3. Do daily triage of new issues
4. Monitor "Blocked Items" view

### Within 2 Weeks
1. Complete first sprint
2. Run sprint review (demo completed work)
3. Run retrospective (improve process)
4. Plan second sprint
5. Adjust workflow/views based on feedback

### Ongoing
1. Maintain daily triage routine
2. Keep views organized and relevant
3. Update documentation as processes evolve
4. Gather team feedback and iterate

---

## Troubleshooting

### Team Members Can't See Views
- Views are team-visible by default, but check view settings
- Make sure they're filtering correctly (e.g., Agus should be assigned issues)

### Too Many Labels
- Start with the core ones, add more later if needed
- You can archive unused labels

### Workflow Not Working
- Make sure status order makes sense
- Verify default status is "Triage"
- Train team on when to move issues

### Views Are Overwhelming
- Start with just 2-3 key views per person
- Add more as team gets comfortable

### Issues in Wrong State
- Remind team to update status as they work
- Make it part of daily standup checklist

---

## Resources

- **[Complete Setup Guide](./LINEAR_SETUP_GUIDE.md)** - Detailed instructions
- **[Team Roles](./TEAM_ROLES_AND_RESPONSIBILITIES.md)** - Who does what
- **[Issue Templates](./linear-templates/)** - Template files
- **[Linear Docs](https://linear.app/docs)** - Official documentation
- **Keyboard Shortcuts:** Press `?` in Linear

---

## Questions?

If you run into issues:
1. Check the [Linear Setup Guide](./LINEAR_SETUP_GUIDE.md)
2. Search Linear documentation
3. Ask in team channel
4. Contact Linear support (they're very responsive!)

---

**Time to complete:** 30-45 minutes  
**Your progress:** [___________] 

Good luck with your Linear setup! 🚀

