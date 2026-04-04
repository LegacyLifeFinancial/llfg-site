Analyze the LLFG agent roster, team structure, and promotion pipeline from the portal code (index.html).

## 1. Extract Current Accounts
Find all hardcoded user accounts/credentials in the portal. For each, identify:
- Email address
- Role assignment
- Commission percentage
- Team assignment (if any)
- Any special permissions or flags

## 2. Team Structure Analysis
Map out the organizational hierarchy as coded:
- Who reports to whom?
- Which agents are on which teams?
- Are team assignments properly reflected in the `renderAgentApprovals` function?
- Does the hierarchy chart in the portal match the documented structure?

## 3. Promotion Eligibility Check
For each role level, verify the portal tracks the promotion requirements:

**FA → Manager:**
- $150K team AP
- 3 teams of 4+ agents
- Does the portal surface this data to FAs?

**Manager → Executive:**
- $500K team AP
- 3 Managers reporting
- Is this visible in team metrics?

**Executive → Director:**
- $1.5M team AP
- 3 Executives reporting

**Director → Managing Partner:**
- $6M team AP
- 3+ Directors reporting

## 4. Agent Onboarding Flow
Review the `addagents` tab and onboarding workflow:
- What fields are collected for new agents?
- Is the contracting process linked?
- Are new agents automatically assigned to the recruiting agent's team?
- Is there an approval workflow for new agent additions?

## 5. Recommendations
Based on the analysis, suggest:
- Missing data points that would help managers track team growth
- Gaps in the promotion tracking that could be automated
- Ways to improve agent retention visibility (activity tracking, engagement metrics)
- Team structure optimizations based on the hierarchy requirements

## Output
Present an organizational chart summary and actionable recommendations for team growth optimization.
