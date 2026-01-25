/**
 * Banking-specific data store
 * Uses unified conversations/messages with cc_* audit tables
 */

import { supabaseServer } from './supabase-server';
import { Conversation } from './sample-data';
import { normalizeAddress } from './identity-resolution';

// Use server client for all banking store operations (bypasses RLS)
const supabase = supabaseServer;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isLikelyCloudflareHtmlError(message: any): boolean {
  if (typeof message !== 'string') return false;
  const m = message.toLowerCase();
  return m.includes('<html') && (m.includes('cloudflare') || m.includes('bad gateway') || m.includes('error code'));
}

/**
 * Get all banking conversations from unified conversations table
 */
export async function getAllBankingConversations(): Promise<Conversation[]> {
  try {
    let data: any = null;
    let error: any = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      const res = await supabase
        .from('conversations')
        .select(
          `
          *,
          customer:customers(*),
          agent:agents(*)
        `
        )
        .eq('industry', 'banking')
        .order('last_message_time', { ascending: false });

      data = res.data;
      error = res.error;

      if (!error) break;

      const retriable = isLikelyCloudflareHtmlError(error.message);
      console.error(`❌ Supabase query error (attempt ${attempt}/3):`, {
        code: error.code,
        message: typeof error.message === 'string' ? error.message.slice(0, 160) : error.message,
        details: error.details,
        hint: error.hint,
        retriable,
      });

      if (!retriable || attempt === 3) break;
      await sleep(250 * attempt);
    }

    if (error || !data) return [];

    return data.map((conv: any) => {
      const customerName =
        conv.customer?.name ||
        conv.customer?.email ||
        conv.customer?.phone ||
        'Unknown';

      return {
        id: conv.id,
        customer: {
          id: conv.customer?.id || '',
          name: customerName,
          email: conv.customer?.email || '',
          phone: conv.customer?.phone || '',
          avatar: conv.customer?.avatar || '/placeholder-user.jpg',
          language: conv.customer?.language || 'English',
          preferredLanguage: conv.customer?.preferred_language || 'en',
          tier: conv.customer?.tier || 'standard',
        },
        channel: conv.channel || 'whatsapp',
        status: conv.status || 'active',
        priority: conv.priority || 'medium',
        sentiment: conv.sentiment || 'neutral',
        sentimentScore: conv.sentiment_score || 0.5,
        sla: {
          deadline: conv.sla_deadline ? new Date(conv.sla_deadline) : new Date(),
          remaining: conv.sla_remaining || 0,
          status: conv.sla_status || 'healthy',
        },
        assignedTo: conv.assigned_agent_id || conv.assigned_to || null,
        queue: conv.queue || 'General Support',
        topic: conv.topic || conv.subject || '',
        lastMessage: conv.last_message || '',
        lastMessageTime: new Date(conv.last_message_time || conv.updated_at || conv.created_at),
        startTime: new Date(conv.start_time || conv.created_at),
        messages: [],
        aiConfidence: conv.ai_confidence || 0.85,
        escalationRisk: conv.escalation_risk || false,
        tags: conv.tags || [],
        metadata: {
          source: conv.source || 'banking',
          storage: 'core',
          handlingMode: conv.handling_mode || null,
        },
      };
    });
  } catch (queryError: any) {
    console.error('❌ Error in getAllBankingConversations:', queryError);
    return [];
  }
}

/**
 * Get a single banking conversation
 */
