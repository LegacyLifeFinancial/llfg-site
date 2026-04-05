Split commissions between agents in the LLFG portal. Partnership deals, mentor/mentee splits, team overrides, split history tracking.

## What to Build
1. Split configuration per deal (agent A: 60%, agent B: 40%)
2. Pre-defined split templates (mentor/mentee, partnership, referral)
3. Split calculation integrated with commission math
4. Split history and audit trail
5. Manager approval for non-standard splits
6. Reporting: total splits paid, splits by agent, split trends

## Integration Points
- Commission Splitter agent (spec_commsplit) manages splits
- Reconciliation skill verifies split math
- Accounting skill includes splits in P&L
