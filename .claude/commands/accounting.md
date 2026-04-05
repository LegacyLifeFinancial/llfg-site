Build or enhance accounting, financial tracking, and reporting in the LLFG portal (index.html). This skill adds ledger-based financial management on top of the existing commission structure.

## Current State
- **Commission structure exists**: COMM_REQUIREMENTS (~line 6737) defines tiers from 65% (FA) to 150% (MP)
- **Team metrics**: TEAM_DATA (~lines 6428-6467) tracks totalAP, moPremium, persistency, chargeback, retention, debtRisk
- **Advance pay calculation**: `advPay = Math.round(team.totalAP * (team.leaderComm/100) * 0.75)` — 75% of 9-month earned commission
- **Comp management**: openCompModal(), submitCompChange(), renderCompManagementList()
- **Reports tab**: ptab-reports exists with buttons for Team AP Report, Commission Report, Hierarchy Report — but `downloadReport()` is NOT implemented
- **No accounting ledger**, no P&L, no expense tracking, no invoice system, no payment history, no payroll, no tax tracking

## 1. Financial Ledger System
Create a double-entry bookkeeping ledger:

### Ledger Data Structure
```javascript
const LEDGER = {
  entries: [
    { id: 1, date: '2026-04-01', type: 'credit', category: 'commission',
      agent: 'John Smith', amount: 4500, description: 'March commission payout',
      account: 'commission_expense', contra: 'cash' }
  ],
  accounts: {
    revenue: { name: 'Premium Revenue', type: 'revenue', balance: 0 },
    commission_expense: { name: 'Commission Expense', type: 'expense', balance: 0 },
    advance_pay: { name: 'Advance Pay Receivable', type: 'asset', balance: 0 },
    chargeback: { name: 'Chargebacks', type: 'expense', balance: 0 },
    cash: { name: 'Cash', type: 'asset', balance: 0 }
  }
};
```

### Transaction Types
| Transaction | Debit Account | Credit Account |
|------------|--------------|---------------|
| Premium received | Cash | Premium Revenue |
| Commission paid | Commission Expense | Cash |
| Advance pay issued | Advance Pay Receivable | Cash |
| Advance pay earned | Commission Expense | Advance Pay Receivable |
| Chargeback | Chargebacks | Cash / Agent Balance |
| Override commission | Override Expense | Cash |

## 2. Profit & Loss Statement
Auto-generate P&L from ledger data:

### Revenue Section
- Total Premium Written (from TEAM_DATA totalAP aggregation)
- Monthly recurring premium (moPremium across all teams)
- Override income (from downline production)

### Expense Section
- Commission payouts (per agent, per team)
- Advance pay outstanding
- Chargebacks / clawbacks
- Operating expenses (if tracked)

### Net Income
- Revenue - Expenses = Net Income
- Show month-over-month and year-over-year comparisons
- Highlight trends (improving/declining margins)

## 3. Agent Financial Dashboard
Per-agent financial view (inside ptab-commissions or ptab-overview):

| Metric | Source |
|--------|--------|
| Personal AP | TEAM_DATA agent.ap |
| Commission Rate | TEAM_DATA agent.comm |
| Earned Commission | ap * (comm/100) |
| Advance Pay Received | advPay calculation |
| Advance Pay Balance | Earned - Received |
| Chargebacks | TEAM_DATA agent.cb * ap |
| Net Compensation | Earned - Chargebacks |
| Persistency Bonus | If persist > 90%, bonus % |

## 4. Team Financial Summary
Per-team financial rollup for Manager+ view:

- Total team AP and commission expense
- Average commission rate across team
- Chargeback exposure (total $ at risk)
- Debt risk classification (from TEAM_DATA debtRisk)
- Override earnings for team leader
- Advance pay outstanding across team
- Revenue per agent (AP / agent count)

## 5. Implement downloadReport()
The report buttons exist but the function doesn't. Implement:

