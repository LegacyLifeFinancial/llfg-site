Audit the LLFG commission structure in index.html. This skill helps verify compensation logic is correct and optimized for the business.

## 1. Commission Rate Table
Extract and display the full commission rate structure from the code:

| Role | Commission % Range | Monthly AP Requirement | Team Requirement |
|------|-------------------|----------------------|-----------------|
| Financial Advisor | 65–90% | Personal production | — |
| Manager | 100–110% | $150K team AP | 3 teams of 4+ agents |
| Executive | 120–130% | $500K team AP | 3 Managers |
| Director | 135% | $1.5M team AP | 3 Executives |
| Managing Partner | 140–150% | $6M team AP | 3+ Directors |

Verify the code matches these documented rates. Flag any discrepancies.

## 2. Visibility Cap Logic
Check the commission visibility cap implementation:
- FA should see up to 120% (two tiers above own 65-90%)
- Manager should see up to 135% (two tiers above own 100-110%)
- Executive+ should see up to 150%

Find the code that implements this cap and verify it works correctly for each role.

## 3. Org Commission Table Access
Verify `renderCommissionsTab()`:
- The org-wide commission table (`orgCommSection`) must only render for Manager+ roles
- FAs should see their personal commissions ONLY
- Check that the `isManagerPlus` gate is properly implemented

## 4. Commission Request System
Review the commission request (`commreq`) tab:
- Verify all roles can access it
- Check what data is collected in the commission request form
- Verify the approval workflow logic if present

## 5. Revenue Optimization Opportunities
Analyze the commission structure for potential business insights:
- Are there clear promotion incentive pathways coded into the portal?
- Does the portal surface team AP metrics that help agents understand what they need to advance?
- Are commission calculations automated or manual?
- Suggest improvements that could help agents track their path to the next tier

## 6. Double-Entry Audit Verification (from Akaunting / Firefly III)

### Balanced Entry Check
Every commission payout should be traceable as a balanced journal entry:
```
Debit:  Commission Expense    $4,500
Credit: Cash / Payable        $4,500
```
If any entry is unbalanced, it indicates a calculation error or missing transaction.

### Override Cascade Integrity
Verify the full override chain sums correctly:
```
Deal AP: $10,000
FA (65%):         $10,000 x 0.65 x 0.75 = $4,875
Manager override: $10,000 x 0.35 x 0.75 = $2,625  (100% - 65% = 35% spread)
Exec override:    $10,000 x 0.20 x 0.75 = $1,500  (120% - 100% = 20% spread)
────────────────────────────────────────────────────
Total payout:     $10,000 x 1.20 x 0.75 = $9,000  ← Must equal sum of all payouts
```

### Chargeback Reversal Verification
Each chargeback must create a reversal entry debiting the correct agent:
- Verify chargeback is deducted from the agent who wrote the deal (not the team lead)
- Verify override reversals cascade up the hierarchy
- Flag any chargeback where the agent's balance goes negative without a debt recovery plan

## Output
Present a structured audit report with pass/fail for compliance checks and actionable recommendations for optimization.
