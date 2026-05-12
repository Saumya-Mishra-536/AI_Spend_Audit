import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';
import { ShareButton } from '@/components/share-button';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data } = await supabase
    .from('audits')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!data) {
    return { title: 'Audit Not Found' };
  }

  const savings = data.total_monthly_savings;
  const description = data.is_optimized
    ? 'This team is already optimized for AI spending!'
    : `This team could save $${Number(savings).toFixed(0)}/month on AI tools`;

  return {
    title: `AI Spend Audit - Save $${Number(savings).toFixed(0)}/month`,
    description,
    openGraph: {
      title: `💰 Save $${Number(savings).toFixed(0)}/month on AI Tools`,
      description,
      images: [
        {
          url: `/api/og?savings=${savings}&optimized=${data.is_optimized}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `💰 Save $${Number(savings).toFixed(0)}/month on AI Tools`,
      description,
      images: [`/api/og?savings=${savings}&optimized=${data.is_optimized}`],
    },
  };
}

export default async function SharedAuditPage({ params }: PageProps) {
  const { data: audit } = await supabase
    .from('audits')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!audit) {
    notFound();
  }

  const recommendations = audit.recommendations;
  const totalMonthlySavings = audit.total_monthly_savings;
  const totalAnnualSavings = audit.total_annual_savings;
  const isOptimized = audit.is_optimized;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm text-slate-500 mb-2">AI Spend Audit Results</p>
          <h1 className="text-4xl font-bold mb-4">
            {isOptimized ? (
              'Optimized AI Spend ✅'
            ) : (
              <>
                Save{' '}
                <span className="text-green-600">
                  ${Number(totalMonthlySavings).toFixed(0)}/month
                </span>
              </>
            )}
          </h1>
          {!isOptimized && (
            <p className="text-xl text-slate-600">
              That's{' '}
              <span className="font-semibold">
                ${Number(totalAnnualSavings).toFixed(0)}/year
              </span>{' '}
              in savings
            </p>
          )}
        </div>

        {/* Share Button */}
        <div className="flex justify-center mb-8">
          <ShareButton auditId={params.id} savings={Number(totalMonthlySavings)} />
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recommended Changes</CardTitle>
              <CardDescription>
                {recommendations.length} optimization
                {recommendations.length !== 1 && 's'} found
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {recommendations.map((rec: any, index: number) => (
                <div key={index}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold capitalize">
                        {rec.tool.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Currently: {rec.currentPlan} · ${rec.currentMonthlySpend}/mo
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-4 whitespace-nowrap">
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
                    <span className="text-slate-500">
                      ${rec.currentMonthlySpend}/mo
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-green-600">
                      ${rec.newMonthlySpend}/mo
                    </span>
                  </div>

                  {index < recommendations.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="py-12 text-center">
              <p className="text-lg text-slate-600">
                This team&apos;s AI spending is already optimized. 🎉
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-8">
          <CardHeader>
            <CardTitle>Want Your Own Audit?</CardTitle>
            <CardDescription>
              Free personalized analysis of your AI tool spending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="/"
              className="inline-flex items-center justify-center w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Run Your Free Audit →
            </a>
          </CardContent>
        </Card>

        <footer className="text-center text-sm text-slate-500">
          Powered by{' '}
          <a href="https://credex.rocks" className="underline">
            Credex
          </a>{' '}
          · Discounted AI credits for startups
        </footer>
      </div>
    </div>
  );
}