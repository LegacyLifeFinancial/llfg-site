# Legacy Life Financial Group — Agent Portal
## Project Transfer Document

---

## PROJECT OVERVIEW

**Client:** Legacy Life Financial Group (LLFG)  
**Domain:** llfg.us  
**Repo:** LegacyLifeFinancial/llfg-site (GitHub, `main` branch)  
**Hosting:** Netlify (connected to GitHub — deploy via pencil icon edit only, never drag-and-drop)  
**Email:** Google Workspace @llfg.us  
**Owner:** Lorenzo Parenza (lorenzoparenza@llfg.us)

The entire portal is a **single self-contained `index.html` file** (~659KB). No separate CSS, JS, or build process. The public-facing marketing site and the agent portal are both in this one file.

---

## ARCHITECTURE

### Portal Structure
- `#agentDash` — the main agent portal overlay (position:fixed, display:flex, flex-direction:column)
- `#adminDash` — admin-only dashboard overlay
- `#portalTabs` — dynamically built nav bar (populated at login by `_appLaunchPortal`)
- `ptab-{name}` divs — 17 tab content panes, all direct children of `#agentDash`

**CRITICAL:** All `ptab-` divs MUST be inside `#agentDash`. A recurring bug has been the agentDash `</div>` closing prematurely (after ptab-bizcard), orphaning Calendar, Messages, Data Collection, and all Management tabs outside the overlay — making them invisible. Always verify with a div balance check before deploying.

### Tab System
Nav buttons are built as: `<button onclick="showPortalTab('X', this)">Label</button>`

Three tabs are **dropdown parents** (never have their own ptab div):
- `mydeals` → opens sub-tabs from `MYDEALS_TABS[role]`
- `tools` → opens sub-tabs from `TOOLS_TABS[role]`
- `management` → opens sub-tabs from `MANAGEMENT_TABS[role]`

**Dropdown bug that was fixed:** The dropdown interceptor in `showPortalTab` must call `showPortalTab(subs[0], null, true)` BEFORE calling `openSubDropdown()` — otherwise the sub-tab's `closeAllDropdowns()` call destroys the menu immediately after creation.

---

## CREDENTIALS (all bypass 2FA)

| Email | Password | Role |
|---|---|---|
| lorenzoparenza@llfg.us | admin123 | Owner — full access |
| admin@llfg.us | admin123 | Admin |
| agent@llfg.us | agent123 | Financial Advisor (65%) |
| jaalyn@llfg.us | agent123 | Financial Advisor (65%) |
| manager@llfg.us | mgr123 | Manager (100%) |
| executive@llfg.us | exec123 | Executive (120%) |
| partner@llfg.us | partner123 | Managing Partner (140%) |

---

## ROLE HIERARCHY

| Role | Comm % | Monthly AP Req | Team Req |
|---|---|---|---|
| Financial Advisor | 65–90% | Personal production | — |
| Manager | 100–110% | $150K team AP | 3 teams of 4+ agents |
| Executive | 120–130% | $500K team AP | 3 Managers |
| Director | 135% | $1.5M team AP | 3 Executives |
| Managing Partner | 140–150% | $6M team AP | 3+ Directors |

### Commission Visibility Cap (can only see 2 tiers above own)
- Financial Advisor: up to 120%
- Manager: up to 135%
- Executive/Director/MP/Admin: up to 150%

### Role-Based Tab Access
**MYDEALS_TABS:**
- FA/Agent: deals, commissions
- Manager+: deals, commissions, teammetrics

**TOOLS_TABS:**
- FA/Agent: training, addagents, bizcard, portals
- Manager: + agentapprovals
- Executive+: + contracting, applications

**MANAGEMENT_TABS:**
- FA/Agent: commreq
- Manager: commreq, reports
- Executive: commreq, teammetrics, reports
- Director+: commreq, permissions, teammetrics, downlineclients, reports

---

## KEY FUNCTIONS

