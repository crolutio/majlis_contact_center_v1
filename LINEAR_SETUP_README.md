# Linear Workspace Setup - Majlis Contact Center

> Complete documentation and resources for setting up and managing your Linear workspace

## 📋 Quick Navigation

| Document | Purpose | Time Required |
|----------|---------|---------------|
| **[Quick Start Guide](./docs/LINEAR_QUICK_START.md)** | Step-by-step setup checklist | 30-45 minutes |
| **[Complete Setup Guide](./docs/LINEAR_SETUP_GUIDE.md)** | Detailed configuration instructions | Reference |
| **[Team Roles & Responsibilities](./docs/TEAM_ROLES_AND_RESPONSIBILITIES.md)** | Who does what, daily workflows | Reference |
| **[Issue Templates](./docs/linear-templates/)** | Templates for creating issues | As needed |
| **Configuration Files** | JSON configs for reference | Reference |

---

## 🚀 Getting Started

### New to Linear?
Start here: **[Linear Quick Start Guide](./docs/LINEAR_QUICK_START.md)**

This guide walks you through:
1. Creating your team (5 mins)
2. Setting up workflow states (5 mins)
3. Creating labels (10 mins)
4. Setting up projects (10 mins)
5. Creating custom views (15 mins)
6. Onboarding your team (ongoing)

**Total setup time: 30-45 minutes**

### Need Detailed Instructions?
See: **[Complete Linear Setup Guide](./docs/LINEAR_SETUP_GUIDE.md)**

Includes:
- Comprehensive instructions for every step
- Best practices and tips
- Troubleshooting guidance
- Integration setup (GitHub, Slack)

---

## 👥 Your Team Structure

### Team: Majlis Contact Center

```
Project Manager (You)
├── Agus - Connectivity Engineer
│   └── Focus: Voice, WhatsApp, Email, SMS channels
├── Alex - UX Designer / QA
│   └── Focus: UI components, frontend, QA testing
├── Judith - UX Designer / QA
│   └── Focus: UI/UX design, responsive design, QA
└── Brian - Data/AI Engineer
    └── Focus: LangGraph agents, banking integration
```

**Workflow:** Hybrid (2-week sprints + continuous kanban)

**Learn more:** [Team Roles & Responsibilities](./docs/TEAM_ROLES_AND_RESPONSIBILITIES.md)

---

## 📊 What Gets Created

### 8 Workflow States
```
Triage → Backlog → Todo → In Progress → In Review → Testing/QA → Done
                                                                    ↓
                                                              Canceled
```

### 21 Labels (Organized)
- **Specialty** (4): Connectivity, Frontend/UX, AI/Data, Product/PM
- **Type** (5): Bug, Feature, Maintenance, Documentation, Testing
- **Priority** (4): Critical, High, Medium, Low
- **Channel** (4): Voice, WhatsApp, Email, SMS
- **Component** (5): Agent Desktop, Analytics, Inbox, Quality, Settings
- **Special** (2): Blocked, Sprint Goal

### 6 Projects
1. 🔌 **Channel Connectivity** (Agus)
2. 🤖 **AI Agents & Intelligence** (Brian)
3. 🎨 **User Experience & Interface** (Alex & Judith)
4. 🏗️ **Platform Infrastructure** (PM)
5. 🧪 **Testing & Quality** (Alex & Judith)
6. 📖 **Documentation & Demos** (PM)

### 13 Custom Views
- **PM Views** (3): Dashboard, Triage Queue, Sprint Planning
- **Agus Views** (2): My Connectivity Work, Channel Status Board
- **Alex/Judith Views** (3): Frontend Tasks, QA Queue, Component Tracker
- **Brian Views** (2): AI Development, Agent & Banking Integration
- **Shared Views** (3): Current Sprint, Blocked Items, This Week

---

## 📝 Configuration Files Reference

Located in `docs/`:

### [linear-labels-config.json](./docs/linear-labels-config.json)
Complete label definitions with colors and descriptions. Use this as reference when creating labels in Linear UI.

**Structure:**
```json
{
  "labels": {
    "specialty": [...],
    "type": [...],
    "priority": [...],
    "channel": [...],
    "component": [...]
  }
}
```

### [linear-projects-config.json](./docs/linear-projects-config.json)
Project definitions with owners, descriptions, key areas, and milestones.

**Structure:**
```json
{
  "projects": [
    {
      "name": "Channel Connectivity",
      "lead": "Agus",
      "keyAreas": [...],
      "milestones": [...]
    }
  ]
}
```

### [linear-views-config.json](./docs/linear-views-config.json)
Custom view configurations for each team member with filters, grouping, and sorting.

**Structure:**
```json
{
  "views": {
    "projectManager": [...],
    "agus": [...],
    "alexJudith": [...],
    "brian": [...],
    "shared": [...]
  }
}
```

