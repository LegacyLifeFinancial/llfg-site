Build intelligent lead routing for the LLFG portal. Route leads by agent skills, territory, capacity, past performance. Auto-assign with load balancing.

## What to Build
1. Routing rules engine (if state=X and product=Y then assign agent Z)
2. Round-robin assignment within teams
3. Capacity-based routing (don't assign to overloaded agents)
4. Skill-based matching (IUL leads to IUL-trained agents)
5. Performance-weighted routing (higher close rate = more leads)
6. Manual override for managers

## Integration Points
- Smart Router agent (ai_smartroute) executes routing
- Territory Manager provides geographic rules
- Lead Scoring provides priority for routing order
