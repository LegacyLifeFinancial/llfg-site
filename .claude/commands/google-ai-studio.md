Integrate Google AI Studio (Gemini API) into the LLFG portal for AI-powered reorganization, CRM intelligence, and business insights.

## Architecture
```
Portal (index.html) → /.netlify/functions/gemini → Google Gemini API (gemini-2.0-flash)
```
API key stays server-side in Netlify env vars. NEVER in index.html.

## Setup
1. Go to aistudio.google.com → Get API Key
2. In Netlify dashboard: Site Settings → Environment Variables → Add `GEMINI_API_KEY`
3. Redeploy site

## Available Actions (via gemini.js Netlify Function)
| Action | What It Does |
|--------|-------------|
| `reorganize-web` | Analyze landing page structure, suggest conversion-optimized layout |
| `reorganize-crm` | Analyze CRM data, suggest segments, pipelines, automations |
| `score-lead` | AI-score leads by conversion probability |
| `summarize` | Executive brief per contact/deal |
| `insights` | Business intelligence from all portal data |
| `generate` | Free-form AI generation for any prompt |

## Portal Locations
- **ptab-aistudio** — AI Studio tab with 4 sub-tabs:
  - Reorganize: Website + CRM reorganization analysis
  - CRM Intelligence: Lead scoring, contact summaries, deal insights
  - Business Insights: Org-wide intelligence generation
  - AI Assistant: Conversational Gemini chat with portal context

## Integration Points
- CRM data feeds into all Gemini analyses
- TEAM_DATA provides team/agent metrics for insights
- LLFG_AgentFactory status included in context
- EventBus can trigger AI analysis on events

## Validation
- Gemini function returns 200 with { success: true, result: "..." }
- AI panels show loading spinner then formatted results
- Error state shows helpful setup instructions
- Chat history persists in session memory