### CSV Export
```javascript
function downloadReport(reportType) {
  let csv = '';
  switch(reportType) {
    case 'team_ap':
      csv = generateTeamAPCSV();
      break;
    case 'commission':
      csv = generateCommissionCSV();
      break;
    case 'hierarchy':
      csv = generateHierarchyCSV();
      break;
    case 'pnl':
      csv = generatePnLCSV();
      break;
  }
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `llfg_${reportType}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}
```

### PDF Export (Optional)
- Use jsPDF from CDN if user wants PDF reports
- Or generate print-friendly HTML and use `window.print()`

## 6. Commission Reconciliation
Add a reconciliation workflow:
- Compare expected commissions (from AP * rate) vs actual payouts
- Flag discrepancies > $50
- Track commission adjustments and reason codes
- Audit trail for all comp changes (tie into submitCompChange())

## 7. Chargeback Management
Enhance chargeback tracking:
- Track individual chargebacks with policy number, amount, date, reason
- Calculate chargeback ratio per agent and per team
- Alert when agent chargeback rate exceeds threshold (e.g., > 15%)
- Show chargeback impact on advance pay balance
- Debt recovery tracking for agents with negative balances

## 8. Financial Calendar
Monthly financial milestones:
- Commission calculation date
- Advance pay disbursement date
- Chargeback reconciliation window
- Report filing deadlines
- Link to the calendar tab for reminders

## 9. Role-Based Financial Access
- **FA**: Own compensation summary, personal P&L, own chargebacks
- **Manager**: Team financial summary + individual agent financials for direct reports
- **Executive**: Multi-team financial rollup + can approve commission adjustments
- **Director+**: Full organizational P&L + budget planning tools
- **Admin**: Everything + can modify ledger entries + export all reports

## 10. Data Persistence

### localStorage (Demo/MVP)
```javascript
localStorage.setItem('llfg_ledger', JSON.stringify(LEDGER));
```

### Supabase (Production — Recommended)
Replace localStorage with durable Postgres. CDN-compatible, no build step:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```
```javascript
const supabase = supabase.createClient('https://your-project.supabase.co', 'anon-key');

// Write ledger entry
await supabase.from('ledger_entries').insert({
  date: '2026-04-01', type: 'credit', category: 'commission',
  agent_id: 'john-smith', amount: 4500, account: 'commission_expense', contra: 'cash'
});

// Real-time commission updates
supabase.channel('ledger').on('postgres_changes',
  { event: 'INSERT', schema: 'public', table: 'ledger_entries' },
  (payload) => { updateDashboard(payload.new); }
).subscribe();
```

#### Row Level Security (RLS) for Financial Data
Enforce role-based access at the database level — FAs see only their own data:
```sql
CREATE POLICY "agents_own_data" ON ledger_entries
  FOR SELECT USING (agent_id = auth.uid());
CREATE POLICY "managers_team_data" ON ledger_entries
  FOR SELECT USING (agent_id IN (SELECT id FROM agents WHERE team_lead = auth.uid()));
```

### Netlify Function + Database: For sensitive calculations (commission math, advance pay) that should not run client-side
- Separate financial data from operational data for security

## 10b. Double-Entry Architecture (from Firefly III / Akaunting)

### Why Double-Entry for Insurance Commissions
Patterns from open-source accounting systems (Firefly III, Akaunting) confirm that double-entry bookkeeping with nested accounts is the correct architecture for:
- **Override hierarchies**: Parent accounts (RVP) contain child accounts (managers, agents). Override percentages become allocation rules on each deposit.
- **Advance vs earned**: Model advances as liability accounts. As policies earn, transfer from liability to revenue — clean audit trail.
- **Chargebacks**: Each commission is a credit to agent + debit to agency pool. Chargebacks reverse the entry cleanly.

### Nested Account Hierarchy (from Akaunting pattern)
```javascript
const CHART_OF_ACCOUNTS = {
  assets: {
    cash: { name: 'Operating Cash', balance: 0 },
    advance_receivable: {
      name: 'Advance Pay Receivable',
      children: {
        // One sub-account per agent — mirrors org hierarchy
        'agent-001': { name: 'John Smith Advance', balance: 0 },
        'agent-002': { name: 'Jane Doe Advance', balance: 0 }
      }
    }
  },
  liabilities: {
    unearned_commission: { name: 'Unearned Commission', balance: 0 }
  },
  revenue: {
    premium_income: { name: 'Premium Revenue', balance: 0 },
    override_income: { name: 'Override Revenue', balance: 0 }
  },
  expenses: {
    commission_paid: { name: 'Commission Expense', balance: 0 },
    chargebacks: { name: 'Chargeback Expense', balance: 0 }
  }
};
```

### P&L Report Template (from Akaunting)
Maps directly to LLFG commission statements:
```
Revenue:
  Total Premium Written          $XXX,XXX
  Override Income                $XX,XXX
  ─────────────────────────────────────
  Total Revenue                  $XXX,XXX

Expenses:
  Commission Payouts             ($XX,XXX)
  Advance Pay Outstanding        ($X,XXX)
  Chargebacks / Clawbacks        ($X,XXX)
  ─────────────────────────────────────
  Total Expenses                 ($XX,XXX)

Net Income                       $XX,XXX
```

## 11. Tax & Compliance Helpers
- 1099 tracking: Flag agents earning > $600/year for 1099 reporting
- Commission statement generation (monthly/annual)
- Withholding calculations (if applicable)
- Audit-ready export format

## 12. Integration Points
- Pull AP data from TEAM_DATA for automated calculations
- Link commission changes from openCompModal() to ledger entries
- Connect to email system for sending financial statements
- Link to graphs skill for financial visualizations (Chart.js)
- Feed data to hierarchy skill for financial org chart overlay

## Output
After implementation:
1. List of financial features added
2. Confirm downloadReport() is implemented
3. Show ledger data structure
4. Verify P&L calculation accuracy against TEAM_DATA
5. Confirm role-based access restrictions
6. Verify div balance
