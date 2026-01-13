# UI/UX Issue Template

Use this template for frontend, design, or user experience issues.

**Labels to add:** 🎨 Frontend/UX, (component label), 🐛 Bug or ✨ Feature, (priority label)
**Assign to:** Alex or Judith

---

## Component Affected
Check the affected component(s):

- [ ] Agent Desktop
- [ ] Analytics Dashboard
- [ ] Inbox/Conversations
- [ ] Quality Management
- [ ] Settings/Config
- [ ] Other: [Describe]

## Issue Type
- [ ] Visual bug (layout, styling, colors)
- [ ] Interaction bug (buttons, forms, navigation)
- [ ] Responsive design issue
- [ ] Accessibility issue
- [ ] Performance issue (slow rendering, animations)
- [ ] UX improvement suggestion
- [ ] New component needed
- [ ] Other: [Describe]

## Description
Describe the UI/UX issue or improvement.

## Current Behavior
What is the current state of the UI/UX?

## Expected/Desired Behavior
What should the UI/UX look like or behave like?

## Steps to Reproduce (for bugs)
1. Navigate to [page/route]
2. Click on [element]
3. Scroll to [section]
4. Observe [issue]

## Screenshots/Videos
Attach screenshots or screen recordings showing the issue.

**Before:**
[Attach image showing current state]

**Expected/Mockup:**
[Attach image or Figma link showing desired state]

## Device/Browser Information
- **Browser:** [e.g., Chrome 120, Safari 17, Firefox 115]
- **OS:** [e.g., macOS 14, Windows 11, iOS 17, Android 14]
- **Screen Size:** [e.g., Desktop 1920x1080, Mobile 375x812]
- **Viewport:** [If relevant]

## Affected Routes/Pages
List the specific routes or pages where this issue appears:

- `/agent-desktop`
- `/analytics`
- etc.

## Component Files
If you know which component files are involved:

- `components/chat-agent-desktop.tsx`
- `app/(dashboard)/agent-desktop/page.tsx`

## Accessibility Concerns
- [ ] Keyboard navigation issue
- [ ] Screen reader compatibility
- [ ] Color contrast issue
- [ ] Missing ARIA labels
- [ ] Focus management issue

## Responsive Design Breakpoints
Which breakpoints are affected?

- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] All breakpoints

## Design System Consistency
Does this follow our design system/style guide?

- [ ] Uses correct colors from theme
- [ ] Uses correct typography
- [ ] Uses correct spacing
- [ ] Matches existing patterns
- [ ] Needs new pattern/component

## User Impact
How does this affect the user experience?

- **Severity:** [Blocks task / Confusing / Minor annoyance]
- **Frequency:** [Every user / Some users / Rare edge case]

## Acceptance Criteria (for improvements/features)
- [ ] Visual design matches mockup
- [ ] Works on all supported browsers
- [ ] Responsive on all breakpoints
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Smooth animations/transitions
- [ ] Performance is acceptable (no jank)

## Design Assets
Link to design files if available:

- **Figma:** [URL]
- **Design Specs:** [Link or description]
- **Style Guide:** [Reference]

## Related Components
Are there similar components that should be updated for consistency?

## Technical Notes
Any technical considerations for implementation?

- State management needed?
- New dependencies?
- CSS/Tailwind utilities?
- Animation libraries?

---

## For Triage (PM will fill out)
- **Priority:** [Critical / High / Medium / Low]
- **Assigned to:** [Alex / Judith]
- **Project:** User Experience & Interface
- **Sprint:** [Sprint number or date]
- **Estimated Effort:** [Small / Medium / Large]