---

## 📄 Issue Templates

Located in `docs/linear-templates/`:

### Available Templates

1. **[Bug Report](./docs/linear-templates/bug-report-template.md)**
   - For any broken functionality
   - Includes steps to reproduce, environment details
   - Labels: 🐛 Bug + specialty + priority

2. **[Feature Request](./docs/linear-templates/feature-request-template.md)**
   - For new features or enhancements
   - Includes user story, acceptance criteria
   - Labels: ✨ Feature + specialty + priority

3. **[Connectivity Issue](./docs/linear-templates/connectivity-issue-template.md)**
   - For Voice, WhatsApp, Email, SMS issues
   - Includes webhook details, error logs
   - Assign to: Agus

4. **[AI Agent Issue](./docs/linear-templates/ai-agent-issue-template.md)**
   - For LangGraph, intent, sentiment, banking issues
   - Includes test cases, AI behavior
   - Assign to: Brian

5. **[UI/UX Issue](./docs/linear-templates/ui-ux-issue-template.md)**
   - For frontend, design, accessibility issues
   - Includes screenshots, device info
   - Assign to: Alex or Judith

**Usage:** Copy template content when creating issues in Linear

---

## 🔄 Daily Workflows

### For Project Manager (You)

**Every Morning (15 mins):**
1. Open "Triage Queue" view
2. Review new issues
3. Add labels (specialty, type, priority)
4. Assign to team members
5. Move to Backlog or Todo

**Daily Standup (15 mins):**
- Use "Current Sprint" view
- Each person shares progress and blockers

**Weekly:**
- Check "PM Dashboard" for overview
- Review "Blocked Items"
- Sprint planning every 2 weeks

### For Developers (Agus, Brian)

**Daily:**
1. Check your personal view (e.g., "My Connectivity Work")
2. Move issues to "In Progress" as you work
3. Update status when done → "In Review"
4. After review → "Testing/QA"

### For Designers/QA (Alex, Judith)

**Daily:**
1. Check "Frontend Tasks" for design/dev work
2. Check "QA & Testing Queue" 2-3 times daily
3. Test features in Testing/QA status
4. Move to "Done" (pass) or back to "In Progress" (fail)

**Full workflows:** [Team Roles & Responsibilities](./docs/TEAM_ROLES_AND_RESPONSIBILITIES.md)

---

## 🎯 Implementation Checklist

Use this checklist to track your Linear setup progress:

### Phase 1: Initial Setup
- [ ] Team created in Linear
- [ ] Team members invited
- [ ] Team settings configured

### Phase 2: Workflow & Labels
- [ ] 8 workflow states created
- [ ] 21 labels created (specialty, type, priority, channel, component)
- [ ] Default status set to "Triage"

### Phase 3: Projects & Structure
- [ ] 6 projects created with leads
- [ ] Project descriptions added

### Phase 4: Views
- [ ] 3 PM views created
- [ ] 2 Agus views created
- [ ] 3 Alex/Judith views created
- [ ] 2 Brian views created
- [ ] 3 Shared views created

### Phase 5: Team Onboarding
- [ ] Team walkthrough completed
- [ ] Test issues created
- [ ] First triage session done
- [ ] Templates shared with team

### Phase 6: Operations
- [ ] First sprint planned
- [ ] Daily standups scheduled
- [ ] PM triage routine established

**Detailed checklist:** [Linear Quick Start Guide](./docs/LINEAR_QUICK_START.md)

---

## 📚 Documentation Structure

```
majlis_contact_center_v1/
├── LINEAR_SETUP_README.md (← You are here)
└── docs/
    ├── LINEAR_QUICK_START.md (30-45 min setup guide)
    ├── LINEAR_SETUP_GUIDE.md (Complete reference)
    ├── TEAM_ROLES_AND_RESPONSIBILITIES.md (Who does what)
    ├── linear-labels-config.json (Label definitions)
    ├── linear-projects-config.json (Project structure)
    ├── linear-views-config.json (View configurations)
    └── linear-templates/
        ├── README.md (Template guide)
        ├── bug-report-template.md
        ├── feature-request-template.md
        ├── connectivity-issue-template.md
        ├── ai-agent-issue-template.md
        └── ui-ux-issue-template.md
```

---

## 🎓 Learning Resources

