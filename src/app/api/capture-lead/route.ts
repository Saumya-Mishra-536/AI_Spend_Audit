import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot check - if website field is filled, it's a bot
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const { email, companyName, role, teamSize, auditId, savings } = body;

    if (!email || !auditId) {
      return NextResponse.json(
        { error: 'Email and audit ID are required' },
        { status: 400 }
      );
    }

    // Store lead in Supabase
    const { error: dbError } = await supabase.from('leads').insert({
      email,
      company_name: companyName || null,
      role: role || null,
      team_size: teamSize || null,
      audit_id: auditId,
      savings: savings,
    });

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't fail - still return success to user
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}