# Team Roles and Responsibilities - Majlis Contact Center

This document outlines the roles, responsibilities, and workflows for each team member.

## Table of Contents
1. [Team Overview](#team-overview)
2. [Project Manager](#project-manager-you)
3. [Connectivity Engineer](#connectivity-engineer-agus)
4. [UX Designers / QA](#ux-designers--qa-alex--judith)
5. [Data/AI Engineer](#dataai-engineer-brian)
6. [Daily Workflows](#daily-workflows)
7. [Communication Guidelines](#communication-guidelines)

---

## Team Overview

**Team Name:** Majlis Contact Center  
**Project:** AI-powered omnichannel customer engagement platform  
**Methodology:** Hybrid (2-week sprints for features + continuous kanban for bugs/maintenance)

### Team Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Project Manager                       │
│                         (You)                           │
│                  Planning & Coordination                 │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────────────┐   ┌───────────────┐   ┌──────────────┐
│   Agus        │   │  Alex & Judith│   │    Brian     │
│  Connectivity │   │  Frontend/UX  │   │   AI/Data    │
│   Engineer    │   │  Designers/QA │   │   Engineer   │
└───────────────┘   └───────────────┘   └──────────────┘
│                   │                   │
│ Channels          │ UI/UX             │ Agents
│ - Voice           │ - Components      │ - LangGraph
│ - WhatsApp        │ - Pages           │ - Intent
│ - Email           │ - Analytics       │ - Sentiment
│ - SMS             │ - QA/Testing      │ - Banking DB
└───────────────┘   └───────────────┘   └──────────────┘
```

---

## Project Manager (You)

### Primary Responsibilities

#### Planning & Strategy
- Define product roadmap and priorities
- Align team efforts with business goals
- Make go/no-go decisions on features
- Manage stakeholder expectations
- Define success metrics

#### Daily Operations
- **Daily Triage:** Review new issues in "Triage Queue" every morning
- **Sprint Planning:** Lead 2-week sprint planning sessions
- **Blockers:** Identify and help resolve team blockers
- **Documentation:** Maintain project documentation and demos

#### Team Coordination
- Facilitate communication between team members
- Balance workload across the team
- Conduct weekly sync meetings
- Run sprint reviews and retrospectives

### Linear Workflow

#### Daily Triage Process (Every Morning - 15 mins)
1. Open **"Triage Queue"** view in Linear
2. For each new issue:
   - Read description and understand the request
   - Add appropriate labels:
     - **Specialty:** 🔌 Connectivity, 🎨 Frontend/UX, 🤖 AI/Data, or 📋 Product/PM
     - **Type:** 🐛 Bug, ✨ Feature, 🔧 Maintenance, 📚 Documentation, or 🧪 Testing
     - **Priority:** 🔴 Critical, 🟠 High, 🟡 Medium, or 🟢 Low
     - **Channel/Component:** Add relevant channel or component labels
   - Assign to appropriate team member:
     - Connectivity issues → Agus
     - UI/UX/Design → Alex or Judith (balance workload)
     - AI/Agents/Banking → Brian
     - Documentation → Keep for yourself or delegate
   - Add to relevant Project
   - Move to **Backlog** (or **Todo** if urgent)

3. For Critical/High priority items:
   - Alert the assigned team member
   - Consider adding to current sprint

#### Sprint Planning (Every 2 Weeks - Monday)
1. Open **"Sprint Planning"** view
2. Review Backlog items with team
3. Each person picks issues for the cycle
4. Mark selected issues with current cycle
5. Set sprint goals
6. Estimate effort and capacity

#### Weekly Monitoring
- Use **"PM Dashboard"** to get overview of all projects
- Check **"Blocked Items"** view daily
- Review **"Current Sprint"** progress mid-week
- Prepare for sprint review on Friday

### Custom Linear Views to Use
- **PM Dashboard** - Daily overview
- **Triage Queue** - Morning triage
- **Sprint Planning** - Sprint planning meetings
- **Current Sprint** - Team standup
- **Blocked Items** - Blocker management

### Communication Patterns
- **Daily standup:** Use "Current Sprint" view, 15 mins max
- **Weekly sync:** Review progress, discuss blockers, plan ahead
- **Sprint review:** Demo completed work, gather feedback
- **Sprint retro:** Discuss what went well, what to improve

### Issue Templates to Use
- Feature Request (when defining new features)
- Documentation issues
- Any cross-functional issues

---

## Connectivity Engineer (Agus)

### Primary Responsibilities

#### Channel Integration
- Implement and maintain Twilio Voice integration
- Develop WhatsApp Business API connectivity
- Configure SendGrid email integration
- Set up SMS gateway
- Ensure reliable message delivery across all channels

#### Webhook Management
- Implement webhook endpoints for incoming messages/calls
- Handle webhook security and validation
- Debug webhook failures
- Monitor webhook health and performance

#### API Integration
- Integrate with Twilio APIs
- Configure Vapi for voice AI
- Connect SendGrid for emails
- Implement proper error handling and retries

### Technical Focus Areas
- **Files to work on:**
  - `app/api/twilio/*` - Twilio webhook handlers
  - `lib/twilio-client.ts` - Twilio SDK wrapper
  - `lib/vapi-client.ts` - Vapi integration
  - `lib/twilio.ts` - Twilio utilities

- **Key integrations:**
  - Twilio Voice (calls)
  - Twilio WhatsApp (messaging)
  - Twilio SMS (text messages)
  - Vapi (AI voice assistant)
  - SendGrid (email)

### Linear Workflow

#### Daily Tasks
1. Check **"My Connectivity Work"** view first thing
2. Focus on issues in **In Progress** status
3. Update issue status as you work:
   - Move to **In Review** when ready for code review
   - Comment with technical details or blockers
4. Check **"Channel Status Board"** to see status across all channels

#### When Working on Issues
1. Move issue to **In Progress**
2. Create feature branch
3. Implement the connectivity feature or fix
4. Test with Twilio/SendGrid test accounts
5. Update issue with test results
6. Move to **In Review** and request code review
7. After review approval, move to **Testing/QA**
8. Once Alex/Judith validate, move to **Done**

#### Common Tasks
- Debug webhook issues (use Twilio debugger)
- Test message delivery end-to-end
- Monitor Twilio logs for errors
- Configure new phone numbers or WhatsApp Business accounts
- Update environment variables for connectivity

### Custom Linear Views to Use
- **My Connectivity Work** - Main daily view
- **Channel Status Board** - See all channels at a glance
- **Current Sprint** - Sprint progress
- **Blocked Items** - If waiting on external APIs

### Issue Templates to Use
- Connectivity Issue Template (for bugs)
- Feature Request (for new channel features)

### Communication Patterns
- Comment in Linear when:
  - You're blocked by external APIs
  - You need credentials or access
  - Testing requires specific phone numbers
- Update PM if channel integration is delayed
- Share test accounts with QA for validation

---

## UX Designers / QA (Alex & Judith)

### Primary Responsibilities

#### UX Design
- Design intuitive agent-facing interfaces
- Create responsive layouts for all screen sizes
- Ensure consistent design language across platform
- Conduct user research and usability testing
- Create mockups and prototypes in Figma

#### Frontend Development
- Implement React components with TypeScript
- Build pages using Next.js
- Style components with Tailwind CSS
- Ensure accessibility (WCAG 2.1 AA compliance)
- Optimize frontend performance

#### Quality Assurance
- Test new features across browsers and devices
- Validate UI/UX implementations against designs
- Perform regression testing
- Create and maintain test cases
- Report and verify bug fixes

### Technical Focus Areas
- **Files to work on:**
  - `components/*` - All UI components
  - `app/(dashboard)/*` - All dashboard pages
  - `components/ui/*` - Base UI components
  - `styles/globals.css` - Global styles

- **Key areas:**
  - Agent Desktop interface
  - Analytics dashboards
  - Inbox/Conversations UI
  - Quality Management pages
  - Settings and configuration pages

### Linear Workflow

#### Alex & Judith - Split Responsibilities
- **Alex focus:** Agent Desktop, Analytics, complex interactions
- **Judith focus:** Inbox, Quality Management, responsive design
- **Shared:** QA/Testing for all features

#### Daily Tasks - Design/Development
1. Check **"Frontend Tasks"** view every morning
2. Pick issues from **Todo** that need design or development
3. For design work:
   - Create mockups in Figma
   - Attach designs to Linear issue
   - Request PM feedback
4. For development work:
   - Move to **In Progress**
   - Implement component or page
   - Test locally across breakpoints
   - Move to **In Review** for code review
   - After review, move to **Testing/QA** for peer QA

#### Daily Tasks - QA
1. Check **"QA & Testing Queue"** multiple times per day
2. For each issue in Testing/QA:
   - Review acceptance criteria
   - Test on multiple browsers (Chrome, Safari, Firefox)
   - Test on mobile and desktop
   - Test keyboard navigation and accessibility
   - Verify against Figma designs (if applicable)
   - **Pass:** Move to **Done**, add comment "✅ QA Pass"
   - **Fail:** Move back to **In Progress**, add comment with findings

#### Component Organization
- Use **"Component Tracker"** view to see work grouped by component area
- Ensure consistency across similar components
- Update design system as you create new patterns

### Custom Linear Views to Use
- **Frontend Tasks** - Main work board
- **QA & Testing Queue** - QA work (check frequently)
- **Component Tracker** - See work by component
- **Current Sprint** - Sprint progress
- **This Week** - Weekly planning

### Issue Templates to Use
- UI/UX Issue Template (for bugs and improvements)
- Feature Request (for new UI features)
- Bug Report (for general bugs found during QA)

### Communication Patterns
- **Design reviews:** Tag PM in Linear when designs are ready
- **QA failures:** Comment clearly what's broken, attach screenshots
- **Accessibility issues:** Flag immediately with 🟠 High priority
- **Cross-browser bugs:** Note which browsers are affected
- **Coordination:** Alex and Judith should coordinate on shared components

### QA Checklist (Use for every feature)
- [ ] Works in Chrome, Safari, Firefox
- [ ] Responsive on mobile (< 768px)
- [ ] Responsive on tablet (768px - 1024px)
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (test with VoiceOver/NVDA)
- [ ] No console errors
- [ ] Matches Figma design
- [ ] Loading states work correctly
- [ ] Error states work correctly
- [ ] Interactions are smooth (no jank)

---

## Data/AI Engineer (Brian)

### Primary Responsibilities

#### AI Agent Development
- Develop and maintain LangGraph workflows
- Implement intent analysis
- Build sentiment detection
- Create AI response generation logic
- Optimize prompts for better AI performance
- Tune AI models and parameters

#### Banking Integration
- Connect to banking database securely
- Implement data queries for customer information
- Ensure data privacy and security
- Build APIs for banking data access
- Handle authentication and authorization

#### Data Pipeline
- Design data flow from channels to AI to storage
- Optimize database queries
- Implement caching where appropriate
- Monitor AI performance and costs

### Technical Focus Areas
- **Files to work on:**
  - `lib/agents/*` - All AI agent code
  - `lib/banking/*` - Banking integration
  - `lib/tools/*` - Agent tools
  - `app/api/agents/*` - Agent API endpoints

- **Key technologies:**
  - LangGraph for agent workflows
  - OpenAI API for LLM
  - LangChain for conversation management
  - Supabase for database
  - Banking database (external)

### Linear Workflow

#### Daily Tasks
1. Check **"AI Development"** view every morning
2. Focus on issues in **In Progress**
3. For AI issues:
   - Test with various conversation inputs
   - Monitor AI response quality
   - Check LangGraph logs
   - Adjust prompts or workflow as needed
4. For banking issues:
   - Ensure secure connections
   - Test data retrieval
   - Verify data privacy compliance

#### When Working on Agent Issues
1. Move issue to **In Progress**
2. Identify which agent component needs work
3. Test current behavior with sample inputs
4. Implement fix or improvement
5. Test with multiple scenarios:
   - Happy path
   - Edge cases
   - Error conditions
6. Check logs and AI response quality
7. Update issue with test results and metrics
8. Move to **In Review** for code review
9. After review, move to **Testing/QA** for QA validation
10. Move to **Done** after QA passes

#### AI Testing Process
For each AI change, test:
- **Intent classification:** Does it identify the correct intent?
- **Sentiment analysis:** Does it detect sentiment accurately?
- **Response quality:** Is the AI response helpful and on-brand?
- **Escalation logic:** Does it escalate when appropriate?
- **Performance:** Response time under 3 seconds?
- **Cost:** Token usage reasonable?

#### Banking Integration Process
- Always test with test data first
- Verify PII handling and redaction
- Check logs for sensitive data exposure
- Ensure proper error handling for DB failures
- Test connection retry logic

### Custom Linear Views to Use
- **AI Development** - Main work board
- **Agent & Banking Integration** - Focused on AI/banking work
- **Current Sprint** - Sprint progress
- **Blocked Items** - If waiting on banking DB access

### Issue Templates to Use
- AI Agent Issue Template (for AI-related bugs and features)
- Bug Report (for general bugs)
- Feature Request (for new AI capabilities)

### Communication Patterns
- **AI Performance:** Report in Linear if response times are slow or token costs are high
- **Banking Access:** Coordinate with PM for banking DB credentials and access
- **Prompt Changes:** Document significant prompt changes in Linear
- **Model Changes:** Alert team before switching models (e.g., GPT-4 to GPT-3.5)
- **Blockers:** Flag immediately if OpenAI API or banking DB is down

### AI Development Best Practices
- Log all AI requests for debugging
- Version control prompts
- Monitor token usage and costs
- Test with diverse conversation scenarios
- Keep system prompts in separate files
- Document expected AI behavior
- Use feature flags for experimental features

---

## Daily Workflows

### Morning Routine (All Team Members)

**9:00 AM - 9:15 AM: Check Linear**
- **PM:** Triage new issues
- **Agus:** Check "My Connectivity Work"
- **Alex & Judith:** Check "Frontend Tasks" and "QA & Testing Queue"
- **Brian:** Check "AI Development"

**9:15 AM - 9:30 AM: Daily Standup**
- Use "Current Sprint" view
- Each person shares:
  - What I did yesterday
  - What I'm doing today
  - Any blockers
- Keep it to 15 minutes max

### Throughout the Day

**Everyone:**
- Update issue status as you work
- Comment on issues with progress or questions
- Tag team members when you need input
- Move issues to **In Review** when ready
- Review PRs when tagged

**QA (Alex & Judith):**
- Check "QA & Testing Queue" 2-3 times per day
- Test items promptly so they don't block development
- Report failures quickly with clear details

### End of Day

**Everyone:**
- Update issue status if you forgot
- Comment on any blockers for next day
- Check for urgent messages in Linear

### Weekly Rhythm

**Monday:**
- Sprint planning meeting (if new sprint)
- Review "Sprint Planning" view
- Commit to sprint goals

**Wednesday:**
- Mid-sprint check-in
- PM reviews progress
- Address any blockers

**Friday:**
- Sprint review/demo
- Show completed work
- Sprint retrospective (what went well, what to improve)

---

## Communication Guidelines

### Where to Communicate

#### Linear (Primary)
- All issue discussions
- Feature requests
- Bug reports
- Progress updates
- Blockers
- Questions about specific work

#### Slack/Teams (if used)
- Urgent notifications
- General team chat
- Quick questions
- Social/team building

#### Email
- External stakeholder communication
- Formal documentation
- Meeting invites

### Linear Communication Best Practices

#### Writing Clear Issue Descriptions
- **Bad:** "Fix the thing"
- **Good:** "WhatsApp messages not sending - returns 500 error from /api/twilio/whatsapp/send endpoint"

#### Commenting on Issues
- Be specific and actionable
- Attach screenshots, logs, or error messages
- Tag people with @mention when you need their input
- Update when you make progress

#### Using Labels Effectively
- Always add at least 3 labels:
  1. Specialty (who works on it)
  2. Type (what kind of work)
  3. Priority (how urgent)

#### Status Updates
- Move issues through workflow promptly
- Don't let issues sit in "In Progress" for days without updates
- Comment when you're blocked

### Blocker Escalation

If you're blocked:
1. Add 🚫 Blocked label to issue
2. Comment explaining the blocker
3. Tag PM and relevant team members
4. Suggest potential solutions if possible

PM will:
1. Check "Blocked Items" view daily
2. Help resolve blockers quickly
3. Reassign if needed

### Cross-Team Coordination

**Connectivity ↔️ AI:**
- Agus: Ensures message data reaches AI correctly
- Brian: Processes messages and returns responses

**Connectivity ↔️ Frontend:**
- Agus: Provides API endpoints for frontend to call
- Alex/Judith: Test connectivity features in UI

**AI ↔️ Frontend:**
- Brian: Provides AI response data structure
- Alex/Judith: Display AI responses in UI

**Tag each other in Linear when:**
- You need clarification on requirements
- You're making changes that affect their work
- You've completed something they were waiting for

---

## Sprint Ceremonies

### Sprint Planning (Monday, 1 hour)
**Participants:** All team members  
**Goal:** Plan work for next 2 weeks

**Agenda:**
1. Review sprint goals
2. PM presents prioritized backlog
3. Team discusses and estimates issues
4. Each person picks issues for sprint
5. Commit to sprint goal

**Use "Sprint Planning" view**

### Daily Standup (Every day, 15 mins)
**Participants:** All team members  
**Goal:** Sync on progress and blockers

**Format:**
- Each person: Yesterday / Today / Blockers
- Keep it brief
- Take detailed discussions offline

**Use "Current Sprint" view**

### Sprint Review (Friday, 30 mins)
**Participants:** All team members + stakeholders  
**Goal:** Demo completed work

**Agenda:**
1. Demo each completed feature
2. Gather feedback
3. Update backlog based on feedback

### Sprint Retrospective (Friday, 30 mins)
**Participants:** Team members only  
**Goal:** Improve processes

**Agenda:**
1. What went well?
2. What didn't go well?
3. What will we change next sprint?

---

## Escalation Paths

### Technical Blockers
1. Try to solve it yourself (30 mins max)
2. Ask team member with relevant expertise
3. Escalate to PM if still blocked
4. PM coordinates with external parties if needed

### Priority Conflicts
1. Check with PM if unsure about priority
2. PM makes final decision on priorities
3. Critical bugs always take priority over new features

### Scope Questions
1. Check issue description and acceptance criteria
2. Comment in Linear with your question
3. Tag PM for clarification
4. PM updates issue with clarified scope

---

## Success Metrics

### Team Velocity
- Track completed story points per sprint
- Aim for consistent velocity
- Adjust estimates based on historical data

### Quality Metrics
- Zero critical bugs in production
- All features pass QA before going to Done
- Minimal bugs reported after release

### Collaboration Metrics
- Issues moving smoothly through workflow
- Quick response time to blockers (< 1 day)
- Clear communication in Linear

### Individual Accountability
- Update issue status same day
- Meet sprint commitments
- Proactive communication about blockers

---

## Resources

### Documentation
- [Linear Setup Guide](./LINEAR_SETUP_GUIDE.md) - How to set up Linear
- [Backend Architecture](../BACKEND_ARCHITECTURE.md) - System architecture
- [Demo Setup](../PUBLIC_DEMO_SETUP.md) - How to run demos

### Linear Resources
- [Linear Keyboard Shortcuts](https://linear.app/shortcuts) - Press `?` in Linear
- [Linear Documentation](https://linear.app/docs)

### Project Resources
- **Twilio Dashboard:** For connectivity debugging (Agus)
- **Figma:** For design files (Alex & Judith)
- **OpenAI Dashboard:** For AI usage monitoring (Brian)
- **Supabase Dashboard:** For database queries (Brian, Agus)

---

## Quick Reference

### Issue Lifecycle
```
Triage → Backlog → Todo → In Progress → In Review → Testing/QA → Done
```

### Label Categories
- **Specialty:** 🔌 Connectivity, 🎨 Frontend/UX, 🤖 AI/Data, 📋 Product/PM
- **Type:** 🐛 Bug, ✨ Feature, 🔧 Maintenance, 📚 Documentation, 🧪 Testing
- **Priority:** 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low
- **Channel:** 📞 Voice, 💬 WhatsApp, 📧 Email, 📱 SMS
- **Component:** Agent Desktop, Analytics Dashboard, Inbox/Conversations, Quality Management, Settings/Config

### Who Does What
- **Connectivity issues** → Agus
- **UI/Design/QA** → Alex or Judith
- **AI/Agents/Banking** → Brian
- **Documentation/Planning** → PM

---

**Questions?** Ask in the team channel or tag @PM in Linear!

