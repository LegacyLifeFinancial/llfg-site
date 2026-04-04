Perform a comprehensive bug sweep of the LLFG portal (index.html). Go beyond the 4 known recurring bugs and look for code quality issues.

## 1. Known Recurring Bugs (Quick Check)
Rapidly verify the 4 known issues are not present:
- [ ] agentDash div balance correct
- [ ] Dropdown order: showPortalTab before openSubDropdown
- [ ] All critical functions exist
- [ ] FA commission visibility properly gated

## 2. HTML/CSS Issues
- Unclosed or mismatched HTML tags (beyond just divs — check spans, buttons, sections, etc.)
- Inline styles that conflict or override each other
- CSS rules that reference non-existent IDs or classes
- z-index stacking issues (overlays, modals, dropdowns)
- Responsive/mobile layout issues

## 3. JavaScript Issues
- Undefined variable references
- Functions called but never defined
- Event listeners attached to non-existent elements
- Memory leaks (event listeners never removed, intervals never cleared)
- Race conditions in async operations (2FA, data loading)
- Error handling gaps (missing try/catch around network calls)

## 4. Security Review
- Any hardcoded credentials beyond the documented test accounts
- XSS vulnerabilities (innerHTML with user input)
- Client-side role checks that could be bypassed
- Sensitive data exposed in localStorage
- API endpoints without proper validation

## 5. UX/Business Logic Issues
- Buttons or links that point to undefined functions
- Form submissions without validation
- Tab navigation edge cases (what happens if you click fast?)
- Role switching edge cases in adminViewAs
- Data that should persist but doesn't (or vice versa)

## 6. Performance
- Large inline data structures that could slow page load
- Redundant DOM queries
- Functions that rebuild the entire DOM when they could update selectively
- Images or assets loaded but not displayed

## Output
Categorize findings by severity:
- **CRITICAL:** Breaks functionality or security vulnerability
- **HIGH:** Significant UX issue or data integrity risk
- **MEDIUM:** Minor bug or inconsistency
- **LOW:** Code quality / optimization opportunity

Include line numbers and suggested fixes for each finding.
