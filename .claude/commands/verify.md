Verify the LLFG portal (index.html) is functional before and after any changes. This is a BLOCKING check — do not proceed with further coding until all checks pass.

## Run These Checks (ALL must pass)

### 1. HTML Structure
- Count `<script>` vs `</script>` tags (must match, excluding inline one-liners)
- Count `<div` vs `</div>` (must match)
- Count `<section` vs `</section>` (must match)
- Verify `<body>` and `</body>` exist
- Verify `</html>` exists at end of file

### 2. Critical Elements Exist
- `<nav>` element with logo and links
- `<section id="hero">` with video or image
- `<section id="about">`
- `<section id="carriers">`  
- `<section id="why">`
- `<section id="agency">`
- `<section id="apply">`
- `<footer>`
- `id="loginModal"` — the login modal
- `id="agentDash"` — agent portal
- `id="adminDash"` — admin dashboard
- `close agentDash` comment

### 3. Login System Works
- `LLFG_USERS` variable defined with at least 7 accounts
- `window.handleLogin` function defined
- `window.openLogin` function defined  
- `window.closeLogin` function defined
- `window.logout` function defined
- `loginEmail`, `loginPassword`, `loginError` element IDs referenced
- `_appLaunchPortal` function referenced in login flow
- `_saveSession` and `_loadSession` functions defined

### 4. Portal Functions Exist
- `renderTrainingCurriculum`
- `TRAINING_CURRICULUM`
- `initReportsTab`
- `renderReportSummary`
- `renderCommissionsTab`
- `renderEmailTemplates`
- `showPortalTab`
- `buildPortalOverview`
- `configureRoleUI`

### 5. Early Script Block
- Opens with `<script>` after `<body>`
- Closes with `</script>` before `<nav>`
- Contains: toggleSidebar, openLogin, closeLogin, handleLogin, LLFG_USERS, logout

### 6. Application Overlay
- `id="applicationOverlay"` element exists
- `openApplicationOverlay` function defined
- `closeApplicationOverlay` function defined
- `submitApplication` function defined
- `APP_TIERS` object defined with 5 tiers

### 7. Command Center
- `LLFG_Brain` defined
- `LLFG_EventBus` defined
- `renderCommandCenter` function defined
- `ptab-commandcenter` element exists

### 8. No JavaScript Syntax Errors
- Extract each `<script>...</script>` block
- Check for unclosed braces, brackets, or parentheses
- Check for stray HTML inside script blocks
- Check for stray script inside HTML blocks

## Output Format
```
PASS: [check name]
FAIL: [check name] — [details of what's wrong]
```

If ANY check fails, stop and fix it before proceeding. Report the total pass/fail count.