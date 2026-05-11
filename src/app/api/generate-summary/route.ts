import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { AuditResult } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { result } = await request.json() as { result: AuditResult };

    // If no API key, return fallback immediately
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        summary: generateFallbackSummary(result),
      });
    }

    const prompt = `You are a finance advisor analyzing AI tool spending for a tech team.

Audit Results:
- Total Monthly Savings: $${result.totalMonthlySavings}
- Total Annual Savings: $${result.totalAnnualSavings}
- Number of Recommendations: ${result.recommendations.length}
- Is Optimized: ${result.isOptimized}

Recommendations:
${result.recommendations.map(rec => `
- ${rec.tool}: Currently on ${rec.currentPlan} ($${rec.currentMonthlySpend}/mo)
  Action: ${rec.recommendedAction}
  Savings: $${rec.monthlySavings}/mo
  Reason: ${rec.reasoning}
`).join('\n')}

Write a personalized 100-word summary for this team explaining:
1. Their current spending efficiency
2. The biggest opportunity (if any)
3. A actionable next step

Be conversational, specific, and helpful. Avoid jargon.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const summary = message.content[0].type === 'text' 
      ? message.content[0].text 
      : generateFallbackSummary(result);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI summary generation error:', error);
    
    // Return fallback on any error
    const { result } = await request.json() as { result: AuditResult };
    return NextResponse.json({
      summary: generateFallbackSummary(result),
    });
  }
}

function generateFallbackSummary(result: AuditResult): string {
  if (result.isOptimized) {
    return `Your current AI tool setup is well-optimized for your team. You're making smart choices with your spending, and there are no major changes needed right now. Keep monitoring as your team grows.`;
  }

  const topRec = result.recommendations[0];
  if (!topRec) {
    return `We analyzed your AI tool spending and found some areas for optimization. Review the recommendations below to see where you can save.`;
  }

  return `Your team could save $${result.totalMonthlySavings.toFixed(0)} per month (that's $${result.totalAnnualSavings.toFixed(0)}/year). The biggest opportunity is with ${topRec.tool.replace('-', ' ')} — ${topRec.reasoning.split('.')[0]}. Start there for quick wins.`;
}