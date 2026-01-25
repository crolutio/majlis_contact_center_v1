-- Migration: backfill cc_messages into messages, then drop cc_messages
-- Also remove audit log immutability trigger to allow cleanup deletes.

-- Backfill cc_messages rows that have provider_message_id
INSERT INTO messages (
  conversation_id,
  sender_type,
  content,
  created_at,
  source,
  channel,
  provider,
  provider_message_id,
  from_address,
  to_address,
  status,
  metadata
)
SELECT
  cm.conversation_id,
  CASE cm.direction WHEN 'inbound' THEN 'customer' ELSE 'agent' END,
  COALESCE(cm.body_text, ''),
  cm.created_at,
  'banking',
  cm.channel,
  cm.provider,
  cm.provider_message_id,
  cm.from_address,
  cm.to_address,
  cm.status,
  COALESCE(cm.body_json, '{}'::jsonb)
FROM cc_messages cm
WHERE cm.provider_message_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM messages m
    WHERE m.provider = cm.provider
      AND m.provider_message_id = cm.provider_message_id
  );

-- Backfill cc_messages rows without provider_message_id
INSERT INTO messages (
  conversation_id,
  sender_type,
  content,
  created_at,
  source,
  channel,
  provider,
  provider_message_id,
  from_address,
  to_address,
  status,
  metadata
)
SELECT
  cm.conversation_id,
  CASE cm.direction WHEN 'inbound' THEN 'customer' ELSE 'agent' END,
  COALESCE(cm.body_text, ''),
  cm.created_at,
  'banking',
  cm.channel,
  cm.provider,
  cm.provider_message_id,
  cm.from_address,
  cm.to_address,
  cm.status,
  COALESCE(cm.body_json, '{}'::jsonb)
FROM cc_messages cm
WHERE cm.provider_message_id IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM messages m
    WHERE m.conversation_id = cm.conversation_id
      AND m.created_at = cm.created_at
      AND m.content = COALESCE(cm.body_text, '')
  );

-- Drop cc_messages table now that core messages is the source of truth
DROP TABLE IF EXISTS cc_messages;

-- Remove immutability trigger on audit logs to allow deletions
DROP TRIGGER IF EXISTS audit_logs_immutable_trigger ON public.cc_audit_logs;
DROP FUNCTION IF EXISTS prevent_audit_log_modification();
