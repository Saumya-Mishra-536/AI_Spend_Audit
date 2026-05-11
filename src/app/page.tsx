import { AuditForm } from '@/components/audit-form';
import { Zap, TrendingDown, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Stop Overpaying for AI Tools
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Free audit finds hidden waste in your Cursor, Claude, ChatGPT, and API spend.
            Most teams save $500-2000/month.
          </p>
          
          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>2 minute audit</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-500" />
              <span>Avg. $840/mo saved</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>No login required</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <AuditForm />
      </div>

      {/* Footer */}
      <footer className="border-t mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          Built by <a href="https://credex.rocks" className="underline">Credex</a> · 
          We sell discounted AI credits to startups
        </div>
      </footer>
    </div>
  );
}