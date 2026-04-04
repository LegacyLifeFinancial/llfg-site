Manage document tracking in the LLFG portal (index.html). Covers compliance documents, agreements, and license tracking per agent.

## Before anything else
Read index.html. Find `ptab-agreements`, `ptab-contracting`, and the signatures system.

## Required Documents Per Agent

### Onboarding
- NDA (signed via e-signature pad)
- Debt Rollup Acknowledgment (signed)
- Independent Contractor Agreement (signed)
- Anti-Money Laundering Acknowledgment
- Agent Code of Conduct (signed)

### Licensing
- Life & Health License (state, number, expiration)
- Non-Resident Licenses (states, NIPR numbers)
- E&O Insurance (carrier, policy number, expiration)
- Continuing Education (hours completed, next renewal)

### Carrier Appointments
- SureLC contracting status per carrier
- Product training certifications (carrier-specific)

## What to Build/Verify

### 1. Document Status Dashboard
Per agent: checklist with green (complete), yellow (pending), red (missing/expired), gray (N/A for role).

### 2. Expiration Monitoring
- License alerts at 120, 90, 60, 30 days
- E&O alerts at 90, 30 days
- CE reminders at 120 days
- Wire into Contracting Agent + Compliance Agent

### 3. Integration with SureLC
- If API connected (`llfg_integrations`), pull appointment status
- Map SureLC stages to document checklist

### 4. Integration with Signatures
- Wire into `/signatures` system for signed agreement tracking
- Update checklist when agreements completed via e-signature pad

## Where to Put It
- `ptab-agreements` tab or new section in contracting
- Admin: compliance summary across all agents

Read index.html before making any changes.