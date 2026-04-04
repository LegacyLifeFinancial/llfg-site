Intelligent auto-builder for the LLFG portal. Analyzes the user's request, detects what's needed, creates any missing skills, and executes the build — all in one pass.

## How It Works

When the user describes what they want, this skill:
1. Parses the request into discrete tasks
2. Maps each task to an existing skill or identifies gaps
3. Creates any missing skills on the fly
4. Executes each task in the correct order
5. Runs /verify after all changes
6. Commits and pushes if everything passes

## Task Detection Rules

Scan the user's message for these patterns and route accordingly:

### Landing Page / Public Site
| Pattern | Route To |
|---------|----------|
| "hero", "landing", "first section", "homepage" | Modify hero section CSS/HTML |
| "scroll", "animate", "3D", "interactive" | Add GSAP/CSS animations |
| "carrier", "partner" | Modify carrier section |
| "application", "form", "apply" | Modify application overlay |
| "agency", "tier", "partnership" | Modify agency section |
| "video", "cinematic", "film" | /ai-video skill |
| "image", "generate", "AI art" | /ai-generate skill |
| "design", "UI", "UX", "layout" | CSS modifications |
| "mobile", "responsive" | Media query updates |
| "footer", "nav", "navigation" | Structural HTML |

### Portal / Agent-Facing
| Pattern | Route To |
|---------|----------|
| "login", "auth", "sign in" | Early script block modifications |
| "tab", "portal tab", "ptab" | showPortalTab + tab HTML |
| "commission", "comp" | /commission-audit or renderCommissionsTab |
| "training", "course", "curriculum" | /training-dev or TRAINING_CURRICULUM |
| "deal", "pipeline", "sales" | Deals system |
| "message", "chat", "messaging" | Messaging system |
| "calendar", "event", "schedule" | Calendar system |
| "report", "metrics", "KPI" | Reports + KPI agent |
| "hierarchy", "org chart", "team" | /hierarchy skill |
| "business card", "bizcard" | Business card builder |

### Command Center / Agents
| Pattern | Route To |
|---------|----------|
| "agent", "bot", "automation" | Command Center agents |
| "security", "audit", "log" | Security Agent |
| "recruit", "pipeline", "funnel" | Recruiting Agent |
| "email", "drip", "campaign" | Email Agent |
| "compliance", "GLBA", "HIPAA" | Compliance Agent |
| "retention", "churn" | Retention Agent |
| "analytics", "summary", "executive" | Analytics Agent |

### Infrastructure
| Pattern | Route To |
|---------|----------|
| "deploy", "push", "live", "launch" | /deploy-prep then git push |
| "verify", "check", "health" | /verify skill |
| "bug", "fix", "broken", "error" | /bug-sweep skill |
| "CRM", "Twenty", "Salesforce" | CRM integration |
| "AI assistant", "LobeHub" | AI assistant config |
| "Netlify", "function", "serverless" | /netlify-fn skill |
| "backup", "export", "restore" | /backup skill |

## Execution Flow

```
1. DETECT: Parse user request → list of tasks
2. CHECK: For each task, does a skill exist?
   - Yes → queue it
   - No → create the skill using /skill-creator, then queue it
3. ORDER: Sort tasks by dependency (infrastructure first, then backend, then frontend, then deploy)
4. EXECUTE: Run each task sequentially
5. VERIFY: Run /verify after all changes
6. REPORT: Show what was built, what was modified, what was created
7. DEPLOY: If user said "deploy" or "launch" or "push", run git add + commit + push
```

## Auto-Skill Creation

When no existing skill matches, create one using this template:
```markdown
[Task description in imperative form]

## Step 1: Identify
- Find the relevant code section in index.html
- Read the current implementation
- Understand the existing patterns

## Step 2: Implement
- Make the changes following existing code conventions
- Use the double-registration pattern for functions: window.__R_fn = window.fn = function(){}
- Use inline styles matching the LLFG brand (--gold, --cream, --gray, --black)
- Add responsive CSS if the change affects layout

## Step 3: Verify
- Run /verify to confirm no syntax errors
- Check div balance
- Confirm all critical functions still exist

## Step 4: Report
- List what was changed
- Show line numbers
```

## Pre-Built Workflows

### "Make it interactive"
1. Add GSAP animations to target section
2. Add 3D hover transforms
3. Add scroll-triggered reveals
4. Add click-to-expand where applicable

### "Fix everything"
1. Run /verify
2. Run /bug-sweep
3. Fix all issues found
4. Run /verify again
5. Deploy

### "Update the design"
1. Identify target sections
2. Apply LLFG brand CSS (gold/black/cream palette)
3. Add micro-interactions (hover, focus, active states)
4. Ensure mobile responsive
5. Run /verify

### "Add a new feature"
1. Run /feature-plan to design it
2. Implement the HTML
3. Implement the CSS
4. Implement the JS
5. Wire to existing systems (EventBus, agents, etc.)
6. Run /verify
7. Deploy

## Always Remember
- Run /verify BEFORE committing
- Never break the login system
- Never break the application overlay
- Keep the early script block clean (no email addresses)
- Use GSAP for animations when available
- Match the LLFG brand (gold #c9a84c, black #0a0a0a, cream #f5f0e8)
- Check for the red error banner after deploying
