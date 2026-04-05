Analyze and optimize the LLFG revenue operations pipeline. This skill audits the full money flow: lead-to-close conversion, AP per agent, commission accuracy, chargeback impact, and net revenue forecasting.

## Before anything else
Read index.html. Find `TEAM_DATA`, `myDeals`, `LEADERBOARD_AGENTS`, `PROMOTION_REQUIREMENTS`, commission calculation logic, and the KPI/Sales/Retention agents.

## Revenue Pipeline Audit

### 1. Production Analysis
For each team and agent in TEAM_DATA:
- Monthly AP (annualized premium)
- Average case size
- Product mix (term vs whole life vs IUL vs annuity vs FE)
- Placement rate (submitted vs placed)
- Activity ratio (producing agents / total agents)

### 2. Commission Flow
- Gross commission per agent: AP x tier%
- Override income per manager: sum of (agent AP x override%)
- Chargeback exposure: AP at risk in advance period
- Net commission: gross - chargebacks
- Verify math matches `/reconciliation` output

### 3. Revenue Forecasting
Build a 90-day rolling forecast:
- AP currently in underwriting (pipeline)
- AP approved but not yet placed
- AP at chargeback risk (within 9-month advance window)
- Projected net AP per month for next 3 months
- Flag any team trending below $50K monthly AP

### 4. Promotion Pipeline Revenue Impact
For each agent approaching promotion (from PROMOTION_REQUIREMENTS):
- Current AP vs requirement
- Projected months to promotion at current pace
- Revenue impact of promotion (higher override tier unlocked)

### 5. Key Metrics to Calculate
| Metric | Formula | Target |
|--------|---------|--------|
| Org-wide monthly AP | Sum of all team AP | $500K+ |
| Agent avg monthly AP | Total AP / producing agents | $10K+ |
| Avg case size | Total AP / total deals | $3,000+ |
| Persistency | Policies active at 13mo / placed | 85%+ |
| Net chargeback rate | Chargebacks / gross AP | <5% |
| Agent activity ratio | Producing / total agents | 60%+ |
| Revenue per agent | Net commission / total agents | $5K+/mo |

## Output
Present as executive summary with:
1. Revenue health score (green/yellow/red)
2. Top 3 revenue risks
3. Top 3 growth opportunities
4. Agent-level production breakdown table
5. 90-day forecast chart data

## Enhanced Analytics & Persistence

### PostHog for Revenue Funnel Tracking
Track the full lead-to-close pipeline with event analytics:
```javascript
// Track each revenue event
posthog.capture('lead_created', { source: 'recruiting', agent_id: id });
posthog.capture('deal_submitted', { agent_id: id, ap: amount, product: type });
posthog.capture('deal_placed', { agent_id: id, ap: amount, commission: rate });
posthog.capture('chargeback', { agent_id: id, ap: amount, reason: reason });
```
Define funnels in PostHog: Lead → Submitted → Placed → Earned. Automatically calculates conversion rates and time-between-steps.

### Supabase for Durable Revenue Data
Replace localStorage with Postgres for revenue forecasting:
```javascript
// 90-day rolling forecast query
const { data } = await supabase.from('deals')
  .select('ap, status, placed_date')
  .gte('placed_date', ninetyDaysAgo)
  .order('placed_date', { ascending: false });
```

Row Level Security ensures managers see only their team's revenue data.

Wire findings into Analytics Agent via EventBus.

Read index.html before making any changes.