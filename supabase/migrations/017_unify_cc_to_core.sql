-- Migration: Unify cc_* banking tables into core conversations/messages
-- Target: majlis contact center schema (single-table model with source/tenant)

-- 1) Normalize existing conversation channel values
UPDATE conversations
SET channel = 'chat'
WHERE channel = 'app';

-- 2) Relax customer_id to allow NULL (banking convs may lack customer)
ALTER TABLE conversations
ALTER COLUMN customer_id DROP NOT NULL;

-- 3) Add missing columns to conversations
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS handover_required BOOLEAN DEFAULT FALSE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS provider TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS provider_conversation_id TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS sentiment TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS sentiment_score NUMERIC;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMPTZ;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS sla_remaining INTEGER;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS sla_status TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS queue TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS topic TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_message_time TIMESTAMPTZ;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS ai_confidence NUMERIC;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS escalation_risk BOOLEAN DEFAULT FALSE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS industry TEXT;

-- 4) Add missing columns to messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS channel TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS provider TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS provider_message_id TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS from_address TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS to_address TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS metadata JSONB;

-- 5) Backfill source/channel for existing rows
UPDATE conversations
SET source = COALESCE(source, industry, 'default')
WHERE source IS NULL;

UPDATE messages
SET source = COALESCE(source, 'default')
WHERE source IS NULL;

UPDATE messages
SET channel = COALESCE(channel, 'chat')
WHERE channel IS NULL;

-- 6) Migrate cc_bank_customers into customers (id-preserving)
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

-- 7) Migrate cc_conversations into conversations
WITH last_msg AS (
  SELECT DISTINCT ON (conversation_id)
    conversation_id,
    COALESCE(body_text, '') AS last_message,
    created_at AS last_message_time
  FROM cc_messages
  ORDER BY conversation_id, created_at DESC
)
INSERT INTO conversations (
  id,
  customer_id,
  subject,
  channel,
  status,
  priority,
  assigned_agent_id,
  last_message,
  created_at,
  updated_at,
  handling_mode,
  source,
  industry,
  handover_required,
  provider,
  provider_conversation_id,
  topic,
  queue,
  last_message_time,
  start_time,
  ai_confidence,
  escalation_risk
)
SELECT
  cc.id,
  cc.bank_customer_id,
  cc.topic,
  cc.channel,
  cc.status,
  cc.priority,
  cc.assigned_agent_id,
  lm.last_message,
  cc.opened_at,
  cc.updated_at,
  'ai',
  'banking',
  'banking',
  (cc.status = 'escalated'),
  cc.provider,
  cc.provider_conversation_id,
  cc.topic,
  cc.assigned_queue,
  COALESCE(lm.last_message_time, cc.opened_at),
  cc.opened_at,
  0.85,
  (cc.priority = 'urgent' OR cc.status = 'escalated')
FROM cc_conversations cc
LEFT JOIN last_msg lm ON lm.conversation_id = cc.id
WHERE NOT EXISTS (
  SELECT 1 FROM conversations c WHERE c.id = cc.id
);

-- 8) Migrate cc_messages into messages
INSERT INTO messages (
  id,
  conversation_id,
  sender_type,
  content,
  is_internal,
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
  cm.id,
  cm.conversation_id,
  CASE cm.direction
    WHEN 'inbound' THEN 'customer'
    ELSE 'agent'
  END AS sender_type,
  COALESCE(cm.body_text, ''),
  COALESCE((cm.body_json->>'is_internal')::boolean, false),
  cm.created_at,
  'banking',
  cm.channel,
  cm.provider,
  cm.provider_message_id,
  cm.from_address,
  cm.to_address,
  cm.status,
  COALESCE(cm.body_json, cm.metadata)
FROM cc_messages cm
WHERE NOT EXISTS (
  SELECT 1 FROM messages m WHERE m.id = cm.id
);

-- 9) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_conversations_source ON conversations(source);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_source ON messages(conversation_id, source);
CREATE INDEX IF NOT EXISTS idx_messages_provider_msg_id ON messages(provider_message_id);
