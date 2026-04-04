Prepare the LLFG portal for deployment. This is the pre-flight checklist before pushing index.html to GitHub.

## Step 1: Run Full Health Check
Perform all checks from the health-check command:
- Div balance between agentDash and adminDash
- All ptab- divs inside agentDash
- All critical functions exist
- Dropdown order correct
- FA commission visibility gated
- 2FA bypass array intact

## Step 2: Validate HTML Structure
- Check for unclosed tags, mismatched quotes, or broken attributes
- Verify no debug/console.log statements left in production code (allow intentional ones but flag any that look like leftover debugging)
- Check for any TODO/FIXME/HACK comments that should be resolved before deploy

## Step 3: Role-Based Access Audit
Verify the tab access arrays match the documented role hierarchy:
- `MYDEALS_TABS` — FA gets deals+commissions, Manager+ gets deals+commissions+teammetrics
- `TOOLS_TABS` — FA gets training+addagents+bizcard+portals, Manager adds agentapprovals, Executive+ adds contracting+applications
- `MANAGEMENT_TABS` — FA gets commreq, Manager adds reports, Executive adds teammetrics, Director+ adds permissions+downlineclients

## Step 4: Commission Visibility Cap
Verify the commission percentage visibility cap logic:
- FA: can see up to 120%
- Manager: up to 135%
- Executive/Director/MP/Admin: up to 150%

## Step 5: Generate Deployment Summary
Output:
1. **Status:** READY / NOT READY
2. **Issues found:** (list any blockers)
3. **Warnings:** (non-blocking but noteworthy)
4. **Reminder:** Deploy via GitHub pencil icon edit only. Select all → paste → commit to main. NEVER drag-and-drop. Wait ~30s then hard refresh (Ctrl+Shift+R).