export async function getBankingConversation(id: string): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      customer:customers(*),
      messages:messages(*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;

  const messages = (data.messages || []).sort((a: any, b: any) =>
    new Date(a.created_at || a.timestamp).getTime() - new Date(b.created_at || b.timestamp).getTime()
  );

  return {
    id: data.id,
    customer: {
      id: data.customer?.id || '',
      name: data.customer?.name || 'Unknown',
      email: data.customer?.email || '',
      phone: data.customer?.phone || '',
      avatar: data.customer?.avatar || '/placeholder-user.jpg',
      language: data.customer?.language || 'English',
      preferredLanguage: data.customer?.preferred_language || 'en',
      tier: data.customer?.tier || 'standard',
    },
    channel: data.channel,
    status: data.status,
    priority: data.priority,
    sentiment: data.sentiment,
    sentimentScore: data.sentiment_score || 0.5,
    sla: {
      deadline: data.sla_deadline ? new Date(data.sla_deadline) : new Date(Date.now() + 30 * 60 * 1000),
      remaining: data.sla_remaining || 30,
      status: data.sla_status || 'healthy' as const,
    },
    assignedTo: data.assigned_agent_id || data.assigned_to || null,
    queue: data.queue || 'General Support',
    topic: data.topic || data.subject || '',
    lastMessage: data.last_message || '',
    lastMessageTime: new Date(data.last_message_time || data.updated_at || data.created_at),
    startTime: new Date(data.start_time || data.created_at),
    messages: messages.map((msg: any) => ({
      id: msg.id,
      type: msg.sender_type || msg.type,
      content: msg.content,
      timestamp: new Date(msg.created_at || msg.timestamp),
      sentiment: msg.sentiment || undefined,
      confidence: msg.confidence || undefined,
      isTranscript: msg.is_transcript || false,
    })),
    aiConfidence: data.ai_confidence || 0.85,
    escalationRisk: data.escalation_risk || false,
    tags: data.tags || [],
    metadata: {
      source: data.source || 'banking',
      storage: 'core',
      handlingMode: data.handling_mode || null,
    },
  };
}

/**
 * Create or find conversation from incoming message (idempotent)
 * Returns conversation ID and whether message was newly inserted
 */
