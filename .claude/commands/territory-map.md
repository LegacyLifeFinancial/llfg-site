Visualize agent territories on a US map in the LLFG portal. State assignments, overlap detection, performance heat maps by region.

## What to Build
1. SVG US map with clickable states
2. Color-code states by assigned agent/team
3. Performance heat map overlay (AP per state)
4. Territory assignment manager for admin
5. Overlap detection alerts when multiple agents in same state
6. Agent count per territory display

## Integration Points
- Territory Manager agent (crm_territory) manages assignments
- Revenue-ops skill provides AP data per state
- Agent Roster skill provides agent-state mapping
