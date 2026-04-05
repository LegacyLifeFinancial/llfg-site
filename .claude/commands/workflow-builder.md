Build visual workflow builder for the LLFG portal. Drag-drop nodes, conditional branching, parallel paths, approval gates, time delays.

## What to Build
1. Canvas-based workflow designer (HTML5 Canvas or SVG)
2. Node types: trigger, action, condition, delay, approval
3. Drag-drop node placement and connection drawing
4. Conditional branching (if score > 70 → path A, else → path B)
5. Parallel execution paths
6. Workflow templates: onboarding, deal processing, recruiting

## Integration Points
- Workflow Engine agent executes built workflows
- Process Automation agent handles individual steps
- EventBus triggers workflow starts
