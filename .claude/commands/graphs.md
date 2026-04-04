Build or enhance data visualization graphs and charts in the LLFG portal (index.html). This skill adds Chart.js-based dashboards to replace plain text/table metrics with visual insights.

## Current State
- **No charting library** is loaded — all metrics are rendered as HTML tables and text
- Key data available for charting: TEAM_DATA (line ~6428), commission structure (COMM_REQUIREMENTS ~6737), agent metrics (AP, persistency, chargeback, retention, debt risk)
- Color helper functions exist: `debtColor()`, `cbColor()`, `persistColor()` (~lines 6469-6471)
- `#hierarchyChartWrap` div exists but only renders HTML tables

## 1. Library Setup
Before adding any chart, verify Chart.js is loaded:
- Check for `<script src="...chart.js...">` in `<head>`
- If missing, add Chart.js 4.x CDN: `https://cdn.jsdelivr.net/npm/chart.js`
- Place it AFTER existing script tags but BEFORE the main `<script>` block
- Do NOT add D3, Plotly, or other heavy libraries — Chart.js is sufficient and lightweight

## 2. Available Chart Types
When the user requests a graph, determine the best chart type:

| Data | Chart Type | Use Case |
|------|-----------|----------|
| Team AP comparison | Bar chart | Compare teams side by side |
| Commission tiers | Horizontal bar | Show progression path |
| Persistency/Retention | Doughnut/Gauge | Show % health metrics |
| AP trend over time | Line chart | Track growth trajectory |
| Chargeback risk | Radar chart | Multi-metric team health |
| Agent distribution by role | Pie chart | Workforce composition |
| Team leaderboard | Horizontal bar | Ranked performance |
| Revenue breakdown | Stacked bar | Revenue by source/team |

## 3. Integration Rules
- All charts go INSIDE the relevant `ptab-` div (e.g., team metrics chart inside `ptab-teammetrics`)
- Create a `<canvas>` element with a unique ID for each chart
- Wrap chart creation in a render function (e.g., `renderTeamAPChart()`)
- Call render functions from the appropriate tab's init function
- Charts must respect role-based visibility (FA sees personal only, Manager+ sees team)
- Use LLFG brand colors: primary `#1a237e`, accent `#00bcd4`, success `#43a047`, warning `#ff9800`, danger `#e53935`

## 4. Data Binding
Charts must pull from existing data structures, not hardcoded values:
```
// Example: Pull from TEAM_DATA
const labels = Object.keys(TEAM_DATA);
const apData = Object.values(TEAM_DATA).map(t => t.totalAP);
```
- For commission data: use COMM_REQUIREMENTS
- For agent data: iterate TEAM_DATA[team].agents
- For KPI metrics: use the existing metric variables in the portal

## 5. Responsive Design
- Set `responsive: true` and `maintainAspectRatio: false` on all charts
- Wrap canvas in a div with `max-width: 600px; margin: 0 auto;`
- Charts must look good in the portal overlay (max-width ~900px)
- Add a container class `.llfg-chart-wrap` for consistent sizing

## 6. Chart Interaction
- Enable tooltips with formatted currency/percentage values
- Add click handlers where appropriate (e.g., click a team bar → drill into team details)
- Include legend only when there are multiple datasets
- Use `Chart.defaults.font.family = 'Inter, system-ui, sans-serif'` to match portal

## 7. Performance
- Destroy old chart instances before re-rendering (`chart.destroy()`)
- Store chart instances in a global object (e.g., `window._llfgCharts = {}`)
- Only render charts when the tab is visible (lazy render on tab switch)

## 8. Div Balance Safety
- Count every `<div>` and `</div>` you add — they MUST balance
- Every `<canvas>` should be self-closing or properly closed
- After adding chart markup, verify the agentDash div balance hasn't changed

## Output
After implementation:
1. Show which charts were added and where
2. Confirm Chart.js CDN is loaded
3. Verify div balance is still correct
4. List the render functions created
5. Show a code snippet of the data binding approach used