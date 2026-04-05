Build executive data dashboard for the LLFG portal. Real-time org metrics, drill-down by team/agent, comparison periods, export capabilities.

## What to Build
1. Executive summary cards: total AP, agent count, avg production, churn rate
2. Drill-down: click team → see agents, click agent → see deals
3. Period comparison: this month vs last month, this quarter vs last
4. Chart grid: AP trend, team comparison, product mix, territory map
5. Auto-refresh every 5 minutes
6. Export dashboard as PDF or share link

## Integration Points
- Analytics Agent provides aggregated data
- Chart.js renders all visualizations
- Graphs skill handles chart creation
