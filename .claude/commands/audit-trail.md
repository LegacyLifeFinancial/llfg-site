Build complete audit trail for the LLFG portal. Who changed what, when, why. Immutable log, search, export for regulators and compliance.

## What to Build
1. Intercept all data mutations (create/update/delete) and log
2. Log entry: timestamp, user, action, entity, old value, new value
3. Immutable append-only log (no delete/edit of log entries)
4. Search and filter by user, action type, entity, date range
5. Export audit log as CSV for regulatory requests
6. Retention policy: keep 7 years (insurance compliance)

## Integration Points
- Audit Trail agent (fin_audit) captures all changes
- Financial Compliance agent uses audit data
- Security Agent monitors for suspicious patterns
