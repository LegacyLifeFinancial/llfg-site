Build comprehensive activity logging for the LLFG portal CRM. Log all agent activities: calls, emails, meetings, deals, training completions. Searchable timeline per agent and per contact.

## What to Build
1. Activity feed with timestamped entries (icon + user + action + contact)
2. Filter by activity type (call, email, meeting, deal, note, stage change)
3. Per-contact activity timeline in contact detail view
4. Per-agent activity summary for managers
5. Activity statistics: calls/day, emails/week, meetings/month
6. Auto-log from other system events via EventBus

## Integration Points
- Activity Logger agent (crm_actlog) auto-captures events
- Timeline Engine (crm_timeline) unifies views
- Analytics agents use activity data for scoring
