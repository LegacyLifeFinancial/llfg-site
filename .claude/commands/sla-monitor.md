Build SLA monitoring for the LLFG portal. Response time tracking, escalation rules, SLA breach alerts, compliance dashboards.

## What to Build
1. Define SLA rules (e.g., respond to new lead within 5 min, approve agent within 48h)
2. Track actual response times against SLA targets
3. Escalation chains when SLA is breached
4. SLA compliance dashboard with pass/fail metrics
5. Alert notifications for near-breach and breach events
6. Historical SLA performance trends

## Integration Points
- SLA Monitor agent (ops_sla) tracks all timers
- Speed-to-Lead agent handles lead response SLAs
- Notifications agent delivers breach alerts
