---
project: AI Agents & Intelligence
labels: AI/Data,Bug
assignee: 
priority: 2
---
# AI Agent Issue Template

Use this template for issues related to AI agents, LangGraph workflows, or banking integration.

**Labels to add:** 🤖 AI/Data, 🐛 Bug (or ✨ Feature), (priority label)
**Assign to:** Brian

---

## Component Affected
Check the affected component(s):

- [ ] LangGraph Workflow
- [ ] Intent Analysis
- [ ] Sentiment Detection
- [ ] AI Response Generation
- [ ] Banking Data Integration
- [ ] Knowledge Base
- [ ] Escalation Detection
- [ ] Other: [Describe]

## Issue Type
- [ ] Incorrect AI response
- [ ] Intent misclassification
- [ ] Sentiment analysis wrong
- [ ] Banking API connection issue
- [ ] Performance/latency issue
- [ ] Prompt engineering needed
- [ ] Model configuration issue
- [ ] Other: [Describe]

## Description
What's the issue with the AI agent or data integration?

## Workflow/Agent Affected
Which specific workflow or agent component is involved?

- **File:** [e.g., lib/agents/langgraph-workflow.ts]
- **Function:** [e.g., processMessage, analyzeIntent]
- **Node:** [If LangGraph, which node?]

## Expected AI Behavior
What should the AI do in this scenario?

## Actual AI Behavior
What is the AI actually doing?

## Test Case
Provide a reproducible test case:

### Input
```
Customer message: "I want to check my account balance"
```

### Context
```
Previous conversation history:
- Customer: "Hello"
- AI: "Hi! How can I help you today?"
```

### Expected Output
```
Intent: account_inquiry
Sentiment: neutral
Response: "I'd be happy to help you check your balance. Let me pull that up for you..."
```

### Actual Output
```
Intent: general
Sentiment: positive
Response: "How can I assist you?"
```

## Conversation History
If relevant, provide the full conversation context or conversation ID:

- **Conversation ID:** [e.g., conv_123]
- **Customer ID:** [e.g., cust_456]

## LangGraph/AI Logs
Paste relevant logs from the agent workflow:

```
🔄 Processing message for conversation: conv_123
📋 Loading conversation history...
🤖 Calling OpenAI with prompt...
Response: [paste here]
```

## Model Configuration
- **Model Used:** [e.g., gpt-4o-mini, gpt-4]
- **Temperature:** [e.g., 0.7]
- **Max Tokens:** [e.g., 500]
- **System Prompt:** [Link to prompt or paste excerpt]

## Prompt Used
If relevant, include the prompt or link to the prompt file:

```
System prompt:
You are a helpful customer service assistant...
```

## Banking Integration Details
If this is a banking data issue:

- **Database:** [e.g., Supabase, External Banking DB]
- **Query:** [SQL query or API endpoint]
- **Error:** [Error message]
- **Data Expected:** [What data should be returned]
- **Data Received:** [What was actually returned]

## Performance Metrics
If this is a performance issue:

- **Response Time:** [e.g., 5 seconds]
- **Expected Time:** [e.g., < 2 seconds]
- **Token Usage:** [If relevant]

## Environment
- **Environment:** [Production / Staging / Local]
- **USE_LANGGRAPH:** [true / false]
- **OPENAI_MODEL:** [Model name from env]

## Impact
How does this affect the user experience or system functionality?

## Frequency
- [ ] Happens every time with this input
- [ ] Happens sometimes
- [ ] Only happened once
- [ ] Specific to certain types of queries

## Workaround
Is there a temporary workaround or fallback?

## Additional Context
Any other relevant information about the AI behavior, training data, or configuration?

---

## For Triage (PM will fill out)
- **Priority:** [Critical / High / Medium / Low]
- **Assigned to:** Brian
- **Project:** AI Agents & Intelligence
- **Sprint:** [Sprint number or date]
- **Estimated Effort:** [Small / Medium / Large]

