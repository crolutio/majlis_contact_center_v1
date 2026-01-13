# Linear Issue Templates

This directory contains issue templates for creating standardized issues in Linear.

## Available Templates

### 1. [Bug Report Template](./bug-report-template.md)
**Use when:** Something is broken or not working as expected  
**Labels:** 🐛 Bug, (specialty), (priority)  
**Assign to:** Based on the affected area

**Key sections:**
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs
- Severity assessment

---

### 2. [Feature Request Template](./feature-request-template.md)
**Use when:** Proposing new functionality or enhancements  
**Labels:** ✨ Feature, (specialty), (priority)  
**Assign to:** Based on the feature area

**Key sections:**
- User story format
- Acceptance criteria
- Design/mockups
- Technical considerations
- Success metrics

---

### 3. [Connectivity Issue Template](./connectivity-issue-template.md)
**Use when:** Issues with Voice, WhatsApp, Email, or SMS channels  
**Labels:** 🔌 Connectivity, 🐛 Bug, (channel), (priority)  
**Assign to:** Agus

**Key sections:**
- Channel identification
- Webhook details
- Twilio/SendGrid error codes
- Environment variables checklist
- Network/API logs

---

### 4. [AI Agent Issue Template](./ai-agent-issue-template.md)
**Use when:** Issues with AI agents, LangGraph, or banking integration  
**Labels:** 🤖 AI/Data, 🐛 Bug (or ✨ Feature), (priority)  
**Assign to:** Brian

**Key sections:**
- Component affected (intent, sentiment, banking, etc.)
- Expected vs actual AI behavior
- Test case with input/output
- LangGraph logs
- Model configuration

---

### 5. [UI/UX Issue Template](./ui-ux-issue-template.md)
**Use when:** Frontend bugs, design issues, or UX improvements  
**Labels:** 🎨 Frontend/UX, (component), 🐛 Bug or ✨ Feature, (priority)  
**Assign to:** Alex or Judith

**Key sections:**
- Component identification
- Current vs expected behavior
- Screenshots/videos
- Browser/device information
- Accessibility concerns
- Responsive design breakpoints

---

## How to Use Templates

### In Linear UI

1. Click **"New Issue"** in Linear
2. Open the appropriate template file from this directory
3. Copy the template content
4. Paste into the Linear issue description
5. Fill in all relevant sections
6. Add appropriate labels
7. Assign to the right team member
8. Create the issue

### Copy-Paste Workflow

Since Linear doesn't support template imports directly, use this workflow:

1. **Keep templates open:** Bookmark this directory in your browser
2. **Quick access:** Use Cmd/Ctrl+K in Linear, then type the issue title first
3. **Fill template:** Copy from GitHub/local file and paste into description
4. **Add labels:** Use the label shortcuts (will be configured in Linear)

### Template Customization

Feel free to:
- Modify templates based on team needs
- Add sections that are frequently needed
- Remove sections that aren't useful
- Create new templates for specific scenarios

---

## Template Best Practices

### When Creating Issues

✅ **Do:**
- Fill out all relevant sections completely
- Be specific and provide context
- Attach screenshots, logs, or examples
- Add appropriate labels immediately
- Assign to the right person (or leave for PM to triage)
- Link to related issues or PRs

❌ **Don't:**
- Leave sections blank without explanation
- Use vague descriptions like "fix the bug"
- Forget to add labels (PM has to do it during triage)
- Skip steps to reproduce
- Assume everyone has the same context you do

### Writing Good Issue Descriptions

**Bad Example:**
```
Title: Fix WhatsApp
Description: It's broken
```

**Good Example:**
```
Title: WhatsApp messages not delivering to customers
Description: Using the connectivity issue template...
- Channel: WhatsApp
- Error: 500 Internal Server Error
- Webhook: /api/twilio/whatsapp/send
- Steps to reproduce: [detailed steps]
- Logs: [actual error logs]
```

### Template Shortcuts

Create saved responses in Linear for common sections:

- `/reproduce` → Steps to reproduce template
- `/env` → Environment checklist
- `/severity` → Severity checklist

(Set these up in Linear settings → Personal → Saved replies)

---

## Creating Custom Templates

Need a new template? Follow this format:

```markdown
# [Template Name]

Use this template when [scenario].

**Labels to add:** [List of labels]
**Assign to:** [Team member or "PM for triage"]

---

## Section 1
Description of what goes here

## Section 2
Description of what goes here

[Continue with relevant sections]

---

## For Triage (PM will fill out)
- **Priority:** [Priority level]
- **Assigned to:** [Team member]
- **Project:** [Project name]
- **Sprint:** [Sprint info]
```

Then:
1. Save to this directory
2. Update this README with the new template
3. Notify team in standup or Slack

---

## Related Documentation

- **[Linear Setup Guide](../LINEAR_SETUP_GUIDE.md)** - Complete Linear setup instructions
- **[Team Roles](../TEAM_ROLES_AND_RESPONSIBILITIES.md)** - Who does what
- **[Label Config](../linear-labels-config.json)** - All label definitions
- **[Projects Config](../linear-projects-config.json)** - Project structure
- **[Views Config](../linear-views-config.json)** - Custom view definitions

---

## Quick Reference

### Labels Cheat Sheet

**Specialty:**
- 🔌 Connectivity → Agus
- 🎨 Frontend/UX → Alex/Judith
- 🤖 AI/Data → Brian
- 📋 Product/PM → PM

**Priority:**
- 🔴 Critical → Production blockers
- 🟠 High → Important features
- 🟡 Medium → Standard work
- 🟢 Low → Nice-to-haves

**Type:**
- 🐛 Bug → Something broken
- ✨ Feature → New functionality
- 🔧 Maintenance → Tech debt
- 📚 Documentation → Docs
- 🧪 Testing → QA work

---

## Feedback

Have suggestions for improving these templates? 

1. Create an issue using the Feature Request template
2. Label it with 📋 Product/PM and 🔧 Maintenance
3. Assign to PM
4. We'll discuss in sprint planning

---

**Happy issue tracking!** 🚀

