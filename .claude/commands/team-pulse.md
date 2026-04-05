Build real-time team health dashboard for the LLFG portal. Agent activity heatmap, engagement scores, burnout detection, morale indicators.

## What to Build
1. Activity heatmap: 7-day grid showing agent login/activity by hour
2. Engagement score per agent (composite of logins, deals, training, messages)
3. Burnout risk detector: high activity + declining performance = flag
4. Anonymous pulse survey (1-5 rating on morale, workload, support)
5. Team comparison view for executives
6. Trend lines showing engagement over 30/60/90 days

## Integration Points
- Team Pulse agent (hr_pulse) collects survey data
- Engagement Score agent provides composite scores
- Retention Agent uses pulse data for churn prediction
