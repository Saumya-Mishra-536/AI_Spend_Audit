export type Tool = 
  | 'cursor' 
  | 'github-copilot' 
  | 'claude' 
  | 'chatgpt' 
  | 'openai-api' 
  | 'anthropic-api' 
  | 'gemini' 
  | 'windsurf';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolUsage {
  tool: Tool;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolUsage[];
  teamSize: number;
  useCase: UseCase;
}

export interface Recommendation {
  tool: Tool;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendedAction: string;
  recommendedPlan?: string;
  newMonthlySpend: number;
  monthlySavings: number;
  reasoning: string;
}

export interface AuditResult {
  id: string;
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isOptimized: boolean;
  createdAt: Date;
}