export async function createBankingConversationFromMessage(
  message: {
    messageSid: string;
    from: string;
    to: string;
    body: string;
    channel: 'whatsapp' | 'email' | 'voice' | 'sms';
    timestamp: Date;
    provider?: string;
    fromAddress?: string;
    toAddress?: string;
    bodyJson?: any;
    mediaUrls?: string[];
  }
): Promise<{ conversationId: string; messageId: string; isNewMessage: boolean } | null> {
  try {
    // CRITICAL: Upsert identity link BEFORE any return (even for duplicates)
    // This ensures identity links are created for every inbound message
    const provider = message.provider || 'twilio';
    
    // Normalize address for identity link
    // Use fromAddress if provided (should be pre-normalized by caller), otherwise normalize from
    const fromAddressForIdentity = message.fromAddress || message.from;
    const normalizedAddress = message.fromAddress 
      ? message.fromAddress // Already normalized by caller (e.g., whatsapp:+1234567890)
      : normalizeAddress(message.channel, fromAddressForIdentity); // Normalize if not provided
    
    console.log('🔗 Identity link normalization:', {
      rawFrom: message.from,
      fromAddress: message.fromAddress,
      normalizedAddress,
      channel: message.channel,
    });
    
    // Upsert identity link - must run before any return
    try {
      // Check if link exists
      const { data: existingLink } = await supabase
        .from('cc_identity_links')
        .select('id')
        .eq('channel', message.channel)
        .eq('address', normalizedAddress)
        .maybeSingle();

      if (existingLink) {
        // Update existing link - always update last_seen_at
        await supabase
          .from('cc_identity_links')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', existingLink.id);
        
        // Audit: Success
        await writeAuditLog({
          actorType: 'system',
          eventType: 'identity_link_upserted',
          eventVersion: 1,
          inputRedacted: { channel: message.channel, addressPrefix: normalizedAddress.substring(0, 10) + '...' },
          outputRedacted: { identityLinkId: existingLink.id },
          success: true,
        });
      } else {
        // Create new link
        const { data: newLink, error: insertError } = await supabase
          .from('cc_identity_links')
          .insert({
            channel: message.channel,
            address: normalizedAddress,
            is_verified: false,
            confidence: 0,
            last_seen_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (insertError) {
          // Handle race condition (unique constraint violation)
          if (insertError.code === '23505') {
            // Another request created it - fetch and update
            const { data: raceLink } = await supabase
              .from('cc_identity_links')
              .select('id')
              .eq('channel', message.channel)
              .eq('address', normalizedAddress)
              .maybeSingle();

            if (raceLink) {
              await supabase
                .from('cc_identity_links')
                .update({ last_seen_at: new Date().toISOString() })
                .eq('id', raceLink.id);

              await writeAuditLog({
                actorType: 'system',
                eventType: 'identity_link_upserted',
                eventVersion: 1,
                inputRedacted: { channel: message.channel, addressPrefix: normalizedAddress.substring(0, 10) + '...' },
                outputRedacted: { identityLinkId: raceLink.id },
                success: true,
              });
            }
          } else {
            // Other error - log failure
            await writeAuditLog({
              actorType: 'system',
              eventType: 'identity_link_upsert_failed',
              eventVersion: 1,
              inputRedacted: { channel: message.channel, addressPrefix: normalizedAddress.substring(0, 10) + '...' },
              success: false,
              errorCode: 'IDENTITY_LINK_UPSERT_FAILED',
              errorMessage: insertError.message || 'Failed to insert identity link',
            });
            console.error('Error creating identity link:', insertError);
          }
        } else if (newLink) {
          // Audit: Success (new link created)
          await writeAuditLog({
            actorType: 'system',
            eventType: 'identity_link_upserted',
            eventVersion: 1,
            inputRedacted: { channel: message.channel, addressPrefix: normalizedAddress.substring(0, 10) + '...' },
            outputRedacted: { identityLinkId: newLink.id },
            success: true,
          });
        }
      }
    } catch (identityError: any) {
      // Audit: Failure
      await writeAuditLog({
        actorType: 'system',
        eventType: 'identity_link_upsert_failed',
        eventVersion: 1,
        inputRedacted: { channel: message.channel, addressPrefix: normalizedAddress.substring(0, 10) + '...' },
        success: false,
        errorCode: 'IDENTITY_LINK_UPSERT_FAILED',
        errorMessage: identityError?.message || 'Unknown error upserting identity link',
      });
      console.error('Error in identity link upsert:', identityError);
      // Continue processing even if identity link fails
    }

    // Step 1: Check for existing message (idempotency)
    const { data: existingMessage } = await supabase
      .from('messages')
      .select('id, conversation_id')
      .eq('provider', provider)
      .eq('provider_message_id', message.messageSid)
      .maybeSingle();

    if (existingMessage) {
      // Message already exists - return existing conversation (idempotent retry)
      console.log('🔄 Message already exists (idempotent retry):', message.messageSid);
      return {
        conversationId: existingMessage.conversation_id,
        messageId: existingMessage.id,
        isNewMessage: false,
      };
    }

    // Step 2: Find or create bank customer
    // Note: message.from is normalized without whatsapp: prefix (e.g., +1234567890)
    // We need to search for the phone number in the database
    let customerId: string | null = null;
    
    // Try to find customer by phone (message.from is already normalized without prefix)
    // Use ilike for case-insensitive matching and handle phone number variations
    const phoneNumber = message.from.replace(/^\+/, ''); // Remove + for comparison
    const { data: existingCustomer, error: customerLookupError } = await supabase
      .from('cc_bank_customers')
      .select('id')
      .or(`phone.ilike.%${phoneNumber}%,phone.eq.${message.from},phone.eq.+${phoneNumber},email.eq.${message.from}`)
      .maybeSingle();

    if (customerLookupError) {
      console.error('❌ Error looking up customer:', {
        error: customerLookupError,
        from: message.from,
        phoneNumber,
        messageSid: message.messageSid,
      });
    }

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      // Create new bank customer
      const { data: newCustomer } = await supabase
        .from('cc_bank_customers')
        .insert({
          customer_id: `CUST-${Date.now()}`,
          first_name: 'Unknown',
          last_name: 'Customer',
          phone: message.from,
          account_type: 'checking',
          account_status: 'active',
          risk_level: 'low',
          kyc_status: 'pending',
        })
        .select('id')
        .single();

      if (newCustomer) {
        customerId = newCustomer.id;
      }
    }

    if (!customerId) {
      console.error('❌ Failed to create/find customer for message:', {
        messageSid: message.messageSid,
        from: message.from,
      });
      return null;
    }

    console.log('👤 Customer found/created:', {
      customerId,
      messageSid: message.messageSid,
    });

    // Step 3: Check for existing active conversation (unified table)
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id, status')
      .eq('customer_id', customerId)
      .eq('channel', message.channel)
      .eq('provider', provider)
      .eq('provider_conversation_id', message.from)
      .eq('industry', 'banking')
      .in('status', ['open', 'pending', 'active', 'waiting', 'escalated'])
      .order('last_message_time', { ascending: false })
      .limit(1)
      .maybeSingle();

    let conversationId: string;

    if (existingConversation) {
      conversationId = existingConversation.id;
      console.log('💬 Using existing conversation:', { conversationId, messageSid: message.messageSid });
      // Bump conversation activity so it surfaces in the inbox (order-by updated_at / last message time)
      try {
        await supabase
          .from('conversations')
          .update({
            last_message: message.body,
            last_message_time: message.timestamp.toISOString(),
            updated_at: new Date().toISOString(),
            ...(existingConversation.status === 'escalated' ? {} : { status: 'active' }),
          })
          .eq('id', conversationId);
      } catch (e) {
        // Non-fatal
        console.warn('⚠️ Failed to bump conversation timestamps:', e);
      }
    } else {
      // Create new conversation (unified table)
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          customer_id: customerId,
          channel: message.channel,
          status: 'active',
          priority: 'medium',
          sentiment: 'neutral',
          sentiment_score: 0.5,
          sla_deadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          sla_remaining: 30,
          sla_status: 'healthy',
          queue: 'General Support',
          topic: 'Incoming Message',
          last_message: message.body,
          last_message_time: message.timestamp.toISOString(),
          start_time: message.timestamp.toISOString(),
          ai_confidence: 0.85,
          escalation_risk: false,
          tags: [],
          source: 'banking',
          industry: 'banking',
          provider,
          provider_conversation_id: message.from,
          handling_mode: 'ai',
          handover_required: false,
        })
        .select('id')
        .single();

      if (error || !data) {
        console.error('Error creating conversation:', error);
        return null;
      }
      conversationId = data.id;

    }

    // Step 4: Store message with all required fields
    // CRITICAL: Use normalized addresses for from_address and to_address columns
    // These should already be normalized by the caller (webhook), but normalize again if needed
    const normalizedFromForMessage = message.fromAddress 
      ? message.fromAddress // Already normalized by caller (e.g., whatsapp:+1234567890)
      : normalizeAddress(message.channel, message.from); // Fallback: normalize if not provided
    
    const normalizedToForMessage = message.toAddress
      ? message.toAddress // Already normalized by caller (e.g., whatsapp:+1234567890)
      : normalizeAddress(message.channel, message.to); // Fallback: normalize if not provided
    
    const bodyText = message.body || ''; // Handle empty body gracefully
    const bodyJson = message.bodyJson || {
      raw: message.body,
      mediaUrls: message.mediaUrls || [],
    };

    console.log('💾 Storing message with normalized addresses:', {
      from_address: normalizedFromForMessage,
      to_address: normalizedToForMessage,
      messageSid: message.messageSid,
    });

    // Build insert object for core messages
    const messageInsert: any = {
      conversation_id: conversationId,
      sender_type: 'customer',
      content: bodyText,
      created_at: message.timestamp.toISOString(),
      source: 'banking',
      channel: message.channel,
      provider,
      provider_message_id: message.messageSid,
      from_address: normalizedFromForMessage, // Normalized address (e.g., whatsapp:+1234567890)
      to_address: normalizedToForMessage, // Normalized address (e.g., whatsapp:+1234567890)
      status: 'received',
      metadata: bodyJson,
    };

    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert(messageInsert)
      .select('id')
      .single();

    if (messageError || !messageData) {
      // Check if it's a unique constraint violation (race condition)
      if (messageError?.code === '23505') {
        console.log('🔄 Message already exists (race condition):', message.messageSid);
        // Message was inserted by another request - fetch it
        const { data: existing } = await supabase
          .from('messages')
          .select('id, conversation_id')
          .eq('provider', provider)
          .eq('provider_message_id', message.messageSid)
          .single();
        
        if (existing) {
          return {
            conversationId: existing.conversation_id,
            messageId: existing.id,
            isNewMessage: false,
          };
        }
      }
      console.error('❌ Error storing message:', {
        error: messageError,
        messageSid: message.messageSid,
        conversationId,
        insertData: {
          provider,
          provider_message_id: message.messageSid,
          from_address: normalizedFromForMessage,
          to_address: normalizedToForMessage,
          channel: message.channel,
        },
      });
      return null;
    }

    console.log('✅ Message stored successfully:', {
      messageId: messageData.id,
      conversationId,
      messageSid: message.messageSid,
      from_address: normalizedFromForMessage,
      to_address: normalizedToForMessage,
    });

    return {
      conversationId,
      messageId: messageData.id,
      isNewMessage: true,
    };
  } catch (error) {
    console.error('Error creating banking conversation:', error);
    return null;
  }
}

