# Connectivity Issue Template

Use this template for issues related to channel connectivity (Voice, WhatsApp, Email, SMS).

**Labels to add:** 🔌 Connectivity, 🐛 Bug, (channel label), (priority label)
**Assign to:** Agus

---

## Channel Affected
Check the affected channel(s):

- [ ] 📞 Voice (Twilio/Vapi)
- [ ] 💬 WhatsApp (Twilio WhatsApp Business API)
- [ ] 📧 Email (SendGrid)
- [ ] 📱 SMS (Twilio SMS)

## Issue Type
- [ ] Messages not sending
- [ ] Messages not receiving
- [ ] Webhook not firing
- [ ] Incorrect message status
- [ ] Call routing failure
- [ ] Media/attachment issues
- [ ] Other: [Describe]

## Description
What's not working? Be as specific as possible.

## Error Messages/Logs
Paste any error messages or relevant logs:

```
Error logs here
```

## Webhook Details
If this is a webhook issue:

- **Endpoint:** [e.g., /api/twilio/whatsapp/incoming]
- **Expected Status Code:** [e.g., 200]
- **Actual Status Code:** [e.g., 500]
- **Request Body:** 
```json
{
  "paste": "webhook payload"
}
```
- **Response Body:**
```json
{
  "paste": "response"
}
```

## Twilio/SendGrid Details
- **Account SID:** [Last 4 characters only]
- **Phone Number:** [If applicable]
- **Message SID:** [If applicable]
- **Twilio Error Code:** [If shown in Twilio logs]
- **Twilio Debugger Link:** [Link to Twilio debugger if available]

## Environment Variables
Have all required environment variables been configured? (Don't paste actual values)

- [ ] TWILIO_ACCOUNT_SID
- [ ] TWILIO_AUTH_TOKEN
- [ ] TWILIO_PHONE_NUMBER
- [ ] TWILIO_WHATSAPP_NUMBER (if WhatsApp)
- [ ] SENDGRID_API_KEY (if Email)
- [ ] VAPI_API_KEY (if Voice)

## Test Case
Describe how to reproduce:

1. Test account used: [Customer ID or phone number]
2. Action taken: [What you did]
3. Expected result: [What should happen]
4. Actual result: [What actually happened]

## Network/API Logs
Any relevant network requests or API responses:

```
Paste cURL commands or API responses
```

## Expected Behavior
What should happen when the channel is working correctly?

## Actual Behavior
What is actually happening?

## When Did This Start?
- [ ] This never worked
- [ ] It worked before, broke recently
- [ ] It's intermittent
- [ ] Started after deployment: [Date/commit]

## Frequency
- [ ] Happens every time
- [ ] Happens sometimes (describe pattern)
- [ ] Only happened once

## Impact
How many users are affected? Is this blocking any demos or production use?

## Workaround
Is there a temporary workaround?

---

## For Triage (PM will fill out)
- **Priority:** [Critical / High / Medium / Low]
- **Assigned to:** Agus
- **Project:** Channel Connectivity
- **Sprint:** [Add to current sprint if urgent]

