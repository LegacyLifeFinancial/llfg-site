Build ML-powered lead scoring for the LLFG portal. Historical close rate analysis, demographic weighting, optimal contact timing, conversion probability.

## What to Build
1. Scoring model based on: source, response time, product interest, state, experience
2. Historical pattern analysis from won/lost deals
3. Score auto-update on each interaction
4. Optimal contact time prediction (when to call/email for best response)
5. Conversion probability percentage per lead
6. Score explanation: show which factors raised/lowered score

## Integration Points
- Predictive Lead agent (ai_predlead) calculates scores
- Lead Scoring agent (crm_leadscore) applies weights
- Smart Router uses scores for priority assignment
