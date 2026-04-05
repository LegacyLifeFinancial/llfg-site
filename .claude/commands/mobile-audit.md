Run a mobile compatibility audit on the LLFG portal. Check every visible element for mobile readiness.

## Checks
1. Touch targets: All buttons/links must be >= 36px
2. Horizontal overflow: No element should scroll horizontally on mobile
3. Font sizes: Nothing below 10px
4. Form inputs: All must be at least 16px font (prevents iOS zoom)
5. Modals: Must not exceed viewport width
6. Tables: Must be wrapped in overflow-x:auto containers
7. Images: Must have max-width:100%
8. Nav: Hamburger must be visible, desktop nav hidden
9. Cards: Must stack to single column below 480px
10. Stat ticker: Must scroll properly on small screens

## Fix
For each issue found, apply the CSS fix directly. Use @media (max-width: 768px) for tablet and @media (max-width: 480px) for phone.

## Verify
After fixes, check that desktop layout is not broken.