### Linear Official Resources
- **[Linear Documentation](https://linear.app/docs)** - Official docs
- **[Keyboard Shortcuts](https://linear.app/shortcuts)** - Or press `?` in Linear
- **[Linear Method Guide](https://linear.app/method)** - Best practices

### Team-Specific Resources
- **[Quick Start](./docs/LINEAR_QUICK_START.md)** - Get started in 30 mins
- **[Setup Guide](./docs/LINEAR_SETUP_GUIDE.md)** - Complete instructions
- **[Team Roles](./docs/TEAM_ROLES_AND_RESPONSIBILITIES.md)** - Workflows and responsibilities

### Keyboard Shortcuts (Most Useful)
- `C` - Create new issue
- `K` - Command palette (search anything)
- `/` - Search issues
- `?` - Show all shortcuts
- `Q` - Quick add issue
- `V` - Switch views

---

## 🤝 Team Communication

### Where to Communicate What

**Linear (Primary):**
- Issue discussions
- Progress updates
- Blockers
- Feature requests
- Bug reports

**Team Chat (Slack/Teams):**
- Urgent notifications
- Quick questions
- Team coordination

**Meetings:**
- Daily standup (15 mins)
- Sprint planning (1 hour, every 2 weeks)
- Sprint review & retro (1 hour, every 2 weeks)

### Linear Best Practices

✅ **Do:**
- Update issue status as you work
- Add comments for progress/questions
- Use labels consistently
- Move issues through workflow
- Tag people with @mentions

❌ **Don't:**
- Leave issues in "In Progress" for days without updates
- Skip labels (makes triage harder)
- Forget to link related issues
- Use vague descriptions

---

## 🔧 Maintenance & Updates

### Weekly
- **PM:** Triage daily, check blocked items
- **Team:** Update issue status, comment on progress
- **QA:** Test items in Testing/QA status promptly

### Bi-Weekly
- Sprint planning (plan next 2 weeks)
- Sprint review (demo completed work)
- Sprint retrospective (improve process)

### Monthly
- Review label usage (add/remove as needed)
- Review view effectiveness (adjust filters)
- Update documentation if process changes
- Check team feedback and iterate

### Quarterly
- Review project structure
- Assess team velocity and capacity
- Update roadmap and priorities
- Consider workflow improvements

---

## ❓ Troubleshooting

### Common Issues

**Q: Team members can't see certain views**  
A: Views are team-visible by default. Check filter settings - they might not have issues assigned yet.

**Q: Too many issues in Triage**  
A: Set aside 15 mins each morning for PM triage. Don't skip this!

**Q: Labels are confusing**  
A: Start with just specialty + priority. Add others as needed.

**Q: Issues stuck in "In Progress"**  
A: Remind team to update status daily. Make it part of standup.

**Q: QA bottleneck**  
A: Alex & Judith should check QA queue 2-3x daily. Consider pairing on big features.

**Q: Workflow doesn't fit our process**  
A: Adjust! Linear is flexible. Add/remove states as needed.

### Get Help

1. Check [Linear Setup Guide](./docs/LINEAR_SETUP_GUIDE.md)
2. Search [Linear Docs](https://linear.app/docs)
3. Ask team in standup
4. Contact Linear support (support@linear.app)

---

## 📈 Success Metrics

Track these to measure Linear adoption and effectiveness:

### Week 1-2 (Setup Phase)
- [ ] All team members can log in and create issues
- [ ] 10+ issues created with proper labels
- [ ] First sprint planned
- [ ] Daily standups using "Current Sprint" view

### Month 1 (Adoption Phase)
- [ ] Triage queue processed daily (< 5 unassigned issues)
- [ ] Team updates issue status regularly
- [ ] Sprint completed with demos
- [ ] Team comfortable with workflow

### Month 3 (Optimization Phase)
- [ ] Consistent sprint velocity
- [ ] Quick response to blockers (< 1 day)
- [ ] Clear sprint goals and achievements
- [ ] Process improvements implemented

---

## 🎉 You're Ready!

You now have everything you need to set up and run a successful Linear workspace:

1. ✅ **Quick Start Guide** - Step-by-step setup
2. ✅ **Complete Setup Guide** - Detailed reference
3. ✅ **Team Roles Document** - Workflows and responsibilities
4. ✅ **Configuration Files** - Labels, projects, views
5. ✅ **Issue Templates** - Standardized issue creation
6. ✅ **Best Practices** - Communication and workflow tips

### Next Steps

1. **Read:** [Linear Quick Start Guide](./docs/LINEAR_QUICK_START.md)
2. **Setup:** Follow the 30-45 minute setup process
3. **Onboard:** Share [Team Roles](./docs/TEAM_ROLES_AND_RESPONSIBILITIES.md) with team
4. **Launch:** Start your first sprint!

---

## 📞 Questions?

- **Setup questions:** See [Linear Setup Guide](./docs/LINEAR_SETUP_GUIDE.md)
- **Workflow questions:** See [Team Roles](./docs/TEAM_ROLES_AND_RESPONSIBILITIES.md)
- **Template questions:** See [Template README](./docs/linear-templates/README.md)
- **Linear product questions:** [Linear Docs](https://linear.app/docs)

---

**Created for:** Majlis Contact Center Team  
**Last Updated:** January 2026  
**Maintained by:** Project Manager

Good luck with your Linear setup! 🚀

