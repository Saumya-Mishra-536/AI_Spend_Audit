import { NextRequest, NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit-engine';
import { supabase } from '@/lib/supabase';
import type { AuditInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const input: AuditInput = {
      tools: body.tools.map((t: any) => ({
        tool: t.tool,
        plan: t.plan,
        monthlySpend: Number(t.monthlySpend),
        seats: Number(t.seats),
      })),
      teamSize: Number(body.teamSize),
      useCase: body.useCase,
    };

    const result = runAudit(input);

    // Store in Supabase for shareable URLs
    const { error } = await supabase.from('audits').insert({
      id: result.id,
      recommendations: result.recommendations,
      total_monthly_savings: result.totalMonthlySavings,
      total_annual_savings: result.totalAnnualSavings,
      is_optimized: result.isOptimized,
    });

    if (error) {
      console.error('Supabase insert error:', error.message);
      // Don't fail the request - audit still works without storage
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to run audit',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}