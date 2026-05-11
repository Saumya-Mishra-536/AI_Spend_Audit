# Prompts Used in This Project

## AI Summary Generation

**Decision: Template-based instead of LLM**

Originally planned to use Anthropic's Claude API for personalized summaries, but decided against it for these reasons:

### Why We Don't Use an LLM Here:

1. **Cost**: Anthropic requires payment. For a free tool generating potentially thousands of audits, API costs would be unsustainable.

2. **Determinism**: The audit logic is rule-based and deterministic. The summary should be too—same input should produce same output.

3. **Latency**: Template generation is instant. API calls add 1-3 seconds of wait time.

4. **Reliability**: No dependency on external API uptime or rate limits.

5. **Quality**: A well-crafted template with conditional logic is more accurate than an LLM that might hallucinate or add fluff.

### Our Approach: Smart Templates

Instead of a generic LLM prompt, we built `generateSmartSummary()` with:

- **Conditional logic** based on savings amount (high/medium/low)
- **Personalization** using the actual tool names and reasoning from recommendations
- **Variable structure** (different opening/closing based on context)
- **Specific numbers** pulled directly from the audit results

### Example Template Logic:

```typescript
if (isHighSavings) {
  opening = "Your team has significant optimization opportunities."
  closing = "You're a great fit for Credex's discounted credits."
} else if (mediumSavings) {
  opening = "You're leaving money on the table."
  closing = "Start with the top recommendation for the quickest win."
} else {
  opening = "There are a few quick wins in your stack."
  closing = "These are easy switches that add up over time."
}

summary = opening + mainRecommendation + additionalContext + closing