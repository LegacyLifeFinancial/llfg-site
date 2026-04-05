A/B test portal features in the LLFG portal: landing page variants, email subject lines, CTA buttons. Track conversion rates per variant using PostHog feature flags.

## What to Build
1. Test creation form (name, variants A/B, metric to track)
2. Traffic split configuration (50/50, 70/30, etc.)
3. Conversion tracking per variant
4. Statistical significance calculator
5. Auto-winner selection when confidence >95%
6. Test history with results archive

## Integration Points
- A/B Testing agent (mkt_abtest) manages active tests
- PostHog feature flags for variant assignment
- Analytics agents track conversion events