/**
 * Store AI response in banking conversation
 */
export async function storeBankingAIResponse(
  conversationId: string,
  response: string,
  providerMsgId?: string
): Promise<void> {
  const providerMessageId = providerMsgId || `ai-${Date.now()}`;
  await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_type: 'ai',
      content: response,
      created_at: new Date().toISOString(),
      source: 'banking',
      channel: 'chat',
      provider: 'app',
      provider_message_id: providerMessageId,
      status: 'sent',
      metadata: { kind: 'ai_response' },
    });

  await supabase
    .from('conversations')
    .update({
      last_message: response,
      last_message_time: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId);
}

/**
 * Update banking conversation
 */
export async function updateBankingConversation(
  id: string,
  updates: {
    status?: string;
    priority?: string;
    assigned_queue?: string;
    topic?: string;
    sentiment?: string;
  }
): Promise<void> {
  const unifiedUpdateData: any = {};
  if (updates.status) {
    if (updates.status === 'escalated') {
      unifiedUpdateData.status = 'escalated';
      unifiedUpdateData.escalation_risk = true;
      unifiedUpdateData.handling_mode = 'human';
      unifiedUpdateData.handover_required = true;
    } else {
      unifiedUpdateData.status = updates.status;
    }
  }
  if (updates.priority) unifiedUpdateData.priority = updates.priority;
  if (updates.topic) unifiedUpdateData.topic = updates.topic;
  if (updates.sentiment) unifiedUpdateData.sentiment = updates.sentiment;
  if (updates.assigned_queue) unifiedUpdateData.queue = updates.assigned_queue;

  if (Object.keys(unifiedUpdateData).length > 0) {
    try {
      await supabase
        .from('conversations')
        .update(unifiedUpdateData)
        .eq('id', id);
    } catch (e) {
      console.warn('⚠️ Failed to update conversation:', e);
    }
  }
}

