Plan a new feature for the LLFG portal. This skill ensures features are designed with full awareness of the single-file architecture constraints.

The user will describe the feature they want. You must:

## 1. Architecture Impact Assessment
Before writing any code, analyze:
- **Where in index.html** does this feature belong? (new ptab- div? existing tab? admin-only?)
- **Which roles** should access it? Map to the role hierarchy (FA, Manager, Executive, Director, Managing Partner, Admin)
- **Which existing functions** does it interact with? (showPortalTab, buildPortalOverview, configureRoleUI, etc.)
- **Estimated line count** — important for a 659KB single file

## 2. Div Placement Plan
If adding a new tab or section:
- Specify exactly WHICH existing ptab- div it goes after
- Confirm it will be INSIDE `#agentDash` (not orphaned outside)
- Plan the nav button addition in `_appLaunchPortal` and the correct tab access array (MYDEALS_TABS, TOOLS_TABS, or MANAGEMENT_TABS)

## 3. Role-Based Access Design
Define the access matrix:
- Which roles see this feature?
- Are there tiered views (e.g., FA sees partial, Manager sees full)?
- Does it need commission visibility cap awareness?
- Does `configureRoleUI` need updating?

## 4. Data Flow
- Where does the data come from? (hardcoded, localStorage, Netlify function, external API?)
- Does it need persistence across sessions?
- Does it interact with existing data structures?

## 5. Implementation Plan
Provide a step-by-step plan with:
- Exact insertion points (line numbers or after which element/function)
- New functions to create
- Existing functions to modify
- CSS to add (must go in the existing `<style>` block)
- Any new event listeners or onclick handlers

## 6. Risk Assessment
- Could this break div balance? (quantify: adding N opens, N closes)
- Does it touch any of the 4 known bug areas?
- What should be tested after implementation?

## Output
A complete implementation blueprint that can be executed safely in the single-file architecture.
