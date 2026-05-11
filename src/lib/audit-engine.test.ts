import { describe, it, expect } from 'vitest';
import { runAudit } from './audit-engine';
import type { AuditInput } from './types';

describe('Audit Engine', () => {
  it('should recommend downgrade from Cursor Business to Pro for small teams', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'cursor',
          plan: 'business',
          monthlySpend: 120, // 3 seats * $40
          seats: 3,
        },
      ],
      teamSize: 3,
      useCase: 'coding',
    };

    const result = runAudit(input);
    
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].recommendedAction).toBe('Downgrade to Pro');
    expect(result.recommendations[0].monthlySavings).toBe(60);
  });

  it('should recommend downgrade from GitHub Copilot Enterprise to Business', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'github-copilot',
          plan: 'enterprise',
          monthlySpend: 390, // 10 seats * $39
          seats: 10,
        },
      ],
      teamSize: 10,
      useCase: 'coding',
    };

    const result = runAudit(input);
    
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].monthlySavings).toBe(200);
  });

  it('should recommend Claude Pro over Team for less than 5 users', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'claude',
          plan: 'team',
          monthlySpend: 125, // 5 seat minimum * $25
          seats: 3,
        },
      ],
      teamSize: 3,
      useCase: 'writing',
    };

    const result = runAudit(input);
    
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].newMonthlySpend).toBe(60);
  });

  it('should recommend Credex for high API spend', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'openai-api',
          plan: 'payg',
          monthlySpend: 1000,
          seats: 1,
        },
      ],
      teamSize: 5,
      useCase: 'coding',
    };

    const result = runAudit(input);
    
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].recommendedAction).toContain('Credex');
    expect(result.recommendations[0].monthlySavings).toBe(300);
  });

  it('should return isOptimized=true when savings < $50', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'cursor',
          plan: 'pro',
          monthlySpend: 20,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: 'coding',
    };

    const result = runAudit(input);
    
    expect(result.isOptimized).toBe(true);
    expect(result.totalMonthlySavings).toBeLessThan(50);
  });
});