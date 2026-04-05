Track policy lifecycle in the LLFG portal: application, underwriting, issued, active, renewal. Status timeline visualization per policy.

## What to Build
1. Policy record with all status stages and timestamps
2. Visual timeline showing policy progression
3. Stage-specific actions (submit app, follow up UW, confirm issue)
4. Renewal alerts at 30/60/90 days before anniversary
5. Policy search and filter by carrier, product, status
6. Lapse risk indicator (missed payments, pending cancellation)

## Integration Points
- Policy Lifecycle agent (spec_policytrk) manages statuses
- Client Lifecycle agent monitors renewal/lapse
- Deal Tracker links policies to deals
