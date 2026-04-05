Build generic API connector for the LLFG portal. OAuth flow, webhook receiver, data mapping, sync scheduling via Netlify Functions.

## What to Build
1. Integration configuration UI (name, base URL, auth type, headers)
2. Auth types: API key, OAuth2, Bearer token
3. Endpoint mapper: map external API fields to CRM fields
4. Sync schedule: manual, hourly, daily
5. Webhook receiver endpoint (Netlify Function)
6. Sync log with success/failure/error details
7. Test connection button

## Integration Points
- Webhook Manager agent (int_webhook) handles inbound hooks
- Netlify Functions proxy all external API calls
- CRM data syncs bidirectionally
