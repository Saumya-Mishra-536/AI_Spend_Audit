## 4. How I Used AI Tools

**Tools Used:**
- Cursor AI (Claude) for code generation
- GitHub Copilot for autocomplete
- ChatGPT for debugging specific errors

**What I DIDN'T Use AI For:**
- **Audit engine logic**: Too critical. Wrote by hand with tests.
- **Personalized summaries**: Originally planned to use Anthropic API, but realized a well-crafted template is better than an LLM for this use case. Cheaper, faster, more deterministic.

**One Time AI Was Wrong (and I caught it):**
Cursor suggested using `localStorage` to store audit results for the shareable URL feature. This would have broken the entire viral loop—localStorage is client-side only. Each user would only see their own audits. I caught this because I understood the requirement: "shareable public URL" means server-side storage. Switched to Supabase.

**Key Lesson:**
Know when NOT to use AI. Template logic > LLM for deterministic summaries. Rule-based audit engine > AI for calculations. Use AI for boilerplate, but write the critical business logic yourself.