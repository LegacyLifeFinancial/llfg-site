Manage inbound/outbound webhooks for the LLFG portal. Event triggers, payload mapping, retry logic, delivery logs via Netlify Functions.

## What to Build
1. Webhook configuration UI: URL, events to trigger, headers, auth
2. Inbound webhook endpoint (Netlify Function receives external events)
3. Outbound webhooks: fire on portal events (deal won, contact created, etc.)
4. Payload mapping: transform portal data to external format
5. Retry logic with exponential backoff
6. Delivery log with status, response code, latency

## Integration Points
- Webhook Manager agent (int_webhook) manages all hooks
- EventBus events trigger outbound webhooks
- n8n/Zapier receive outbound webhooks for automation
