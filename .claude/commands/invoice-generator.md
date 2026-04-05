Generate professional commission statements and invoices for the LLFG portal. PDF export, email delivery, payment status tracking.

## What to Build
1. Commission statement template (agent info, period, deals, calculations, total)
2. PDF generation via jsPDF CDN or print-friendly HTML
3. Email delivery of statements via Email Agent
4. Payment status tracking (pending, paid, partial)
5. Statement history archive in localStorage
6. Batch statement generation for managers (all agents at once)

## Integration Points
- Invoice Generator agent (fin_invoice) manages queue
- Accounting skill provides financial data
- Email Agent delivers statements
