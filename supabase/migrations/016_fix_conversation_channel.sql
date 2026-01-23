-- Fix invalid conversation channel values before enforcing constraint

UPDATE conversations
SET channel = 'chat'
WHERE channel = 'app';

-- Recreate channel constraint to include sms
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
