Create a new Claude Code skill (slash command) for the LLFG project. This meta-skill generates other skills.

## What This Does
When the user says "create a skill for X" or "build a command for Y", use this workflow to generate a well-structured .md file in `.claude/commands/`.

## Workflow

### Step 1: Gather Info
Ask (or infer) from the user:
- **Skill name** — short kebab-case name (e.g. `lead-scoring`, `sms-blast`, `client-portal`)
- **One-line description** — what shows in the skill list (max 120 chars)
- **Purpose** — what problem does this skill solve?
- **Scope** — does it modify index.html? Create new files? Call APIs?

### Step 2: Generate the Skill File
Write to `.claude/commands/{skill-name}.md` with this structure:

```markdown
{One-line description of what the skill does}

## Architecture
{Where in the codebase this skill operates}
{Key files, line numbers, functions it touches}
{Data models if applicable}

## Capabilities
{Numbered list of what this skill can do}

## Implementation Steps
{Ordered steps for how to build/apply this skill}

## Integration Points
{How this connects to existing systems: agents, Event Bus, email, etc.}

## Validation
{How to verify the skill worked correctly}
```

### Step 3: Confirm
Tell the user the skill was created and show how to invoke it: `/{skill-name}`

## Rules for Good Skills

1. **Be specific to LLFG** — Reference actual file paths, function names, line numbers
2. **Include architecture context** — Where does this code live? What patterns does it follow?
3. **Reference related skills** — "Works with /email-connect for sending" or "Pairs with /3d-assets"
4. **Include data models** — Show the JS object structure if the skill creates/manages data
5. **Include validation** — How to verify it works (div balance, function exists, no console errors)
6. **Keep it actionable** — The skill should give Claude enough context to implement without asking 20 questions

## Naming Conventions
- Use kebab-case: `lead-scoring` not `leadScoring`
- Keep names short: 1-3 words max
- Be descriptive: `sms-blast` not `messaging`
- Avoid collisions with existing skills (check `.claude/commands/` first)

## Existing Skills Reference
Before creating, check what already exists to avoid duplication:
- Portal features: health-check, bug-sweep, deploy-prep, verify, feature-plan
- UI/Visual: 3d-assets, scroll-stop, web-builder, graphs, hierarchy, gif-emoji
- Business logic: commission-audit, reconciliation, accounting, gamification
- Communication: email-connect, marketing, calendar-invite, signatures
- Content: ai-generate, ai-video, training-dev, documents
- Infrastructure: automate, netlify-fn, backup
- Agent system: agent-roster

## Example

User: "create a skill for SMS text blasting to agents"

Output file: `.claude/commands/sms-blast.md`
```markdown
Send bulk SMS messages to LLFG agents via Twilio API integration.

## Architecture
- Netlify Function: `netlify/functions/send-sms.js`
- Portal UI: Command Center > Marketing Hub or standalone tab
- Agent phone data: TEAM_DATA array in index.html

## Capabilities
1. Send single SMS to any agent by phone number
2. Bulk SMS to team/hierarchy with template variables
3. Schedule SMS for future delivery
4. Track delivery status
...
```