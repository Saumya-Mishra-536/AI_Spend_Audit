'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import type { AuditResult } from '@/lib/types';

interface AISummaryProps {
  result: AuditResult;
}

export function AISummary({ result }: AISummaryProps) {
  const summary = generateSmartSummary(result);

  return (
    <Card className="mb-8 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Personalized Analysis
        </CardTitle>
        <CardDescription>Based on your team's usage patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-700 leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  );
}

function generateSmartSummary(result: AuditResult): string {
  // If already optimized
  if (result.isOptimized) {
    return `Your current AI tool setup is well-optimized. You're making smart choices with your spending, and there are no major changes needed right now. Keep monitoring as your team grows, and we'll let you know if better options emerge.`;
  }

  // If has recommendations
  const topRec = result.recommendations[0];
  const hasMultiple = result.recommendations.length > 1;
  const isHighSavings = result.totalMonthlySavings >= 500;

  // Build personalized summary
  let summary = '';

  // Opening based on savings amount
  if (isHighSavings) {
    summary += `Your team has significant optimization opportunities. `;
  } else if (result.totalMonthlySavings >= 200) {
    summary += `You're leaving money on the table with your current setup. `;
  } else {
    summary += `There are a few quick wins in your AI tool stack. `;
  }

  // Main recommendation
  if (topRec) {
    const toolName = topRec.tool.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    summary += `Your biggest opportunity is with ${toolName} — ${topRec.reasoning.split('.')[0]}. `;
    
    if (topRec.monthlySavings >= 100) {
      summary += `That alone saves you $${topRec.monthlySavings.toFixed(0)} per month. `;
    }
  }

  // Additional context
  if (hasMultiple) {
    summary += `We found ${result.recommendations.length} optimizations total, which together could free up $${result.totalMonthlySavings.toFixed(0)} per month. `;
  }

  // Call to action based on savings
  if (isHighSavings) {
    summary += `With this level of savings, you're a great fit for Credex's discounted enterprise credits—we can help you capture even more value beyond these plan changes.`;
  } else if (result.totalMonthlySavings >= 100) {
    summary += `Start with the top recommendation for the quickest win, then tackle the rest over the next quarter.`;
  } else {
    summary += `These are easy switches that add up over time—worth 30 minutes to implement.`;
  }

  return summary;
}