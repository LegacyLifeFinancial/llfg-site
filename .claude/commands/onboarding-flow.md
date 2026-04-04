Audit and optimize the LLFG agent onboarding pipeline. This skill traces every step from application to first placed deal and identifies where agents drop off.

## Before anything else
Read index.html. Find the recruiting pipeline (`LLFG_RecruitingAgent`, `llfg_recruiting_pipeline`), contracting queue (`pendingAgentQueue`, `approvedAgentQueue`, `contractedAgents`), training system (`TRAINING_CURRICULUM`, `LLFG_Gamification`), and the documents/signatures system.

## The Onboarding Pipeline

### Stage 1: Application Received
- Source: `ptab-addagents` form submission
- Data: `mySubmittedAgents` or recruiting pipeline
- Check: application has name, email, phone, state, experience level
- Metric: applications per week

### Stage 2: Interview & Approval
- Source: `ptab-agentapprovals` management tab
- Check: approval within 48 hours of application
- Metric: approval rate, time-to-approval
- Alert: applications pending > 7 days (Contracting Agent should flag)

### Stage 3: Contracting
- Source: `ptab-contracting` or SureLC integration
- Check: NDA + Debt Rollup signed (via `/signatures` system)
- Check: SureLC contracting submitted (via `/documents` tracking)
- Metric: time from approval to contracting submission
- Alert: approved agents not contracted within 5 business days

### Stage 4: Licensing
- Check: Life & Health license verified
- Check: State appointment confirmed
- Check: E&O insurance on file
- Metric: time from contracting to licensed/appointed

### Stage 5: Training Onboarding
- Check: Agent has started "Start Here" learning path
- Check: Compliance Certification in progress
- Check: FA Foundations at least 50% complete
- Metric: training completion rate at 30/60/90 days
- XP milestone: agent should be Level 2+ within 14 days

### Stage 6: First Deal
- Check: first deal logged in portal
- Metric: days from licensing to first deal
- Target: first deal within 21 days of licensing
- Alert: licensed agent with 0 deals after 30 days

## What to Build/Verify

### 1. Onboarding Dashboard
Visual pipeline showing count at each stage with conversion rates between stages:
```
Applications → Approved → Contracted → Licensed → Trained → Producing
    100%    →    85%   →    75%     →   70%    →  60%   →   45%
```

### 2. Bottleneck Detection
- Flag any stage where conversion < 70%
- Flag any agent stuck at a stage > expected timeframe
- Wire into Contracting Agent, Training Coach Agent, and Recruiting Agent

### 3. Automated Nudges
- Training not started after 7 days → Training Coach Agent alert
- Documents not signed after 5 days → Compliance Agent alert
- No deals after 30 days → Retention Agent alert + manager notification

## Output
Present pipeline funnel with conversion rates at each stage. List agents stuck at each bottleneck. Calculate avg time through full pipeline.

Read index.html before making any changes.