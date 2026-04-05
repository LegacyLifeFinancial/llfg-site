Build AI assistant overlay for the LLFG portal. Context-aware help, natural language queries, action suggestions powered by Claude API via Netlify Function.

## What to Build
1. Floating assistant button (bottom-right, expandable chat panel)
2. Natural language queries: "Show me my top deals this month"
3. Context-aware: knows which tab you're on, your role, your data
4. Action suggestions: "You have 3 leads not contacted — want to email them?"
5. Quick actions from chat: "Send welcome email to John Smith"
6. Conversation history in localStorage

## Tech
- Claude API via Netlify Function (API key server-side only)
- System prompt with portal context (current tab, role, recent actions)
- Streaming responses for real-time typing effect

## Integration Points
- All portal data available as context for the AI
- Actions trigger existing portal functions
- Knowledge Base provides FAQ answers