| Function | Purpose |
|---|---|
| `window._appLaunchPortal(user)` | Called after login. Builds nav tabs, calls buildPortalOverview, configureRoleUI, initMsgContacts |
| `showPortalTab(tab, el, isSubTab)` | Main tab router. Handles dropdown interception and content rendering |
| `openSubDropdown(parentEl, subTabs)` | Creates dropdown menu. Must be called AFTER showPortalTab(subs[0]) |
| `buildPortalOverview(user)` | Renders Overview tab content — role-aware cards and sections |
| `renderCommissionsTab()` | Commissions tab — role-gated org table (manager+ only), visibility cap |
| `renderTrainingCurriculum()` | Training tab — uses TRAINING_CURRICULUM data, role-locked sections |
| `configureRoleUI(user)` | Shows/hides UI elements based on role after login |
| `renderAgentApprovals()` | Team management tab — hierarchy chart, comp adjustment modal |
| `renderPortalCal()` | Calendar tab renderer |
| `updateEmailPreview()` | Data Collection tab — live email preview |
| `initReportsTab()` / `renderReportSummary()` | Reports tab |
| `renderEmailTemplates()` | Email Templates tab |
| `adminViewAs(emailOrRole)` | Lorenzo/Admin can view portal as any role |

---

## BUSINESS CARD FEATURES
- 4 logo styles: Hexagon L (default), Shield, Diamond, Circle + Wordmark-only
- LLC/brand name field replaces "Legacy Life Financial Group" on card
- Photo upload → circular avatar on card front
- Card back: LLFG hexagon logo + carrier partners list
- Downloads: PDF, Apple Wallet (.vcf contact card), LinkedIn SVG export

---

## 2FA SYSTEM
- All @llfg.us accounts bypass 2FA (skipTwoFA array)
- 2FA via email uses Netlify functions: `/.netlify/functions/send-code` and `/.netlify/functions/verify-code`
- Works on live Netlify site; bypassed in local/test environments

---

## DEPLOYMENT WORKFLOW
1. GitHub → `index.html` → **pencil icon (edit)** → select all → paste new content → commit
2. **NEVER use drag-and-drop** (breaks Netlify's GitHub sync)
3. Wait ~30 seconds for Netlify to deploy
4. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

---

## CARRIER PARTNERS (33 carriers)
Mutual of Omaha, Transamerica, Corebridge Financial, Foresters Financial, Americo, Aetna, Aflac, MassMutual, Fidelity Life, Athene, Chubb, Lafayette Life, Banner Life, Columbus Life, Liberty Bankers Life, Baltimore Life, American Amicable, Ethos Life, GTL, United Home Life, InstaBrain, Trinity Life, SPLI Term, SPLI Senior Life, UHL, Royal Neighbors of America, Polish Falcons of America, American Home Life, Aetna Medicare Supp/Adv, Aflac Cancer/CI/Accident

---

## KNOWN RECURRING BUGS TO WATCH FOR

1. **agentDash closes prematurely** — if tabs after bizcard show blank, the `</div>` closing agentDash has drifted. Check div balance with: count `<div` vs `</div>` in the segment from `id="agentDash"` to `id="adminDash"`. Must be equal.

2. **Dropdown closes immediately** — always call `showPortalTab(subs[0], null, true)` BEFORE `openSubDropdown(el, subs)` in the dropdown interceptor. If order is reversed, `closeAllDropdowns()` inside `showPortalTab` kills the freshly created menu.

3. **Missing functions after large edits** — any time a large block (>10KB) is replaced, verify these functions still exist: `renderTrainingCurriculum`, `TRAINING_CURRICULUM`, `initReportsTab`, `renderReportSummary`, `renderCommissionsTab`, `renderEmailTemplates`.

4. **FA commission visibility** — FA should see their own commissions tab but NOT the org-wide commission table. The `orgCommSection` div must be gated with `isManagerPlus` check in `renderCommissionsTab`.

---

## SESSION TRANSCRIPTS
Previous build sessions are stored in `/mnt/transcripts/` with a journal index at `/mnt/transcripts/journal.txt`. These are session-specific and will not transfer to another Claude account — use this document + the index.html file as the complete project state.

---

*Document generated: April 4, 2026*  
*File: index.html (~659KB, ~10,844 lines)*
