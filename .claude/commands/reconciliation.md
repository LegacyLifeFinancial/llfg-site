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

## Reconciliation Patterns (from Firefly III / Akaunting)

### Double-Entry Verification
Model each commission as a balanced journal entry. If debits != credits, the entry is invalid:
```javascript
function verifyEntry(entry) {
  // Every commission paid must have a matching revenue source
  // Debit: Commission Expense | Credit: Cash
  // If chargeback: Debit: Cash | Credit: Commission Expense (reversal)
  return entry.debitAmount === entry.creditAmount;
}
```

### Carrier Statement Reconciliation Workflow (from Akaunting)
1. **Import**: Upload carrier commission statement (CSV/PDF)
2. **Match**: Auto-match statement lines to portal deals by policy number + agent
3. **Flag**: Highlight unmatched entries (commission paid but no matching deal, or deal exists but no payment)
4. **Resolve**: Mark as reconciled, adjusted, or disputed
5. **Report**: Generate reconciliation summary with match rate and total variance

### Nested Override Verification
Verify overrides cascade correctly through the hierarchy:
```
FA commission:       AP x 65% x 75% advance = FA payout
Manager override:    AP x (100% - 65%) x 75% = Manager override
Executive override:  AP x (120% - 100%) x 75% = Executive override
Director override:   AP x (135% - 120%) x 75% = Director override
```
Sum of all tiers should equal AP x highest_applicable_rate x 75%. If not, there's a leak.

### Supabase for Persistent Reconciliation
Store reconciliation results durably instead of localStorage:
```javascript
await supabase.from('reconciliation_runs').insert({
  run_date: new Date().toISOString(),
  total_deals: n, matched: m, variance_total: v,
  status: v > 0 ? 'discrepancy' : 'clean'
});
```

## Output
Table: Agent | Role | Deal | AP | Expected Comm | Displayed Comm | Variance | Status

Flag any variance > $1. Show totals. Wire results into KPI Agent.

Read index.html before making any changes.
