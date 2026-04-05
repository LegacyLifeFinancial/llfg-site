Build visual lead pipeline with drag-drop stages in the LLFG portal CRM (ptab-crm). Stages: New, Contacted, Qualified, Proposal, Negotiation, Won, Lost.

## Before anything else
Read index.html. Find `crm-pipeline`, `renderPipeline`, `crm-pipe-card`, and drag/drop handlers.

## What to Build
1. Kanban-style board with 7 columns
2. Drag-drop cards between stages (HTML5 drag API)
3. Card shows: name, AP value, score, days-in-stage
4. Stage conversion metrics (% moving forward)
5. Bottleneck alerts (contacts stuck >7 days)
6. Quick actions on cards: call, email, note, move stage

## Integration Points
- Pipeline Manager agent tracks stage transitions
- Deal Velocity agent calculates time-in-stage
- Speed-to-Lead agent flags uncontacted leads

## Validation
- Drag-drop works on desktop and mobile (touch events)
- Stage counts update in real-time
- Data persists across sessions
