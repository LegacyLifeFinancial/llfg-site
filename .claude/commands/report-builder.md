Build custom report builder for the LLFG portal. Drag-drop metrics, save templates, schedule auto-delivery, export PDF/CSV/Excel.

## What to Build
1. Report template designer with metric selection
2. Available metrics: AP, deals, contacts, conversion rate, chargeback, persistency
3. Grouping: by agent, team, carrier, product, time period
4. Chart type selection (bar, line, pie, table)
5. Save report templates for reuse
6. Schedule auto-delivery via email (weekly/monthly)
7. Export: CSV, PDF (jsPDF), print-friendly HTML

## Integration Points
- Existing downloadReport() function (currently stub) gets implemented
- Analytics agents provide calculated metrics
- Email Agent delivers scheduled reports
