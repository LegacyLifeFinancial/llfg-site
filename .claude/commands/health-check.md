Perform a comprehensive health check on the LLFG portal (index.html). Check ALL of the following:

## 1. Div Balance Check (CRITICAL)
Count all `<div` opening tags and `</div>` closing tags between `id="agentDash"` and `id="adminDash"`. They MUST be equal. If not, identify exactly where the imbalance occurs — this is the #1 recurring bug that orphans tabs outside the overlay.

## 2. Tab Integrity
Verify all 17 `ptab-{name}` divs exist as direct children inside `#agentDash`:
- ptab-overview, ptab-deals, ptab-commissions, ptab-teammetrics, ptab-training, ptab-addagents, ptab-bizcard, ptab-portals, ptab-calendar, ptab-messages, ptab-datacollection, ptab-commreq, ptab-agentapprovals, ptab-contracting, ptab-applications, ptab-permissions, ptab-downlineclients, ptab-reports, ptab-emailtemplates

Flag any that are OUTSIDE `#agentDash` or missing entirely.

## 3. Critical Function Existence
Grep for each of these functions and confirm they exist:
- `renderTrainingCurriculum`
- `TRAINING_CURRICULUM`
- `initReportsTab`
- `renderReportSummary`
- `renderCommissionsTab`
- `renderEmailTemplates`
- `window._appLaunchPortal`
- `showPortalTab`
- `openSubDropdown`
- `buildPortalOverview`
- `configureRoleUI`
- `renderAgentApprovals`
- `renderPortalCal`
- `updateEmailPreview`
- `adminViewAs`

## 4. Dropdown Order Check
Find the dropdown interceptor inside `showPortalTab`. Verify that `showPortalTab(subs[0], null, true)` is called BEFORE `openSubDropdown()`. Reversed order = dropdown closes immediately.

## 5. FA Commission Visibility
Check `renderCommissionsTab` — the `orgCommSection` div must be gated behind an `isManagerPlus` check. FAs should NOT see the org-wide commission table.

## 6. 2FA Bypass Array
Verify the `skipTwoFA` array exists and includes all @llfg.us test accounts.

## Output
Present results as a clear pass/fail checklist. For any failures, show the exact line numbers and what needs to be fixed.
