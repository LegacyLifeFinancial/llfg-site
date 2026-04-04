Build or enhance the organizational hierarchy and org chart visualization in the LLFG portal (index.html). This skill creates interactive tree-based views of the agent structure.

## Current State
- `renderHierarchyChart()` exists (~lines 8733-8793) — renders a basic horizontal flex layout
- `renderTeamHierarchy()` exists (~lines 6473-6524) — team metrics table
- `renderCompManagementList()` (~lines 8897-8960) — agent comp adjustment list
- `TEAM_DATA` (~lines 6428-6467) has 4 teams (Alpha, Beta, Gamma, Delta) with agents
- `toggleTeamRow()` is referenced but NOT defined — needs implementation
- `MSG_CONTACTS` (~lines 9118-9125) has upline/downline arrays
- No dynamic org chart library loaded (no D3, OrgChart.js, etc.)
- Role hierarchy: FA → Manager → Executive → Director → Managing Partner → Admin

## 1. Visualization Approach
Use pure CSS + HTML for the org chart (no extra library needed for this scale):
- CSS `display: flex` with connector lines via `::before`/`::after` pseudo-elements
- Or use a lightweight tree layout with CSS Grid
- If the user requests more advanced features, add D3-hierarchy from CDN

### CSS Tree Structure
```css
.org-tree { text-align: center; }
.org-tree ul { display: flex; justify-content: center; padding-top: 20px; position: relative; }
.org-tree li { position: relative; padding: 20px 10px 0; display: flex; flex-direction: column; align-items: center; }
.org-tree li::before, .org-tree li::after {
  content: ''; position: absolute; top: 0; width: 50%; height: 20px;
  border-top: 2px solid #1a237e;
}
.org-tree li::before { left: 50%; border-left: 2px solid #1a237e; }
.org-tree li::after { right: 50%; border-right: 2px solid #1a237e; }
```

## 2. Hierarchy Levels to Display
Build the tree from top down:
```
Managing Partner (Lorenzo)
├── Director(s)
│   ├── Executive(s)
│   │   ├── Manager(s)
│   │   │   ├── FA (team agents)
```
- Each node shows: Name, Role, Commission %, Team AP (if leader)
- Color-code nodes by role level
- Expandable/collapsible at each level

## 3. Data Source
Pull hierarchy from TEAM_DATA and user accounts:
- Root: Admin / Managing Partner accounts
- Branches: Team leaders from `TEAM_DATA[team].leader` and `.leaderRole`
- Leaves: `TEAM_DATA[team].agents[]` with their roles
- Cross-reference with `MSG_CONTACTS.upline` / `.downline` for relationship validation

## 4. Interactive Features
Implement these interactions:
- **Click to expand/collapse** — implement `toggleTeamRow(teamKey)` (currently missing)
- **Hover card** — show agent details popup (role, comm %, AP, persistency)
- **Click to manage** — Manager+ can click agent → open comp modal (`openCompModal()`)
- **Search/filter** — find specific agent in the tree
- **Zoom controls** — if tree gets large, add zoom in/out buttons

## 5. Role-Based Views
Different roles see different hierarchy depths:
- **FA**: Sees their own position and immediate upline only
- **Manager**: Sees their full team (direct reports)
- **Executive**: Sees their managers and those managers' teams
- **Director+**: Sees full organizational tree
- **Admin**: Sees everything + can switch views via `adminViewAs()`

## 6. Promotion Pipeline Overlay
Optionally show promotion readiness indicators on each node:
- Green glow: Meets all requirements for next level
- Yellow glow: Close to meeting requirements (>75% of thresholds)
- Standard: Not yet eligible
- Pull thresholds from `COMM_REQUIREMENTS` (~line 6737)

## 7. Downline Client View
Enhance the `ptab-downlineclients` tab:
- Show which agents have which clients
- Allow Manager+ to see client distribution across their downline
- Link to client profiles where available

## 8. Implementation Checklist
- [ ] Implement `toggleTeamRow()` function (currently referenced but undefined)
- [ ] Place org chart inside `#hierarchyChartWrap` or relevant ptab-
- [ ] Add CSS for tree connector lines in the `<style>` block
- [ ] Ensure all new divs are balanced
- [ ] Test with `adminViewAs()` to verify role-based filtering works
- [ ] Verify chart renders correctly inside the portal overlay

## 9. Div Balance Safety
- Count all `<div>` / `</div>` pairs you add
- Verify agentDash div balance after changes
- Use semantic HTML: `<ul>` / `<li>` for tree structure to reduce div count

## Output
After implementation:
1. Screenshot-ready description of the org chart layout
2. List of functions created or modified
3. Confirm `toggleTeamRow()` is now implemented
4. Verify div balance
5. Note any role-based visibility restrictions applied