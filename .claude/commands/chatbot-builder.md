Build AI chatbot for the LLFG landing page. Answer FAQs, qualify leads, schedule interviews, hand off to live agent. Uses Claude API via Netlify Function.

## What to Build
1. Chat widget on landing page (floating bottom-right button)
2. FAQ auto-response from knowledge base content
3. Lead qualification flow: name, state, license status, experience
4. Interview scheduling integration with calendar
5. Live agent handoff when chatbot can't answer
6. Chat history logging for follow-up

## Tech
- Claude API via Netlify Function (never expose keys client-side)
- System prompt tuned for LLFG recruiting context
- Fallback to keyword matching if API unavailable

## Integration Points
- Chatbot Agent (spec_chatbot) manages conversations
- Recruiting Agent receives qualified leads
- Speed-to-Lead agent triggers on high-score leads
