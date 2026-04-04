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

## Output
Present a structured audit report with pass/fail for compliance checks and actionable recommendations for optimization.
