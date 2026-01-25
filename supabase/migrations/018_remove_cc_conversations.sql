-- Migration: Remove cc_conversations and rewire cc_* foreign keys to conversations
-- This keeps unified conversations as the single source of truth.

-- Ensure conversations exist for any cc_* references
WITH missing AS (
  SELECT DISTINCT conversation_id
  FROM (
    SELECT conversation_id FROM cc_messages
    UNION
    SELECT conversation_id FROM cc_auth_sessions
    UNION
    SELECT conversation_id FROM cc_audit_logs
    UNION
    SELECT conversation_id FROM cc_cases
    UNION
    SELECT conversation_id FROM cc_call_analysis
    UNION
    SELECT conversation_id FROM cc_call_transcripts
    UNION
    SELECT conversation_id FROM cc_assignments
  ) t
  WHERE conversation_id IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM conversations c WHERE c.id = t.conversation_id)
),
last_msg AS (
  SELECT DISTINCT ON (conversation_id)
    conversation_id,
    channel,
    COALESCE(body_text, '') AS last_message,
    created_at AS last_message_time
  FROM cc_messages
  ORDER BY conversation_id, created_at DESC
),
first_msg AS (
  SELECT DISTINCT ON (conversation_id)
    conversation_id,
    created_at AS start_time
  FROM cc_messages
  ORDER BY conversation_id, created_at ASC
)
INSERT INTO conversations (
  id,
  channel,
  status,
  priority,
  last_message,
  last_message_time,
  start_time,
  source,
  industry
)
SELECT
  m.conversation_id,
  COALESCE(l.channel, 'whatsapp'),
  'active',
  'medium',
  COALESCE(l.last_message, ''),
  COALESCE(l.last_message_time, NOW()),
  COALESCE(f.start_time, COALESCE(l.last_message_time, NOW())),
  'banking',
  'banking'
FROM missing m
LEFT JOIN last_msg l ON l.conversation_id = m.conversation_id
LEFT JOIN first_msg f ON f.conversation_id = m.conversation_id;

-- Drop foreign keys pointing to cc_conversations
ALTER TABLE cc_assignments DROP CONSTRAINT IF EXISTS cc_assignments_conversation_id_fkey;
ALTER TABLE cc_audit_logs DROP CONSTRAINT IF EXISTS cc_audit_logs_conversation_id_fkey;
ALTER TABLE cc_auth_sessions DROP CONSTRAINT IF EXISTS cc_auth_sessions_conversation_id_fkey;
ALTER TABLE cc_call_analysis DROP CONSTRAINT IF EXISTS cc_call_analysis_conversation_id_fkey;
ALTER TABLE cc_call_transcripts DROP CONSTRAINT IF EXISTS cc_call_transcripts_conversation_id_fkey;
ALTER TABLE cc_cases DROP CONSTRAINT IF EXISTS cc_cases_conversation_id_fkey;
ALTER TABLE cc_messages DROP CONSTRAINT IF EXISTS cc_messages_conversation_id_fkey;

-- Drop the cc_conversations table
DROP TABLE IF EXISTS cc_conversations;

-- Recreate foreign keys pointing to conversations
ALTER TABLE cc_assignments
  ADD CONSTRAINT cc_assignments_conversation_id_fkey
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

ALTER TABLE cc_audit_logs
  ADD CONSTRAINT cc_audit_logs_conversation_id_fkey
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL;

ALTER TABLE cc_auth_sessions
  ADD CONSTRAINT cc_auth_sessions_conversation_id_fkey
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

ALTER TABLE cc_call_analysis
  ADD CONSTRAINT cc_call_analysis_conversation_id_fkey
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

ALTER TABLE cc_call_transcripts
  ADD CONSTRAINT cc_call_transcripts_conversation_id_fkey
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

ALTER TABLE cc_cases
  ADD CONSTRAINT cc_cases_conversation_id_fkey
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL;

ALTER TABLE cc_messages
  ADD CONSTRAINT cc_messages_conversation_id_fkey
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;
