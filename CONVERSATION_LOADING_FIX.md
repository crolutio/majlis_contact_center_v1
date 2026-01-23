# Conversation Loading Fix

## Problem
The chat agent interface at `/chat-agent` was unable to load conversations. The error indicated that the table `conversations_with_customers` did not exist in the database.

## Root Causes

### 1. **Wrong Table Reference**
The `useAgentInbox` hook was querying a non-existent view called `conversations_with_customers` instead of the actual `conversations` table.

### 2. **Incorrect Real-time Subscription**
The real-time subscription was listening to `cc_conversations` (contact center table) instead of the `conversations` table used by the chat agent.

### 3. **Missing Database Tables**
The following tables needed to be created:
- `conversations` - Main conversation table
- `messages` - Conversation messages
- `agents` - Agent information

### 4. **Field Name Mismatches**
- Messages were querying `body_text` instead of `content`
- Customer data wasn't being properly joined
- Time calculations used wrong field names (`opened_at` vs `start_time`)

## Changes Made

### Database Migrations Applied

1. **Migration 015**: Attempted to create `conversations_with_customers` view (later dropped)
2. **Migration 016**: Created `conversations` table with proper schema
3. **Migration 017**: Created `messages` and `agents` tables
4. **Migration 018**: Populated demo conversations with 4 sample records
5. **Migration 019**: Added more demo conversations and sample messages

### Code Changes in `lib/hooks/useAgentInbox.ts`

#### Before:
```typescript
const { data: convsWithCustomers, error: fetchError } = await supabase
  .from('conversations_with_customers')
  .select('*');
```

#### After:
```typescript
const { data: convsWithCustomers, error: fetchError } = await supabase
  .from('conversations')
  .select(`
    *,
    customer:customers(*)
  `);
```

### Other Fixes:
1. ✅ Fixed real-time subscription to listen to correct table
2. ✅ Updated field mappings (`content` vs `body_text`)
3. ✅ Fixed customer data access (`conv.customer` relation)
4. ✅ Fixed time calculations (`start_time` vs `opened_at`)
5. ✅ Added null safety checks
6. ✅ Added comprehensive console logging for debugging

## Current Database State

### Tables Created:
- ✅ `conversations` - 7 records (4 original + 3 added)
- ✅ `messages` - Sample messages linked to conversations
- ✅ `agents` - Empty, ready for agent data
- ✅ `customers` - 14 records (existing)

### Sample Data:
```sql
-- Conversations include:
- Sarah Chen - Account Issue (Chat, Active, High Priority)
- Fatima Hassan - Loan Inquiry (Voice, Waiting, Medium Priority)
- James Rodriguez - Card Replacement (WhatsApp, Resolved, Low Priority)
- David Kim - Transaction Dispute (Email, Active, High Priority)
+ 3 more waiting conversations
```

## Testing Checklist

### Frontend Testing
1. **Load Chat Agent Page**
   - Navigate to `https://v0-ai-contact-center-ui-2.vercel.app/chat-agent`
   - Check browser console for logs starting with `[useAgentInbox]`
   - Verify no error messages appear

2. **Check Conversation List**
   - Should see 7 active conversations in the inbox
   - Each conversation should display:
     - Customer name
     - Channel icon (chat/voice/whatsapp/email)
     - Last message preview
     - Time in queue
     - Priority badge

3. **Verify Data Loading**
   - Check that conversations load within 2-3 seconds
   - No "Failed to load conversations" error should appear
   - Loading spinner should appear briefly then disappear

### Backend Testing (Supabase)
1. **Direct API Test**
   ```
   GET https://plcjfyftcnmkrffpvukz.supabase.co/rest/v1/conversations?select=*
   ```
   Should return 7 conversation records

2. **With Customer Join**
   ```
   GET https://plcjfyftcnmkrffpvukz.supabase.co/rest/v1/conversations?select=*,customer:customers(*)
   ```
   Should return conversations with nested customer data

3. **Messages Query**
   ```
   GET https://plcjfyftcnmkrffpvukz.supabase.co/rest/v1/messages?select=*
   ```
   Should return message records

## Debugging

If conversations still don't load, check:

1. **Browser Console Logs**
   Look for `[useAgentInbox]` prefixed logs:
   ```
   [useAgentInbox] Fetching conversations...
   [useAgentInbox] Response: { data: [...], error: null, count: 7 }
   [useAgentInbox] Transformed conversations: 7
   ```

2. **Supabase API Key**
   Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly in `.env.local`

3. **Network Tab**
   Check for failed requests to Supabase REST API

4. **RLS Policies**
   Verify Row Level Security is disabled or properly configured:
   ```sql
   SELECT relname, relrowsecurity FROM pg_class 
   WHERE relname = 'conversations';
   ```
   Should show `relrowsecurity: false`

## Next Steps

1. **If still not loading**, check the browser console logs and look for specific error messages
2. **Add more demo data** if needed using the migration pattern
3. **Test real-time updates** by creating a new conversation in the database
4. **Verify agent assignment** works when conversations are clicked

## Related Files
- `lib/hooks/useAgentInbox.ts` - Main hook for fetching conversations
- `components/chat-inbox.tsx` - UI component that uses the hook
- `components/chat-agent-desktop.tsx` - Main chat agent interface
- `app/(dashboard)/chat-agent/page.tsx` - Chat agent page
- `supabase/migrations/016_create_conversations_table.sql` - Table creation
- `supabase/migrations/018_populate_demo_conversations.sql` - Demo data

## Git Commit
Commit: `7ecaedb`
Branch: `main`
Pushed to: `origin/main` (GitHub)
