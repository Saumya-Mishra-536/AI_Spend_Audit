'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, TrendingDown, ArrowRight, Mail } from 'lucide-react';
import type { AuditResult } from '@/lib/types';
import { LeadCaptureForm } from '@/components/lead-capture-form';
import { AISummary } from '@/components/ai-summary';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);

  useEffect(() => {
    const savedResult = sessionStorage.getItem('audit-result');
    if (!savedResult) {
      router.push('/');
      return;
    }

    try {
      const parsed = JSON.parse(savedResult);
      setResult(parsed);
    } catch (e) {
      router.push('/');
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const highSavings = result.totalMonthlySavings >= 500;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Results */}
        <div className="text-center mb-12">
          {result.isOptimized ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4">You're Spending Wisely!</h1>
              <p className="text-xl text-slate-600">
                Your AI tool stack is already optimized. Nice work.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <TrendingDown className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                You Could Save{' '}
                <span className="text-green-600">
                  ${result.totalMonthlySavings.toFixed(0)}/month
                </span>
              </h1>
              <p className="text-2xl text-slate-600 mb-2">
                That's <span className="font-semibold">${result.totalAnnualSavings.toFixed(0)}/year</span>
              </p>
              {highSavings && (
                <Badge variant="destructive" className="text-base px-4 py-1">
                  High savings opportunity
                </Badge>
              )}
            </>
          )}
        </div>

        {/* AI-Generated Summary */}
        <AISummary result={result} />

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recommended Changes</CardTitle>
              <CardDescription>
                {result.recommendations.length} optimization{result.recommendations.length !== 1 && 's'} found
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.recommendations.map((rec, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold capitalize">{rec.tool.replace('-', ' ')}</h3>
                      <p className="text-sm text-slate-500">
                        Currently: {rec.currentPlan} · ${rec.currentMonthlySpend}/mo
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-4">
                      Save ${rec.monthlySavings}/mo
                    </Badge>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 mb-2">
                    <p className="text-sm font-medium text-slate-900 mb-1">
                      {rec.recommendedAction}
                    </p>
                    <p className="text-sm text-slate-600">{rec.reasoning}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">${rec.currentMonthlySpend}/mo</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-green-600">
                      ${rec.newMonthlySpend}/mo
                    </span>
                  </div>

                  {index < result.recommendations.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* CTA based on savings */}
        {highSavings ? (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Talk to Credex
              </CardTitle>
              <CardDescription>
                With ${result.totalMonthlySavings.toFixed(0)}/mo in potential savings, you're a great fit for 
                discounted AI credits from Credex.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                We source enterprise credits from companies that over-purchased. Get 20-40% off 
                retail pricing on Cursor, Claude, ChatGPT, and API credits.
              </p>
              <Button onClick={() => setShowLeadCapture(true)} size="lg" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Get My Personalized Quote
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Stay Updated</CardTitle>
              <CardDescription>
                We'll notify you when new optimization opportunities apply to your stack.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowLeadCapture(true)} variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Me Updates
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lead Capture Modal/Form */}
        {showLeadCapture && (
          <LeadCaptureForm
            auditId={result.id}
            savings={result.totalMonthlySavings}
            onClose={() => setShowLeadCapture(false)}
          />
        )}
      </div>
    </div>
  );
}