/**
 * Delete banking conversation
 */
export async function deleteBankingConversation(id: string): Promise<void> {
  // Messages will be cascade deleted via foreign key
  await supabase
    .from('conversations')
    .delete()
    .eq('id', id);
}

/**
 * Write audit log entry
 * Step 5.1: Standardized audit event schema
 * Step 5.3: Automatic redaction of sensitive data
 * 
 * Exported for use in identity-resolution.ts, supervisor.ts, and webhook handlers
 */
export async function writeAuditLog(
  event: {
    conversationId?: string;
    messageId?: string; // Step 5.1: Add message_id
    caseId?: string;
    bankCustomerId?: string;
    actorType: 'system' | 'agent' | 'customer';
    actorId?: string;
    eventType: string;
    eventVersion?: number;
    inputRedacted?: any; // Should already be redacted by caller, but we redact again for safety
    outputRedacted?: any; // Should already be redacted by caller, but we redact again for safety
    success?: boolean;
    errorCode?: string;
    errorMessage?: string;
    context?: string; // Optional context for redaction (e.g., 'auth', 'webhook', 'tool_call')
  }
): Promise<void> {
  try {
    const { redactSensitive, redactError } = await import('./audit-redaction');
    
    // Step 5.3: Redact input and output before storing
    const redactedInput = event.inputRedacted 
      ? redactSensitive(event.inputRedacted, event.context)
      : null;
    
    const redactedOutput = event.outputRedacted
      ? redactSensitive(event.outputRedacted, event.context)
      : null;

    // Step 5.1: Standardized schema - all fields must match migration 006
    await supabase
      .from('cc_audit_logs')
      .insert({
        conversation_id: event.conversationId || null,
        // Note: message_id is not a column in cc_audit_logs (per migration 006)
        // Store it in input_redacted or output_redacted if needed
        case_id: event.caseId || null,
        bank_customer_id: event.bankCustomerId || null,
        actor_type: event.actorType,
        actor_id: event.actorId || null,
        event_type: event.eventType,
        event_version: event.eventVersion || 1,
        input_redacted: redactedInput,
        output_redacted: redactedOutput,
        success: event.success !== false, // Default to true
        error_code: event.errorCode || null,
        error_message: event.errorMessage ? redactError({ message: event.errorMessage }).message : null,
        created_at: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Error writing audit log:', error);
    // Don't throw - audit logging failures shouldn't break the flow
  }
}

/**
 * Step 9 (voice): Create or find a voice conversation from an inbound Twilio call (idempotent).
 *
 * - Creates a conversations row with:
 *   channel='voice', provider='twilio', provider_conversation_id=<CallSid>
 * - Does NOT set customer_id initially (banking-grade: verified/linked later)
 * - Upserts cc_identity_links for voice address (+E164)
 */
export async function createBankingConversationFromVoiceCall(params: {
  callSid: string;
  from: string; // +E164 (or raw); used for identity + from_address
  to: string;   // +E164 (or raw)
  timestamp?: Date;
  provider?: string; // default 'twilio'
}): Promise<{ conversationId: string; isNewConversation: boolean } | null> {
  try {
    const { normalizeAddress } = await import('./identity-resolution');
    const provider = params.provider || 'twilio';
    const callSid = (params.callSid || '').trim();
    if (!callSid) {
      console.error('createBankingConversationFromVoiceCall: missing callSid');
      return null;
    }
    const openedAt = (params.timestamp || new Date()).toISOString();

    const fromAddress = normalizeAddress('voice', params.from);
    const toAddress = normalizeAddress('voice', params.to);
    const isPlausibleE164 = (v: string) => /^\+\d{6,15}$/.test(v);

    // A) Upsert identity link (no bank_customer binding yet)
    if (isPlausibleE164(fromAddress)) {
      try {
        const { data: existingLink } = await supabase
          .from('cc_identity_links')
          .select('id')
          .eq('channel', 'voice')
          .eq('address', fromAddress)
          .maybeSingle();

        if (existingLink) {
          await supabase
            .from('cc_identity_links')
            .update({ last_seen_at: new Date().toISOString() })
            .eq('id', existingLink.id);
        } else {
          await supabase
            .from('cc_identity_links')
            .insert({
              channel: 'voice',
              address: fromAddress,
              is_verified: false,
              confidence: 0,
              last_seen_at: new Date().toISOString(),
            });
        }
      } catch (identityError: any) {
        await writeAuditLog({
          actorType: 'system',
          eventType: 'identity_link_upsert_failed',
          eventVersion: 1,
          inputRedacted: { channel: 'voice', addressPrefix: fromAddress.substring(0, 6) + '...' },
          success: false,
          errorCode: 'IDENTITY_LINK_UPSERT_FAILED',
          errorMessage: identityError?.message || 'Unknown error upserting identity link',
          context: 'webhook',
        });
        // Continue (fail-open for identity link upsert)
      }
    }

    // B) Repair path: if a call-start marker exists, use it to locate the conversation deterministically
    // (helps fix older rows where provider/provider_conversation_id were left NULL).
    try {
      const { data: marker } = await supabase
        .from('messages')
        .select('conversation_id')
        .eq('channel', 'voice')
        .eq('provider_message_id', `CALL-${callSid}-START`)
        .limit(1)
        .maybeSingle();

      const markerConversationId = (marker as any)?.conversation_id as string | undefined;
      if (markerConversationId) {
        await supabase
          .from('conversations')
          .update({
            provider,
            provider_conversation_id: callSid,
            updated_at: new Date().toISOString(),
          })
          .eq('id', markerConversationId);

        return { conversationId: markerConversationId, isNewConversation: false };
      }
    } catch {
      // Non-fatal
    }

    // C) Find conversation by (channel, provider_conversation_id) and ensure provider is set
    // IMPORTANT: Do NOT require provider match here, since older rows may have provider NULL.
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('id,provider')
      .eq('channel', 'voice')
      .eq('provider_conversation_id', callSid)
      .maybeSingle();

    if (existingConv?.id) {
      // Ensure provider fields are always present for voice
      await supabase
        .from('conversations')
        .update({
          provider: existingConv.provider || provider,
          provider_conversation_id: callSid,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingConv.id);

      return { conversationId: existingConv.id, isNewConversation: false };
    }

    // D) Create conversation
    // Default agent ID for testing purposes
    const DEFAULT_AGENT_ID = "e66fa391-28b5-44ec-b3a9-4397c2f2d225";
    
    const { data: created, error } = await supabase
      .from('conversations')
      .insert({
        customer_id: null,
        channel: 'voice',
        status: 'active',
        priority: 'medium',
        sentiment: 'neutral',
        sentiment_score: 0.5,
        sla_deadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        sla_remaining: 30,
        sla_status: 'healthy',
        assigned_agent_id: DEFAULT_AGENT_ID,
        queue: 'General Support',
        topic: 'Inbound Voice Call',
        last_message: 'Call in progress',
        last_message_time: openedAt,
        start_time: openedAt,
        ai_confidence: 0.85,
        escalation_risk: false,
        source: 'banking',
        industry: 'banking',
        provider,
        provider_conversation_id: callSid,
        handling_mode: 'ai',
        handover_required: false,
      })
      .select('id')
      .single();

    if (error || !created) {
      console.error('Error creating voice conversation:', error);
      return null;
    }

    // D) Store a lightweight "call started" system message for UI continuity (optional)
    // Use provider_message_id namespace to keep uniqueness.
    try {
      await supabase.from('messages').insert({
        conversation_id: created.id,
        sender_type: 'system',
        content: '[Call started]',
        created_at: openedAt,
        source: 'banking',
        channel: 'voice',
        provider,
        provider_message_id: `CALL-${callSid}-START`,
        from_address: fromAddress,
        to_address: toAddress,
        status: 'received',
        metadata: {
          kind: 'call_started',
          callSid,
          provider,
          provider_conversation_id: callSid,
        },
      });
    } catch {
      // Non-fatal
    }

    return { conversationId: created.id, isNewConversation: true };
  } catch (error) {
    console.error('Error in createBankingConversationFromVoiceCall:', error);
    return null;
  }
}

/**
 * Step 9 (voice): Append a transcript turn (canonical `cc_call_transcripts`),
 * and optionally mirror into `messages` for inbox UI.
 *
 * Returns `{ transcriptId, messageId? }`.
 */
export async function appendVoiceTranscriptTurn(params: {
  conversationId: string;
  provider: string; // e.g. 'vapi'
  providerCallId?: string; // e.g. twilio CallSid / vapi call.id
  providerTurnId?: string; // stable turn id if available
  speaker: 'customer' | 'ai' | 'agent' | 'system';
  text: string;
  occurredAt: Date;
  isFinal?: boolean;
  confidence?: number;
  startMs?: number;
  endMs?: number;

  // Mirroring into messages
  mirrorToMessages?: boolean;
  fromAddress?: string; // +E164 caller (for inbound) or your number (for outbound)
  toAddress?: string;
  direction?: 'inbound' | 'outbound';
}): Promise<{ transcriptId: string | null; messageId: string | null; wasDuplicate: boolean }> {
  const {
    conversationId,
    provider,
    providerCallId,
    providerTurnId,
    speaker,
    text,
    occurredAt,
    isFinal,
    confidence,
    startMs,
    endMs,
    mirrorToMessages,
    fromAddress,
    toAddress,
    direction,
  } = params;

  const occurredAtIso = occurredAt.toISOString();

  // A) Dedupe transcript insert (best-effort)
  if (providerTurnId) {
    try {
      const { data: existing } = await supabase
        .from('cc_call_transcripts')
        .select('id')
        .eq('provider', provider)
        .eq('provider_call_id', providerCallId || null)
        .eq('provider_turn_id', providerTurnId)
        .maybeSingle();

      if (existing?.id) {
        // Audit: persisted (duplicate)
        await writeAuditLog({
          conversationId,
          actorType: 'system',
          eventType: 'voice_transcript_persisted',
          eventVersion: 1,
          inputRedacted: {
            provider,
            provider_call_id: providerCallId || null,
            provider_turn_id: providerTurnId,
            speaker,
            is_final: isFinal !== false,
          },
          outputRedacted: {
            transcript_id: existing.id,
            was_duplicate: true,
          },
          success: true,
          context: 'webhook',
        });

        return { transcriptId: existing.id, messageId: null, wasDuplicate: true };
      }
    } catch (e: any) {
      // Non-fatal; continue to insert path
      await writeAuditLog({
        conversationId,
        actorType: 'system',
        eventType: 'voice_transcript_persist_failed',
        eventVersion: 1,
        inputRedacted: { provider, provider_turn_id: providerTurnId },
        success: false,
        errorCode: 'VOICE_TRANSCRIPT_DEDUPE_FAILED',
        errorMessage: e?.message || 'Failed to dedupe transcript',
        context: 'webhook',
      });
    }
  }

  let insertedTx: { id: string } | null = null;
  try {
    const { data, error: txErr } = await supabase
      .from('cc_call_transcripts')
      .insert({
        conversation_id: conversationId,
        provider,
        provider_call_id: providerCallId || null,
        provider_turn_id: providerTurnId || null,
        speaker,
        text,
        occurred_at: occurredAtIso,
        is_final: isFinal !== false,
        confidence: confidence ?? null,
        start_ms: startMs ?? null,
        end_ms: endMs ?? null,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (txErr) {
      await writeAuditLog({
        conversationId,
        actorType: 'system',
        eventType: 'voice_transcript_persist_failed',
        eventVersion: 1,
        inputRedacted: {
          provider,
          provider_call_id: providerCallId || null,
          provider_turn_id: providerTurnId || null,
          speaker,
          is_final: isFinal !== false,
        },
        success: false,
        errorCode: txErr.code || 'VOICE_TRANSCRIPT_INSERT_FAILED',
        errorMessage: txErr.message || 'Failed to insert cc_call_transcripts row',
        context: 'webhook',
      });

      console.error('appendVoiceTranscriptTurn: failed to insert cc_call_transcripts', txErr);
      return { transcriptId: null, messageId: null, wasDuplicate: false };
    }

    insertedTx = data || null;
  } catch (e: any) {
    await writeAuditLog({
      conversationId,
      actorType: 'system',
      eventType: 'voice_transcript_persist_failed',
      eventVersion: 1,
      inputRedacted: {
        provider,
        provider_call_id: providerCallId || null,
        provider_turn_id: providerTurnId || null,
        speaker,
        is_final: isFinal !== false,
      },
      success: false,
      errorCode: 'VOICE_TRANSCRIPT_INSERT_FAILED',
      errorMessage: e?.message || 'Failed to insert cc_call_transcripts row',
      context: 'webhook',
    });
    return { transcriptId: null, messageId: null, wasDuplicate: false };
  }

  // Audit: persisted (success)
  await writeAuditLog({
    conversationId,
    actorType: 'system',
    eventType: 'voice_transcript_persisted',
    eventVersion: 1,
    inputRedacted: {
      provider,
      provider_call_id: providerCallId || null,
      provider_turn_id: providerTurnId || null,
      speaker,
      is_final: isFinal !== false,
      confidence: confidence ?? null,
    },
    outputRedacted: {
      transcript_id: insertedTx?.id,
      was_duplicate: false,
    },
    success: true,
    context: 'webhook',
  });

  // B) Optional mirror into messages (for unified inbox timeline)
  let messageId: string | null = null;
  if (mirrorToMessages) {
    const providerMessageId =
      providerTurnId
        ? `turn:${providerCallId || 'unknown'}:${providerTurnId}`
        : `turn:${providerCallId || 'unknown'}:${occurredAt.getTime()}`;

    try {
      const { data: existingMsg } = await supabase
        .from('messages')
        .select('id')
        .eq('provider', provider)
        .eq('provider_message_id', providerMessageId)
        .maybeSingle();

      if (existingMsg?.id) {
        messageId = existingMsg.id;
      } else {
        const { data: msgRow } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_type:
              speaker === 'customer'
                ? 'customer'
                : speaker === 'ai'
                  ? 'ai'
                  : speaker === 'agent'
                    ? 'agent'
                    : 'system',
            content: text,
            created_at: occurredAtIso,
            source: 'banking',
            channel: 'voice',
            provider,
            provider_message_id: providerMessageId,
            from_address: fromAddress || null,
            to_address: toAddress || null,
            status: 'received',
            metadata: {
              is_transcript: true,
              speaker,
              provider_turn_id: providerTurnId || null,
              provider_call_id: providerCallId || null,
              is_final: isFinal !== false,
              confidence: confidence ?? null,
              start_ms: startMs ?? null,
              end_ms: endMs ?? null,
              direction: direction || (speaker === 'customer' ? 'inbound' : 'outbound'),
            },
          })
          .select('id')
          .single();

        messageId = msgRow?.id || null;
      }
    } catch (e) {
      console.warn('appendVoiceTranscriptTurn: failed to mirror into messages', e);
    }
  }

  return { transcriptId: insertedTx?.id || null, messageId, wasDuplicate: false };
}
