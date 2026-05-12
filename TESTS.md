# Automated Tests

## Test Suite: Audit Engine
**File:** `src/lib/audit-engine.test.ts`
**How to run:** `npm run test`

### Coverage
1. **Cursor Downgrade Logic**: Verifies that a team of 3 on Cursor Business ($40/seat) is correctly recommended to downgrade to Pro ($20/seat), saving $60/mo.
2. **GitHub Copilot Enterprise Logic**: Verifies teams under 10 seats on Enterprise are recommended Business tier.
3. **Claude Team Minimums**: Verifies that paying for a 5-seat minimum Team plan when you only have 3 users triggers a recommendation to switch to individual Pro plans.
4. **High API Spend Detection**: Verifies that OpenAI/Anthropic API spend over $500/mo triggers the Credex discounted credits recommendation with a 30% estimated savings.
5. **Optimized State**: Verifies that a user on appropriate plans with < $50 savings returns `isOptimized: true`.

### Design Decisions
- Tests focus exclusively on the **business logic** (the audit engine), not React components.
- The audit engine is a pure function, making it highly testable without mocking databases or APIs.
- We intentionally did not mock the LLM because we replaced it with deterministic template logic, which is inherently tested by the engine output.