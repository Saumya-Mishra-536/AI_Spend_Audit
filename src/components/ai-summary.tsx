'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { AuditResult, Recommendation } from '@/lib/types';
import { TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

function generateSmartSummary(result: AuditResult): string {
  // If already optimized
  if (result.isOptimized) {
    return `Your current AI tool setup is well-optimized. You're making smart choices with your spending, and there are no major changes needed right now. Keep monitoring as your team grows, and we'll let you know if better options emerge.`;
  }

  // If has recommendations
  const topRec = result.recommendations[0];
  const hasMultiple = result.recommendations.length > 1;
  const isHighSavings = result.totalMonthlySavings >= 500;
  const isMediumSavings = result.totalMonthlySavings >= 200;

  // Build personalized summary
  let summary = '';

  // Opening based on savings amount (VARIED BY TIER)
  if (isHighSavings) {
    summary += `You have a significant cost optimization opportunity here. `;
  } else if (isMediumSavings) {
    summary += `Your team is leaving meaningful money on the table. `;
  } else if (result.totalMonthlySavings >= 100) {
    summary += `There are some solid quick wins in your current setup. `;
  } else {
    summary += `A few small adjustments could add up over time. `;
  }

  // Main recommendation (USE ACTUAL TOOL NAME AND REASONING)
  if (topRec) {
    const toolName = topRec.tool.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Extract first sentence of reasoning for variety
    const firstSentence = topRec.reasoning.split('.')[0];
    summary += `The biggest opportunity is ${toolName}: ${firstSentence.toLowerCase()}. `;
    
    // Add dollar impact if significant
    if (topRec.monthlySavings >= 100) {
      summary += `Making this change alone saves $${topRec.monthlySavings.toFixed(0)}/month. `;
    } else if (topRec.monthlySavings >= 50) {
      summary += `That's a $${topRec.monthlySavings.toFixed(0)}/month reduction. `;
    }
  }

  // Additional context based on number of recommendations
  if (hasMultiple) {
    const otherSavings = result.recommendations.slice(1).reduce((sum, r) => sum + r.monthlySavings, 0);
    summary += `Beyond that, we found ${result.recommendations.length - 1} more optimization${result.recommendations.length > 2 ? 's' : ''} worth an additional $${otherSavings.toFixed(0)}/month. `;
  }

  // Call to action based on total savings (VARIED BY AMOUNT)
  if (isHighSavings) {
    summary += `With over $${result.totalMonthlySavings.toFixed(0)}/month at stake, you're exactly the type of team Credex works with—we can layer on additional savings through discounted enterprise credits.`;
  } else if (isMediumSavings) {
    summary += `At $${result.totalMonthlySavings.toFixed(0)}/month, these changes pay for themselves immediately. Start with the top item and work down the list.`;
  } else if (result.totalMonthlySavings >= 100) {
    summary += `The top recommendation takes 10 minutes to implement and delivers immediate ROI.`;
  } else {
    summary += `Small optimizations like these compound—worth a quick review this quarter.`;
  }

  return summary;
}

interface AISummaryProps {
  result: AuditResult;
}

export function AISummary({ result }: AISummaryProps) {
  const summary = generateSmartSummary(result);

  const getIcon = () => {
    if (result.isOptimized) return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (result.totalMonthlySavings >= 500) return <AlertCircle className="w-5 h-5 text-red-500" />;
    return <TrendingDown className="w-5 h-5 text-yellow-500" />;
  };

  const getBgColor = () => {
    if (result.isOptimized) return 'bg-green-50 border-green-200';
    if (result.totalMonthlySavings >= 500) return 'bg-red-50 border-red-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  return (
    <Card className={getBgColor()}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {getIcon()}
          AI-Generated Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-700 leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  );
}