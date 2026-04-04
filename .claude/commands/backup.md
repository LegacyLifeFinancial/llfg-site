Manage data backup and export for the LLFG portal (index.html). Covers localStorage backup, data restore, and full portal data export.

## Before anything else
Read index.html. Identify all localStorage keys (search for `localStorage.setItem` and `localStorage.getItem`).

## Critical localStorage Keys
- `llfg_agents_state`, `llfg_agents_alerts` — Command Center
- `llfg_gamification`, `llfg_training_progress` — Gamification + training
- `llfg_integrations`, `llfg_api_log` — Carrier API connections
- `llfg_security_audit`, `llfg_compliance_consent`, `llfg_pii_access_log` — Security/compliance
- `llfg_kpi_goals`, `llfg_kpi_history`, `llfg_recruiting_pipeline` — KPI/recruiting
- `llfg_email_campaigns`, `llfg_email_queue` — Email system
- `llfg_retention_scores`, `llfg_client_lifecycle` — Retention/clients
- `llfg_ui_metrics`, `llfg_preflight_report` — UI/preflight
- `llfg_signed_agreements` — E-signatures
- `llfg_session_v1` — Session persistence

## What to Build/Verify

### 1. Export: `exportPortalData()`
- Collect ALL llfg_* keys from localStorage
- Bundle into JSON with metadata (export date, user email)
- Trigger download as `llfg_backup_YYYY-MM-DD.json`
- MASK API keys from `llfg_integrations` (show first 4 chars + ****)
- Log export to Security Agent audit trail

### 2. Import: `importPortalData(file)`
- File picker for .json
- Validate JSON structure before importing
- Confirm with user before overwriting
- Restore each key to localStorage, reload page

### 3. Sensitive Data Warning
- Never include raw API keys in unencrypted exports
- Warn user if exporting credentials

## Where to Put It
- Export/Import buttons in admin Permissions tab or settings
- Global functions: `window.exportPortalData`, `window.importPortalData`

Read index.html before making any changes.