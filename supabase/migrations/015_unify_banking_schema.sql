-- Migration: Unify banking schema into core tables
-- Goal: Use conversations/messages for all tenants with a source column

-- 1) Conversations: add source + handover_required + provider fields
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS source TEXT;

ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS handover_required BOOLEAN DEFAULT FALSE;

ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS provider TEXT;

ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS provider_conversation_id TEXT;

-- Expand status constraint to include open/pending/closed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'conversations'
    AND constraint_name LIKE '%status%check%'
  ) THEN
    ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_status_check;
    ALTER TABLE conversations
    ADD CONSTRAINT conversations_status_check
    CHECK (status IN ('open', 'pending', 'active', 'waiting', 'resolved', 'escalated', 'closed'));
  END IF;
END $$;

-- Expand channel constraint to include sms
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'conversations'
    AND constraint_name LIKE '%channel%check%'
  ) THEN
    ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_channel_check;
    ALTER TABLE conversations
    ADD CONSTRAINT conversations_channel_check
    CHECK (channel IN ('voice', 'chat', 'email', 'whatsapp', 'sms'));
  END IF;
END $$;

-- Backfill source for existing rows
UPDATE conversations
SET source = COALESCE(source, industry, 'default')
WHERE source IS NULL;

-- 2) Messages: add source + metadata + provider fields
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS source TEXT;

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS channel TEXT;

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS provider TEXT;

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS provider_message_id TEXT;

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS from_address TEXT;

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS to_address TEXT;

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS status TEXT;

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_conversations_source ON conversations(source);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_source ON messages(conversation_id, source);
CREATE INDEX IF NOT EXISTS idx_messages_provider_msg_id ON messages(provider_message_id);

-- 3) Migrate cc_bank_customers into customers (id-preserving)
INSERT INTO customers (
  id,
  name,
  email,
  phone,
  tier,
  language,
  preferred_language,
  created_at,
  updated_at
)
SELECT
  cb.id,
  trim(concat(cb.first_name, ' ', cb.last_name)) AS name,
  cb.email,
  cb.phone,
  CASE cb.risk_level
    WHEN 'high' THEN 'enterprise'
    WHEN 'medium' THEN 'premium'
    ELSE 'standard'
  END AS tier,
  'English',
  'en',
  cb.created_at,
  cb.updated_at
FROM cc_bank_customers cb
WHERE NOT EXISTS (
  SELECT 1 FROM customers c WHERE c.id = cb.id
);

-- 4) Migrate cc_conversations into conversations
WITH last_msg AS (
  SELECT DISTINCT ON (conversation_id)
    conversation_id,
    COALESCE(body_text, text, '') AS last_message,
    created_at AS last_message_time
  FROM cc_messages
  ORDER BY conversation_id, created_at DESC
)
INSERT INTO conversations (
  id,
  customer_id,
  channel,
  status,
  priority,
  sentiment,
  sentiment_score,
  assigned_to,
  queue,
  topic,
  last_message,
  last_message_time,
  start_time,
  ai_confidence,
  escalation_risk,
  tags,
  industry,
  source,
  handover_required,
  provider,
  provider_conversation_id,
  created_at,
  updated_at
)
SELECT
  cc.id,
  cc.bank_customer_id,
  cc.channel,
  cc.status,
  cc.priority,
  cc.sentiment,
  0.5,
  cc.assigned_agent_id,
  cc.assigned_queue,
  cc.topic,
  lm.last_message,
  COALESCE(lm.last_message_time, cc.opened_at),
  cc.opened_at,
  0.85,
  (cc.priority = 'urgent' OR cc.status = 'escalated'),
  '{}'::text[],
  'banking',
  'banking',
  (cc.status = 'escalated'),
  cc.provider,
  cc.provider_conversation_id,
  cc.created_at,
  cc.updated_at
FROM cc_conversations cc
LEFT JOIN last_msg lm ON lm.conversation_id = cc.id
WHERE NOT EXISTS (
  SELECT 1 FROM conversations c WHERE c.id = cc.id
);

-- 5) Migrate cc_messages into messages
INSERT INTO messages (
  id,
  conversation_id,
  type,
  content,
  timestamp,
  source,
  channel,
  provider,
  provider_message_id,
  from_address,
  to_address,
  status,
  metadata,
  created_at
)
SELECT
  cm.id,
  cm.conversation_id,
  CASE cm.direction
    WHEN 'inbound' THEN 'customer'
    ELSE 'agent'
  END AS type,
  COALESCE(cm.body_text, cm.text, ''),
  cm.created_at,
  'banking',
  cm.channel,
  cm.provider,
  cm.provider_message_id,
  cm.from_address,
  cm.to_address,
  cm.status,
  COALESCE(cm.body_json, cm.metadata),
  cm.created_at
FROM cc_messages cm
WHERE NOT EXISTS (
  SELECT 1 FROM messages m WHERE m.id = cm.id
);
