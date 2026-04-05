Enrich CRM contact data with external sources. Auto-fill LinkedIn profiles, company info, social profiles via API lookups through Netlify Functions.

## What to Build
1. Enrichment trigger on new contact creation
2. LinkedIn profile lookup (via Proxycurl or similar API)
3. Company info from Clearbit/Apollo-style enrichment
4. Auto-fill fields: company, title, LinkedIn URL, photo
5. Enrichment status indicator per contact (enriched/pending/failed)
6. Batch enrichment for existing contacts

## Integration Points
- Data Enrichment agent (crm_enrich) manages API calls
- Netlify Function proxy for API keys
- CRM contacts display enriched data
