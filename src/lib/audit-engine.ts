import { AuditInput, AuditResult, Recommendation, ToolUsage } from './types';
import { PRICING } from './pricing';
import { nanoid } from 'nanoid';

export function runAudit(input: AuditInput): AuditResult {
  const recommendations: Recommendation[] = [];

  for (const toolUsage of input.tools) {
    const recommendation = analyzeToolUsage(toolUsage, input.teamSize, input.useCase);
    if (recommendation) {
      recommendations.push(recommendation);
    }
  }

  const totalMonthlySavings = recommendations.reduce(
    (sum, rec) => sum + rec.monthlySavings,
    0
  );

  const isOptimized = totalMonthlySavings < 50;

  return {
    id: nanoid(10),
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    isOptimized,
    createdAt: new Date(),
  };
}

function analyzeToolUsage(
  usage: ToolUsage,
  teamSize: number,
  useCase: string
): Recommendation | null {
  const { tool, plan, monthlySpend, seats } = usage;

  // Cursor analysis
  if (tool === 'cursor') {
    if (plan === 'business' && seats <= 3) {
      return {
        tool,
        currentPlan: plan,
        currentMonthlySpend: monthlySpend,
        recommendedAction: 'Downgrade to Pro',
        recommendedPlan: 'pro',
        newMonthlySpend: seats * 20,
        monthlySavings: monthlySpend - seats * 20,
        reasoning: 'Business plan ($40/seat) is designed for teams 5+. Pro ($20/seat) has all features needed for small teams.',
      };
    }
  }

  // GitHub Copilot analysis
  if (tool === 'github-copilot') {
    if (plan === 'enterprise' && seats <= 10) {
      return {
        tool,
        currentPlan: plan,
        currentMonthlySpend: monthlySpend,
        recommendedAction: 'Downgrade to Business',
        recommendedPlan: 'business',
        newMonthlySpend: seats * 19,
        monthlySavings: monthlySpend - seats * 19,
        reasoning: 'Enterprise ($39/seat) provides SAML SSO and audit logs. Unless you need compliance features, Business ($19/seat) is sufficient.',
      };
    }
  }

  // Claude Team plan analysis
  if (tool === 'claude') {
    if (plan === 'team' && seats < 5) {
      const proCost = seats * 20;
      return {
        tool,
        currentPlan: plan,
        currentMonthlySpend: monthlySpend,
        recommendedAction: 'Switch to Pro individual plans',
        recommendedPlan: 'pro',
        newMonthlySpend: proCost,
        monthlySavings: monthlySpend - proCost,
        reasoning: 'Team plan requires 5 seat minimum ($125/mo). For fewer users, individual Pro plans ($20 each) cost less.',
      };
    }
  }

  // ChatGPT Team analysis
  if (tool === 'chatgpt') {
    if (plan === 'team' && seats < 3) {
      const plusCost = seats * 20;
      return {
        tool,
        currentPlan: plan,
        currentMonthlySpend: monthlySpend,
        recommendedAction: 'Switch to Plus individual plans',
        recommendedPlan: 'plus',
        newMonthlySpend: plusCost,
        monthlySavings: monthlySpend - plusCost,
        reasoning: 'Team plan requires 3 seat minimum ($75/mo). For 1-2 users, Plus plans ($20 each) cost less.',
      };
    }
  }

  // High API spend analysis
  if (tool === 'openai-api' && monthlySpend > 500) {
    return {
      tool,
      currentPlan: plan,
      currentMonthlySpend: monthlySpend,
      recommendedAction: 'Consider Credex discounted credits',
      newMonthlySpend: monthlySpend * 0.7, // Assume 30% discount
      monthlySavings: monthlySpend * 0.3,
      reasoning: `At $${monthlySpend}/mo API spend, bulk credits from Credex could save 20-40% vs. pay-as-you-go retail pricing.`,
    };
  }

  if (tool === 'anthropic-api' && monthlySpend > 500) {
    return {
      tool,
      currentPlan: plan,
      currentMonthlySpend: monthlySpend,
      recommendedAction: 'Consider Credex discounted credits',
      newMonthlySpend: monthlySpend * 0.7,
      monthlySavings: monthlySpend * 0.3,
      reasoning: `At $${monthlySpend}/mo API spend, bulk credits from Credex could save 20-40% vs. pay-as-you-go retail pricing.`,
    };
  }

  // No savings opportunity
  return null;
}