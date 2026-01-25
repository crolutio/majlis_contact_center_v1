import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

/**
 * Debug endpoint to verify Contact Centre DB connectivity and ingestion.
 * GET /api/debug/cc
 */
export async function GET() {
  try {
    const [
      conversationsRes,
      messagesRes,
      identityLinksRes,
      latestMsgRes,
      latestConvRes,
    ] = await Promise.all([
      supabaseServer.from('conversations').select('id', { count: 'exact', head: true }),
      supabaseServer.from('messages').select('id', { count: 'exact', head: true }),
      supabaseServer.from('cc_identity_links').select('id', { count: 'exact', head: true }),
      supabaseServer
        .from('messages')
        .select('id, provider, provider_message_id, channel, from_address, to_address, created_at')
        .order('created_at', { ascending: false })
        .limit(3),
      supabaseServer
        .from('conversations')
        .select('id, channel, provider, provider_conversation_id, start_time')
        .order('start_time', { ascending: false })
        .limit(3),
    ]);

    const errors = [
      conversationsRes.error,
      messagesRes.error,
      identityLinksRes.error,
      latestMsgRes.error,
      latestConvRes.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase query failed',
          details: errors.map((e: any) => ({
            code: e.code,
            message: e.message,
            details: e.details,
          })),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      counts: {
        conversations: conversationsRes.count ?? null,
        messages: messagesRes.count ?? null,
        cc_identity_links: identityLinksRes.count ?? null,
      },
      latest: {
        conversations: latestConvRes.data ?? [],
        messages: latestMsgRes.data ?? [],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected error',
        message: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}


