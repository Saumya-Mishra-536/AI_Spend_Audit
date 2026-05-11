'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import type { AuditResult } from '@/lib/types';

interface AISummaryProps {
  result: AuditResult;
}

export function AISummary({ result }: AISummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch('/api/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ result }),
        });

        const data = await response.json();
        
        if (data.summary) {
          setSummary(data.summary);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to generate summary:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, [result]);

  // Fallback summary if AI fails
  const fallbackSummary = result.isOptimized
    ? `Your current AI tool setup is well-optimized for your team size and use case. You're making smart choices with your ${result.recommendations.length === 0 ? 'current stack' : 'spending'}.`
    : `Based on your team of ${result.recommendations[0]?.tool ? 'users' : 'members'}, we found ${result.recommendations.length} optimization${result.recommendations.length !== 1 ? 's' : ''} that could save you $${result.totalMonthlySavings.toFixed(0)} per month. The biggest opportunity is in ${result.recommendations[0]?.tool.replace('-', ' ')} where ${result.recommendations[0]?.reasoning.toLowerCase()}`;

  return (
    <Card className="mb-8 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Analysis
        </CardTitle>
        <CardDescription>Personalized insights for your team</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating personalized analysis...</span>
          </div>
        ) : (
          <p className="text-slate-700 leading-relaxed">
            {error || !summary ? fallbackSummary : summary}
          </p>
        )}
      </CardContent>
    </Card>
  );
}