export const PRICING = {
  cursor: {
    hobby: { price: 0, name: 'Hobby' },
    pro: { price: 20, name: 'Pro' },
    business: { price: 40, name: 'Business' },
  },
  'github-copilot': {
    individual: { price: 10, name: 'Individual' },
    business: { price: 19, name: 'Business' },
    enterprise: { price: 39, name: 'Enterprise' },
  },
  claude: {
    free: { price: 0, name: 'Free' },
    pro: { price: 20, name: 'Pro' },
    team: { price: 25, name: 'Team', minSeats: 5 },
  },
  chatgpt: {
    free: { price: 0, name: 'Free' },
    plus: { price: 20, name: 'Plus' },
    team: { price: 25, name: 'Team', minSeats: 3 },
  },
  'openai-api': {
    payg: { price: 0, name: 'Pay-as-you-go' },
  },
  'anthropic-api': {
    payg: { price: 0, name: 'Pay-as-you-go' },
  },
  gemini: {
    free: { price: 0, name: 'Free' },
    advanced: { price: 20, name: 'Advanced' },
  },
  windsurf: {
    free: { price: 0, name: 'Free' },
    pro: { price: 10, name: 'Pro' },
  },
} as const;