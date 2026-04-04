Audit commission reconciliation in the LLFG portal (index.html). Compare expected payouts against carrier statements and flag discrepancies.

## Before anything else
Read index.html. Find `renderCommissionsTab`, `myDeals`, `TEAM_DATA`, `COMM_VISIBILITY_CAP`, and commission calculation logic.

## Commission Math

### Expected Payout Formula
`Expected = AP x Commission% x Advance Rate (75%)`

### Tier Structure
| Role | Comm% | Override |
|------|-------|----------|
| Financial Advisor | 65% | — |
| Manager | 100% | 35% on FA production |
| Executive | 120% | 20% on Manager production |
| Director | 135% | 15% on Executive production |
| Managing Partner | 150% | 15% on Director production |

## What to Check
1. **Deal-level:** For each deal in `myDeals`, calculate expected commission vs displayed
2. **Tier accuracy:** Each agent's commission% matches their role in USERS
3. **Override math:** Upline overrides = difference between tiers
4. **Chargeback impact:** Chargebacks deducted from correct agent
5. **Cap enforcement:** `COMM_VISIBILITY_CAP` prevents seeing higher-tier rates
6. **Advance rate:** Matches documented 75% / 9-month structure

## Red Flags
- Commission% doesn't match role tier
- Override on gross instead of net
- Chargeback deducted from wrong agent
- Commission shown before policy placed
- Agent sees tiers above their visibility cap

## Output
Table: Agent | Role | Deal | AP | Expected Comm | Displayed Comm | Variance | Status

Flag any variance > $1. Show totals. Wire results into KPI Agent.

Read index.html before making any changes.
