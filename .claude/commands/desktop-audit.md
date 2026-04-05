Run a desktop/laptop enhancement audit on the LLFG portal.

## Checks
1. Widescreen: Content should have max-width constraints (1200-1400px) on ultra-wide displays
2. Keyboard navigation: Alt+1-9 for tab switching, Enter for form submit, Escape for modals
3. Hover states: All interactive elements must have visible hover feedback
4. Focus states: All focusable elements must have visible focus rings for accessibility
5. Performance: DOM nodes < 10000, memory < 200MB, no layout thrashing
6. Empty cards: No empty dashboard cards or sections
7. Animations: All use transform/opacity only (GPU-accelerated), no layout-triggering properties
8. Charts: Properly sized for desktop viewport

## Fix
Apply CSS and JS fixes directly. Ensure all changes are backward-compatible with mobile.

## Verify
Run /verify after all changes.
