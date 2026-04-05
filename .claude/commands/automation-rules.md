Build if-then automation engine for the LLFG portal. When deal closes, send email + update CRM + award XP + notify manager. Visual rule builder.

## What to Build
1. Rule builder: trigger (event) + conditions (filters) + actions (what to do)
2. Triggers: contact created, stage changed, deal won/lost, score threshold, inactivity
3. Actions: send email, assign agent, add tag, create task, notify, award XP, move stage
4. Multiple actions per rule (chain actions)
5. Rule enable/disable toggle
6. Execution log showing when rules fired

## Integration Points
- Process Automation agent (ops_process) executes rules
- EventBus listens for trigger events
- All other agents can be action targets
